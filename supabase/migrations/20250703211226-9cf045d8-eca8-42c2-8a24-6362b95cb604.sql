
-- Corregir la función de trigger para usar 'actualizado_en' en lugar de 'updated_at'
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.actualizado_en := NOW();
    RETURN NEW;
END;
$function$
