import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, ChevronDown, MessageCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BookingButton from '@/components/BookingButton';
import { areaIcons } from '@/components/areaIcons';
import { areas, areaPath, workSteps } from '@/data/areas';
import { whatsappUrl } from '@/lib/whatsapp';
import { trackWhatsAppClick } from '@/lib/analytics';
import { usePageMeta } from '@/hooks/usePageMeta';
import NotFound from './NotFound';

export default function AreaPage() {
  const { slug } = useParams();
  const area = areas.find((a) => a.slug === slug);

  usePageMeta(
    area ? { title: area.metaTitle, description: area.metaDescription, path: areaPath(area.slug) } : null,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!area) return <NotFound />;

  const Icon = areaIcons[area.slug];
  const whatsappHref = whatsappUrl(`Hola, quiero hacer una consulta sobre ${area.title}.`);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 pt-28 md:pt-36 pb-16">
        <div className="section-container">
          <nav aria-label="Ruta de navegación" className="text-xs font-bold text-foreground/50 mb-6">
            <Link to="/" className="hover:text-accent transition-colors">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span>Áreas de práctica</span>
            <span className="mx-2">/</span>
            <span className="text-foreground/80">{area.title}</span>
          </nav>

          <header className="max-w-3xl mb-12 md:mb-16">
            <div className="hidden md:flex w-14 h-14 rounded-2xl bg-accent/10 text-accent items-center justify-center mb-6">
              <Icon size={28} />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground font-montserrat leading-tight mb-5 md:mb-6">
              {area.h1}
            </h1>
            {area.intro.map((paragraph) => (
              <p key={paragraph} className="text-base md:text-xl text-foreground/70 leading-relaxed font-medium mb-3 md:mb-4">
                {paragraph}
              </p>
            ))}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 md:mt-8">
              <BookingButton source={`area-${area.slug}`} label="Consulta gratis · 20 min" variant="primary" />
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick(`area-${area.slug}`)}
                className="btn-interactive w-full sm:w-auto min-h-[52px] inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 text-white font-bold rounded-xl shadow-lg transition-all duration-300 text-base bg-[var(--whatsapp-green)] hover:bg-[var(--whatsapp-green-hover)]"
              >
                <MessageCircle size={20} className="fill-white" />
                Escribinos por WhatsApp
              </a>
            </div>
          </header>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-20">
            <section className="lg:col-span-8">
              <h2 className="text-2xl md:text-3xl font-black font-montserrat text-foreground mb-6">
                Casos que atendemos
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {area.cases.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-foreground/10 shadow-sm"
                  >
                    <Check size={18} className="text-accent shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base font-bold text-foreground/80 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="lg:col-span-4">
              <div className="p-6 md:p-8 rounded-[2rem] bg-foreground/[0.03] border border-foreground/10">
                <h2 className="text-lg font-black font-montserrat text-foreground mb-5">Cómo trabajamos</h2>
                <ol className="space-y-3">
                  {workSteps.map((step, index) => (
                    <li key={step} className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm font-bold text-foreground/75 leading-snug">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>

          <section className="max-w-3xl mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-black font-montserrat text-foreground mb-6">
              Preguntas frecuentes
            </h2>
            <div className="space-y-3">
              {area.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl bg-card border border-foreground/10 p-5 md:p-6 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-foreground text-base md:text-lg">
                    {faq.q}
                    <ChevronDown size={20} className="shrink-0 text-foreground/40 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-foreground/70 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mb-16 md:mb-20">
            <h2 className="text-xl font-black font-montserrat text-foreground mb-5">Otras áreas de práctica</h2>
            <div className="flex flex-wrap gap-2">
              {areas
                .filter((other) => other.slug !== area.slug)
                .map((other) => (
                  <Link
                    key={other.slug}
                    to={areaPath(other.slug)}
                    className="px-4 py-2 rounded-full bg-card border border-foreground/10 text-sm font-bold text-foreground/75 hover:border-accent/40 hover:text-accent transition-colors"
                  >
                    {other.title}
                  </Link>
                ))}
            </div>
          </section>

          <section className="p-8 md:p-12 rounded-[2rem] bg-foreground text-background flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black font-montserrat mb-2">Contanos tu caso</h2>
              <p className="text-background/70 font-medium">
                La primera consulta dura 20 minutos, es por videollamada y no tiene cargo.
              </p>
            </div>
            <BookingButton
              source={`area-${area.slug}-footer`}
              label="Reservar consulta"
              className="btn-interactive shrink-0 min-h-[52px] inline-flex items-center justify-center gap-2 px-8 py-4 bg-background text-foreground font-bold rounded-xl hover:bg-accent hover:text-white transition-all duration-300 shadow-lg group text-base"
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
