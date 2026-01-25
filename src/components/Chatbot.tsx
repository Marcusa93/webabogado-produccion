import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight, User } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    options?: Option[];
    timestamp: Date;
}

interface Option {
    label: string;
    action: () => void;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [showTooltip, setShowTooltip] = useState(false);

    // Show proactive tooltip after delay
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) {
                setShowTooltip(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setShowTooltip(false); // Hide tooltip when opened
            setIsTyping(true);
            setTimeout(() => {
                setMessages([
                    {
                        id: '1',
                        text: "¡Hola! Soy el asistente virtual de Marco. 🤖\n¿En qué puedo ayudarte hoy?",
                        sender: 'bot',
                        timestamp: new Date(),
                        options: [
                            { label: "Servicios", action: () => handleOption("Servicios") },
                            { label: "Honorarios", action: () => handleOption("Honorarios") },
                            { label: "Ubicación", action: () => handleOption("Ubicación") },
                            { label: "Agendar Consulta", action: () => handleOption("Agendar Consulta") }
                        ]
                    }
                ]);
                setIsTyping(false);
            }, 1000);
        }
    }, [isOpen]);

    const addUserMessage = (text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const addBotMessage = (text: string, options?: Option[]) => {
        setIsTyping(true);
        setTimeout(() => {
            const newMessage: Message = {
                id: (Date.now() + 1).toString(),
                text,
                sender: 'bot',
                options,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newMessage]);
            setIsTyping(false);
        }, 800 + Math.random() * 500); // Natural delay
    };

    const handleOption = (optionLabel: string) => {
        addUserMessage(optionLabel);

        // Decision Tree Logic
        switch (optionLabel) {
            case "Servicios":
                addBotMessage(
                    "Nos especializamos en Derecho Digital e IA. Áreas principales:\n\n• Defensa de Influencers\n• Startups y Apps\n• Ciberdelitos\n• Contratos IT",
                    [
                        { label: "Ver más detalles", action: () => { window.location.href = "#especialidades"; setIsOpen(false); } },
                        { label: "Hablar con Marco", action: () => handleOption("Hablar con Marco") },
                        { label: "Volver", action: () => handleOption("Inicio") }
                    ]
                );
                break;

            case "Honorarios":
                addBotMessage(
                    "Cada caso es único. Ofrecemos una **Consulta Inicial Estratégica** para evaluar tu situación y cotizar a medida.",
                    [
                        { label: "Agendar Consulta", action: () => handleOption("Agendar Consulta") },
                        { label: "Volver", action: () => handleOption("Inicio") }
                    ]
                );
                break;

            case "Ubicación":
                addBotMessage(
                    "Nuestra base está en Tucumán, Argentina 🇦🇷, pero trabajamos de forma 100% digital para clientes de todo el mundo.",
                    [
                        { label: "Volver", action: () => handleOption("Inicio") }
                    ]
                );
                break;

            case "Agendar Consulta":
            case "Hablar con Marco":
                addBotMessage(
                    "¡Perfecto! La vía más rápida es contactarme directamente. ¿Qué prefieres?",
                    [
                        { label: "WhatsApp Directo", action: () => window.open('https://wa.me/5493813007791', '_blank') },
                        { label: "Enviar Email", action: () => window.open('mailto:dr.marcorossi9@gmail.com', '_blank') },
                        { label: "Volver", action: () => handleOption("Inicio") }
                    ]
                );
                break;

            case "Inicio":
                addBotMessage(
                    "¿En qué más puedo ayudarte?",
                    [
                        { label: "Servicios", action: () => handleOption("Servicios") },
                        { label: "Honorarios", action: () => handleOption("Honorarios") },
                        { label: "Ubicación", action: () => handleOption("Ubicación") },
                        { label: "Agendar Consulta", action: () => handleOption("Agendar Consulta") }
                    ]
                );
                break;
        }
    };

    return (
        <div className="fixed bottom-4 right-20 sm:bottom-8 sm:right-28 z-50 flex flex-col items-end pointer-events-none">

            {/* Chat Window */}
            <div
                className={`pointer-events-auto bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl w-[320px] sm:w-[380px] h-[500px] max-h-[80vh] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right mb-4 ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-10 pointer-events-none hidden'
                    }`}
            >
                {/* Header */}
                <div className="p-4 bg-accent/90 text-white flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <User size={16} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Asistente Virtual</h3>
                            <div className="flex items-center gap-1.5 opacity-80">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] font-medium uppercase tracking-wider">En línea</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-foreground/10">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div
                                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.sender === 'user'
                                    ? 'bg-accent text-white rounded-tr-none'
                                    : 'bg-card border border-foreground/5 text-foreground rounded-tl-none'
                                    }`}
                            >
                                {msg.text}
                            </div>

                            {/* Options Buttons */}
                            {msg.options && (
                                <div className="flex flex-wrap gap-2 mt-3 animate-in fade-in zoom-in duration-300 delay-150">
                                    {msg.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={option.action}
                                            className="px-4 py-2 bg-foreground/5 hover:bg-accent hover:text-white border border-foreground/10 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <span className="text-[10px] text-foreground/30 mt-1 px-1">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-center gap-1 p-3 bg-card border border-foreground/5 rounded-2xl rounded-tl-none w-fit animate-in fade-in">
                            <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Placeholder (Visual only, since it's option-based) */}
                <div className="p-3 border-t border-foreground/5 bg-background/50">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-foreground/5 rounded-xl border border-foreground/10 opacity-50 cursor-not-allowed">
                        <input
                            disabled
                            type="text"
                            placeholder="Selecciona una opción..."
                            className="bg-transparent border-none outline-none text-sm w-full cursor-not-allowed"
                        />
                        <Send size={16} />
                    </div>
                </div>
            </div>

            {/* Proactive Tooltip */}
            <div
                className={`absolute right-[70px] bottom-[15px] bg-card text-foreground px-4 py-2 rounded-xl rounded-tr-none shadow-lg border border-foreground/10 whitespace-nowrap transition-all duration-500 origin-bottom-right ${showTooltip && !isOpen ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 translate-x-4 pointer-events-none'
                    }`}
            >
                <p className="text-xs font-bold">👋 ¿Te puedo ayudar?</p>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative ${isOpen ? 'bg-card text-foreground rotate-90' : 'bg-gradient-to-r from-accent to-blue-600 text-white'
                    }`}
            >
                {isOpen ? <ChevronRight size={24} /> : <MessageCircle size={28} />}

                {/* Notification Badge */}
                {!isOpen && messages.length === 0 && (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </button>
        </div>
    );
}
