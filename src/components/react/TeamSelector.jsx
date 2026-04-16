import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { team } from '@data/team';
import './TeamSelector.css';

export default function TeamSelector() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs para evitar closures obsoletas con GSAP
  const activeRef = useRef(0);
  const transitionRef = useRef(false);
  const flippedRef = useRef(false);

  const previewRef = useRef(null);
  const innerRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const member = team[activeIndex];

  // ── Seleccionar profesional ─────────────────────────────────────────────────
  function selectMember(idx) {
    if (idx === activeRef.current || transitionRef.current) return;
    transitionRef.current = true;

    // Reset flip sin animación si estaba girado
    if (flippedRef.current) {
      gsap.killTweensOf(innerRef.current);
      gsap.set(innerRef.current, { rotationY: 0 });
      if (backRef.current) backRef.current.style.display = 'none';
      if (frontRef.current) frontRef.current.style.visibility = 'visible';
      flippedRef.current = false;
    }

    // Salida del preview actual
    gsap.to(previewRef.current, {
      opacity: 0,
      y: 12,
      scale: 0.97,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => {
        activeRef.current = idx;
        setActiveIndex(idx);

        // Entrada del nuevo preview
        gsap.fromTo(
          previewRef.current,
          { opacity: 0, y: -12, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power3.out',
            onComplete: () => { transitionRef.current = false; },
          }
        );
      },
    });
  }

  // ── Flip del preview ────────────────────────────────────────────────────────
  function flipCard(e) {
    // Si el click viene del botón cerrar, ignorar (tiene su propio handler)
    if (e?.target?.closest('.preview-back__close')) return;
    if (transitionRef.current) return;

    const inner = innerRef.current;
    const front = frontRef.current;
    const back = backRef.current;

    gsap.killTweensOf(inner);

    if (!flippedRef.current) {
      flippedRef.current = true;
      gsap.timeline()
        .to(inner, {
          rotationY: 90,
          transformPerspective: 1400,
          scale: 0.96,
          duration: 0.38,
          ease: 'power3.in',
        })
        .call(() => {
          front.style.visibility = 'hidden';
          back.style.display = 'flex';
        })
        .fromTo(inner,
          { rotationY: -90, scale: 0.96 },
          { rotationY: 0, transformPerspective: 1400, scale: 1, duration: 0.42, ease: 'power3.out' }
        );
    } else {
      flippedRef.current = false;
      gsap.timeline()
        .to(inner, {
          rotationY: -90,
          transformPerspective: 1400,
          scale: 0.96,
          duration: 0.38,
          ease: 'power3.in',
        })
        .call(() => {
          back.style.display = 'none';
          front.style.visibility = 'visible';
        })
        .fromTo(inner,
          { rotationY: 90, scale: 0.96 },
          { rotationY: 0, transformPerspective: 1400, scale: 1, duration: 0.42, ease: 'power3.out' }
        );
    }
  }

  function closeBack(e) {
    e.stopPropagation();
    if (!flippedRef.current) return;
    flippedRef.current = false;

    const inner = innerRef.current;
    const back = backRef.current;
    const front = frontRef.current;

    gsap.killTweensOf(inner);
    gsap.timeline()
      .to(inner, {
        rotationY: -90,
        transformPerspective: 1400,
        scale: 0.96,
        duration: 0.38,
        ease: 'power3.in',
      })
      .call(() => {
        back.style.display = 'none';
        front.style.visibility = 'visible';
      })
      .fromTo(inner,
        { rotationY: 90, scale: 0.96 },
        { rotationY: 0, transformPerspective: 1400, scale: 1, duration: 0.42, ease: 'power3.out' }
      );
  }

  return (
    <div className="ts-wrapper">

      {/* ── ROSTER ─────────────────────────────────────────────────────────── */}
      <div className="ts-roster" role="list" aria-label="Selecciona un profesional">
        {team.map((m, i) => (
          <button
            key={m.id}
            role="listitem"
            className={`ts-slot${activeIndex === i ? ' ts-slot--active' : ''}`}
            onClick={() => selectMember(i)}
            aria-label={`Ver perfil de ${m.name}`}
            aria-pressed={activeIndex === i}
          >
            {/* Framer Motion Target Flip for PC active state */}
            {activeIndex === i && (
              <motion.div
                layoutId="target-flip"
                className="ts-target-flip"
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}

            {/* Indicador "P1" estilo Smash (Mobile) */}
            {activeIndex === i && (
              <span className="ts-slot__cursor" aria-hidden="true">
                ▼ SELECCIONADO
              </span>
            )}

            {/* Número */}
            <span className="ts-slot__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Retrato */}
            <div className={`ts-slot__portrait ${m.locked ? 'ts-locked' : ''}`}>
              {m.locked ? (
                <div className="ts-locked-portrait">?</div>
              ) : (
                <img src={m.img} alt={m.name} loading="lazy" />
              )}
              <div className="ts-slot__shine" aria-hidden="true" />
            </div>

            {/* Pie */}
            <div className="ts-slot__foot">
              <span className="ts-slot__name">
                {m.name.split(' ').at(-1)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* ── PREVIEW ────────────────────────────────────────────────────────── */}
      <div className="ts-stage">
        <div
          className="ts-preview"
          ref={previewRef}
        >
          <div
            className="ts-card"
            ref={innerRef}
            onClick={flipCard}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && flipCard(e)}
            aria-label={`${member.name} — toca para ver perfil completo`}
          >

            {/* FRONT */}
            <div className={`ts-card__front ${member.locked ? 'ts-locked' : ''}`} ref={frontRef}>
              {member.locked ? (
                <div className="ts-locked-preview">?</div>
              ) : (
                <img
                  src={member.img}
                  alt={member.imgAlt}
                  className="ts-card__img"
                />
              )}
              <div className="ts-card__gradient" aria-hidden="true" />
              <div className="ts-card__info">
                <h3 className="ts-card__name">{member.name}</h3>
                <p className="ts-card__role">{member.role}</p>
                <p className="ts-card__spec">{member.specialty}</p>
              </div>
              <span className="ts-card__hint" aria-hidden="true">
                Ver perfil →
              </span>
            </div>

            {/* BACK */}
            <div
              className="ts-card__back"
              ref={backRef}
              style={{ display: 'none' }}
              aria-hidden="true"
            >
              <div className="ts-card__back-bar" />

              <button className="preview-back__close" onClick={closeBack} aria-label="Cerrar">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>

              <div className="ts-card__back-head">
                {member.locked ? (
                  <div className="ts-locked-avatar">?</div>
                ) : (
                  <img src={member.img} alt="" className="ts-card__back-avatar" />
                )}
                <div>
                  <h3 className="ts-card__back-name">{member.name}</h3>
                  <p className="ts-card__back-role">{member.role}</p>
                </div>
              </div>

              <p className="ts-card__back-spec">{member.specialty}</p>

              <div className="ts-card__back-divider" />

              <p className="ts-card__back-bio">
                {member.longBio || member.bio}
              </p>

              <ul className="ts-card__back-creds">
                {member.credentials.map((c, ci) => (
                  <li key={ci} className="ts-card__back-cred">
                    <span className="ts-card__back-dot" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Nombre grande debajo del preview — estilo Smash */}
        <div className="ts-nameplate" aria-hidden="true">
          <span className="ts-nameplate__name">{member.name}</span>
          <span className="ts-nameplate__role">{member.role}</span>
        </div>
      </div>

    </div>
  );
}
