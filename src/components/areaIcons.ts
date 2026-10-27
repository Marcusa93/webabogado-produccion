import {
  Briefcase,
  Building2,
  Fingerprint,
  HeartPulse,
  Landmark,
  Scale,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

export const areaIcons: Record<string, LucideIcon> = {
  'laboral-y-art': Briefcase,
  'civil-y-danos': Scale,
  penal: ShieldCheck,
  previsional: Landmark,
  salud: HeartPulse,
  'empresas-y-sociedades': Building2,
  'derecho-digital': Fingerprint,
};
