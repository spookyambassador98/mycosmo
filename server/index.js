import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import * as satellite from 'satellite.js';
import { XMLParser } from 'fast-xml-parser';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const parser = new XMLParser();

let liveTles = [];
let realDsnDishes = [];
let realSolarFlares = [];

async function fetchCelesTrak() {
  try {
    const res = await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle');
    const text = await res.text();
    const lines = text.split(/\r?\n/);
    liveTles = [];
    for (let i = 0; i < lines.length - 2; i += 3) {
      liveTles.push({
        name: lines[i].trim(),
        tle1: lines[i+1].trim(),
        tle2: lines[i+2].trim()
      });
    }
    console.log(`[TRU-DATA] Загружено спутников из CelesTrak: ${liveTles.length}`);
  } catch (e) {
    console.error('Ошибка загрузки TLE:', e.message);
  }
}

async function fetchNASA_DSN() {
  try {
    const res = await fetch('https://eyes.nasa.gov/dsn/data/dsn.xml');
    const xml = await res.text();
    const data = parser.parse(xml);
    if (data && data.dsn && data.dsn.dish) {
      realDsnDishes = data.dsn.dish.map(d => ({
        name: d.name,
        antennaId: d.antennaId,
        target: d.target || 'IDLE',
        azimuth: d.azimuth || 0,
        elevation: d.elevation || 0,
        band: d.band || 'X/Ka'
      }));
    }
  } catch (e) {
    // Тихо игнорируем сетевые затыки внешнего API
  }
}

async function fetchNOAA_Solar() {
  try {
    const res = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json');
    const data = await res.json();
    if (Array.isArray(data)) {
      realSolarFlares = data.map(f => ({
        class: f.max_class || 'A1.0',
        location: f.begin_location || 'N00W00',
        time: f.begin_time
      }));
    }
  } catch (e) {}
}

fetchCelesTrak();
fetchNASA_DSN();
fetchNOAA_Solar();

setInterval(fetchCelesTrak, 3600000);
setInterval(fetchNASA_DSN, 10000);
setInterval(fetchNOAA_Solar, 60000);

app.post('/api/passes', (req, res) => {
  const { lat, lon } = req.body;
  if (!liveTles.length) return res.json([]);
  
  const observerGd = { 
    latitude: satellite.degreesToRadians(lat), 
    longitude: satellite.degreesToRadians(lon), 
    height: 0 
  };
  const passes = [];
  
  for (let i = 0; i < Math.min(10, liveTles.length); i++) {
    const sat = liveTles[i];
    try {
      const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
      const now = new Date();
      let maxEl = 0;
      let bestTime = now;
      for (let m = 0; m < 120; m += 2) {
        const t = new Date(now.getTime() + m * 60000);
        const pv = satellite.propagate(satrec, t);
        if (pv.position && typeof pv.position !== 'boolean') {
          const gmst = satellite.gstime(t);
          const posEcf = satellite.eciToEcf(pv.position, gmst);
          const lookAngles = satellite.ecfToLookAngles(observerGd, posEcf);
          const el = satellite.radiansToDegrees(lookAngles.elevation);
          if (el > maxEl) {
            maxEl = el;
            bestTime = t;
          }
        }
      }
      if (maxEl > 15) {
        passes.push({
          name: sat.name,
          time: bestTime.toISOString(),
          maxElevation: maxEl,
          duration: 450
        });
      }
    } catch (err) {}
  }
  res.json(passes);
});

io.on('connection', (socket) => {
  console.log('Клиент присосался к тру-дата потоку:', socket.id);
  socket.emit('tle-data', liveTles);

  const interval = setInterval(() => {
    socket.emit('dsn-update', { dishes: realDsnDishes });
    socket.emit('solar-update', realSolarFlares);
  }, 3000);

  socket.on('disconnect', () => clearInterval(interval));
});

server.listen(4000, () => {
  console.log('Бэкенд на чистой тру-дате запущен на порту 4000');
});
