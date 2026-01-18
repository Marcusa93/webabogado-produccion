import React from 'react';
import { ClipboardCheck, DollarSign, Search, Users, MessageSquare, ShieldCheck } from 'lucide-react';
import UnifiedCard from './UnifiedCard';

const expectations = [
    {
        icon: ClipboardCheck,
        title: "Evaluación responsable del caso",
        description: "Analizamos cada consulta con criterio jurídico y probatorio. No tomamos todos los casos. Aceptamos aquellos en los que creemos que podemos aportar una estrategia seria y técnicamente sostenible. Si consideramos que no es conveniente litigar, lo decimos con claridad."
    },
    {
        icon: DollarSign,
        title: "Honorarios y costos",
        description: "Nuestro trabajo es profesional y tiene costo. Informamos con transparencia los honorarios y los gastos estimados antes de iniciar cualquier intervención. Evitamos prometer resultados y también evitamos sorpresas económicas: todo se acuerda por escrito."
    },
    {
        icon: Search,
        title: "Cómo saber si podemos asumir tu caso",
        description: "Podés solicitar una consulta inicial. En esa instancia revisamos la situación, la documentación disponible y la prueba digital vinculada al conflicto. A partir de ese encuentro definimos si corresponde avanzar y en qué modalidad de intervención."
    },
    {
        icon: Users,
        title: "Trabajo pro bono",
        description: "Destinamos un cupo limitado de casos pro bono a situaciones de especial vulnerabilidad o relevancia social. La selección de estos casos es discrecional del estudio y se realiza mediante evaluación fundada. Entendemos que el ejercicio profesional también tiene una dimensión de responsabilidad pública."
    },
    {
        icon: MessageSquare,
        title: "Cómo contactarnos",
        description: "Atendemos únicamente con agenda previa. Podés escribirnos a través del formulario de contacto del sitio o por los canales de comunicación indicados. Toda la información que nos envíes es tratada con confidencialidad profesional."
    }
];

export default function QueEsperar() {
    const scrollToContact = () => {
        const element = document.querySelector('#contacto');
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <section id="que-esperar" className="py-24 md:py-32 bg-navy-deep relative overflow-hidden">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                    {expectations.map((item, index) => (
                        <UnifiedCard
                            key={index}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            variant="dark"
                            delay={index * 100}
                            mouseGlow={true}
                        />
                    ))}

                    {/* Decorative block */}
                    <div className="hidden lg:flex p-10 rounded-3xl border border-white/5 items-center justify-center opacity-20 grayscale">
                        <ShieldCheck size={80} className="text-white/20" />
                    </div>
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
