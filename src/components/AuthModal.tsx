import { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'signup' | 'recovery'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === 'recovery') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/reset-password`
                });
                if (error) throw error;
                toast.success('Te enviamos un email para restablecer tu contraseña');
                setMode('login');
            } else if (mode === 'signup') {
                if (!fullName.trim()) {
                    toast.error('Por favor ingresá tu nombre completo');
                    setIsLoading(false);
                    return;
                }
                await signUp(email, password, fullName);
                toast.success('¡Cuenta creada! Por favor verificá tu email.');
                setMode('login');
            } else {
                await signIn(email, password);
                toast.success('¡Bienvenido!');
                onSuccess?.();
                onClose();
            }
        } catch (error: any) {
            toast.error(error.message || 'Ocurrió un error. Intentá nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setFullName('');
    };

    const handleModeChange = (newMode: 'login' | 'signup' | 'recovery') => {
        setMode(newMode);
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-card/95 backdrop-blur-xl border border-foreground/10 rounded-[2rem] shadow-2xl p-8 md:p-10"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-black text-foreground font-montserrat mb-2">
                            {mode === 'recovery' ? 'Restablecer Contraseña' : mode === 'signup' ? 'Crear Cuenta' : 'Iniciar Sesión'}
                        </h2>
                        <p className="text-foreground/60 text-sm">
                            {mode === 'recovery'
                                ? 'Te enviaremos un link para restablecer tu contraseña'
                                : mode === 'signup'
                                    ? 'Accedé a herramientas exclusivas'
                                    : 'Accedé a tu laboratorio digital'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <label className="text-xs font-black text-foreground/40 uppercase tracking-widest px-1">
                                    Nombre Completo
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Dr. Marco Rossi"
                                        className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground focus:ring-2 focus:ring-accent outline-none transition-all"
                                        required={mode === 'signup'}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black text-foreground/40 uppercase tracking-widest px-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground focus:ring-2 focus:ring-accent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {mode !== 'recovery' && (
                            <div className="space-y-2">
                                <label className="text-xs font-black text-foreground/40 uppercase tracking-widest px-1">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground focus:ring-2 focus:ring-accent outline-none transition-all"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Forgot Password Link */}
                        {mode === 'login' && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => handleModeChange('recovery')}
                                    className="text-xs text-accent hover:underline font-bold"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Magnetic>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-foreground text-background font-black rounded-xl text-sm uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Procesando...
                                    </>
                                ) : mode === 'recovery' ? (
                                    <>
                                        <KeyRound size={18} />
                                        Enviar Email
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        {mode === 'signup' ? 'Crear Cuenta' : 'Iniciar Sesión'}
                                    </>
                                )}
                            </button>
                        </Magnetic>
                    </form>

                    {/* Toggle Mode */}
                    <div className="mt-6 pt-6 border-t border-foreground/5 text-center">
                        {mode === 'recovery' ? (
                            <p className="text-sm text-foreground/60">
                                ¿Recordaste tu contraseña?{' '}
                                <button
                                    type="button"
                                    onClick={() => handleModeChange('login')}
                                    className="text-accent font-bold hover:underline"
                                >
                                    Iniciá sesión
                                </button>
                            </p>
                        ) : (
                            <p className="text-sm text-foreground/60">
                                {mode === 'signup' ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
                                <button
                                    type="button"
                                    onClick={() => handleModeChange(mode === 'signup' ? 'login' : 'signup')}
                                    className="text-accent font-bold hover:underline"
                                >
                                    {mode === 'signup' ? 'Iniciá sesión' : 'Creá una'}
                                </button>
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
