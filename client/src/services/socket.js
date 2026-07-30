import { io } from 'socket.io-client';
import useStore from '../store/useStore';

export const initSocket = () => {
  const socket = io('http://localhost:4000');
  
  socket.on('connect', () => {
    console.log('Сокет подключен, связь с матушкой-землей установлена');
  });

  socket.on('dsn_telemetry', (data) => {
    useStore.getState().setDsn(data);
  });

  return socket;
};
