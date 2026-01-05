import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Lock, Cpu, Check, AlertTriangle, RefreshCw } from 'lucide-react';

interface DigitalTerminalProps {
    onComplete?: () => void;
}

const DigitalTerminal: React.FC<DigitalTerminalProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<any[]>([]); // Store objects { text, type, color }
    const [showStatus, setShowStatus] = useState(false);

    // Icon helper
    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <Check size={14} className="text-green-400 mt-1 flex-shrink-0" />;
            case 'alert': return <AlertTriangle size={14} className="text-yellow-400 mt-1 flex-shrink-0" />;
            case 'process': return <RefreshCw size={14} className="text-blue-400 mt-1 animate-spin flex-shrink-0" />;
            case 'final': return <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0 animate-pulse" />;
            default: return <span className="text-gray-500 mt-0.5 flex-shrink-0">$</span>;
        }
    };

    const content = [
        { text: "> MARCO_ROSSI_LEGAL_ENGINE", delay: 50, type: 'command', color: "text-white font-bold" },
        { text: "", delay: 100, type: 'spacer' },

        { text: "> init_threat_detection --realtime_monitoring", delay: 200, type: 'command' },
        { text: "", delay: 50, type: 'spacer' },

        { text: "> scanning_legal_landscape...", delay: 250, type: 'command' },
        { text: "Monitoreando cambios normativos...", delay: 200, type: 'process', color: "text-blue-300" },
        { text: "Analizando jurisprudencia reciente...", delay: 200, type: 'process', color: "text-blue-300" },
        { text: "[INFO] 3 nuevos precedentes relevantes", delay: 150, type: 'success', color: "text-green-400" },
        { text: "", delay: 100, type: 'spacer' },

        { text: "> detecting_vulnerabilities...", delay: 250, type: 'command' },
        { text: "[ALERT] Posible incumplimiento detectado", delay: 200, type: 'alert', color: "text-yellow-400" },
        { text: "Nivel de riesgo: MEDIO", delay: 100, type: 'process', color: "text-yellow-200" },
        { text: "Jurisdicción: Federal", delay: 100, type: 'process', color: "text-yellow-200" },
        { text: "[OK] Protocolo de mitigación: INICIADO", delay: 150, type: 'success', color: "text-green-400" },
        { text: "", delay: 100, type: 'spacer' },

        { text: "> verifying_contractual_chains...", delay: 250, type: 'command' },
        { text: "Proveedor Cloud: Contrato vigente", delay: 150, type: 'success', color: "text-green-300" },
        { text: "Acuerdos de confidencialidad: ACTIVOS", delay: 150, type: 'success', color: "text-green-300" },
        { text: "SLA críticos: Vencen en 45 días", delay: 200, type: 'alert', color: "text-yellow-400" },
        { text: "", delay: 100, type: 'spacer' },

        { text: "> executing_forensic_analysis...", delay: 300, type: 'command' },
        { text: "Reconstruyendo timeline de eventos...", delay: 200, type: 'process', color: "text-blue-300" },
        { text: "Identificando actores involucrados...", delay: 400, type: 'process', color: "text-blue-300" },
        { text: "[EVIDENCE] Cadena de custodia: VÁLIDA", delay: 150, type: 'success', color: "text-green-400 font-bold" },
        { text: "[INFO] Prueba digital: ADMISIBLE", delay: 150, type: 'success', color: "text-green-400 font-bold" },
        { text: "", delay: 100, type: 'spacer' },

        { text: "> load_module: DEFENSE_PROTOCOL", delay: 250, type: 'command' },
        { text: "Estrategia defensiva: COMPILED", delay: 100, type: 'success', color: "text-green-300" },
        { text: "Argumentos preparados: 47", delay: 100, type: 'success', color: "text-green-300" },
        { text: "Jurisprudencia de respaldo: LINKED", delay: 100, type: 'success', color: "text-green-300" },
        { text: "", delay: 100, type: 'spacer' },

        { text: "> establishing_legal_shield...", delay: 300, type: 'command' },
        { text: "[SECURE] Derechos fundamentales: PROTEGIDOS", delay: 150, type: 'success', color: "text-green-400" },
        { text: "[OK] Plazos judiciales: BAJO CONTROL", delay: 150, type: 'success', color: "text-green-400" },
        { text: "", delay: 200, type: 'spacer' },
    ];

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentIndex = 0;
        setLines([]);

        const runSequence = async () => {
            while (currentIndex < content.length) {
                const item = content[currentIndex];

                await new Promise(r => setTimeout(r, item.delay));

                setLines(prev => [...prev, item]);

                // Auto-scroll
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }

                currentIndex++;
            }
            setTimeout(() => setShowStatus(true), 500);

            if (onComplete) {
                setTimeout(() => onComplete(), 2000); // 2 seconds to read final status
            }

            // Final scroll check
            setTimeout(() => {
                if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }, 600);
        };

        runSequence();
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 min-h-[350px]">
            <div className="w-full max-w-lg bg-[#0a0f1c]/95 backdrop-blur-md rounded-lg border border-white/15 shadow-2xl overflow-hidden font-mono text-[10px] xs:text-xs sm:text-sm transform transition-all hover:scale-[1.005] duration-500 flex flex-col h-[340px] xs:h-[380px] sm:h-[480px]">

                {/* Terminal Header */}
                <div className="bg-[#1a1f2e] px-4 py-3 flex items-center justify-between border-b border-white/5 flex-shrink-0">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider">
                        <Terminal size={12} />
                        <span>marco_rossi_legal_engine</span>
                    </div>
                    <div className="w-10" />
                </div>

                {/* Terminal Body */}
                <div ref={scrollRef} className="p-4 sm:p-6 flex-1 overflow-y-auto scrollbar-hide relative flex flex-col">

                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.5)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20 fixed" />

                    <div className="space-y-1.5 z-10 font-mono pb-20">
                        {lines.map((item, i) => {
                            if (item.type === 'spacer') return <div key={i} className="h-2" />;

                            return (
                                <div key={i} className={`${item.color || 'text-white/80'} flex items-start gap-2 sm:gap-3 animate-in fade-in slide-in-from-left-2 duration-300`}>
                                    {getIcon(item.type)}
                                    <span className="leading-relaxed whitespace-normal break-words">{item.text}</span>
                                </div>
                            );
                        })}

                        {!showStatus && (
                            <div className="animate-pulse text-accent pl-6">_</div>
                        )}
                    </div>

                    {/* Final Status Box (Fixed at bottom or scrolls in?) - User requested separate Box */}
                    <div className={`mt-auto pt-4 transition-all duration-1000 ${showStatus ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

                        <div className="mb-4 text-white">
                            <div className="flex items-center gap-2 font-bold text-accent mb-2">
                                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                                DEFENSE STATUS: OPTIMAL
                            </div>
                        </div>

                        <div className="border border-white/20 bg-white/5 p-4 rounded text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-accent/5 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                            <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-[0.2em] mb-1">Protección Garantizada</div>
                            <div className="text-lg sm:text-2xl font-bold text-white tracking-wider leading-tight">
                                TUS DERECHOS EN LA <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">
                                    ERA DIGITAL
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DigitalTerminal;
