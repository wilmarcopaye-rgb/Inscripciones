-- ============================================================
-- MIGRACIÓN 007 — Sistema de Locales y Mesas de Votación
-- ============================================================
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────
-- TABLA 1: Locales de votación (Dónde se vota)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.locales_votacion (
  id            SERIAL PRIMARY KEY,
  nombre_local  TEXT NOT NULL,
  direccion     TEXT NOT NULL,
  referencia    TEXT,                              -- Descripción adicional de cómo llegar
  lat           DECIMAL(10, 7),                    -- Latitud para Google Maps
  lng           DECIMAL(10, 7),                    -- Longitud para Google Maps
  foto_url      TEXT,                              -- URL o ruta de la foto de referencia (ej: /Puerta.jpg)
  horario       TEXT NOT NULL DEFAULT '8:00am - 5:00pm',
  activo        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.locales_votacion IS 'Locales físicos donde se llevará a cabo la votación estudiantil';
COMMENT ON COLUMN public.locales_votacion.lat IS 'Latitud geográfica para embeber en Google Maps';
COMMENT ON COLUMN public.locales_votacion.lng IS 'Longitud geográfica para embeber en Google Maps';
COMMENT ON COLUMN public.locales_votacion.foto_url IS 'Path o URL de la foto de referencia del local (ej: /Puerta.jpg o URL externa)';

-- ─────────────────────────────────────────────
-- TABLA 2: Mesas de votación (En qué mesa se vota)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mesas_votacion (
  id               SERIAL PRIMARY KEY,
  numero_mesa      TEXT NOT NULL,                          -- Ej: "Mesa 01", "Mesa A", "001"
  local_id         INTEGER NOT NULL
                     REFERENCES public.locales_votacion(id) ON DELETE RESTRICT,
  codigo_matricula TEXT UNIQUE
                     REFERENCES public.inscripciones(codigo_matricula) ON DELETE SET NULL,
  observaciones    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.mesas_votacion IS 'Mesas de votación, cada una pertenece a un local y puede tener asignado un estudiante';
COMMENT ON COLUMN public.mesas_votacion.numero_mesa IS 'Identificador de la mesa (ej: Mesa 01, A-01, 001)';
COMMENT ON COLUMN public.mesas_votacion.local_id IS 'Local físico donde se ubica esta mesa';
COMMENT ON COLUMN public.mesas_votacion.codigo_matricula IS 'Código de matrícula del estudiante asignado a esta mesa';

-- ─────────────────────────────────────────────
-- ÍNDICES de rendimiento
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_mesas_local_id
  ON public.mesas_votacion (local_id);

CREATE INDEX IF NOT EXISTS idx_mesas_codigo_matricula
  ON public.mesas_votacion (codigo_matricula);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE public.locales_votacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mesas_votacion   ENABLE ROW LEVEL SECURITY;

-- Solo admins (service_role) pueden insertar/modificar
-- La consulta pública se hace a través de la función RPC SECURITY DEFINER

-- Permitir SELECT público en locales (para el mapa de referencia)
DROP POLICY IF EXISTS "Lectura publica locales" ON public.locales_votacion;
CREATE POLICY "Lectura publica locales"
  ON public.locales_votacion
  FOR SELECT
  TO anon, authenticated
  USING (activo = TRUE);

-- Mesas: NO select directo — solo vía RPC (protege la privacidad cruzada)
-- (no se crean políticas SELECT para mesas_votacion)

-- ─────────────────────────────────────────────
-- FUNCIÓN RPC: consultar_local_votacion
-- Recibe el código de matrícula y devuelve todos los datos necesarios
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.consultar_local_votacion(p_codigo TEXT)
RETURNS TABLE (
  -- Datos del inscrito (de la tabla inscripciones)
  alumno_nombre     TEXT,
  alumno_dni        TEXT,
  alumno_carrera    TEXT,
  alumno_telefono   TEXT,
  -- Datos de la mesa
  numero_mesa       TEXT,
  -- Datos del local
  nombre_local      TEXT,
  direccion         TEXT,
  referencia        TEXT,
  lat               DECIMAL,
  lng               DECIMAL,
  foto_url          TEXT,
  horario           TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.nombre          AS alumno_nombre,
    i.dni             AS alumno_dni,
    i.carrera         AS alumno_carrera,
    i.telefono        AS alumno_telefono,
    m.numero_mesa,
    l.nombre_local,
    l.direccion,
    l.referencia,
    l.lat,
    l.lng,
    l.foto_url,
    l.horario
  FROM public.inscripciones i
  JOIN public.mesas_votacion  m ON m.codigo_matricula = i.codigo_matricula
  JOIN public.locales_votacion l ON l.id = m.local_id
  WHERE UPPER(TRIM(i.codigo_matricula)) = UPPER(TRIM(p_codigo))
    AND l.activo = TRUE;
END;
$$;

COMMENT ON FUNCTION public.consultar_local_votacion IS
  'Dado un código de matrícula, retorna los datos del inscrito + mesa + local de votación asignados';

-- ─────────────────────────────────────────────
-- DATOS DE EJEMPLO (para pruebas — eliminar antes de producción)
-- ─────────────────────────────────────────────
-- PASO 1: Inserta un local de ejemplo
-- INSERT INTO public.locales_votacion (nombre_local, direccion, referencia, lat, lng, foto_url, horario)
-- VALUES (
--   'Pabellón Central UNAP',
--   'Jr. 2 de Mayo Nro. 808, Iquitos, Loreto',
--   'Ingreso principal frente a la plaza de armas de la UNAP',
--   -3.7491200,
--   -73.2543300,
--   '/unap.png',
--   '8:00am - 5:00pm'
-- );

-- PASO 2: Inserta una mesa y asigna un código de matrícula
-- INSERT INTO public.mesas_votacion (numero_mesa, local_id, codigo_matricula)
-- VALUES ('Mesa 01', 1, 'TU-CODIGO-AQUI');
