import { useEffect, useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Instagram,
  Mic2,
  Play,
  Radio,
  Tv,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StaggeredTitle from '@/components/StaggeredTitle';
import VideoModal from '@/components/VideoModal';
import {
  books,
  multimedia,
  getYouTubeThumbnail,
  type MultimediaItem,
} from '@/data/multimedia';

const PAGE_TITLE = 'Sobre Marco Rossi — Trayectoria, libros y presencia pública';
const PAGE_DESCRIPTION =
  'Doctor Honoris Causa por la Federación Iberoamericana de Abogados. Director de DYNTEC (UNT). Trayectoria, libros publicados, entrevistas, conferencias y presencia en medios.';

export default function SobreMi() {
  const [selectedVideo, setSelectedVideo] = useState<MultimediaItem | null>(null);

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

  // Carga del script de EmbedSocial para el feed de Instagram
  useEffect(() => {
    const id = 'EmbedSocialHashtagScript';
    if (!document.getElementById(id)) {
      const js = document.createElement('script');
      js.id = id;
      js.src = 'https://embedsocial.com/cdn/ht.js';
      document.getElementsByTagName('head')[0].appendChild(js);
    } else if ((window as any).EmbedSocialHashtag) {
      (window as any).EmbedSocialHashtag.init();
    }
  }, []);

  const allMultimedia = [...multimedia.interviews, ...multimedia.podcasts];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 pt-32 pb-16">
        <div className="section-container">
          {/* Hero */}
          <header className="max-w-3xl mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-montserrat">
                Trayectoria
              </span>
            </div>

            <StaggeredTitle
              text="Trayectoria, libros y presencia pública."
              highlightWords={['libros', 'pública.']}
              className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 font-montserrat justify-start leading-tight"
            />

            <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-medium">
              Producción intelectual, conferencias, entrevistas en medios y participación
              institucional. La evidencia visible de un trabajo enfocado en la intersección
              entre derecho y tecnología desde hace más de una década.
            </p>
          </header>

          {/* ============= LIBROS ============= */}
          <section className="mb-24 md:mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground font-montserrat mb-2">
                  Libros publicados
                </h2>
                <p className="text-foreground/60 text-sm font-medium">
                  Producción intelectual y obras de referencia en el área.
                </p>
              </div>
              <div className="flex items-center gap-2 text-foreground/40 text-xs font-bold uppercase tracking-widest">
                <BookOpen size={14} />
                <span>{books.length} obras</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {books.map((book) => (
                <div key={book.title} className="flex flex-col items-center group">
                  <a
                    href={book.link || '#'}
                    target={book.link ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className={`relative w-full aspect-[3/4] max-w-[220px] rounded-xl overflow-hidden shadow-2xl border border-foreground/10 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1 ${
                      !book.link ? 'cursor-default' : ''
                    }`}
                    aria-label={book.link ? `Ver "${book.title}"` : book.title}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {book.link && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                          <ExternalLink size={20} />
                        </div>
                      </div>
                    )}
                  </a>
                  <div className="mt-4 text-center w-full max-w-[220px]">
                    <h4 className="text-sm md:text-base font-bold text-foreground mb-2 leading-tight line-clamp-3 min-h-[3em]">
                      {book.title}
                    </h4>
                    <div className="flex flex-col gap-1 items-center text-xs text-foreground/50">
                      <span className="font-bold text-accent">{book.publisher}</span>
                      <span className="bg-foreground/5 px-2 py-0.5 rounded-full">{book.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============= PRESENCIA EN MEDIOS ============= */}
          <section className="mb-24 md:mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground font-montserrat mb-2">
                  Presencia en medios
                </h2>
                <p className="text-foreground/60 text-sm font-medium">
                  Entrevistas, podcasts, paneles y participación institucional.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-foreground/40 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Tv size={14} /> TV
                </span>
                <span className="flex items-center gap-2">
                  <Radio size={14} /> Radio
                </span>
                <span className="flex items-center gap-2">
                  <Mic2 size={14} /> Podcast
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allMultimedia.map((item, i) => {
                const isVideo =
                  item.url?.includes('youtu') || item.type === 'Stream' || item.type === 'Video';
                const isSpotify = item.source === 'Spotify';
                const thumbnailUrl =
                  item.image || (isVideo && item.url ? getYouTubeThumbnail(item.url) : null);

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (isVideo) {
                        setSelectedVideo(item);
                      } else if (item.url) {
                        window.open(item.url, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="aspect-square bg-card rounded-xl border border-foreground/10 relative group cursor-pointer overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
                    aria-label={`Abrir ${item.shortTitle || item.title}`}
                  >
                    <div className="absolute inset-0 bg-[#161622]">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt=""
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${
                            isSpotify
                              ? 'from-green-900/40 to-background dark:to-black'
                              : 'from-purple-900/40 to-background dark:to-black'
                          } p-4 flex flex-col justify-center items-center text-center`}
                        >
                          <span className="text-sm font-black text-foreground/20 uppercase break-words w-full px-2">
                            {item.source || 'Multimedia'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider py-1 px-2 rounded-md text-white ${
                          isSpotify ? 'bg-[#1DB954]' : item.badgeColor || 'bg-blue-600'
                        }`}
                      >
                        {isSpotify ? 'Spotify' : item.source || 'Link'}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 text-white z-10">
                      <div className="text-[10px] lg:text-[11px] font-bold leading-tight line-clamp-2 md:line-clamp-3 mb-1 group-hover:text-accent transition-colors">
                        {item.shortTitle || item.title}
                      </div>
                      {item.duration && (
                        <div className="text-[9px] text-white/60 font-medium flex items-center gap-1">
                          {isVideo ? <Play size={8} fill="currentColor" /> : <Mic2 size={8} />}{' '}
                          {item.duration}
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <div className="bg-accent/80 p-3 rounded-full backdrop-blur-sm shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                        {isVideo ? (
                          <Play size={20} className="text-white fill-white ml-0.5" />
                        ) : (
                          <ExternalLink size={20} className="text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ============= COMUNIDAD DIGITAL (INSTAGRAM) ============= */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground font-montserrat mb-2">
                  Comunidad digital
                </h2>
                <p className="text-foreground/60 text-sm font-medium">
                  Actualidad, tips legales y el día a día en{' '}
                  <span className="font-bold text-foreground/80">@marquitorossi</span>.
                </p>
              </div>
              <a
                href="https://instagram.com/marquitorossi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform"
              >
                <Instagram size={18} />
                <span>Seguir en Instagram</span>
              </a>
            </div>

            <div className="w-full bg-foreground/5 rounded-3xl border border-foreground/10 overflow-hidden shadow-2xl group">
              <div
                className="embedsocial-hashtag"
                data-ref="28afa55df19dabf3da5b1eb3d07414d457966dbd"
              >
                <div className="text-center py-20">
                  <Instagram size={48} className="text-foreground/20 mx-auto mb-4 animate-pulse" />
                  <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">
                    Sincronizando feed...
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
}
