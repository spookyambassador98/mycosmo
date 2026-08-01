import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import * as satellite from 'satellite.js';

export default function SatInspector() {
  const selectedSat = useStore(state => state.selectedSat);
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    if (!selectedSat) return;

    const updateTelemetry = () => {
      const now = new Date();
      const gmst = satellite.gstime(now);
      try {
        const rec = satellite.twoline2satrec(selectedSat.tle1, selectedSat.tle2);
        const pv = satellite.propagate(rec, now);
        if (pv.position && pv.velocity) {
          const gd = satellite.eciToGeodetic(pv.position, gmst);
          const vel = Math.sqrt(pv.velocity.x**2 + pv.velocity.y**2 + pv.velocity.z**2);
          setTelemetry({
            alt: gd.height.toFixed(2),
            vel: vel.toFixed(2),
            lat: satellite.degreesLat(gd.latitude).toFixed(2),
            lon: satellite.degreesLong(gd.longitude).toFixed(2)
          });
        }
      } catch (e) {}
    };

    updateTelemetry();
    const interval = setInterval(updateTelemetry, 200);
    return () => clearInterval(interval);
  }, [selectedSat]);

  if (!selectedSat) {
    return (
      <div className="c2-section">
        <div className="c2-section__title c2-section__title--alert">
          DEEP ORBITAL INSPECTOR
        </div>
        <div className="c2-empty">
          [ Кликни на спутник в 3D-секторе для инициализации сканирования ]
        </div>
      </div>
    );
  }

  return (
    <div className="c2-section">
      <div className="c2-section__title c2-section__title--alert">
        <span>INSPECTOR: {selectedSat.name}</span>
        <span className="c2-chip c2-chip--live">
          <span className="c2-dot" />
          LIVE LINK ACTIVE
        </span>
      </div>
      <div className="c2-metric-grid">
        <div className="c2-metric">
          <div className="c2-label">ВЫСОТА</div>
          <div className="c2-value">{telemetry?.alt || '---'} км</div>
        </div>
        <div className="c2-metric">
          <div className="c2-label">СКОРОСТЬ</div>
          <div className="c2-value c2-value--signal">{telemetry?.vel || '---'} км/с</div>
        </div>
        <div className="c2-metric">
          <div className="c2-label">ШИРОТА</div>
          <div className="c2-value c2-value--plasma">{telemetry?.lat || '---'}°</div>
        </div>
        <div className="c2-metric">
          <div className="c2-label">ДОЛГОТА</div>
          <div className="c2-value">{telemetry?.lon || '---'}°</div>
        </div>
      </div>
    </div>
  );
}
