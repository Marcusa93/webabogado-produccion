import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import CasosTipicos from '@/components/CasosTipicos';
import CasosEnMedios from '@/components/CasosEnMedios';
import ToolkitTeaser from '@/components/ToolkitTeaser';
import QuienesSomos from '@/components/QuienesSomos';
import Contacto from '@/components/Contacto';
import Footer from '@/components/Footer';

import CustomCursor from '@/components/CustomCursor';

export default function Index() {
  return (
    <div className="min-h-screen noise-overlay">
      <CustomCursor />

      <Navigation />
      <main>
        <Hero />
        <TrustStrip />
        <CasosTipicos />
        <CasosEnMedios />
        <ToolkitTeaser />
        <QuienesSomos />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}
