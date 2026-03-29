import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Sparkles, FileText, ArrowRight, CheckCircle, Target, Loader, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Insights = () => {
    const { API_URL } = useAuth();
    
    // Weekly Report State
    const [report, setReport] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);
    
    // Face Comparison State
    const [comparison, setComparison] = useState(null);
    const [comparisonLoading, setComparisonLoading] = useState(false);

    const generateWeeklyReport = async () => {
        setReportLoading(true);
        try {
            const res = await axios.get(`${API_URL}/ai/weekly-report`);
            setReport(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setReportLoading(false);
        }
    };

    const downloadPassport = async () => {
        const element = document.getElementById('report-content');
        if(!element) return;
        
        try {
            // Add a temporary style to ensure the PDF looks good
            const originalStyle = element.style.cssText;
            element.style.padding = '20px';
            element.style.background = '#0a0f1e';
            
            const canvas = await html2canvas(element, { 
                backgroundColor: '#0a0f1e', 
                scale: 2,
                useCORS: true,
                logging: false
            });
            
            element.style.cssText = originalStyle;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`NexaHealth_Passport_${new Date().toLocaleDateString()}.pdf`);
        } catch (error) {
            console.error('PDF Error:', error);
            alert("Error generating PDF. Please try again.");
        }
    };

    const fetchComparison = async () => {
        setComparisonLoading(true);
        try {
            const res = await axios.get(`${API_URL}/ai/face-comparison`);
            setComparison(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setComparisonLoading(false);
        }
    };

    useEffect(() => {
        fetchComparison();
    }, []);

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Advanced Insights</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>AI-driven analysis and progress tracking.</p>
                </div>
                {report && (
                  <button onClick={downloadPassport} className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '0.9rem' }}>
                    <DownloadIcon /> DOWNLOAD HEALTH PASSPORT
                  </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} id="report-content">
                
                {/* Face Comparison Section */}
                <div className="glass-panel">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--accent-neon-blue)' }}>
                        <UserCheckIcon /> Face Scan Progress Comparison
                    </h2>
                    
                    {comparisonLoading ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}><Loader className="spin" size={32} /></div>
                    ) : comparison?.canCompare ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                            <div style={{ flex: 1, minWidth: '250px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Earliest Scan ({new Date(comparison.before.date).toLocaleDateString()})</h3>
                                <div style={{ fontSize: '1.1rem', marginBottom: '8px' }}><span style={{color: 'var(--text-secondary)'}}>Acne Status:</span> <strong style={{color: 'var(--text-primary)'}}>{comparison.before.data.acneDetection}</strong></div>
                                <div style={{ fontSize: '1.1rem', marginBottom: '8px' }}><span style={{color: 'var(--text-secondary)'}}>Skin Condition:</span> <strong style={{color: 'var(--text-primary)'}}>{comparison.before.data.skinCondition}</strong></div>
                                <div style={{ fontSize: '1.1rem' }}><span style={{color: 'var(--text-secondary)'}}>Scan Confidence:</span> <strong style={{color: 'var(--text-primary)'}}>{comparison.before.data.confidence}%</strong></div>
                            </div>
                            
                            <ArrowRight size={32} color="var(--accent-neon-blue)" style={{ margin: '0 auto' }} />

                            <div style={{ flex: 1, minWidth: '250px', background: 'rgba(20,184,166,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(20,184,166,0.3)' }}>
                                <h3 style={{ color: 'var(--accent-neon-teal)', marginBottom: '16px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Latest Scan ({new Date(comparison.after.date).toLocaleDateString()})</h3>
                                <div style={{ fontSize: '1.1rem', marginBottom: '8px' }}><span style={{color: 'var(--text-secondary)'}}>Acne Status:</span> <strong style={{color: 'var(--text-primary)'}}>{comparison.after.data.acneDetection}</strong></div>
                                <div style={{ fontSize: '1.1rem', marginBottom: '8px' }}><span style={{color: 'var(--text-secondary)'}}>Skin Condition:</span> <strong style={{color: 'var(--text-primary)'}}>{comparison.after.data.skinCondition}</strong></div>
                                <div style={{ fontSize: '1.1rem' }}><span style={{color: 'var(--text-secondary)'}}>Scan Confidence:</span> <strong style={{color: 'var(--text-primary)'}}>{comparison.after.data.confidence}%</strong></div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                            <AlertCircle color="#fb923c" />
                            {comparison?.message || "Not enough data for comparison."}
                        </div>
                    )}
                </div>

                {/* AI Weekly Report */}
                <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-neon-purple)', filter: 'blur(100px)', opacity: 0.2, zIndex: 0 }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--accent-neon-purple)' }}>
                                <FileText /> Weekly AI Health Report
                            </h2>
                            <button className="btn-primary" onClick={generateWeeklyReport} disabled={reportLoading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {reportLoading ? <Loader className="spin" size={18} /> : <Sparkles size={18} />} 
                                {report ? "Regenerate Report" : "Generate Report"}
                            </button>
                        </div>

                        {!report && !reportLoading && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                Click the button above to generate your customized AI summary for this week.
                            </div>
                        )}

                        {report && (
                            <div style={{ animation: 'fadeIn 0.5s ease' }}>
                                <div style={{ padding: '20px', background: 'rgba(167,139,250,0.1)', borderLeft: '4px solid var(--accent-neon-purple)', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
                                    <p style={{ margin: 0, fontSize: '1.2rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>{report.summary}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                    
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-neon-teal)', marginBottom: '16px', fontSize: '1.1rem' }}>
                                            <CheckCircle size={20} /> Suggested Improvements
                                        </h3>
                                        <ul style={{ paddingLeft: '24px', margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {report.improvements?.map((item, i) => (
                                                <li key={i} style={{ lineHeight: '1.4' }}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb923c', marginBottom: '16px', fontSize: '1.1rem' }}>
                                            <Target size={20} /> Focus Areas
                                        </h3>
                                        <ul style={{ paddingLeft: '24px', margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {report.focusAreas?.map((item, i) => (
                                                <li key={i} style={{ lineHeight: '1.4' }}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

// Help icons (SVG components)
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const UserCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>;

export default Insights;
