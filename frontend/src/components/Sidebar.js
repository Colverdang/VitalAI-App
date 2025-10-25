// src/components/Sidebar.js
import {
    User, Calendar, FileText, MessageCircle, History, Settings, LogOut,
    Stethoscope, X, Pill, Phone
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({
    isOpen,
    onClose,
    user,
    activeTab,
    onTabChange,
    onLogout,
    onBackHome,
    userType = 'patient'
}) => {
    const isGuest = !user;

    const sidebarItems = {
        patient: [
            { id: 'chat', label: 'Chat with VitalAI', icon: MessageCircle },
            { id: 'dashboard', label: 'Dashboard', icon: User },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'medical-history', label: 'Medical History', icon: History },
            { id: 'prescriptions', label: 'Prescriptions', icon: Pill }
        ],
        guest: [
            { id: 'chat', label: 'Chat with VitalAI', icon: MessageCircle },
            { id: 'login', label: 'Login / Register', icon: User, highlight: true }
        ],
        staff: [
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'patients', label: 'Patients', icon: User },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'reports', label: 'Reports', icon: FileText }
        ],
        admin: [
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'patients', label: 'Patients', icon: User },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'chats', label: 'Chat Sessions', icon: MessageCircle },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings }
        ]
    };

    const currentUserType = isGuest ? 'guest' : userType;
    const items = sidebarItems[currentUserType] || sidebarItems.patient;

    const userDisplayData = user || {
        name: "Guest User",
        id: "GUEST-001",
        email: "guest@example.com"
    };

    const handleItemClick = (itemId) => {
        if (itemId === 'login' && onTabChange) {
            window.location.href = '/login';
        } else if (onTabChange) {
            onTabChange(itemId);
        }
        if (window.innerWidth <= 768) {
            onClose();
        }
    };

    const handleLogout = () => {
        if (onLogout) onLogout();
        if (onClose) onClose();
    };

    const handleEmergencyDial = () => {
        window.location.href = 'tel:10111';
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <Stethoscope size={24} />
                        <span>VitalAI {currentUserType.charAt(0).toUpperCase() + currentUserType.slice(1)}</span>
                    </div>
                    <button className="close-sidebar" onClick={onClose} aria-label="Close sidebar">
                        <X size={20} />
                    </button>
                </div>

                <div className="user-profile-section">
                    <div className="user-avatar">
                        <User size={32} />
                    </div>
                    <div className="user-info">
                        <h3>{userDisplayData.name}</h3>
                        <p>{isGuest ? 'Guest User' : `${currentUserType.charAt(0).toUpperCase() + currentUserType.slice(1)} • ${userDisplayData.id}`}</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
                            onClick={() => handleItemClick(item.id)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                            {item.highlight && <span className="nav-badge">New</span>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    {/* Emergency Dial Button */}
                    <button className="nav-item emergency" onClick={handleEmergencyDial}>
                        <Phone size={20} />
                        <span>Emergency 10111</span>
                    </button>

                    {/* Settings */}
                    <button className="nav-item">
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>

                    {!isGuest && (
                        <button className="nav-item logout" onClick={handleLogout}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    )}

                    {isGuest && onBackHome && (
                        <button className="nav-item" onClick={onBackHome}>
                            <X size={20} />
                            <span>Back to Home</span>
                        </button>
                    )}
                </div>
            </div>

            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
        </>
    );
};

export default Sidebar;