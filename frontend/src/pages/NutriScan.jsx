import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Utensils, Zap, Leaf, Coffee, PieChart, Sparkles, AlertCircle, CheckCircle, Target, ArrowRight } from 'lucide-react';

const NutriScan = () => {
    const { API_URL } = useAuth();
    const [goalType, setGoalType] = useState('balance');
    const [customGoal, setCustomGoal] = useState('');
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generatePlan = async () => {
        setLoading(true);
        setError(null);
        try {
            const finalGoal = customGoal.trim() || goalType;
            const res = await axios.post(`${API_URL}/ai/analyze-diet`, { goal: finalGoal });
            setPlan(res.data.plan);
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.statusText || err.message;
            setError(`Diagnostic Error: ${errorMsg}`);
            console.error('NexaHealth API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-slide-down" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: 'rgba(45, 212, 191, 0.1)', 
                    padding: '8px 16px', 
                    borderRadius: '30px', 
                    color: 'var(--accent-neon-teal)', 
                    fontWeight: 'bold', 
                    fontSize: '0.8rem', 
                    textTransform: 'uppercase', 
                    marginBottom: '16px', 
                    border: '1px solid rgba(45, 212, 191, 0.2)' 
                }}>
                    <Sparkles size={16} /> AI-Powered Clinical Nutrition
                </div>
                <h1 className="heading-gradient" style={{ fontSize: '3rem', marginBottom: '12px' }}>NutriScan 2.0</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Hyper-personalized dietary protocols synthesized by AI to meet your specific physiological objectives.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ marginBottom: '10px', color: 'var(--accent-neon-blue)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Target size={20}/> Define Your Objective
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {[
                            { id: 'Energy', icon: <Zap size={16}/> },
                            { id: 'Detox', icon: <Leaf size={16}/> },
                            { id: 'Balance', icon: <PieChart size={16}/> }
                        ].map(opt => (
                            <button 
                                key={opt.id}
                                onClick={() => { setGoalType(opt.id); setCustomGoal(''); }}
                                style={{
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: goalType === opt.id && !customGoal ? '1px solid var(--accent-neon-blue)' : '1px solid rgba(255,255,255,0.05)',
                                    background: goalType === opt.id && !customGoal ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255,255,255,0.02)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                {opt.icon}
                                {opt.id}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Describe a specific goal (e.g., "Build muscle while losing fat", "Recover from intensive cardio")</label>
                        <textarea 
                            value={customGoal}
                            onChange={(e) => setCustomGoal(e.target.value)}
                            placeholder="Type your fitness objective here..."
                            style={{
                                width: '100%',
                                height: '100px',
                                padding: '16px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '0.9rem',
                                resize: 'none',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button 
                        onClick={generatePlan}
                        className="btn-neon" 
                        style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        disabled={loading}
                    >
                        {loading ? 'SYNTHESIZING PROTOCOL...' : (
                            <>GENERATE CLINICAL PLAN <ArrowRight size={18}/></>
                        )}
                    </button>
                    {error && <p style={{ color: 'var(--accent-red)', fontSize: '0.8rem', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
                </div>

                <div className="glass-panel" style={{ gridColumn: 'span 2', minHeight: '500px' }}>
                    {!plan ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
                            <div className="pulse-emergency" style={{ background: 'rgba(45, 212, 191, 0.05)', padding: '24px', borderRadius: '50%', marginBottom: '20px' }}>
                                <Utensils size={48} color="var(--accent-neon-teal)" style={{ opacity: 0.5 }} />
                            </div>
                            <h3>AI Nutrition Command</h3>
                            <p style={{ maxWidth: '300px' }}>Select a preset or provide a custom objective to synthesize your bespoke dietary architecture.</p>
                        </div>
                    ) : (
                        <div className="animate-slide-down">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                                <div>
                                    <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-neon-blue)' }}>Synthesized Protocol</h3>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Based on Objective: <span style={{color: '#fff'}}>{customGoal || goalType}</span></p>
                                </div>
                                <div style={{ background: 'rgba(45, 212, 191, 0.1)', border: '1px solid var(--accent-neon-teal)', padding: '6px 14px', borderRadius: '20px', color: 'var(--accent-neon-teal)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    OPTIMIZED
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '16px' }}>
                                {plan.map((p, i) => (
                                    <div key={i} className="hover-lift" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', display: 'grid', gridTemplateColumns: '60px 1fr 180px', gap: '20px', alignItems: 'center' }}>
                                        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--accent-neon-purple)', display: 'flex', justifyContent: 'center' }}>
                                            {p.meal.includes('Break') ? <Coffee size={24} /> : <Utensils size={24} />}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '800' }}>{p.meal}</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '2px 0' }}>{p.item}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{p.explanation}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', color: 'var(--accent-neon-blue)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                {p.nutrients}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', gap: '15px' }}>
                                <AlertCircle color="var(--accent-neon-purple)" style={{ flexShrink: 0 }} />
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <strong style={{ color: 'var(--accent-neon-purple)' }}>CLINICAL NOTE:</strong> This plan has been synthesized specifically for the objectives provided. Ensure hydration levels are maintained at 3-4 liters per day during high-intensity protocols.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NutriScan;
