# test_database_direct.py
import mysql.connector
from config import DB_CONFIG

def test_patient_creation():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("🧪 Testing direct patient creation...")
        
        # Check table structure
        cursor.execute("DESCRIBE patients")
        columns = [col[0] for col in cursor.fetchall()]
        print(f"Table columns: {columns}")
        
        # Try to insert a patient
        sql = '''
            INSERT INTO patients (first_name, last_name, age, gender, contact_number, language_preference)
            VALUES (%s, %s, %s, %s, %s, %s)
        '''
        values = ('John', 'Smith', 35, 'Male', '+1234567890', 'English')
        
        cursor.execute(sql, values)
        patient_id = cursor.lastrowid
        conn.commit()
        
        print(f"✅ Patient created successfully with ID: {patient_id}")
        
        # Verify the patient was inserted
        cursor.execute("SELECT * FROM patients WHERE patient_id = %s", (patient_id,))
        patient = cursor.fetchone()
        print(f"✅ Retrieved patient: {patient}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

if __name__ == '__main__':
    test_patient_creation()
