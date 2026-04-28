import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Trash2, ChevronRight, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface HistoryEntry {
    id: string;
    input_prompt: string;
    document_type: string | null;
    jurisdiction: string | null;
    output_result: string;
    created_at: string;
}

interface CotioHistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectEntry: (entry: HistoryEntry) => void;
}

export default function CotioHistoryPanel({ isOpen, onClose, onSelectEntry }: CotioHistoryPanelProps) {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !user) return;

        // AbortController evita race conditions cuando el panel se abre/cierra rápido:
        // si la fetch anterior responde después del cleanup, descartamos su resultado.
        const controller = new AbortController();
        let cancelled = false;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('cotio_history')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(50)
                    .abortSignal(controller.signal);

                if (cancelled) return;
                if (error) throw error;
                setHistory(data || []);
            } catch (err: any) {
                if (cancelled || err?.name === 'AbortError') return;
                console.error('Error fetching history:', err);
                toast.error('Error al cargar el historial');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchHistory();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [isOpen, user]);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const { error } = await supabase
                .from('cotio_history')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setHistory(history.filter(h => h.id !== id));
            toast.success('Entrada eliminada');
        } catch (err) {
            console.error('Error deleting entry:', err);
            toast.error('Error al eliminar');
        } finally {
            setDeletingId(null);
        }
    };

    const handleClearAll = async () => {
        if (!user) return;

        const confirmed = window.confirm('¿Estás seguro de que querés borrar todo el historial?');
        if (!confirmed) return;

        try {
            const { error } = await supabase
                .from('cotio_history')
                .delete()
                .eq('user_id', user.id);

            if (error) throw error;

            setHistory([]);
            toast.success('Historial eliminado');
        } catch (err) {
            console.error('Error clearing history:', err);
            toast.error('Error al limpiar historial');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateText = (text: string, maxLength: number = 80) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-card/95 backdrop-blur-xl border-l border-foreground/10 shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-foreground/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent/10 rounded-xl">
                                    <Clock size={20} className="text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-foreground">Historial</h3>
                                    <p className="text-xs text-foreground/40 font-medium">
                                        {history.length} {history.length === 1 ? 'entrada' : 'entradas'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 size={32} className="text-accent animate-spin" />
                                </div>
                            ) : history.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <FileText size={48} className="text-foreground/20 mb-4" />
                                    <p className="text-foreground/60 font-medium">No hay historial todavía</p>
                                    <p className="text-foreground/40 text-sm mt-1">
                                        Tus prompts optimizados aparecerán aquí
                                    </p>
                                </div>
                            ) : (
                                history.map((entry, index) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="group relative p-4 bg-foreground/[0.03] hover:bg-foreground/[0.06] border border-foreground/5 rounded-xl cursor-pointer transition-all"
                                        onClick={() => onSelectEntry(entry)}
                                    >
                                        {/* Date badge */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                                                {formatDate(entry.created_at)}
                                            </span>
                                            {entry.document_type && (
                                                <span className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase">
                                                    {entry.document_type}
                                                </span>
                                            )}
                                        </div>

                                        {/* Preview text */}
                                        <p className="text-sm text-foreground/80 font-medium leading-relaxed mb-3">
                                            {truncateText(entry.input_prompt)}
                                        </p>

                                        {/* Footer with jurisdiction */}
                                        <div className="flex items-center justify-between">
                                            {entry.jurisdiction && (
                                                <span className="text-[10px] text-foreground/30 font-medium">
                                                    {entry.jurisdiction}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2 ml-auto">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(entry.id);
                                                    }}
                                                    disabled={deletingId === entry.id}
                                                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-foreground/40 hover:text-red-500 transition-all"
                                                >
                                                    {deletingId === entry.id ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={14} />
                                                    )}
                                                </button>
                                                <ChevronRight size={16} className="text-foreground/30 group-hover:text-accent transition-colors" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {history.length > 0 && (
                            <div className="p-4 border-t border-foreground/10">
                                <button
                                    onClick={handleClearAll}
                                    className="w-full py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Borrar Historial
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
