from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models.auth_models import PatientLogin, PatientResponse
from ..db.database import get_db

router = APIRouter()

@router.post("/patient-login", response_model=PatientResponse)
async def patient_login(login_data: PatientLogin, db: Session = Depends(get_db)):
    # Check by ID number
    if login_data.id_number:
        patient = db.execute(
            "SELECT * FROM patients WHERE id_number = :id_number",
            {"id_number": login_data.id_number}
        ).fetchone()
    
    # Check by passport number
    elif login_data.passport_number:
        patient = db.execute(
            "SELECT * FROM patients WHERE passport_number = :passport_number",
            {"passport_number": login_data.passport_number}
        ).fetchone()
    
    # Check by file number
    elif login_data.file_number:
        patient = db.execute(
            "SELECT * FROM patients WHERE file_number = :file_number",
            {"file_number": login_data.file_number}
        ).fetchone()
    
    else:
        raise HTTPException(status_code=400, detail="No valid identifier provided")
    
    if not patient:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # In real implementation, verify password hash
    # For now, we'll assume basic auth
    
    return PatientResponse(
        patient_id=patient.id,
        full_name=f"{patient.first_name} {patient.last_name}",
        id_number=patient.id_number,
        passport_number=patient.passport_number,
        file_number=patient.file_number,
        email=patient.email
    )