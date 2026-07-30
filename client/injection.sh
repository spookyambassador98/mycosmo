cat << 'EARTH_SCENE' > client/src/components/EarthScene.jsx
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
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

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const satRecord = useMemo(() => {
    const tle1 = '1 25544U 98067A   26075.51813657  .00016717  00000-0  31025-3 0  9993';
    const tle2 = '2 25544  51.6415 237.9150 0005234 145.2412 314.9312 15.49815510487912';
    return satellite.twoline2satrec(tle1, tle2);
  }, []);

  useFrame(({ clock }) => {
    if (!satsRef.current) return;
    const now = new Date();
    const positionAndVelocity = satellite.propagate(satRecord, now);
    if (positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
      const gciPos = positionAndVelocity.position;
      const x = gciPos.x / 6371 * 12;
      const y = gciPos.z / 6371 * 12;
      const z = -gciPos.y / 6371 * 12;

      dummy.position.set(x, y, z);
      dummy.scale.set(1.5, 1.5, 1.5);
      dummy.updateMatrix();
      satsRef.current.setMatrixAt(0, dummy.matrix);
      satsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 10, 20]} intensity={1.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      
      <mesh ref={earthRef}>
        <sphereGeometry args={[10, 64, 64]} />
        <meshStandardMaterial color="#0b1329" roughness={0.8} metalness={0.2} wireframe={false} />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[10.2, 64, 64]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>

      <instancedMesh ref={satsRef} args={[null, null, 1]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#00f0ff" />
      </instancedMesh>

      <OrbitControls enablePan={false} minDistance={14} maxDistance={40} rotateSpeed={0.6} />
    </>
  );
}
EARTH_SCENE
echo "Инъекция EarthScene залетела без сучка и задоринки."
