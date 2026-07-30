import { getTleData } from './tleService.js';
import * as satellite from 'satellite.js';

let conjunctions = [];
const MIN_DIST = 10; // km

export const startConjunctionMonitor = (io) => {
    setInterval(() => {
        const tleData = getTleData();
        if (tleData.length < 2) return;
        const now = new Date();
        const positions = [];
        const sample = tleData.slice(0, 1000);
        sample.forEach((sat, idx) => {
            try {
                const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
                const pos = satellite.propagate(satrec, now).position;
                if (pos && typeof pos.x === 'number') {
                    positions.push({ idx, name: sat.name, x: pos.x, y: pos.y, z: pos.z });
                }
            } catch (e) {}
        });
        const alerts = [];
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const dx = positions[i].x - positions[j].x;
                const dy = positions[i].y - positions[j].y;
                const dz = positions[i].z - positions[j].z;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                if (dist < MIN_DIST) {
                    alerts.push({
                        sat1: positions[i].name,
                        sat2: positions[j].name,
                        distance: dist.toFixed(2),
                        time: now.toISOString()
                    });
                }
            }
        }
        conjunctions = alerts;
        if (alerts.length > 0) io.emit('conjunction-alert', alerts);
    }, 30000);
};

export const getConjunctions = () => conjunctions;
