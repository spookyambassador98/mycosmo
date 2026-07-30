import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import * as satellite from 'satellite.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

let satellites = [];
let debris = [];
let dsnDishes = [
    { name: 'GOLDSTONE (DSS-14)', band: 'X/Ka', target: 'VOYAGER 1', azimuth: 214.52, elevation: 34.12, status: 'ACTIVE' },
    { name: 'MADRID (DSS-54)', band: 'X-BAND', target: 'MARS RECON', azimuth: 112.80, elevation: 62.45, status: 'ACTIVE' },
    { name: 'CANBERRA (DSS-43)', band: 'S/X', target: 'ARTEMIS II', azimuth: 345.10, elevation: 18.90, status: 'TRACKING' }
];

const generateHeavyOrbitMatrix = () => {
    console.log('[CORE] Инициализация матричной базы из 25,000 орбитальных объектов...');
    const list = [];
    const prefixes = ['ISS', 'HST', 'STARLINK', 'NOAA', 'GPS', 'GLONASS', 'IRIDIUM', 'COSMOS', 'METEOR', 'DEFENSE'];
    
    for (let i = 0; i < 25000; i++) {
        const p = prefixes[i % prefixes.length];
        list.push({
            id: i + 1,
            name: `${p} # ${1000 + i}`,
            tle1: `1 25544U 98067A   ${(26 + (i % 10)).toFixed(8)}  .00016717  00000-0  31553-4 0  999${i % 10}`,
            tle2: `2 25544  ${(51.6 + (i % 30)).toFixed(4)} ${(i * 13.7 % 360).toFixed(4)} 0005123 ${(i * 25.1 % 360).toFixed(4)} ${(i * 19.3 % 360).toFixed(4)} 15.5${i % 99}`
        });
    }
    return list;
};

satellites = generateHeavyOrbitMatrix();
debris = satellites.slice(0, 8000).map((s, idx) => ({ ...s, name: `DEBRIS-FX #${idx}` }));

app.post('/api/passes', (req, res) => {
    const { lat, lon } = req.body;
    const now = new Date();
    const results = [];

    for (let i = 0; i < 15; i++) {
        const sat = satellites[i * 150];
        try {
            results.push({
                name: sat.name,
                time: new Date(now.getTime() + i * 1800000).toISOString(),
                maxElevation: 45 + (i * 3) % 45,
                duration: 240 + (i * 15) % 180,
                azimuth: (i * 24) % 360
            });
        } catch (e) {}
    }
    res.json(results);
});

io.on('connection', (socket) => {
    console.log('[SOCKET] Оператор подключен к командному ядру.');
    socket.emit('tle-data', satellites);
    socket.emit('debris-data', debris);
    socket.emit('dsn-update', { dishes: dsnDishes });
});

setInterval(() => {
    io.emit('dsn-update', { dishes: dsnDishes });
}, 3000);

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`[C2 CORE] Командный пункт запущен на порту ${PORT}`);
});
