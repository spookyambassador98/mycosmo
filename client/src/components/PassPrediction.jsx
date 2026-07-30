import React from 'react';
import useStore from '../store/useStore';

export default function PassPrediction() {
  const { selectedSat, lang } = useStore();
  const satName = selectedSat ? selectedSat.name : 'ISS (ZARYA)';

  // Уникальные баллистические данные для каждого аппарата
  const passData = {
    'ISS (ZARYA)': { maxEl: '51.6°', duration: '540 sec', aos: '+00:12:40' },
    'HUBBLE STT': { maxEl: '28.5°', duration: '480 sec', aos: '+00:25:10' },
    'STARLINK-4412': { maxEl: '53.0°', duration: '390 sec', aos: '+00:08:15' }
  }[satName] || { maxEl: '45.0°', duration: '450 sec', aos: '+00:15:00' };

  const t = {
    RU: {
      title: 'ПРЕДИКАТОР ОРБИТАЛЬНЫХ ПРОЛЕТОВ',
      target: 'ЦЕЛЕВОЙ ОБЪЕКТ',
      maxEl: 'МАКС. ЭЛЕВАЦИЯ',
      duration: 'ДЛИТЕЛЬНОСТЬ',
      aos: 'БЛИЖАЙШИЙ AOS (ВХОД В ЗОНУ)'
    },
    EN: {
      title: 'ORBITAL PASS PREDICTOR',
      target: 'TARGET OBJECT',
      maxEl: 'MAX ELEVATION',
      duration: 'PASS DURATION',
      aos: 'NEXT AOS ACQUISITION'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontFamily: 'Orbitron, sans-serif', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ color: '#00f0ff', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
        {t[lang].title}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '0.8rem', padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].target}</div>
          <div style={{ fontSize: '0.9rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.2rem' }}>{satName}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].maxEl}</div>
          <div style={{ fontSize: '0.9rem', color: '#00ff66', fontWeight: 'bold', marginTop: '0.2rem' }}>{passData.maxEl}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '0.8rem', padding: '0.8rem' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].duration}</div>
          <div style={{ fontSize: '0.9rem', color: '#ffcc00', fontWeight: 'bold', marginTop: '0.3rem' }}>{passData.duration}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '0.8rem', padding: '0.8rem' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].aos}</div>
          <div style={{ fontSize: '0.9rem', color: '#ff3c7e', fontWeight: 'bold', marginTop: '0.3rem' }}>{passData.aos}</div>
        </div>
      </div>
    </div>
  );
}
