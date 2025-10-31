# update_schema.py
import mysql.connector
from config import DB_CONFIG

def update_patients_table():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("🔄 Updating patients table schema...")
        
        # Check current structure
        cursor.execute("DESCRIBE patients")
        current_columns = [col[0] for col in cursor.fetchall()]
        
        # Add missing columns
        if 'first_name' not in current_columns:
            print("Adding first_name column...")
            cursor.execute("ALTER TABLE patients ADD COLUMN first_name VARCHAR(50) AFTER patient_id")
        
        if 'last_name' not in current_columns:
            print("Adding last_name column...")
            cursor.execute("ALTER TABLE patients ADD COLUMN last_name VARCHAR(50) AFTER first_name")
            
        if 'id_number' not in current_columns:
            print("Adding id_number column...")
            cursor.execute("ALTER TABLE patients ADD COLUMN id_number CHAR(13) UNIQUE AFTER last_name")
            
        if 'passport_number' not in current_columns:
            print("Adding passport_number column...")
            cursor.execute("ALTER TABLE patients ADD COLUMN passport_number CHAR(13) UNIQUE AFTER id_number")
            
        if 'file_number' not in current_columns:
            print("Adding file_number column...")
            cursor.execute("ALTER TABLE patients ADD COLUMN file_number CHAR(10) UNIQUE AFTER passport_number")
        
        # If full_name exists, we might need to migrate data or drop it
        if 'full_name' in current_columns:
            print("⚠️  full_name column still exists. Consider migrating data or dropping the column.")
        
        conn.commit()
        print("✅ Schema update completed!")
        
        # Verify the new structure
        cursor.execute("DESCRIBE patients")
        print("\nUpdated patients table columns:")
        for column in cursor.fetchall():
            print(f"  {column[0]} - {column[1]}")
            
        conn.close()
        
    except Exception as e:
        print(f"❌ Schema update failed: {e}")

if __name__ == "__main__":
    update_patients_table()
