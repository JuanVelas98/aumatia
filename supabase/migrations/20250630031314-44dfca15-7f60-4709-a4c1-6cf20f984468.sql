
-- Agregar el campo plataformas a la tabla flujos
ALTER TABLE public.flujos 
ADD COLUMN plataformas JSONB DEFAULT '[]'::jsonb;

-- Agregar el campo plataformas a la tabla tutoriales  
ALTER TABLE public.tutoriales
ADD COLUMN plataformas JSONB DEFAULT '[]'::jsonb;

-- Agregar comentarios para documentar el campo
COMMENT ON COLUMN public.flujos.plataformas IS 'Array de objetos JSON con plataformas usadas: [{"nombre": "n8n", "link": "https://n8n.io"}]';
COMMENT ON COLUMN public.tutoriales.plataformas IS 'Array de objetos JSON con plataformas usadas: [{"nombre": "n8n", "link": "https://n8n.io"}]';
