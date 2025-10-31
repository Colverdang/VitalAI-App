# data-engineer/mysql_fastapi.py - UPDATED WITH FALLBACK ANALYTICS ONLY
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import mysql.connector
from mysql.connector import Error
from datetime import datetime
from contextlib import contextmanager

from config import DB_CONFIG, API_CONFIG

# Import fallback analytics
try:
    from analytics_fallback import analytics as fallback_analytics
    FALLBACK_ANALYTICS_AVAILABLE = True
    print("✅ Fallback Analytics: ENABLED")
except ImportError as e:
    FALLBACK_ANALYTICS_AVAILABLE = False
    print(f"⚠️  Fallback Analytics: DISABLED - {e}")

# MongoDB is disabled due to DNS issues
MONGODB_AVAILABLE = False
print("❌ MongoDB Analytics: DISABLED (DNS resolution failed)")

app = FastAPI(title=\"VitalAI Production API\", version=\"2.0.0\")

@contextmanager
def get_db_connection():
    conn = None
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        yield conn
    except Error as e:
        print(f\"Database connection error: {e}\")
        raise HTTPException(status_code=500, detail=f\"Database connection failed: {e}\")
    finally:
        if conn and conn.is_connected():
            conn.close()

class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    age: int
    gender: str
    contact_number: str
    language_preference: str = \"English\"
    id_number: Optional[str] = None
    passport_number: Optional[str] = None
    file_number: Optional[str] = None

class ChatMessage(BaseModel):
    patient_id: Optional[int] = None
    user_message: str

@app.get(\"/\")
async def root():
    return {
        \"message\": \"VitalAI Production API with MySQL\", 
        \"status\": \"running\", 
        \"database\": \"MySQL\",
        \"analytics\": \"fallback\" if FALLBACK_ANALYTICS_AVAILABLE else \"none\"
    }

@app.get(\"/analytics/status\")
async def analytics_status():
    \"\"\"Check analytics system status\"\"\"
    return {
        \"mongodb_available\": False,
        \"fallback_available\": FALLBACK_ANALYTICS_AVAILABLE,
        \"current_system\": \"fallback\" if FALLBACK_ANALYTICS_AVAILABLE else \"none\",
        \"message\": \"MongoDB disabled due to DNS issues. Using local analytics.\"
    }

@app.get(\"/analytics/summary\")
async def analytics_summary():
    \"\"\"Get analytics summary\"\"\"
    if FALLBACK_ANALYTICS_AVAILABLE:
        return fallback_analytics.get_analytics_summary()
    else:
        return {\"error\": \"Analytics not available\"}

@app.post(\"/patients/\")
async def create_patient(patient: PatientCreate):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            # Check which columns exist in the table
            cursor.execute(\"DESCRIBE patients\")
            existing_columns = [col[0] for col in cursor.fetchall()]
            
            # Build dynamic SQL based on available columns
            if 'full_name' in existing_columns:
                # If full_name column exists, we need to provide a value
                if all(col in existing_columns for col in ['id_number', 'passport_number', 'file_number']):
                    # All new columns exist including full_name
                    sql = '''
                        INSERT INTO patients (first_name, last_name, full_name, age, gender, contact_number, language_preference, id_number, passport_number, file_number)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    '''
                    full_name = f\"{patient.first_name} {patient.last_name}\"
                    values = (
                        patient.first_name, patient.last_name, full_name, patient.age, patient.gender,
                        patient.contact_number, patient.language_preference,
                        patient.id_number, patient.passport_number, patient.file_number
                    )
                else:
                    # Only basic columns exist including full_name
                    sql = '''
                        INSERT INTO patients (first_name, last_name, full_name, age, gender, contact_number, language_preference)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    '''
                    full_name = f\"{patient.first_name} {patient.last_name}\"
                    values = (
                        patient.first_name, patient.last_name, full_name, patient.age, patient.gender,
                        patient.contact_number, patient.language_preference
                    )
            else:
                # full_name column doesn't exist
                if all(col in existing_columns for col in ['id_number', 'passport_number', 'file_number']):
                    # All new columns exist except full_name
                    sql = '''
                        INSERT INTO patients (first_name, last_name, age, gender, contact_number, language_preference, id_number, passport_number, file_number)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    '''
                    values = (
                        patient.first_name, patient.last_name, patient.age, patient.gender,
                        patient.contact_number, patient.language_preference,
                        patient.id_number, patient.passport_number, patient.file_number
                    )
                else:
                    # Only basic columns exist (no full_name, no new columns)
                    sql = '''
                        INSERT INTO patients (first_name, last_name, age, gender, contact_number, language_preference)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    '''
                    values = (
                        patient.first_name, patient.last_name, patient.age, patient.gender,
                        patient.contact_number, patient.language_preference
                    )
            
            cursor.execute(sql, values)
            patient_id = cursor.lastrowid
            conn.commit()
            
            # TRACK ANALYTICS - Use fallback system
            analytics_data = {
                'patient_id': patient_id,
                'first_name': patient.first_name,
                'last_name': patient.last_name,
                'age': patient.age,
                'gender': patient.gender,
                'contact_number': patient.contact_number,
                'timestamp': datetime.now().isoformat()
            }
            
            if FALLBACK_ANALYTICS_AVAILABLE:
                fallback_analytics.track_patient_created(analytics_data)
            
            return {
                \"message\": \"Patient created successfully in MySQL\",
                \"patient_id\": patient_id,
                \"patient_name\": f\"{patient.first_name} {patient.last_name}\",
                \"database\": \"MySQL\",
                \"analytics_tracked\": FALLBACK_ANALYTICS_AVAILABLE,
                \"analytics_type\": \"local_fallback\"
            }
            
        except Error as e:
            conn.rollback()
            print(f\"Database error: {e}\")
            raise HTTPException(status_code=500, detail=f\"Database error: {e}\")

@app.post(\"/chat/\")
async def chat_with_bot(chat: ChatMessage):
    # Simple chatbot logic
    user_message = chat.user_message.lower()
    
    if \"appointment\" in user_message:
        response = \"I can help you schedule an appointment. What department do you need?\"
        department = \"General Medicine\"
    elif \"symptom\" in user_message or \"pain\" in user_message:
        response = \"I can help with symptom assessment. Please describe your symptoms.\"
        department = \"Triage\"
    else:
        response = \"I'm here to help with appointments, symptoms, and hospital information.\"
        department = \"General Medicine\"
    
    # Track chat analytics
    if FALLBACK_ANALYTICS_AVAILABLE:
        chat_data = {
            'patient_id': chat.patient_id,
            'user_message': chat.user_message,
            'bot_response': response,
            'department_suggested': department,
            'timestamp': datetime.now().isoformat()
        }
        fallback_analytics.track_chat_session(chat_data)
    
    return {
        \"bot_response\": response,
        \"suggested_department\": department,
        \"timestamp\": datetime.now().isoformat(),
        \"analytics_tracked\": FALLBACK_ANALYTICS_AVAILABLE
    }

if __name__ == \"__main__\":
    import uvicorn
    print(\"🚀 Starting VitalAI Production API with MySQL...\")
    print(\"📊 Analytics System: Fallback (MongoDB DNS issues)\")
    uvicorn.run(app, host=API_CONFIG['host'], port=API_CONFIG['port'])
