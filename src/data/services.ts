export interface Service {
  id: string;
  emoji: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  includes: string[];
  accent: string;
  image: string;
  imageAlt: string;
  medicalCode: string;
}

export const services: Service[] = [
  {
    id: 'medicina-general',
    emoji: 'Stethoscope',
    title: 'Medicina General',
    shortDesc: 'Consultas completas, diagnóstico preciso y seguimiento personalizado para tu mascota.',
    fullDesc: 'Nuestro servicio de medicina general ofrece atención integral para perros y gatos en todas las etapas de su vida. Realizamos consultas exhaustivas con el tiempo necesario para escuchar tus inquietudes, explorar a fondo a tu mascota y elaborar un plan de salud preventivo y curativo adaptado a sus necesidades específicas.',
    features: [
      'Consulta preventiva anual',
      'Diagnóstico diferencial',
      'Medicina interna',
      'Seguimiento post-tratamiento',
      'Historia clínica digital',
    ],
    includes: [
      'Exploración física completa',
      'Revisión de signos vitales',
      'Valoración nutricional',
      'Prescripción y consejo farmacológico',
      'Certificado de salud',
    ],
    accent: '#2BAABC',
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&q=75&fm=webp&auto=format',
    imageAlt: 'Veterinaria examinando a un perro labrador en consulta',
    medicalCode: 'S01.0',
  },
  {
    id: 'cirugia',
    emoji: 'Syringe',
    title: 'Cirugía',
    shortDesc: 'Procedimientos quirúrgicos de tejidos blandos y ortopedia con protocolos de anestesia modernos.',
    fullDesc: 'Contamos con quirófano completamente equipado y protocolos de anestesia multimodal para garantizar la máxima seguridad de tu mascota. Desde esterilizaciones hasta cirugías de tejidos blandos complejas y ortopedia, nuestro equipo realiza procedimientos con los más altos estándares de asepsia y monitoreo anestésico.',
    features: [
      'Esterilización OVH y orquiectomía',
      'Cirugía de tejidos blandos',
      'Ortopedia básica y avanzada',
      'Endoscopía diagnóstica',
      'Cirugía oncológica',
    ],
    includes: [
      'Valoración prequirúrgica',
      'Anestesia monitorizada',
      'Soporte durante el procedimiento',
      'Hospitalización post-operatoria',
      'Revisión de sutura incluida',
    ],
    accent: '#8CC63F',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=75&fm=webp&auto=format',
    imageAlt: 'Sala de cirugía veterinaria con equipo especializado',
    medicalCode: 'S03.0',
  },
  {
    id: 'diagnostico-imagen',
    emoji: 'Microscope',
    title: 'Diagnóstico por Imagen',
    shortDesc: 'Radiología digital, ecografía y laboratorio in-house para resultados en el mismo día.',
    fullDesc: 'Diagnóstico certero y rápido gracias a nuestro equipamiento de última generación. La radiografía digital de alta resolución, la ecografía abdominal y cardíaca Doppler, y nuestro laboratorio clínico in-house nos permiten obtener resultados el mismo día para tomar decisiones terapéuticas inmediatas.',
    features: [
      'Radiología digital',
      'Ecografía abdominal y cardíaca',
      'Doppler vascular',
      'Laboratorio in-house',
      'Teleradiología con especialistas',
    ],
    includes: [
      'Informe radiológico firmado',
      'Imágenes digitales en CD/email',
      'Análisis hematológico completo',
      'Bioquímica sanguínea',
      'Urianálisis completo',
    ],
    accent: '#2BAABC',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&q=75&fm=webp&auto=format',
    imageAlt: 'Veterinario revisando radiografía digital en pantalla',
    medicalCode: 'S07.0',
  },
  {
    id: 'vacunacion',
    emoji: 'Activity',
    title: 'Vacunación y Desparasitación',
    shortDesc: 'Protocolos actualizados según las guías WSAVA para una inmunidad óptima en todas las edades.',
    fullDesc: 'La prevención es la base de la salud animal. Seguimos los protocolos de vacunación más actualizados avalados por la WSAVA y adaptamos el calendario vacunal a las necesidades de riesgo individual de cada paciente. Incluimos también el asesoramiento sobre desparasitación interna y externa para mantener a tu mascota libre de parásitos.',
    features: [
      'Vacunas core y no-core',
      'Calendario personalizado',
      'Vacunación de cachorros',
      'Refuerzos anuales',
      'Vacunación antirrábica oficial',
    ],
    includes: [
      'Consulta de valoración previa',
      'Carnet de vacunación actualizado',
      'Desparasitación interna',
      'Microchip si es necesario',
      'Recordatorio automático de refuerzo',
    ],
    accent: '#2BAABC',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=75&fm=webp&auto=format',
    imageAlt: 'Veterinaria vacunando a un cachorro golden retriever',
    medicalCode: 'S06.0',
  },
  {
    id: 'nutricion',
    emoji: 'Apple',
    title: 'Nutrición Clínica',
    shortDesc: 'Dietas terapéuticas y planes nutricionales para cada etapa de vida y condición médica.',
    fullDesc: 'La alimentación es la medicina más poderosa y menos aprovechada en la veterinaria. Nuestras veterinarias con formación en nutrición clínica diseñan planes alimenticios individualizados, indicados tanto para animales sanos como para aquellos con condiciones crónicas como obesidad, enfermedad renal, diabetes o patologías digestivas.',
    features: [
      'Evaluación corporal BCS',
      'Dietas terapéuticas',
      'Nutrición en cachorros',
      'Control de peso estructurado',
      'Nutrición en enfermedades crónicas',
    ],
    includes: [
      'Valoración nutricional inicial',
      'Plan alimentario detallado',
      'Seguimiento mensual',
      'Ajuste según evolución',
      'Guía de suplementación',
    ],
    accent: '#2BAABC',
    image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&q=75&fm=webp&auto=format',
    imageAlt: 'Perro sano y bien nutrido durante consulta de nutrición',
    medicalCode: 'S05.0',
  },
  {
    id: 'hospitalizacion',
    emoji: 'Cross',
    title: 'Hospitalización',
    shortDesc: 'Área de hospitalización con monitoreo continuo y cuidados especializados 24/7.',
    fullDesc: 'Nuestra unidad de hospitalización ofrece atención especializada para pacientes que requieren supervisión continua, fluidoterapia, oxigenoterapia o cuidados post-quirúrgicos. Las instalaciones están diseñadas para reducir el estrés del animal con espacios confortables, separación por especie y comunicación diaria con el propietario.',
    features: [
      'Monitoreo continuo de signos vitales',
      'Fluidoterapia y soporte nutricional',
      'Oxigenoterapia',
      'Fisioterapia post-quirúrgica',
      'UCI de cuidados intensivos',
    ],
    includes: [
      'Parte médico diario al propietario',
      'Fluidoterapia incluida',
      'Medicación y curas',
      'Análisis de control',
      'Visita del propietario con cita previa',
    ],
    accent: '#8CC63F',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=75&fm=webp&auto=format',
    imageAlt: 'Área de hospitalización veterinaria limpia y confortable',
    medicalCode: 'S02.0',
  },
];

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}
