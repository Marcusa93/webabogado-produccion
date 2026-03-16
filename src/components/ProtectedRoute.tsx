import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            setShowAuthModal(true);
        }
    }, [loading, user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <Loader2 size={48} className="text-accent animate-spin mx-auto" />
                    <p className="text-foreground/60 font-medium">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={() => setShowAuthModal(false)}
                />
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="text-center max-w-md">
                        <h2 className="text-2xl font-black text-foreground mb-4">Acceso Restringido</h2>
                        <p className="text-foreground/60 mb-6">
                            Esta herramienta requiere autenticación. Por favor iniciá sesión para continuar.
                        </p>
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="px-8 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return <>{children}</>;
}
