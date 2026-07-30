import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { FiX, FiTarget } from 'react-icons/fi';

export default function TargetInfo() {
  const selectedSat = useStore(state => state.selectedSat);
  const setSelectedSat = useStore(state => state.setSelectedSat);

  return (
    <AnimatePresence>
      {selectedSat && (
        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.9 }} 
          animate={{ opacity: 1, x: 0, scale: 1 }} 
          exit={{ opacity: 0, x: 50, scale: 0.9 }} 
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'fixed', top: '50%', right: '2rem', transform: 'translateY(-50%)',
            width: '320px', background: 'rgba(10, 10, 15, 0.9)', backdropFilter: 'blur(30px)',
            border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '1.5rem', padding: '1.5rem',
            boxShadow: '0 0 50px rgba(0, 240, 255, 0.15)', zIndex: 100, color: '#fff'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f0ff', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <FiTarget /><span>TARGET LOCKED</span>
            </div>
            <button onClick={() => setSelectedSat(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>
              <FiX />
            </button>
          </div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
            {selectedSat.name}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>NORAD ID</span>
              <span style={{ fontWeight: 600 }}>{selectedSat.tle1?.substring(2, 7)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>Status</span>
              <span style={{ color: '#00ff88', fontWeight: 600 }}>ACTIVE TELEMETRY</span>
            </div>
          </div>
          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem' }}>RAW TLE DATA</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(0, 240, 255, 0.7)', wordBreak: 'break-all' }}>{selectedSat.tle1}</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(0, 240, 255, 0.7)', wordBreak: 'break-all' }}>{selectedSat.tle2}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
