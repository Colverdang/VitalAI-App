"""Simple health check route"""

from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "message": "VitalAI API is running",
        "timestamp": datetime.utcnow().isoformat(),
        "endpoint": "/api/health"
    }