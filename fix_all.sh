#!/bin/bash
set -e

echo "Исправляем порядок в CSS и экспорт в сторе..."

# 1. Исправляем index.css (импорт шрифтов строго на самом верху)
cat << 'EOF' > client/src/index.css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  background: #050508;
  color: #00f0ff;
  overflow: hidden;
}
EOF

# 2. Исправляем useStore.js (именованный + дефолтный экспорт для защиты от дурака)
cat << 'EOF' > client/src/store/useStore.js
import { create } from 'zustand';

export const useStore = create((set) => ({
  dsnData: null,
  setDsn: (data) => set({ dsnData: data }),
}));

export default useStore;
EOF

# 3. Исправляем socket.js
cat << 'EOF' > client/src/socket.js
import { io } from 'socket.io-client';
import { useStore } from './store/useStore';

const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Сокет подключен, связь с матушкой-землей установлена');
});

socket.on('dsn-telemetry', (data) => {
  const store = useStore.getState();
  if (store && typeof store.setDsn === 'function') {
    store.setDsn(data);
  }
});

export default socket;
EOF

echo "Исправления влиты. Перезапускаем сборку..."
npm run dev
