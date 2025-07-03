
-- Crear el trigger para actualizar automáticamente el campo actualizado_en en la tabla flujos
CREATE OR REPLACE TRIGGER update_flujos_updated_at
    BEFORE UPDATE ON public.flujos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Crear el trigger para actualizar automáticamente el campo actualizado_en en la tabla tutoriales  
CREATE OR REPLACE TRIGGER update_tutoriales_updated_at
    BEFORE UPDATE ON public.tutoriales
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
