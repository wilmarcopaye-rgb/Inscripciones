-- Habilitar extensión pgcrypto para hashing de contraseñas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Asegurar seguridad en admin_credentials
-- Eliminar política de lectura pública previa
DROP POLICY IF EXISTS "allow_read_admin_credentials" ON public.admin_credentials;

-- Migrar contraseñas existentes a hash bcrypt si no están ya encriptadas (los hashes bcrypt empiezan por $2)
UPDATE public.admin_credentials
SET contrasena_hash = crypt(contrasena_hash, gen_salt('bf'))
WHERE contrasena_hash NOT LIKE '$2%';

-- 2. Función segura para verificar credenciales de administrador (ejecutada con privilegios del definidor)
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

  -- Compara la contraseña en texto plano con el hash guardado
  RETURN v_contrasena_hash = crypt(p_contrasena, v_contrasena_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Función segura para obtener inscripciones desde el panel de administración
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

-- 4. Función segura para obtener comentarios desde el panel de administración
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

-- 5. Configurar seguridad en la nueva tabla estudiantes
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;

-- Permitir consultar estudiantes de forma pública para la detección automática
CREATE POLICY "Permitir consulta publica de estudiantes"
  ON public.estudiantes
  FOR SELECT
  TO anon, authenticated
  USING (true);
