import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import EarthScene from './components/EarthScene';
import SatInspector from './components/SatInspector';
import DsnDashboard from './components/DsnDashboard';
import PassPrediction from './components/PassPrediction';
import CommandLog from './components/CommandLog';
import RealtimeMatrixView from './components/RealtimeMatrixView';
import DeepTelemetryMatrix from './components/DeepTelemetryMatrix';
import SolarMatrixView from './components/SolarMatrixView';
import BlackHoleMatrixView from './components/BlackHoleMatrixView';
import DebrisMatrixView from './components/DebrisMatrixView';
import useStore from './store/useStore';

export default function App() {
  const [activePage, setActivePage] = useState('main');
  const { lang, setLang, showDebris, toggleDebris } = useStore();

  const t = {
    RU: {
      title: 'ORBITAL C2 // HUD',
      matrixBtn: 'ОРБИТЫ [2]',
      deepBtn: 'СЕНСОРЫ [3]',
      solarBtn: 'СОЛНЦЕ [4]',
      bhBtn: 'ДЫРА [5]',
      debrisBtn: 'МУСОР [6]',
      debrisOn: 'МУСОР: ВКЛ',
      debrisOff: 'МУСОР: ВЫКЛ'
    },
    EN: {
      title: 'ORBITAL C2 // HUD',
      matrixBtn: 'ORBITS [2]',
      deepBtn: 'SENSORS [3]',
      solarBtn: 'SOLAR [4]',
      bhBtn: 'BLACK HOLE [5]',
      debrisBtn: 'DEBRIS [6]',
      debrisOn: 'DEBRIS: ON',
      debrisOff: 'DEBRIS: OFF'
    }
  };

  if (activePage === 'matrix') {
    return <RealtimeMatrixView onSwitch={() => setActivePage('main')} />;
  }

  if (activePage === 'deepMatrix') {
    return <DeepTelemetryMatrix onSwitch={() => setActivePage('main')} />;
  }

  if (activePage === 'solarMatrix') {
    return <SolarMatrixView onSwitch={() => setActivePage('main')} />;
  }

  if (activePage === 'blackHole') {
    return <BlackHoleMatrixView onSwitch={() => setActivePage('main')} />;
  }

  if (activePage === 'debrisMatrix') {
    return <DebrisMatrixView onSwitch={() => setActivePage('main')} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050508', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1rem', padding: '0.8rem 1.5rem', fontFamily: 'Orbitron, sans-serif', flexShrink: 0 }}>
        <div style={{ color: '#00f0ff', fontWeight: 'bold', fontSize: '0.9rem' }}>{t[lang].title}</div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,240,255,0.4)', color: '#00f0ff', padding: '0.4rem 0.7rem', borderRadius: '0.4rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: '0.75rem' }}>
            {lang}
          </button>
          <button onClick={() => setActivePage('matrix')} style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: '0.75rem' }}>
            {t[lang].matrixBtn}
          </button>
          <button onClick={() => setActivePage('deepMatrix')} style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid #ff0055', color: '#ff0055', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: '0.75rem' }}>
            {t[lang].deepBtn}
          </button>
          <button onClick={() => setActivePage('solarMatrix')} style={{ background: 'rgba(255,153,0,0.1)', border: '1px solid #ff9900', color: '#ff9900', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: '0.75rem' }}>
            {t[lang].solarBtn}
          </button>
          <button onClick={() => setActivePage('blackHole')} style={{ background: 'rgba(255,100,0,0.1)', border: '1px solid #ff6400', color: '#ff9900', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: '0.75rem' }}>
            {t[lang].bhBtn}
          </button>
          <button onClick={() => setActivePage('debrisMatrix')} style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid #ff0055', color: '#ff0055', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: '0.75rem' }}>
            {t[lang].debrisBtn}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', overflow: 'hidden' }}>
          <div style={{ flex: 1.4, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', overflow: 'hidden', position: 'relative' }}>
            <button 
              onClick={toggleDebris} 
              style={{
                position: 'absolute', top: '1rem', left: '1rem', zIndex: 20,
                background: showDebris ? 'rgba(255,60,126,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${showDebris ? '#ff3c7e' : 'rgba(255,255,255,0.2)'}`,
                color: showDebris ? '#ff3c7e' : 'rgba(255,255,255,0.5)',
                padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer',
                fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: '0.7rem'
              }}
            >
              {showDebris ? t[lang].debrisOn : t[lang].debrisOff}
            </button>

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
