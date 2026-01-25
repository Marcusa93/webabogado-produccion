import React, { useRef } from 'react';
import { ClipboardCheck, DollarSign, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import StaggeredTitle from './StaggeredTitle';

const steps = [
    {
        number: "01",
        title: "Consulta inicial estratégica",
        description: "Reunión de diagnóstico para evaluar la viabilidad de tu caso. No tomamos casos sin análisis previo.",
        icon: MessageCircle,
        color: "bg-blue-500",
        delay: 0
    },
    {
        number: "02",
        title: "Propuesta clara y transparente",
        description: "Un plan de acción detallado con costos definidos desde el primer día. Sin sorpresas ni letra chica.",
        icon: DollarSign,
        color: "bg-emerald-500",
        delay: 100
    },
    {
        number: "03",
        title: "Ejecución técnica rigurosa",
        description: "Implementamos la estrategia jurídica validada, con reportes periódicos de avance.",
        icon: ClipboardCheck,
        color: "bg-amber-500",
        delay: 200
    },
    {
        number: "04",
        title: "Compromiso social",
        description: "Reservamos un cupo mensual para casos pro bono de alto impacto social o vulnerabilidad.",
        icon: Heart,
        color: "bg-rose-500",
        delay: 300
    }
];

export default function QueEsperar() {
    const { ref, isInView } = useInView({ threshold: 0.1 });

    return (
        <section id="que-esperar" className="py-24 md:py-32 bg-background relative overflow-hidden transition-colors duration-500">
            {/* Ambient Background */}
            <div className="absolute inset-0 tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10" />
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="section-container relative z-10">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6 transition-transform hover:scale-105">
                        <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-montserrat">Metodología</span>
                    </div>

                    <StaggeredTitle
                        text="Un proceso diseñado para darte resultados."
                        highlightWords={['darte', 'resultados.']}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 font-montserrat leading-tight justify-center"
                    />

                    <p className="text-xl text-foreground/70 leading-relaxed font-medium">
                        Transparencia, orden y rigor técnico en cada etapa del camino.
                    </p>
                </div>

                {/* Steps Grid / Process Flow */}
                <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Connecting Line (Desktop Only) */}
                    <div className="hidden lg:block absolute top-[60px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent z-0" />

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`relative z-10 group flex flex-col items-center text-center transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                            style={{ transitionDelay: `${step.delay}ms` }}
                        >
                            {/* Number Badge */}
                            <div className="mb-8 relative">
                                <div className="w-12 h-12 rounded-full bg-card border-4 border-background flex items-center justify-center text-sm font-black text-foreground shadow-lg relative z-20 group-hover:scale-125 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                    {step.number}
                                </div>
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 ${step.color} rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity z-10`} />
                            </div>

                            {/* Content Card */}
                            <div className="w-full h-full bg-card/50 backdrop-blur-sm border border-foreground/5 rounded-[2rem] p-8 hover:bg-card hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group/card">
                                <div className={`w-14 h-14 mx-auto mb-6 rounded-2xl ${step.color} bg-opacity-10 flex items-center justify-center text-foreground group-hover/card:scale-110 transition-transform`}>
                                    <step.icon size={28} className={step.color.replace('bg-', 'text-')} />
                                </div>

                                <h3 className="text-xl font-black text-foreground mb-4 font-montserrat leading-tight">
                                    {step.title}
                                </h3>

                                <p className="text-foreground/70 text-sm leading-relaxed font-medium">
                                    {step.description}
                                </p>
                            </div>

                            {/* Mobile Connector Line - Vertical Arrow */}
                            {index !== steps.length - 1 && (
                                <div className="lg:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 text-foreground/20 animate-bounce">
                                    <ArrowRight className="rotate-90" size={24} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
