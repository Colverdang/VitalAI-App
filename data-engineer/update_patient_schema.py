# update_patient_schema.py
import os

def update_setup_mysql():
    """Update setup_mysql.py with new schema"""
    file_path = 'data-engineer/setup_mysql.py'
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Replace the patients table creation
    old_patients_table = '''CREATE TABLE IF NOT EXISTS patients (
                    patient_id INT AUTO_INCREMENT PRIMARY KEY,
                    full_name VARCHAR(100) NOT NULL,
                    age INT,
                    gender ENUM('Male','Female','Other'),
                    contact_number VARBINARY(255),
                    language_preference VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )'''
    
    new_patients_table = '''CREATE TABLE IF NOT EXISTS patients (
                    patient_id INT AUTO_INCREMENT PRIMARY KEY,
                    first_name VARCHAR(50) NOT NULL,
                    last_name VARCHAR(50) NOT NULL,
                    id_number CHAR(13) UNIQUE,
                    passport_number CHAR(13) UNIQUE,
                    file_number CHAR(10) UNIQUE,
                    age INT,
                    gender ENUM('Male','Female','Other'),
                    contact_number VARCHAR(255),
                    language_preference VARCHAR(50) DEFAULT 'English',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_patient_name (first_name, last_name)
                )'''
    
    content = content.replace(old_patients_table, new_patients_table)
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print("✅ Updated setup_mysql.py")

def update_complete_database_setup():
    """Update complete_database_setup.py with new schema"""
    file_path = 'data-engineer/complete_database_setup.py'
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Replace the patients table creation
    old_patients_table = '''CREATE TABLE IF NOT EXISTS patients (
                patient_id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                age INT,
                gender ENUM('Male','Female','Other'),
                contact_number VARCHAR(255),
                language_preference VARCHAR(50) DEFAULT 'English',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_patient_name (full_name)
            )'''
    
    new_patients_table = '''CREATE TABLE IF NOT EXISTS patients (
                patient_id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                id_number CHAR(13) UNIQUE,
                passport_number CHAR(13) UNIQUE,
                file_number CHAR(10) UNIQUE,
                age INT,
                gender ENUM('Male','Female','Other'),
                contact_number VARCHAR(255),
                language_preference VARCHAR(50) DEFAULT 'English',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_patient_name (first_name, last_name),
                INDEX idx_id_number (id_number),
                INDEX idx_passport (passport_number),
                INDEX idx_file_number (file_number)
            )'''
    
    content = content.replace(old_patients_table, new_patients_table)
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print("✅ Updated complete_database_setup.py")

def update_mysql_fastapi():
    """Update mysql_fastapi.py with new models and endpoints"""
    file_path = 'data-engineer/mysql_fastapi.py'
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Update PatientCreate model
    old_patient_model = '''class PatientCreate(BaseModel):
    full_name: str
    age: int
    gender: str
    contact_number: str
    language_preference: str = "English"'''
    
    new_patient_model = '''class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    age: int
    gender: str
    contact_number: str
    language_preference: str = "English"
    id_number: Optional[str] = None
    passport_number: Optional[str] = None
    file_number: Optional[str] = None'''
    
    content = content.replace(old_patient_model, new_patient_model)
    
    # Update INSERT query
    old_insert = '''cursor.execute('''
                INSERT INTO patients (full_name, age, gender, contact_number, language_preference)
                VALUES (%s, %s, %s, %s, %s)
            ''', (patient.full_name, patient.age, patient.gender, patient.contact_number, patient.language_preference))'''
    
    new_insert = '''cursor.execute('''
                INSERT INTO patients (first_name, last_name, age, gender, contact_number, language_preference, id_number, passport_number, file_number)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (patient.first_name, patient.last_name, patient.age, patient.gender, patient.contact_number, patient.language_preference, patient.id_number, patient.passport_number, patient.file_number))'''
    
    content = content.replace(old_insert, new_insert)
    
    # Update return message
    content = content.replace('"patient_name": patient.full_name,', '"patient_name": f"{patient.first_name} {patient.last_name}",')
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print("✅ Updated mysql_fastapi.py")

if __name__ == "__main__":
    print("🔄 Updating patient schema across all files...")
    update_setup_mysql()
    update_complete_database_setup()
    update_mysql_fastapi()
    print("🎉 All files updated successfully!")
    print("\n📋 Next steps:")
    print("1. Run your database setup scripts again")
    print("2. Update any test files with new patient data structure")
    print("3. Test the API endpoints with the new schema")
