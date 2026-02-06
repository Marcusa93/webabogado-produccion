import { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

// Google Icon Component
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

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
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const { signIn, signUp, signInWithGoogle } = useAuth();

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

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signInWithGoogle();
            // The user will be redirected to Google, so we don't need to do anything else here
        } catch (error: any) {
            toast.error(error.message || 'Error al conectar con Google');
            setIsGoogleLoading(false);
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

                    {/* Google Sign In Button - Only show for login/signup */}
                    {mode !== 'recovery' && (
                        <>
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isGoogleLoading}
                                className="w-full py-4 bg-white text-gray-800 font-bold rounded-xl 
                                         flex items-center justify-center gap-3 border border-gray-200 
                                         hover:bg-gray-50 hover:shadow-md transition-all shadow-sm
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGoogleLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Conectando...
                                    </>
                                ) : (
                                    <>
                                        <GoogleIcon />
                                        Continuar con Google
                                    </>
                                )}
                            </button>

                            {/* Separator */}
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-foreground/10" />
                                <span className="text-xs text-foreground/40 font-bold uppercase tracking-widest">O</span>
                                <div className="flex-1 h-px bg-foreground/10" />
                            </div>
                        </>
                    )}

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
