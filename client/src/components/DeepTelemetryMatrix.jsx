import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';

export default function DeepTelemetryMatrix({ onSwitch }) {
  const [telemetry, setTelemetry] = useState({
    tec: 0, s4: 0, plasmaFreq: 0,
    cnr: 0, ber: 0, bitrate: 0,
    coreTemp: 0, efficiency: 0, radiatorStatus: 'OPTIMAL',
    qber: 0, keyStream: '0x00000000', rate: 0
  });

  const { lang, setLang } = useStore();

  const t = {
    RU: {
      header: 'ОРБИТАЛЬНЫЙ C2 // СТРАНИЦА 3: ХАРДКОРНЫЕ СЕНСОРЫ',
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
      header: 'ORBITAL C2 // PAGE 3: HARDCORE SENSORS',
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
    <div style={{ width: '100vw', height: '100vh', background: '#050508', padding: '1rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'Orbitron, sans-serif', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1rem', padding: '0.8rem 1.5rem', flexShrink: 0 }}>
        <h1 style={{ color: '#00f0ff', fontSize: '1rem', margin: 0 }}>{t[lang].header}</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,240,255,0.4)', color: '#00f0ff', padding: '0.5rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
            LANG: {lang}
          </button>
          <button onClick={onSwitch} style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid #ff0055', color: '#ff0055', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
            {t[lang].back}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '1rem', overflow: 'hidden' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff0055', fontSize: '1.1rem', fontWeight: 'bold' }}>{t[lang].ion}</span>
            <span style={{ color: '#00ff66', fontSize: '0.8rem', background: 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>{t[lang].math}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>TEC</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{telemetry.tec}</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>S4</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{telemetry.s4}</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>PLASMA FREQ</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{telemetry.plasmaFreq} MHz</div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t[lang].desc1}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff0055', fontSize: '1.1rem', fontWeight: 'bold' }}>{t[lang].spec}</span>
            <span style={{ color: '#00ff66', fontSize: '0.8rem', background: 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>{t[lang].lock}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>C/N0</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{telemetry.cnr} dB</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>BER</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{telemetry.ber}</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>BITRATE</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{telemetry.bitrate}</div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t[lang].desc2}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff0055', fontSize: '1.1rem', fontWeight: 'bold' }}>{t[lang].therm}</span>
            <span style={{ color: telemetry.radiatorStatus === t[lang].opt ? '#00ff66' : '#ff0055', fontSize: '0.8rem', background: 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>{telemetry.radiatorStatus}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].core}</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{telemetry.coreTemp} °C</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].eff}</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{telemetry.efficiency}%</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].load}</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>1.4 kW</div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t[lang].desc3}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff0055', fontSize: '1.1rem', fontWeight: 'bold' }}>{t[lang].quant}</span>
            <span style={{ color: '#00ff66', fontSize: '0.8rem', background: 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>{t[lang].secure}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>QBER</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{telemetry.qber}%</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].stream}</div>
              <div style={{ fontSize: '1.0rem', color: '#00ff66', fontWeight: 'bold', marginTop: '0.3rem', fontFamily: 'monospace' }}>{telemetry.keyStream}</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{t[lang].rate}</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{telemetry.rate}</div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t[lang].desc4}</div>
        </div>
      </div>
    </div>
  );
}
