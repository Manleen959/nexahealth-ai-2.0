import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Ambulance, MapPin, Phone, Hospital, Navigation as NavIcon, AlertTriangle } from 'lucide-react';
import L from 'leaflet';

// Fix for leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const EmergencyServices = () => {
    // Ludhiana coordinates
    const ludhianaCoords = [30.9010, 75.8573];
    const [userLocation, setUserLocation] = useState(ludhianaCoords);
    const [hospitals, setHospitals] = useState([
        { 
            id: 1, 
            name: "Dayanand Medical College (DMCH)", 
            position: [30.9155, 75.8230], 
            phone: "+91 161 468 7700", 
            distance: "1.2 km", 
            status: "High Load", 
            beds: 12,
            icu: 3,
            specialty: "Trauma, Cardiac, neurology" 
        },
        { 
            id: 2, 
            name: "CMC Hospital (CMCH)", 
            position: [30.9107, 75.8635], 
            phone: "+91 161 211 5000", 
            distance: "2.4 km", 
            status: "Normal", 
            beds: 45,
            icu: 8,
            specialty: "Emergency, Nephrology" 
        },
        { 
            id: 3, 
            name: "Fortis Hospital Chandigarh Road", 
            position: [30.9398, 75.9101], 
            phone: "+91 161 522 2222", 
            distance: "4.8 km", 
            status: "Normal", 
            beds: 28,
            icu: 5,
            specialty: "General, Oncology" 
        },
        { 
            id: 4, 
            name: "SPS Hospital Sherpur", 
            position: [30.8835, 75.8770], 
            phone: "+91 161 661 7111", 
            distance: "3.1 km", 
            status: "Normal", 
            beds: 34,
            icu: 6,
            specialty: "Cardiology, Critical Care" 
        },
        { 
            id: 5, 
            name: "Apollo Hospital Ferozepur Road", 
            position: [30.8875, 75.7667], 
            phone: "+91 161 276 3300", 
            distance: "5.5 km", 
            status: "Redirecting", 
            beds: 0,
            icu: 0,
            specialty: "Advanced Surgery, ER" 
        }
    ]);
    const [selectedHospital, setSelectedHospital] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                () => {
                    console.log("Using default Ludhiana view.");
                    setUserLocation(ludhianaCoords);
                }
            );
        }
    }, []);

    const callAmbulance = () => {
        window.location.href = 'tel:102';
    };

    const navigateToHospital = (hospital) => {
        const [lat, lng] = hospital.position;
        // Business-name based destination is often more accurate for finding the correct entrance vs raw coordinates
        const query = encodeURIComponent(`${hospital.name}, Ludhiana`);
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${query}`;
        // Note: although place_id is usually a hash, passing the encoded name in certain contexts helps Google Search refine the destination.
        // For standard Google Maps directions that users trust:
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}(${encodeURIComponent(hospital.name)})`, '_blank');
    };

    const shareHospital = (hospital) => {
        const [lat, lng] = hospital.position;
        const text = `Emergency: Navigating to ${hospital.name} in Ludhiana. Coordinates: ${lat}, ${lng}. Location: https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        if (navigator.share) {
            navigator.share({ title: 'Emergency Hospital Location', text: text });
        } else {
            navigator.clipboard.writeText(text);
            alert("Location details copied to clipboard!");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', animation: 'fadeIn 0.8s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-red)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <span style={{ width: '8px', height: '8px', background: 'var(--accent-red)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px var(--accent-red)' }}></span>
                        Live Dispatch Hub: Ludhiana
                    </div>
                    <h1 className="heading-gradient" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2.5rem', margin: 0 }}>
                        Emergency Command Center
                    </h1>
                </div>
                
                <div style={{ display: 'flex', gap: '15px' }}>
                     <button 
                        onClick={callAmbulance}
                        className="btn-neon" 
                        style={{ 
                            background: 'var(--accent-red)', 
                            boxShadow: '0 0 25px rgba(255, 68, 68, 0.5)',
                            padding: '16px 32px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '1.2rem'
                        }}
                    >
                        <Ambulance size={28} />
                        SOS: REQUEST DISPATCH
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
                {/* Map Section */}
                <div style={{ position: 'relative' }}>
                    <div className="glass-panel" style={{ height: '650px', padding: '0', overflow: 'hidden', border: '1px solid var(--panel-border)', position: 'relative', boxShadow: '0 0 40px rgba(0,255,170,0.05)' }}>
                        <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            <Marker position={userLocation}>
                                <Popup>Your Current Location</Popup>
                            </Marker>
                            {hospitals.map(h => (
                                <Marker key={h.id} position={h.position}>
                                    <Popup>
                                        <div style={{ color: '#000', padding: '5px' }}>
                                            <strong style={{fontSize: '1rem'}}>{h.name}</strong><br />
                                            <span style={{color: '#666'}}>{h.specialty}</span><br />
                                            <div style={{marginTop: '10px', display: 'flex', gap: '5px'}}>
                                                <div style={{background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'}}>Beds: {h.beds}</div>
                                                <div style={{background: '#ffe4e6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#e11d48'}}>ICU: {h.icu}</div>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                        
                        {/* Overlay Controls */}
                        <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 2, display: 'flex', gap: '10px' }}>
                            <div style={{ background: 'rgba(10, 15, 30, 0.9)', backdropFilter: 'blur(10px)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                                    <Hospital size={16} color="var(--accent-neon-blue)" /> 5 Active Hospitals in Range
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Hospital List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '650px', overflowY: 'auto', paddingRight: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Hospital Availability</h3>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>LUDHIANA REGION</span>
                    </div>
                    
                    {hospitals.map(h => (
                        <div 
                            key={h.id} 
                            className="glass-panel" 
                            style={{ 
                                padding: '20px', 
                                cursor: 'pointer', 
                                border: selectedHospital?.id === h.id ? '1px solid var(--accent-neon-blue)' : '1px solid var(--panel-border)',
                                borderLeft: `4px solid ${h.status === 'High Load' ? '#fb923c' : h.status === 'Redirecting' ? 'var(--accent-red)' : 'var(--accent-neon-teal)'}`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: selectedHospital?.id === h.id ? 'rgba(20, 184, 166, 0.05)' : 'var(--panel-bg)'
                            }}
                            onClick={() => setSelectedHospital(h)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{h.name}</div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                    <span style={{ 
                                        fontSize: '0.7rem', 
                                        padding: '2px 8px', 
                                        borderRadius: '4px', 
                                        background: h.status === 'High Load' ? 'rgba(251, 146, 60, 0.1)' : h.status === 'Redirecting' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(0, 255, 170, 0.1)',
                                        color: h.status === 'High Load' ? '#fb923c' : h.status === 'Redirecting' ? 'var(--accent-red)' : 'var(--accent-neon-teal)',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>
                                        {h.status}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Available Beds</div>
                                    <div style={{ fontSize: '1.1rem', color: h.beds > 0 ? 'var(--accent-neon-teal)' : 'var(--accent-red)', fontWeight: 'bold' }}>{h.beds}</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>ICU Units</div>
                                    <div style={{ fontSize: '1.1rem', color: h.icu > 0 ? '#fb923c' : 'var(--accent-red)', fontWeight: 'bold' }}>{h.icu}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                                    <MapPin size={16} /> {h.distance}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                                    <Hospital size={16} /> {h.specialty.split(',')[0]}
                                </div>
                            </div>

                            {selectedHospital?.id === h.id && (
                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', animation: 'slideDown 0.3s ease' }}>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        <a href={`tel:${h.phone}`} className="btn-neon" style={{ flex: '1 1 120px', padding: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                            <Phone size={16} /> CALL ER
                                        </a>
                                        <button 
                                            onClick={() => navigateToHospital(h)}
                                            className="btn-outline" 
                                            style={{ flex: '1 1 120px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
                                        >
                                            <NavIcon size={16} /> NAVIGATE
                                        </button>
                                        <button 
                                            onClick={() => shareHospital(h)}
                                            className="btn-outline" 
                                            style={{ flex: '1 1 120px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.2)' }}
                                        >
                                            <MapPin size={16} /> SHARE
                                        </button>
                                    </div>
                                    <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>EXPERT SPECIALTIES</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{h.specialty}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <div className="glass-panel" style={{ background: 'rgba(251, 146, 60, 0.05)', border: '1px solid rgba(251, 146, 60, 0.2)', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <div style={{ background: '#fb923c', padding: '8px', borderRadius: '8px' }}><Hospital size={20} color="#fff" /></div>
                            <h4 style={{ margin: 0, color: '#fb923c' }}>Ludhiana Health Dept. Advisory</h4>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                            High congestion reported near DMC and Mall Road. Ambulances are advised to use Ferozepur Road for faster extraction.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyServices;
