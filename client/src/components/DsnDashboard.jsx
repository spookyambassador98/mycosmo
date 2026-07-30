import React from 'react';
import useStore from '../store/useStore';

export default function DsnDashboard() {
  const { selectedSat, lang } = useStore();

  const satName = selectedSat ? selectedSat.name : 'ISS (ZARYA)';

  const t = {
    RU: {
      title: 'НАЗЕМНЫЙ ТЕРМИНАЛ СВЯЗИ (GS-LINK)',
      station: 'СТАНЦИЯ СВЯЗИ',
      target: 'ЦЕЛЬ UPLINK/DOWNLINK',
      status: 'СТАТУС КАНАЛА',
      doppler: 'ДОППЛЕРОВСКИЙ СДВИГ',
      freq: 'НЕСУЩАЯ ЧАСТОТА',
      locked: 'СИНХРОНИЗИРОВАНО'
    },
    EN: {
      title: 'GROUND STATION LINK (GS-LINK)',
      station: 'ACTIVE STATION',
      target: 'UPLINK/DOWNLINK TARGET',
      status: 'LINK STATUS',
      doppler: 'DOPPLER SHIFT',
      freq: 'CARRIER FREQ',
      locked: 'LOCKED & TRACKING'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontFamily: 'Orbitron, sans-serif', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ color: '#00f0ff', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
        {t[lang].title}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '0.8rem', padding: '0.8rem' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].station}</div>
          <div style={{ fontSize: '1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>MADRID-46 (LEO)</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '0.8rem', padding: '0.8rem' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].status}</div>
          <div style={{ fontSize: '1rem', color: '#00ff66', fontWeight: 'bold', marginTop: '0.3rem' }}>{t[lang].locked}</div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '0.8rem', padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].target}</div>
          <div style={{ fontSize: '0.9rem', color: '#ff3c7e', fontWeight: 'bold', marginTop: '0.2rem' }}>{satName}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].freq}</div>
          <div style={{ fontSize: '0.9rem', color: '#ffcc00', fontWeight: 'bold', marginTop: '0.2rem' }}>2.247 GHz</div>
        </div>
      </div>
    </div>
  );
}
