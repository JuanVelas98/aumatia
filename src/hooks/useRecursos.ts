
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Platform {
  nombre: string;
  link: string;
}

interface Paso {
  descripcion: string;
  codigo: string;
  videoUrl: string;
}

export interface Flujo {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  link_descarga: string | null;
  pasos: Paso[];
  plataformas: Platform[];
  visible: boolean;
  creado_en: string | null;
  actualizado_en: string | null;
}

export interface Tutorial {
  id: string;
  titulo: string;
  descripcion: string | null;
  imagen_url: string | null;
  video_url: string | null;
  plataformas: Platform[];
  creado_en: string | null;
  actualizado_en: string | null;
}

export const useRecursos = () => {
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [tutoriales, setTutoriales] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecursos = async () => {
    try {
      setLoading(true);
      
      const [flujosResponse, tutorialesResponse] = await Promise.all([
        supabase.from('flujos').select('*').order('creado_en', { ascending: false }),
        supabase.from('tutoriales').select('*').order('creado_en', { ascending: false })
      ]);

      if (flujosResponse.error) {
        console.error('Error fetching flujos:', flujosResponse.error);
        toast({
          title: "Error",
          description: `Error al cargar flujos: ${flujosResponse.error.message}`,
          variant: "destructive"
        });
      } else {
        const processedFlujos = flujosResponse.data.map(flujo => ({
          ...flujo,
          pasos: Array.isArray(flujo.pasos) ? flujo.pasos : (flujo.pasos ? JSON.parse(String(flujo.pasos)) : []),
          plataformas: Array.isArray(flujo.plataformas) ? flujo.plataformas : (flujo.plataformas ? JSON.parse(String(flujo.plataformas)) : [])
        }));
        setFlujos(processedFlujos);
      }

      if (tutorialesResponse.error) {
        console.error('Error fetching tutoriales:', tutorialesResponse.error);
        toast({
          title: "Error", 
          description: `Error al cargar tutoriales: ${tutorialesResponse.error.message}`,
          variant: "destructive"
        });
      } else {
        const processedTutoriales = tutorialesResponse.data.map(tutorial => ({
          ...tutorial,
          plataformas: Array.isArray(tutorial.plataformas) ? tutorial.plataformas : (tutorial.plataformas ? JSON.parse(String(tutorial.plataformas)) : [])
        }));
        setTutoriales(processedTutoriales);
      }
    } catch (error) {
      console.error('Error general:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al cargar los recursos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFlujoVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('flujos')
        .update({ visible: !currentVisibility })
        .eq('id', id);

      if (error) {
        console.error('Error updating flujo visibility:', error);
        toast({
          title: "Error",
          description: `No se pudo actualizar la visibilidad: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Éxito",
        description: `Flujo ${!currentVisibility ? 'mostrado' : 'ocultado'} en la página pública`
      });

      // Update local state
      setFlujos(prevFlujos => 
        prevFlujos.map(flujo => 
          flujo.id === id ? { ...flujo, visible: !currentVisibility } : flujo
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error toggling flujo visibility:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la visibilidad",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteFlujo = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este flujo?')) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('flujos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Flujo eliminado correctamente"
      });

      fetchRecursos();
      return true;
    } catch (error) {
      console.error('Error deleting flujo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el flujo",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteTutorial = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este tutorial?')) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('tutoriales')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Tutorial eliminado correctamente"
      });

      fetchRecursos();
      return true;
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el tutorial",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchRecursos();
  }, []);

  return {
    flujos,
    tutoriales,
    loading,
    fetchRecursos,
    toggleFlujoVisibility,
    deleteFlujo,
    deleteTutorial
  };
};
