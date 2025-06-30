
-- Crear tabla para registrar las descargas de flujos
CREATE TABLE IF NOT EXISTS public.descargas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL,
  celular TEXT NOT NULL,
  pais_codigo TEXT NOT NULL,
  flujo TEXT NOT NULL,
  interes TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS (Row Level Security) para la tabla descargas
ALTER TABLE public.descargas ENABLE ROW LEVEL SECURITY;

-- Crear política que permite insertar datos públicamente (para el formulario)
CREATE POLICY "Permitir inserción pública en descargas" 
  ON public.descargas 
  FOR INSERT 
  WITH CHECK (true);

-- Crear política que permite leer solo a usuarios autenticados (para admin)
CREATE POLICY "Solo usuarios autenticados pueden leer descargas" 
  ON public.descargas 
  FOR SELECT 
  USING (auth.role() = 'authenticated');
