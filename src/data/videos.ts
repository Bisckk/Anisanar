export interface VideoItem {
  id: string;
  title: string;
  description: string;
  src: string;
  icon: 'Building2' | 'PawPrint' | 'Heart' | 'DoorOpen' | 'ClipboardList';
  accent: string;
}

export const videos: VideoItem[] = [
  {
    id: 'bienvenida-equipo',
    title: 'Bienvenido a Anisanar',
    description: 'Conoce a nuestro equipo y todos nuestros servicios — te esperamos en San Gil.',
    src: '/anisanar/video-bienvenida-equipo.mp4',
    icon: 'Heart',
    accent: '#2BAABC',
  },
  {
    id: 'nuestros-servicios',
    title: 'Nuestros servicios',
    description: 'Un recorrido rápido por todo lo que ofrecemos: consulta, laboratorio, hospitalización, cirugía, peluquería y tienda.',
    src: '/anisanar/video-nuestros-servicios.mp4',
    icon: 'ClipboardList',
    accent: '#8CC63F',
  },
  {
    id: 'instalaciones-anisanar',
    title: 'Conoce nuestras instalaciones',
    description: 'Entra con nosotros: recepción, farmacia veterinaria y tienda de accesorios para tu mascota.',
    src: '/anisanar/video-instalaciones-anisanar.mp4',
    icon: 'Building2',
    accent: '#2BAABC',
  },
  {
    id: 'mascota-feliz',
    title: 'Nuestros pacientes',
    description: 'Así de felices se ponen nuestros pacientes en cada visita a Anisanar.',
    src: '/anisanar/video-mascota-feliz.mp4',
    icon: 'PawPrint',
    accent: '#2BAABC',
  },
  {
    id: 'entrada-clinica',
    title: 'Nuestra puerta siempre abierta',
    description: 'Así te recibimos cada día en Anisanar, San Gil.',
    src: '/anisanar/video-entrada-clinica.mp4',
    icon: 'DoorOpen',
    accent: '#8CC63F',
  },
];
