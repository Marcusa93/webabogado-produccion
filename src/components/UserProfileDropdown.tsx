import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, History, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserProfileDropdown() {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!user) return null;

    const getInitials = () => {
        const name = user.user_metadata?.full_name || user.email;
        return name
            ?.split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setIsOpen(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-indigo-600 flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform shadow-lg"
            >
                {getInitials()}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl bg-card/95 backdrop-blur-xl border border-foreground/10 shadow-2xl overflow-hidden z-50"
                    >
                        {/* User Info */}
                        <div className="p-4 border-b border-foreground/5">
                            <p className="text-sm font-bold text-foreground truncate">
                                {user.user_metadata?.full_name || 'Usuario'}
                            </p>
                            <p className="text-xs text-foreground/40 truncate mt-1">
                                {user.email}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            <Link
                                to="/herramientas/cotio"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-foreground/5 transition-colors text-foreground/70 hover:text-foreground"
                            >
                                <History size={16} />
                                <span className="text-sm font-medium">Historial</span>
                            </Link>

                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors text-red-500 hover:text-red-600 mt-2"
                            >
                                <LogOut size={16} />
                                <span className="text-sm font-medium">Cerrar Sesión</span>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-foreground/5 bg-foreground/[0.02]">
                            <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold text-center">
                                Cuenta Verificada
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
