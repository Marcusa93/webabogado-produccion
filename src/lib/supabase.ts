import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// En producción, faltar las env vars es un fallo de config crítico:
// el usuario vería pantallas rotas con errores genéricos. Mejor fallar
// explícito en build/run para forzar la corrección.
if (!isConfigured) {
    const message = '[Supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
        'Configurá las env vars en Vercel/Netlify (o en .env local) antes de iniciar la app.';

    if (import.meta.env.PROD) {
        // Producción: error visible — el resto de la app no debería arrancar.
        throw new Error(message);
    } else {
        // Desarrollo: warn ruidoso, pero permitimos seguir para casos como
        // levantar el front sin auth/DB.
        console.warn(message);
    }
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true // Important for OAuth callback
        }
    }
);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = isConfigured;
