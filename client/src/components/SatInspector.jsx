import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import * as satellite from 'satellite.js';

export default function SatInspector() {
  const selectedSat = useStore(state => state.selectedSat);
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    if (!selectedSat) return;

    const updateTelemetry = () => {
      const now = new Date();
      const gmst = satellite.gstime(now);
      try {
        const rec = satellite.twoline2satrec(selectedSat.tle1, selectedSat.tle2);
        const pv = satellite.propagate(rec, now);
        if (pv.position && pv.velocity) {
          const gd = satellite.eciToGeodetic(pv.position, gmst);
          const vel = Math.sqrt(pv.velocity.x**2 + pv.velocity.y**2 + pv.velocity.z**2);
          setTelemetry({
            alt: gd.height.toFixed(2),
            vel: vel.toFixed(2),
            lat: satellite.degreesLat(gd.latitude).toFixed(2),
            lon: satellite.degreesLong(gd.longitude).toFixed(2)
          });
        }
      } catch (e) {}
    };

    updateTelemetry();
    const interval = setInterval(updateTelemetry, 200);
    return () => clearInterval(interval);
  }, [selectedSat]);

  if (!selectedSat) {
    return (
      <div style={{ color: '#00f0ff', fontFamily: 'Orbitron, sans-serif' }}>
        <div style={{ fontSize: '0.8rem', color: '#ff0055', marginBottom: '1rem', borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '0.5rem' }}>
          DEEP ORBITAL INSPECTOR
        </div>
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', border: '1px dashed rgba(0,240,255,0.2)', borderRadius: '0.6rem' }}>
          [ Кликни на спутник в 3D-секторе для инициализации сканирования ]
        </div>
      </div>
    );
  }

  return (
    <div style={{ color: '#00f0ff', fontFamily: 'Orbitron, sans-serif' }}>
      <div style={{ fontSize: '0.8rem', color: '#ff0055', marginBottom: '1rem', borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <span>INSPECTOR: {selectedSat.name}</span>
        <span style={{ color: '#00ff66' }}>LIVE LINK ACTIVE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem' }}>
        <div style={{ background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: '0.6rem', padding: '0.8rem' }}>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>ВЫСОТА</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00f0ff', marginTop: '0.2rem' }}>{telemetry?.alt || '---'} км</div>
        </div>
        <div style={{ background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: '0.6rem', padding: '0.8rem' }}>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>СКОРОСТЬ</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00ff66', marginTop: '0.2rem' }}>{telemetry?.vel || '---'} км/с</div>
        </div>
        <div style={{ background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: '0.6rem', padding: '0.8rem' }}>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>ШИРОТА</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#ff0055', marginTop: '0.2rem' }}>{telemetry?.lat || '---'}°</div>
        </div>
        <div style={{ background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: '0.6rem', padding: '0.8rem' }}>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>ДОЛГОТА</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00f0ff', marginTop: '0.2rem' }}>{telemetry?.lon || '---'}°</div>
        </div>
      </div>
    </div>
  );
}
