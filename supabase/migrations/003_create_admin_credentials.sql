-- Tabla para credenciales del admin
-- Ejecutar en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id BIGSERIAL PRIMARY KEY,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  contrasena_hash VARCHAR(255) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  ultima_actualizacion TIMESTAMP DEFAULT NOW()
);

-- Índice para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_admin_credentials_usuario
  ON public.admin_credentials (usuario);

-- Insertar credencial por defecto (usuario: admin, contraseña: admin123)
-- IMPORTANTE: Cambiar esta contraseña en producción
INSERT INTO public.admin_credentials (usuario, contrasena_hash, activo)
VALUES ('admin', 'admin123', TRUE)
ON CONFLICT (usuario) DO NOTHING;

-- Row Level Security
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- Política de lectura (solo anon para login, en producción usar auth más segura)
CREATE POLICY "allow_read_admin_credentials" ON public.admin_credentials
  FOR SELECT TO anon, authenticated USING (TRUE);

COMMENT ON TABLE public.admin_credentials IS 'Credenciales de administrador para acceso al panel';
