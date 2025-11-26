# app/api/routes/auth.py
import uuid
import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from app.db import get_db
from app.models import User
from app.security import hash_password, verify_password, create_access_token
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

# Configure logger for this module
logger = logging.getLogger("auth")
logger.setLevel(logging.INFO)

# ----------------------------
# Pydantic Models
# ----------------------------
class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str = Field(min_length=6)
    phone_number: str | None = None
    role: str | None = "patient"


class LoginRequest(BaseModel):
    identifier: str  # can be email, id_number, file_number, passport_number
    password: str

class LoginResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone_number: str | None
    role: str
    token: str



class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict | None = None


# ----------------------------
# Register Endpoint
# ----------------------------
@router.post("/register", response_model=TokenResponse)
def register_user(user: RegisterRequest, db: Session = Depends(get_db)):
    logger.info(f"Register endpoint reached for email: {user.email}")

    # Check existing user
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        logger.warning(f"Registration failed: user already exists for email {user.email}")
        raise HTTPException(status_code=400, detail="User already exists.")

    uid = str(uuid.uuid4())
    db_user = User(
        id=uid,
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password),
        phone_number=user.phone_number,
        role=user.role or "patient"
    )

    logger.info(f"Creating user {db_user.full_name} with ID {uid}")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.info(f"User {db_user.full_name} created successfully")

    token = create_access_token(subject=uid, role=db_user.role)
    logger.info(f"Token generated for user {db_user.email}")

    user_data = {
        "id": db_user.id,
        "full_name": db_user.full_name,
        "email": db_user.email,
        "phone_number": db_user.phone_number,
        "role": db_user.role
    }

    logger.info(f"Returning response for user {db_user.email}")
    return TokenResponse(access_token=token, user=user_data)


# ----------------------------
# Login Endpoint
# ----------------------------
@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    logging.info(f"🔐 Login attempt for identifier: {request.identifier}")

    # Query user by email, id_number, or passport_number
    user = db.query(User).filter(
        (User.email == request.identifier) |
        (User.id == request.identifier) |
        (User.phone_number == request.identifier)
    ).first()

    if not user:
        logging.warning(f"❌ User not found for identifier: {request.identifier}")
        raise HTTPException(status_code=401, detail="Invalid identifier or password" )

    # Verify password
    if not pwd_context.verify(request.password, user.password_hash):
        logging.warning(f"❌ Password mismatch for user: {user.full_name}")
        raise HTTPException(status_code=401, detail="Invalid identifier or password for " + user.full_name)

    logging.info(f"✅ Login successful for user: {user.full_name}")

    # Generate token (for now simple string, replace with JWT later)
    token = f"token-for-{user.id}"

    return LoginResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        role=user.role,
        token=token
    )
