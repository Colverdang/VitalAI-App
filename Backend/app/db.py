# app/db.py
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models import Base
from app.config import get_settings

settings = get_settings()

def create_database_engine():
    """Create database engine with proper configuration"""
    try:
        if settings.is_mysql:
            # MySQL configuration using PyMySQL
            # Ensure your DATABASE_URL starts with: 'mysql+pymysql://user:password@host/dbname'
            engine = create_engine(
                settings.database_url,
                echo=True,
                future=True,
                pool_size=settings.database_pool_size,
                max_overflow=settings.database_max_overflow,
                pool_pre_ping=True
            )
            # Test MySQL connection
            with engine.connect() as conn:
                result = conn.execute(text("SELECT 1"))
                print(f"✅ Connected to MySQL database - Test result: {result.fetchone()[0]}")
        else:
            # SQLite configuration
            engine = create_engine(
                settings.database_url,
                echo=True,
                future=True,
                connect_args={"check_same_thread": False}
            )
            print("✅ Using SQLite database")
        
        return engine
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        # Fallback to SQLite
        print("🔄 Falling back to SQLite...")
        return create_engine(
            settings.sqlite_url,
            echo=True,
            future=True,
            connect_args={"check_same_thread": False}
        )

# Create engine and session
engine = create_database_engine()
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, expire_on_commit=False)

def init_db():
    """Initialize database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
        
        # Verify tables were created
        if settings.is_mysql:
            query = "SHOW TABLES"
        else:
            query = "SELECT name FROM sqlite_master WHERE type='table';"
        with engine.connect() as conn:
            result = conn.execute(text(query))
            tables = result.fetchall()
            print(f"📊 Found {len(tables)} tables in database")
            for table in tables:
                print(f"   - {table[0]}")
                
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")

def get_db():
    """Database dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
