import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import C2Nav from './C2Nav';

export default function DeepTelemetryMatrix({ activePage, onNavigate }) {
  const [telemetry, setTelemetry] = useState({
    tec: 0, s4: 0, plasmaFreq: 0,
    cnr: 0, ber: 0, bitrate: 0,
    coreTemp: 0, efficiency: 0, radiatorStatus: 'OPTIMAL',
    qber: 0, keyStream: '0x00000000', rate: 0
  });

  const { lang } = useStore();

  const t = {
    RU: {
      header: 'ОРБИТАЛЬНЫЙ C2 // СЕНСОРЫ',
      back: 'ВЕРНУТЬСЯ НА ГЛАВНЫЙ ЭКРАН [1]',
      ion: 'МОНИТОР ИОНОСФЕРНОЙ ПЛАЗМЫ',
      spec: 'СПЕКТР НЕСУЩЕЙ ДАЛЬНЕГО КОСМОСА',
      therm: 'ТЕПЛОВОЕ РАССЕЯНИЕ',
      quant: 'КВАНТОВОЕ РАСПРЕДЕЛЕНИЕ КЛЮЧЕЙ',
      math: 'ПОТОК РАСЧЕТОВ',
      lock: 'ЗАХВАТ X-BAND',
      opt: 'ОПТИМАЛЬНО',
      purge: 'АКТИВНЫЙ СБРОС',
      secure: 'БЕЗОПАСНО',
      desc1: 'Динамический расчет волноводного фронта.',
      desc2: 'Спектральный анализ несущей частоты.',
      desc3: 'Моделирование тепловых циклов.',
      desc4: 'Криптографический стриминг сессий.',
      core: 'ТЕМП. ЯДРА',
      eff: 'ЭФФЕКТИВНОСТЬ',
      load: 'НАГРУЗКА',
      rate: 'СКОРОСТЬ ГЕН.',
      stream: 'ПОТОК КЛЮЧЕЙ'
    },
    EN: {
      header: 'ORBITAL C2 // SENSORS',
      back: 'BACK TO MAIN SCREEN [1]',
      ion: 'IONOSPHERIC PLASMA MONITOR',
      spec: 'DEEP SPACE CARRIER SPECTRUM',
      therm: 'THERMAL DISSIPATION',
      quant: 'QUANTUM KEY DISTRIBUTION',
      math: 'MATH STREAM',
      lock: 'X-BAND LOCK',
      opt: 'OPTIMAL',
      purge: 'PURGE ACTIVE',
      secure: 'SECURE',
      desc1: 'Dynamic waveguide wavefront calculation.',
      desc2: 'Carrier frequency spectral analysis.',
      desc3: 'Thermal cycle simulation.',
      desc4: 'Cryptographic session streaming.',
      core: 'CORE TEMP',
      eff: 'EFFICIENCY',
      load: 'LOAD',
      rate: 'GEN RATE',
      stream: 'KEY STREAM'
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const timeSec = Date.now() / 1000;
      setTelemetry({
        tec: (45.0 + Math.sin(timeSec * 0.5) * 5.2).toFixed(2),
        s4: (0.12 + Math.cos(timeSec * 0.3) * 0.03).toFixed(3),
        plasmaFreq: (9.4 + Math.sin(timeSec * 0.2) * 0.8).toFixed(2),
        cnr: (42.8 + Math.sin(timeSec * 0.7) * 2.4).toFixed(1),
        ber: `1.${Math.floor(7 + Math.sin(timeSec) * 2)}e-8`,
        bitrate: (128.0 + Math.cos(timeSec * 0.4) * 4.5).toFixed(1),
        coreTemp: (38.6 + Math.sin(timeSec * 0.1) * 1.8).toFixed(1),
        efficiency: (94.2 + Math.cos(timeSec * 0.15) * 2.1).toFixed(1),
        radiatorStatus: (38.6 + Math.sin(timeSec * 0.1) * 1.8) > 40.0 ? t[lang].purge : t[lang].opt,
        qber: (0.85 + Math.sin(timeSec * 0.8) * 0.1).toFixed(2),
        keyStream: `0x${Math.floor((Math.sin(timeSec)+1)*0.5*0xFFFF).toString(16).toUpperCase().padStart(4,'0')}...`,
        rate: `${(4.2 + Math.sin(timeSec * 0.6) * 0.3).toFixed(2)} kbps`
      });
    }, 100);
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <div className="c2-deck">
      <div className="c2-atmosphere" />
      <header className="c2-header">
        <h1 className="c2-page-title">{t[lang].header}</h1>
        <C2Nav activePage={activePage} onNavigate={onNavigate} />
      </header>
      <div className="c2-matrix-grid">
        <div className="c2-panel c2-panel--pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="c2-panel__sheen" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="c2-section__title c2-section__title--alert" style={{ border: 'none', padding: 0, fontSize: '0.9rem' }}>{t[lang].ion}</span>
            <span className="c2-chip c2-chip--live">{t[lang].math}</span>
          </div>
          <div className="c2-metric-grid c2-metric-grid--3">
            <div className="c2-metric"><div className="c2-label">TEC</div><div className="c2-value">{telemetry.tec}</div></div>
            <div className="c2-metric"><div className="c2-label">S4</div><div className="c2-value">{telemetry.s4}</div></div>
            <div className="c2-metric"><div className="c2-label">PLASMA FREQ</div><div className="c2-value">{telemetry.plasmaFreq} MHz</div></div>
          </div>
          <div className="c2-muted">{t[lang].desc1}</div>
        </div>

        <div className="c2-panel c2-panel--pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="c2-panel__sheen" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="c2-section__title c2-section__title--alert" style={{ border: 'none', padding: 0, fontSize: '0.9rem' }}>{t[lang].spec}</span>
            <span className="c2-chip c2-chip--live">{t[lang].lock}</span>
          </div>
          <div className="c2-metric-grid c2-metric-grid--3">
            <div className="c2-metric"><div className="c2-label">C/N0</div><div className="c2-value">{telemetry.cnr} dB</div></div>
            <div className="c2-metric"><div className="c2-label">BER</div><div className="c2-value">{telemetry.ber}</div></div>
            <div className="c2-metric"><div className="c2-label">BITRATE</div><div className="c2-value">{telemetry.bitrate}</div></div>
          </div>
          <div className="c2-muted">{t[lang].desc2}</div>
        </div>

        <div className="c2-panel c2-panel--pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="c2-panel__sheen" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="c2-section__title c2-section__title--alert" style={{ border: 'none', padding: 0, fontSize: '0.9rem' }}>{t[lang].therm}</span>
            <span className={`c2-chip ${telemetry.radiatorStatus === t[lang].opt ? 'c2-chip--live' : 'c2-chip--alert'}`}>{telemetry.radiatorStatus}</span>
          </div>
          <div className="c2-metric-grid c2-metric-grid--3">
            <div className="c2-metric"><div className="c2-label">{t[lang].core}</div><div className="c2-value">{telemetry.coreTemp} °C</div></div>
            <div className="c2-metric"><div className="c2-label">{t[lang].eff}</div><div className="c2-value">{telemetry.efficiency}%</div></div>
            <div className="c2-metric"><div className="c2-label">{t[lang].load}</div><div className="c2-value">1.4 kW</div></div>
          </div>
          <div className="c2-muted">{t[lang].desc3}</div>
        </div>

        <div className="c2-panel c2-panel--pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="c2-panel__sheen" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="c2-section__title c2-section__title--alert" style={{ border: 'none', padding: 0, fontSize: '0.9rem' }}>{t[lang].quant}</span>
            <span className="c2-chip c2-chip--live">{t[lang].secure}</span>
          </div>
          <div className="c2-metric-grid c2-metric-grid--3">
            <div className="c2-metric"><div className="c2-label">QBER</div><div className="c2-value">{telemetry.qber}%</div></div>
            <div className="c2-metric"><div className="c2-label">{t[lang].stream}</div><div className="c2-value c2-value--signal" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{telemetry.keyStream}</div></div>
            <div className="c2-metric"><div className="c2-label">{t[lang].rate}</div><div className="c2-value">{telemetry.rate}</div></div>
          </div>
          <div className="c2-muted">{t[lang].desc4}</div>
        </div>
      </div>
    </div>
  );
}
