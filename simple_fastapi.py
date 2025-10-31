# simple_fastapi.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error
from contextlib import contextmanager

from config import DB_CONFIG

app = FastAPI(title="VitalAI Simple API", version="1.0.0")

@contextmanager
def get_db_connection():
    conn = None
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        yield conn
    except Error as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")
    finally:
        if conn and conn.is_connected():
            conn.close()

class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    age: int
    gender: str
    contact_number: str

@app.get("/")
async def root():
    return {"message": "VitalAI Simple API", "status": "running"}

@app.post("/patients/")
async def create_patient(patient: PatientCreate):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            # Simple insert without the new columns first
            cursor.execute('''
                INSERT INTO patients (first_name, last_name, age, gender, contact_number, language_preference)
                VALUES (%s, %s, %s, %s, %s, 'English')
            ''', (patient.first_name, patient.last_name, patient.age, patient.gender, patient.contact_number))
            
            patient_id = cursor.lastrowid
            conn.commit()
            
            return {
                "message": "Patient created successfully",
                "patient_id": patient_id,
                "patient_name": f"{patient.first_name} {patient.last_name}"
            }
            
        except Error as e:
            conn.rollback()
            print(f"Database error: {e}")
            raise HTTPException(status_code=500, detail=f"Database error: {e}")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting VitalAI Simple API...")
    uvicorn.run(app, host="0.0.0.0", port=8003)
