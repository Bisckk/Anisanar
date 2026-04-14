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
}

export const team: TeamMember[] = [
  {
    id: 'dra-elena-vargas',
    name: 'Dra. Elena Vargas',
    role: 'Directora Médica',
    specialty: 'Medicina Interna y Diagnóstico por Imagen',
    bio: 'Más de 15 años dedicados a la medicina felina y canina. Especialista en diagnóstico ecográfico avanzado.',
    longBio: 'La Dra. Vargas fundó Anisanar con la convicción de que la medicina veterinaria debe combinar rigor científico con un trato humano y empático tanto hacia los animales como hacia sus familias. Se formó en la Universidad Complutense de Madrid y completó su especialización en medicina interna en el Royal Veterinary College de Londres.',
    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80',
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
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
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
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
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
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80',
    imgAlt: 'Dr. Andrés Mora, especialista en urgencias veterinarias',
    credentials: ['Lic. Veterinaria — UAB', 'Residencia UCI Veterinaria', 'Cert. RCP y Medicina de Urgencias'],
    social: {
      linkedin: 'https://linkedin.com',
    },
  },
];

export function getMemberById(id: string): TeamMember | undefined {
  return team.find((m) => m.id === id);
}
