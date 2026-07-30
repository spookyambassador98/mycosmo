import { getTleData } from './tleService.js';
import * as satellite from 'satellite.js';

const TARGET_NAMES = ['ISS (ZARYA)', 'HST', 'STARLINK'];

export const getPasses = (lat, lon, alt) => {
    const tleData = getTleData();
    const now = new Date();
    const passes = [];
    const targets = tleData.filter(sat => TARGET_NAMES.some(name => sat.name.includes(name)));
    targets.forEach(sat => {
        try {
            const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
            for (let m = 0; m < 1440; m += 5) {
                const time = new Date(now.getTime() + m * 60000);
                const pos = satellite.propagate(satrec, time).position;
                if (!pos || typeof pos.x !== 'number') continue;
                // Эмуляция пролётов
                if (Math.random() > 0.99) {
                    passes.push({
                        name: sat.name,
                        time: time.toISOString(),
                        duration: 300,
                        maxElevation: 75 + Math.random() * 20
                    });
                }
            }
        } catch (e) {}
    });
    passes.sort((a, b) => new Date(a.time) - new Date(b.time));
    return passes.slice(0, 10);
};
