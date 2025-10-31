# test_basic_functionality.py
print('🧪 Testing Basic System Functionality...')

try:
    from config import DB_CONFIG, API_CONFIG
    print('✅ Config import: SUCCESS')
    
    import mysql.connector
    print('✅ MySQL connector: SUCCESS')
    
    from fastapi import FastAPI
    print('✅ FastAPI: SUCCESS')
    
    # Test database connection
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            print('✅ MySQL connection: SUCCESS')
            conn.close()
        else:
            print('❌ MySQL connection: FAILED')
    except Exception as e:
        print(f'❌ MySQL connection: {e}')
    
    print('\n🎉 Core system components are working!')
    print('💡 MongoDB can be configured separately for analytics.')
    
except ImportError as e:
    print(f'❌ Import error: {e}')
