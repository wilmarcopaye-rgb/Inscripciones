-- ============================================================
-- MIGRACIÓN 008 — Tabla de mesas de votación (estudiantes)
-- Estructura exacta usada en producción
-- ============================================================
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────
-- Eliminar función RPC anterior si existía
-- ─────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.consultar_local_votacion(TEXT);

-- ─────────────────────────────────────────────
-- TABLA: mesas_estudiantes
--
-- Reglas de negocio:
--   · mesa           → SE REPITE   (varios alumnos comparten la misma mesa)
--   · posicion       → SE REPITE   (cada mesa tiene posición 1, 2, 3…)
--   · local_votacion → SE REPITE   (muchos alumnos votan en el mismo local)
--   · codigo         → NO se repite (cada alumno tiene un código único de 6 dígitos)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mesas_estudiantes (
    id             SERIAL       PRIMARY KEY,
    mesa           INTEGER      NOT NULL,
    posicion       INTEGER      NOT NULL,
    local_votacion VARCHAR(100) NOT NULL,
    codigo         VARCHAR(6)   NOT NULL
);

-- Índice por código para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_mesas_est_codigo
  ON public.mesas_estudiantes (codigo);

COMMENT ON TABLE  public.mesas_estudiantes IS 'Mesa y local de votación asignados a cada estudiante';
COMMENT ON COLUMN public.mesas_estudiantes.mesa           IS 'Número de mesa — se repite (varios alumnos por mesa)';
COMMENT ON COLUMN public.mesas_estudiantes.posicion       IS 'Posición en la lista — se repite entre mesas distintas';
COMMENT ON COLUMN public.mesas_estudiantes.local_votacion IS 'Nombre del local — se repite (muchos alumnos por local)';
COMMENT ON COLUMN public.mesas_estudiantes.codigo         IS 'Código del estudiante (6 dígitos) — no se repite';

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- La tabla no se expone directamente; solo vía RPC SECURITY DEFINER
-- ─────────────────────────────────────────────
ALTER TABLE public.mesas_estudiantes ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- FUNCIÓN RPC: consultar_local_votacion
--
-- Recibe el código de 6 dígitos del estudiante.
-- Busca en mesas_estudiantes y hace LEFT JOIN con inscripciones
-- para obtener los datos personales del alumno.
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.consultar_local_votacion(p_codigo TEXT)
RETURNS TABLE (
  alumno_nombre   TEXT,
  alumno_dni      TEXT,
  alumno_carrera  TEXT,
  mesa            INTEGER,
  posicion        INTEGER,
  local_votacion  TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.nombre              AS alumno_nombre,
    i.dni                 AS alumno_dni,
    i.carrera             AS alumno_carrera,
    m.mesa,
    m.posicion,
    m.local_votacion::TEXT
  FROM public.mesas_estudiantes m
  LEFT JOIN public.inscripciones i
         ON TRIM(i.codigo_matricula) = TRIM(m.codigo)
  WHERE TRIM(m.codigo) = TRIM(p_codigo)
  LIMIT 1;
END;
$$;

COMMENT ON FUNCTION public.consultar_local_votacion IS
  'Dado el código de 6 dígitos, devuelve mesa + posición + local + datos personales del alumno';

-- ─────────────────────────────────────────────
-- DATOS REALES DE EJEMPLO
-- ─────────────────────────────────────────────
-- INSERT INTO public.mesas_estudiantes (mesa, posicion, local_votacion, codigo) VALUES
-- (101, 1, 'CEPREUNA', '214996'),
-- (101, 2, 'CEPREUNA', '220126'),
-- (101, 3, 'CEPREUNA', '215992'),
-- (101, 4, 'CEPREUNA', '260022');
