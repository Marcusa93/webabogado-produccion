import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ChevronLeft, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import Magnetic from '@/components/Magnetic';

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isSignUp) {
                if (!fullName.trim()) {
                    toast.error('Por favor ingresá tu nombre completo');
                    setIsLoading(false);
                    return;
                }
                await signUp(email, password, fullName);
                toast.success('¡Cuenta creada! Por favor verificá tu email.');
            } else {
                await signIn(email, password);
                toast.success('¡Bienvenido de vuelta!');
                navigate('/herramientas/cotio');
            }
        } catch (error: any) {
            toast.error(error.message || 'Ocurrió un error. Intentá nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen noise-overlay bg-background">
            <CustomCursor />
            <Navigation />

            <main className="section-container pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                <div className="max-w-md mx-auto">
                    {/* Back button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors font-bold text-xs uppercase tracking-widest mb-8 group"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Volver al inicio
                        </Link>
                    </motion.div>

                    {/* Auth Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative p-8 md:p-10 rounded-[2rem] bg-card/50 border border-foreground/10 backdrop-blur-xl shadow-2xl"
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
                                <ShieldCheck size={14} className="text-accent" />
                                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Acceso Seguro</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-foreground font-montserrat mb-2">
                                {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
                            </h1>
                            <p className="text-foreground/60 font-medium">
                                {isSignUp
                                    ? 'Accedé a herramientas exclusivas de Legal-Tech'
                                    : 'Accedé a tu laboratorio digital jurídico'}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {isSignUp && (
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
                                            className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
                                            required={isSignUp}
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
                                        className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

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
                                        className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <Magnetic>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-foreground text-background font-black rounded-xl text-sm uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-glow disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={18} />
                                            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
                                        </>
                                    )}
                                </button>
                            </Magnetic>
                        </form>

                        {/* Toggle */}
                        <div className="mt-6 pt-6 border-t border-foreground/5 text-center">
                            <p className="text-sm text-foreground/60">
                                {isSignUp ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-accent font-bold hover:underline"
                                >
                                    {isSignUp ? 'Iniciá sesión' : 'Creá una'}
                                </button>
                            </p>
                        </div>

                        {/* Footer note */}
                        <p className="mt-8 text-center text-[10px] text-foreground/30 uppercase tracking-widest font-bold">
                            Conexión segura mediante Supabase Auth
                        </p>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
