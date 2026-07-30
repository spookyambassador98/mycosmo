import React, { useState, useEffect } from 'react';
import * as satellite from 'satellite.js';
import useStore from '../store/useStore';

const SATELLITES = [
  { name: 'ISS (ZARYA)', l1: '1 25544U 98067A   26078.50000000  .00016717  00000-0  10270-3 0  9993', l2: '2 25544  51.6400 230.1234 0006789 123.4567 234.5678 15.50000000456789' },
  { name: 'HUBBLE STT', l1: '1 20580U 90037B   26078.40000000  .00001234  00000-0  34560-4 0  9991', l2: '2 20580  28.4690 120.4567 0002345  45.6789 314.5678 14.71234567123456' },
  { name: 'STARLINK-4412', l1: '1 44713U 19074A   26078.40000000  .00002345  00000-0  12340-3 0  9998', l2: '2 44713  53.0500 310.1234 0001234  89.1234 271.1234 15.05123456789012' },
  { name: 'TIANGONG', l1: '1 48274U 21035A   26078.20000000  .00020000  00000-0  12000-3 0  9990', l2: '2 48274  41.5000 150.1234 0002000  90.0000 270.0000 15.98000000123456' }
];

export default function RealtimeMatrixView({ onSwitch }) {
  const [matrixData, setMatrixData] = useState([]);
  const { lang, setLang } = useStore();

  const t = {
    RU: {
      header: 'ОРБИТАЛЬНЫЙ C2 // СТРАНИЦА 2: РИЛ-ТАЙМ МАТРИЦА 2x2',
      back: 'НАЗАД НА ГЛАВНЫЙ ЭКРАН [1]',
      alt: 'АЛЬТИТУДА',
      vel: 'СКОРОСТЬ',
      phase: 'ФАЗА ОРБИТЫ',
      lat: 'ШИРОТА',
      lon: 'ДОЛГОТА',
      status: 'РИЛ-ТАЙМ ПРОПАГАЦИЯ'
    },
    EN: {
      header: 'ORBITAL C2 // PAGE 2: REALTIME MATRIX 2x2',
      back: 'BACK TO MAIN SCREEN [1]',
      alt: 'ALTITUDE',
      vel: 'VELOCITY',
      phase: 'ORBIT PHASE',
      lat: 'LATITUDE',
      lon: 'LONGITUDE',
      status: 'REALTIME PROPAGATION'
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const gmst = satellite.gstime(now);
      const computed = SATELLITES.map(sat => {
        const rec = satellite.twoline2satrec(sat.l1, sat.l2);
        const pv = satellite.propagate(rec, now);
        if (!pv.position || !pv.velocity) return null;
        const gd = satellite.eciToGeodetic(pv.position, gmst);
        const vel = Math.sqrt(pv.velocity.x**2 + pv.velocity.y**2 + pv.velocity.z**2);
        return {
          name: sat.name,
          lat: satellite.degreesLat(gd.latitude).toFixed(2),
          lon: satellite.degreesLong(gd.longitude).toFixed(2),
          alt: gd.height.toFixed(2),
          vel: vel.toFixed(2),
          phase: ((now.getTime() % 3600000) / 10000).toFixed(1)
        };
      }).filter(Boolean);
      setMatrixData(computed);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050508', padding: '1rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'Orbitron, sans-serif', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1rem', padding: '0.8rem 1.5rem', flexShrink: 0 }}>
        <h1 style={{ color: '#00f0ff', fontSize: '1rem', margin: 0 }}>{t[lang].header}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,240,255,0.4)', color: '#00f0ff', padding: '0.5rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
            LANG: {lang}
          </button>
          <button onClick={onSwitch} style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid #ff0055', color: '#ff0055', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
            {t[lang].back}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '1rem', overflow: 'hidden' }}>
        {matrixData.map((item, idx) => (
          <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ff0055', fontSize: '1.1rem', fontWeight: 'bold' }}>{item.name}</span>
              <span style={{ color: '#00ff66', fontSize: '0.8rem', background: 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>{t[lang].status}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].alt}</div>
                <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{item.alt} {lang === 'RU' ? 'км' : 'km'}</div>
              </div>
              <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].vel}</div>
                <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{item.vel} {lang === 'RU' ? 'км/с' : 'km/s'}</div>
              </div>
              <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].phase}</div>
                <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{item.phase}°</div>
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{t[lang].lat}: {item.lat}°</span>
              <span>{t[lang].lon}: {item.lon}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
