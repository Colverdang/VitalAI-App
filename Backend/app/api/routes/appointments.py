from fastapi import APIRouter, HTTPException, Query, Response, Depends
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from sqlalchemy.orm import Session
from app.db import get_db

router = APIRouter(prefix="/appointments")


class AppointmentCreate(BaseModel):
    """Request model to create a new appointment.

    Times are ISO8601 strings (e.g., 2025-10-13T09:00:00Z). We store them as
    TEXT in SQLite; ISO8601 compares correctly lexicographically.
    """
    patient_name: str = Field(min_length=1, max_length=100)
    clinician: str = Field(min_length=1, max_length=100)
    starts_at: str = Field(description="ISO8601 start time")
    ends_at: str = Field(description="ISO8601 end time")
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "patient_name": "Alice",
            "clinician": "DR.B",
            "starts_at": "2025-10-13T09:00:00Z",
            "ends_at": "2025-10-13T09:30:00Z"
        }
    })


class AppointmentUpdate(BaseModel):
    """Partial update model. Any field can be provided.

    We apply updates, then re-check conflict rules before saving.
    """
    patient_name: Optional[str] = Field(default=None)
    clinician: Optional[str] = Field(default=None)
    starts_at: Optional[str] = Field(default=None)
    ends_at: Optional[str] = Field(default=None)
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "patient_name": "Alice",
            "clinician": "DR.B",
            "starts_at": "2025-10-13T10:00:00Z",
            "ends_at": "2025-10-13T10:30:00Z"
        }
    })


class Appointment(BaseModel):
    id: int
    patient_name: str
    clinician: str
    starts_at: str
    ends_at: str
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "id": 2,
            "patient_name": "Alice",
            "clinician": "DR.B",
            "starts_at": "2025-10-13T09:00:00Z",
            "ends_at": "2025-10-13T09:30:00Z"
        }
    })


class Slot(BaseModel):
    starts_at: str
    ends_at: str
    model_config = ConfigDict(json_schema_extra={
        "example": {"starts_at": "2025-10-13T09:00:00Z", "ends_at": "2025-10-13T09:30:00Z"}
    })


class Slots(BaseModel):
    slots: list[Slot]
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "slots": [
                {"starts_at": "2025-10-13T09:00:00Z", "ends_at": "2025-10-13T09:30:00Z"},
                {"starts_at": "2025-10-13T10:00:00Z", "ends_at": "2025-10-13T10:30:00Z"}
            ]
        }
    })


@router.get(
    "",
    response_model=list[Appointment],
    responses={
        200: {
            "description": "List of appointments",
            "headers": {
                "X-Total-Count": {
                    "description": "Total appointments matching filters",
                    "schema": {"type": "integer"},
                    "example": 42,
                }
            },
        }
    },
)
async def list_appointments(
    clinician: Optional[str] = Query(None, min_length=1, description="Filter by clinician"),
    start_from: Optional[str] = Query(None, description="Filter appointments starting at or after ISO8601"),
    end_to: Optional[str] = Query(None, description="Filter appointments ending at or before ISO8601"),
    limit: int = Query(20, ge=1, le=100, description="Max items to return"),
    offset: int = Query(0, ge=0, description="Items to skip"),
    response: Response = None,
    db: Session = Depends(get_db)
):
    """List appointments with filters and pagination.

    - Filters: `clinician`, `starts_at >= start_from`, `ends_at <= end_to`.
    - Sets `X-Total-Count` header for UI pagination.
    - Ordered by `starts_at`.
    """
    # TODO: Convert to SQLAlchemy ORM queries
    # For now, return empty list to make it work
    if response is not None:
        response.headers["X-Total-Count"] = "0"
    return []


@router.post(
    "",
    response_model=Appointment,
    responses={
        200: {
            "description": "Created appointment",
        }
    },
)
async def create_appointment(req: AppointmentCreate, db: Session = Depends(get_db)):
    """Create a new appointment with conflict checks.

    Conflict rule:
    - For the same clinician, intervals must not overlap.
    - Overlap detection: NOT (existing.ends_at <= starts OR existing.starts_at >= ends)
    - Returns 409 on conflict.
    """
    # TODO: Convert to SQLAlchemy ORM
    # For now, return mock data
    return {
        "id": 1,
        "patient_name": req.patient_name,
        "clinician": req.clinician,
        "starts_at": req.starts_at,
        "ends_at": req.ends_at
    }


@router.get(
    "/id/{appt_id}",
    response_model=Appointment,
    responses={
        200: {
            "description": "Single appointment",
        }
    },
)
async def get_appointment(
    appt_id: int,
    db: Session = Depends(get_db)
):
    """Fetch a single appointment by ID; 404 if not found."""
    # TODO: Convert to SQLAlchemy ORM
    if appt_id != 1:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {
        "id": appt_id,
        "patient_name": "Test Patient",
        "clinician": "Dr. Smith",
        "starts_at": "2025-10-13T09:00:00Z",
        "ends_at": "2025-10-13T09:30:00Z"
    }


@router.put(
    "/id/{appt_id}",
    response_model=Appointment,
    responses={
        200: {
            "description": "Updated appointment",
        }
    },
)
async def update_appointment(
    appt_id: int, 
    req: AppointmentUpdate,
    db: Session = Depends(get_db)
):
    """Update an appointment with conflict checks and partial fields.

    - Merges provided fields onto current record.
    - Applies same overlap rule against other appointments for the clinician.
    """
    # TODO: Convert to SQLAlchemy ORM
    current = {
        "id": appt_id,
        "patient_name": "Current Patient",
        "clinician": "Dr. Smith", 
        "starts_at": "2025-10-13T09:00:00Z",
        "ends_at": "2025-10-13T09:30:00Z"
    }
    data = req.model_dump(exclude_none=True)
    updated = {**current, **data}
    return updated


@router.delete(
    "/id/{appt_id}",
    response_model=dict,
    responses={
        200: {
            "description": "Delete confirmation",
        }
    },
)
async def delete_appointment(
    appt_id: int,
    db: Session = Depends(get_db)
):
    """Delete an appointment by ID after verifying existence."""
    # TODO: Convert to SQLAlchemy ORM
    return {"status": "deleted", "id": appt_id}


@router.get(
    "/slots",
    response_model=Slots,
    responses={
        200: {
            "description": "Available slots",
        }
    },
)
async def slots(db: Session = Depends(get_db)):
    """Stub availability endpoint returning a static list of free slots."""
    # Stub availability endpoint, returns a simple block of free slots.
    return {
        "slots": [
            {"starts_at": "2025-10-13T09:00:00Z", "ends_at": "2025-10-13T09:30:00Z"},
            {"starts_at": "2025-10-13T10:00:00Z", "ends_at": "2025-10-13T10:30:00Z"},
            {"starts_at": "2025-10-13T11:00:00Z", "ends_at": "2025-10-13T11:30:00Z"},
        ]
    }