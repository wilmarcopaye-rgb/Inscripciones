-- Tabla principal de inscripciones del movimiento estudiantil
-- Ejecutar en el SQL Editor de Supabase o via CLI

CREATE TABLE IF NOT EXISTS public.inscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  dni TEXT NOT NULL,
  codigo_matricula TEXT NOT NULL,
  telefono TEXT NOT NULL,
  carrera TEXT NOT NULL,
  voto_todos_juntos BOOLEAN NOT NULL DEFAULT FALSE,
  voto_estudiantil BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT inscripciones_dni_unique UNIQUE (dni),
  CONSTRAINT inscripciones_codigo_matricula_unique UNIQUE (codigo_matricula),
  CONSTRAINT inscripciones_telefono_unique UNIQUE (telefono),
  CONSTRAINT inscripciones_preferencia_check CHECK (
    (voto_todos_juntos = TRUE AND voto_estudiantil = FALSE)
    OR (voto_todos_juntos = FALSE AND voto_estudiantil = TRUE)
  )
);

-- Índices para consultas futuras del panel administrativo
CREATE INDEX IF NOT EXISTS idx_inscripciones_fecha_registro
  ON public.inscripciones (fecha_registro DESC);

CREATE INDEX IF NOT EXISTS idx_inscripciones_carrera
  ON public.inscripciones (carrera);

-- Row Level Security: preparado para producción
ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;

-- Política pública: solo INSERT (inscripciones desde la landing)
-- SELECT/UPDATE/DELETE quedarán reservados para el panel admin futuro
CREATE POLICY "Permitir inscripciones publicas"
  ON public.inscripciones
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Revocar acceso de lectura pública (admin usará service_role o políticas autenticadas)
-- No se crea política SELECT para anon/authenticated

COMMENT ON TABLE public.inscripciones IS 'Registro de estudiantes inscritos al movimiento estudiantil';
