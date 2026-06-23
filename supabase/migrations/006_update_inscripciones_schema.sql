-- Habilitar extensión pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Habilitar Row Level Security (RLS) en la nueva tabla inscripciones
ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;

-- 2. Crear políticas de RLS para la tabla inscripciones
DROP POLICY IF EXISTS "Permitir inscripciones publicas" ON public.inscripciones;
CREATE POLICY "Permitir inscripciones publicas"
  ON public.inscripciones
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 3. Recrear la tabla comentarios para alinearse con la columna id (BIGINT / BIGSERIAL) de la tabla inscripciones
-- NOTA: Se usa DROP TABLE para evitar errores de tipo si antes era UUID
DROP TABLE IF EXISTS public.comentarios CASCADE;

CREATE TABLE public.comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inscripcion_id BIGINT NOT NULL REFERENCES public.inscripciones(id) ON DELETE CASCADE,
  nombre_inscrito TEXT NOT NULL,
  comentario TEXT NOT NULL,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT comentarios_comentario_not_empty CHECK (LENGTH(TRIM(comentario)) > 0)
);

-- 4. Habilitar RLS en la tabla comentarios
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas de RLS para la tabla comentarios
CREATE POLICY "Permitir comentarios publicos"
  ON public.comentarios
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 6. Recrear las funciones RPC seguras ya que pudieron ser eliminadas en cascada o requerir compatibilidad de tipo
-- Recrear verificar_admin
CREATE OR REPLACE FUNCTION public.verificar_admin(p_usuario TEXT, p_contrasena TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_contrasena_hash VARCHAR(255);
  v_activo BOOLEAN;
BEGIN
  SELECT contrasena_hash, activo INTO v_contrasena_hash, v_activo
  FROM public.admin_credentials
  WHERE usuario = p_usuario;

  IF v_contrasena_hash IS NULL OR v_activo = FALSE THEN
    RETURN FALSE;
  END IF;

  RETURN v_contrasena_hash = crypt(p_contrasena, v_contrasena_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear obtener_inscripciones_admin (para coincidir con el tipo de retorno setof de la tabla inscripciones recreada)
CREATE OR REPLACE FUNCTION public.obtener_inscripciones_admin(
  p_usuario TEXT,
  p_contrasena TEXT,
  p_fecha_inicio TEXT DEFAULT NULL,
  p_fecha_fin TEXT DEFAULT NULL
)
RETURNS SETOF public.inscripciones AS $$
DECLARE
  v_valido BOOLEAN;
BEGIN
  SELECT public.verificar_admin(p_usuario, p_contrasena) INTO v_valido;
  IF NOT v_valido THEN
    RAISE EXCEPTION 'Usuario o contraseña incorrectos';
  END IF;

  RETURN QUERY
  SELECT *
  FROM public.inscripciones
  WHERE 
    (p_fecha_inicio IS NULL OR p_fecha_inicio = '' OR fecha_registro >= p_fecha_inicio::TIMESTAMPTZ)
    AND (p_fecha_fin IS NULL OR p_fecha_fin = '' OR fecha_registro < (p_fecha_fin::DATE + INTERVAL '1 day')::TIMESTAMPTZ)
  ORDER BY fecha_registro DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear obtener_comentarios_admin (para coincidir con el tipo de retorno setof de la tabla comentarios recreada)
CREATE OR REPLACE FUNCTION public.obtener_comentarios_admin(
  p_usuario TEXT,
  p_contrasena TEXT
)
RETURNS SETOF public.comentarios AS $$
DECLARE
  v_valido BOOLEAN;
BEGIN
  SELECT public.verificar_admin(p_usuario, p_contrasena) INTO v_valido;
  IF NOT v_valido THEN
    RAISE EXCEPTION 'Usuario o contraseña incorrectos';
  END IF;

  RETURN QUERY
  SELECT *
  FROM public.comentarios
  ORDER BY fecha_creacion DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
