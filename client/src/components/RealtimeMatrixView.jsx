import React, { useState, useEffect } from 'react';
import * as satellite from 'satellite.js';
import useStore from '../store/useStore';
import C2Nav from './C2Nav';

const SATELLITES = [
  { name: 'ISS (ZARYA)', l1: '1 25544U 98067A   26078.50000000  .00016717  00000-0  10270-3 0  9993', l2: '2 25544  51.6400 230.1234 0006789 123.4567 234.5678 15.50000000456789' },
  { name: 'HUBBLE STT', l1: '1 20580U 90037B   26078.40000000  .00001234  00000-0  34560-4 0  9991', l2: '2 20580  28.4690 120.4567 0002345  45.6789 314.5678 14.71234567123456' },
  { name: 'STARLINK-4412', l1: '1 44713U 19074A   26078.40000000  .00002345  00000-0  12340-3 0  9998', l2: '2 44713  53.0500 310.1234 0001234  89.1234 271.1234 15.05123456789012' },
  { name: 'TIANGONG', l1: '1 48274U 21035A   26078.20000000  .00020000  00000-0  12000-3 0  9990', l2: '2 48274  41.5000 150.1234 0002000  90.0000 270.0000 15.98000000123456' }
];

export default function RealtimeMatrixView({ activePage, onNavigate }) {
  const [matrixData, setMatrixData] = useState([]);
  const { lang } = useStore();

  const t = {
    RU: {
      header: 'ОРБИТАЛЬНЫЙ C2 // МАТРИЦА В РЕАЛЬНОМ ВРЕМЕНИ',
      back: 'НАЗАД НА ГЛАВНЫЙ ЭКРАН [1]',
      alt: 'АЛЬТИТУДА',
      vel: 'СКОРОСТЬ',
      phase: 'ФАЗА ОРБИТЫ',
      lat: 'ШИРОТА',
      lon: 'ДОЛГОТА',
      status: 'РИЛ-ТАЙМ ПРОПАГАЦИЯ'
    },
    EN: {
      header: 'ORBITAL C2 // REALTIME MATRIX',
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
    <div className="c2-deck">
      <div className="c2-atmosphere" />
      <header className="c2-header">
        <h1 className="c2-page-title">{t[lang].header}</h1>
        <C2Nav activePage={activePage} onNavigate={onNavigate} />
      </header>
      <div className="c2-matrix-grid">
        {matrixData.map((item, idx) => (
          <div key={idx} className="c2-panel c2-panel--pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="c2-panel__sheen" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="c2-section__title c2-section__title--alert" style={{ border: 'none', padding: 0, margin: 0, fontSize: '0.95rem' }}>{item.name}</span>
              <span className="c2-chip c2-chip--live"><span className="c2-dot" />{t[lang].status}</span>
            </div>
            <div className="c2-metric-grid c2-metric-grid--3">
              <div className="c2-metric">
                <div className="c2-label">{t[lang].alt}</div>
                <div className="c2-value">{item.alt} {lang === 'RU' ? 'км' : 'km'}</div>
              </div>
              <div className="c2-metric">
                <div className="c2-label">{t[lang].vel}</div>
                <div className="c2-value">{item.vel} {lang === 'RU' ? 'км/с' : 'km/s'}</div>
              </div>
              <div className="c2-metric">
                <div className="c2-label">{t[lang].phase}</div>
                <div className="c2-value">{item.phase}°</div>
              </div>
            </div>
            <div className="c2-muted" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t[lang].lat}: {item.lat}°</span>
              <span>{t[lang].lon}: {item.lon}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
