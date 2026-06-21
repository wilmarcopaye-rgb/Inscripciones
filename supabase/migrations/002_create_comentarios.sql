-- Tabla para almacenar comentarios de inscriptos
-- Ejecutar en el SQL Editor de Supabase o via CLI

CREATE TABLE IF NOT EXISTS public.comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inscripcion_id UUID NOT NULL REFERENCES public.inscripciones(id) ON DELETE CASCADE,
  nombre_inscrito TEXT NOT NULL,
  comentario TEXT NOT NULL,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT comentarios_comentario_not_empty CHECK (LENGTH(TRIM(comentario)) > 0)
);

-- Índices para consultas futuras
CREATE INDEX IF NOT EXISTS idx_comentarios_inscripcion_id
  ON public.comentarios (inscripcion_id);

CREATE INDEX IF NOT EXISTS idx_comentarios_fecha_creacion
  ON public.comentarios (fecha_creacion DESC);

-- Row Level Security
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;

-- Política pública: solo INSERT (comentarios desde la landing)
CREATE POLICY "Permitir comentarios publicos"
  ON public.comentarios
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

COMMENT ON TABLE public.comentarios IS 'Comentarios dejados por estudiantes inscritos al movimiento';
