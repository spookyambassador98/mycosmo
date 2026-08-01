import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import C2Nav from './C2Nav';

export default function DebrisMatrixView({ activePage, onNavigate }) {
  const { lang, selectedSat, satellites } = useStore();
  const canvasRef = useRef(null);

  const targetName = selectedSat ? selectedSat.name : (satellites[0]?.name || 'ISS (ZARYA)');

  const [debrisStats, setDebrisStats] = useState({
    missDistance: '142.5 m',
    timeToImpact: '00:02:00',
    chaosIndex: '99.1%',
    threatLevel: 'IMMINENT'
  });

  const t = {
    RU: {
      header: 'ОРБИТАЛЬНЫЙ C2 // МАТРИЦА КОСМИЧЕСКОГО МУСОРА И УГРОЗ',
      back: 'НАЗАД [1]',
      radarTitle: `АКТИВНЫЙ ТАКТИЧЕСКИЙ РАДАР // ЦЕЛЬ: ${targetName}`,
      q1Title: 'ДИСТАНЦИЯ ДО ОБЛОМКА',
      q2Title: 'ВРЕМЯ ДО СБЛИЖЕНИЯ (TCA)',
      q3Title: 'ИНДЕКС ХАОСА ЛЕО',
      distLabel: 'MIN MISS DISTANCE',
      timeLabel: 'TIME TO CLOSEST APPROACH',
      chaosLabel: 'ORBITAL SATURATION'
    },
    EN: {
      header: 'ORBITAL C2 // SPACE DEBRIS & CONJUNCTION MATRIX',
      back: 'BACK [1]',
      radarTitle: `ACTIVE TACTICAL RADAR // TARGET: ${targetName}`,
      q1Title: 'CLOSEST APPROACH DISTANCE',
      q2Title: 'TIME TO CLOSEST APPROACH (TCA)',
      q3Title: 'LEO CHAOS INDEX',
      distLabel: 'MIN MISS DISTANCE',
      timeLabel: 'TCA TIMER',
      chaosLabel: 'ORBITAL SATURATION'
    }
  };

  // Инициализируем независимые частицы мусора с уникальными орбитальными скоростями
  const debrisParticles = useRef(
    Array.from({ length: 160 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 35 + Math.random() * 240,
      speed: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.4 ? 1 : -1),
      size: Math.random() * 2 + 0.8,
      threat: Math.random() > 0.82
    }))
  ).current;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let angleSweep = 0;

    const render = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth - 30;
      canvas.height = canvas.parentElement.clientHeight - 50;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Радарные концентрические сетки
      ctx.strokeStyle = 'rgba(255, 0, 85, 0.12)';
      ctx.lineWidth = 1;
      [50, 100, 150, 200, 250].forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Перекрестие
      ctx.strokeStyle = 'rgba(255, 0, 85, 0.25)';
      ctx.beginPath();
      ctx.moveTo(cx - 280, cy); ctx.lineTo(cx + 280, cy);
      ctx.moveTo(cx, cy - 280); ctx.lineTo(cx, cy + 280);
      ctx.stroke();

      // Сканирующий луч радара
      angleSweep += 0.025;
      const scanX = cx + Math.cos(angleSweep) * 280;
      const scanY = cy + Math.sin(angleSweep) * 280;
      
      const grad = ctx.createLinearGradient(cx, cy, scanX, scanY);
      grad.addColorStop(0, 'rgba(255, 0, 85, 0.45)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 280, angleSweep - 0.35, angleSweep, false);
      ctx.lineTo(cx, cy);
      ctx.fill();

      // Цель в центре (выбранный спутник)
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Независимое движение каждого обломка по орбите (без хоровода)
      debrisParticles.forEach(p => {
        p.angle += p.speed; // каждый крутится со своей скоростью и в свою сторону
        const posX = cx + Math.cos(p.angle) * p.radius;
        const posY = cy + Math.sin(p.angle) * p.radius;

        ctx.fillStyle = p.threat ? '#ff0055' : '#ff9900';
        ctx.shadowColor = p.threat ? '#ff0055' : 'transparent';
        ctx.shadowBlur = p.threat ? 8 : 0;
        ctx.beginPath();
        ctx.arc(posX, posY, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [targetName]);

  // Честный стабильный таймер обратного отсчета без багов с цифрами
  useEffect(() => {
    const satHash = targetName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    
    const interval = setInterval(() => {
      const totalSec = Math.floor(Date.now() / 1000) + satHash;
      const remainingSeconds = 120 - (totalSec % 120); // цикл на 2 минуты
      
      const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
      const secs = String(remainingSeconds % 60).padStart(2, '0');

      const missDist = (75 + ((satHash * 13 + totalSec * 7) % 180)).toFixed(1);

      setDebrisStats({
        missDistance: missDist + ' m',
        timeToImpact: `00:${mins}:${secs}`,
        chaosIndex: (98.2 + ((satHash % 15) * 0.1)).toFixed(1) + '%',
        threatLevel: remainingSeconds < 30 ? 'CRITICAL EVASION' : 'WARNING'
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetName]);

  return (
    <div className="c2-deck">
      <div className="c2-atmosphere" />
      <header className="c2-header c2-header--sticky" style={{ borderColor: 'rgba(255,60,126,0.35)' }}>
        <h1 className="c2-page-title c2-page-title--plasma">{t[lang].header}</h1>
        <C2Nav activePage={activePage} onNavigate={onNavigate} />
      </header>

      <div className="c2-matrix-grid c2-matrix-grid--wide">
        <div className="c2-col">
          <div className="c2-panel c2-panel--pad c2-panel--plasma c2-panel--fill" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
            <div className="c2-panel__sheen" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="c2-label" style={{ color: 'var(--plasma)', fontFamily: 'var(--font-display)' }}>{t[lang].q1Title}</span>
              <span className="c2-chip c2-chip--alert">ACTIVE VECTOR</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="c2-label">{t[lang].distLabel}</div>
              <div className="c2-value c2-value--lg">{debrisStats.missDistance}</div>
            </div>
            <div className="c2-muted">Target: {targetName}</div>
          </div>

          <div className="c2-panel c2-panel--pad c2-panel--plasma c2-panel--fill" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
            <div className="c2-panel__sheen" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="c2-label" style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)' }}>{t[lang].q2Title}</span>
              <span className="c2-chip c2-chip--alert">{debrisStats.threatLevel}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="c2-label">{t[lang].timeLabel}</div>
              <div className="c2-value c2-value--lg c2-value--danger">{debrisStats.timeToImpact}</div>
            </div>
            <div className="c2-muted">Calculated via TLE relative vectors</div>
          </div>

          <div className="c2-panel c2-panel--pad c2-panel--plasma c2-panel--fill" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px' }}>
            <div className="c2-panel__sheen" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="c2-label" style={{ color: 'var(--signal)', fontFamily: 'var(--font-display)' }}>{t[lang].q3Title}</span>
              <span className="c2-chip c2-chip--live">CRITICAL</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="c2-label">{t[lang].chaosLabel}</div>
              <div className="c2-value c2-value--lg c2-value--amber">{debrisStats.chaosIndex}</div>
            </div>
            <div className="c2-muted">Low Earth Orbit congestion matrix</div>
          </div>
        </div>

        <div className="c2-panel c2-panel--pad c2-panel--plasma" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="c2-panel__sheen" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="c2-page-title c2-page-title--plasma" style={{ fontSize: '0.8rem' }}>{t[lang].radarTitle}</span>
            <span className="c2-chip c2-chip--alert">LIVE STREAM</span>
          </div>
          <div className="c2-canvas-well c2-canvas-well--plasma">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
