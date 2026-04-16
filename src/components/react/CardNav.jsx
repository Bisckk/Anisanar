import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import './CardNav.css';

const ChevronRight = () => (
  <svg className="nav-card-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const NAV_ITEMS = [
  {
    label: 'Clínica',
    bgColor: '#f1f5f9', // sand
    textColor: '#1e293b', // charcoal
    links: [
      { label: 'Servicios Médicos', href: '#services' },
      { label: 'Nuestro Equipo', href: '#team' },
      { label: 'Sobre Nosotros', href: '#about' },
    ],
  },
  {
    label: 'Pacientes',
    bgColor: '#8CC63F', // clay (green)
    textColor: '#ffffff',
    links: [
      { label: 'Reseñas', href: '#testimonials' },
      { label: 'Galería', href: '#gallery' },
      { label: 'Preguntas Frecuentes', href: '#faq' },
    ],
  },
  {
    label: 'Urgencias',
    bgColor: '#2BAABC', // sage (teal)
    textColor: '#ffffff',
    links: [
      { label: 'Contactar ahora', href: '#contact' },
      { label: 'Ubicación 24h', href: '#contact' },
    ],
  },
];

const CardNav = ({
  className = '',
  ease = 'power3.out',
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 160;

    const contentEl = navEl.querySelector('.card-nav-content');
    if (contentEl) {
      const wasVisible = contentEl.style.visibility;
      const wasPointerEvents = contentEl.style.pointerEvents;
      const wasPosition = contentEl.style.position;
      const wasHeight = contentEl.style.height;

      contentEl.style.visibility = 'visible';
      contentEl.style.pointerEvents = 'auto';
      contentEl.style.position = 'static';
      contentEl.style.height = 'auto';

      contentEl.offsetHeight;

      const topBar = 60;
      const padding = 16;
      const contentHeight = contentEl.scrollHeight;

      contentEl.style.visibility = wasVisible;
      contentEl.style.pointerEvents = wasPointerEvents;
      contentEl.style.position = wasPosition;
      contentEl.style.height = wasHeight;

      return topBar + contentHeight + padding;
    }

    return 160;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.45,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.15');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  // ─── Scroll State to trigger transparent -> glass ───────────────────────────
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      // 50px tolerance
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    // Initialize immediately
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = i => el => {
    if (el) cardsRef.current[i] = el;
  };

  const handleCtaClick = () => {
    window.location.href = '#contact';
  };

  const handleLinkClick = () => {
    // delay to allow click before closing, or just close seamlessly
    setTimeout(() => {
      if (isExpanded) {
        toggleMenu();
      }
    }, 100);
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''} ${scrolled ? 'scrolled' : ''}`}>
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Cerrar menú' : 'Abrir menú'}
            tabIndex={0}
            style={{ color: '#ffffff' }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <a href="/" className="logo-container" aria-label="Inicio">
            <img src="/logo-anisanar.png" alt="Anisanar Logo" className="logo-img" />
            <span className="logo-text">
              <span className="logo-ani">ANI</span>
              <span className="logo-sanar">SANAR</span>
            </span>
          </a>

          <button
            type="button"
            className="card-nav-cta-button"
            onClick={handleCtaClick}
          >
            Agendar cita
          </button>
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {NAV_ITEMS.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <a key={`${lnk.label}-${i}`} className="nav-card-link" href={lnk.href} onClick={handleLinkClick}>
                    <ChevronRight />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
