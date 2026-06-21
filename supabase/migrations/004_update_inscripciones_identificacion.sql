-- Actualizar tabla inscripciones para permitir DNI o Código de Matrícula
-- Permite que uno u otro sea NULL, pero al menos uno debe estar presente

-- Primero, eliminar las restricciones UNIQUE que no serán necesarias
ALTER TABLE public.inscripciones
DROP CONSTRAINT IF EXISTS inscripciones_dni_unique,
DROP CONSTRAINT IF EXISTS inscripciones_codigo_matricula_unique;

-- Cambiar los campos a NULLABLE y VARCHAR(255) para más flexibilidad
ALTER TABLE public.inscripciones
ALTER COLUMN dni DROP NOT NULL,
ALTER COLUMN codigo_matricula DROP NOT NULL;

-- Cambiar el tipo de datos a VARCHAR
ALTER TABLE public.inscripciones
ALTER COLUMN dni TYPE VARCHAR(255),
ALTER COLUMN codigo_matricula TYPE VARCHAR(255);

-- Establecer los valores por defecto a NULL
UPDATE public.inscripciones 
SET dni = NULL 
WHERE dni = '';

UPDATE public.inscripciones 
SET codigo_matricula = NULL 
WHERE codigo_matricula = '';

-- Agregar restricción para asegurar que al menos uno está presente
ALTER TABLE public.inscripciones
ADD CONSTRAINT inscripciones_identificacion_check 
CHECK (dni IS NOT NULL OR codigo_matricula IS NOT NULL);

-- Crear índices para mejorar búsquedas por DNI (cuando está presente)
CREATE INDEX IF NOT EXISTS idx_inscripciones_dni 
ON public.inscripciones (dni) 
WHERE dni IS NOT NULL;

-- Crear índices para mejorar búsquedas por código de matrícula (cuando está presente)
CREATE INDEX IF NOT EXISTS idx_inscripciones_codigo_matricula 
ON public.inscripciones (codigo_matricula) 
WHERE codigo_matricula IS NOT NULL;
