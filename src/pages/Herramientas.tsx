import { useEffect } from 'react';
import { Wrench } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Toolkit from '@/components/Toolkit';
import StaggeredTitle from '@/components/StaggeredTitle';

const PAGE_TITLE = 'Herramientas para clientes — Estudio Dr. Marco Rossi';
const PAGE_DESCRIPTION =
  'Kit de herramientas tácticas de uso inmediato: preservación de evidencia digital, check de contratos para influencers, detección de phishing, hasher criptográfico y optimizador COTIO de prompts jurídicos.';

export default function Herramientas() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    let metaDescription = document.querySelector('meta[name="description"]');
    let createdMeta = false;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
      createdMeta = true;
    }
    const previousDescription = metaDescription.getAttribute('content') || '';
    metaDescription.setAttribute('content', PAGE_DESCRIPTION);

    return () => {
      document.title = previousTitle;
      if (createdMeta) {
        metaDescription.parentNode?.removeChild(metaDescription);
      } else if (previousDescription) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 pt-32">
        {/* Page header */}
        <header className="section-container pb-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Wrench size={12} className="text-accent" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-montserrat">
                Recursos para clientes
              </span>
            </div>

            <StaggeredTitle
              text="Herramientas tácticas para protegerte hoy."
              highlightWords={['Herramientas', 'tácticas']}
              className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 font-montserrat justify-start leading-tight"
            />

            <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-medium max-w-2xl">
              Cinco utilidades de uso inmediato que cualquiera puede aplicar antes de
              llamar al estudio: preservación de evidencia, validación de contratos,
              detección de phishing, integridad de archivos y optimización de prompts
              jurídicos.
            </p>
          </div>
        </header>

        {/* Reuse the existing Toolkit component which already has the full grid + dialogs */}
        <Toolkit />
      </main>

      <Footer />
    </div>
  );
}
