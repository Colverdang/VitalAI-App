# backend/AI chat bot TRAE/app/schemas/user.py
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
import re

class UserBase(BaseModel):
    identifier: str
    identifier_type: str  # 'id', 'passport', 'file'
    first_name: str
    last_name: str
    phone: str
    email: Optional[EmailStr] = None
    language: str = 'en'

class UserCreate(UserBase):
    password: str
    role: str = 'patient'
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v
    
    @validator('identifier_type')
    def validate_identifier_type(cls, v):
        if v not in ['id', 'passport', 'file']:
            raise ValueError('Identifier type must be id, passport, or file')
        return v

class UserLogin(BaseModel):
    identifier: str
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    
    class Config:
        from_attributes = True