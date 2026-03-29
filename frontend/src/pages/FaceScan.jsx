import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Camera, ScanFace, CheckCircle } from 'lucide-react';

const FaceScan = () => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const { API_URL } = useAuth();

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
        setAnalysis(null);
    };

    const submitScan = async () => {
        if (!imgSrc) return;
        setIsScanning(true);
        try {
            const res = await axios.post(`${API_URL}/ai/analyze-face`, { imageBase64: imgSrc });
            setAnalysis(res.data.analysis);
        } catch (error) {
            console.error('Error scanning face:', error);
            alert('Failed to scan face');
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <ScanFace size={48} color="var(--accent-neon-teal)" style={{ marginBottom: '16px' }} />
                <h1 className="heading-gradient">AI Face Diagnosis</h1>
                <p style={{ color: 'var(--text-secondary)' }}>NVIDIA Vision powered facial health analysis.</p>
            </div>

            <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                
                <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {!imgSrc ? (
                        <>
                            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--panel-border)', marginBottom: '20px' }}>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: "user" }}
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            </div>
                            <button onClick={capture} className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Camera size={20} /> Capture Face
                            </button>
                        </>
                    ) : (
                        <>
                            <div className={`scanner-active ${isScanning ? 'pulse-scan' : ''}`} style={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--accent-neon-blue)', marginBottom: '20px', position: 'relative' }}>
                                <img src={imgSrc} alt="Captured" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                {isScanning && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                                        <div className="loader" style={{color: 'var(--accent-neon-blue)', fontWeight: 'bold'}}>ANALYZING TELEMETRY...</div>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                                <button onClick={retake} className="btn-outline" style={{flex: 1}} disabled={isScanning}>RETAKE</button>
                                <button onClick={submitScan} className="btn-neon" style={{flex: 2}} disabled={isScanning}>START ANALYSIS</button>
                            </div>
                        </>
                    )}
                </div>

                {analysis && (
                    <div style={{ flex: '1', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-neon-blue)', padding: '15px' }}>
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Acne</h3>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{analysis.acneDetection}</div>
                            </div>
                            <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-neon-teal)', padding: '15px' }}>
                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Condition</h3>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{analysis.skinCondition}</div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '20px' }}>
                            <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>SKIN TELEMETRY</h4>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem' }}>Redness Index</span>
                                    <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                        <div style={{ width: `${(analysis.rednessLevel || 0)*10}%`, height: '100%', background: 'var(--accent-red)', borderRadius: '3px' }}></div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem' }}>Pore Visibility</span>
                                    <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                        <div style={{ width: `${(analysis.poreVisibility || 0)*10}%`, height: '100%', background: 'var(--accent-neon-blue)', borderRadius: '3px' }}></div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem' }}>Dark Circles</span>
                                    <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                        <div style={{ width: `${(analysis.darkCircles || 0)*10}%`, height: '100%', background: 'var(--accent-neon-purple)', borderRadius: '3px' }}></div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem' }}>Texture: <strong style={{color: 'var(--accent-neon-teal)'}}>{analysis.skinTexture}</strong></span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ border: '1px solid var(--accent-neon-purple)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'rgba(167, 139, 250, 0.05)', width: `${analysis.confidence}%` }}></div>
                            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', position: 'relative' }}>Analysis Confidence</h3>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-neon-purple)', position: 'relative' }}>
                                {analysis.confidence}%
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FaceScan;
