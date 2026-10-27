import { Award, BookOpen, GraduationCap, Lightbulb, Scale, Terminal } from 'lucide-react';

// Las primeras HOME_CREDENTIALS se muestran en la home; /sobre-mi muestra todas.
export const HOME_CREDENTIALS = 3;

export const credentials = [
  { text: 'Doctor Honoris Causa — Federación Iberoamericana de Abogados', icon: Award },
  { text: 'Especialista en Derecho Procesal Civil — Ex Relator y Funcionario Judicial', icon: Scale },
  { text: 'Primer Director de IA en un Municipio en Argentina (San Miguel de Tucumán)', icon: Lightbulb },
  { text: 'Director de DYNTEC (UNT) — Laboratorio de IA, Innovación y Transformación Digital', icon: Terminal },
  { text: 'Docente UNT en Derechos de las Nuevas Tecnologías', icon: GraduationCap },
  { text: 'Posgrado UBA en Metaverso, Gaming y Web 3.0', icon: BookOpen },
  { text: 'Coautor de 5+ libros sobre tecnologías emergentes', icon: BookOpen },
];
