#!/bin/bash
set -e

echo "Фиксим баги таймера и убираем синхронный хоровод с радара..."

cat << 'DEBRIS_PAGE' > client/src/components/DebrisMatrixView.jsx
import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';

export default function DebrisMatrixView({ onSwitch }) {
  const { lang, setLang, selectedSat, satellites } = useStore();
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
      header: 'ОРБИТАЛЬНЫЙ C2 // СТРАНИЦА 6: МАТРИЦА КОСМИЧЕСКОГО МУСОРА И УГРОЗ',
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
      header: 'ORBITAL C2 // PAGE 6: SPACE DEBRIS & CONJUNCTION MATRIX',
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
    <div style={{ width: '100vw', height: '100vh', background: '#030305', padding: '1rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'Orbitron, sans-serif', overflow: 'hidden' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, rgba(255,0,85,0.08), rgba(0,240,255,0.02))', border: '1px solid rgba(255,0,85,0.35)', borderRadius: '1rem', padding: '0.8rem 1.5rem', flexShrink: 0 }}>
        <h1 style={{ color: '#ff0055', fontSize: '1rem', margin: 0, textShadow: '0 0 12px rgba(255,0,85,0.5)' }}>{t[lang].header}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,0,85,0.4)', color: '#ff0055', padding: '0.5rem 0.9rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
            LANG: {lang}
          </button>
          <button onClick={onSwitch} style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
            {t[lang].back}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 2.4fr', gap: '1rem', overflow: 'hidden' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          <div style={{ background: 'rgba(5,5,8,0.7)', border: '1px solid rgba(255,0,85,0.25)', borderRadius: '1.2rem', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(10px)', flex: 1, minHeight: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ff0055', fontSize: '0.8rem', fontWeight: 'bold' }}>{t[lang].q1Title}</span>
              <span style={{ color: '#ff0055', fontSize: '0.65rem', background: 'rgba(255,0,85,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}>ACTIVE VECTOR</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{t[lang].distLabel}</div>
              <div style={{ fontSize: '1.6rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.2rem', textShadow: '0 0 15px rgba(0,240,255,0.4)' }}>{debrisStats.missDistance}</div>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Target: {targetName}</div>
          </div>

          <div style={{ background: 'rgba(5,5,8,0.7)', border: '1px solid rgba(255,0,85,0.25)', borderRadius: '1.2rem', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(10px)', flex: 1, minHeight: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#ff9900', fontSize: '0.8rem', fontWeight: 'bold' }}>{t[lang].q2Title}</span>
              <span style={{ color: '#ff0055', fontSize: '0.65rem', background: 'rgba(255,0,85,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}>{debrisStats.threatLevel}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{t[lang].timeLabel}</div>
              <div style={{ fontSize: '1.6rem', color: '#ff0055', fontWeight: 'bold', marginTop: '0.2rem', textShadow: '0 0 15px rgba(255,0,85,0.4)' }}>{debrisStats.timeToImpact}</div>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Calculated via TLE relative vectors</div>
          </div>

          <div style={{ background: 'rgba(5,5,8,0.7)', border: '1px solid rgba(255,0,85,0.25)', borderRadius: '1.2rem', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(10px)', flex: 1, minHeight: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#00ff66', fontSize: '0.8rem', fontWeight: 'bold' }}>{t[lang].q3Title}</span>
              <span style={{ color: '#00ff66', fontSize: '0.65rem', background: 'rgba(0,255,102,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}>CRITICAL</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{t[lang].chaosLabel}</div>
              <div style={{ fontSize: '1.3rem', color: '#ffcc00', fontWeight: 'bold', marginTop: '0.2rem', textShadow: '0 0 15px rgba(255,204,0,0.5)' }}>{debrisStats.chaosIndex}</div>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Low Earth Orbit congestion matrix</div>
          </div>
        </div>

        <div style={{ background: 'rgba(5,5,8,0.7)', border: '1px solid rgba(255,0,85,0.3)', borderRadius: '1.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
            <span style={{ color: '#ff0055', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>{t[lang].radarTitle}</span>
            <span style={{ color: '#ff0055', fontSize: '0.7rem', background: 'rgba(255,0,85,0.1)', border: '1px solid rgba(255,0,85,0.3)', padding: '0.3rem 0.7rem', borderRadius: '0.4rem', boxShadow: '0 0 10px rgba(255,0,85,0.2)' }}>LIVE STREAM</span>
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '1rem', background: '#010103', border: '1px solid rgba(255,0,85,0.15)' }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
          </div>
        </div>

      </div>
    </div>
  );
}
DEBRIS_PAGE

echo "Радар и таймер приведены в порядок."
