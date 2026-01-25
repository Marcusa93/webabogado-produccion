import { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, Copy, Check, ShieldAlert, Cpu, Gavel, Scale, Loader2, Wand2, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [showResult, setShowResult] = useState(false);

    const handleImprove = async () => {
        if (!prompt.trim()) {
            toast.error("Por favor, ingresá un borrador o necesidad.");
            return;
        }

        setIsLoading(true);
        setShowResult(false);
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
                // Artificial delay for cinematic feel
                setTimeout(() => {
                    setIsLoading(false);
                    setShowResult(true);
                    toast.success("Prompt optimizado con éxito.");
                }, 1500);
            } else {
                setIsLoading(false);
                toast.error(data.error || "Ocurrió un error inesperado.");
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            toast.error("Error al conectar con el servidor.");
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
        <div className="min-h-screen noise-overlay bg-background selection:bg-accent/30">
            <CustomCursor />
            <Navigation />

            <main className="section-container pt-32 pb-24 relative overflow-hidden">
                {/* Decorative background effects */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10" />
                <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                <div className="max-w-4xl mx-auto">
                    {/* Back button with motion */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors font-bold text-xs uppercase tracking-widest mb-12 group"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Volver al inicio
                        </Link>
                    </motion.div>

                    {/* Header with staggered entry */}
                    <div className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6"
                        >
                            <Sparkles size={14} className="text-accent" />
                            <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">Laboratorio Judicial-Tech</span>
                        </motion.div>

                        <StaggeredTitle
                            text="COTIO Prompt Improver"
                            highlightWords={['COTIO', 'Improver']}
                            className="text-4xl md:text-7xl font-black font-montserrat tracking-tight leading-tight justify-start"
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg md:text-xl text-foreground/60 max-w-2xl mt-8 font-medium leading-relaxed"
                        >
                            Optimizá tus instrucciones para IA usando la metodología de <span className="text-foreground">Justicia Algorítmica</span> de Marco Rossi. Transformá borradores ambiguos en mandatos técnicos precisos.
                        </motion.p>
                    </div>

                    {/* Tool Interface Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative"
                    >
                        {/* Glass Container */}
                        <div className="relative p-6 md:p-12 rounded-[2.5rem] bg-card/40 border border-foreground/10 backdrop-blur-3xl shadow-2xl overflow-hidden">
                            {/* Inner border glow */}
                            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none" />

                            {/* Form Content */}
                            <div className={`space-y-10 transition-all duration-700 ${isLoading ? 'blur-md opacity-30 pointer-events-none scale-[0.98]' : 'blur-0 opacity-100'}`}>
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
                                        <Terminal size={14} className="text-accent/40" /> Borrador o Necesidad
                                    </label>
                                    <div className="relative group">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Describí qué necesitás que la IA haga, sin preocuparte por el orden..."
                                            className="w-full h-56 bg-foreground/[0.03] border border-foreground/10 rounded-2xl p-8 text-foreground focus:ring-2 focus:ring-accent/50 outline-none transition-all resize-none font-medium text-lg placeholder:text-foreground/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]"
                                        />
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="px-2 py-1 bg-accent/10 border border-accent/20 rounded text-[9px] font-bold text-accent uppercase">Input Activo</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
                                            <Scale size={14} className="text-accent/40" /> Tipo de Documento
                                        </label>
                                        <input
                                            type="text"
                                            value={documentType}
                                            onChange={(e) => setDocumentType(e.target.value)}
                                            placeholder="Contestación, Apelación, Acuerdo..."
                                            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl p-5 text-foreground focus:ring-2 focus:ring-accent/30 outline-none transition-all font-bold placeholder:text-foreground/20"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
                                            <Cpu size={14} className="text-accent/40" /> Jurisdicción
                                        </label>
                                        <input
                                            type="text"
                                            value={jurisdiction}
                                            onChange={(e) => setJurisdiction(e.target.value)}
                                            placeholder="Ej: Justicia Nacional en lo Civil"
                                            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl p-5 text-foreground focus:ring-2 focus:ring-accent/30 outline-none transition-all font-bold placeholder:text-foreground/20"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-foreground/5">
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={anonimize}
                                                onChange={(e) => setAnonimize(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-14 h-7 rounded-full transition-all duration-500 ${anonimize ? 'bg-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]' : 'bg-foreground/10'}`} />
                                            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-500 ease-spring ${anonimize ? 'translate-x-7 shadow-lg' : 'translate-x-0'}`} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-black text-foreground tracking-tight group-hover:text-accent transition-colors">Protección de Datos</p>
                                            <p className="text-[10px] uppercase font-bold text-foreground/30 tracking-widest">Anonimizar nombres y montos</p>
                                        </div>
                                    </label>

                                    <Magnetic strength={20}>
                                        <button
                                            onClick={handleImprove}
                                            disabled={isLoading}
                                            className="relative group overflow-hidden px-12 py-5 bg-foreground text-background font-black rounded-2xl text-sm uppercase tracking-[0.2em] transition-all hover:bg-accent hover:text-white shadow-2xl disabled:opacity-50"
                                        >
                                            <div className="flex items-center gap-3 relative z-10">
                                                <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                                                Optimizar Estructura
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-accent to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </button>
                                    </Magnetic>
                                </div>
                            </div>

                            {/* Immersive Loading Overlay */}
                            <AnimatePresence>
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-50 flex flex-col items-center justify-center p-12 bg-background/20 backdrop-blur-md"
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse" />
                                            <Loader2 size={64} className="text-accent animate-spin relative z-10" />
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-8 text-center"
                                        >
                                            <p className="text-lg font-black text-foreground uppercase tracking-[0.3em] mb-2">Procesando COTIO</p>
                                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Estructurando material jurídico mediante Gemini AI...</p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Refined Result Display */}
                            <AnimatePresence>
                                {showResult && result && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="mt-12 pt-12 border-t border-foreground/10"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="space-y-1">
                                                <h5 className="text-[11px] font-black text-accent uppercase tracking-[0.3em] flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
                                                    Resultado Certificado
                                                </h5>
                                                <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest pl-4">Metodología Justicia Algorítmica</p>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={handleCopy}
                                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm ${isCopied
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-foreground/5 text-foreground/60 hover:bg-foreground hover:text-white'
                                                        }`}
                                                >
                                                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                                    {isCopied ? 'Copiado' : 'Copiar Prompt'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative group/result">
                                            {/* Glow background */}
                                            <div className="absolute inset-0 bg-accent/5 rounded-3xl blur-2xl opacity-0 group-hover/result:opacity-100 transition-opacity pointer-events-none" />

                                            <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/[0.02] shadow-2xl">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-indigo-500 to-accent/20" />
                                                <pre className="p-8 md:p-12 text-foreground/90 font-mono text-base md:text-lg leading-relaxed whitespace-pre-wrap select-text selection:bg-accent/20">
                                                    {result}
                                                </pre>
                                            </div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="mt-10 p-6 rounded-2xl bg-accent/[0.03] border border-accent/5 flex items-center gap-5"
                                        >
                                            <ShieldAlert size={24} className="text-accent shrink-0" />
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Nota de Integridad</p>
                                                <p className="text-xs text-foreground/50 leading-relaxed max-w-2xl font-medium">
                                                    Este prompt ha sido estructurado para maximizar la precisión de un LLM. Verificá que no falten datos fácticos antes del pegado final.
                                                </p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Global Footer Message */}
                            <div className="mt-16 pt-8 text-center border-t border-foreground/5 opacity-30">
                                <p className="text-[9px] font-black text-foreground uppercase tracking-[0.4em]">
                                    Tool v1.2 · Backend Neural Gemini™ · No es asesoramiento legal · © Marco Rossi Digital
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
