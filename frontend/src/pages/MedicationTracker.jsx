import React, { useState } from 'react';
import { Pill, Clock, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const MedicationTracker = () => {
    const [meds, setMeds] = useState([
        { id: 1, name: "Paracetamol", dosage: "500mg", time: "08:00 AM", taken: true, frequency: "Twice a day" },
        { id: 2, name: "Amoxicillin", dosage: "250mg", time: "02:00 PM", taken: false, frequency: "Once a day" },
        { id: 3, name: "Vitamin D3", dosage: "1000 IU", time: "09:00 PM", taken: false, frequency: "Every night" }
    ]);

    const toggleTaken = (id) => {
        setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
    };

    const deleteMed = (id) => {
        setMeds(meds.filter(m => m.id !== id));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 className="heading-gradient" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Pill color="var(--accent-neon-blue)" size={32} />
                        Medication Tracker
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Log your prescriptions and never miss a dose.</p>
                </div>
                <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> Add Medication
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {meds.map(med => (
                    <div 
                        key={med.id} 
                        className="glass-panel" 
                        style={{ 
                            padding: '20px', 
                            borderLeft: `4px solid ${med.taken ? 'var(--accent-neon-teal)' : 'var(--accent-neon-blue)'}`,
                            opacity: med.taken ? 0.7 : 1,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', textDecoration: med.taken ? 'line-through' : 'none' }}>{med.name}</h3>
                                <div style={{ fontSize: '0.9rem', color: 'var(--accent-neon-blue)', fontWeight: 'bold' }}>{med.dosage}</div>
                            </div>
                            <button onClick={() => deleteMed(med.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }} className="hover-lift">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <Clock size={16} /> Scheduled: {med.time}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <AlertCircle size={16} /> Frequency: {med.frequency}
                            </div>
                        </div>

                        <button 
                            onClick={() => toggleTaken(med.id)}
                            style={{ 
                                marginTop: '20px', 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                background: med.taken ? 'rgba(0, 255, 170, 0.1)' : 'var(--accent-neon-blue)',
                                color: med.taken ? 'var(--accent-neon-teal)' : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontWeight: '600',
                                transition: 'all 0.3s'
                            }}
                        >
                            {med.taken ? <CheckCircle2 size={18} /> : <Pill size={18} />}
                            {med.taken ? 'Taken' : 'Mark as Taken'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="glass-panel" style={{ marginTop: '30px', background: 'rgba(167, 139, 250, 0.05)', border: '1px solid rgba(167, 139, 250, 0.2)' }}>
                <h4 style={{ color: 'var(--accent-neon-purple)', marginBottom: '10px' }}>Medication Insight</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Taking your medications at the same time every day helps maintain a consistent level of the drug in your body, increasing its effectiveness.
                </p>
            </div>
        </div>
    );
};

export default MedicationTracker;
