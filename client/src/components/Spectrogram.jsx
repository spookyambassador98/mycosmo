import React, { useRef, useEffect } from 'react';

export default function Spectrogram() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight - 80;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      const imgData = ctx.getImageData(0, 0, w, h - 2);
      ctx.putImageData(imgData, 0, 2);

      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, w, 2);

      for (let x = 0; x < w; x += 2) {
        const noise = Math.random() * 50;
        const carrierSignal = Math.sin(x * 0.03) > 0.95 ? 180 : 0;
        const val = Math.min(255, noise + carrierSignal);

        if (val > 100) {
          ctx.fillStyle = `rgb(${val}, ${val * 0.5}, ${255 - val})`;
          ctx.fillRect(x, 0, 2, 2);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', color: '#00f0ff' }}>SDR WATERFALL & DSP</h2>
        <div style={{ fontSize: '0.8rem', color: '#00ff88', fontFamily: 'monospace' }}>DSP ENGINE: ACTIVE (100 MSPS)</div>
      </div>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '1.5rem', padding: '1rem', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
