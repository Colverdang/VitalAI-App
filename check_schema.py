# check_schema.py
import mysql.connector
from config import DB_CONFIG

try:
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    # Check patients table structure
    print("🔍 Checking patients table schema...")
    cursor.execute("DESCRIBE patients")
    columns = cursor.fetchall()
    
    print("Current patients table columns:")
    for column in columns:
        print(f"  {column[0]} - {column[1]}")
    
    # Check if we have the new columns
    current_columns = [col[0] for col in columns]
    required_columns = ['first_name', 'last_name', 'id_number', 'passport_number', 'file_number']
    
    print(f"\nRequired columns check:")
    for col in required_columns:
        if col in current_columns:
            print(f"  ✅ {col}")
        else:
            print(f"  ❌ {col} - MISSING")
    
    conn.close()
    
except Exception as e:
    print(f"Error checking schema: {e}")
