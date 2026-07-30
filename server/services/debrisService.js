import axios from 'axios';

let debrisData = [];

export const initDebrisService = async () => {
    try {
        console.log('[DEBRIS] Fetching debris TLE from CelesTrak...');
        const { data } = await axios.get(
            'https://celestrak.org/NORAD/elements/gp.php?GROUP=debris&FORMAT=tle',
            { timeout: 15000 }
        );
        const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const list = [];
        for (let i = 0; i < lines.length; i += 3) {
            if (lines[i] && lines[i+1] && lines[i+2]) {
                list.push({ name: lines[i], tle1: lines[i+1], tle2: lines[i+2] });
            }
        }
        if (list.length > 0) {
            debrisData = list;
            console.log(`[DEBRIS] Loaded ${debrisData.length} debris objects.`);
        }
    } catch (error) {
        console.error('[DEBRIS] Failed to fetch debris:', error.message);
        debrisData = [];
    }
};

export const getDebris = () => debrisData;
