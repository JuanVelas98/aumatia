
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

interface EventData {
  tipo_evento: 'descarga' | 'formulario_enviado' | 'click' | 'paso_completado' | 'tiempo' | 'scroll_visible';
  pagina?: string;
  recurso_id?: string;
  descripcion?: string;
  tiempo_segundos?: number;
  paso_numero?: number;
}

export const useEventTracking = () => {
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());

  // Función principal para registrar eventos
  const registrarEvento = async (data: EventData) => {
    try {
      const eventoCompleto = {
        ...data,
        pagina: data.pagina || location.pathname,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        creado_en: new Date().toISOString()
      };

      const { error } = await supabase
        .from('eventos_usuarios')
        .insert(eventoCompleto);

      if (error) {
        console.error('Error al registrar evento:', error);
      } else {
        console.log('Evento registrado:', eventoCompleto.tipo_evento);
      }
    } catch (error) {
      console.error('Error inesperado al registrar evento:', error);
    }
  };

  // Registrar tiempo en página al salir
  useEffect(() => {
    const handleBeforeUnload = () => {
      const tiempoEnPagina = Math.round((Date.now() - startTimeRef.current) / 1000);
      
      if (tiempoEnPagina > 5) { // Solo registrar si estuvo más de 5 segundos
        registrarEvento({
          tipo_evento: 'tiempo',
          tiempo_segundos: tiempoEnPagina
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location.pathname]);

  // Reiniciar tiempo al cambiar de página
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [location.pathname]);

  return { registrarEvento };
};
