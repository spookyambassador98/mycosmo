import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import C2Nav from './C2Nav';

export default function SolarMatrixView({ activePage, onNavigate }) {
  const { lang } = useStore();
  const canvasRef = useRef(null);

  const [solarData, setSolarData] = useState({
    flux: 'C1.2',
    protonSpeed: 468.4,
    kpIndex: 3.2,
    temp: '2.7e6'
  });

  const t = {
    RU: {
      header: 'ОРБИТАЛЬНЫЙ C2 // СУПЕРВИЗОР СОЛНЦА',
      back: 'ВЕРНУТЬСЯ НА ГЛАВНЫЙ ЭКРАН [1]',
      q1Title: 'ПОТОК РЕНТГЕНОВСКОГО ИЗЛУЧЕНИЯ (X-RAY)',
      q2Title: 'РИЛ-ТАЙМ СИМУЛЯЦИЯ СОЛНЕЧНОГО ВЕТРА',
      q3Title: 'МАГНИТОСФЕРНЫЙ ИНДЕКС (KP-INDEX)',
      q4Title: 'ТЕМПЕРАТУРА КОРОНЫ И ПЛАЗМА',
      fluxLabel: 'ТЕКУЩИЙ КЛАСС ВСПЫШКИ',
      speedLabel: 'СКОРОСТЬ ПЛАЗМЫ',
      kpLabel: 'ГЕОМАГНИТНАЯ АКТИВНОСТЬ',
      tempLabel: 'ЭФФЕКТИВНАЯ ТЕМП.',
      statusLive: 'АКТИВНЫЙ ПОТОК',
      statusSim: 'ЧАСТИЦЫ В РЕАЛЬНОМ ВРЕМЕНИ',
      statusStable: 'СТАБИЛЬНО',
      statusWarning: 'ВОЗМУЩЕНИЕ'
    },
    EN: {
      header: 'ORBITAL C2 // SOLAR SUPERVISOR',
      back: 'BACK TO MAIN SCREEN [1]',
      q1Title: 'X-RAY FLUX MONITOR',
      q2Title: 'REALTIME SOLAR WIND SIMULATOR',
      q3Title: 'GEOMAGNETIC KP-INDEX',
      q4Title: 'CORONAL TEMPERATURE & PLASMA',
      fluxLabel: 'CURRENT FLARE CLASS',
      speedLabel: 'PLASMA VELOCITY',
      kpLabel: 'GEOMAGNETIC ACTIVITY',
      tempLabel: 'EFFECTIVE TEMP',
      statusLive: 'ACTIVE FEED',
      statusSim: 'REALTIME PARTICLES',
      statusStable: 'STABLE',
      statusWarning: 'DISTURBANCE'
    }
  };

  // Рил-тайм симуляция солнечного ветра на Canvas (Квадрат 2)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() * 3 + 2),
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2.5 + 1,
      color: Math.random() > 0.2 ? '#00f0ff' : '#ff3c7e'
    }));

    const render = () => {
      canvas.width = canvas.parentElement.clientWidth - 40;
      canvas.height = canvas.parentElement.clientHeight - 80;

      ctx.fillStyle = 'rgba(5, 5, 8, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Рисуем солнце в центре слева
      const sunX = 40;
      const sunY = canvas.height / 2;
      const gradient = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 40);
      gradient.addColorStop(0, '#ffcc00');
      gradient.addColorStop(0.5, '#ff3c7e');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
      ctx.fill();

      // Двигаем частицы солнечного ветра
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > canvas.width) {
          p.x = sunX;
          p.y = sunY + (Math.random() - 0.5) * 100;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Динамические изменения данных солнца
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSec = Date.now() / 1000;
      setSolarData({
        flux: timeSec % 10 > 5 ? 'M1.4' : 'C2.8',
        protonSpeed: (465.0 + Math.sin(timeSec * 0.4) * 15.2).toFixed(1),
        kpIndex: (3.0 + Math.sin(timeSec * 0.2) * 0.8).toFixed(1),
        temp: (2.7 + Math.sin(timeSec * 0.1) * 0.15).toFixed(2) + 'e6'
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="c2-deck">
      <div className="c2-atmosphere" />
      <header className="c2-header c2-header--sticky">
        <h1 className="c2-page-title">{t[lang].header}</h1>
        <C2Nav activePage={activePage} onNavigate={onNavigate} />
      </header>

      <div className="c2-matrix-grid">
        <div className="c2-panel c2-panel--pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="c2-panel__sheen" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="c2-section__title c2-section__title--alert" style={{ border: 'none', padding: 0, fontSize: '0.9rem' }}>{t[lang].q1Title}</span>
            <span className="c2-chip c2-chip--live">{t[lang].statusLive}</span>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div className="c2-label">{t[lang].fluxLabel}</div>
            <div className="c2-value c2-value--xl c2-value--amber">{solarData.flux}</div>
          </div>
          <div className="c2-muted">GOES-16 XRS High Energy Channel Telemetry.</div>
        </div>

        <div className="c2-panel c2-panel--pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="c2-panel__sheen" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="c2-section__title" style={{ border: 'none', padding: 0, fontSize: '0.9rem' }}>{t[lang].q2Title}</span>
            <span className="c2-chip c2-chip--live">{t[lang].statusSim}</span>
          </div>
          <div className="c2-canvas-well" style={{ margin: '0.5rem 0' }}>
            <canvas ref={canvasRef} />
          </div>
          <div className="c2-muted" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{t[lang].speedLabel}: <b>{solarData.protonSpeed} km/s</b></span>
            <span>Vector: +X Radial</span>
          </div>
        </div>

        <div className="c2-panel c2-panel--pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="c2-panel__sheen" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="c2-section__title c2-section__title--alert" style={{ border: 'none', padding: 0, fontSize: '0.9rem' }}>{t[lang].q3Title}</span>
            <span className={`c2-chip ${solarData.kpIndex > 4 ? 'c2-chip--alert' : 'c2-chip--live'}`}>
              {solarData.kpIndex > 4 ? t[lang].statusWarning : t[lang].statusStable}
            </span>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div className="c2-label">{t[lang].kpLabel}</div>
            <div className="c2-value c2-value--xl">{solarData.kpIndex}</div>
          </div>
          <div className="c2-muted">NOAA Space Weather Prediction Center metric.</div>
        </div>

        <div className="c2-panel c2-panel--pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="c2-panel__sheen" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="c2-section__title" style={{ border: 'none', padding: 0, fontSize: '0.9rem' }}>{t[lang].q4Title}</span>
            <span className="c2-chip c2-chip--live">{t[lang].statusLive}</span>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div className="c2-label">{t[lang].tempLabel}</div>
            <div className="c2-value c2-value--xl c2-value--amber">{solarData.temp} K</div>
          </div>
          <div className="c2-muted">SDO Atmospheric Imaging Assembly (AIA 171).</div>
        </div>
      </div>
    </div>
  );
}
