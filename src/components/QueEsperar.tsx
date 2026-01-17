import React, { useRef, useState, useEffect } from 'react';
import { ClipboardCheck, DollarSign, CheckCircle, Calendar, Heart } from 'lucide-react';

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
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const scrollToContact = () => {
        const element = document.querySelector('#contacto');
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <section id="que-esperar" ref={sectionRef} className="py-24 md:py-32 bg-navy-deep relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 tech-grid-dark opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-accent/5 to-transparent blur-[120px]" />

            <div className="section-container relative z-10">
                <div className="max-w-4xl mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                        <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase font-montserrat">Transparencia & Compromiso</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight font-montserrat">
                        Qué podés esperar <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">de nuestro estudio.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/50 leading-relaxed font-medium">
                        Trabajamos con seriedad, realismo y trato respetuoso. Sabemos que cuando alguien nos contacta no está buscando discursos, sino respuestas claras. Por eso definimos desde el inicio qué pueden esperar quienes confían sus conflictos en nuestro equipo.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-8 gap-6 max-w-5xl mx-auto mb-16">
                    {expectations.map((item, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/10 group"
                        >
                            <div className="w-12 h-12 mb-4 text-blue-600">
                                <item.icon size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-navy-deep mb-3 font-montserrat">
                                {item.title}
                            </h3>
                            <p className="text-slate text-base leading-relaxed font-medium">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={scrollToContact}
                        className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:border-accent/30 transition-all active:scale-95 flex items-center gap-3 group"
                    >
                        <span>Agendar consulta</span>
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent transition-colors">
                            <ClipboardCheck size={18} className="text-accent group-hover:text-white" />
                        </div>
                    </button>
                </div>
            </div>
        </section>
    );
}
