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
  comingSoon?: boolean;
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
    id: 'coming-soon-1',
    name: 'Por confirmar',
    role: 'Especialista',
    specialty: 'Próximamente',
    bio: 'Seguimos ampliando el equipo. Próximamente sumaremos un/a especialista en esta área.',
    longBio: 'Anisanar sigue creciendo. Estamos en proceso de incorporar a un/a nuevo/a profesional que refuerce esta área de atención.',
    img: '',
    imgAlt: '',
    credentials: [],
    social: {},
    comingSoon: true,
  },
  {
    id: 'coming-soon-2',
    name: 'Por confirmar',
    role: 'Nutrición',
    specialty: 'Próximamente',
    bio: 'Seguimos ampliando el equipo. Próximamente sumaremos un/a especialista en esta área.',
    longBio: 'Anisanar sigue creciendo. Estamos en proceso de incorporar a un/a nuevo/a profesional que refuerce esta área de atención.',
    img: '',
    imgAlt: '',
    credentials: [],
    social: {},
    comingSoon: true,
  },
  {
    id: 'coming-soon-3',
    name: 'Por confirmar',
    role: 'Dermatología',
    specialty: 'Próximamente',
    bio: 'Seguimos ampliando el equipo. Próximamente sumaremos un/a especialista en esta área.',
    longBio: 'Anisanar sigue creciendo. Estamos en proceso de incorporar a un/a nuevo/a profesional que refuerce esta área de atención.',
    img: '',
    imgAlt: '',
    credentials: [],
    social: {},
    comingSoon: true,
  },
  {
    id: 'coming-soon-4',
    name: 'Por confirmar',
    role: 'Cardiología',
    specialty: 'Próximamente',
    bio: 'Seguimos ampliando el equipo. Próximamente sumaremos un/a especialista en esta área.',
    longBio: 'Anisanar sigue creciendo. Estamos en proceso de incorporar a un/a nuevo/a profesional que refuerce esta área de atención.',
    img: '',
    imgAlt: '',
    credentials: [],
    social: {},
    comingSoon: true,
  },
];
