#!/bin/bash
set -e

echo "Пересобираем Землю и делаем спутники интерактивными..."

cat << 'EOF' > client/src/components/EarthScene.jsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as satellite from 'satellite.js';

const SATELLITES = [
  { id: 'iss', name: 'ISS (ZARYA)', l1: '1 25544U 98067A   26078.50000000  .00016717  00000-0  10270-3 0  9993', l2: '2 25544  51.6400 230.1234 0006789 123.4567 234.5678 15.50000000456789', color: '#ff0055' },
  { id: 'hubble', name: 'HUBBLE STT', l1: '1 20580U 90037B   26078.40000000  .00001234  00000-0  34560-4 0  9991', l2: '2 20580  28.4690 120.4567 0002345  45.6789 314.5678 14.71234567123456', color: '#00f0ff' },
  { id: 'starlink', name: 'STARLINK-4412', l1: '1 44713U 19074A   26078.40000000  .00002345  00000-0  12340-3 0  9998', l2: '2 44713  53.0500 310.1234 0001234  89.1234 271.1234 15.05123456789012', color: '#00ff66' }
];

export default function EarthScene({ onSelectSat }) {
  const satRefs = useRef([]);
  const earthRef = useRef();
  const [hoveredSat, setHoveredSat] = useState(null);

  useFrame(() => {
    const now = new Date();
    const gmst = satellite.gstime(now);
    const scale = 2.5 / 6371;

    SATELLITES.forEach((sat, idx) => {
      const rec = satellite.twoline2satrec(sat.l1, sat.l2);
      const pv = satellite.propagate(rec, now);
      if (pv.position && satRefs.current[idx]) {
        satRefs.current[idx].position.set(
          pv.position.x * scale,
          pv.position.z * scale,
          -pv.position.y * scale
        );
      }
    });

    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      
      {/* Плотная планета Земля */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial color="#060b19" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Атмосферное свечение (не проволока, а мягкий хало) */}
      <mesh>
        <sphereGeometry args={[2.58, 64, 64]} />
        <meshStandardMaterial color="#00f0ff" transparent opacity={0.12} roughness={0.1} />
      </mesh>

      {/* Интерактивные спутники */}
      {SATELLITES.map((sat, idx) => (
        <group
          key={sat.id}
          ref={el => satRefs.current[idx] = el}
          onClick={(e) => {
            e.stopPropagation();
            const now = new Date();
            const gmst = satellite.gstime(now);
            const rec = satellite.twoline2satrec(sat.l1, sat.l2);
            const pv = satellite.propagate(rec, now);
            if (!pv.position || !pv.velocity) return;
            const gd = satellite.eciToGeodetic(pv.position, gmst);
            const vel = Math.sqrt(pv.velocity.x**2 + pv.velocity.y**2 + pv.velocity.z**2);
            onSelectSat({
              name: sat.name,
              alt: gd.height.toFixed(2),
              vel: vel.toFixed(2),
              lat: satellite.degreesLat(gd.latitude).toFixed(2),
              lon: satellite.degreesLong(gd.longitude).toFixed(2)
            });
          }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; setHoveredSat(sat.id); }}
          onPointerOut={() => { document.body.style.cursor = 'default'; setHoveredSat(null); }}
        >
          {/* Увеличенный невидимый хитбокс для удобства клика */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
          
          {/* Видимый спутник */}
          <mesh>
            <sphereGeometry args={[hoveredSat === sat.id ? 0.22 : 0.16, 16, 16]} />
            <meshBasicMaterial color={sat.color} />
          </mesh>
        </group>
      ))}
    </>
  );
}
EOF

echo "Земля и спутники обновлены."
npm run dev
