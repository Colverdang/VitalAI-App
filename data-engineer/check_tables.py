# check_tables.py
import mysql.connector
from backend.config import get_settings

settings = get_settings()

def check_database_tables():
    try:
        conn = mysql.connector.connect(
            host=settings.mysql_url.split(":")[1].replace("//","") if settings.mysql_url else "localhost",
            user="vitalai_admin",
            password="B1tbyB1t.v1t@l.123",
            database="vitalai_prod"
        )
        
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        print("📊 Existing tables in vitalai_prod:")
        for table in tables:
            print(f"   ✅ {table[0]}")
        
        required_tables = ['patients', 'symptoms', 'chat_sessions', 'appointments']
        missing_tables = [t for t in required_tables if t not in [table[0] for table in tables]]
        
        if missing_tables:
            print(f"\n🚨 Missing {len(missing_tables)} tables. Creating them now...")
            create_missing_tables(missing_tables, conn)
        else:
            print("\n🎉 All required tables exist!")

        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

def create_missing_tables(missing_tables, conn):
    cursor = conn.cursor()
    
    table_sql = {
        'chat_sessions': """
            CREATE TABLE chat_sessions (
                session_id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT,
                user_message TEXT,
                bot_response TEXT,
                department_suggested VARCHAR(100),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE SET NULL
            )
        """,
        'appointments': """
            CREATE TABLE appointments (
                appointment_id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                department VARCHAR(100),
                appointment_date DATE,
                appointment_time TIME,
                status ENUM('Scheduled','Cancelled','Completed') DEFAULT 'Scheduled',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
            )
        """
    }
    
    for table in missing_tables:
        if table in table_sql:
            try:
                cursor.execute(table_sql[table])
                print(f"✅ Created table: {table}")
            except Exception as e:
                print(f"❌ Failed to create {table}: {e}")
    
    conn.commit()
    cursor.close()

if __name__ == "__main__":
    check_database_tables()
