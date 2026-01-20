import { Award, BookOpen, Scale, Terminal, Radio, Mic2, Tv, Youtube, Linkedin, Play, ExternalLink, Lightbulb, ChevronDown, ChevronUp, Users, Building, X, Instagram } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { useInView } from '@/hooks/useInView';
import { useRef, useState, useEffect } from 'react';

const team = [
    {
        name: "Marco Rossi",
        role: "Abogado -socio – Especialista en procesos judiciales y prueba electrónica",
        image: "/team/marco.jpg",
        bio: "Lidera la defensa estratégica en casos de alta complejidad. Fue funcionario y relator de Juez  en la Justicia, combina su formación jurídica con una profunda comprensión de la infraestructura digital.",
        isPrincipal: true
    },
    {
        name: "Facundo Castillo",
        role: "Abogado asociado",
        image: "/team/facundo.jpg",
        bio: "Especialista en Derecho Laboral con enfoque en litigación estratégica contra ART. Participa activamente en la gestión de expedientes y defensa de empresas y particulares.",
        linkedin: "https://ar.linkedin.com/in/facundo-castillo-947b1b222"
    },
    {
        name: "Vancis Roda",
        role: "Asesor auxiliar y perito de parte",
        image: "/team/vancis.jpg",
        bio: "Experto en análisis de evidencia informática y peritajes técnicos. Brinda el soporte científico necesario para la validación de pruebas en entornos digitales complejos.",
        linkedin: "https://twitter.com/vancishacks" // Twitter as placeholder if linkedin unknown, or just use #
    }
];

const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};

const VideoModal = ({ video, onClose }: { video: any, onClose: () => void }) => {
    const videoId = getYouTubeVideoId(video.url);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    if (!videoId) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
                >
                    <X size={24} />
                </button>
                <div className="aspect-video w-full">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                <div className="p-6 bg-[#01101E] border-t border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-wider py-1 px-2 rounded-md text-white ${video.badgeColor || 'bg-blue-600'}`}>
                            {video.source}
                        </span>
                        {video.date && <span className="text-sm text-white/60">{video.date}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const multimedia = {
    interviews: [
        {
            title: "Entrevista caso Chahla c/ Paredes Alan. Mal uso de IA. Datos biométricos y deepfakes",
            shortTitle: "Caso Chahla: IA y Deepfakes",
            type: "Video",
            source: "YouTube",
            url: "https://youtu.be/38fzZmfny68?si=bpSXPjpzgnR_wPnO",
            duration: "15:42",
            badgeColor: "bg-red-600"
        },
        {
            title: "Charla en La Gaceta: El futuro de la Justicia Digital",
            shortTitle: "Charla La Gaceta - Tecnología y Justicia",
            type: "Video",
            source: "LA GACETA TV",
            url: "https://www.youtube.com/watch?v=PbbiO69oV9w&t=5s",
            badgeColor: "bg-red-600"
        },
        {
            title: "Quién es Marco Rossi: el abogado que pone a Tucumán en el mapa de la mano de la IA",
            shortTitle: "Nota Show Online",
            type: "Artículo",
            source: "Show Online",
            url: "https://showonline.com.ar/contenido/11110/quien-es-marco-rossi-el-abogado-que-pone-a-tucuman-en-el-mapa-de-la-mano-de-la-i",
            date: "Nov 2024",
            badgeColor: "bg-indigo-600"
        },
        {
            title: "Inteligencia Artificial en el ejercicio legal",
            shortTitle: "Entrevista sobre IA y Derecho",
            type: "Video",
            source: "ENTREVISTA",
            url: "https://www.youtube.com/watch?v=cBHpaYR9QlE&t=1s",
            badgeColor: "bg-emerald-600"
        },
        {
            title: "Marco Rossi: 'La Justicia también puede innovar y humanizar'",
            shortTitle: "Nota La Gaceta",
            type: "Artículo",
            source: "La Gaceta",
            url: "https://www.lagaceta.com.ar/nota/amp/1088664/sociedad/marco-rossi-justicia-tambien-puede-innovar-humanizar.html",
            date: "Nov 2024",
            badgeColor: "bg-blue-600"
        },
        {
            title: "La Inteligencia Artificial aplicada al beneficio de los tucumanos",
            shortTitle: "Nota LV12 Radio",
            type: "Radio",
            source: "LV12",
            url: "https://www.lv12.com.ar/inteligencia-artificial/la-inteligencia-artificial-aplicada-beneficio-los-tucumanos-n167419",
            date: "Oct 2024",
            badgeColor: "bg-orange-500"
        },
        {
            title: "Marco Rossi: 'Hoy todos somos informáticos'",
            shortTitle: "Entrevista Enterate Noticias",
            type: "Artículo",
            source: "ENTERATE",
            url: "https://www.enteratenoticias.com.ar/actualidad/marco-rossi-hoy-todos-somos-informaticos/",
            badgeColor: "bg-amber-500"
        },
        {
            title: "Debate sobre Inteligencia Artificial en el ámbito legal",
            shortTitle: "Debate Profesional IA",
            type: "Video",
            source: "PANEL",
            url: "https://www.youtube.com/watch?v=l-EeDpqTX-I",
            badgeColor: "bg-red-500"
        }
    ],
    podcasts: [
        {
            title: "Derecho & Código Ep. 12",
            url: "https://open.spotify.com/episode/2NCJg4x36jJFSZJ5h14JZ0?si=SIlxfJu2QHuYQdwupOGh_w&t=0&pi=-Tt-piIDQ2em7",
            duration: "45 min",
            source: "Spotify"
        },
        {
            title: "Justicia 4.0 - Transformación Digital",
            url: "https://open.spotify.com/episode/36d5ZrqKNRHC7lWcrJfOgq?si=RZPdXz2DRCunNX986xjZHg",
            duration: "32 min",
            source: "Spotify"
        },
        {
            title: "Entrevista Radial - Inteligencia Artificial",
            url: "https://youtu.be/X7niXzmvaEs",
            type: "YouTube",
            source: "Radio",
            duration: "20 min"
        },
        {
            title: "Legal Tech Talk",
            duration: "50 min",
            image: "/content/podcasts/legal-tech-talk.jpg",
            source: "Podcast"
        }
    ]
};

const books = [
    {
        title: "Impacto de la IA en el Proceso Judicial",
        image: "/books/impacto-ia.png",
        publisher: "Editorial Legis",
        year: "2024"
    },
    {
        title: "Justicia Algorítmica",
        image: "/content/books/justicia-algoritmica.jpg",
        publisher: "Abeledo Perrot",
        year: "2023"
    }
];

const BooksModal = ({ onClose }: { onClose: () => void }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-4xl bg-card rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-foreground/10 p-8 md:p-12">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-2 bg-foreground/5 hover:bg-foreground/10 rounded-full text-foreground transition-colors backdrop-blur-sm"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-black text-foreground font-montserrat mb-2">Libros Publicados</h3>
                    <p className="text-foreground/60 font-medium">Producción intelectual y obras destacadas.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {books.map((book, i) => (
                        <div key={i} className="flex flex-col items-center group">
                            <div className="relative w-full aspect-[3/4] max-w-[280px] rounded-xl overflow-hidden shadow-2xl border border-foreground/10 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="mt-6 text-center">
                                <h4 className="text-xl font-bold text-foreground mb-1 leading-tight">{book.title}</h4>
                                <div className="flex items-center justify-center gap-3 text-sm text-foreground/50">
                                    <span>{book.publisher}</span>
                                    <span className="w-1 h-1 rounded-full bg-foreground/20" />
                                    <span>{book.year}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function QuienesSomos() {
    const { ref, isInView } = useInView({ threshold: 0.1 });
    const [showAllPublicPresence, setShowAllPublicPresence] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [showBooksModal, setShowBooksModal] = useState(false);

    // 3D Tilt effect logic for Marco's photo/card
    const marcoCardRef = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!marcoCardRef.current) return;
        const rect = marcoCardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    // Load EmbedSocial script
    useEffect(() => {
        const id = "EmbedSocialHashtagScript";
        if (!document.getElementById(id)) {
            const js = document.createElement("script") as HTMLScriptElement;
            js.id = id;
            js.src = "https://embedsocial.com/cdn/ht.js";
            document.getElementsByTagName("head")[0].appendChild(js);
        } else {
            if ((window as any).EmbedSocialHashtag) {
                (window as any).EmbedSocialHashtag.init();
            }
        }
    }, []);

    return (
        <section id="quienes-somos" ref={ref} className="relative py-24 md:py-32 bg-background transition-colors duration-500 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 tech-grid opacity-10" />

            <div className="section-container relative z-10">
                {/* Section Header */}
                <div className="max-w-4xl mx-auto mb-20 md:mb-28 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
                        <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-montserrat">El Estudio</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 font-montserrat">
                        Nuestro <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Equipo.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-foreground/70 font-medium leading-relaxed max-w-2xl mx-auto">
                        Equipo profesional multidisciplinario con experiencia en derecho, justicia y tecnología.
                    </p>
                </div>

                {/* Marco Rossi Highlighted Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-start mb-32">
                    {/* Left Column: Photo & Main Info */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Picture with 3D Effect */}
                            <div className={`shrink-0 w-full md:w-[350px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-foreground/10 relative group ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} transition-all duration-1000 order-1`}>
                                <div
                                    ref={marcoCardRef}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                    style={{
                                        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                                        transition: rotate.x === 0 ? 'transform 0.5s ease-out' : 'none'
                                    }}
                                    className="w-full h-full relative"
                                >
                                    <OptimizedImage
                                        src="/team/marco.jpg"
                                        alt="Marco Rossi"
                                        className="w-full h-full object-cover"
                                        blurPlaceholder={true}
                                        priority={true}
                                        width={400}
                                        height={500}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </div>

                            {/* Short Bio */}
                            <div className="flex-1 order-2">
                                <h3 className="text-4xl lg:text-5xl font-black text-foreground mb-3 font-montserrat tracking-tight">
                                    {team[0].name}
                                </h3>
                                <div className="text-accent font-bold text-lg mb-6 uppercase tracking-wider">
                                    {team[0].role}
                                </div>
                                <p className="text-foreground/70 text-lg leading-relaxed font-medium mb-8">
                                    {team[0].bio}
                                </p>
                                <button
                                    onClick={() => setShowBooksModal(true)}
                                    className="px-6 py-3 rounded-xl bg-foreground text-background font-bold text-sm hover:bg-accent hover:text-white transition-all duration-300 shadow-lg flex items-center gap-2"
                                >
                                    Ver Libros Publicados <BookOpen size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Credentials Sidebar */}
                    <div className="lg:col-span-5 bg-foreground/5 p-8 rounded-[2rem] border border-foreground/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-foreground">
                            <Scale size={120} />
                        </div>

                        <h4 className="text-xl font-black text-foreground mb-6 relative z-10 font-montserrat">Credenciales Destacadas</h4>

                        <ul className="space-y-4 relative z-10">
                            {[
                                { text: "8+ años como funcionario en la Justicia", icon: Award },
                                { text: "Docente en universidades de Argentina y LATAM", icon: Lightbulb },
                                { text: "Especialista certificado en Inteligencia Artificial", icon: Terminal },
                                { text: "+70 acreditaciones de formación académica", icon: Award }
                            ].map((cred, i) => (
                                <li key={i} className="flex items-start gap-4 p-3 bg-card rounded-xl shadow-sm border border-foreground/5 transition-transform hover:scale-[1.02]">
                                    <div className="p-2 bg-accent/10 rounded-lg text-accent shrink-0">
                                        <cred.icon size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-foreground/80 pt-1 leading-snug">{cred.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Public Presence */}
                <div className={`mb-32 p-8 md:p-12 rounded-[3rem] bg-foreground/5 relative overflow-hidden shadow-strong transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <div className="absolute inset-0 tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10" />

                    <div className="relative z-10 space-y-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h4 className="text-2xl md:text-3xl font-black text-foreground font-montserrat mb-2">Presencia Pública</h4>
                                <p className="text-foreground/60 text-sm font-medium">Entrevistas, medios y participación institucional.</p>
                            </div>
                        </div>

                        {/* Combined Grid: Interviews & Podcasts */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...multimedia.interviews, ...multimedia.podcasts]
                                .slice(0, showAllPublicPresence ? undefined : 4)
                                .map((item: any, i) => {
                                    const isVideo = item.url?.includes("youtu") || item.type === "Stream" || item.type === "Video";
                                    const isSpotify = item.source === "Spotify";
                                    const thumbnailUrl = isVideo && item.url ? getYouTubeThumbnail(item.url) : (item.image || null);

                                    return (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                if (isVideo) {
                                                    setSelectedVideo(item);
                                                } else if (item.url) {
                                                    window.open(item.url, '_blank', 'noopener,noreferrer');
                                                }
                                            }}
                                            className="aspect-square bg-card rounded-xl border border-foreground/10 relative group cursor-pointer overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
                                        >
                                            <div className="absolute inset-0 bg-[#161622]">
                                                {thumbnailUrl ? (
                                                    <img
                                                        src={thumbnailUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className={`w-full h-full bg-gradient-to-br ${isSpotify ? 'from-green-900/40 to-background dark:to-black' : 'from-purple-900/40 to-background dark:to-black'} p-4 flex flex-col justify-center items-center text-center`}>
                                                        <span className="text-sm font-black text-foreground/20 uppercase break-words w-full px-2">{item.source || 'Multimedia'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="absolute top-2 left-2 z-10">
                                                <span className={`text-[9px] font-black uppercase tracking-wider py-1 px-2 rounded-md text-white ${isSpotify ? 'bg-[#1DB954]' : (item.badgeColor || 'bg-blue-600')}`}>
                                                    {isSpotify ? 'Spotify' : (item.source || 'Link')}
                                                </span>
                                            </div>

                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 text-white z-10">
                                                <div className="text-[10px] lg:text-[11px] font-bold leading-tight line-clamp-2 md:line-clamp-3 mb-1 group-hover:text-accent transition-colors">
                                                    {item.shortTitle || item.title}
                                                </div>
                                                {item.duration && (
                                                    <div className="text-[9px] text-white/60 font-medium flex items-center gap-1">
                                                        {isVideo ? <Play size={8} fill="currentColor" /> : <Mic2 size={8} />} {item.duration}
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
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Social/Stats Footer within the block */}
                        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-foreground/10">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setShowAllPublicPresence(!showAllPublicPresence)}
                                    className="px-8 py-3 rounded-xl bg-foreground text-background font-bold text-sm hover:bg-accent hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg"
                                >
                                    {showAllPublicPresence ? (
                                        <>Ver menos <ChevronUp size={16} /></>
                                    ) : (
                                        <>Ver más contenido <ChevronDown size={16} /></>
                                    )}
                                </button>

                                <div className="hidden sm:flex items-center gap-4 text-foreground/40 text-xs font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Tv size={14} /> TV</span>
                                    <span className="flex items-center gap-2"><Radio size={14} /> Radio</span>
                                    <span className="flex items-center gap-2"><Mic2 size={14} /> Podcast</span>
                                </div>
                            </div>

                            {/* Instagram Link instead of full feed if requested to be smaller */}
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
                    </div>
                </div>

                {/* Other Team Members - 2 Columns */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {team.slice(1).map((member, index) => (
                        <div
                            key={index}
                            className={`fade-in-up bg-card p-8 md:p-10 rounded-[2.5rem] border border-foreground/10 shadow-lg hover:shadow-2xl transition-all duration-500 group stagger-${index + 1} ${isInView ? 'is-visible' : ''}`}
                        >
                            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start text-center lg:text-left">
                                <div className="w-32 md:w-40 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-foreground/5 flex-shrink-0">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-black text-foreground mb-2 font-montserrat">{member.name}</h4>
                                    <div className="text-accent font-bold text-sm uppercase tracking-wider mb-6">{member.role}</div>
                                    <p className="text-foreground/70 text-sm md:text-base leading-relaxed mb-8">
                                        {member.bio}
                                    </p>
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors"
                                    >
                                        <Linkedin size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Ver Perfil</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Video Modal */}
            {selectedVideo && (
                <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
            )}
            {/* Books Modal */}
            {showBooksModal && (
                <BooksModal onClose={() => setShowBooksModal(false)} />
            )}
        </section>
    );
}
