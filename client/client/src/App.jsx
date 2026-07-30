import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiRadio, FiSun, FiCpu, FiMapPin, FiTrash2 } from 'react-icons/fi';
import useStore from './store/useStore';
import EarthScene from './components/EarthScene';
import DsnDashboard from './components/DsnDashboard';
import SolarFeed from './components/SolarFeed';
import Spectrogram from './components/Spectrogram';
import TargetInfo from './components/TargetInfo';
import PassPrediction from './components/PassPrediction';
import './i18n';

const tabConfig = [
  { id: 'orbital', label: 'Orbital Traffic', icon: FiGlobe },
  { id: 'dsn', label: 'Deep Space Network', icon: FiRadio },
  { id: 'spectrogram', label: 'Spectrogram', icon: FiCpu },
  { id: 'solar', label: 'Solar Weather', icon: FiSun },
  { id: 'passes', label: 'Pass Predictions', icon: FiMapPin },
  { id: 'debris', label: 'Space Debris', icon: FiTrash2 },
];

const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, scale: 0.96, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function App() {
  const { activeTab, setActiveTab, conjunctions } = useStore();
  const [time, setTime] = useState(new Date().toUTCString());
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toUTCString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-container">
      <div className="three-bg">
        <Canvas camera={{ position: [0, 20, 50], fov: 45 }}>
          <EarthScene />
        </Canvas>
        <div className="gradient-overlay" />
      </div>
      <div className="ui-overlay">
        <header className="main-header">
          <div className="brand">
            <div className="logo-pulse">
              <div className="pulse-ring" />
              <span className="logo-icon">🛸</span>
            </div>
            <h1 className="brand-title">
              ORBITAL<span className="highlight">CMD</span>
            </h1>
          </div>
          <nav className="tab-nav">
            {tabConfig.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${isActive ? 'active' : ''}`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="tab-icon" />
                  <span className="tab-label">{t(tab.id)}</span>
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="tab-indicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
          <div className="lang-switch">
            <button onClick={() => i18n.changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>EN</button>
            <button onClick={() => i18n.changeLanguage('ru')} className={i18n.language === 'ru' ? 'active' : ''}>RU</button>
          </div>
        </header>
        <main className="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="page-panel"
            >
              {activeTab === 'orbital' && (
                <div className="orbital-hero">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hero-title"
                  >
                    ORBITAL TRAFFIC
                  </motion.h2>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="hero-stats"
                  >
                    <div className="stat-item">
                      <span className="stat-value">20,000+</span>
                      <span className="stat-label">Objects Tracked</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">Live</span>
                      <span className="stat-label">Data Feed</span>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="hero-hint"
                  >
                    <span className="pulse-dot" />
                    CLICK SATELLITE TO LOCK TARGET
                  </motion.div>
                </div>
              )}
              {activeTab === 'dsn' && <DsnDashboard />}
              {activeTab === 'solar' && <SolarFeed />}
              {activeTab === 'spectrogram' && <Spectrogram />}
              {activeTab === 'passes' && <PassPrediction />}
              {activeTab === 'debris' && (
                <div className="debris-placeholder">
                  <FiTrash2 size={48} className="text-gray-500" />
                  <p>Debris visualization integrated into 3D Earth (red dots)</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="status-bar">
          <div className="status-left">
            <span className="status-dot online" />
            <span>SYS: ONLINE</span>
            <span className="status-separator">|</span>
            <span>UPLINK: SECURE</span>
            {conjunctions.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="conjunction-alert"
              >
                ⚠️ {conjunctions.length} CONJUNCTIONS
              </motion.span>
            )}
          </div>
          <div className="status-right">
            <span className="time-display">{time}</span>
          </div>
        </footer>
      </div>
      <TargetInfo />
    </div>
  );
}
