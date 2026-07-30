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
