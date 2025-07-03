
-- Update the descargas table to include all new fields
ALTER TABLE public.descargas 
ADD COLUMN whatsapp text,
ADD COLUMN pais text,
ADD COLUMN situacion_actual jsonb DEFAULT '[]'::jsonb,
ADD COLUMN situacion_otra text,
ADD COLUMN actividad_proyecto text,
ADD COLUMN experiencia_nocode text,
ADD COLUMN tarea_automatizar text,
ADD COLUMN frustracion_ia text,
ADD COLUMN quiere_recursos jsonb DEFAULT '[]'::jsonb;

-- Remove the old pais_codigo column as we'll use the full country name now
ALTER TABLE public.descargas DROP COLUMN IF EXISTS pais_codigo;

-- Update the existing interes column to be actividad_proyecto if it exists
-- This is to maintain some backward compatibility
UPDATE public.descargas 
SET actividad_proyecto = interes 
WHERE interes IS NOT NULL AND actividad_proyecto IS NULL;

-- Remove the old interes column
ALTER TABLE public.descargas DROP COLUMN IF EXISTS interes;
