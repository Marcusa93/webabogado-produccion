-- =====================================================
-- SUPABASE MIGRATION — contact_requests
-- Tabla para almacenar consultas enviadas desde el form
-- de contacto del sitio público.
-- =====================================================
--
-- INSERTS solo via service_role (desde api/contact.ts).
-- No se exponen lecturas al cliente; el dashboard de
-- Supabase y un futuro panel admin usan service_role.
-- =====================================================

CREATE TABLE public.contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  mensaje TEXT NOT NULL,
  origen TEXT NOT NULL DEFAULT 'web_form',
  ip_hash TEXT,
  user_agent TEXT,
  estado TEXT NOT NULL DEFAULT 'nuevo'
    CHECK (estado IN ('nuevo', 'leido', 'respondido', 'spam'))
);

-- RLS: bloquea anon y authenticated. Solo service_role escribe/lee.
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Sin policies para anon/authenticated → inserts y selects bloqueados
-- desde el cliente. service_role bypasea RLS por diseño.

-- Índices para el panel admin futuro
CREATE INDEX idx_contact_requests_created_at
  ON public.contact_requests(created_at DESC);
CREATE INDEX idx_contact_requests_estado
  ON public.contact_requests(estado);

-- =====================================================
-- LISTO. Ejecutar este archivo desde:
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =====================================================
