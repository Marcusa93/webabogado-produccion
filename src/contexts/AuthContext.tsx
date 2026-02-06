import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// User profile type matching the database schema
export interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    phone_whatsapp: string | null;
    role: 'admin' | 'user';
    last_access: string | null;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    userProfile: UserProfile | null;
    loading: boolean;
    isAdmin: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, fullName: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from database
    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('users_profile')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }

            // Update last access
            await supabase
                .from('users_profile')
                .update({ last_access: new Date().toISOString() })
                .eq('id', userId);

            return data as UserProfile;
        } catch (err) {
            console.error('Profile fetch error:', err);
            return null;
        }
    };

    const refreshProfile = async () => {
        if (user) {
            const profile = await fetchUserProfile(user.id);
            setUserProfile(profile);
        }
    };

    useEffect(() => {
        // Safe check for supabase client
        if (!supabase || !supabase.auth) {
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession()
            .then(async ({ data: { session } }) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    const profile = await fetchUserProfile(session.user.id);
                    setUserProfile(profile);
                }
            })
            .catch(err => {
                console.error('Auth initialization error:', err);
            })
            .finally(() => {
                setLoading(false);
            });

        // Listen for auth changes
        try {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    const profile = await fetchUserProfile(session.user.id);
                    setUserProfile(profile);
                } else {
                    setUserProfile(null);
                }
            });
            return () => subscription.unsubscribe();
        } catch (err) {
            console.error('Auth listener error:', err);
            setLoading(false);
        }
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error) throw error;
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        });
        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUserProfile(null);
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user) throw new Error('No user logged in');

        const { error } = await supabase
            .from('users_profile')
            .update(updates)
            .eq('id', user.id);

        if (error) throw error;

        // Refresh the profile
        await refreshProfile();
    };

    const value = {
        user,
        session,
        userProfile,
        loading,
        isAdmin: userProfile?.role === 'admin',
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateProfile,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
