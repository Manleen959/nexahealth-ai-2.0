import React, { useState } from 'react';
import { Heart, Wind, Thermometer, Plus, Activity, Droplets, LineChart as LineChartIcon, Save } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const HealthMetrics = () => {
    const [metrics, setMetrics] = useState({
        heartRate: 72,
        bloodPressure: '120/80',
        bodyTemp: 98.6,
        oxygen: 98,
        bloodSugar: 90
    });

    const [history, setHistory] = useState([
        { date: 'Mon', hr: 70, bp: 118, temp: 98.5 },
        { date: 'Tue', hr: 75, bp: 122, temp: 98.7 },
        { date: 'Wed', hr: 72, bp: 121, temp: 98.6 },
        { date: 'Thu', hr: 68, bp: 119, temp: 98.4 },
        { date: 'Fri', hr: 74, bp: 125, temp: 98.8 },
        { date: 'Sat', hr: 71, bp: 120, temp: 98.6 },
        { date: 'Sun', hr: 72, bp: 120, temp: 98.6 }
    ]);

    const chartData = {
        labels: history.map(h => h.date),
        datasets: [{
            label: 'Heart Rate (BPM)',
            data: history.map(h => h.hr),
            borderColor: 'var(--accent-red)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true
        }, {
            label: 'Blood Pressure (Sys)',
            data: history.map(h => h.bp),
            borderColor: 'var(--accent-neon-blue)',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { labels: { color: '#e2e8f0' } } },
        scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)', beginAtZero: false } }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 className="heading-gradient" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Activity color="var(--accent-neon-teal)" size={32} />
                        Health Metric Hub
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Live monitoring and logging of your vital health data.</p>
                </div>
                <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> Add Log Entry
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-red)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-red)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        <Heart size={16} /> Heart Rate
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '12px 0' }}>{metrics.heartRate} <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>BPM</span></div>
                    <div style={{ color: 'green', fontSize: '0.8rem' }}>● Stable</div>
                </div>

                <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-neon-blue)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-neon-blue)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        <Droplets size={16} /> Blood Pressure
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '12px 0' }}>{metrics.bloodPressure}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Normal Range</div>
                </div>

                <div className="glass-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        <Thermometer size={16} /> Body Temp
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '12px 0' }}>{metrics.bodyTemp} <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>°F</span></div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Healthy</div>
                </div>

                <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-neon-teal)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-neon-teal)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        <Wind size={16} /> SpO2 (Oxygen)
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '12px 0' }}>{metrics.oxygen} <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>%</span></div>
                    <div style={{ color: 'green', fontSize: '0.8rem' }}>● Excellent</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
                <div className="glass-panel" style={{ height: '400px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                        <LineChartIcon color="var(--accent-neon-blue)" /> Vital Trend (Last 7 Days)
                    </h3>
                    <div style={{ height: '300px' }}>
                       <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3>Manual Log Entry</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Heart Rate (BPM)</label>
                           <input type="number" defaultValue="72" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff' }} />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Body Temp (°F)</label>
                           <input type="number" defaultValue="98.6" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff' }} />
                        </div>
                        <button className="btn-neon" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Save size={18} /> SAVE LOG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthMetrics;
