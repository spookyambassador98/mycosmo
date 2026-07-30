import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
  en: { translation: { orbital:"Orbital Traffic", dsn:"Deep Space Network", solar:"Solar Weather", spectrogram:"Spectrogram", passes:"Pass Predictions", debris:"Space Debris" } },
  ru: { translation: { orbital:"Орбитальный трафик", dsn:"Сеть дальнего космоса", solar:"Солнечная погода", spectrogram:"Спектрограмма", passes:"Прогноз пролётов", debris:"Космический мусор" } }
};
i18n.use(initReactI18next).init({ resources, lng:'en', interpolation:{escapeValue:false} });
export default i18n;
