
-- Agregar campo 'visible' a la tabla flujos para controlar visibilidad en página pública
ALTER TABLE public.flujos 
ADD COLUMN visible BOOLEAN NOT NULL DEFAULT true;

-- Crear trigger para actualizar 'actualizado_en' cuando cambie la visibilidad
CREATE TRIGGER trigger_update_flujos_updated_at
  BEFORE UPDATE ON public.flujos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
