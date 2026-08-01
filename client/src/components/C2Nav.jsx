import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useStore from '../store/useStore';
import useIsMobile from '../hooks/useIsMobile';

const PAGES = [
  { id: 'main', key: 'mainBtn', variant: 'ghost', hintRU: 'Командный HUD', hintEN: 'Command HUD' },
  { id: 'matrix', key: 'matrixBtn', variant: 'cyan', hintRU: 'Орбитальная матрица', hintEN: 'Orbital matrix' },
  { id: 'deepMatrix', key: 'deepBtn', variant: 'danger', hintRU: 'Сенсорный контур', hintEN: 'Sensor suite' },
  { id: 'solarMatrix', key: 'solarBtn', variant: 'amber', hintRU: 'Солнечный супервизор', hintEN: 'Solar supervisor' },
  { id: 'blackHole', key: 'bhBtn', variant: 'amber', hintRU: 'Сингулярность', hintEN: 'Singularity' },
  { id: 'debrisMatrix', key: 'debrisBtn', variant: 'plasma', hintRU: 'Мусор и угрозы', hintEN: 'Debris & threats' }
];

export const NAV_LABELS = {
  RU: {
    mainBtn: 'ГЛАВНАЯ',
    matrixBtn: 'ОРБИТЫ',
    deepBtn: 'СЕНСОРЫ',
    solarBtn: 'СОЛНЦЕ',
    bhBtn: 'ЧЕРНАЯ ДЫРА',
    debrisBtn: 'МУСОР',
    menu: 'МЕНЮ',
    routes: 'МАРШРУТЫ КОМАНДОВАНИЯ',
    close: 'ЗАКРЫТЬ'
  },
  EN: {
    mainBtn: 'MAIN',
    matrixBtn: 'ORBITS',
    deepBtn: 'SENSORS',
    solarBtn: 'SOLAR',
    bhBtn: 'BLACK HOLE',
    debrisBtn: 'DEBRIS',
    menu: 'MENU',
    routes: 'COMMAND ROUTES',
    close: 'CLOSE'
  }
};

export default function C2Nav({ activePage, onNavigate }) {
  const { lang, setLang } = useStore();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const labels = NAV_LABELS[lang];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const deck = document.querySelector('.c2-deck');
    const prevBody = document.body.style.overflow;
    const prevDeck = deck ? deck.style.overflow : '';
    document.body.style.overflow = 'hidden';
    if (deck) deck.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevBody;
      if (deck) deck.style.overflow = prevDeck;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  const go = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  if (!isMobile) {
    return (
      <nav className="c2-nav c2-nav--desktop" aria-label="Desktop navigation">
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
              onClick={() => go(page.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              {labels[page.key]}
            </button>
          );
        })}
      </nav>
    );
  }

  const drawer = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="c2-drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="c2-drawer__backdrop"
            aria-label={labels.close}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            id="c2-command-drawer"
            className="c2-drawer__panel"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={labels.routes}
          >
            <div className="c2-drawer__handle" />
            <div className="c2-drawer__top">
              <div>
                <div className="c2-drawer__kicker">ORBITAL C2</div>
                <div className="c2-drawer__title">{labels.routes}</div>
              </div>
              <button
                type="button"
                className="c2-btn c2-btn--ghost"
                onClick={() => setOpen(false)}
              >
                {labels.close}
              </button>
            </div>

            <div className="c2-drawer__routes">
              {PAGES.map((page, index) => {
                const isActive = activePage === page.id;
                return (
                  <motion.button
                    key={page.id}
                    type="button"
                    className={`c2-route c2-route--${page.variant}${isActive ? ' is-active' : ''}`}
                    onClick={() => go(page.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * index, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="c2-route__index">0{index + 1}</span>
                    <span className="c2-route__body">
                      <span className="c2-route__name">{labels[page.key]}</span>
                      <span className="c2-route__hint">
                        {lang === 'RU' ? page.hintRU : page.hintEN}
                      </span>
                    </span>
                    <span className="c2-route__chevron" aria-hidden="true" />
                  </motion.button>
                );
              })}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="c2-nav-mobile">
        <button
          type="button"
          className="c2-btn c2-btn--ghost"
          onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
        >
          {lang}
        </button>
        <button
          type="button"
          className={`c2-btn c2-btn--cyan c2-menu-toggle${open ? ' is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="c2-command-drawer"
          aria-label={labels.menu}
        >
          <span className="c2-menu-toggle__icon" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="c2-menu-toggle__label">{labels.menu}</span>
        </button>
      </div>

      {mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
