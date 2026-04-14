import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnimatedNav.css';

const navItems = [
  { name: 'Nosotros', href: '#about' },
  { name: 'Servicios', href: '#services' },
  { name: 'Equipo', href: '#team' },
  { name: 'Reseñas', href: '#testimonials' },
  { name: 'Contacto', href: '#contact' },
];

export default function AnimatedNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`animated-nav ${scrolled ? 'scrolled' : ''}`}>
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
        <div className="nav-links-wrapper">
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
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="nav-actions">
          <a href="#contact" className="nav-cta">
            Agendar cita
          </a>

          {/* Mobile Burger */}
          <button 
            className={`nav-burger ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                className="mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a href="#contact" className="mobile-cta" onClick={() => setMobileMenuOpen(false)}>
              Agendar cita
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
