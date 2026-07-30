import React, { useState, useEffect } from 'react';

export default function ManeuverPlanner({ onSwitch }) {
  const [burnData, setBurnData] = useState({
    dv1: 142.5, dv2: 138.1, totalDv: 280.6, propellantMass: 450.2, burnTime: 14.8, rcsTorque: [0.02, -0.01, 0.05]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const t = Date.now() / 1000;
      setBurnData({
        dv1: (142.0 + Math.sin(t * 0.4) * 2.5).toFixed(2),
        dv2: (138.0 + Math.cos(t * 0.4) * 2.1).toFixed(2),
        totalDv: (280.0 + Math.sin(t * 0.4) * 4.0).toFixed(2),
        propellantMass: (450.2 - (t % 100) * 0.05).toFixed(2),
        burnTime: (14.8 + Math.sin(t) * 0.5).toFixed(2),
        rcsTorque: [(Math.sin(t) * 0.03).toFixed(3), (Math.cos(t) * 0.02).toFixed(3), (0.05).toFixed(3)]
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050508', padding: '1rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'Orbitron, sans-serif', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1rem', padding: '0.8rem 1.5rem', flexShrink: 0 }}>
        <h1 style={{ color: '#00f0ff', fontSize: '1rem', margin: 0 }}>ORBITAL C2 // СТРАНИЦА 4: РАСЧЕТ МАНЁВРОВ И DELTA-V</h1>
        <button onClick={onSwitch} style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid #ff0055', color: '#ff0055', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
          ВЕРНУТЬСЯ НА ГЛАВНЫЙ ЭКРАН [1]
        </button>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '1rem', overflow: 'hidden' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff0055', fontSize: '1.1rem', fontWeight: 'bold' }}>HOHMANN TRANSFER BURN PLANNER</span>
            <span style={{ color: '#00ff66', fontSize: '0.8rem', background: 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>READY</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>DELTA-V 1</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{burnData.dv1} m/s</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>DELTA-V 2</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{burnData.dv2} m/s</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>TOTAL ΔV</div>
              <div style={{ fontSize: '1.1rem', color: '#00ff66', fontWeight: 'bold', marginTop: '0.3rem' }}>{burnData.totalDv} m/s</div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Оптимальный переход между орбитами.</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff0055', fontSize: '1.1rem', fontWeight: 'bold' }}>PROPULSION & BURN DURATION</span>
            <span style={{ color: '#00ff66', fontSize: '0.8rem', background: 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>STABLE</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>PROPELLANT MASS</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{burnData.propellantMass} kg</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>BURN DURATION</div>
              <div style={{ fontSize: '1.1rem', color: '#00ff66', fontWeight: 'bold', marginTop: '0.3rem' }}>{burnData.burnTime} s</div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Контроль массы рабочего тела.</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff0055', fontSize: '1.1rem', fontWeight: 'bold' }}>ATTITUDE CONTROL (RCS)</span>
            <span style={{ color: '#00ff66', fontSize: '0.8rem', background: 'rgba(0,255,102,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>PID LOCKED</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>PITCH</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{burnData.rcsTorque[0]}</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>YAW</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{burnData.rcsTorque[1]}</div>
            </div>
            <div style={{ background: 'rgba(0,240,255,0.03)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>ROLL</div>
              <div style={{ fontSize: '1.1rem', color: '#00f0ff', fontWeight: 'bold', marginTop: '0.3rem' }}>{burnData.rcsTorque[2]}</div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Управление ориентацией.</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff0055', fontSize: '1.1rem', fontWeight: 'bold' }}>MANEUVER TERMINAL</span>
            <span style={{ color: '#ff0055', fontSize: '0.8rem', background: 'rgba(255,0,85,0.1)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem' }}>ARMED</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '0.8rem', padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#00f0ff', height: '60px', overflowY: 'auto' }}>
            &gt; t_burn = {burnData.burnTime}s<br/>
            &gt; total_dv = {burnData.totalDv}m/s<br/>
            &gt; Status: Ready to execute.
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Готовность к инъекции маневра.</div>
        </div>
      </div>
    </div>
  );
}
