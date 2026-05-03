import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StaggeredTitle from '@/components/StaggeredTitle';

const PAGE_TITLE = 'Política de Privacidad — Estudio Dr. Marco Rossi';
const PAGE_DESCRIPTION =
  'Política de privacidad del Estudio Dr. Marco Rossi conforme a la Ley 25.326 de Protección de Datos Personales de la República Argentina. Cómo recolectamos, usamos y protegemos los datos personales de quienes interactúan con el sitio.';

const LAST_UPDATED = '2 de mayo de 2026';

export default function Privacidad() {
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

      <main className="flex-1 pt-32 pb-16">
        <div className="section-container max-w-3xl">
          {/* Header */}
          <header className="mb-12 md:mb-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Volver al inicio
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
              <Shield size={12} className="text-accent" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-montserrat">
                Datos personales
              </span>
            </div>

            <StaggeredTitle
              text="Política de Privacidad."
              highlightWords={['Privacidad.']}
              className="text-3xl md:text-5xl font-black text-foreground mb-4 font-montserrat justify-start leading-tight"
            />

            <p className="text-sm text-foreground/50 font-medium">
              Última actualización: {LAST_UPDATED}
            </p>
          </header>

          {/* Body */}
          <article className="prose-content space-y-10 text-foreground/80 leading-relaxed">
            <Section title="1. Quiénes somos" number="01">
              <p>
                Esta política aplica al sitio web <strong>marcorossi.com.ar</strong> (en
                adelante, "el Sitio"), operado por el <strong>Estudio Dr. Marco Rossi</strong>{' '}
                (en adelante, "el Estudio"), con domicilio profesional en San Miguel de Tucumán,
                Provincia de Tucumán, República Argentina.
              </p>
              <p>
                Para cualquier consulta relacionada con esta política o con el tratamiento de
                tus datos personales, podés escribirnos a{' '}
                <a
                  href="mailto:estudio@marcorossi.com.ar"
                  className="text-accent font-bold hover:underline"
                >
                  estudio@marcorossi.com.ar
                </a>
                .
              </p>
            </Section>

            <Section title="2. Marco normativo" number="02">
              <p>
                El tratamiento de datos personales se rige por la <strong>Ley N° 25.326 de
                Protección de Datos Personales</strong> y su decreto reglamentario, así como
                por las disposiciones complementarias dictadas por la <strong>Agencia de Acceso
                a la Información Pública (AAIP)</strong>, autoridad de aplicación en la
                República Argentina.
              </p>
            </Section>

            <Section title="3. Qué datos recolectamos" number="03">
              <p>El Sitio puede recolectar los siguientes datos personales:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Formulario de contacto</strong>: nombre, dirección de email,
                  teléfono (opcional) y el contenido de tu mensaje.
                </li>
                <li>
                  <strong>Reservas de turnos</strong> (vía Cal.com): nombre, email, motivo de
                  consulta, urgencia y eventualmente links a documentos que vos decidas
                  compartir voluntariamente.
                </li>
                <li>
                  <strong>Datos de navegación</strong>: información técnica anónima recolectada
                  por Google Analytics (páginas visitadas, tiempo en el sitio, dispositivo,
                  país aproximado). No se usa para identificarte.
                </li>
                <li>
                  <strong>Dirección IP</strong>: utilizada exclusivamente, en forma transitoria
                  y en memoria del servidor, para limitar abusos del formulario de contacto.
                  No se almacena de manera persistente.
                </li>
              </ul>
              <p className="text-sm text-foreground/60 italic">
                No solicitamos datos sensibles (salud, religión, ideología política, vida
                sexual, antecedentes penales). Si por la naturaleza de tu consulta necesitás
                compartir información de ese tipo, te recomendamos hacerlo recién en la
                consulta inicial bajo secreto profesional.
              </p>
            </Section>

            <Section title="4. Para qué usamos tus datos" number="04">
              <ul className="list-disc pl-6 space-y-2">
                <li>Responder tu consulta y mantener comunicación contigo.</li>
                <li>Coordinar y confirmar turnos de consulta.</li>
                <li>
                  Cumplir con las obligaciones contractuales y profesionales que surjan si nos
                  contratás como representación legal.
                </li>
                <li>
                  Mejorar el Sitio en base a estadísticas anónimas de uso (Google Analytics).
                </li>
                <li>Prevenir abusos del formulario (rate limiting).</li>
              </ul>
              <p>
                <strong>No usamos tus datos para marketing</strong> sin tu consentimiento
                explícito y previo.
              </p>
            </Section>

            <Section title="5. Con quién compartimos los datos" number="05">
              <p>
                Para hacer funcionar el Sitio dependemos de proveedores de servicios externos.
                Cada uno tiene su propia política de privacidad y cumple con estándares
                internacionales de protección de datos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Vercel</strong> (Estados Unidos) — hosting del Sitio.
                </li>
                <li>
                  <strong>Resend</strong> (Estados Unidos) — entrega de emails (formulario y
                  notificaciones).
                </li>
                <li>
                  <strong>Cal.com</strong> (Estados Unidos) — gestión de turnos y calendario.
                </li>
                <li>
                  <strong>Google Workspace</strong> (Estados Unidos) — recepción de emails y
                  calendario del Estudio.
                </li>
                <li>
                  <strong>Google Analytics</strong> (Estados Unidos) — estadísticas anónimas
                  de uso.
                </li>
                <li>
                  <strong>Telegram</strong> (Reino Unido / Emiratos Árabes Unidos) —
                  notificaciones internas privadas para el Estudio (no recibe datos del
                  visitante salvo nombre, email y mensaje, y solo el Estudio accede al chat).
                </li>
              </ul>
              <p>
                <strong>No vendemos ni cedemos</strong> tus datos personales a terceros con
                fines comerciales. Solo podemos divulgarlos cuando sea exigido por una orden
                judicial, requerimiento de autoridad competente, o para proteger derechos del
                Estudio en un proceso legítimo.
              </p>
            </Section>

            <Section title="6. Tiempo de retención" number="06">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Mensajes del formulario</strong>: permanecen en la bandeja de entrada
                  del Estudio según la política de retención de Google Workspace.
                </li>
                <li>
                  <strong>Reservas de Cal.com</strong>: según la política de retención de
                  Cal.com (consultable en su sitio).
                </li>
                <li>
                  <strong>Datos de Google Analytics</strong>: 26 meses (configuración por
                  defecto).
                </li>
                <li>
                  <strong>Dirección IP</strong>: solo en memoria volátil del servidor, durante
                  el rate limiting (60 segundos máximo).
                </li>
              </ul>
            </Section>

            <Section title="7. Tus derechos" number="07">
              <p>
                Como titular de tus datos personales, la Ley 25.326 te reconoce los siguientes
                derechos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Acceso</strong>: solicitar copia de los datos personales que tenemos
                  sobre vos.
                </li>
                <li>
                  <strong>Rectificación</strong>: corregir datos inexactos o desactualizados.
                </li>
                <li>
                  <strong>Supresión</strong>: pedir que eliminemos tus datos cuando ya no sean
                  necesarios para el fin para el que fueron recolectados.
                </li>
                <li>
                  <strong>Oposición</strong>: oponerte al tratamiento de tus datos en
                  determinados supuestos.
                </li>
              </ul>
              <p>
                Para ejercer estos derechos, escribinos a{' '}
                <a
                  href="mailto:estudio@marcorossi.com.ar"
                  className="text-accent font-bold hover:underline"
                >
                  estudio@marcorossi.com.ar
                </a>{' '}
                identificándote y especificando qué derecho querés ejercer. Te respondemos
                dentro de los plazos legales (10 días hábiles para acceso, 5 días hábiles para
                rectificación o supresión).
              </p>
            </Section>

            <Section title="8. Cookies" number="08">
              <p>El Sitio utiliza dos tipos de cookies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookies técnicas</strong> necesarias para el funcionamiento (tema
                  claro/oscuro, sesión). No requieren consentimiento previo.
                </li>
                <li>
                  <strong>Cookies de Google Analytics</strong> para estadísticas anónimas de
                  uso. Podés desactivarlas instalando el{' '}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent font-bold hover:underline"
                  >
                    add-on oficial de Google
                  </a>{' '}
                  o usando el modo incógnito de tu navegador.
                </li>
              </ul>
            </Section>

            <Section title="9. Menores de edad" number="09">
              <p>
                El Sitio no está dirigido a menores de 18 años. Si sos menor, no nos envíes
                datos personales sin la autorización expresa de tu representante legal.
              </p>
            </Section>

            <Section title="10. Seguridad" number="10">
              <p>
                Implementamos medidas técnicas y organizativas razonables para proteger tus
                datos: comunicaciones cifradas (HTTPS), validación de mails (SPF, DKIM, DMARC),
                acceso restringido a las herramientas que procesan los datos, y proveedores
                con cumplimiento de estándares internacionales.
              </p>
              <p className="text-sm text-foreground/60 italic">
                Ninguna transmisión por internet es 100% segura. Si bien hacemos nuestro mejor
                esfuerzo, no podemos garantizar la seguridad absoluta de la información que
                nos transmitas.
              </p>
            </Section>

            <Section title="11. Cambios a esta política" number="11">
              <p>
                Podemos actualizar esta política periódicamente. La versión vigente es siempre
                la publicada en esta página, identificada por la fecha de "Última
                actualización" al inicio.
              </p>
              <p>
                Si los cambios son sustanciales, los anunciaremos visiblemente en el Sitio.
              </p>
            </Section>

            <Section title="12. Reclamos ante la autoridad de control" number="12">
              <p>
                Si considerás que el tratamiento de tus datos personales no se ajusta a la
                normativa, tenés derecho a presentar un reclamo ante la <strong>Agencia de
                Acceso a la Información Pública (AAIP)</strong>:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Sitio web:{' '}
                  <a
                    href="https://www.argentina.gob.ar/aaip"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent font-bold hover:underline"
                  >
                    argentina.gob.ar/aaip
                  </a>
                </li>
                <li>Dirección: Av. Pte. Julio A. Roca 710, Piso 2°, CABA</li>
              </ul>
            </Section>
          </article>

          {/* Contact callout */}
          <div className="mt-16 p-6 md:p-8 rounded-2xl bg-foreground/5 border border-foreground/10">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <Mail size={22} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-foreground mb-2 font-montserrat">
                  Tenés una pregunta sobre tus datos?
                </h3>
                <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
                  Escribinos directamente y te respondemos personalmente.
                </p>
                <a
                  href="mailto:estudio@marcorossi.com.ar"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm hover:bg-accent hover:text-white transition-colors"
                >
                  estudio@marcorossi.com.ar
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ---- Subcomponente: sección numerada de la política ----
function Section({
  title,
  number,
  children,
}: {
  title: string;
  number: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <header className="flex items-baseline gap-4 pb-3 border-b border-foreground/10">
        <span className="text-xs font-black tracking-[0.2em] text-accent uppercase font-montserrat">
          {number}
        </span>
        <h2 className="text-xl md:text-2xl font-black text-foreground font-montserrat leading-tight">
          {title}
        </h2>
      </header>
      <div className="space-y-3 text-sm md:text-base">{children}</div>
    </section>
  );
}
