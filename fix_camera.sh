#!/bin/bash
set -e

echo "Отодвигаем камеру на безопасную орбиту..."

# 1. Исправляем App.jsx — ставим камеру дальше (на [0, 12, 38])
cat << 'EOF' > client/src/App.jsx
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import EarthScene from './components/EarthScene';
import SatInspector from './components/SatInspector';
import DsnDashboard from './components/DsnDashboard';
import PassPrediction from './components/PassPrediction';
import CommandLog from './components/CommandLog';
import RealtimeMatrixView from './components/RealtimeMatrixView';
import DeepTelemetryMatrix from './components/DeepTelemetryMatrix';

export default function App() {
  const [activePage, setActivePage] = useState('main');

  if (activePage === 'matrix') {
    return <RealtimeMatrixView onSwitch={() => setActivePage('main')} />;
  }

  if (activePage === 'deepMatrix') {
    return <DeepTelemetryMatrix onSwitch={() => setActivePage('main')} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050508', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1rem', padding: '0.8rem 1.5rem', fontFamily: 'Orbitron, sans-serif', flexShrink: 0 }}>
        <div style={{ color: '#00f0ff', fontWeight: 'bold', fontSize: '1rem' }}>ORBITAL C2 // MAIN MONITORING HUD</div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setActivePage('matrix')} style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
            СТРАНИЦА 2 [МАТРИЦА ОРБИТ]
          </button>
          <button onClick={() => setActivePage('deepMatrix')} style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid #ff0055', color: '#ff0055', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
            СТРАНИЦА 3 [ХАРДКОРНЫЕ СЕНСОРЫ]
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', overflow: 'hidden' }}>
          <div style={{ flex: 1.4, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', overflow: 'hidden', position: 'relative' }}>
            <Canvas camera={{ position: [0, 12, 38], fov: 45 }}>
              <EarthScene />
            </Canvas>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', overflowY: 'auto' }}>
            <SatInspector />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', overflow: 'hidden' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', overflowY: 'auto' }}>
            <DsnDashboard />
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', overflowY: 'auto' }}>
            <PassPrediction />
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', overflowY: 'auto' }}>
            <CommandLog />
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo "Камера перенастроена. Проверяй визуал."
