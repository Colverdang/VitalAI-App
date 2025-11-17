# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from datetime import datetime

from app.config import get_settings
from app.db import init_db, SessionLocal
from app.api.routes import auth, register_routes  # auth + centralized routes

# ----------------------------
# Settings
# ----------------------------
settings = get_settings()

# ----------------------------
# FastAPI App
# ----------------------------
app = FastAPI(title=settings.app_name)

# ----------------------------
# CORS Middleware
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Routers
# ----------------------------
# Auth routes with proper prefix
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

# Other centralized routes (appointments, chat, etc.)
register_routes(app)

# ----------------------------
# Logging
# ----------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

# ----------------------------
# Database Dependency
# ----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------------------
# Startup Event
# ----------------------------
@app.on_event("startup")
async def on_startup():
    print("🚀 Starting up VitalAI Backend...")
    print(f"📊 Using database: {'MySQL' if settings.is_mysql else 'SQLite'}")
    print(f"🔗 Database URL: {settings.database_url}")
    
    # Initialize database tables
    init_db()

# ----------------------------
# Health Check
# ----------------------------
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "env": settings.env,
        "database": "mysql" if settings.is_mysql else "sqlite",
        "timestamp": datetime.utcnow().isoformat()
    }

# ----------------------------
# Home / Info Endpoint
# ----------------------------
@app.get("/")
async def home():
    return {
        "name": settings.app_name,
        "env": settings.env,
        "status": "running",
        "database": "mysql" if settings.is_mysql else "sqlite",
        "docs_url": "/docs",
        "endpoints": {
            "auth": {
                "login": "POST /api/auth/login",
                "register": "POST /api/auth/register"
            },
            "appointments": "GET/POST /api/appointments",
            "chat": "POST /api/chat",
            "health": "GET /health"
        }
    }

# ----------------------------
# Run Uvicorn
# ----------------------------
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.debug
    )
