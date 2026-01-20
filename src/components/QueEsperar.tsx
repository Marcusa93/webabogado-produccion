import React, { useRef, useState, useEffect } from 'react';
import { ClipboardCheck, DollarSign, CheckCircle, Calendar, Heart } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import UnifiedCard from './UnifiedCard';

const expectations = [
    {
        icon: CheckCircle,
        title: "Evaluación técnica",
        description: "Análisis jurídico riguroso. Solo asumimos casos donde podamos aportar valor real. Transparencia total desde el inicio."
    },
    {
        icon: DollarSign,
        title: "Costos claros",
        description: "Honorarios transparentes desde el primer día. Somos tu estudio de confianza."
    },
    {
        icon: Calendar,
        title: "Consulta inicial",
        description: "Evaluamos tu caso en la primera reunión. Revisamos documentación y definimos estrategia juntos."
    },
    {
        icon: Heart,
        title: "Casos pro bono",
        description: "Reservamos cupo para casos de alta relevancia social o vulnerabilidad. Selección por evaluación técnica."
    }
];

export default function QueEsperar() {
    const sectionRef = useRef<HTMLElement>(null);
    const { ref: inViewRef, isInView } = useInView({ threshold: 0.1 });

    return (
        <section id="que-esperar" ref={sectionRef} className="py-24 md:py-32 bg-background relative overflow-hidden transition-colors duration-500">
            {/* Background Elements */}
            <div className="absolute inset-0 tech-grid opacity-5 dark:tech-grid-dark dark:opacity-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

            <div className="section-container relative z-10">
                {/* Header - Centered */}
                <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
                        <span className="text-[10px] font-bold tracking-widest text-accent uppercase">Nuestro Compromiso</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 font-montserrat">
                        Qué podés esperar de{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">nuestro estudio</span>
                    </h2>
                    <p className="text-xl text-foreground/70 leading-relaxed font-medium">
                        Transparencia, profesionalismo y compromiso en cada caso.
                    </p>
                </div>

                {/* Cards Grid - 2 columns desktop, 1 column mobile */}
                <div ref={inViewRef} className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
                    {expectations.map((item, index) => (
                        <UnifiedCard
                            key={index}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            variant="dark"
                            delay={index * 100}
                            mouseGlow={true}
                            className={`stagger-${index + 1} ${isInView ? 'is-visible' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
