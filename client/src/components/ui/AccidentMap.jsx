import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { formatDateTime } from '../../utils/helpers';
import StatusBadge from './StatusBadge';

// Import Leaflet styles
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon path resolution issues in Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIconRetina,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Default center of the map (Bandra, Mumbai)
const MUMBAI_CENTER = [19.0596, 72.8295];

export default function AccidentMap({ accidents = [] }) {
    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden', height: '400px', position: 'relative', marginBottom: 'var(--space-6)' }}>
            
            {/* Scoped CSS to invert map tiles into a custom dark mode matching Sentry's theme */}
            <style>{`
                .dark-map-container .leaflet-tile-container {
                    filter: invert(1) hue-rotate(180deg) brightness(0.85) contrast(1.2);
                }
                .dark-map-container .leaflet-container {
                    background: var(--color-bg-primary);
                }
                .leaflet-popup-content-wrapper {
                    background: var(--color-bg-card) !important;
                    color: var(--color-text-primary) !important;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    font-family: var(--font-sans);
                }
                .leaflet-popup-tip {
                    background: var(--color-bg-card) !important;
                    border: 1px solid var(--color-border);
                }
                .leaflet-popup-content {
                    margin: var(--space-3) var(--space-4) !important;
                }
                .leaflet-popup-close-button {
                    color: var(--color-text-secondary) !important;
                }
            `}</style>

            <div className="dark-map-container" style={{ width: '100%', height: '100%' }}>
                <MapContainer 
                    center={MUMBAI_CENTER} 
                    zoom={12} 
                    scrollWheelZoom={false}
                    style={{ width: '100%', height: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {accidents.map((accident) => {
                        // Validate coordinates
                        if (!accident.lat || !accident.lng) return null;

                        return (
                            <Marker 
                                key={accident.id} 
                                position={[accident.lat, accident.lng]}
                            >
                                <Popup>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: 'var(--text-xs)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-heading)' }}>
                                                {accident.caseId || 'FIR DRAFT'}
                                            </span>
                                            <StatusBadge type="severity" value={accident.severity} />
                                        </div>
                                        <div>
                                            <strong style={{ color: 'var(--color-text-heading)' }}>Location:</strong> {accident.location}
                                        </div>
                                        <div>
                                            <strong style={{ color: 'var(--color-text-heading)' }}>Timestamp:</strong> {formatDateTime(accident.date)}
                                        </div>
                                        <div>
                                            <strong style={{ color: 'var(--color-text-heading)' }}>Camera:</strong> <code style={{ color: 'var(--color-accent-amber)' }}>{accident.cameraId}</code>
                                        </div>
                                        
                                        {/* Render dynamic AI Outputs if present */}
                                        {accident.aiOutputs && Object.keys(accident.aiOutputs).length > 0 && (
                                            <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dotted var(--color-border)', color: 'var(--color-text-secondary)' }}>
                                                {accident.aiOutputs.accidentType && (
                                                    <div>
                                                        <strong>Collision Type:</strong> {accident.aiOutputs.accidentType}
                                                    </div>
                                                )}
                                                {accident.aiOutputs.confidenceScore && (
                                                    <div>
                                                        <strong>AI Confidence:</strong> {(accident.aiOutputs.confidenceScore * 100).toFixed(0)}%
                                                    </div>
                                                )}
                                                {accident.aiOutputs.vehiclesDetected && (
                                                    <div>
                                                        <strong>Vehicles Detected:</strong> {accident.aiOutputs.vehiclesDetected}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        <a 
                                            href={`/police/reports/${accident.id}`} 
                                            style={{ 
                                                marginTop: '6px', 
                                                color: 'var(--color-accent-blue)', 
                                                textDecoration: 'none', 
                                                fontWeight: 'var(--weight-semibold)',
                                                display: 'inline-block'
                                            }}
                                        >
                                            View Report Details →
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}
