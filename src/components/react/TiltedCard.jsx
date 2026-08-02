import { useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring } from 'framer-motion';
import './TiltedCard.css';

const springValues = { damping: 28, stiffness: 140, mass: 1.2 };

export default function TiltedCard({
  imageSrc,
  imageAlt = '',
  badgeText,
  rotateAmplitude = 14,
  scaleOnHover = 1.03,
}) {
  const ref = useRef(null);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, springValues);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3), transparent 55%)`;

  function handleMouseMove(e) {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handleMouseEnter() {
    if (prefersReducedMotion) return;
    scale.set(scaleOnHover);
    glareOpacity.set(1);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    glareOpacity.set(0);
  }

  return (
    <div
      ref={ref}
      className="tilted-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="tilted-card__inner"
        style={{ rotateX, rotateY, scale }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="tilted-card__img"
          loading="lazy"
        />
        <motion.div
          className="tilted-card__glare"
          style={{ opacity: glareOpacity, background: glareBackground }}
          aria-hidden="true"
        />
        {badgeText && (
          <div className="tilted-card__badge">
            <span>{badgeText}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
