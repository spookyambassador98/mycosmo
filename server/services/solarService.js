import axios from 'axios';

let lastFlareAlert = 0;

export const startSolarMonitor = (io) => {
    setInterval(async () => {
        try {
            const response = await axios.get(
                'https://services.swpc.noaa.gov/products/solar-flares.json',
                { timeout: 10000 }
            );
            const data = response.data;
            if (Array.isArray(data) && data.length > 1) {
                const flares = data.slice(1).map(row => ({
                    begin: row[0],
                    end: row[1],
                    max: row[2],
                    class: row[3],
                    location: row[4]
                }));
                const strongFlares = flares.filter(f => f.class && (f.class.startsWith('M') || f.class.startsWith('X')));
                if (strongFlares.length > 0) {
                    const latest = strongFlares[0];
                    const alertTime = new Date(latest.begin).getTime();
                    if (alertTime > lastFlareAlert) {
                        lastFlareAlert = alertTime;
                        io.emit('solar-alert', {
                            type: 'FLARE',
                            class: latest.class,
                            time: latest.begin,
                            location: latest.location
                        });
                        console.log(`[SOLAR] Alert: ${latest.class} flare at ${latest.begin}`);
                    }
                }
                io.emit('solar-update', flares.slice(0, 10));
            }
        } catch (error) {
            console.error('[SOLAR] Error fetching solar data:', error.message);
        }
    }, 5 * 60 * 1000);
};
