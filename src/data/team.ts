export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  longBio: string;
  img: string;
  imgAlt: string;
  credentials: string[];
  social: {
    instagram?: string;
    linkedin?: string;
  };
  locked?: boolean;
}

export const team: TeamMember[] = [
  {
    id: 'dra-elena-vargas',
    name: 'Dra. Elena Vargas',
    role: 'Directora Médica',
    specialty: 'Medicina Interna y Diagnóstico por Imagen',
    bio: 'Más de 15 años dedicados a la medicina felina y canina. Especialista en diagnóstico ecográfico avanzado.',
    longBio: 'La Dra. Vargas fundó Anisanar con la convicción de que la medicina veterinaria debe combinar rigor científico con un trato humano y empático tanto hacia los animales como hacia sus familias. Se formó en la Universidad Complutense de Madrid y completó su especialización en medicina interna en el Royal Veterinary College de Londres.',
    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=75&fm=webp&auto=format',
    imgAlt: 'Dra. Elena Vargas, Directora Médica de Anisanar Veterinaria',
    credentials: ['Lic. Veterinaria — UCM', 'MSc Medicina Interna — RVC Londres', 'Cert. Ecografía AVEPA'],
    social: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'dr-marcos-ibarra',
    name: 'Dr. Marcos Ibarra',
    role: 'Cirujano Principal',
    specialty: 'Cirugía de Tejidos Blandos y Ortopedia',
    bio: 'Especialista en cirugía mínimamente invasiva con más de 2,000 procedimientos realizados con éxito.',
    longBio: 'El Dr. Ibarra es referencia en cirugía laparoscópica veterinaria en la región. Su precisión técnica y su protocolo de manejo del dolor perioperatorio han reducido significativamente el tiempo de recuperación de los pacientes. Colabora como ponente en congresos nacionales e internacionales de cirugía veterinaria.',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=75&fm=webp&auto=format',
    imgAlt: 'Dr. Marcos Ibarra, Cirujano Principal de Anisanar Veterinaria',
    credentials: ['Lic. Veterinaria — UAB', 'Diplomado Cirugía ECVS', 'Cert. Laparoscopía Veterinaria'],
    social: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'dra-sofia-luna',
    name: 'Dra. Sofía Luna',
    role: 'Veterinaria — Nutrición Clínica',
    specialty: 'Nutrición y Medicina Preventiva',
    bio: 'Apasionada por la alimentación como herramienta terapéutica. Autora de protocolos de control de obesidad canina.',
    longBio: 'La Dra. Luna combina su práctica clínica diaria con la investigación en nutrición aplicada. Sus protocolos de manejo de obesidad canina han sido adoptados por varias clínicas de referencia. Es miembro del grupo de trabajo de nutrición de la AVEPA y colaboradora de la revista Argos Veterinaria.',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=75&fm=webp&auto=format',
    imgAlt: 'Dra. Sofía Luna, especialista en nutrición veterinaria clínica',
    credentials: ['Lic. Veterinaria — UZA', 'MSc Nutrición Animal — UCO', 'Miembro AVEPA Nutrición'],
    social: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'dr-andres-mora',
    name: 'Dr. Andrés Mora',
    role: 'Veterinario — Urgencias',
    specialty: 'Medicina de Urgencias y Cuidados Intensivos',
    bio: 'Especialista en medicina de urgencias. Garantiza la atención 24/7 para las situaciones críticas de tu mascota.',
    longBio: 'El Dr. Mora lidera el área de urgencias y cuidados intensivos de Anisanar. Su formación en medicina de emergencias en el Hospital Clínic Veterinari de la UAB y su temperamento tranquilo bajo presión lo convierten en el profesional ideal para los momentos más críticos. Implementó el protocolo de triaje de urgencias que actualmente usamos en la clínica.',
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=75&fm=webp&auto=format',
    imgAlt: 'Dr. Andrés Mora, especialista en urgencias veterinarias',
    credentials: ['Lic. Veterinaria — UAB', 'Residencia UCI Veterinaria', 'Cert. RCP y Medicina de Urgencias'],
    social: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'locked-1',
    name: '???',
    role: 'Especialista',
    specialty: 'Nuevos retos',
    bio: 'Próximamente descubriremos a este nuevo integrante de élite.',
    longBio: 'Nuestra clínica está en constante crecimiento. Seguimos evaluando y sumando los mejores talentos y especialistas del sector veterinario para unirse a nuestras filas. Este espacio está reservado para una próxima revelación que potenciará los cuidados de tus mascotas.',
    img: '', // Will be handled via CSS silhouette
    imgAlt: 'Personaje bloqueado',
    credentials: ['Por desbloquear'],
    social: {},
    locked: true,
  },
  {
    id: 'locked-2',
    name: '???',
    role: 'Nutrición',
    specialty: 'Nuevos retos',
    bio: 'Próximamente descubriremos a este nuevo integrante de élite.',
    longBio: 'Anisanar siempre está cazando talentos. Este espacio está bloqueado temporalmente y aguarda la llegada de un nuevo experto veterinario que compartirá nuestra pasión por el cuidado animal.',
    img: '',
    imgAlt: 'Personaje bloqueado',
    credentials: ['Por desbloquear'],
    social: {},
    locked: true,
  },
  {
    id: 'locked-3',
    name: '???',
    role: 'Dermatología',
    specialty: 'Nuevos retos',
    bio: 'Un nuevo especialista se unirá pronto a nuestro equipo.',
    longBio: 'Estamos en proceso de incorporar a un profesional de primer nivel en esta área. Mantente atento porque pronto revelaremos quién ocupará este puesto clave en Anisanar.',
    img: '',
    imgAlt: 'Personaje bloqueado',
    credentials: ['Por desbloquear'],
    social: {},
    locked: true,
  },
  {
    id: 'locked-4',
    name: '???',
    role: 'Cardiología',
    specialty: 'Nuevos retos',
    bio: 'Próximamente un nuevo talento reforzará nuestras filas.',
    longBio: 'Nuestro compromiso con la excelencia nos impulsa a seguir creciendo. Este espacio está reservado para un especialista que elevará aún más la calidad de atención que ofrecemos a tus mascotas.',
    img: '',
    imgAlt: 'Personaje bloqueado',
    credentials: ['Por desbloquear'],
    social: {},
    locked: true,
  },
  {
    id: 'locked-5',
    name: '???',
    role: 'Rehabilitación',
    specialty: 'Nuevos retos',
    bio: 'Un profesional de élite está por revelarse.',
    longBio: 'El equipo de Anisanar sigue expandiéndose. Este slot guarda el lugar para un futuro miembro que aportará nuevas capacidades y especialidades a nuestra clínica veterinaria.',
    img: '',
    imgAlt: 'Personaje bloqueado',
    credentials: ['Por desbloquear'],
    social: {},
    locked: true,
  },
];

export function getMemberById(id: string): TeamMember | undefined {
  return team.find((m) => m.id === id);
}
