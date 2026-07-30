import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';

export default function SolarMatrixView({ onSwitch }) {
  const { lang, setLang } = useStore();
  const canvasRef = useRef(null);

  const [solarData, setSolarData] = useState({
    flux: 'C1.2',
    protonSpeed: 468.4,
    kpIndex: 3.2,
    temp: '2.7e6'
  });

  const t = {
    RU: {
      header: 'ОРБИТАЛЬНЫЙ C2 // СТРАНИЦА 4: СУПЕРВИЗОР СОЛНЦА (4 КВАДРАТА)',
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
      header: 'ORBITAL C2 // PAGE 4: SOLAR SUPERVISOR (4 QUADRANTS)',
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

      {/* 4 КВАДРАТА (2х2) */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '1rem', overflow: 'hidden' }}>
        
        {/* КВАДРАТ 1: Рентгеновский поток */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff3c7e', fontSize: '1.0rem', fontWeight: 'bold' }}>{t[lang].q1Title}</span>
            <span style={{ color: '#00ff66', fontSize: '0.75rem', background: 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>{t[lang].statusLive}</span>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].fluxLabel}</div>
            <div style={{ fontSize: '2.5rem', color: '#ffcc00', fontWeight: 'bold', marginTop: '0.5rem', textShadow: '0 0 20px rgba(255,204,0,0.3)' }}>{solarData.flux}</div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>GOES-16 XRS High Energy Channel Telemetry.</div>
        </div>

        {/* КВАДРАТ 2: Рил-тайм симуляция солнечного ветра (Визуал) */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#00f0ff', fontSize: '1.0rem', fontWeight: 'bold' }}>{t[lang].q2Title}</span>
            <span style={{ color: '#00ff66', fontSize: '0.75rem', background: 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>{t[lang].statusSim}</span>
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', margin: '0.5rem 0', borderRadius: '0.8rem', background: '#030305', border: '1px solid rgba(0,240,255,0.1)' }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', display: 'flex', justifyContent: 'space-between' }}>
            <span>{t[lang].speedLabel}: <b>{solarData.protonSpeed} km/s</b></span>
            <span>Vector: +X Radial</span>
          </div>
        </div>

        {/* КВАДРАТ 3: Геомагнитный Kp-индекс */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff3c7e', fontSize: '1.0rem', fontWeight: 'bold' }}>{t[lang].q3Title}</span>
            <span style={{ color: solarData.kpIndex > 4 ? '#ff0055' : '#00ff66', fontSize: '0.75rem', background: solarData.kpIndex > 4 ? 'rgba(255,0,85,0.1)' : 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>
              {solarData.kpIndex > 4 ? t[lang].statusWarning : t[lang].statusStable}
            </span>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].kpLabel}</div>
            <div style={{ fontSize: '2.5rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.5rem', textShadow: '0 0 20px rgba(0,240,255,0.3)' }}>{solarData.kpIndex}</div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>NOAA Space Weather Prediction Center metric.</div>
        </div>

        {/* КВАДРАТ 4: Температура короны */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#00f0ff', fontSize: '1.0rem', fontWeight: 'bold' }}>{t[lang].q4Title}</span>
            <span style={{ color: '#00ff66', fontSize: '0.75rem', background: 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>{t[lang].statusLive}</span>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].tempLabel}</div>
            <div style={{ fontSize: '2.5rem', color: '#ff9900', fontWeight: 'bold', marginTop: '0.5rem', textShadow: '0 0 20px rgba(255,153,0,0.3)' }}>{solarData.temp} K</div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>SDO Atmospheric Imaging Assembly (AIA 171).</div>
        </div>

      </div>
    </div>
  );
}
