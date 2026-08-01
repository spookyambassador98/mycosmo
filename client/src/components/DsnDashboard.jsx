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
      freq: 'НЕСУЩАЯ ЧАСТОТА',
      locked: 'СИНХРОНИЗИРОВАНО'
    },
    EN: {
      title: 'GROUND STATION LINK (GS-LINK)',
      station: 'ACTIVE STATION',
      target: 'UPLINK/DOWNLINK TARGET',
      status: 'LINK STATUS',
      freq: 'CARRIER FREQ',
      locked: 'LOCKED & TRACKING'
    }
  };

  return (
    <div className="c2-section">
      <div className="c2-section__title">{t[lang].title}</div>

      <div className="c2-metric-grid">
        <div className="c2-metric">
          <div className="c2-label">{t[lang].station}</div>
          <div className="c2-value">MADRID-46 (LEO)</div>
        </div>
        <div className="c2-metric">
          <div className="c2-label">{t[lang].status}</div>
          <div className="c2-value c2-value--signal">{t[lang].locked}</div>
        </div>
      </div>

      <div className="c2-metric c2-metric--wide">
        <div>
          <div className="c2-label">{t[lang].target}</div>
          <div className="c2-value c2-value--plasma">{satName}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="c2-label">{t[lang].freq}</div>
          <div className="c2-value c2-value--amber">2.247 GHz</div>
        </div>
      </div>
    </div>
  );
}
