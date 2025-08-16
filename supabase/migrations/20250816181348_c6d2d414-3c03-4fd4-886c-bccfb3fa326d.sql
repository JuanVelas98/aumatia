
-- Actualizar la tabla consultas para que coincida con los nuevos campos requeridos
ALTER TABLE public.consultas 
  ALTER COLUMN nombre SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN whatsapp SET NOT NULL,
  ALTER COLUMN pais SET NOT NULL,
  ALTER COLUMN situacion SET NOT NULL,
  ALTER COLUMN actividad SET NOT NULL,
  ALTER COLUMN experiencia_nocode SET NOT NULL,
  ALTER COLUMN tarea_automatizar SET NOT NULL,
  ALTER COLUMN frustraciones SET NOT NULL;

-- Agregar columna para las preferencias de comunicación si no existe
ALTER TABLE public.consultas 
  ADD COLUMN IF NOT EXISTS comunicacion_preferencias jsonb DEFAULT '[]'::jsonb;

-- Actualizar valores por defecto para campos existentes
ALTER TABLE public.consultas 
  ALTER COLUMN whatsapp SET DEFAULT '',
  ALTER COLUMN frustraciones SET DEFAULT '';

-- Asegurar que las políticas RLS permitan inserción pública
DROP POLICY IF EXISTS "Permitir inserción pública en consultas" ON public.consultas;
CREATE POLICY "Permitir inserción pública en consultas" 
  ON public.consultas 
  FOR INSERT 
  WITH CHECK (true);
