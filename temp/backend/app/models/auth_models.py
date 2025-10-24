from pydantic import BaseModel
from typing import Optional

class PatientLogin(BaseModel):
    id_number: Optional[str] = None
    passport_number: Optional[str] = None
    file_number: Optional[str] = None
    password: str

class PatientResponse(BaseModel):
    patient_id: str
    full_name: str
    id_number: Optional[str]
    passport_number: Optional[str]
    file_number: str
    email: Optional[str]