import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type ActivityAction = 'page_view' | 'tool_use' | 'login' | 'logout';
type ToolName = 'cotio' | 'hasheador' | 'admin' | 'home' | 'auth';

interface LogActivityOptions {
    action: ActivityAction;
    toolName: ToolName;
    metadata?: Record<string, unknown>;
}

export async function logActivity({ action, toolName, metadata = {} }: LogActivityOptions) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // No user logged in, skipping activity log
            return;
        }

        const { error } = await supabase.from('activity_log').insert({
            user_id: user.id,
            user_email: user.email || 'unknown',
            action,
            tool_name: toolName,
            metadata,
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        });

        if (error) {
            console.error('Error logging activity:', error);
        }
    } catch (err) {
        console.error('Failed to log activity:', err);
    }
}

export function useActivityTracker(toolName: ToolName) {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            logActivity({
                action: 'page_view',
                toolName,
                metadata: {
                    url: window.location.pathname,
                    timestamp: new Date().toISOString(),
                }
            });
        }
    }, [user, toolName]);
}
