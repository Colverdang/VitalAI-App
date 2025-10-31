# config.py - VitalAI Environment Configuration

# Database Configuration (MySQL)
DB_CONFIG = {
    'host': 'localhost',
    'user': 'vitalai_admin',
    'password': 'B1tbyB1t.v1t@l.123',
    'database': 'vitalai_prod',
    'port': 3306
}

# MongoDB Configuration (Atlas) - FIXED with URL-encoded password
MONGO_CONFIG = {
    'connection_string': 'mongodb+srv://vitalai_admin:B1tbyB1t.v1t%40l.123@vitalai-healthcare.lahaumm.mongodb.net/?retryWrites=true&w=majority',
    'database': 'vitalai_analytics',
    'collections': {
        'chat_analytics': 'chat_analytics',
        'user_behavior': 'user_behavior',
        'chat_logs': 'chat_logs',
        'faq_responses': 'faq_responses',
        'feedback': 'feedback'
    }
}

# API Configuration
API_CONFIG = {
    'host': '0.0.0.0',
    'port': 8001,
    'debug': True,
    'cors_origins': ['http://localhost:3000']
}

# Security Configuration
SECURITY_CONFIG = {
    'jwt_secret': 'your-secret-key-here',
    'password_hashing_rounds': 12
}
