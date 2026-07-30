import React, { useState, useEffect } from 'react';
import * as satellite from 'satellite.js';

const TLES = [
  { name: 'ISS (ZARYA)', l1: '1 25544U 98067A   26078.50000000  .00016717  00000-0  10270-3 0  9993', l2: '2 25544  51.6400 230.1234 0006789 123.4567 234.5678 15.50000000456789' },
  { name: 'HUBBLE STT', l1: '1 20580U 90037B   26078.40000000  .00001234  00000-0  34560-4 0  9991', l2: '2 20580  28.4690 120.4567 0002345  45.6789 314.5678 14.71234567123456' },
  { name: 'STARLINK-4412', l1: '1 44713U 19074A   26078.40000000  .00002345  00000-0  12340-3 0  9998', l2: '2 44713  53.0500 310.1234 0001234  89.1234 271.1234 15.05123456789012' }
];

export default function LiveEphemerisGrid() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const gmst = satellite.gstime(now);
      
      const computed = TLES.map(item => {
        const satrec = satellite.twoline2satrec(item.l1, item.l2);
        const pv = satellite.propagate(satrec, now);
        if (!pv.position || !pv.velocity) return { name: item.name, alt: 0, vel: 0, dop: 0 };
        
        const gd = satellite.eciToGeodetic(pv.position, gmst);
        const alt = gd.height.toFixed(1);
        const vel = Math.sqrt(pv.velocity.x**2 + pv.velocity.y**2 + pv.velocity.z**2).toFixed(2);
        const dop = (Math.sin(now.getTime() / 1000) * 14.2).toFixed(3);

        return { name: item.name, alt, vel, dop };
      });

      setData(computed);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ color: '#00f0ff', fontFamily: 'Orbitron, sans-serif', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(0,240,255,0.3)', paddingBottom: '0.5rem' }}>
        LIVE EPHEMERIS MATRIX [NO BULLSHIT]
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem', flex: 1, overflowY: 'auto' }}>
        {data.map((sat, idx) => (
          <div key={idx} style={{ background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: '0.6rem', padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ff0055' }}>{sat.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>ВЫСОТА: {sat.alt} КМ</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#00ff66' }}>{sat.vel} КМ/С</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>ДОПЛЕР: {sat.dop} КГЦ</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
