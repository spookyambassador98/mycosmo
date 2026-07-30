import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });

export const startDsnStream = (io) => {
    setInterval(async () => {
        try {
            const { data } = await axios.get(`https://eyes.nasa.gov/dsn/data/dsn.xml?r=${Date.now()}`, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                timeout: 5000
            });
            const parsed = parser.parse(data);
            const dsnState = {
                dishes: parsed?.dsn?.dish || [],
                spacecraft: parsed?.dsn?.spacecraft || [],
                timestamp: parsed?.dsn?.timestamp || Date.now()
            };
            io.emit('dsn-update', dsnState);
        } catch (error) {
            console.error('[DSN] Error fetching NASA XML:', error.message);
        }
    }, 5000);
};
