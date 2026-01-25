import { ShieldAlert, Fingerprint, Search, CheckCircle2, AlertTriangle, ArrowRight, X, Hash, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StaggeredTitle from './StaggeredTitle';
import Hasher from './Hasher';
import Magnetic from './Magnetic';

const tools = [
    {
        id: 'evidence',
        icon: ShieldAlert,
        title: "Preservación SOS",
        subtitle: "Evidencia Digital",
        color: "from-blue-500 to-indigo-600",
        content: [
            { text: "No borres nada: No elimines mensajes ni bloquees al usuario inmediatamente.", icon: CheckCircle2 },
            { text: "Captura Técnica: Anotá fecha, hora y URL completa del perfil (no solo screenshot).", icon: CheckCircle2 },
            { text: "Cadena de Custodia: Usá escribanos digitales para certificar chats y evitar impugnaciones.", icon: CheckCircle2 }
        ]
    },
    {
        id: 'influencer',
        icon: Fingerprint,
        title: "Check Influencer",
        subtitle: "Contratos de Imagen",
        color: "from-purple-500 to-pink-600",
        content: [
            { text: "Cesión de Imagen: Verificá tiempo y países donde pueden usar tu rostro.", icon: CheckCircle2 },
            { text: "Exclusividad: ¿Te prohíben marcas competidoras o todo el rubro?", icon: CheckCircle2 },
            { text: "Propiedad Intelectual: Asegurá que el contenido siga siendo tuyo tras la campaña.", icon: CheckCircle2 }
        ]
    },
    {
        id: 'phishing',
        icon: Search,
        title: "Scam Detector",
        subtitle: "Detección de Phishing",
        color: "from-amber-500 to-orange-600",
        content: [
            { text: "Remitente: Verificá si el mail termina en @banco.com.ar o en dominios genéricos.", icon: AlertTriangle },
            { text: "Urgencia Artificial: Desconfiá de avisos de bloqueo que te piden acción inmediata.", icon: AlertTriangle },
            { text: "Links Directos: Nunca pongas claves tras un link de SMS. Usá siempre la App oficial.", icon: AlertTriangle }
        ]
    },
    {
        id: 'hasher',
        icon: Hash,
        title: "Hasheador Online",
        subtitle: "Integridad de Datos",
        color: "from-emerald-500 to-teal-600",
        isHasher: true
    },
    {
        id: 'cotio',
        icon: Sparkles,
        title: "COTIO Improver",
        subtitle: "Justicia Algorítmica",
        color: "from-indigo-500 to-purple-600",
        isCotioTool: true
    }
];

const ToolCard = ({ tool, isActive, onClick }: { tool: any, isActive: boolean, onClick: () => void }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <button
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            className={`group relative p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-card border border-foreground/5 dark:border-white/10 text-left transition-all duration-500 hover:shadow-xl active:scale-[0.98] overflow-hidden ${isActive ? 'ring-2 ring-accent border-transparent shadow-glow-accent' : 'shadow-soft'}`}
        >
            {/* Spotlight Glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--accent) / 0.1), transparent 80%)`
                }}
            />

            {/* Tool Accent Static Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 blur-[40px] transition-opacity duration-500`} />

            <div className="relative z-10">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-6 md:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <tool.icon size={tool.id === 'phishing' ? 24 : 28} className="md:w-7 md:h-7" />
                </div>

                <h3 className="text-lg md:text-xl font-black text-foreground mb-1 font-montserrat uppercase tracking-tight">{tool.title}</h3>
                <p className="text-foreground/40 dark:text-white/40 text-xs md:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8">{tool.subtitle}</p>

                <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                    {tool.isHasher || tool.isCotioTool ? 'Abrir Herramienta' : 'Ver Instrucciones'} <ArrowRight size={14} />
                </div>
            </div>
        </button>
    );
};

export default function Toolkit() {
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const navigate = useNavigate();

    return (
        <section id="toolkit" className="py-16 md:py-24 bg-background transition-colors duration-500 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 tech-grid opacity-10 dark:opacity-20 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="section-container relative z-10">
                <div className="max-w-4xl mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 dark:bg-accent/10 border border-accent/10 dark:border-accent/20 mb-6">
                        <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-montserrat">Recursos Útiles</span>
                    </div>
                    <StaggeredTitle
                        text="Kit de herramientas útiles para nuestros clientes."
                        highlightWords={['herramientas', 'útiles']}
                        className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 font-montserrat justify-start leading-tight"
                    />
                    <p className="text-foreground/60 dark:text-white/50 text-base md:text-xl max-w-2xl font-medium leading-relaxed">
                        Herramientas tácticas de uso inmediato para proteger tu identidad y patrimonio en entornos digitales.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {tools.map((tool) => (
                        <ToolCard
                            key={tool.id}
                            tool={tool}
                            isActive={activeTool === tool.id}
                            onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                        />
                    ))}
                </div>

                {/* Action Content Drawer */}
                {activeTool && (
                    <div className="mt-6 md:mt-8 p-6 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] bg-card/50 dark:bg-white/5 border border-foreground/10 dark:border-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden shadow-2xl">
                        {/* Background Decoration */}
                        <div className={`absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br ${tools.find(t => t.id === activeTool)?.color} opacity-10 blur-[80px] pointer-events-none`} />

                        <button
                            onClick={() => setActiveTool(null)}
                            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/50 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative z-10">
                            {tools.find(t => t.id === activeTool)?.isHasher ? (
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-2`}>
                                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Utilidad Criptográfica de Marco Rossi</span>
                                        </div>
                                        <h4 className="text-3xl md:text-5xl font-black text-foreground font-montserrat leading-tight">
                                            Hasheador Online <br />
                                            <span className="text-foreground/30 text-xl md:text-2xl italic">Privacidad 100% Client-Side</span>
                                        </h4>
                                    </div>
                                    <Hasher />
                                </div>
                            ) : tools.find(t => t.id === activeTool)?.isCotioTool ? (
                                <div className="flex flex-col md:flex-row items-center gap-12 py-8">
                                    <div className="flex-1 space-y-8">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-2`}>
                                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Optimización Justicia Algorítmica</span>
                                        </div>
                                        <h4 className="text-3xl md:text-5xl font-black text-foreground font-montserrat leading-tight">
                                            COTIO Prompt <br />
                                            <span className="text-foreground/30 italic">Improver</span>
                                        </h4>
                                        <p className="text-lg text-foreground/60 font-medium leading-relaxed max-w-xl">
                                            Nuestra herramienta exclusiva para abogados. Convertí borradores en prompts profesionales usando la metodología COTIO. Procesado de forma segura en nuestro laboratorio digital.
                                        </p>
                                        <Magnetic>
                                            <button
                                                onClick={() => navigate('/herramientas/cotio')}
                                                className="px-10 py-5 bg-foreground text-background font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-glow flex items-center gap-3"
                                            >
                                                Acceder a la herramienta
                                                <ArrowRight size={18} />
                                            </button>
                                        </Magnetic>
                                    </div>
                                    <div className="w-full md:w-1/3 aspect-square rounded-[3rem] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center p-12 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                                        <Sparkles size={80} className="text-indigo-400 relative z-10 animate-pulse" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                                    <div className="flex-1">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 mb-6 md:mb-8`}>
                                            <span className="text-[10px] font-bold text-foreground/40 dark:text-white/40 uppercase tracking-widest">Protocolo Activo</span>
                                        </div>
                                        <h4 className="text-2xl md:text-3xl font-black text-foreground mb-6 font-montserrat leading-tight">
                                            {tools.find(t => t.id === activeTool)?.title} <br />
                                            <span className="text-foreground/30 dark:text-white/30">{tools.find(t => t.id === activeTool)?.subtitle}</span>
                                        </h4>
                                        <ul className="space-y-4 md:space-y-6">
                                            {tools.find(t => t.id === activeTool)?.content?.map((item: any, idx: number) => (
                                                <li key={idx} className="flex items-start gap-3 md:gap-4 group">
                                                    <div className={`mt-1 p-1 rounded bg-accent/10 text-accent transition-transform group-hover:scale-110 shrink-0`}>
                                                        <item.icon size={16} className="md:w-[18px] md:h-[18px]" />
                                                    </div>
                                                    <span className="text-base md:text-lg text-foreground/70 dark:text-white/70 font-medium leading-relaxed">{item.text}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Mobile CTA (visible only on small screens) */}
                                        <div className="mt-8 pt-8 border-t border-foreground/5 md:hidden">
                                            <a
                                                href="#contacto"
                                                onClick={() => setActiveTool(null)}
                                                className="flex items-center justify-center gap-3 w-full py-5 bg-accent text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-glow"
                                            >
                                                <ShieldAlert size={18} />
                                                <span>Hablar con Marco</span>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Desktop Sidebar */}
                                    <div className="hidden md:flex flex-col justify-center items-center p-12 rounded-[2rem] bg-foreground/5 dark:bg-white/5 border border-foreground/5 dark:border-white/5 max-w-[300px] text-center">
                                        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-6">
                                            <ShieldAlert size={32} />
                                        </div>
                                        <h5 className="font-bold text-foreground mb-3 text-lg">¿Necesitás acción legal?</h5>
                                        <p className="text-sm text-foreground/40 dark:text-white/40 mb-8">Si ya ocurrió el incidente, la rapidez es vital para asegurar la prueba.</p>
                                        <a
                                            href="#contacto"
                                            onClick={() => setActiveTool(null)}
                                            className="w-full py-4 bg-accent text-white font-black rounded-xl text-xs uppercase tracking-widest hover:shadow-glow transition-all"
                                        >
                                            Hablar con Marco
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
