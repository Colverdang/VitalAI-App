# test_config.py
try:
    from config import DB_CONFIG, MONGO_CONFIG, API_CONFIG
    print('✅ Config import successful!')
    print(f"   MySQL: {DB_CONFIG['database']}")
    print(f"   MongoDB: {MONGO_CONFIG['database']}")
    print(f"   API: {API_CONFIG['host']}:{API_CONFIG['port']}")
except ImportError as e:
    print(f'❌ Config import failed: {e}')
