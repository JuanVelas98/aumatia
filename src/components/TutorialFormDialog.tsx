
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlatformEditor } from "@/components/PlatformEditor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tutorial } from "@/hooks/useRecursos";

interface Platform {
  nombre: string;
  link: string;
}

interface TutorialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTutorial: Tutorial | null;
  onSuccess: () => void;
}

export const TutorialFormDialog = ({ 
  open, 
  onOpenChange, 
  editingTutorial, 
  onSuccess 
}: TutorialFormDialogProps) => {
  const [tutorialForm, setTutorialForm] = useState({
    titulo: editingTutorial?.titulo || '',
    descripcion: editingTutorial?.descripcion || '',
    imagen_url: editingTutorial?.imagen_url || '',
    video_url: editingTutorial?.video_url || '',
    plataformas: editingTutorial?.plataformas || [] as Platform[]
  });

  // Update form when editingTutorial changes
  useState(() => {
    if (editingTutorial) {
      setTutorialForm({
        titulo: editingTutorial.titulo || '',
        descripcion: editingTutorial.descripcion || '',
        imagen_url: editingTutorial.imagen_url || '',
        video_url: editingTutorial.video_url || '',
        plataformas: Array.isArray(editingTutorial.plataformas) ? editingTutorial.plataformas : []
      });
    } else {
      setTutorialForm({
        titulo: '',
        descripcion: '',
        imagen_url: '',
        video_url: '',
        plataformas: []
      });
    }
  });

  const validateTutorialForm = () => {
    const errors = [];
    
    if (!tutorialForm.titulo.trim()) {
      errors.push("El título del tutorial es requerido");
    }
    
    if (!tutorialForm.video_url.trim()) {
      errors.push("La URL del video es requerida");
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting tutorial with form data:', tutorialForm);
    
    const validationErrors = validateTutorialForm();
    if (validationErrors.length > 0) {
      toast({
        title: "Error de validación",
        description: validationErrors.join(", "),
        variant: "destructive"
      });
      return;
    }

    try {
      const tutorialData = {
        titulo: tutorialForm.titulo.trim(),
        descripcion: tutorialForm.descripcion.trim() || null,
        imagen_url: tutorialForm.imagen_url.trim() || null,
        video_url: tutorialForm.video_url.trim(),
        plataformas: tutorialForm.plataformas.length > 0 ? JSON.parse(JSON.stringify(tutorialForm.plataformas)) : null
      };

      console.log('Sending tutorial data to Supabase:', tutorialData);

      let result;
      if (editingTutorial) {
        result = await supabase
          .from('tutoriales')
          .update(tutorialData)
          .eq('id', editingTutorial.id)
          .select();
      } else {
        result = await supabase
          .from('tutoriales')
          .insert(tutorialData)
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

      console.log('Tutorial saved successfully:', data);

      toast({
        title: "Éxito",
        description: editingTutorial ? "Tutorial actualizado correctamente" : "Tutorial creado correctamente"
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error saving tutorial:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el tutorial",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingTutorial ? 'Editar Tutorial' : 'Crear Nuevo Tutorial'}
          </DialogTitle>
          <DialogDescription>
            {editingTutorial ? 'Modifica los datos del tutorial' : 'Completa la información para crear un nuevo tutorial'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título del Tutorial *</Label>
            <Input
              id="titulo"
              value={tutorialForm.titulo}
              onChange={(e) => setTutorialForm({...tutorialForm, titulo: e.target.value})}
              placeholder="Título descriptivo del tutorial"
              required
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={tutorialForm.descripcion}
              onChange={(e) => setTutorialForm({...tutorialForm, descripcion: e.target.value})}
              placeholder="Describe de qué trata el tutorial..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="video_url">URL del Video *</Label>
              <Input
                id="video_url"
                value={tutorialForm.video_url}
                onChange={(e) => setTutorialForm({...tutorialForm, video_url: e.target.value})}
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
            <div>
              <Label htmlFor="imagen_url">URL de Imagen</Label>
              <Input
                id="imagen_url"
                value={tutorialForm.imagen_url}
                onChange={(e) => setTutorialForm({...tutorialForm, imagen_url: e.target.value})}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          <PlatformEditor
            platforms={tutorialForm.plataformas}
            onChange={(platforms) => setTutorialForm({...tutorialForm, plataformas: platforms})}
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
              {editingTutorial ? 'Actualizar Tutorial' : 'Crear Tutorial'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
