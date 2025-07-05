
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlatformEditor } from "@/components/PlatformEditor";
import { StepEditor } from "@/components/StepEditor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Flujo } from "@/hooks/useRecursos";

interface Platform {
  nombre: string;
  link: string;
}

interface Paso {
  descripcion: string;
  codigo: string;
  videoUrl: string;
}

interface FlujoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFlujo: Flujo | null;
  onSuccess: () => void;
}

export const FlujoFormDialog = ({ 
  open, 
  onOpenChange, 
  editingFlujo, 
  onSuccess 
}: FlujoFormDialogProps) => {
  const [flujoForm, setFlujoForm] = useState({
    nombre: editingFlujo?.nombre || '',
    descripcion: editingFlujo?.descripcion || '',
    imagen_url: editingFlujo?.imagen_url || '',
    link_descarga: editingFlujo?.link_descarga || '',
    pasos: editingFlujo?.pasos || [] as Paso[],
    plataformas: editingFlujo?.plataformas || [] as Platform[]
  });

  // Update form when editingFlujo changes
  useState(() => {
    if (editingFlujo) {
      setFlujoForm({
        nombre: editingFlujo.nombre || '',
        descripcion: editingFlujo.descripcion || '',
        imagen_url: editingFlujo.imagen_url || '',
        link_descarga: editingFlujo.link_descarga || '',
        pasos: Array.isArray(editingFlujo.pasos) ? editingFlujo.pasos : [],
        plataformas: Array.isArray(editingFlujo.plataformas) ? editingFlujo.plataformas : []
      });
    } else {
      setFlujoForm({
        nombre: '',
        descripcion: '',
        imagen_url: '',
        link_descarga: '',
        pasos: [],
        plataformas: []
      });
    }
  });

  const validateFlujoForm = () => {
    const errors = [];
    
    if (!flujoForm.nombre.trim()) {
      errors.push("El nombre del flujo es requerido");
    }
    
    if (flujoForm.pasos.length > 0) {
      flujoForm.pasos.forEach((paso, index) => {
        if (!paso.descripcion.trim()) {
          errors.push(`La descripción del paso ${index + 1} es requerida`);
        }
      });
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting flujo with form data:', flujoForm);
    
    const validationErrors = validateFlujoForm();
    if (validationErrors.length > 0) {
      toast({
        title: "Error de validación",
        description: validationErrors.join(", "),
        variant: "destructive"
      });
      return;
    }

    try {
      const flujoData = {
        nombre: flujoForm.nombre.trim(),
        descripcion: flujoForm.descripcion.trim() || null,
        imagen_url: flujoForm.imagen_url.trim() || null,
        link_descarga: flujoForm.link_descarga.trim() || null,
        pasos: flujoForm.pasos.length > 0 ? JSON.parse(JSON.stringify(flujoForm.pasos)) : null,
        plataformas: flujoForm.plataformas.length > 0 ? JSON.parse(JSON.stringify(flujoForm.plataformas)) : null
      };

      console.log('Sending flujo data to Supabase:', flujoData);

      let result;
      if (editingFlujo) {
        result = await supabase
          .from('flujos')
          .update(flujoData)
          .eq('id', editingFlujo.id)
          .select();
      } else {
        result = await supabase
          .from('flujos')
          .insert(flujoData)
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error('Supabase error:', error);
        let errorMessage = `Error de base de datos: ${error.message}`;
        if (error.details) {
          errorMessage += ` - Detalles: ${error.details}`;
        }
        if (error.hint) {
          errorMessage += ` - Sugerencia: ${error.hint}`;
        }
        throw new Error(errorMessage);
      }

      console.log('Flujo saved successfully:', data);

      toast({
        title: "Éxito",
        description: editingFlujo ? "Flujo actualizado correctamente" : "Flujo creado correctamente"
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error saving flujo:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el flujo",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingFlujo ? 'Editar Flujo' : 'Crear Nuevo Flujo'}
          </DialogTitle>
          <DialogDescription>
            {editingFlujo ? 'Modifica los datos del flujo' : 'Completa la información para crear un nuevo flujo'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre del Flujo *</Label>
              <Input
                id="nombre"
                value={flujoForm.nombre}
                onChange={(e) => setFlujoForm({...flujoForm, nombre: e.target.value})}
                placeholder="Nombre descriptivo del flujo"
                required
              />
            </div>
            <div>
              <Label htmlFor="imagen_url">URL de Imagen</Label>
              <Input
                id="imagen_url"
                value={flujoForm.imagen_url}
                onChange={(e) => setFlujoForm({...flujoForm, imagen_url: e.target.value})}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={flujoForm.descripcion}
              onChange={(e) => setFlujoForm({...flujoForm, descripcion: e.target.value})}
              placeholder="Describe qué hace este flujo..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="link_descarga">Link de Descarga</Label>
            <Input
              id="link_descarga"
              value={flujoForm.link_descarga}
              onChange={(e) => setFlujoForm({...flujoForm, link_descarga: e.target.value})}
              placeholder="https://drive.google.com/..."
            />
          </div>

          <StepEditor
            steps={flujoForm.pasos}
            onChange={(steps) => setFlujoForm({...flujoForm, pasos: steps})}
          />

          <PlatformEditor
            platforms={flujoForm.plataformas}
            onChange={(platforms) => setFlujoForm({...flujoForm, plataformas: platforms})}
          />

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {editingFlujo ? 'Actualizar Flujo' : 'Crear Flujo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
