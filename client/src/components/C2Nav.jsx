import React from 'react';
import useStore from '../store/useStore';

const PAGES = [
  { id: 'main', key: 'mainBtn', variant: 'ghost' },
  { id: 'matrix', key: 'matrixBtn', variant: 'cyan' },
  { id: 'deepMatrix', key: 'deepBtn', variant: 'danger' },
  { id: 'solarMatrix', key: 'solarBtn', variant: 'amber' },
  { id: 'blackHole', key: 'bhBtn', variant: 'amber' },
  { id: 'debrisMatrix', key: 'debrisBtn', variant: 'plasma' }
];

export const NAV_LABELS = {
  RU: {
    mainBtn: 'ГЛАВНАЯ',
    matrixBtn: 'ОРБИТЫ',
    deepBtn: 'СЕНСОРЫ',
    solarBtn: 'СОЛНЦЕ',
    bhBtn: 'ЧЕРНАЯ ДЫРА',
    debrisBtn: 'МУСОР'
  },
  EN: {
    mainBtn: 'MAIN',
    matrixBtn: 'ORBITS',
    deepBtn: 'SENSORS',
    solarBtn: 'SOLAR',
    bhBtn: 'BLACK HOLE',
    debrisBtn: 'DEBRIS'
  }
};

export default function C2Nav({ activePage, onNavigate }) {
  const { lang, setLang } = useStore();
  const labels = NAV_LABELS[lang];

  return (
    <nav className="c2-nav">
      <button
        type="button"
        className="c2-btn c2-btn--ghost"
        onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
      >
        {lang}
      </button>
      {PAGES.map((page) => {
        const isActive = activePage === page.id;
        return (
          <button
            key={page.id}
            type="button"
            className={`c2-btn c2-btn--${page.variant}${isActive ? ' c2-btn--nav-active' : ''}`}
            onClick={() => onNavigate(page.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            {labels[page.key]}
          </button>
        );
      })}
    </nav>
  );
}
