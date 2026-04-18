import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './MasonryGallery.css';

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=75&fm=webp&auto=format',
    alt: 'Dos perros corriendo juntos al aire libre',
    label: 'Bienestar animal',
    ratio: '3/4',
  },
  {
    src: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=75&fm=webp&auto=format',
    alt: 'Golden retriever siendo examinado por veterinaria',
    label: 'Consulta general',
    ratio: '4/5',
  },
  {
    src: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&q=75&fm=webp&auto=format',
    alt: 'Gato naranja tranquilo en la consulta',
    label: 'Medicina felina',
    ratio: '1/1',
  },
  {
    src: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=600&q=75&fm=webp&auto=format',
    alt: 'Perro sano y activo jugando',
    label: 'Seguimiento nutricional',
    ratio: '3/4',
  },
  {
    src: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&q=75&fm=webp&auto=format',
    alt: 'Veterinario revisa a perro labrador en camilla',
    label: 'Exploración completa',
    ratio: '4/3',
  },
  {
    src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=75&fm=webp&auto=format',
    alt: 'Veterinaria sonriendo con un cachorro',
    label: 'Cuidado con vocación',
    ratio: '3/4',
  },
];

export default function MasonryGallery() {
  const scrollDirRef = useRef('down');
  const containerRef = useRef(null);

  // Detecta dirección de scroll en tiempo real
  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) {
        scrollDirRef.current = y > lastY ? 'down' : 'up';
        lastY = y;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Anima cada item cuando entra/sale del viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('.masonry-item');

    // Estado inicial: invisible
    gsap.set(items, { opacity: 0, y: 52, scale: 0.94 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          gsap.killTweensOf(entry.target);

          if (entry.isIntersecting) {
            // Entra al viewport → anima desde la dirección del scroll
            const fromY = scrollDirRef.current === 'down' ? 52 : -52;

            gsap.fromTo(
              entry.target,
              { opacity: 0, y: fromY, scale: 0.94 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.72,
                ease: 'power3.out',
              }
            );
          } else {
            // Sale del viewport → desvanecido suave hacia la dirección contraria
            const toY = scrollDirRef.current === 'down' ? -24 : 24;

            gsap.to(entry.target, {
              opacity: 0,
              y: toY,
              scale: 0.96,
              duration: 0.45,
              ease: 'power2.in',
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-10px 0px -10px 0px',
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="masonry-grid" ref={containerRef}>
      {photos.map(({ src, alt, label, ratio }, i) => (
        <div key={i} className="masonry-item">
          <div className="masonry-img-wrap" style={{ aspectRatio: ratio }}>
            <img src={src} alt={alt} className="masonry-img" loading="lazy" />
            <div className="masonry-overlay" aria-hidden="true">
              <span className="masonry-label">{label}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
