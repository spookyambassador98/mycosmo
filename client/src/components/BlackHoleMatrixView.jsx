import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import C2Nav from './C2Nav';

export default function BlackHoleMatrixView({ activePage, onNavigate }) {
  const { lang } = useStore();
  const canvasRef = useRef(null);

  const [bhData, setBhData] = useState({
    mass: '4.3e6',
    radius: '12.7',
    hawkingTemp: '6.2e-8',
    spagIndex: 'CRITICAL'
  });

  const t = {
    RU: {
      header: 'ОРБИТАЛЬНЫЙ C2 // ЧЕРНАЯ ДЫРА',
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
      header: 'ORBITAL C2 // BLACK HOLE',
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
    <div className="c2-deck">
      <div className="c2-atmosphere" />
      <header className="c2-header" style={{ borderColor: 'rgba(255,176,32,0.3)' }}>
        <h1 className="c2-page-title c2-page-title--amber">{t[lang].header}</h1>
        <C2Nav activePage={activePage} onNavigate={onNavigate} />
      </header>

      <div className="c2-matrix-grid c2-matrix-grid--wide">
        <div className="c2-col">
          <div className="c2-panel c2-panel--pad c2-panel--amber c2-panel--fill" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
            <div className="c2-panel__sheen" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="c2-label" style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)' }}>{t[lang].q1Title}</span>
              <span className="c2-chip c2-chip--live">ACTIVE</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="c2-label">{t[lang].radiusLabel}</div>
              <div className="c2-value c2-value--lg">{bhData.radius}</div>
            </div>
            <div className="c2-muted">Mass: {bhData.mass}</div>
          </div>

          <div className="c2-panel c2-panel--pad c2-panel--amber c2-panel--fill" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
            <div className="c2-panel__sheen" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="c2-label" style={{ color: 'var(--plasma)', fontFamily: 'var(--font-display)' }}>{t[lang].q2Title}</span>
              <span className="c2-chip c2-chip--live">QUANTUM</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="c2-label">{t[lang].tempLabel}</div>
              <div className="c2-value c2-value--lg c2-value--amber">{bhData.hawkingTemp}</div>
            </div>
            <div className="c2-muted">Pair production flux active</div>
          </div>

          <div className="c2-panel c2-panel--pad c2-panel--amber c2-panel--fill" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
            <div className="c2-panel__sheen" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="c2-label" style={{ color: 'var(--ion)', fontFamily: 'var(--font-display)' }}>{t[lang].q3Title}</span>
              <span className="c2-chip c2-chip--alert">CRITICAL</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="c2-label">{t[lang].spagLabel}</div>
              <div className="c2-value c2-value--lg c2-value--danger">{bhData.spagIndex}</div>
            </div>
            <div className="c2-muted">Tidal gradient threshold exceeded</div>
          </div>
        </div>

        <div className="c2-panel c2-panel--pad c2-panel--amber" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="c2-panel__sheen" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="c2-page-title c2-page-title--amber" style={{ fontSize: '0.8rem' }}>{t[lang].canvasTitle}</span>
            <span className="c2-chip c2-chip--live">KERR METRIC STABLE</span>
          </div>
          <div className="c2-canvas-well c2-canvas-well--amber">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
