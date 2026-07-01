-- ============================================================
-- PEGAR Y EJECUTAR EN: Supabase → SQL Editor → Run
-- FIX: cast explícito a TEXT en todas las columnas VARCHAR
-- ============================================================

DROP FUNCTION IF EXISTS public.consultar_local_votacion(TEXT);

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
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.nombre::TEXT              AS alumno_nombre,
    i.dni::TEXT                 AS alumno_dni,
    i.carrera::TEXT             AS alumno_carrera,
    m.mesa,
    m.posicion,
    m.local_votacion::TEXT
  FROM mesas_estudiantes m
  LEFT JOIN inscripciones i
         ON TRIM(i.codigo_matricula) = TRIM(m.codigo)
  WHERE TRIM(m.codigo) = TRIM(p_codigo)
  LIMIT 1;
END;
$$;

-- TEST: reemplaza con un código real de tu tabla
-- SELECT * FROM consultar_local_votacion('214996');
