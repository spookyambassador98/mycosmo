#!/bin/bash
set -e

echo "Восстанавливаем оригинальный EarthScene с орбитами и кликами..."

cat << 'EOF' > client/src/components/EarthScene.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import * as satellite from 'satellite.js';
import useStore from '../store/useStore';

export default function EarthScene() {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const satsRef = useRef();
  const setSelectedSat = useStore(state => state.setSelectedSat);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.02;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.03;
  });

  const satData = useMemo(() => {
    const rawTles = [
      { name: 'ISS (ZARYA)', tles: ['1 25544U 98067A   26075.51813657  .00016717  00000-0  31025-3 0  9993', '2 25544  51.6415 237.9150 0005234 145.2412 314.9312 15.49815510487912'] },
      { name: 'HUBBLE STT', tles: ['1 20580U 90059A   26074.12345678  .00001234  00000-0  12345-3 0  9991', '2 20580  28.5000 120.0000 0001000  45.0000 315.0000 14.20000000123456'] },
      { name: 'STARLINK-4412', tles: ['1 44713U 19029B   26075.00000000  .00005000  00000-0  10000-3 0  9992', '2 44713  53.0500  10.0000 0001500 180.0000 180.0000 15.10000000 12345'] }
    ];
    return rawTles.map(item => {
      const rec = satellite.twoline2satrec(item.tles[0], item.tles[1]);
      const points = [];
      const now = Date.now();
      for (let i = -30; i <= 30; i += 2) {
        const time = new Date(now + i * 60000);
        const pv = satellite.propagate(rec, time);
        if (pv.position && typeof pv.position !== 'boolean') {
          points.push(new THREE.Vector3(
            pv.position.x / 6371 * 12,
            pv.position.z / 6371 * 12,
            -pv.position.y / 6371 * 12
          ));
        }
      }
      return { name: item.name, rec, points, tle1: item.tles[0], tle2: item.tles[1] };
    });
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!satsRef.current) return;
    const now = new Date();

    satData.forEach(({ rec }, idx) => {
      const pv = satellite.propagate(rec, now);
      if (pv.position && typeof pv.position !== 'boolean') {
        const gci = pv.position;
        dummy.position.set(gci.x / 6371 * 12, gci.z / 6371 * 12, -gci.y / 6371 * 12);
        dummy.scale.set(1.2, 1.2, 1.2);
        dummy.updateMatrix();
        satsRef.current.setMatrixAt(idx, dummy.matrix);
      }
    });
    satsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 10, 20]} intensity={1.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      
      <mesh ref={earthRef}>
        <sphereGeometry args={[10, 64, 64]} />
        <meshStandardMaterial color="#0b1329" roughness={0.8} metalness={0.2} />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[10.2, 64, 64]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>

      <instancedMesh 
        ref={satsRef} 
        args={[null, null, satData.length]}
        onClick={(e) => {
          e.stopPropagation();
          if (e.instanceId !== undefined) {
            setSelectedSat(satData[e.instanceId]);
          }
        }}
      >
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#00f0ff" />
      </instancedMesh>

      {satData.map((sat, i) => (
        <Line key={i} points={sat.points} color="#00f0ff" lineWidth={1} transparent opacity={0.3} />
      ))}

      <OrbitControls enablePan={false} minDistance={14} maxDistance={40} rotateSpeed={0.6} />
    </>
  );
}
EOF

echo "Готово! Сцену вернули в исходное состояние."
