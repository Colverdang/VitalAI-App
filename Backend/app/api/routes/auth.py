# app/api/routes/auth.py
import uuid
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from app.db import get_db  # Only import get_db from db.py
from app.models import User
from app.security import hash_password, verify_password, create_access_token

router = APIRouter()

# ----------------------------
# Pydantic Request Models
# ----------------------------
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str = Field(min_length=6)
    phone_number: str | None = None
    id_number: str | None = None
    file_number: str | None = None
    passport_number: str | None = None
    gender: str | None = None
    preferred_language: str | None = None
    date_of_birth: str | None = None
    medical_history: str | None = None
    emergency_contact: str | None = None
    address: str | None = None

class LoginRequest(BaseModel):
    identifier: str
    password: str = Field(min_length=6)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict | None = None

# ----------------------------
# Register Endpoint
# ----------------------------
@router.post("/register", response_model=TokenResponse)
def register_user(user: RegisterRequest, db: Session = Depends(get_db)):
    # Ensure at least one identifier
    if not (user.id_number or user.file_number or user.passport_number or user.email):
        raise HTTPException(status_code=400, detail="Provide ID number, file number, passport, or email.")

    # Check for existing user
    existing_user = db.query(User).filter(
        (User.email == user.email) |
        (User.id_number == user.id_number) |
        (User.file_number == user.file_number) |
        (User.passport_number == user.passport_number)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists with that identifier or email.")

    uid = str(uuid.uuid4())
    db_user = User(
        id=uid,
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        phone_number=user.phone_number,
        id_number=user.id_number,
        file_number=user.file_number,
        passport_number=user.passport_number,
        gender=user.gender,
        preferred_language=user.preferred_language,
        date_of_birth=user.date_of_birth,
        medical_history=user.medical_history,
        emergency_contact=user.emergency_contact,
        address=user.address,
        role="user"  # default role
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token(subject=uid, role="user")

    # Return safe user dict (exclude sensitive info)
    user_data = {
        "id": db_user.id,
        "name": db_user.name,
        "email": db_user.email,
        "phone_number": db_user.phone_number,
        "id_number": db_user.id_number,
        "file_number": db_user.file_number,
        "passport_number": db_user.passport_number,
        "gender": db_user.gender,
        "preferred_language": db_user.preferred_language,
        "date_of_birth": db_user.date_of_birth
    }

    return TokenResponse(access_token=token, user=user_data)

# ----------------------------
# Login Endpoint
# ----------------------------
@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    identifier = req.identifier.strip()

    # Query user by email, ID, file, or passport
    user = db.query(User).filter(
        (User.email == identifier) |
        (User.id_number == identifier) |
        (User.file_number == identifier) |
        (User.passport_number == identifier)
    ).first()

    if not user or not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(subject=user.id, role="user")

    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone_number": user.phone_number,
        "id_number": user.id_number,
        "file_number": user.file_number,
        "passport_number": user.passport_number,
        "gender": user.gender,
        "preferred_language": user.preferred_language,
        "date_of_birth": user.date_of_birth
    }

    return TokenResponse(access_token=token, user=user_data)