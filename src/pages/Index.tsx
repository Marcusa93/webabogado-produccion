import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import QueHago from '@/components/QueHago';
import QueEsperar from '@/components/QueEsperar';
import Servicios from '@/components/Servicios';
import CasosEnMedios from '@/components/CasosEnMedios';
import Toolkit from '@/components/Toolkit';
import QuienesSomos from '@/components/QuienesSomos';
import Contacto from '@/components/Contacto';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

import CustomCursor from '@/components/CustomCursor';

export default function Index() {
  return (
    <div className="min-h-screen noise-overlay">
      <CustomCursor />

      <Navigation />
      <main>
        <Hero />
        <QueHago />
        <QueEsperar />
        <Servicios />
        <CasosEnMedios />
        <Toolkit />
        <QuienesSomos />
        <Contacto />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
