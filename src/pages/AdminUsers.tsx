import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Users,
    Search,
    Shield,
    User,
    Mail,
    Phone,
    Clock,
    MoreVertical,
    Loader2,
    X,
    Crown,
    UserCog
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import type { UserProfile } from '@/contexts/AuthContext';

export default function AdminUsers() {
    const navigate = useNavigate();
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingRole, setUpdatingRole] = useState(false);

    // Redirect if not admin
    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) {
            toast.error('No tenés permisos para acceder a esta página');
            navigate('/');
        }
    }, [user, isAdmin, authLoading, navigate]);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            if (!isAdmin) return;

            try {
                const { data, error } = await supabase
                    .from('users_profile')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setUsers(data || []);
            } catch (err: any) {
                console.error('Error fetching users:', err);
                toast.error('Error al cargar usuarios');
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin]);

    // Filter users based on search
    const filteredUsers = users.filter(u =>
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone_whatsapp && u.phone_whatsapp.includes(searchQuery))
    );

    // Toggle user role
    const handleToggleRole = async (targetUser: UserProfile) => {
        if (targetUser.id === user?.id) {
            toast.error('No podés cambiar tu propio rol');
            return;
        }

        setUpdatingRole(true);
        const newRole = targetUser.role === 'admin' ? 'user' : 'admin';

        try {
            const { error } = await supabase
                .from('users_profile')
                .update({ role: newRole })
                .eq('id', targetUser.id);

            if (error) throw error;

            setUsers(users.map(u =>
                u.id === targetUser.id ? { ...u, role: newRole } : u
            ));

            if (selectedUser?.id === targetUser.id) {
                setSelectedUser({ ...selectedUser, role: newRole });
            }

            toast.success(`Usuario actualizado a ${newRole === 'admin' ? 'Administrador' : 'Usuario'}`);
        } catch (err: any) {
            console.error('Error updating role:', err);
            toast.error('Error al actualizar el rol');
        } finally {
            setUpdatingRole(false);
        }
    };

    // Update user WhatsApp
    const handleUpdateWhatsApp = async (targetUser: UserProfile, phone: string) => {
        try {
            const { error } = await supabase
                .from('users_profile')
                .update({ phone_whatsapp: phone })
                .eq('id', targetUser.id);

            if (error) throw error;

            setUsers(users.map(u =>
                u.id === targetUser.id ? { ...u, phone_whatsapp: phone } : u
            ));

            if (selectedUser?.id === targetUser.id) {
                setSelectedUser({ ...selectedUser, phone_whatsapp: phone });
            }

            toast.success('WhatsApp actualizado');
        } catch (err: any) {
            console.error('Error updating WhatsApp:', err);
            toast.error('Error al actualizar WhatsApp');
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Nunca';
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 size={48} className="text-accent animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen noise-overlay bg-background selection:bg-accent/30">
            <CustomCursor />
            <Navigation />

            <main className="section-container pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10" />
                <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors font-bold text-xs uppercase tracking-widest mb-12 group"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Volver al inicio
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
                            <Shield size={14} className="text-accent" />
                            <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">Panel de Administración</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black font-montserrat tracking-tight mb-4">
                            Gestión de <span className="text-accent">Usuarios</span>
                        </h1>
                        <p className="text-foreground/60 text-lg max-w-2xl">
                            Administrá los usuarios registrados en el Kit de Clientes.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <div className="relative max-w-md">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar por nombre, email o teléfono..."
                                className="w-full pl-12 pr-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                            />
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    >
                        <div className="p-4 bg-card/40 border border-foreground/10 rounded-2xl backdrop-blur-sm">
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Total Usuarios</p>
                            <p className="text-2xl font-black text-foreground">{users.length}</p>
                        </div>
                        <div className="p-4 bg-card/40 border border-foreground/10 rounded-2xl backdrop-blur-sm">
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Administradores</p>
                            <p className="text-2xl font-black text-accent">{users.filter(u => u.role === 'admin').length}</p>
                        </div>
                        <div className="p-4 bg-card/40 border border-foreground/10 rounded-2xl backdrop-blur-sm">
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Usuarios</p>
                            <p className="text-2xl font-black text-foreground">{users.filter(u => u.role === 'user').length}</p>
                        </div>
                        <div className="p-4 bg-card/40 border border-foreground/10 rounded-2xl backdrop-blur-sm">
                            <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Resultados</p>
                            <p className="text-2xl font-black text-foreground">{filteredUsers.length}</p>
                        </div>
                    </motion.div>

                    {/* Users Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card/40 border border-foreground/10 rounded-2xl backdrop-blur-xl overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-foreground/10">
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Usuario</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest hidden md:table-cell">WhatsApp</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest hidden lg:table-cell">Último Acceso</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Rol</th>
                                        <th className="text-right px-6 py-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u, index) => (
                                        <motion.tr
                                            key={u.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                            className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${u.role === 'admin' ? 'bg-accent/20' : 'bg-foreground/10'}`}>
                                                        {u.role === 'admin' ? (
                                                            <Crown size={18} className="text-accent" />
                                                        ) : (
                                                            <User size={18} className="text-foreground/60" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground">{u.full_name || 'Sin nombre'}</p>
                                                        <p className="text-xs text-foreground/50">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="text-sm text-foreground/60">
                                                    {u.phone_whatsapp || '—'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className="text-sm text-foreground/60">
                                                    {formatDate(u.last_access)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${u.role === 'admin'
                                                        ? 'bg-accent/20 text-accent'
                                                        : 'bg-foreground/10 text-foreground/60'
                                                    }`}>
                                                    {u.role === 'admin' ? 'Admin' : 'Usuario'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(u);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
                                                >
                                                    <MoreVertical size={18} className="text-foreground/60" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredUsers.length === 0 && (
                                <div className="text-center py-12">
                                    <Users size={48} className="mx-auto text-foreground/20 mb-4" />
                                    <p className="text-foreground/60">No se encontraron usuarios</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* User Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-card/95 backdrop-blur-xl border border-foreground/10 rounded-[2rem] shadow-2xl p-8"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute right-4 top-4 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-8">
                                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${selectedUser.role === 'admin' ? 'bg-accent/20' : 'bg-foreground/10'
                                    }`}>
                                    {selectedUser.role === 'admin' ? (
                                        <Crown size={32} className="text-accent" />
                                    ) : (
                                        <User size={32} className="text-foreground/60" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-black text-foreground font-montserrat">
                                    {selectedUser.full_name || 'Sin nombre'}
                                </h3>
                                <p className="text-foreground/60">{selectedUser.email}</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 p-4 bg-foreground/5 rounded-xl">
                                    <Mail size={18} className="text-foreground/40" />
                                    <div>
                                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Email</p>
                                        <p className="text-foreground font-medium">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-foreground/5 rounded-xl">
                                    <Phone size={18} className="text-foreground/40" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">WhatsApp</p>
                                        <input
                                            type="text"
                                            defaultValue={selectedUser.phone_whatsapp || ''}
                                            placeholder="+54 9 11 1234-5678"
                                            onBlur={(e) => {
                                                if (e.target.value !== selectedUser.phone_whatsapp) {
                                                    handleUpdateWhatsApp(selectedUser, e.target.value);
                                                }
                                            }}
                                            className="w-full bg-transparent text-foreground font-medium outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-foreground/5 rounded-xl">
                                    <Clock size={18} className="text-foreground/40" />
                                    <div>
                                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Último acceso</p>
                                        <p className="text-foreground font-medium">{formatDate(selectedUser.last_access)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-foreground/5 rounded-xl">
                                    <UserCog size={18} className="text-foreground/40" />
                                    <div>
                                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Registrado</p>
                                        <p className="text-foreground font-medium">{formatDate(selectedUser.created_at)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Role Toggle */}
                            <button
                                onClick={() => handleToggleRole(selectedUser)}
                                disabled={updatingRole || selectedUser.id === user?.id}
                                className={`w-full py-4 font-black rounded-xl text-sm uppercase tracking-widest transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-3 ${selectedUser.role === 'admin'
                                        ? 'bg-foreground/10 text-foreground hover:bg-red-500/20 hover:text-red-400'
                                        : 'bg-accent text-white hover:bg-accent/80'
                                    }`}
                            >
                                {updatingRole ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Actualizando...
                                    </>
                                ) : selectedUser.role === 'admin' ? (
                                    <>
                                        <User size={18} />
                                        Quitar Admin
                                    </>
                                ) : (
                                    <>
                                        <Crown size={18} />
                                        Hacer Admin
                                    </>
                                )}
                            </button>

                            {selectedUser.id === user?.id && (
                                <p className="text-center text-xs text-foreground/40 mt-4">
                                    No podés cambiar tu propio rol
                                </p>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
