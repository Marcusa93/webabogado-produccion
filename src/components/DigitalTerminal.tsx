import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Lock, Cpu, Check, AlertTriangle, RefreshCw } from 'lucide-react';

interface DigitalTerminalProps {
    onComplete?: () => void;
}

const DigitalTerminal: React.FC<DigitalTerminalProps> = ({ onComplete }) => {
    const [displayedLines, setDisplayedLines] = useState<any[]>([]);
    const [scriptIndex, setScriptIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

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

    const scripts = [
        [
            { text: "> init_threat_detection --realtime_monitoring", type: 'command' },
            { text: "Escaneando entorno digital...", type: 'process', color: 'text-blue-300' },
            { text: "[INFO] Vulnerabilidades contractuales: 0", type: 'success', color: 'text-green-400' }
        ],
        [
            { text: "> analyzing_digital_assets...", type: 'command' },
            { text: "Verificando cadena de custodia...", type: 'process', color: 'text-yellow-200' },
            { text: "[SECURE] Evidencia digital preservada", type: 'success', color: 'text-green-400' }
        ],
        [
            { text: "> deploying_legal_shield --level: MAXIMUM", type: 'command' },
            { text: "Activando protocolos de defensa...", type: 'process', color: 'text-blue-300' },
            { text: "[OK] Protección de reputación online: ACTIVA", type: 'success', color: 'text-green-400' }
        ]
    ];

    // Typing Effect Logic
    useEffect(() => {
        let currentScript = scripts[scriptIndex];
        let lineIndex = 0;
        let charIndex = 0;
        let currentText = "";
        let isTyping = true;
        let timeoutId: NodeJS.Timeout;

        const type = () => {
            // Check if script finished
            if (lineIndex >= currentScript.length) {
                timeoutId = setTimeout(() => {
                    setDisplayedLines([]);
                    setScriptIndex(prev => (prev + 1) % scripts.length);
                }, 4000);
                return;
            }

            const targetLine = currentScript[lineIndex];

            if (isTyping) {
                if (charIndex < targetLine.text.length) {
                    currentText += targetLine.text[charIndex];
                    charIndex++;

                    setDisplayedLines(prev => {
                        const newLines = [...prev];
                        if (newLines[lineIndex]) {
                            newLines[lineIndex] = { ...targetLine, text: currentText };
                        } else {
                            newLines.push({ ...targetLine, text: currentText });
                        }
                        return newLines;
                    });

                    timeoutId = setTimeout(type, 20 + Math.random() * 30); // Faster typing
                } else {
                    isTyping = false;
                    lineIndex++;
                    charIndex = 0;
                    currentText = "";
                    timeoutId = setTimeout(type, 300);
                }
            } else {
                isTyping = true;
                type();
            }
        };

        setDisplayedLines([]);
        type();

        return () => clearTimeout(timeoutId);
    }, [scriptIndex]);


    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [displayedLines]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 min-h-[300px]">
            {/* Dark Overlay / Backdrop Filter Container */}
            <div className="w-full max-w-lg bg-[#0a0f1c]/90 backdrop-blur-md rounded-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden font-mono text-[9px] xs:text-[10px] sm:text-xs transform transition-all hover:scale-[1.005] duration-500 flex flex-col h-[340px] xs:h-[380px] sm:h-[420px] relative">

                {/* Background Noise/Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.5)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20" />
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />

                {/* Terminal Header */}
                <div className="bg-[#1a1f2e]/95 px-4 py-3 flex items-center justify-between border-b border-white/10 flex-shrink-0 relative z-10">
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
                <div ref={scrollRef} className="p-5 sm:p-7 flex-1 overflow-y-auto scrollbar-hide relative flex flex-col z-10">

                    <div className="space-y-3 font-mono pb-4">
                        {displayedLines.map((item, i) => (
                            <div key={i} className={`${item.color || 'text-white/90'} flex items-start gap-2 sm:gap-3`}>
                                {getIcon(item.type)}
                                <span className="leading-relaxed whitespace-normal break-words drop-shadow-md">{item.text}</span>
                            </div>
                        ))}
                        <div className="animate-pulse text-accent pl-6">_</div>
                    </div>

                    {/* Final Status Box fixed at bottom */}
                    <div className="mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 font-bold text-accent mb-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            SYSTEM STATUS: ONLINE
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DigitalTerminal;
