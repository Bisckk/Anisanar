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
    id: 'dra-carolina-martinez',
    name: 'Dra. Carolina Martinez Pico',
    role: 'Directora y Fundadora',
    specialty: 'Medicina Interna y Nutrición de Pequeñas Especies',
    bio: 'Fundadora de Anisanar en 2011. Su amor, compromiso y respeto por los animales hacen de la Dra. Carolina una excelente profesional.',
    longBio: 'La Dra. Carolina Martinez Pico fundó Anisanar el 5 de septiembre de 2011 en San Gil, Santander, con la convicción de que la medicina veterinaria debe ejercerse con rigor científico y calidez humana. Es médica veterinaria y zootecnista de la Universidad Cooperativa de Colombia, especialista en Medicina Interna de Pequeñas Especies (UPTC) y en Nutrición Animal (Universidad de La Salle). Más de 15 años después, sigue al frente de la clínica que vio crecer desde una pequeña casa hasta las instalaciones actuales.',
    img: '/team/carolina-martinez.webp',
    imgAlt: 'Dra. Carolina Martinez Pico, Directora y Fundadora de Anisanar Veterinaria',
    credentials: ['Med. Veterinaria y Zootecnista — Universidad Cooperativa de Colombia', 'Esp. Medicina Interna de Pequeñas Especies — UPTC', 'Esp. Nutrición Animal — Universidad de La Salle'],
    social: {},
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
];

export function getMemberById(id: string): TeamMember | undefined {
  return team.find((m) => m.id === id);
}
