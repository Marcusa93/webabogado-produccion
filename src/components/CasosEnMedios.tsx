import React from 'react';
import { ExternalLink, Quote, Scale } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import StaggeredTitle from './StaggeredTitle';

interface MediaCase {
    outlet: string;
    /** Accent color que arma el badge del medio (hex, rgb, etc) */
    outletAccent: string;
    /** Color de texto del badge sobre outletAccent */
    outletText?: string;
    date: string;
    title: string;
    url: string;
    /** Áreas legales que tocó el caso, se renderizan como pills */
    areas: string[];
    /** Cita textual del abogado, sin comillas — el componente las dibuja */
    quote: string;
    /** Atribución de la cita (nombre + rol) */
    attribution: string;
    /** Etiqueta sobria del rol, ej: "Representación de la familia" */
    role: string;
}

// Casos en los que el estudio actuó como representación legal y que tuvieron
// cobertura de prensa. Ordenados por fecha desc. Para agregar un caso nuevo,
// añadir un objeto al inicio del array.
const cases: MediaCase[] = [
    {
        outlet: 'Contexto Tucumán',
        outletAccent: '#b23636',
        outletText: '#ffffff',
        date: 'Enero 2026',
        title:
            'Clausuran el natatorio de barrio Sur donde murió ahogado un joven con discapacidad',
        url: 'https://www.contextotucuman.com/nota/371220/clausuran-el-natatorio-de-barrio-sur-donde-murio-ahogado-un-joven-con-discapacidad-hace-dos-meses.html',
        areas: ['Daños y perjuicios', 'Abandono de persona', 'Penal'],
        quote:
            'La muerte de Gabriel se podría haber evitado. No hubo asistencia, no hubo control y no hubo protocolos mínimos de seguridad.',
        attribution: 'Marco Rossi · Abogado de la familia Palavecino',
        role: 'Representación de la familia',
    },
];

export default function CasosEnMedios() {
    const { ref, isInView } = useInView({ threshold: 0.1 });

    if (cases.length === 0) return null;

    return (
        <section
            id="casos-prensa"
            ref={ref}
            className="relative py-24 md:py-32 bg-background transition-colors duration-500 overflow-hidden"
        >
            {/* Background accents — consistentes con el resto del sitio */}
            <div className="absolute inset-0 tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10 pointer-events-none" />
            <div className="absolute -top-32 -left-24 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-24 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="section-container relative z-10">
                {/* Header */}
                <div className="max-w-3xl mb-16 md:mb-20">
                    <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                    >
                        <Scale size={12} className="text-accent" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-montserrat">
                            Representación legal · Trayectoria en prensa
                        </span>
                    </div>

                    <StaggeredTitle
                        text="Casos que tuvieron repercusión."
                        highlightWords={['repercusión.']}
                        className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 font-montserrat justify-start leading-tight"
                    />

                    <p className="text-base md:text-lg text-foreground/60 font-medium leading-relaxed max-w-2xl">
                        Casos reales en los que intervinimos como representación legal de las
                        familias o partes afectadas, con cobertura en medios de prensa.
                    </p>
                </div>

                {/* Cases grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {cases.map((c, i) => (
                        <article
                            key={c.url}
                            className={`group relative bg-card rounded-[2rem] border border-foreground/10 shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden ${isInView
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-12'
                                }`}
                            style={{ transitionDelay: `${200 + i * 150}ms` }}
                        >
                            {/* Subtle hover glow */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background: `radial-gradient(600px circle at 0% 0%, ${c.outletAccent}10, transparent 60%)`,
                                }}
                            />

                            <div className="relative z-10 p-7 md:p-10 flex flex-col h-full">
                                {/* Top row: outlet badge + legal areas */}
                                <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                                    <a
                                        href={c.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-serif italic text-sm font-bold tracking-tight transition-transform hover:scale-[1.03]"
                                        style={{
                                            backgroundColor: c.outletAccent,
                                            color: c.outletText || '#fff',
                                        }}
                                        aria-label={`Leer la nota original en ${c.outlet}`}
                                    >
                                        {c.outlet}
                                    </a>
                                    <div className="flex flex-wrap gap-1.5">
                                        {c.areas.map((area) => (
                                            <span
                                                key={area}
                                                className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-accent/10 text-accent border border-accent/20 uppercase tracking-wider"
                                            >
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Role label (sober) */}
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-3">
                                    {c.role}
                                </p>

                                {/* Title */}
                                <h3 className="text-xl md:text-2xl font-black text-foreground font-montserrat leading-snug mb-8">
                                    {c.title}
                                </h3>

                                {/* Quote block */}
                                <blockquote className="relative pl-6 mb-6 border-l-2 border-accent/40">
                                    <Quote
                                        size={22}
                                        className="absolute -left-3 -top-1 text-accent/30 fill-accent/20"
                                        aria-hidden="true"
                                    />
                                    <p className="text-base md:text-lg text-foreground/85 italic font-medium leading-relaxed">
                                        “{c.quote}”
                                    </p>
                                </blockquote>

                                {/* Attribution */}
                                <p className="text-xs md:text-sm font-bold text-foreground/60 mb-8">
                                    — {c.attribution}
                                </p>

                                {/* Footer: date + read full link */}
                                <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-foreground/5">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
                                        {c.date}
                                    </span>
                                    <a
                                        href={c.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-black text-accent hover:text-accent-light transition-all uppercase tracking-widest group/link"
                                    >
                                        Leer nota completa
                                        <ExternalLink
                                            size={14}
                                            className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                                        />
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
