# analytics_fallback.py
import sys
import os
import json
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

class AnalyticsFallback:
    def __init__(self):
        self.analytics_file = "local_analytics.json"
        self.analytics_data = self.load_analytics()
    
    def load_analytics(self):
        try:
            with open(self.analytics_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                'patients_created': [],
                'chat_sessions': [],
                'system_events': [],
                'start_time': datetime.now().isoformat(),
                'total_patients': 0,
                'total_chats': 0
            }
    
    def save_analytics(self):
        with open(self.analytics_file, 'w') as f:
            json.dump(self.analytics_data, f, indent=2)
    
    def track_patient_created(self, patient_data):
        event = {
            'event_type': 'patient_created',
            'timestamp': datetime.now().isoformat(),
            'data': patient_data
        }
        self.analytics_data['patients_created'].append(event)
        self.analytics_data['total_patients'] = len(self.analytics_data['patients_created'])
        self.save_analytics()
        print(f"✅ Local analytics tracked for patient {patient_data.get('patient_id', 'unknown')}")
    
    def track_chat_session(self, chat_data):
        event = {
            'event_type': 'chat_session',
            'timestamp': datetime.now().isoformat(),
            'data': chat_data
        }
        self.analytics_data['chat_sessions'].append(event)
        self.analytics_data['total_chats'] = len(self.analytics_data['chat_sessions'])
        self.save_analytics()
        print(f"✅ Chat session tracked: {chat_data.get('user_message', '')[:50]}...")
    
    def track_system_event(self, event_type, data):
        event = {
            'event_type': event_type,
            'timestamp': datetime.now().isoformat(),
            'data': data
        }
        self.analytics_data['system_events'].append(event)
        self.save_analytics()
        print(f"✅ System event tracked: {event_type}")
    
    def get_analytics_summary(self):
        return {
            'total_patients': self.analytics_data['total_patients'],
            'total_chats': self.analytics_data['total_chats'],
            'system_uptime': datetime.now().isoformat(),
            'data_source': 'local_fallback',
            'patients_created_today': len([p for p in self.analytics_data['patients_created'] 
                                         if p['timestamp'].startswith(datetime.now().strftime('%Y-%m-%d'))])
        }
    
    def get_patient_analytics(self):
        return {
            'patient_registrations': self.analytics_data['patients_created'],
            'summary': self.get_analytics_summary()
        }

# Global analytics instance
analytics = AnalyticsFallback()

if __name__ == '__main__':
    print("🧪 Testing Fallback Analytics System...")
    
    # Test tracking
    test_data = {
        'patient_id': 999,
        'first_name': 'Test',
        'last_name': 'User',
        'age': 30,
        'gender': 'Other'
    }
    
    analytics.track_patient_created(test_data)
    
    # Get summary
    summary = analytics.get_analytics_summary()
    print(f"📊 Analytics Summary: {summary}")
    
    print("✅ Fallback analytics system is working!")
