cd client/src/components

# 1. DsnDashboard
cat << 'EOF' > DsnDashboard.jsx
import React from 'react';
export default function DsnDashboard() {
  return (
    <div style={{ color: '#f3f3f5', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8e8e93', marginBottom: '1rem' }}>
        DSN Telemetry Link
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.8rem', padding: '1rem' }}>
          <div style={{ fontSize: '0.655rem', color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Antenna</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 500, marginTop: '0.4rem', color: '#f3f3f5' }}>DSS-14</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.8rem', padding: '1rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 500, marginTop: '0.4rem', color: '#ffffff' }}>Tracking</div>
        </div>
      </div>
    </div>
  );
}
EOF

# 2. PassPrediction
cat << 'EOF' > PassPrediction.jsx
import React from 'react';
export default function PassPrediction() {
  return (
    <div style={{ color: '#f3f3f5', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8e8e93', marginBottom: '1rem' }}>
        Orbital Pass Predictor
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.8rem', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>ISS (ZARYA)</div>
          <div style={{ fontSize: '0.7rem', color: '#8e8e93', marginTop: '0.2rem' }}>T-Minus: 2:37:52 PM</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Max El: 76.4°</div>
          <div style={{ fontSize: '0.7rem', color: '#8e8e93', marginTop: '0.2rem' }}>Dur: 540s</div>
        </div>
      </div>
    </div>
  );
}
EOF

# 3. CommandLog
cat << 'EOF' > CommandLog.jsx
import React from 'react';
export default function CommandLog() {
  return (
    <div style={{ color: '#f3f3f5', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8e8e93', marginBottom: '1rem' }}>
        System Command Stream
      </div>
      <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.8rem', padding: '1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#a1a1aa', flex: 1, overflowY: 'auto', marginBottom: '0.8rem' }}>
        [1:38:04 AM] Телеметрия [DSS-14]: Аз=143.19°, Мест=63.85°<br/>
        [1:38:09 AM] Синхронизация эфемерид TLE завершена.
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input type="text" placeholder="Введите системную команду..." style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', padding: '0.6rem 1rem', color: '#f3f3f5', outline: 'none', fontSize: '0.8rem' }} />
        <button style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#f3f3f5', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>EXEC</button>
      </div>
    </div>
  );
}
EOF

# 4. SatInspector
cat << 'EOF' > SatInspector.jsx
import React from 'react';
export default function SatInspector() {
  return (
    <div style={{ color: '#f3f3f5', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8e8e93', marginBottom: '1rem' }}>
        Deep Orbital Inspector
      </div>
      <div style={{ textAlign: 'center', padding: '2rem 0', color: '#8e8e93', fontSize: '0.8rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '0.8rem' }}>
        [ Кликни на спутник в 3D-секторе для инициализации сканирования ]
      </div>
    </div>
  );
}
EOF

cd ../..
echo "Зачистка завершена."
