import React from 'react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';
import { FiSun } from 'react-icons/fi';

export default function SolarFeed() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', marginBottom: '1.5rem', color: '#00f0ff' }}>SOLAR WEATHER & SDO</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>NASA SDO AIA 171 Å</div>
          <div style={{ flex: 1, overflow: 'hidden', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0171.jpg" alt="Solar SDO" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }} />
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Solar Activity Index</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', flex: 1 }}>
            <div style={{ background: 'rgba(0,240,255,0.05)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(0,240,255,0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>X-RAY BACKGROUND FLUX</div>
              <div style={{ fontSize: '1.5rem', fontFamily: 'Orbitron, sans-serif', color: '#00ff88' }}>B2.4 (NOMINAL)</div>
            </div>
            <div style={{ background: 'rgba(255,60,126,0.05)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(255,60,126,0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>GEOMAGNETIC STORM</div>
              <div style={{ fontSize: '1.5rem', fontFamily: 'Orbitron, sans-serif', color: '#ff3c7e' }}>Kp 2 (QUIET)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
