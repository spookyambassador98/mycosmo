import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';

export default function BlackHoleMatrixView({ onSwitch }) {
  const { lang, setLang } = useStore();
  const canvasRef = useRef(null);

  const [bhData, setBhData] = useState({
    mass: '4.3e6',
    radius: '12.7',
    hawkingTemp: '6.2e-8',
    spagIndex: 'CRITICAL'
  });

  const t = {
    RU: {
      header: 'ОРБИТАЛЬНЫЙ C2 // СТРАНИЦА 5: СУПЕРВИЗОР СИНГУЛЯРНОСТИ',
      back: 'НАЗАД [1]',
      canvasTitle: 'АККРЕЦИОННЫЙ ДИСК КЕРРА // РЕЛЯТИВИСТСКИЙ ЛЕНЗИНГ',
      q1Title: 'МАССА И РАДИУС ШВАРЦШИЛЬДА',
      q2Title: 'ИЗЛУЧЕНИЕ ХОКИНГА',
      q3Title: 'ИНДЕКС СПАГЕТТИФИКАЦИИ',
      radiusLabel: 'ГОРИЗОНТ СОБЫТИЙ (rs)',
      tempLabel: 'ЭФФЕКТИВНАЯ ТЕМПЕРАТУРА',
      spagLabel: 'ПРИЛИВНЫЕ СИЛЫ'
    },
    EN: {
      header: 'ORBITAL C2 // PAGE 5: SINGULARITY SUPERVISOR',
      back: 'BACK [1]',
      canvasTitle: 'KERR ACCRETION DISK // RELATIVISTIC LENSING',
      q1Title: 'SCHWARZSCHILD MASS & RADIUS',
      q2Title: 'HAWKING RADIATION',
      q3Title: 'SPAGHETTIFICATION INDEX',
      radiusLabel: 'EVENT HORIZON (rs)',
      tempLabel: 'EFFECTIVE TEMP',
      spagLabel: 'TIDAL FORCES'
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const stars = Array.from({ length: 250 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      alpha: Math.random() * 0.8 + 0.2
    }));

    const particles = Array.from({ length: 800 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * 300;
      return {
        angle,
        radius,
        speed: (Math.random() * 0.02 + 0.008) * (300 / radius),
        size: Math.random() * 1.8 + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.3
      };
    });

    const render = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth - 30;
      canvas.height = canvas.parentElement.clientHeight - 50;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.fillStyle = '#010103';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const bhRadius = 55;

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy - 12, bhRadius * 3.4, bhRadius * 1.15, 0, Math.PI, 0, false);
      ctx.strokeStyle = 'rgba(255, 140, 20, 0.4)';
      ctx.lineWidth = 20;
      ctx.filter = 'blur(8px)';
      ctx.stroke();
      ctx.restore();

      const coronaGlow = ctx.createRadialGradient(cx, cy, bhRadius, cx, cy, bhRadius * 3.8);
      coronaGlow.addColorStop(0, 'rgba(255, 90, 0, 0.95)');
      coronaGlow.addColorStop(0.3, 'rgba(255, 180, 50, 0.4)');
      coronaGlow.addColorStop(0.7, 'rgba(0, 200, 255, 0.18)');
      coronaGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = coronaGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, bhRadius * 3.8, 0, Math.PI * 2);
      ctx.fill();

      particles.forEach(p => {
        p.angle += p.speed;
        p.radius -= 0.25;
        if (p.radius < bhRadius) {
          p.radius = 320 + Math.random() * 40;
          p.angle = Math.random() * Math.PI * 2;
        }

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * (p.radius * 0.35);

        const isApproaching = Math.cos(p.angle) > 0;
        const color = isApproaching ? '#00f0ff' : '#ff5500';
        const alpha = p.baseAlpha * (1 - p.radius / 380);

        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy, bhRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ff9900';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, bhRadius + 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const tSec = Date.now() / 1000;
      setBhData({
        mass: (4.3 + Math.sin(tSec * 0.1) * 0.02).toFixed(2) + 'e6 M☉',
        radius: (12.7 + Math.cos(tSec * 0.2) * 0.1).toFixed(2) + ' mln km',
        hawkingTemp: (6.2 + Math.sin(tSec * 0.5) * 0.3).toFixed(2) + 'e-8 K',
        spagIndex: Math.sin(tSec) > 0 ? 'MAXIMAL (FATAL)' : 'EXTREME'
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#030305', padding: '1rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'Orbitron, sans-serif', overflow: 'hidden' }}>
      
      {/* ХЕДЕР */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, rgba(255,153,0,0.05), rgba(0,240,255,0.02))', border: '1px solid rgba(255,153,0,0.3)', borderRadius: '1rem', padding: '0.8rem 1.5rem', flexShrink: 0, boxShadow: 'inset 0 0 20px rgba(255,153,0,0.05)' }}>
        <h1 style={{ color: '#ff9900', fontSize: '1rem', margin: 0, textShadow: '0 0 10px rgba(255,153,0,0.4)' }}>{t[lang].header}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,153,0,0.4)', color: '#ff9900', padding: '0.5rem 0.9rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
            LANG: {lang}
          </button>
          <button onClick={onSwitch} style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid #ff0055', color: '#ff0055', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', boxShadow: '0 0 10px rgba(255,0,85,0.2)' }}>
            {t[lang].back}
          </button>
        </div>
      </div>

      {/* ОСНОВНОЙ РАЗДЕЛ: МЕТРИКИ СЛЕВА (СТОЛБИК), ХОЛСТ СПРАВА (ВСЯ ПРАВАЯ ЧАСТЬ) */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 2.4fr', gap: '1rem', overflow: 'hidden' }}>
        
        {/* ЛЕВАЯ КОЛОНКА: СТОЛБИК МЕТРИК */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          
          <div style={{ background: 'rgba(5,5,8,0.7)', border: '1px solid rgba(255,153,0,0.25)', borderRadius: '1.2rem', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(10px)', flex: 1, minHeight: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ff9900', fontSize: '0.8rem', fontWeight: 'bold' }}>{t[lang].q1Title}</span>
              <span style={{ color: '#00ff66', fontSize: '0.65rem', background: 'rgba(0,255,102,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}>ACTIVE</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{t[lang].radiusLabel}</div>
              <div style={{ fontSize: '1.6rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.2rem', textShadow: '0 0 15px rgba(0,240,255,0.4)' }}>{bhData.radius}</div>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Mass: {bhData.mass}</div>
          </div>

          <div style={{ background: 'rgba(5,5,8,0.7)', border: '1px solid rgba(255,153,0,0.25)', borderRadius: '1.2rem', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(10px)', flex: 1, minHeight: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ff3c7e', fontSize: '0.8rem', fontWeight: 'bold' }}>{t[lang].q2Title}</span>
              <span style={{ color: '#00ff66', fontSize: '0.65rem', background: 'rgba(0,255,102,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}>QUANTUM</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{t[lang].tempLabel}</div>
              <div style={{ fontSize: '1.6rem', color: '#ffcc00', fontWeight: 'bold', marginTop: '0.2rem', textShadow: '0 0 15px rgba(255,204,0,0.4)' }}>{bhData.hawkingTemp}</div>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Pair production flux active</div>
          </div>

          <div style={{ background: 'rgba(5,5,8,0.7)', border: '1px solid rgba(255,153,0,0.25)', borderRadius: '1.2rem', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(10px)', flex: 1, minHeight: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#00f0ff', fontSize: '0.8rem', fontWeight: 'bold' }}>{t[lang].q3Title}</span>
              <span style={{ color: '#ff0055', fontSize: '0.65rem', background: 'rgba(255,0,85,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}>CRITICAL</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{t[lang].spagLabel}</div>
              <div style={{ fontSize: '1.3rem', color: '#ff0055', fontWeight: 'bold', marginTop: '0.2rem', textShadow: '0 0 15px rgba(255,0,85,0.5)' }}>{bhData.spagIndex}</div>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Tidal gradient threshold exceeded</div>
          </div>

        </div>

        {/* ПРАВАЯ КОЛОНКА: ПОЛНОРАЗМЕРНЫЙ ХОЛСТ ЧЕРНОЙ ДЫРЫ НА ВСЮ ВЫСОТУ */}
        <div style={{ background: 'rgba(5,5,8,0.7)', border: '1px solid rgba(255,153,0,0.3)', borderRadius: '1.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
            <span style={{ color: '#ff9900', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>{t[lang].canvasTitle}</span>
            <span style={{ color: '#00ff66', fontSize: '0.7rem', background: 'rgba(0,255,102,0.1)', border: '1px solid rgba(0,255,102,0.3)', padding: '0.3rem 0.7rem', borderRadius: '0.4rem', boxShadow: '0 0 10px rgba(0,255,102,0.2)' }}>KERR METRIC STABLE</span>
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '1rem', background: '#010103', border: '1px solid rgba(255,153,0,0.15)' }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
          </div>
        </div>

      </div>
    </div>
  );
}
