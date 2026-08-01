import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import EarthScene from './components/EarthScene';
import SatInspector from './components/SatInspector';
import DsnDashboard from './components/DsnDashboard';
import PassPrediction from './components/PassPrediction';
import CommandLog from './components/CommandLog';
import C2Nav from './components/C2Nav';
import RealtimeMatrixView from './components/RealtimeMatrixView';
import DeepTelemetryMatrix from './components/DeepTelemetryMatrix';
import SolarMatrixView from './components/SolarMatrixView';
import BlackHoleMatrixView from './components/BlackHoleMatrixView';
import DebrisMatrixView from './components/DebrisMatrixView';
import useStore from './store/useStore';

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
};

export default function App() {
  const [activePage, setActivePage] = useState('main');
  const { lang, showDebris, toggleDebris } = useStore();

  const t = {
    RU: {
      title: 'ORBITAL C2',
      subtitle: 'ELITE COMMAND DECK',
      debrisOn: 'МУСОР: ВКЛ',
      debrisOff: 'МУСОР: ВЫКЛ'
    },
    EN: {
      title: 'ORBITAL C2',
      subtitle: 'ELITE COMMAND DECK',
      debrisOn: 'DEBRIS: ON',
      debrisOff: 'DEBRIS: OFF'
    }
  };

  if (activePage === 'matrix') {
    return <RealtimeMatrixView activePage={activePage} onNavigate={setActivePage} />;
  }

  if (activePage === 'deepMatrix') {
    return <DeepTelemetryMatrix activePage={activePage} onNavigate={setActivePage} />;
  }

  if (activePage === 'solarMatrix') {
    return <SolarMatrixView activePage={activePage} onNavigate={setActivePage} />;
  }

  if (activePage === 'blackHole') {
    return <BlackHoleMatrixView activePage={activePage} onNavigate={setActivePage} />;
  }

  if (activePage === 'debrisMatrix') {
    return <DebrisMatrixView activePage={activePage} onNavigate={setActivePage} />;
  }

  return (
    <div className="c2-deck">
      <div className="c2-atmosphere" />

      <motion.header
        className="c2-header c2-header--sticky"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="c2-brand">
          <div className="c2-brand__mark">
            <span className="c2-brand__ring" />
            <span className="c2-brand__ring c2-brand__ring--delayed" />
            <span className="c2-brand__core" />
          </div>
          <div className="c2-brand__text">
            <div className="c2-brand__title">
              <span>{t[lang].title}</span> // HUD
            </div>
            <span className="c2-brand__sub">{t[lang].subtitle}</span>
          </div>
        </div>

        <C2Nav activePage={activePage} onNavigate={setActivePage} />
      </motion.header>

      <div className="c2-grid">
        <div className="c2-col c2-col--primary">
          <motion.div
            className="c2-panel c2-panel--globe"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
          >
            <div className="c2-panel__sheen" />
            <div className="c2-scanline" />
            <button
              type="button"
              onClick={toggleDebris}
              className={`c2-btn c2-btn--overlay ${showDebris ? 'c2-btn--active' : 'c2-btn--ghost'}`}
            >
              {showDebris ? t[lang].debrisOn : t[lang].debrisOff}
            </button>
            <Canvas camera={{ position: [0, 12, 38], fov: 45 }}>
              <EarthScene />
            </Canvas>
          </motion.div>

          <motion.div
            className="c2-panel c2-panel--pad c2-panel--fill"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.12 }}
          >
            <div className="c2-panel__sheen" />
            <SatInspector />
          </motion.div>
        </div>

        <div className="c2-col c2-col--secondary">
          <motion.div
            className="c2-panel c2-panel--pad c2-panel--fill"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
          >
            <div className="c2-panel__sheen" />
            <DsnDashboard />
          </motion.div>
          <motion.div
            className="c2-panel c2-panel--pad c2-panel--fill"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.16 }}
          >
            <div className="c2-panel__sheen" />
            <PassPrediction />
          </motion.div>
          <motion.div
            className="c2-panel c2-panel--pad c2-panel--fill"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.22 }}
          >
            <div className="c2-panel__sheen" />
            <CommandLog />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
