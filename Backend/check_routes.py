# check_routes.py
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# Import all route modules to check their contents
try:
    from app.api.routes import auth, appointments, chat, faq, health
    print("✅ All route modules imported successfully")
    
    # Check what each router contains
    print("\n🔍 Checking route endpoints:")
    
    if hasattr(auth, 'router'):
        print(f"🔑 Auth routes: {len(auth.router.routes)} endpoints")
    
    if hasattr(appointments, 'router'):
        print(f"📅 Appointments routes: {len(appointments.router.routes)} endpoints")
        for route in appointments.router.routes:
            if hasattr(route, 'methods') and hasattr(route, 'path'):
                print(f"   - {list(route.methods)} {route.path}")
    
    if hasattr(chat, 'router'):
        print(f"💬 Chat routes: {len(chat.router.routes)} endpoints")
    
    if hasattr(faq, 'router'):
        print(f"❓ FAQ routes: {len(faq.router.routes)} endpoints")
    
    if hasattr(health, 'router'):
        print(f"🏥 Health routes: {len(health.router.routes)} endpoints")
        
except ImportError as e:
    print(f"❌ Import error: {e}")