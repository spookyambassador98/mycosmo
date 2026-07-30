import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import * as satellite from 'satellite.js';
import useStore from '../store/useStore';

const EARTH_RADIUS = 6371;
const SCALE = 0.002;

const TRACKED_SATS = [
  { 
    name: 'ISS (ZARYA)', 
    tle1: '1 25544U 98067A   26078.50000000  .00016717  00000-0  10270-3 0  9993', 
    tle2: '2 25544  51.6400 230.1234 0006789 123.4567 234.5678 15.50000000456789',
    color: '#00f0ff' 
  },
  { 
    name: 'HUBBLE STT', 
    tle1: '1 20580U 90037B   26078.40000000  .00001234  00000-0  34560-4 0  9991', 
    tle2: '2 20580  28.4690 120.4567 0002345  45.6789 314.5678 14.71234567123456',
    color: '#ff3c7e' 
  },
  { 
    name: 'STARLINK-4412', 
    tle1: '1 44713U 19074A   26078.40000000  .00002345  00000-0  12340-3 0  9998', 
    tle2: '2 44713  53.0500 310.1234 0001234  89.1234 271.1234 15.05123456789012',
    color: '#00ff88' 
  }
];

export default function EarthScene() {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const satRefs = useRef([]);
  const debrisRef = useRef();
  const setSelectedSat = useStore(state => state.setSelectedSat);
  const showDebris = useStore(state => state.showDebris);
  const selectedSat = useStore(state => state.selectedSat);

  const earthTexture = useLoader(
    THREE.TextureLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
  );

  const orbits = useMemo(() => {
    return TRACKED_SATS.map(sat => {
      const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
      const points = [];
      const now = Date.now();
      for (let i = -60; i <= 60; i += 1) {
        const time = new Date(now + i * 45000);
        const pv = satellite.propagate(satrec, time);
        if (pv.position && typeof pv.position.x === 'number') {
          points.push(new THREE.Vector3(
            pv.position.x * SCALE,
            pv.position.z * SCALE,
            -pv.position.y * SCALE
          ));
        }
      }
      return { ...sat, satrec, points };
    });
  }, []);

  const debrisData = useMemo(() => {
    const list = [];
    for (let i = 0; i < 600; i++) {
      const radius = EARTH_RADIUS * SCALE * (1.1 + Math.random() * 0.4);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      list.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta)
      });
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.002;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.003;

    const now = new Date();
    orbits.forEach((item, idx) => {
      const pv = satellite.propagate(item.satrec, now);
      if (pv.position && typeof pv.position.x === 'number' && satRefs.current[idx]) {
        satRefs.current[idx].position.set(
          pv.position.x * SCALE,
          pv.position.z * SCALE,
          -pv.position.y * SCALE
        );
      }
    });

    if (debrisRef.current) {
      debrisRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[30, 20, 20]} intensity={1.5} />
      <Stars radius={250} depth={50} count={5000} factor={4} saturation={0.5} fade />

      <mesh ref={earthRef}>
        <sphereGeometry args={[EARTH_RADIUS * SCALE, 64, 64]} />
        <meshStandardMaterial map={earthTexture} roughness={0.8} metalness={0.1} />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[EARTH_RADIUS * SCALE * 1.015, 64, 64]} />
        <meshStandardMaterial color="#00f0ff" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
      </mesh>

      {orbits.map((item, idx) => (
        <Line key={`orbit-${idx}`} points={item.points} color={item.color} lineWidth={1.5} transparent opacity={0.4} />
      ))}

      {showDebris && (
        <group ref={debrisRef}>
          {debrisData.map((d, i) => (
            <mesh key={`deb-${i}`} position={[d.x, d.y, d.z]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color="#ff3c7e" transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {orbits.map((item, idx) => {
        const isSelected = selectedSat?.name === item.name;
        return (
          <group
            key={`sat-${idx}`}
            ref={el => satRefs.current[idx] = el}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSat(item);
            }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'default'; }}
          >
            <mesh>
              <sphereGeometry args={[1.2, 16, 16]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
            <mesh>
              <sphereGeometry args={[isSelected ? 0.5 : 0.35, 16, 16]} />
              <meshBasicMaterial color={item.color} />
            </mesh>
            
            {/* Кликабельный HTML бедж */}
            <Html position={[0, 0.7, 0]} center>
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSat(item);
                }}
                style={{
                  background: isSelected ? 'rgba(0, 240, 255, 0.25)' : 'rgba(5, 5, 8, 0.9)',
                  border: `1px solid ${item.color}`,
                  color: item.color,
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  boxShadow: `0 0 12px ${item.color}50`,
                  letterSpacing: '1px'
                }}
              >
                {item.name}
              </div>
            </Html>
          </group>
        );
      })}

      <OrbitControls enablePan={false} minDistance={14} maxDistance={45} rotateSpeed={0.6} />
    </>
  );
}
