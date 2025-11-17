import mysql.connector

try:
    conn = mysql.connector.connect(
        host='localhost',
        user='vitalai_admin',
        password='B1tbyB1t.v1t@l.123',
        database='vitalai_prod'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT DATABASE();")
    db_name = cursor.fetchone()
    print(f"✅ Connected to MySQL database: {db_name[0]}")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"❌ MySQL connection failed: {e}")
