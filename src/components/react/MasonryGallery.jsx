import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './MasonryGallery.css';

const photos = [
  {
    src: '/anisanar/gallery-michi-gerente.webp',
    alt: 'Michi, la gata mascota de la clínica Anisanar, sentada en la silla de gerencia',
    label: 'Nuestra mascota de oficina',
    ratio: '3/4',
  },
  {
    src: '/anisanar/gallery-cachorros-doberman.webp',
    alt: 'Camada de cachorros doberman en la guardería de Anisanar',
    label: 'Guardería y cuidado diario',
    ratio: '3/4',
  },
  {
    src: '/anisanar/gallery-monitoreo-anestesia.webp',
    alt: 'Paciente canino bajo monitoreo anestésico continuo',
    label: 'Monitoreo anestésico',
    ratio: '4/5',
  },
  {
    src: '/anisanar/gallery-carino-cachorro.webp',
    alt: 'Veterinaria de Anisanar dando cariño a un cachorro hospitalizado',
    label: 'Cuidado con cariño',
    ratio: '4/5',
  },
  {
    src: '/anisanar/gallery-consulta-campo.webp',
    alt: 'Auxiliar veterinaria atendiendo a un perro al aire libre',
    label: 'Atención en campo',
    ratio: '3/4',
  },
  {
    src: '/anisanar/gallery-golden-dormido.webp',
    alt: 'Veterinaria sosteniendo a un cachorro golden retriever dormido',
    label: 'Consulta pediátrica',
    ratio: '3/4',
  },
  {
    src: '/anisanar/gallery-microcirugia-ocular.webp',
    alt: 'Detalle de un procedimiento de microcirugía oftalmológica',
    label: 'Microcirugía oftalmológica',
    ratio: '1/1',
  },
  {
    src: '/anisanar/gallery-equipo-quirurgico.webp',
    alt: 'Equipo veterinario de Anisanar trabajando en conjunto durante una cirugía',
    label: 'Precisión en cada procedimiento',
    ratio: '4/3',
  },
  {
    src: '/anisanar/gallery-tienda-accesorios.webp',
    alt: 'Exhibición de accesorios y productos para mascotas en Anisanar',
    label: 'Tienda y accesorios',
    ratio: '3/4',
  },
  {
    src: '/anisanar/gallery-mural-instalaciones.webp',
    alt: 'Perro junto a un mural artístico en las instalaciones de Anisanar',
    label: 'Instalaciones pensadas para ellos',
    ratio: '3/4',
  },
  {
    src: '/anisanar/gallery-mascota-feliz.webp',
    alt: 'Mascota feliz tras su consulta en Anisanar',
    label: 'Mascota feliz y saludable',
    ratio: '4/5',
  },
  {
    src: '/anisanar/gallery-equipo-reunion.webp',
    alt: 'Equipo humano de Anisanar reunido en la clínica',
    label: 'Nuestro equipo humano',
    ratio: '4/3',
  },
  {
    src: '/anisanar/gallery-farmacia.webp',
    alt: 'Estantería de la farmacia veterinaria propia de Anisanar',
    label: 'Farmacia veterinaria propia',
    ratio: '4/5',
  },
  {
    src: '/anisanar/gallery-fachada-clinica.webp',
    alt: 'Fachada del centro veterinario Anisanar en San Gil, Santander',
    label: 'Nuestras instalaciones en San Gil',
    ratio: '3/4',
  },
  {
    src: '/anisanar/gallery-bienvenida-entrada.webp',
    alt: 'Perro sentado a la entrada de Anisanar bajo el letrero de bienvenida',
    label: 'Bienvenidos a Anisanar',
    ratio: '4/5',
  },
  {
    src: '/anisanar/gallery-fisioterapia-pelota.webp',
    alt: 'Perro en sesión de fisioterapia sobre balón terapéutico',
    label: 'Fisioterapia individualizada',
    ratio: '4/5',
  },
  {
    src: '/anisanar/gallery-cirugia-felina.webp',
    alt: 'Veterinaria de Anisanar realizando una cirugía felina',
    label: 'Cirugía felina especializada',
    ratio: '4/3',
  },
  {
    src: '/anisanar/gallery-cachorros-recien-nacidos.webp',
    alt: 'Veterinaria de Anisanar sosteniendo cachorros recién nacidos',
    label: 'Momentos que nos emocionan',
    ratio: '4/5',
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
