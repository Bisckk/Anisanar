import { useEffect, useMemo, useRef, useState } from 'react';
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
    alt: 'Camada de cachorros doberman en las instalaciones de Anisanar',
    label: 'Cuidado diario',
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

// Mismos cortes que el resto del sitio para este componente.
function getColumnCount(width) {
  if (width <= 480) return 1;
  if (width <= 768) return 2;
  return 3;
}

// Reparte las fotos en columnas explícitas balanceando la altura acumulada
// (no el conteo de items): cada foto va a la columna más corta hasta ese
// momento, usando su aspect-ratio real. Así las columnas terminan parejas
// y no quedan huecos al final de una columna más corta que las demás.
function distributeIntoColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  const heights = new Array(columnCount).fill(0);

  items.forEach((photo, index) => {
    const [w, h] = photo.ratio.split('/').map(Number);
    const heightUnit = h / w;

    let shortest = 0;
    for (let c = 1; c < columnCount; c++) {
      if (heights[c] < heights[shortest]) shortest = c;
    }

    columns[shortest].push({ ...photo, index });
    heights[shortest] += heightUnit;
  });

  return columns;
}

export default function MasonryGallery() {
  const scrollDirRef = useRef('down');
  const containerRef = useRef(null);
  // Arranca en 3 (igual que el render del servidor) y se corrige en el
  // primer efecto tras montar, antes de que las imágenes se hagan visibles.
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const check = () => setColumnCount(getColumnCount(window.innerWidth));
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const columns = useMemo(
    () => distributeIntoColumns(photos, columnCount),
    [columnCount]
  );

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

  // Revela cada item una sola vez cuando entra al viewport (con margen
  // generoso para que ya esté visible antes de que el usuario llegue a él).
  // No se vuelve a ocultar al salir. Depende de columnCount porque al
  // recalcular columnas los items cambian de contenedor.
  useEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('.masonry-item');

    gsap.set(items, { opacity: 0, y: 52, scale: 0.94 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

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

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '200px 0px 200px 0px',
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [columnCount]);

  return (
    <div className="masonry-grid" ref={containerRef}>
      {columns.map((column, ci) => (
        <div className="masonry-column" key={ci}>
          {column.map(({ src, alt, label, ratio, index }) => (
            <div key={index} className="masonry-item">
              <div className="masonry-img-wrap" style={{ aspectRatio: ratio }}>
                <img src={src} alt={alt} className="masonry-img" loading="lazy" />
                <div className="masonry-overlay" aria-hidden="true">
                  <span className="masonry-label">{label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
