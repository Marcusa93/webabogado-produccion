import { Award, BookOpen, Scale, Terminal, Radio, Mic2, Tv, Youtube, Linkedin, Play, ExternalLink, Lightbulb, ChevronDown, ChevronUp, Users, Building } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useRef, useState, useEffect } from 'react';

const team = [
    {
        name: "Marco Rossi",
        role: "Abogado asociado – Especialista en procesos judiciales y prueba electrónica",
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
    ],
    publications: [
        { title: "Inteligencia artificial y mediación: Una nueva herramienta para resolver conflictos", media: "elDial.com", year: "2024", badgeColor: "bg-green-600" },
        { title: "La prueba electrónica en el CPCyCN", media: "Revista de Derecho Procesal", year: "2024" },
        { title: "Inteligencia Artificial y Debido Proceso", media: " Thomson Reuters", year: "2023" },
        { title: "Cibercrimen: Nuevos paradigmas", media: "IJ Editores", year: "2023" },
        { title: "Blockchain aplicado a la justicia", media: "Derecho y Tecnología", year: "2022" }
    ],
    books: [
        {
            title: "Justicia Algorítmica",
            url: "https://ebook.iadpi.com.ar/shop/detalle/16",
            image: "/content/books/justicia-algoritmica.jpg",
            available: true,
            isHighlight: true
        },
        {
            title: "Impacto de la Inteligencia Artificial en el ámbito legal",
            subTitle: "Obra colectiva - Editorial Hammurabi",
            url: "https://www.hammurabi.com.ar/productos/leguizamon-lozano-impacto-de-la-inteligencia-artificial-en-el-ambito-legal/",
            cover: "from-purple-900 to-indigo-900",
            authors: "Leguizamón, Lozano, Rossi...",
            pages: "274 páginas",
            isCoauthor: true
        },
        { title: "Tratado de la Prueba Digital", cover: "from-blue-600/20 to-blue-900/40" },
        { title: "Manual de Derecho Informático", cover: "from-navy-light to-navy-deep" },
        { title: "Estrategias de Litigación Tech", cover: "from-accent/10 to-accent/30" }
    ]
};

export default function QuienesSomos() {
    const { ref, isInView } = useInView({ threshold: 0.1 });
    const [activeProfile, setActiveProfile] = useState<string | null>(null);
    const [showAllInterviews, setShowAllInterviews] = useState(false);

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

    return (
        <section id="quienes-somos" ref={ref} className="relative py-24 md:py-32 bg-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 tech-grid opacity-10" />

            <div className="section-container relative z-10">
                {/* Section Header */}
                <div className="max-w-4xl mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-deep/5 border border-navy-deep/10 mb-6">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-navy-deep/50 uppercase font-montserrat">Nuestro Equipo</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy-deep mb-6 leading-tight font-montserrat">
                        Quiénes Somos.
                    </h2>
                    <p className="text-xl md:text-2xl text-slate font-medium leading-relaxed max-w-2xl">
                        Equipo profesional multidisciplinario con experiencia en derecho, justicia y tecnología.
                    </p>
                </div>

                {/* Marco Rossi Highlighted Profile */}
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-32">
                    {/* Left Column: Photo & Main Info (60% approx -> 7 cols) */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Picture with 3D Effect - Larger */}
                            <div className={`shrink-0 w-full md:w-[350px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-navy-deep/10 relative group ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} transition-all duration-1000 order-1`}>
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
                                    <img
                                        src="/team/marco.jpg"
                                        alt="Marco Rossi"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 active:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </div>

                            {/* Short Bio */}
                            <div className="flex-1 order-2">
                                <h3 className="text-4xl lg:text-5xl font-black text-navy-deep mb-3 font-montserrat tracking-tight">
                                    {team[0].name}
                                </h3>
                                <div className="text-accent font-bold text-lg mb-6 uppercase tracking-wider">
                                    {team[0].role}
                                </div>
                                <p className="text-slate text-lg leading-relaxed font-medium mb-8">
                                    {team[0].bio}
                                </p>
                                <button className="px-6 py-3 rounded-xl bg-navy-deep text-white font-bold text-sm hover:bg-accent transition-all duration-300 shadow-lg flex items-center gap-2">
                                    Ver CV Completo <BookOpen size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Credentials Sidebar (40% -> 5 cols) */}
                    <div className="lg:col-span-5 bg-navy-deep/5 p-8 rounded-[2rem] border border-navy-deep/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Scale size={120} />
                        </div>

                        <h4 className="text-xl font-black text-navy-deep mb-6 relative z-10 font-montserrat">Credenciales Destacadas</h4>

                        <ul className="space-y-4 relative z-10">
                            {[
                                { text: "8+ años como funcionario en la Justicia", icon: Award },
                                { text: "Autor de 50 publicaciones académicas y 5 libros", icon: BookOpen },
                                { text: "Docente en universidades de Argentina y LATAM", icon: Lightbulb },
                                { text: "Especialista certificado en Inteligencia Artificial", icon: Terminal }
                            ].map((cred, i) => (
                                <li key={i} className="flex items-start gap-4 p-3 bg-white rounded-xl shadow-sm border border-navy-deep/5 transition-transform hover:scale-[1.02]">
                                    <div className="p-2 bg-accent/10 rounded-lg text-accent shrink-0">
                                        <cred.icon size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-navy-deep/80 pt-1 leading-snug">{cred.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Marco's Multimedia Block */}
                {/* Marco's Multimedia Block & Presence */}
                <div className={`mb-32 p-8 md:p-12 rounded-[3rem] bg-navy-deep relative overflow-hidden shadow-strong transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <div className="absolute inset-0 tech-grid-dark opacity-5" />

                    <div className="relative z-10 space-y-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h4 className="text-2xl md:text-3xl font-black text-white font-montserrat mb-2">Presencia pública y producción intelectual</h4>
                                <p className="text-white/40 font-medium">Contenido docente, mediático y académico de Marco Rossi</p>
                            </div>
                            <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
                                Ver más contenido
                            </button>
                        </div>

                        {/* ROW 1: Interviews & Podcasts */}
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                            {/* Interviews */}
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-accent">
                                    <Tv size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest">Entrevistas y TV</span>
                                </div>
                                <div className={`grid grid-cols-2 gap-4 ${showAllInterviews ? '' : 'max-h-[600px] overflow-hidden'}`}>
                                    {multimedia.interviews.slice(0, showAllInterviews ? undefined : 4).map((item, i) => {
                                        const isVideo = item.url?.includes("youtu") || item.type === "Stream" || item.type === "Video";
                                        const thumbnailUrl = isVideo && item.url ? getYouTubeThumbnail(item.url) : null;

                                        return (
                                            <a
                                                key={i}
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`Ver ${item.title}`}
                                                className="aspect-video bg-navy-light/30 rounded-xl border border-white/10 relative group cursor-pointer overflow-hidden shadow-lg hover:shadow-accent/20 transition-all duration-300 hover:scale-[1.03] block"
                                            >
                                                {/* Image / Thumbnail */}
                                                <div className="absolute inset-0 bg-navy-deep">
                                                    {isVideo && thumbnailUrl ? (
                                                        <img
                                                            src={thumbnailUrl}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className={`w-full h-full bg-gradient-to-br from-gray-800 to-navy-deep p-4 flex flex-col justify-center items-center text-center`}>
                                                            <span className="text-xl font-black text-white/20 uppercase break-words w-full px-2">{item.source}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Overlays */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                    <div className="bg-accent/80 p-3 rounded-full backdrop-blur-sm shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                                                        {isVideo ? (
                                                            <Play size={24} className="text-white fill-white ml-1" />
                                                        ) : (
                                                            <ExternalLink size={24} className="text-white" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Badges & Text */}
                                                <div className="absolute top-2 left-2 z-10">
                                                    <span className={`text-[9px] font-black uppercase tracking-wider py-1 px-2 rounded-md text-white ${item.badgeColor || 'bg-blue-600'}`}>
                                                        {item.source}
                                                    </span>
                                                </div>

                                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-10 text-white z-10">
                                                    <div className="text-[10px] lg:text-[11px] font-bold leading-tight line-clamp-2 md:line-clamp-3 mb-1 group-hover:text-amber-300 transition-colors">
                                                        {item.shortTitle || item.title}
                                                    </div>
                                                    {item.duration && (
                                                        <div className="text-[9px] text-white/60 font-medium flex items-center gap-1">
                                                            <Play size={8} fill="currentColor" /> {item.duration}
                                                        </div>
                                                    )}
                                                    {item.date && (
                                                        <div className="text-[9px] text-white/60 font-medium">
                                                            {item.date}
                                                        </div>
                                                    )}
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>

                                {multimedia.interviews.length > 4 && (
                                    <div className="mt-8 flex justify-center">
                                        <button
                                            onClick={() => setShowAllInterviews(!showAllInterviews)}
                                            className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                                        >
                                            {showAllInterviews ? (
                                                <>Ver menos <ChevronUp size={14} /></>
                                            ) : (
                                                <>Ver más contenido ({multimedia.interviews.length - 4} más) <ChevronDown size={14} /></>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Podcasts */}
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-blue-400">
                                    <Mic2 size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest">Podcasts y Audio</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {multimedia.podcasts.map((item, i) => {
                                        const isYouTube = item.type === "YouTube";
                                        const isSpotify = item.source === "Spotify";
                                        const thumb = isYouTube && item.url ? getYouTubeThumbnail(item.url) : item.image;

                                        return (
                                            <a
                                                key={i}
                                                href={item.url}
                                                target={item.url ? "_blank" : "_self"}
                                                rel="noopener noreferrer"
                                                className="aspect-square bg-navy-light/30 rounded-lg border border-white/5 p-4 flex flex-col justify-end hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg overflow-hidden group relative"
                                            >
                                                {/* Background Image / Gradient */}
                                                <div className="absolute inset-0 z-0">
                                                    {thumb ? (
                                                        <img src={thumb} alt={item.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                                                    ) : (
                                                        <div className={`w-full h-full bg-gradient-to-br ${isSpotify ? 'from-green-900/40 to-black' : 'from-purple-900/40 to-black'}`} />
                                                    )}
                                                </div>

                                                {/* Icon Overlay */}
                                                <div className="absolute top-3 right-3 z-10 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {isSpotify ? <div className="text-[#1DB954]"><Mic2 size={16} /></div> : null}
                                                    {isYouTube ? <div className="text-red-500"><Youtube size={16} /></div> : null}
                                                </div>

                                                <div className="relative z-10">
                                                    <div className="text-[10px] font-black text-white mb-1 leading-tight group-hover:text-blue-400 transition-colors line-clamp-3">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-[9px] text-white/50">{item.duration}</div>

                                                    {/* Play Progress Bar (Visual only) */}
                                                    <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                        <div className={`h-full w-1/3 ${isSpotify ? 'bg-[#1DB954]' : (isYouTube ? 'bg-red-500' : 'bg-blue-400')}`} />
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ROW 2: Publications, Books & Instagram */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

                            {/* Publications */}
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-white/60">
                                    <BookOpen size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest">Publicaciones destacados</span>
                                </div>
                                <div className="space-y-4">
                                    {multimedia.publications.map((item, i) => (
                                        <div key={i} className="flex flex-col gap-1 group cursor-pointer border-b border-white/5 pb-3">
                                            <div className="text-sm font-bold text-white group-hover:text-accent transition-colors leading-snug">{item.title}</div>
                                            <div className="flex justify-between text-[10px] font-medium text-white/30">
                                                <span>{item.media}</span>
                                                <span>{item.year}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Books */}
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-accent">
                                    <BookOpen size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest">Libros</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {multimedia.books.map((item, i) => (
                                        item.url ? (
                                            <a
                                                key={i}
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`aspect-[3/4] bg-gradient-to-br ${item.cover || 'from-neutral-800 to-neutral-900'} rounded-lg border border-white/10 p-4 shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center text-center relative overflow-hidden group block`}
                                            >
                                                {/* Bg effect or Image */}
                                                {item.image ? (
                                                    <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                                ) : (
                                                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                                                )}


                                                {/* Content */}
                                                {!item.image && (
                                                    <div className={`relative z-10 flex flex-col h-full justify-between py-2 ${item.isCoauthor ? 'items-start text-left' : 'items-center text-center'}`}>
                                                        <div className="w-full">
                                                            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                                                                {item.isCoauthor ? <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-0.5 rounded text-[8px]">COAUTOR</span> : 'Libro'}
                                                            </div>
                                                            <div className="text-xs lg:text-sm font-black text-white uppercase tracking-tight leading-tight group-hover:text-amber-300 transition-colors line-clamp-4">
                                                                {item.title}
                                                            </div>
                                                            {item.subTitle && (
                                                                <div className="text-[9px] text-white/60 mt-1 leading-tight">{item.subTitle}</div>
                                                            )}
                                                        </div>

                                                        {item.isCoauthor && (
                                                            <div className="mt-2 text-[8px] text-white/50 space-y-1">
                                                                <div className="flex items-center gap-1"><Users size={10} /> {item.authors}</div>
                                                                <div className="flex items-center gap-1"><BookOpen size={10} /> {item.pages}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Badge for Available */}
                                                {(item.available && !item.image) && (
                                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                                        <div className="inline-block px-2 py-1 rounded-sm bg-green-500/20 border border-green-500/30 text-[8px] font-bold text-green-400 uppercase tracking-wider backdrop-blur-sm">
                                                            Disponible
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Hover Icon */}
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                                                    <ExternalLink size={12} className={item.image ? "text-white drop-shadow-md" : "text-amber-300"} />
                                                </div>
                                            </a>
                                        ) : (
                                            <div key={i} className={`aspect-[3/4] bg-gradient-to-br ${item.cover || 'from-neutral-800 to-neutral-900'} rounded-lg border border-white/10 p-4 shadow-xl flex items-center justify-center text-center relative overflow-hidden opacity-60 hover:opacity-100 transition-opacity`}>
                                                <div className="relative z-10 text-[9px] font-black text-white uppercase tracking-tighter leading-tight">{item.title}</div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Instagram Feed (Column 3) */}
                            <div className="md:col-span-2 lg:col-span-1 h-full">
                                <div className="flex items-center gap-2 mb-6 text-[#E1306C]">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    <span className="font-black text-xs uppercase tracking-widest">Sígueme en Instagram</span>
                                </div>
                                <div className="bg-black rounded-xl overflow-hidden border border-white/10 shadow-lg h-[400px] lg:h-full min-h-[400px] relative">
                                    <iframe
                                        src="https://www.instagram.com/marquitorossi/embed"
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        scrolling="no"
                                        allowTransparency={true}
                                        className="absolute inset-0 w-full h-full"
                                        title="Instagram Feed"
                                    >
                                    </iframe>
                                    {/* Fallback/Loading State behind iframe */}
                                    <div className="absolute inset-0 flex items-center justify-center text-white/20 -z-10 bg-white/5">
                                        <div className="text-center">
                                            <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full mx-auto mb-2" />
                                            <span className="text-[10px] tracking-widest uppercase">Cargando Feeed...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Other Team Members Grid */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {team.slice(1).map((member, i) => (
                        <div key={i} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-navy-deep/10 shadow-lg hover:shadow-2xl transition-all duration-500 group">
                            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start text-center lg:text-left">
                                <div className="w-32 md:w-40 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-navy-deep/5 flex-shrink-0">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-black text-navy-deep mb-2 font-montserrat">{member.name}</h4>
                                    <div className="text-accent font-bold text-sm uppercase tracking-wider mb-6">{member.role}</div>
                                    <p className="text-slate text-sm md:text-base leading-relaxed mb-8">
                                        {member.bio}
                                    </p>
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-navy-deep/40 hover:text-accent transition-colors"
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
        </section>
    );
}
