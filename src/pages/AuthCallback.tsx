import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Procesando autenticación...');
    const resolvedRef = useRef(false);

    useEffect(() => {
        // Cancellation handles for cleanup + race protection
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        let redirectTimeoutId: ReturnType<typeof setTimeout> | undefined;
        let subscription: { unsubscribe: () => void } | undefined;

        const resolveSuccess = () => {
            if (resolvedRef.current) return;
            resolvedRef.current = true;
            if (timeoutId) clearTimeout(timeoutId);
            subscription?.unsubscribe();
            setStatus('success');
            setMessage('¡Autenticación exitosa! Redirigiendo...');
            redirectTimeoutId = setTimeout(() => navigate('/herramientas/cotio'), 1500);
        };

        const resolveError = (msg: string) => {
            if (resolvedRef.current) return;
            resolvedRef.current = true;
            if (timeoutId) clearTimeout(timeoutId);
            subscription?.unsubscribe();
            setStatus('error');
            setMessage(msg);
            redirectTimeoutId = setTimeout(() => navigate('/'), 3000);
        };

        const handleCallback = async () => {
            try {
                // Check for error in URL params
                const error = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                if (error) {
                    resolveError(errorDescription || 'Error en la autenticación');
                    return;
                }

                // Get the session - Supabase handles the code exchange automatically
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    throw sessionError;
                }

                if (session) {
                    resolveSuccess();
                    return;
                }

                // No session yet, listen for auth state change
                const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
                    if (event === 'SIGNED_IN' && newSession) {
                        resolveSuccess();
                    }
                });
                subscription = data.subscription;

                // Timeout after 10 seconds
                timeoutId = setTimeout(() => {
                    resolveError('Tiempo de espera agotado. Intentá nuevamente.');
                }, 10000);
            } catch (err: any) {
                console.error('Auth callback error:', err);
                resolveError(err?.message || 'Error al procesar la autenticación');
            }
        };

        handleCallback();

        // Cleanup on unmount: cancel pending timers and subscription
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (redirectTimeoutId) clearTimeout(redirectTimeoutId);
            subscription?.unsubscribe();
        };
    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 max-w-md"
            >
                {/* Status Icon */}
                <div className="flex justify-center">
                    {status === 'loading' && (
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
                            <Loader2 size={64} className="text-accent animate-spin relative z-10" />
                        </div>
                    )}
                    {status === 'success' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <CheckCircle size={64} className="text-emerald-500" />
                        </motion.div>
                    )}
                    {status === 'error' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <XCircle size={64} className="text-red-500" />
                        </motion.div>
                    )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-foreground font-montserrat">
                        {status === 'loading' && 'Verificando...'}
                        {status === 'success' && '¡Bienvenido!'}
                        {status === 'error' && 'Error'}
                    </h2>
                    <p className="text-foreground/60">{message}</p>
                </div>

                {/* Progress indicator for loading state */}
                {status === 'loading' && (
                    <div className="w-48 h-1 mx-auto bg-foreground/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-accent rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3, ease: 'easeInOut' }}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
}
