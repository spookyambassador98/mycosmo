import { create } from 'zustand';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

const useStore = create((set) => {
  socket.on('tle-data', (data) => set({ satellites: data || [] }));
  socket.on('debris-data', (data) => set({ debris: data || [] }));
  socket.on('dsn-update', (data) => set({ dsn: data }));
  socket.on('solar-update', (data) => set({ solarFlares: data || [] }));
  socket.on('solar-alert', (alert) => { set({ solarAlert: alert, activeTab: 'solar' }); });
  socket.on('conjunction-alert', (alerts) => set({ conjunctions: alerts || [] }));

  return {
    satellites: [],
    debris: [],
    dsn: null,
    setDsn: (dsn) => set({ dsn }),
    solarFlares: [],
    solarAlert: null,
    conjunctions: [],
    activeTab: 'orbital',
    setActiveTab: (tab) => set({ activeTab: tab }),
    selectedSat: null,
    setSelectedSat: (sat) => set({ selectedSat: sat }),
    lang: 'RU',
    setLang: (lang) => set({ lang }),
    showDebris: true,
    toggleDebris: () => set((state) => ({ showDebris: !state.showDebris }))
  };
});

export default useStore;
