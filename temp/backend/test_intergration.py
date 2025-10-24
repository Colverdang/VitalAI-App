import asyncio
import aiosqlite
from app.config import get_settings

async def test_backend():
    settings = get_settings()
    
    # Test database connection
    try:
        async with aiosqlite.connect(settings.sqlite_path) as db:
            print("✅ Database connection successful")
            
            # Check if users table exists
            async with db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'") as cur:
                table = await cur.fetchone()
                if table:
                    print("✅ Users table exists")
                else:
                    print("❌ Users table missing")
                    
    except Exception as e:
        print(f"❌ Database error: {e}")

if __name__ == "__main__":
    asyncio.run(test_backend())