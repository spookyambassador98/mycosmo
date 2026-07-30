#!/bin/bash
echo "=== Orbital Command Node: ПОЛНЫЙ РЕДИЗАЙН (AWWWARD STYLE) ==="

# --- Зависимости ---
echo "Устанавливаем react-icons..."
cd client && npm install react-icons@^4.11.0 && cd ..

# --- Перезаписываем package.json клиента (добавляем react-icons) ---
cat > client/package.json << 'PKG'
{
  "name": "ocn-client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-three/drei": "^9.88.0",
    "@react-three/fiber": "^8.15.0",
    "framer-motion": "^10.16.4",
    "gsap": "^3.12.2",
    "i18next": "^23.7.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^13.3.1",
    "react-icons": "^4.11.0",
    "satellite.js": "^5.0.0",
    "socket.io-client": "^4.7.2",
    "three": "^0.158.0",
    "zustand": "^4.4.6"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@types/three": "^0.158.2",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^5.0.0"
  }
}
PKG

# --- index.html с шрифтами ---
cat > client/index.html << 'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Orbital Command Node</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
HTML

# --- App.jsx (главный лейаут) ---
cat > client/src/App.jsx << 'APP'
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
APP

# --- Стили index.css (Awwward style) ---
cat > client/src/styles/index.css << 'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;600;700&display=swap');

:root {
  --primary: #00f0ff;
  --secondary: #7b2ffc;
  --accent: #ff3c7e;
  --glass: rgba(255,255,255,0.05);
  --glass-border: rgba(255,255,255,0.1);
  --shadow: 0 25px 50px -12px rgba(0,0,0,0.8);
}

* { margin:0; padding:0; box-sizing:border-box; }
html, body, #root { width:100%; height:100%; overflow:hidden; background:#0a0a0f; color:#fff; font-family:'Inter',sans-serif; }

.app-container { position:relative; width:100vw; height:100vh; overflow:hidden; }
.three-bg { position:absolute; inset:0; z-index:0; }
.gradient-overlay { position:absolute; inset:0; background:radial-gradient(ellipse at center, transparent 40%, rgba(10,10,15,0.7) 100%); pointer-events:none; }
.ui-overlay { position:relative; z-index:10; display:flex; flex-direction:column; height:100%; padding:1.5rem 2rem 0.5rem; backdrop-filter:blur(2px); }

.main-header { display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1.5rem; background:var(--glass); backdrop-filter:blur(20px); border:1px solid var(--glass-border); border-radius:2rem; box-shadow:var(--shadow); margin-bottom:1.5rem; }
.brand { display:flex; align-items:center; gap:0.75rem; }
.logo-pulse { position:relative; width:40px; height:40px; display:flex; align-items:center; justify-content:center; }
.pulse-ring { position:absolute; inset:0; border-radius:50%; border:2px solid var(--primary); animation:pulse-ring 2s ease-out infinite; }
.logo-icon { font-size:1.5rem; z-index:1; }
@keyframes pulse-ring { 0%{transform:scale(0.8);opacity:0.8;} 100%{transform:scale(1.4);opacity:0;} }
.brand-title { font-family:'Orbitron',sans-serif; font-weight:900; font-size:1.8rem; letter-spacing:0.05em; background:linear-gradient(135deg,#fff,#a0aec0); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.brand-title .highlight { background:linear-gradient(135deg,var(--primary),var(--secondary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }

.tab-nav { display:flex; gap:0.5rem; background:rgba(0,0,0,0.3); padding:0.25rem; border-radius:2rem; backdrop-filter:blur(10px); border:1px solid var(--glass-border); }
.tab-btn { position:relative; display:flex; align-items:center; gap:0.5rem; padding:0.6rem 1.2rem; border:none; background:transparent; color:rgba(255,255,255,0.5); font-family:'Inter',sans-serif; font-weight:600; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em; border-radius:2rem; cursor:pointer; transition:all 0.3s ease; }
.tab-btn:hover { color:#fff; background:rgba(255,255,255,0.05); }
.tab-btn.active { color:#fff; }
.tab-icon { font-size:1.1rem; }
.tab-indicator { position:absolute; inset:0; background:linear-gradient(135deg,rgba(0,240,255,0.2),rgba(123,47,252,0.2)); border-radius:2rem; border:1px solid rgba(0,240,255,0.3); box-shadow:0 0 30px rgba(0,240,255,0.1); z-index:-1; }

.lang-switch { display:flex; gap:0.25rem; background:rgba(0,0,0,0.3); padding:0.25rem; border-radius:2rem; }
.lang-switch button { padding:0.3rem 0.8rem; border:none; background:transparent; color:rgba(255,255,255,0.5); font-weight:600; font-size:0.75rem; border-radius:2rem; cursor:pointer; transition:all 0.3s ease; }
.lang-switch button.active { background:rgba(0,240,255,0.2); color:#fff; box-shadow:0 0 15px rgba(0,240,255,0.1); }

.main-content { flex:1; position:relative; overflow:hidden; margin:0 -0.5rem; }
.page-panel { position:absolute; inset:0; padding:1.5rem 2rem; background:var(--glass); backdrop-filter:blur(20px); border:1px solid var(--glass-border); border-radius:2rem; box-shadow:var(--shadow); overflow-y:auto; }

.orbital-hero { display:flex; flex-direction:column; justify-content:center; height:100%; padding:2rem; }
.hero-title { font-family:'Orbitron',sans-serif; font-weight:900; font-size:4.5rem; background:linear-gradient(135deg,#fff,var(--primary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:2rem; }
.hero-stats { display:flex; gap:4rem; margin-bottom:3rem; }
.stat-item { display:flex; flex-direction:column; }
.stat-value { font-family:'Orbitron',sans-serif; font-size:3rem; font-weight:700; color:var(--primary); text-shadow:0 0 40px rgba(0,240,255,0.2); }
.stat-label { font-size:0.8rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.5); }
.hero-hint { display:flex; align-items:center; gap:0.75rem; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.2em; color:rgba(255,255,255,0.4); border:1px solid var(--glass-border); padding:0.5rem 1.5rem; border-radius:2rem; width:fit-content; backdrop-filter:blur(10px); }
.pulse-dot { width:8px; height:8px; background:var(--primary); border-radius:50%; animation:pulse-dot 1.5s ease-in-out infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.3;transform:scale(0.6);} }

.debris-placeholder { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:rgba(255,255,255,0.3); gap:1rem; }

.status-bar { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 1.5rem; margin-top:0.5rem; background:var(--glass); backdrop-filter:blur(20px); border:1px solid var(--glass-border); border-radius:2rem; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.05em; color:rgba(255,255,255,0.5); }
.status-left { display:flex; align-items:center; gap:1rem; }
.status-dot { width:8px; height:8px; border-radius:50%; display:inline-block; }
.status-dot.online { background:#00ff88; box-shadow:0 0 15px #00ff88; animation:pulse-dot 2s ease-in-out infinite; }
.status-separator { color:rgba(255,255,255,0.1); }
.conjunction-alert { color:#ff3c7e; font-weight:700; padding:0.15rem 0.8rem; border:1px solid rgba(255,60,126,0.3); border-radius:2rem; background:rgba(255,60,126,0.1); }
.time-display { font-family:'Orbitron',sans-serif; font-weight:400; color:rgba(255,255,255,0.7); }

.page-panel h2 { font-family:'Orbitron',sans-serif; font-weight:700; font-size:2rem; margin-bottom:1.5rem; background:linear-gradient(135deg,#fff,var(--primary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
::-webkit-scrollbar { width:4px; }
::-webkit-scrollbar-track { background:rgba(255,255,255,0.05); border-radius:4px; }
::-webkit-scrollbar-thumb { background:var(--primary); border-radius:4px; }

/* DSN */
.dsn-container { height:100%; display:flex; flex-direction:column; }
.dsn-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1.5rem; flex:1; overflow-y:auto; padding:0.5rem 0; }
.dsn-empty { grid-column:1/-1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:rgba(255,255,255,0.3); gap:1rem; }
.dsn-card { background:rgba(255,255,255,0.03); backdrop-filter:blur(10px); border:1px solid var(--glass-border); border-radius:1.5rem; padding:1.5rem; transition:all 0.3s ease; }
.dsn-card:hover { border-color:rgba(0,240,255,0.3); box-shadow:0 0 30px rgba(0,240,255,0.05); }
.dsn-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }
.dsn-card-header h3 { font-family:'Orbitron',sans-serif; font-size:1rem; font-weight:700; color:#fff; }
.dsn-badge { font-size:0.6rem; padding:0.2rem 0.6rem; border:1px solid var(--glass-border); border-radius:2rem; color:rgba(255,255,255,0.5); }
.dsn-card-body { display:flex; flex-direction:column; gap:0.6rem; }
.dsn-row { display:flex; align-items:center; gap:0.6rem; font-size:0.8rem; }
.dsn-icon { color:var(--primary); opacity:0.7; }
.dsn-label { color:rgba(255,255,255,0.4); flex:1; }
.dsn-value { color:#fff; font-weight:600; }

/* Solar */
.solar-container { height:100%; display:flex; flex-direction:column; gap:1.5rem; }
.solar-header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; }
.solar-alert { display:flex; align-items:center; gap:0.5rem; background:rgba(255,60,126,0.15); border:1px solid rgba(255,60,126,0.3); padding:0.4rem 1.2rem; border-radius:2rem; color:#ff3c7e; font-weight:700; font-size:0.8rem; }
.solar-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; flex:1; }
.solar-card { background:rgba(255,255,255,0.03); border:1px solid var(--glass-border); border-radius:1.5rem; overflow:hidden; display:flex; flex-direction:column; transition:all 0.3s ease; }
.solar-card:hover { border-color:rgba(0,240,255,0.2); box-shadow:0 0 40px rgba(0,240,255,0.05); }
.solar-card-header { display:flex; align-items:center; gap:0.5rem; padding:0.8rem 1.2rem; font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:rgba(255,255,255,0.6); background:rgba(0,0,0,0.3); }
.live-dot { width:8px; height:8px; background:#ff3c7e; border-radius:50%; animation:pulse-dot 1.5s ease-in-out infinite; }
.sdo-dot { width:8px; height:8px; background:#fbbf24; border-radius:50%; animation:pulse-dot 2s ease-in-out infinite; }
.solar-iframe-wrapper { flex:1; position:relative; padding-bottom:56.25%; height:0; }
.solar-iframe-wrapper iframe { position:absolute; top:0; left:0; width:100%; height:100%; }
.solar-image-wrapper { flex:1; overflow:hidden; }
.solar-image { width:100%; height:100%; object-fit:cover; opacity:0.8; transition:opacity 0.3s; }
.solar-image:hover { opacity:1; }
.solar-flares { margin-top:1rem; border-top:1px solid var(--glass-border); padding-top:1rem; }
.flares-label { font-size:0.7rem; text-transform:uppercase; letter-spacing:0.1em; color:rgba(255,255,255,0.3); margin-bottom:0.5rem; }
.flares-list { display:flex; gap:0.5rem; flex-wrap:wrap; }
.flare-item { background:rgba(255,255,255,0.05); padding:0.2rem 0.8rem; border-radius:2rem; font-size:0.7rem; border:1px solid var(--glass-border); }
.flare-class { color:#fbbf24; font-weight:700; margin-right:0.3rem; }
.flare-location { color:rgba(255,255,255,0.5); }

/* Spectrogram */
.spectrogram-container { height:100%; display:flex; flex-direction:column; gap:1rem; }
.spectrogram-header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; }
.spectrogram-badge { display:flex; align-items:center; gap:0.3rem; font-size:0.7rem; color:var(--primary); background:rgba(0,240,255,0.1); padding:0.2rem 1rem; border-radius:2rem; border:1px solid rgba(0,240,255,0.2); }
.spectrogram-canvas-wrapper { flex:1; background:#0a0a0f; border-radius:1.5rem; border:1px solid var(--glass-border); overflow:hidden; display:flex; flex-direction:column; }
.spectrogram-channels { display:flex; justify-content:space-between; padding:0.3rem 1rem; font-size:0.6rem; color:rgba(255,255,255,0.3); border-bottom:1px solid var(--glass-border); background:rgba(0,0,0,0.3); }
.spectrogram-canvas { width:100%; flex:1; display:block; }

/* Pass Prediction */
.pass-container { height:100%; display:flex; flex-direction:column; gap:1.5rem; }
.pass-controls { display:flex; gap:1.5rem; align-items:flex-end; flex-wrap:wrap; }
.pass-input-group { display:flex; flex-direction:column; gap:0.2rem; }
.pass-input-group label { font-size:0.65rem; text-transform:uppercase; letter-spacing:0.05em; color:rgba(255,255,255,0.4); }
.pass-input-group input { background:rgba(255,255,255,0.05); border:1px solid var(--glass-border); border-radius:2rem; padding:0.4rem 1rem; color:#fff; font-size:0.9rem; width:130px; outline:none; transition:border 0.3s; }
.pass-input-group input:focus { border-color:var(--primary); }
.pass-update-btn { background:linear-gradient(135deg,var(--primary),var(--secondary)); border:none; padding:0.4rem 1.8rem; border-radius:2rem; font-weight:700; color:#fff; cursor:pointer; display:flex; align-items:center; gap:0.5rem; transition:all 0.3s; font-size:0.8rem; }
.pass-update-btn:disabled { opacity:0.5; cursor:not-allowed; }
.spin { animation:spin 1s linear infinite; }
@keyframes spin { 100%{transform:rotate(360deg);} }
.pass-list { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:0.5rem; }
.pass-empty { text-align:center; color:rgba(255,255,255,0.3); margin-top:2rem; }
.pass-item { display:flex; justify-content:space-between; align-items:center; padding:0.6rem 1rem; background:rgba(255,255,255,0.02); border-radius:1rem; border:1px solid var(--glass-border); transition:all 0.2s; }
.pass-item:hover { border-color:rgba(0,240,255,0.2); background:rgba(255,255,255,0.04); }
.pass-info { display:flex; flex-direction:column; }
.pass-name { font-weight:600; font-size:0.9rem; color:#fff; }
.pass-time { font-size:0.7rem; color:rgba(255,255,255,0.4); }
.pass-metrics { display:flex; gap:1rem; font-size:0.8rem; }
.pass-elevation { color:var(--primary); font-weight:600; }
.pass-duration { color:rgba(255,255,255,0.5); }

/* Target Panel */
.target-panel { position:fixed; top:50%; right:2rem; transform:translateY(-50%); width:300px; background:rgba(10,10,15,0.85); backdrop-filter:blur(30px); border:1px solid rgba(0,240,255,0.2); border-radius:2rem; padding:1.5rem; box-shadow:0 0 60px rgba(0,240,255,0.1); z-index:100; }
.target-glow { position:absolute; inset:-1px; border-radius:2rem; background:linear-gradient(135deg,rgba(0,240,255,0.1),rgba(123,47,252,0.1)); z-index:-1; }
.target-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem; }
.target-title { display:flex; align-items:center; gap:0.5rem; font-size:0.6rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--primary); }
.target-close { background:none; border:none; color:rgba(255,255,255,0.3); cursor:pointer; font-size:1.2rem; transition:color 0.2s; }
.target-close:hover { color:#fff; }
.target-name { font-family:'Orbitron',sans-serif; font-size:1.2rem; font-weight:700; margin-bottom:1rem; color:#fff; }
.target-details { display:flex; flex-direction:column; gap:0.4rem; font-size:0.75rem; }
.target-details div { display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.2rem; }
.target-details span:first-child { color:rgba(255,255,255,0.4); }
.target-details span:last-child { color:#fff; font-weight:600; }
.target-tle { margin-top:1rem; border-top:1px solid var(--glass-border); padding-top:0.8rem; }
.tle-label { font-size:0.6rem; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:0.2rem; }
.tle-data { font-family:'Courier New',monospace; font-size:0.55rem; color:rgba(0,240,255,0.5); word-break:break-all; }
CSS

# --- Компоненты (краткие версии) ---
cat > client/src/components/DsnDashboard.jsx << 'DSN'
import React from 'react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';
import { FiAntenna, FiTarget, FiCompass } from 'react-icons/fi';

export default function DsnDashboard() {
  const dsn = useStore(state => state.dsn);
  const dishes = dsn?.dishes || [];
  return (
    <div className="dsn-container">
      <h2>Deep Space Network</h2>
      <div className="dsn-grid">
        {dishes.length===0?(
          <div className="dsn-empty"><FiAntenna size={48}/><p>Awaiting NASA XML stream...</p></div>
        ):(
          dishes.map((dish,idx)=>(
            <motion.div key={idx} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:idx*0.1}} className="dsn-card" whileHover={{y:-6}}>
              <div className="dsn-card-header"><h3>{dish.name||'ANTENNA'}</h3><span className="dsn-badge">{dish.band||'X/Ka'}</span></div>
              <div className="dsn-card-body">
                <div className="dsn-row"><FiTarget className="dsn-icon"/><span className="dsn-label">Target</span><span className="dsn-value">{dish.target||'IDLE'}</span></div>
                <div className="dsn-row"><FiCompass className="dsn-icon"/><span className="dsn-label">Azimuth</span><span className="dsn-value">{dish.azimuth||'000.00'}°</span></div>
                <div className="dsn-row"><FiCompass className="dsn-icon" style={{transform:'rotate(90deg)'}}/><span className="dsn-label">Elevation</span><span className="dsn-value">{dish.elevation||'00.00'}°</span></div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
DSN

cat > client/src/components/SolarFeed.jsx << 'SOLAR'
import React from 'react';
import useStore from '../store/useStore';
import { motion } from 'framer-motion';
import { FiSun, FiAlertCircle } from 'react-icons/fi';

export default function SolarFeed() {
  const solarFlares = useStore(state=>state.solarFlares);
  const solarAlert = useStore(state=>state.solarAlert);
  return (
    <div className="solar-container">
      <div className="solar-header">
        <h2>Solar Weather & Live Streams</h2>
        {solarAlert && <motion.div initial={{scale:0}} animate={{scale:1}} className="solar-alert"><FiAlertCircle/><span>FLARE {solarAlert.class} @ {solarAlert.location}</span></motion.div>}
      </div>
      <div className="solar-grid">
        <motion.div className="solar-card" whileHover={{scale:1.02}}>
          <div className="solar-card-header"><span className="live-dot"/>ISS HDEV LIVE</div>
          <div className="solar-iframe-wrapper"><iframe src="https://www.youtube.com/embed/86YLFOog4GM?autoplay=1&mute=1&controls=0" frameBorder="0" allowFullScreen title="ISS Live"/></div>
        </motion.div>
        <motion.div className="solar-card" whileHover={{scale:1.02}}>
          <div className="solar-card-header"><span className="sdo-dot"/>NASA SDO AIA 171</div>
          <div className="solar-image-wrapper"><img src="https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0171.jpg" alt="SDO" className="solar-image"/></div>
        </motion.div>
      </div>
      {solarFlares.length>0 && (
        <div className="solar-flares">
          <div className="flares-label">Recent Flares</div>
          <div className="flares-list">
            {solarFlares.slice(0,5).map((flare,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}} className="flare-item">
                <span className="flare-class">{flare.class}</span><span className="flare-location">{flare.location}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
SOLAR

cat > client/src/components/Spectrogram.jsx << 'SPECTRO'
import React, { useEffect, useRef } from 'react';
import { FiRadio } from 'react-icons/fi';

export default function Spectrogram() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas.getContext('2d');
    let animId;
    const resize = ()=>{ canvas.width = canvas.parentElement.clientWidth; canvas.height = canvas.parentElement.clientHeight - 40; };
    resize(); window.addEventListener('resize', resize);
    const history=[]; const maxRows=150;
    const draw = ()=>{
      const row = new Uint8Array(canvas.width);
      for(let i=0; i<canvas.width; i++){
        let v = Math.floor(Math.random()*40);
        if(Math.abs(i-canvas.width*0.25)<3) v=220+Math.random()*35;
        if(Math.abs(i-canvas.width*0.55)<2) v=250;
        if(Math.abs(i-canvas.width*0.8)<5) v=180+Math.random()*60;
        row[i]=v;
      }
      history.unshift(row); if(history.length>maxRows) history.pop();
      ctx.fillStyle='#0a0a0f'; ctx.fillRect(0,0,canvas.width,canvas.height);
      const imgData = ctx.createImageData(canvas.width, history.length);
      for(let y=0; y<history.length; y++){
        for(let x=0; x<canvas.width; x++){
          const v=history[y][x], idx=(y*canvas.width+x)*4;
          imgData.data[idx] = v>150?255:v*1.5;
          imgData.data[idx+1] = v>200?255:v>100?v:0;
          imgData.data[idx+2] = v<100?255-v:0;
          imgData.data[idx+3]=255;
        }
      }
      const temp = document.createElement('canvas');
      temp.width=canvas.width; temp.height=history.length;
      temp.getContext('2d').putImageData(imgData,0,0);
      ctx.imageSmoothingEnabled=false;
      ctx.drawImage(temp,0,0,canvas.width,canvas.height);
      ctx.strokeStyle='rgba(0,240,255,0.15)'; ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(canvas.width*0.25,0); ctx.lineTo(canvas.width*0.25,canvas.height);
      ctx.moveTo(canvas.width*0.55,0); ctx.lineTo(canvas.width*0.55,canvas.height);
      ctx.moveTo(canvas.width*0.8,0); ctx.lineTo(canvas.width*0.8,canvas.height);
      ctx.stroke();
      animId = requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);
  return (
    <div className="spectrogram-container">
      <div className="spectrogram-header"><h2>Radio Waterfall / Spectrogram</h2><span className="spectrogram-badge"><FiRadio className="mr-1"/>SDR BAND: 137.000 – 150.000 MHz [ACTIVE]</span></div>
      <div className="spectrogram-canvas-wrapper">
        <div className="spectrogram-channels"><span>CH 01: 137.5 MHz (NOAA APT)</span><span>CH 02: 145.8 MHz (ISS FM)</span><span>CH 03: 149.3 MHz (SATCOM)</span></div>
        <canvas ref={canvasRef} className="spectrogram-canvas" />
      </div>
    </div>
  );
}
SPECTRO

cat > client/src/components/PassPrediction.jsx << 'PASS'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';

export default function PassPrediction() {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: 34.0522, lon: -118.2437 });
  const fetchPasses = async () => {
    setLoading(true);
    try {
      const resp = await fetch('http://localhost:4000/api/passes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coords)
      });
      const data = await resp.json();
      setPasses(data);
    } catch(e){ console.error(e); }
    setLoading(false);
  };
  useEffect(()=>{ fetchPasses(); }, []);
  return (
    <div className="pass-container">
      <h2>Pass Predictions</h2>
      <div className="pass-controls">
        <div className="pass-input-group"><label>Latitude</label><input type="number" value={coords.lat} onChange={(e)=>setCoords({...coords,lat:parseFloat(e.target.value)})} step="0.0001"/></div>
        <div className="pass-input-group"><label>Longitude</label><input type="number" value={coords.lon} onChange={(e)=>setCoords({...coords,lon:parseFloat(e.target.value)})} step="0.0001"/></div>
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={fetchPasses} className="pass-update-btn" disabled={loading}>{loading?<FiRefreshCw className="spin"/>:'UPDATE'}</motion.button>
      </div>
      <div className="pass-list">
        {passes.length===0?(
          <div className="pass-empty">No passes predicted</div>
        ):(
          passes.map((pass,idx)=>(
            <motion.div key={idx} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:idx*0.05}} className="pass-item">
              <div className="pass-info"><span className="pass-name">{pass.name}</span><span className="pass-time">{new Date(pass.time).toLocaleString()}</span></div>
              <div className="pass-metrics"><span className="pass-elevation">Max Elev: {pass.maxElevation.toFixed(1)}°</span><span className="pass-duration">Duration: {pass.duration}s</span></div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
PASS

cat > client/src/components/TargetInfo.jsx << 'TARGET'
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { FiX, FiTarget } from 'react-icons/fi';

export default function TargetInfo() {
  const selectedSat = useStore(state=>state.selectedSat);
  const setSelectedSat = useStore(state=>state.setSelectedSat);
  const [glitch, setGlitch] = useState(false);
  useEffect(()=>{ if(selectedSat){ setGlitch(true); setTimeout(()=>setGlitch(false),300); } }, [selectedSat]);
  return (
    <AnimatePresence>
      {selectedSat && (
        <motion.div initial={{opacity:0,x:60,scale:0.9}} animate={{opacity:1,x:0,scale:1}} exit={{opacity:0,x:60,scale:0.9}} transition={{type:'spring',damping:25,stiffness:300}} className="target-panel">
          <div className="target-glow"/>
          <div className="target-header"><div className="target-title"><FiTarget className="target-icon"/><span>TARGET LOCKED</span></div><button onClick={()=>setSelectedSat(null)} className="target-close"><FiX/></button></div>
          <div className="target-name">{selectedSat.name.replace(/^0 /,'')}</div>
          <div className="target-details">
            <div><span>NORAD ID</span><span>{selectedSat.tle1.substring(2,7)}</span></div>
            <div><span>Class</span><span>{selectedSat.tle1.charAt(7)==='U'?'UNCLASSIFIED':'CLASSIFIED'}</span></div>
            <div><span>Inclination</span><span>{selectedSat.tle2.substring(8,16).trim()}°</span></div>
            <div><span>Eccentricity</span><span>0.{selectedSat.tle2.substring(26,33).trim()}</span></div>
          </div>
          <div className="target-tle"><div className="tle-label">RAW TLE</div><div className="tle-data">{selectedSat.tle1}</div><div className="tle-data">{selectedSat.tle2}</div></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
TARGET

# --- Остальные файлы (EarthScene, store, i18n, main) оставляем без изменений, но перезаписываем для уверенности ---
cat > client/src/components/EarthScene.jsx << 'EARTH'
import * as THREE from 'three';
import { useRef, useMemo, useEffect } from 'react';
import { OrbitControls, Stars } from '@react-three/drei';
import * as satellite from 'satellite.js';
import useStore from '../store/useStore';

const EARTH_RADIUS=6371; const SCALE=0.002;
export default function EarthScene(){
  const satellites=useStore(s=>s.satellites);
  const debris=useStore(s=>s.debris);
  const setSelectedSat=useStore(s=>s.setSelectedSat);
  const meshRef=useRef(); const debrisRef=useRef(); const dummy=useMemo(()=>new THREE.Object3D(),[]);
  useEffect(()=>{ if(!meshRef.current||!satellites.length) return; const now=new Date(); let count=0; satellites.forEach((sat,i)=>{ try{ const satrec=satellite.twoline2satrec(sat.tle1,sat.tle2); const pos=satellite.propagate(satrec,now).position; if(pos&&typeof pos.x==='number'){ dummy.position.set(pos.x*SCALE,pos.z*SCALE,-pos.y*SCALE); dummy.scale.set(1,1,1); dummy.updateMatrix(); meshRef.current.setMatrixAt(count,dummy.matrix); meshRef.current.userData[count]=i; count++; } }catch(e){} }); meshRef.current.count=count; meshRef.current.instanceMatrix.needsUpdate=true; },[satellites,dummy]);
  useEffect(()=>{ if(!debrisRef.current||!debris.length) return; const now=new Date(); let count=0; debris.forEach(deb=>{ try{ const satrec=satellite.twoline2satrec(deb.tle1,deb.tle2); const pos=satellite.propagate(satrec,now).position; if(pos&&typeof pos.x==='number'){ dummy.position.set(pos.x*SCALE,pos.z*SCALE,-pos.y*SCALE); dummy.scale.set(0.8,0.8,0.8); dummy.updateMatrix(); debrisRef.current.setMatrixAt(count,dummy.matrix); count++; } }catch(e){} }); debrisRef.current.count=count; debrisRef.current.instanceMatrix.needsUpdate=true; },[debris,dummy]);
  const handlePointerDown=(e)=>{ e.stopPropagation(); if(e.instanceId!==undefined){ const realIndex=meshRef.current.userData[e.instanceId]; if(realIndex!==undefined) setSelectedSat(satellites[realIndex]); } };
  return(<><ambientLight intensity={0.1}/><pointLight position={[100,50,50]} intensity={2} color="#ffffff"/><Stars radius={300} depth={50} count={7000} factor={4} saturation={1} fade speed={0.5}/>
    <mesh rotation={[0.2,0,0]}><sphereGeometry args={[EARTH_RADIUS*SCALE,64,64]} /><meshStandardMaterial color="#0b3d91" wireframe transparent opacity={0.15} emissive="#0b3d91" emissiveIntensity={0.5}/></mesh>
    <instancedMesh ref={meshRef} args={[null,null,25000]} onPointerDown={handlePointerDown} onPointerMove={(e)=>{ if(e.instanceId!==undefined) document.body.style.cursor='crosshair'; else document.body.style.cursor='default'; }} onPointerOut={()=>document.body.style.cursor='default'}>
      <sphereGeometry args={[0.04,4,4]} /><meshBasicMaterial color="#00ffcc" transparent opacity={0.8}/>
    </instancedMesh>
    <instancedMesh ref={debrisRef} args={[null,null,10000]}><sphereGeometry args={[0.035,4,4]} /><meshBasicMaterial color="#ff4444" transparent opacity={0.6}/></instancedMesh>
    <OrbitControls enablePan={false} maxDistance={150} minDistance={EARTH_RADIUS*SCALE*1.2} autoRotate autoRotateSpeed={0.5}/>
  </>);
}
EARTH

cat > client/src/store/useStore.js << 'STORE'
import { create } from 'zustand';
import { io } from 'socket.io-client';
const socket = io('http://localhost:4000');
const useStore = create((set)=>{
  socket.on('tle-data',data=>set({satellites:data}));
  socket.on('debris-data',data=>set({debris:data}));
  socket.on('dsn-update',data=>set({dsn:data}));
  socket.on('solar-update',data=>set({solarFlares:data}));
  socket.on('solar-alert',alert=>{ set({solarAlert:alert}); set({activeTab:'solar'}); });
  socket.on('conjunction-alert',alerts=>set({conjunctions:alerts}));
  return {
    satellites:[], debris:[], dsn:null, solarFlares:[], solarAlert:null, conjunctions:[],
    activeTab:'orbital', setActiveTab:tab=>set({activeTab:tab}),
    selectedSat:null, setSelectedSat:sat=>set({selectedSat:sat})
  };
});
export default useStore;
STORE

cat > client/src/i18n/index.js << 'I18N'
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
  en: { translation: { orbital:"Orbital Traffic", dsn:"Deep Space Network", solar:"Solar Weather", spectrogram:"Spectrogram", passes:"Pass Predictions", debris:"Space Debris" } },
  ru: { translation: { orbital:"Орбитальный трафик", dsn:"Сеть дальнего космоса", solar:"Солнечная погода", spectrogram:"Спектрограмма", passes:"Прогноз пролётов", debris:"Космический мусор" } }
};
i18n.use(initReactI18next).init({ resources, lng:'en', interpolation:{escapeValue:false} });
export default i18n;
I18N

cat > client/src/main.jsx << 'MAIN'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
if('serviceWorker' in navigator){ window.addEventListener('load',()=>{ navigator.serviceWorker.register('/sw.js').then(reg=>console.log('SW registered:',reg)).catch(err=>console.log('SW failed:',err)); }); }
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
MAIN

# --- PWA файлы ---
cat > client/public/manifest.json << 'MANIFEST'
{ "name":"Orbital Command Node","short_name":"OCN","description":"Real-time space dashboard","start_url":"/","display":"standalone","background_color":"#050505","theme_color":"#0b3d91","icons":[{"src":"/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"/icon-512.png","sizes":"512x512","type":"image/png"}]}
MANIFEST

cat > client/public/sw.js << 'SW'
const CACHE='ocn-v1'; const urls=['/','/index.html','/src/main.jsx','/src/App.jsx','/src/styles/index.css'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(urls))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
SW

echo "✅ Редизайн завершён! Устанавливаем зависимости..."
cd client && npm install && cd ..
echo "🚀 Теперь запустите проект: npm run dev"
