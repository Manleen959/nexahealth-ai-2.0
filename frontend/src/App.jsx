import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FaceScan from './pages/FaceScan';
import SymptomChecker from './pages/SymptomChecker';
import Insights from './pages/Insights';
import EmergencyServices from './pages/EmergencyServices';
import MedicationTracker from './pages/MedicationTracker';
import NutriScan from './pages/NutriScan';
import { Activity, Bell, CheckCircle, Ambulance, Pill, Utensils } from 'lucide-react';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user && !localStorage.getItem('token')) {
        return <Navigate to="/login" />;
    }
    return children;
};

const MedicalID = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
            <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', border: '2px solid var(--accent-red)', position: 'relative' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                    <div className="pulse-emergency" style={{ background: 'var(--accent-red)', padding: '12px', borderRadius: '50%' }}>
                        <Activity color="#fff" size={32} />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '2px' }}>Medical ID Card</h2>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>FOR FIRST RESPONDERS EXCLUSIVE ACCESS</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Full Name</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Manleen Singh</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Blood Group</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-red)' }}>B+ Positive</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Allergies & Reactions</div>
                        <div style={{ fontSize: '1rem', color: '#fb923c' }}>Penicillin, Peanuts (Severe Hypersensitivity)</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Emergency Contacts</div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', marginTop: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Father (Home)</span>
                                <strong style={{color: 'var(--accent-neon-blue)'}}>+91 98765 43210</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Dr. Khanna (PCP)</span>
                                <strong style={{color: 'var(--accent-neon-blue)'}}>+91 161 468 7700</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={onClose} className="btn-neon" style={{ width: '100%', marginTop: '30px', background: 'rgba(255,255,255,0.1)' }}>DISMISS</button>
            </div>
        </div>
    );
};

const Navigation = () => {
    const { user, logout, API_URL } = useAuth();
    const [showNotifs, setShowNotifs] = React.useState(false);
    const [showMedicalID, setShowMedicalID] = React.useState(false);
    const [reminders, setReminders] = React.useState([
        { id: 1, text: "Wait 30 mins after eating before exercise." },
        { id: 2, text: "Remember to drink water!" }
    ]);
    
    React.useEffect(() => {
        if(user) {
            axios.get(`${API_URL}/ai/exercises`).then(res => {
                if(res.data && res.data.length > 0) {
                    const dynamicReminders = res.data.map((ex, i) => ({
                        id: 10 + i,
                        text: `Time for your ${ex.duration} ${ex.name} session.`
                    }));
                    setReminders([{ id: 1, text: "Don't forget your daily symptom check!" }, ...dynamicReminders]);
                }
            }).catch(()=>{});
        }
    }, [user]);

    if (!user) return null;
    
    return (
        <nav className="nav" style={{ position: 'relative' }}>
            <MedicalID isOpen={showMedicalID} onClose={() => setShowMedicalID(false)} />
            <Link to="/" className="logo heading-gradient" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <Activity size={28} />
                NexaHealth AI
            </Link>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/">Dashboard</Link>
                <Link to="/facescan">Face Scan</Link>
                <Link to="/symptoms">Symptoms</Link>
                <Link to="/insights">Insights</Link>
                <Link to="/nutri" style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Utensils size={16} /> NutriScan</Link>
                <Link to="/emergency" className="pulse-emergency" style={{color: 'var(--accent-red)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '30px', padding: '8px 16px', background: 'rgba(239, 68, 68, 0.1)'}}>
                    <Ambulance size={18} /> EMERGENCY
                </Link>
                
                <div style={{ position: 'relative', display: 'flex', gap: '15px' }}>
                    <button onClick={() => setShowMedicalID(true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', padding: '8px', borderRadius: '12px', color: 'var(--accent-red)' }} title="Medical ID">
                        <Activity size={24} />
                    </button>
                    
                    <button onClick={() => setShowNotifs(!showNotifs)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', position: 'relative', color: 'var(--text-secondary)' }}>
                        <Bell size={24} />
                        <span style={{ position:'absolute', top:'-4px', right:'-4px', background:'var(--accent-neon-purple)', color:'#fff', minWidth:'16px', height:'16px', borderRadius:'50%', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold' }}>{reminders.length}</span>
                    </button>
                    {showNotifs && (
                        <div className="glass-panel" style={{ position: 'absolute', top: '40px', right: '0', width: '300px', padding: '16px', zIndex: 100, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,15,30,0.95)' }}>
                            <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Reminders</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {reminders.map(r => (
                                    <div key={r.id} style={{ fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
                                        <CheckCircle size={16} color="var(--accent-neon-blue)" style={{marginTop: '2px', flexShrink: 0}}/>
                                        <span>{r.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={logout} className="btn-outline" style={{padding: '6px 16px', marginLeft: '10px'}}>Logout</button>
            </div>
        </nav>
    );
}

function App() {
  return (
    <Router>
        <div className="container">
            <Navigation />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/facescan" element={<ProtectedRoute><FaceScan /></ProtectedRoute>} />
                <Route path="/symptoms" element={<ProtectedRoute><SymptomChecker /></ProtectedRoute>} />
                <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
                <Route path="/emergency" element={<ProtectedRoute><EmergencyServices /></ProtectedRoute>} />
                <Route path="/meds" element={<ProtectedRoute><MedicationTracker /></ProtectedRoute>} />
                <Route path="/nutri" element={<ProtectedRoute><NutriScan /></ProtectedRoute>} />
                <Route path="/dashboard" element={<Navigate to="/" />} />
            </Routes>
        </div>
    </Router>
  );
}

export default App;
