import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ServiceCarousel.css';

const mod = (n, m) => ((n % m) + m) % m;

function getCardState(offset, isMobile) {
  const abs = Math.abs(offset);

  if (isMobile) {
    return {
      x:       offset * 330,
      rotateY: 0,
      scale:   1,
      opacity: abs === 0 ? 1 : 0,
      zIndex:  abs === 0 ? 10 : 0,
    };
  }

  const STEP    = 340;
  const ROT     = 38;
  const SCALE   = 0.86;
  const OPACITY = 0.5;

  return {
    x:       offset * STEP,
    rotateY: -offset * ROT,
    scale:   abs === 0 ? 1 : abs === 1 ? SCALE : SCALE * 0.82,
    opacity: abs === 0 ? 1 : abs === 1 ? OPACITY : 0,
    zIndex:  abs === 0 ? 10 : abs === 1 ? 5 : 0,
  };
}

export default function ServiceCarousel({ services }) {
  const total = services.length;

  const [active,   setActive] = useState(0);
  const [isMobile, setMobile] = useState(false);
  const [dragging, setDragging] = useState(false);

  const dragStartX = useRef(0);
  const dragMoved  = useRef(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const goTo   = useCallback((i) => setActive(mod(i, total)), [total]);
  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft')  goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // Swipe — disabled on mobile to avoid vertical-scroll conflict
  const onPointerDown = (e) => {
    if (isMobile) return;
    dragStartX.current = e.clientX;
    dragMoved.current  = false;
  };
  const onPointerMove = (e) => {
    if (isMobile) return;
    if (Math.abs(e.clientX - dragStartX.current) > 8) {
      dragMoved.current = true;
      setDragging(true);
    }
  };
  const onPointerUp = (e) => {
    if (isMobile) return;
    if (!dragMoved.current) { setDragging(false); return; }
    const delta = e.clientX - dragStartX.current;
    if      (delta < -50) goNext();
    else if (delta >  50) goPrev();
    setTimeout(() => setDragging(false), 60);
  };

  const activeService = services[active];

  return (
    <div className="sc-root">

      {/* ── Stage ──────────────────────────────────────────────────────── */}
      <div
        className="sc-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {services.map((service, index) => {
          let offset = index - active;
          if (offset >  total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const abs      = Math.abs(offset);
          const isActive = abs === 0;
          const t        = getCardState(offset, isMobile);

          return (
            <motion.article
              key={service.id}
              className={`sc-card${isActive ? ' sc-card--active' : ''}`}
              aria-label={service.title}
              aria-current={isActive ? 'true' : undefined}
              animate={{ x: t.x, rotateY: t.rotateY, scale: t.scale, opacity: t.opacity }}
              style={{ zIndex: t.zIndex, pointerEvents: abs <= 1 ? 'auto' : 'none' }}
              transition={{ type: 'tween', duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => { if (!isActive && !dragging) goTo(index); }}
            >
              <div
                className="sc-card__bg"
                style={{ backgroundImage: `url('${service.image}')` }}
                role="img"
                aria-label={service.imageAlt ?? service.title}
              />
              <div className="sc-card__overlay" />
              <div className="sc-card__rim" style={{ background: service.accent }} />

              <div className="sc-card__body">
                <span className="sc-card__num" style={{ color: service.accent }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="sc-card__title">{service.title}</h3>
                <p  className="sc-card__desc">{service.shortDesc}</p>

                <ul className="sc-card__features" aria-label={`Características de ${service.title}`}>
                  {service.features.slice(0, 3).map((f) => (
                    <li key={f} className="sc-card__feature">
                      <span className="sc-card__dot" style={{ background: service.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`/servicios/${service.id}`}
                  className="sc-card__cta"
                  style={{ color: service.accent }}
                  tabIndex={isActive ? 0 : -1}
                  onClick={(e) => dragging && e.preventDefault()}
                >
                  Ver servicio
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor"
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* ── Controls: prev · dots · next ───────────────────────────────── */}
      {/*   Desktop: arrows float over stage (absolute), dots row below   */}
      {/*   Mobile:  horizontal row [← dots →] below the stage            */}
      <div className="sc-controls">

        <button className="sc-arrow sc-arrow--prev" onClick={goPrev} aria-label="Servicio anterior">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="sc-dots" role="tablist" aria-label="Servicios">
          {services.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === active}
              aria-label={s.title}
              className={`sc-dot${i === active ? ' sc-dot--active' : ''}`}
              onClick={() => goTo(i)}
              style={i === active ? { background: activeService.accent, width: '1.75rem' } : {}}
            />
          ))}
        </div>

        <button className="sc-arrow sc-arrow--next" onClick={goNext} aria-label="Servicio siguiente">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

      </div>

      {/* ── Active label ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.p
          key={active}
          className="sc-label"
          style={{ color: activeService.accent }}
          initial={{ opacity: 0, y:  5 }}
          animate={{ opacity: 1, y:  0 }}
          exit={{    opacity: 0, y: -5 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeService.title}
        </motion.p>
      </AnimatePresence>

    </div>
  );
}
