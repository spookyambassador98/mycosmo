import React, { useState } from 'react';
import useStore from '../store/useStore';

export default function CommandLog() {
  const { selectedSat, lang } = useStore();
  const [cmdInput, setCmdInput] = useState('');
  const [logs, setLogs] = useState([
    '[SYSTEM] SECURE C2 HANDSHAKE ESTABLISHED.',
    '[TELEMETRY] EPHEMERIS PROPAGATION ACTIVE.',
    '[UPLINK] READY FOR COMMAND INJECTION.'
  ]);

  const satName = selectedSat ? selectedSat.name : 'ISS (ZARYA)';

  const handleExec = (e) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;
    setLogs(prev => [`[UPLINK -> ${satName}] ${cmdInput.toUpperCase()}`, ...prev.slice(0, 5)]);
    setCmdInput('');
  };

  const t = {
    RU: {
      title: 'ПОТОК СИСТЕМНЫХ КОМАНД (C2 STREAM)',
      placeholder: 'Введите системную команду...'
    },
    EN: {
      title: 'SYSTEM COMMAND STREAM (C2 STREAM)',
      placeholder: 'Enter system command...'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontFamily: 'Orbitron, sans-serif', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ color: '#00f0ff', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
        {t[lang].title}
      </div>

      <div style={{ flex: 1, background: 'rgba(3,3,5,0.8)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '0.8rem', padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto', minHeight: '90px' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ fontSize: '0.7rem', color: log.includes('UPLINK') ? '#ff3c7e' : '#00ff66', fontFamily: 'monospace' }}>
            {log}
          </div>
        ))}
      </div>

      <form onSubmit={handleExec} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={cmdInput} 
          onChange={(e) => setCmdInput(e.target.value)}
          placeholder={t[lang].placeholder}
          style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '0.5rem', padding: '0.5rem 0.8rem', color: '#fff', fontSize: '0.75rem', fontFamily: 'Orbitron, sans-serif', outline: 'none' }}
        />
        <button type="submit" style={{ background: 'rgba(0,240,255,0.15)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: '0.75rem' }}>
          EXEC
        </button>
      </form>
    </div>
  );
}
