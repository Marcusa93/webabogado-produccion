import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import QueHago from '@/components/QueHago';
import QueEsperar from '@/components/QueEsperar';
import Servicios from '@/components/Servicios';
import QuienesSomos from '@/components/QuienesSomos';
import Recursos from '@/components/Recursos';
import Contacto from '@/components/Contacto';
import Footer from '@/components/Footer';

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <QueHago />
        <QueEsperar />
        <Servicios />
        <QuienesSomos />
        <Recursos />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}
