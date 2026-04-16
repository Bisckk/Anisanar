import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import './AnimatedNav.css';

const navItems = [
  { name: 'Nosotros', href: '#about' },
  { name: 'Servicios', href: '#services' },
  { name: 'Equipo', href: '#team' },
  { name: 'Reseñas', href: '#testimonials' },
  { name: 'Contacto', href: '#contact' },
];

export default function AnimatedNav() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  // Scroll-driven values — all continuously interpolated
  const bgOpacity    = useTransform(scrollY, [0, 90], [0, 0.9]);
  const borderOp     = useTransform(scrollY, [0, 90], [0, 0.07]);
  const shadowOp     = useTransform(scrollY, [0, 90], [0, 0.07]);
  const paddingY     = useTransform(scrollY, [0, 90], [22, 11]);

  const navBackground  = useMotionTemplate`rgba(255,255,255,${bgOpacity})`;
  const navBorder      = useMotionTemplate`1px solid rgba(0,0,0,${borderOp})`;
  const navShadow      = useMotionTemplate`0 4px 32px rgba(0,0,0,${shadowOp})`;

  // Pill wrapper: transparent frosted → subtle frosted on scroll
  const wrapperBgOp    = useTransform(scrollY, [0, 90], [0.08, 0.03]);
  const wrapperBorderOp = useTransform(scrollY, [0, 90], [0.14, 0.06]);
  const wrapperBg      = useMotionTemplate`rgba(255,255,255,${wrapperBgOp})`;
  const wrapperBorder  = useMotionTemplate`1px solid rgba(0,0,0,${wrapperBorderOp})`;

  // Threshold for link/burger color swap — triggers the CSS class
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (v) => setScrolled(v > 55));
    return unsubscribe;
  }, [scrollY]);

  return (
    <motion.nav
      className={`animated-nav${scrolled ? ' scrolled' : ''}`}
      style={{
        background: navBackground,
        borderBottom: navBorder,
        boxShadow: navShadow,
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
    >
      {/* Frosted-glass blur layer — always present, opacity driven by scroll */}
      <motion.div
        className="nav-blur-layer"
        style={{ opacity: bgOpacity }}
      />

      <div className="nav-container">
        {/* Logo */}
        <a href="/" className="nav-logo">
          <img src="/logo-anisanar.png" alt="Anisanar" className="logo-img" />
          <span className="logo-text">
            <span className="logo-ani">ANI</span>
            <span className="logo-sanar">SANAR</span>
          </span>
        </a>

        {/* Desktop Links */}
        <motion.div
          className="nav-links-wrapper"
          style={{ background: wrapperBg, border: wrapperBorder }}
        >
          <ul className="nav-links" onMouseLeave={() => setHoveredIndex(null)}>
            {navItems.map((item, index) => (
              <li
                key={item.name}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <a href={item.href} className="nav-link">
                  {item.name}
                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="nav-pill"
                      className="nav-pill"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <div className="nav-actions">
          <a href="#contact" className="nav-cta">
            Agendar cita
          </a>

          {/* Mobile CTA pill (visible on ≥ 640px, hidden on very small) */}
          <a href="#contact" className="nav-cta-mobile">
            Cita
          </a>
        </div>
      </div>

      {/* Mobile scrollable links strip — only on < 1024px */}
      <div className="nav-mobile-strip" aria-label="Navegación rápida">
        <div className="nav-mobile-strip__track">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="nav-mobile-link">
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
