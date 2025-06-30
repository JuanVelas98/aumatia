
import { useEffect, useRef } from 'react';
import { useEventTracking } from './useEventTracking';

interface UseScrollVisibilityProps {
  descripcion: string;
  recurso_id?: string;
  threshold?: number;
}

export const useScrollVisibility = ({ 
  descripcion, 
  recurso_id, 
  threshold = 0.5 
}: UseScrollVisibilityProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasBeenVisible = useRef(false);
  const { registrarEvento } = useEventTracking();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisible.current) {
          hasBeenVisible.current = true;
          registrarEvento({
            tipo_evento: 'scroll_visible',
            descripcion,
            recurso_id
          });
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [descripcion, recurso_id, threshold, registrarEvento]);

  return ref;
};
