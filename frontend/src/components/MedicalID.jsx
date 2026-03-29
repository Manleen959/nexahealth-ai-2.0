import React from 'react';
import { X, ShieldCheck, Heart, Droplets, AlertCircle, Phone, User, Fingerprint } from 'lucide-react';

const MedicalID = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const medicalData = {
        name: "Manleen Singh",
        bloodGroup: "O+",
        allergies: ["Penicillin", "Peanuts", "Dust Mites"],
        medications: ["None"],
        conditions: ["Asthma (Mild)"],
        emergencyContact: {
            name: "Harjeet Singh",
            relation: "Father",
            phone: "+1 888 234 5678"
        },
        id: "NH-AI-9921-X"
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
            <div className="glass-panel" style={{ width: '90%', maxWidth: '450px', padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
                {/* Header-ID section */}
                <div style={{ background: 'linear-gradient(135deg, var(--accent-neon-blue), var(--accent-neon-purple))', padding: '24px', position: 'relative' }}>
                    <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
                            <User size={32} color="#fff" />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>{medicalData.name}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                                <ShieldCheck size={14} /> NexaHealth Verified
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ padding: '12px', background: 'rgba(255, 68, 68, 0.05)', border: '1px solid rgba(255, 68, 68, 0.2)', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-red)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                                <Droplets size={14} /> Blood Type
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{medicalData.bloodGroup}</div>
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(20, 184, 166, 0.05)', border: '1px solid rgba(20, 184, 166, 0.2)', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-neon-teal)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                                <Heart size={14} /> Health ID
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>{medicalData.id}</div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-neon-purple)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>
                            <AlertCircle size={16} /> Allergic Reactions
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {medicalData.allergies.map(all => (
                                <span key={all} style={{ padding: '6px 12px', background: 'rgba(167, 139, 250, 0.1)', color: 'var(--accent-neon-purple)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500' }}>
                                    {all}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-neon-blue)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>
                            <Phone size={16} /> Emergency Contact
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{medicalData.emergencyContact.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{medicalData.emergencyContact.relation}</div>
                            </div>
                            <a href={`tel:${medicalData.emergencyContact.phone}`} style={{ padding: '8px 16px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-neon-blue)', border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', textDecoration: 'none' }}>
                                CALL
                            </a>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '1px dashed rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px', width: '100%', opacity: 0.6 }}>
                           <Fingerprint size={48} color="rgba(255,255,255,0.3)" />
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scan QR in emergency (locked)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalID;
