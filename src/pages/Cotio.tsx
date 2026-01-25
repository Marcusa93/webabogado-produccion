import { useState } from 'react';
import { ChevronLeft, Sparkles, Copy, Check, ShieldAlert, Cpu, Gavel, Scale, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import Magnetic from '@/components/Magnetic';
import StaggeredTitle from '@/components/StaggeredTitle';

export default function Cotio() {
    const [prompt, setPrompt] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [jurisdiction, setJurisdiction] = useState('');
    const [anonimize, setAnonimize] = useState(true);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleImprove = async () => {
        if (!prompt.trim()) {
            toast.error("Por favor, ingresá un borrador o necesidad.");
            return;
        }

        setIsLoading(true);
        setResult('');

        try {
            const response = await fetch('/.netlify/functions/cotio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, documentType, jurisdiction, anonimize })
            });

            const data = await response.json();

            if (data.ok) {
                setResult(data.result);
                toast.success("Prompt optimizado con éxito.");
            } else {
                toast.error(data.error || "Ocurrió un error inesperado.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al conectar con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setIsCopied(true);
        toast.success("Copiado al portapapeles");
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="min-h-screen noise-overlay bg-background">
            <CustomCursor />
            <Navigation />

            <main className="section-container pt-32 pb-24 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

                <div className="max-w-4xl mx-auto">
                    {/* Back button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors font-bold text-xs uppercase tracking-widest mb-12 group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Volver al inicio
                    </Link>

                    {/* Header */}
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                            <Sparkles size={14} className="text-accent" />
                            <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">Laboratorio Judicial-Tech</span>
                        </div>
                        <StaggeredTitle
                            text="COTIO Prompt Improver"
                            highlightWords={['COTIO', 'Improver']}
                            className="text-4xl md:text-6xl font-black font-montserrat tracking-tight leading-tight justify-start"
                        />
                        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mt-6 font-medium leading-relaxed">
                            Optimizá tus instrucciones para IA usando la metodología de <span className="text-foreground">Justicia Algorítmica</span>. Convertí borradores en prompts profesionales y estructurados.
                        </p>
                    </div>

                    {/* Tool Interface */}
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                        <div className="p-6 md:p-10 rounded-[2rem] bg-card/50 border border-foreground/10 backdrop-blur-xl shadow-soft space-y-8">
                            {/* Input Section */}
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                        <Gavel size={14} /> Necesidad o Borrador
                                    </label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Ej: Necesito que analices una demanda por daños y perjuicios donde el actor reclama lucro cesante sin prueba documental sólida..."
                                        className="w-full h-48 bg-foreground/5 border border-foreground/10 rounded-2xl p-6 text-foreground focus:ring-2 focus:ring-accent outline-none transition-all resize-none font-medium text-lg placeholder:text-foreground/20 shadow-inner"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                            <Scale size={14} /> Tipo de Documento
                                        </label>
                                        <input
                                            type="text"
                                            value={documentType}
                                            onChange={(e) => setDocumentType(e.target.value)}
                                            placeholder="Ej: Escrito de contestación, apelación..."
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-xl p-4 text-foreground focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                            <Cpu size={14} /> Jurisdicción / Fuero
                                        </label>
                                        <input
                                            type="text"
                                            value={jurisdiction}
                                            onChange={(e) => setJurisdiction(e.target.value)}
                                            placeholder="Ej: Civil y Comercial - Tucumán"
                                            className="w-full bg-foreground/5 border border-foreground/10 rounded-xl p-4 text-foreground focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-foreground/5">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={anonimize}
                                                onChange={(e) => setAnonimize(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${anonimize ? 'bg-accent' : 'bg-foreground/20'}`} />
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${anonimize ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                        <span className="text-sm font-bold text-foreground/60 group-hover:text-foreground transition-colors">Anonimizar datos sensibles</span>
                                    </label>

                                    <Magnetic>
                                        <button
                                            onClick={handleImprove}
                                            disabled={isLoading}
                                            className="px-10 py-5 bg-foreground text-background font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-glow disabled:opacity-50 flex items-center gap-3"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Optimizando...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={18} />
                                                    Mejorar Prompt
                                                </>
                                            )}
                                        </button>
                                    </Magnetic>
                                </div>
                            </div>

                            {/* Output Section */}
                            {result && (
                                <div className="pt-10 border-t border-foreground/10 animate-in fade-in slide-in-from-top-4 duration-700">
                                    <div className="flex items-center justify-between mb-6 px-1">
                                        <h5 className="text-xs font-black text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                            Prompt Final Optimizado
                                        </h5>
                                        <button
                                            onClick={handleCopy}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${isCopied
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10 hover:text-foreground'
                                                }`}
                                        >
                                            {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                            {isCopied ? 'Copiado' : 'Copiar'}
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-accent/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        <pre className="relative w-full bg-foreground/[0.03] border border-foreground/10 rounded-2xl p-8 text-foreground/80 font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap select-text">
                                            {result}
                                        </pre>
                                    </div>
                                    <div className="mt-8 p-4 rounded-xl bg-accent/5 border border-accent/10 flex items-center gap-4">
                                        <ShieldAlert size={18} className="text-accent shrink-0" />
                                        <p className="text-[10px] md:text-xs font-bold text-foreground/50 uppercase tracking-widest">
                                            Nota: No inventes datos reales. Si falta información importante, cargala en el prompt final antes de usarlo.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Global Message */}
                            <div className="pt-8 text-center border-t border-foreground/5">
                                <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.3em]">
                                    Herramienta técnica de optimización · No constituye asesoramiento legal · © Estudio Rossi
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
