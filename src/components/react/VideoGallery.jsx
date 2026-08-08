import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Building2, PawPrint, Heart, DoorOpen, ClipboardList, Play, X } from 'lucide-react';
import './VideoGallery.css';

const ICONS = { Stethoscope, Building2, PawPrint, Heart, DoorOpen, ClipboardList };

export default function VideoGallery({ videos }) {
  const [activeId, setActiveId] = useState(null);
  const closeBtnRef = useRef(null);
  const active = videos.find((v) => v.id === activeId) ?? null;

  const close = useCallback(() => setActiveId(null), []);

  // Bloquea el scroll del body y permite cerrar con Escape mientras el modal está abierto
  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [active, close]);

  return (
    <div className="vg-root">
      <div className="vg-grid">
        {videos.map((video, index) => {
          const Icon = ICONS[video.icon];
          return (
            <motion.button
              key={video.id}
              type="button"
              className="vg-card"
              style={{ '--accent': video.accent }}
              onClick={() => setActiveId(video.id)}
              aria-label={`Ver video: ${video.title}`}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="vg-card__pattern" aria-hidden="true" />
              <span className="vg-card__icon" aria-hidden="true">
                <Icon strokeWidth={1.5} size={22} />
              </span>
              <span className="vg-card__play" aria-hidden="true">
                <Play strokeWidth={0} size={18} fill="currentColor" />
              </span>
              <span className="vg-card__body">
                <span className="vg-card__title">{video.title}</span>
                <span className="vg-card__desc">{video.description}</span>
                <span className="vg-card__cta">Ver video</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {active && (
        <div
          className="vg-modal"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="vg-modal__panel">
            <button
              ref={closeBtnRef}
              type="button"
              className="vg-modal__close"
              onClick={close}
              aria-label="Cerrar video"
            >
              <X strokeWidth={2} size={20} />
            </button>
            <div className="vg-modal__video-wrap">
              <video
                key={active.id}
                className="vg-modal__video"
                src={active.src}
                controls
                autoPlay
                playsInline
                preload="none"
              />
            </div>
            <div className="vg-modal__info">
              <h3 className="vg-modal__title">{active.title}</h3>
              <p className="vg-modal__desc">{active.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
