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
    <div className="c2-section">
      <div className="c2-section__title">{t[lang].title}</div>

      <div className="c2-log">
        {logs.map((log, i) => (
          <div
            key={i}
            className={`c2-log__line ${log.includes('UPLINK') ? 'c2-log__line--uplink' : ''}`}
          >
            {log}
          </div>
        ))}
      </div>

      <form onSubmit={handleExec} className="c2-form">
        <input
          type="text"
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          placeholder={t[lang].placeholder}
          className="c2-input"
        />
        <button type="submit" className="c2-btn c2-btn--cyan">
          EXEC
        </button>
      </form>
    </div>
  );
}
