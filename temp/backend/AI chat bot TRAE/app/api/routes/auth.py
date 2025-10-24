# backend/AI chat bot TRAE/app/api/routes/auth.py - UPDATED
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
import re

from app.db import get_db
from app.security import create_access_token, verify_password, get_password_hash, get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse

router = APIRouter()

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user with identifier-based authentication
    """
    # Check if identifier already exists
    existing_user = db.query(User).filter(User.identifier == user_data.identifier).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Identifier already registered"
        )
    
    # Validate identifier based on type
    if user_data.identifier_type == 'id':
        # South African ID validation (13 digits)
        if not re.match(r'^\d{13}$', user_data.identifier):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid South African ID number. Must be 13 digits."
            )
    elif user_data.identifier_type == 'passport':
        # Basic passport validation (alphanumeric, 6-9 chars)
        if not re.match(r'^[A-Z0-9]{6,9}$', user_data.identifier):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid passport number format"
            )
    elif user_data.identifier_type == 'file':
        # File number validation (hospital specific)
        if not re.match(r'^[A-Z0-9]{4,20}$', user_data.identifier):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file number format"
            )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    
    db_user = User(
        identifier=user_data.identifier,
        identifier_type=user_data.identifier_type,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        phone=user_data.phone,
        hashed_password=hashed_password,
        role=user_data.role or 'patient',
        language=user_data.language or 'en',
        email=user_data.email  # Optional, can be None for patients
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {
        "message": "User registered successfully", 
        "user_id": db_user.id
    }

@router.post("/login", response_model=dict)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login with identifier and password
    """
    # Find user by identifier
    user = db.query(User).filter(User.identifier == login_data.identifier).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid identifier or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.identifier})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "identifier": user.identifier,
            "identifier_type": user.identifier_type,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.phone,
            "email": user.email,
            "role": user.role,
            "language": user.language
        }
    }

@router.get("/me", response_model=dict)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get current user profile
    """
    return {
        "id": current_user.id,
        "identifier": current_user.identifier,
        "identifier_type": current_user.identifier_type,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "phone": current_user.phone,
        "email": current_user.email,
        "role": current_user.role,
        "language": current_user.language,
        "is_active": current_user.is_active
    }

@router.get("/users", response_model=list)
async def list_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all users (admin only)
    """
    if current_user.role != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    users = db.query(User).offset(skip).limit(limit).all()
    return users