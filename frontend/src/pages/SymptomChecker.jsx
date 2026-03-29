import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, Search, AlertCircle, Heart } from 'lucide-react';

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { API_URL } = useAuth();

    const analyzeSymptoms = async () => {
        if (!symptoms.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/ai/analyze-symptoms`, { symptoms });
            setResult(res.data);
        } catch (error) {
            console.error('Error analyzing symptoms', error);
            alert('Error processing symptoms');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Activity size={48} color="var(--accent-neon-purple)" style={{ marginBottom: '16px' }} />
                <h1 className="heading-gradient">Symptom Checker</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Describe your symptoms for an AI-powered initial diagnosis.</p>
            </div>

            <div className="glass-panel" style={{ marginBottom: '30px' }}>
                <textarea 
                    rows="5" 
                    placeholder="E.g., I've had a headache for 3 days, feeling nauseous, and have a slight fever..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    style={{ fontSize: '1.1rem', resize: 'vertical' }}
                />
                <button 
                    className="btn-neon" 
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    onClick={analyzeSymptoms}
                    disabled={loading}
                >
                    <Search size={20} />
                    {loading ? 'Analyzing with NVIDIA AI...' : 'Analyze Symptoms'}
                </button>
            </div>

            {result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-neon-purple)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <AlertCircle color="var(--accent-neon-purple)" /> Potential Causes
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {result.causes.map((cause, i) => (
                                <span key={i} style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '8px 16px', borderRadius: '20px', color: '#c4b5fd' }}>
                                    {cause}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-neon-teal)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Heart color="var(--accent-neon-teal)" /> Precautions & Exercises
                        </h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            <div>
                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Precautions</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {result.precautions.map((pre, i) => (
                                        <li key={'pre-'+i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <div style={{ background: '#14b8a6', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>{i+1}</div>
                                            <span style={{ color: 'var(--text-primary)' }}>{pre}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Recommended Exercises</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {result.recommendedExercises.map((exercise, i) => (
                                        <li key={'exe-'+i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <div style={{ background: 'var(--accent-neon-blue)', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>{i+1}</div>
                                            <span style={{ color: 'var(--text-primary)' }}>{exercise}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymptomChecker;
