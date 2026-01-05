import { Award, BookOpen, Scale, Terminal, Radio, Mic2, Tv, Youtube, Linkedin, Play, ExternalLink, Lightbulb } from 'lucide-react';
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
        linkedin: "https://linkedin.com"
    },
    {
        name: "Vancis Roda",
        role: "Asesor auxiliar y perito de parte",
        image: "/team/vancis.jpg",
        bio: "Experto en análisis de evidencia informática y peritajes técnicos. Brinda el soporte científico necesario para la validación de pruebas en entornos digitales complejos.",
        linkedin: "https://linkedin.com"
    }
];

const multimedia = {
    interviews: [
        { title: "Análisis Justicia Digital", type: "TV" },
        { title: "Ciberdelitos en Prime Time", type: "TV" },
        { title: "El futuro del derecho", type: "Web" },
        { title: "Entrevista La Nación", type: "Prensa" }
    ],
    podcasts: [
        { title: "Derecho & Código Ep. 12", duration: "45 min" },
        { title: "Justicia 4.0", duration: "32 min" },
        { title: "Legal Tech Talk", duration: "50 min" },
        { title: "El proceso digital", duration: "28 min" }
    ],
    publications: [
        { title: "La prueba electrónica en el CPCyCN", media: "Revista de Derecho Procesal", year: "2024" },
        { title: "Inteligencia Artificial y Debido Proceso", media: " Thomson Reuters", year: "2023" },
        { title: "Cibercrimen: Nuevos paradigmas", media: "IJ Editores", year: "2023" },
        { title: "Blockchain aplicado a la justicia", media: "Derecho y Tecnología", year: "2022" }
    ],
    books: [
        { title: "Manual de Derecho Informático", cover: "bg-accent/20" },
        { title: "Tratado de la Prueba Digital", cover: "bg-blue-600/20" },
        { title: "Estrategias de Litigación Tech", cover: "bg-navy-light" },
        { title: "Justicia y Tecnología", cover: "bg-accent/10" }
    ]
};

export default function QuienesSomos() {
    const { ref, isInView } = useInView({ threshold: 0.1 });
    const [activeProfile, setActiveProfile] = useState<string | null>(null);

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
                <div className={`mb-32 p-8 md:p-12 rounded-[3rem] bg-navy-deep relative overflow-hidden shadow-strong transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <div className="absolute inset-0 tech-grid-dark opacity-5" />

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                            <div>
                                <h4 className="text-2xl md:text-3xl font-black text-white font-montserrat mb-2">Presencia pública y producción intelectual</h4>
                                <p className="text-white/40 font-medium">Contenido docente, mediático y académico de Marco Rossi</p>
                            </div>
                            <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
                                Ver más contenido
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Interviews */}
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-accent">
                                    <Tv size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest">Entrevistas y TV</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {multimedia.interviews.map((item, i) => (
                                        <div key={i} className="aspect-video bg-white/5 rounded-lg border border-white/5 relative group cursor-pointer overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-accent/40 backdrop-blur-sm z-10">
                                                <Play size={20} className="text-white fill-white" />
                                            </div>
                                            <div className="absolute bottom-2 left-2 text-[8px] font-bold text-white/50">{item.title}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Podcasts */}
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-blue-400">
                                    <Mic2 size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest">Podcasts y Audio</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {multimedia.podcasts.map((item, i) => (
                                        <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/5 p-4 flex flex-col justify-end hover:scale-105 transition-transform cursor-pointer shadow-lg overflow-hidden">
                                            <div className="text-[9px] font-black text-white mb-1 leading-tight">{item.title}</div>
                                            <div className="text-[7px] text-white/40">{item.duration}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Publications */}
                            <div className="lg:col-span-1">
                                <div className="flex items-center gap-2 mb-6 text-white/60">
                                    <BookOpen size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest">Publicaciones destacados</span>
                                </div>
                                <div className="space-y-4">
                                    {multimedia.publications.map((item, i) => (
                                        <div key={i} className="flex flex-col gap-1 group cursor-pointer border-b border-white/5 pb-2">
                                            <div className="text-[10px] font-bold text-white group-hover:text-accent transition-colors truncate">{item.title}</div>
                                            <div className="flex justify-between text-[8px] font-medium text-white/30">
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
                                        <div key={i} className={`aspect-[3/4] ${item.cover} rounded-md border border-white/10 p-3 shadow-xl transform transition-all duration-300 hover:rotate-3 hover:-translate-y-2 cursor-pointer flex items-center justify-center text-center`}>
                                            <div className="text-[8px] font-black text-white uppercase tracking-tighter">{item.title}</div>
                                        </div>
                                    ))}
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
