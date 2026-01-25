import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import QueHago from '@/components/QueHago';
import QueEsperar from '@/components/QueEsperar';
import Servicios from '@/components/Servicios';
import QuienesSomos from '@/components/QuienesSomos';
import Contacto from '@/components/Contacto';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import ScrollProgress from '@/components/ScrollProgress';

export default function Index() {
  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <QueHago />
        <QueEsperar />
        <Servicios />
        <QuienesSomos />
        <Contacto />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
