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
    <div className="c2-section">
      <div className="c2-section__title">{t[lang].title}</div>

      <div className="c2-metric c2-metric--wide">
        <div>
          <div className="c2-label">{t[lang].target}</div>
          <div className="c2-value">{satName}</div>
        </div>
        <div className="c2-metric__side">
          <div className="c2-label">{t[lang].maxEl}</div>
          <div className="c2-value c2-value--signal">{passData.maxEl}</div>
        </div>
      </div>

      <div className="c2-metric-grid">
        <div className="c2-metric">
          <div className="c2-label">{t[lang].duration}</div>
          <div className="c2-value c2-value--amber">{passData.duration}</div>
        </div>
        <div className="c2-metric">
          <div className="c2-label">{t[lang].aos}</div>
          <div className="c2-value c2-value--plasma">{passData.aos}</div>
        </div>
      </div>
    </div>
  );
}
