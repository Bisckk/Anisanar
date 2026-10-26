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
  /** Se muestra en el bloque destacado grande; el resto va en la cuadrícula del equipo. */
  featured?: boolean;
}

export const team: TeamMember[] = [
  {
    id: 'dra-carolina-martinez',
    name: 'Dra. Carolina Martinez Pico',
    role: 'Directora y Fundadora',
    specialty: 'Medicina Interna de Caninos y Felinos · Nutrición de Animales de Compañía',
    bio: 'Fundadora de Anisanar en 2011. Su amor, compromiso y respeto por los animales hacen de la Dra. Carolina una excelente profesional.',
    longBio: 'La Dra. Carolina Martinez Pico fundó Anisanar el 5 de septiembre de 2011 en San Gil, Santander, con la convicción de que la medicina veterinaria debe ejercerse con rigor científico y calidez humana. Es médica veterinaria y zootecnista de la Universidad Cooperativa de Colombia, especialista en Medicina Interna de Caninos y Felinos (UPTC) y en Nutrición de Animales de Compañía (Universidad de La Salle). Más de 15 años después, sigue al frente de la clínica que vio crecer desde una pequeña casa hasta las instalaciones actuales.',
    img: '/team/carolina-martinez.webp',
    imgAlt: 'Dra. Carolina Martinez Pico, Directora y Fundadora de Anisanar Veterinaria',
    credentials: ['Med. Veterinaria y Zootecnista — Universidad Cooperativa de Colombia', 'Esp. Medicina Interna de Caninos y Felinos — UPTC', 'Esp. Nutrición de Animales de Compañía — Universidad de La Salle'],
    social: {},
    featured: true,
  },
  {
    id: 'dra-maria-jose-acevedo',
    name: 'Dra. María José Acevedo Pimiento',
    role: 'Médica Veterinaria',
    specialty: 'Médica Veterinaria Zootecnista',
    bio: 'Su pasión y compromiso por el cuidado y bienestar de los animales de compañía la caracterizan.',
    longBio: 'La Dra. María José es Médica Veterinaria Zootecnista, egresada de la Universidad Cooperativa de Colombia en 2026. Su pasión y compromiso por el cuidado y bienestar de los animales de compañía la caracterizan. Su actualización y aprendizaje continuo contribuyen a una atención responsable, cercana e integral, siempre pensando en el bienestar de cada paciente y en la tranquilidad de quienes los consideran parte de su familia.',
    img: '/team/maria-jose-acevedo.webp',
    imgAlt: 'Dra. María José Acevedo Pimiento, Médica Veterinaria Zootecnista de Anisanar',
    credentials: ['Médica Veterinaria Zootecnista — Universidad Cooperativa de Colombia (2026)'],
    social: {},
  },
  {
    id: 'dr-juan-jose-rueda',
    name: 'Dr. Juan José Rueda',
    role: 'Médico Veterinario',
    specialty: 'Médico Veterinario',
    bio: 'La medicina veterinaria es su vocación, no solo su trabajo. ¡Cada colita feliz al salir de la consulta es su mejor recompensa!',
    longBio: 'Juan José es médico veterinario de la Universidad de Santander, donde culminó sus estudios en el año 2024. La medicina veterinaria es su vocación, no solo su trabajo, como él mismo lo dice. Le fascina la complejidad de la ciencia médica, pero lo que realmente lo mueve es la oportunidad de sanar y proteger a los animales. Estudió esta profesión para ser el aliado de su bienestar y para asegurar que la conexión tan especial que tienen con sus humanos dure por mucho más tiempo. ¡Cada colita feliz al salir de la consulta es su mejor recompensa!',
    img: '/team/juan-jose-rueda.webp',
    imgAlt: 'Dr. Juan José Rueda, Médico Veterinario de Anisanar',
    credentials: ['Médico Veterinario — Universidad de Santander (2024)'],
    social: {},
  },
  {
    id: 'luis-martinez',
    name: 'Luis Martinez Arias',
    role: 'Bacteriólogo',
    specialty: 'Bacteriólogo · Laboratorio clínico',
    bio: 'Más de 35 años de experiencia respaldan los diagnósticos que día a día se realizan en la clínica.',
    longBio: 'Además de ser el papá de la Dra. Carolina, es el bacteriólogo de Anisanar desde hace 4 años. Es egresado de la Universidad Industrial de Santander y cuenta con más de 35 años de experiencia profesional. Su pasión, entrega y compromiso por lo que hace han contribuido al buen desarrollo de los diagnósticos que día a día se realizan en la clínica.',
    img: '/team/luis-martinez.webp',
    imgAlt: 'Luis Martinez Arias, Bacteriólogo de Anisanar',
    credentials: ['Bacteriólogo — Universidad Industrial de Santander', 'Más de 35 años de experiencia profesional'],
    social: {},
  },
  {
    id: 'daniela-ruiz',
    name: 'Laura Daniela Ruiz',
    role: 'Auxiliar Veterinaria',
    specialty: 'Técnico Auxiliar Veterinario',
    bio: 'Parte del equipo base de Anisanar desde 2017, brindando a mascotas y propietarios lo mejor de sí.',
    longBio: 'Daniela es Técnico Auxiliar Veterinario, egresada de Corposalud en 2017. Desde entonces ha hecho parte del equipo base de Anisanar, desempeñándose como auxiliar en las diferentes áreas de la clínica y apoyando además las labores diarias de los médicos veterinarios. Sus conocimientos, experiencia y amor por los animales se ven reflejados en sus labores diarias, brindando a mascotas y propietarios lo mejor de sí.',
    img: '/team/daniela-ruiz.webp',
    imgAlt: 'Laura Daniela Ruiz, Auxiliar Veterinaria de Anisanar',
    credentials: ['Técnico Auxiliar Veterinario — Corposalud (2017)', 'En el equipo de Anisanar desde 2017'],
    social: {},
  },
  {
    id: 'ana-maria-villamizar',
    name: 'Ana María Villamizar Chacon',
    role: 'Auxiliar Veterinaria',
    specialty: 'Técnico Auxiliar en Veterinaria',
    bio: 'Más de 6 años en el equipo base de Anisanar, brindando amor a cada paciente que nos visita.',
    longBio: 'Ana María es técnico auxiliar en veterinaria, egresada de Corposalud en 2021. Desde hace más de 6 años forma parte del equipo base de Anisanar, desempeñándose como auxiliar en las diferentes áreas de la clínica y apoyando además las labores diarias de los médicos veterinarios. Es una persona dedicada a sus labores, que brinda amor a cada paciente que nos visita, siempre buscando el bienestar de cada uno de ellos y de sus tutores.',
    img: '/team/ana-maria-villamizar.webp',
    imgAlt: 'Ana María Villamizar Chacon, Auxiliar Veterinaria de Anisanar',
    credentials: ['Técnico Auxiliar en Veterinaria — Corposalud (2021)', 'Más de 6 años en Anisanar'],
    social: {},
  },
  {
    id: 'ximena-munoz',
    name: 'María Ximena Muñoz Baez',
    role: 'Auxiliar Veterinaria',
    specialty: 'Técnico Auxiliar en Veterinaria',
    bio: 'Su responsabilidad, dedicación y pasión la llevaron de sus prácticas académicas al equipo base de la clínica.',
    longBio: 'El amor por los animales hizo que Ximena se formara como técnico auxiliar en veterinaria en Corposalud, culminando sus estudios en 2025. Luego de realizar sus prácticas académicas en Anisanar, pasó a integrar el equipo base de la clínica gracias a su responsabilidad, dedicación y pasión por lo que hace.',
    img: '/team/ximena-munoz.webp',
    imgAlt: 'María Ximena Muñoz Baez, Auxiliar Veterinaria de Anisanar',
    credentials: ['Técnico Auxiliar en Veterinaria — Corposalud (2025)'],
    social: {},
  },
  {
    id: 'veronica-bustos',
    name: 'Cristel Verónica Bustos Marroqui',
    role: 'Auxiliar Administrativa',
    specialty: 'Administración y servicio al cliente',
    bio: 'Suma 15 años de experiencia en administración y servicio al cliente, casi 2 de ellos en Anisanar.',
    longBio: 'Actualmente Verónica se desempeña como auxiliar administrativa de Anisanar, labor que viene desarrollando desde hace casi 2 años, gracias a su larga experiencia en administración y servicio al cliente, sumando de esta manera 15 años de experiencia en este campo. Su amor por los animales y su interés en el bienestar de ellos se ven reflejados en su quehacer diario.',
    img: '/team/veronica-bustos.webp',
    imgAlt: 'Cristel Verónica Bustos Marroqui, Auxiliar Administrativa de Anisanar',
    credentials: ['15 años de experiencia en administración y servicio al cliente'],
    social: {},
  },
  {
    id: 'alexander-cely',
    name: 'Alexander Cely',
    role: 'Peluquería Canina',
    specialty: 'Peluquero canino',
    bio: 'Para él, la peluquería canina no es solo estética: es bienestar, dedicación y amor por nuestros compañeros de cuatro patas.',
    longBio: 'Alex cuenta con más de 12 años de experiencia en peluquería canina y 8 años haciendo parte del equipo de Anisanar, ya que ha convertido su pasión por los animales en su profesión. Tiene experiencia en baño, corte, manejo y cuidado de diferentes razas, siempre buscando brindar a cada mascota un trato respetuoso, seguro y profesional. Para él, la peluquería canina no es solo estética: es bienestar, dedicación y amor por nuestros compañeros de cuatro patas.',
    img: '/team/alexander-cely.webp',
    imgAlt: 'Alexander Cely, Peluquero canino de Anisanar',
    credentials: ['Más de 12 años en peluquería canina', '8 años en el equipo de Anisanar'],
    social: {},
  },
];

/** Especialidades de la clínica (bloque al final de la sección de equipo). */
export const specialties: string[] = [
  'Nutrición',
  'Medicina interna',
  'Oftalmología',
  'Oncología',
  'Dermatología',
  'Endocrinología',
  'Gastroenterología',
  'Neurología',
  'Etología',
  'Imagenología',
  'Medicina holística',
];

/** Detalle de imagenología según la clínica. */
export const imagingDetail = 'Ecografía, rayos X, rinoscopia, broncoscopia y colonoscopia';
