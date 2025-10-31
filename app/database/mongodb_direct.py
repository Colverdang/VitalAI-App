# app/database/mongodb_direct.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from pymongo import MongoClient
from config import MONGO_CONFIG

def test_direct_connection():
    try:
        # Try without SRV record
        connection_string = MONGO_CONFIG['connection_string'].replace('mongodb+srv://', 'mongodb://')
        # Add standard port
        connection_string += ':27017'
        
        client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print('✅ Connected to MongoDB with direct connection')
        return True
    except Exception as e:
        print(f'❌ Direct connection also failed: {e}')
        return False

if __name__ == '__main__':
    test_direct_connection()
