import React, { useState, useEffect } from 'react';
import { Video, Mic, Share2, PhoneOff, MessageSquare, ShieldCheck, User, Stethoscope, Clock, Shield } from 'lucide-react';

const Telehealth = () => {
    const [isCalling, setIsCalling] = useState(false);
    const [callConnected, setCallConnected] = useState(false);
    const [timeInCall, setTimeInCall] = useState(0);

    useEffect(() => {
        let interval;
        if (callConnected) {
            interval = setInterval(() => setTimeInCall(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [callConnected]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startCall = () => {
        setIsCalling(true);
        setTimeout(() => {
            setIsCalling(false);
            setCallConnected(true);
        }, 3000);
    };

    const endCall = () => {
        setCallConnected(false);
        setTimeInCall(0);
    };

    if (callConnected) {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#0a0a0a', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    {/* Remote Doctor Feed */}
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ textAlign: 'center' }}>
                           <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-neon-blue), var(--accent-neon-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', border: '4px solid rgba(255,255,255,0.1)', animation: 'pulse 2s infinite' }}>
                              <Stethoscope size={64} color="#fff" />
                           </div>
                           <h2 style={{ color: '#fff', margin: 0 }}>Dr. Nexa AI</h2>
                           <p style={{ color: 'var(--accent-neon-blue)', fontSize: '0.9rem', marginTop: '4px' }}>AI Medical Consultant (Active)</p>
                        </div>
                    </div>

                    {/* Local User Feed */}
                    <div style={{ position: 'absolute', bottom: '100px', right: '40px', width: '240px', height: '180px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <User size={48} color="rgba(255,255,255,0.3)" />
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>Your Camera</div>
                        </div>
                    </div>

                    {/* Stats Overlay */}
                    <div style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', gap: '20px' }}>
                        <div className="glass-panel" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
                            <Clock size={18} color="var(--accent-neon-blue)" />
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{formatTime(timeInCall)}</span>
                        </div>
                         <div className="glass-panel" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-neon-teal)', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
                            <ShieldCheck size={18} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Encrypted Session</span>
                        </div>
                    </div>
                </div>

                {/* Call Controls */}
                <div style={{ height: '120px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mic size={24} /></button>
                    <button onClick={endCall} style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--accent-red)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)' }}><PhoneOff size={32} /></button>
                    <button style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Share2 size={24} /></button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                   <h1 className="heading-gradient" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Video color="var(--accent-neon-purple)" size={32} />
                        Telehealth Virtual Care
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Connect instantly with Dr. Nexa, our specialized AI triage physician.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-neon-teal)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <Shield size={16} /> 256-bit Secure
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(167, 139, 250, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                         <Stethoscope size={48} color="var(--accent-neon-purple)" />
                    </div>
                    <h2>Instant Consult</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.6' }}>
                        Request a real-time AI consultation for minor symptoms, medication triage, or visual health reviews.
                    </p>
                    <button onClick={startCall} className="btn-neon" disabled={isCalling} style={{ width: '100%', padding: '16px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'linear-gradient(90deg, var(--accent-neon-purple), var(--accent-neon-blue))' }}>
                        {isCalling ? "Initializing..." : <><Video size={24} /> REQUEST CALL</>}
                    </button>
                    <div style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Current Wait Time: <strong>&lt; 1 minute</strong>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-neon-blue)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                             <Clock size={18} color="var(--accent-neon-blue)" /> Service Features
                        </h4>
                        <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>■ Instant symptom triage</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>■ AI face and skin analysis review</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>■ Digital prescription (simulated) </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>■ Secure, private consultation logs</li>
                        </ul>
                    </div>

                    <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-neon-teal)' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                             <MessageSquare size={18} color="var(--accent-neon-teal)" /> Health Bot Chat
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Prefer to chat? Connect with our text physician any time.</p>
                        <button className="btn-outline" style={{ width: '100%', padding: '10px' }}>START CHAT</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Telehealth;
