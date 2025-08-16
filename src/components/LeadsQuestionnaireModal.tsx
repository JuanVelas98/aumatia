
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ModernCheckbox } from "@/components/ui/modern-checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, ExternalLink } from "lucide-react";

interface LeadsQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  icp?: string;
}

const LATINOAMERICA_COUNTRIES = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica",
  "Cuba", "Ecuador", "El Salvador", "Guatemala", "Honduras", "México",
  "Nicaragua", "Panamá", "Paraguay", "Perú", "República Dominicana",
  "Uruguay", "Venezuela", "España", "Otro"
];

export const LeadsQuestionnaireModal = ({ isOpen, onClose, icp }: LeadsQuestionnaireModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    whatsapp: "",
    pais: "",
    situacion: [] as string[],
    situacion_otra: "",
    actividad: "",
    experiencia_nocode: "",
    tarea_automatizar: "",
    frustraciones: "",
    comunicacion_preferencias: [] as string[]
  });

  const situacionOptions = [
    "Tengo un negocio o emprendimiento",
    "Trabajo en una empresa",
    "Soy freelancer / independiente",
    "Estoy aprendiendo por mi cuenta",
    "Otro"
  ];

  const experienciaOptions = [
    "Nada, soy completamente nuevo",
    "Las conozco pero no las uso aún",
    "Las uso de forma básica",
    "Ya las uso bastante y quiero profundizar"
  ];

  const comunicacionOptions = [
    "Sí, por WhatsApp",
    "Sí, por correo",
    "No por ahora"
  ];

  const handleSituacionChange = (option: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      situacion: checked 
        ? [...prev.situacion, option]
        : prev.situacion.filter(item => item !== option)
    }));
  };

  const handleComunicacionChange = (option: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      comunicacion_preferencias: checked 
        ? [...prev.comunicacion_preferencias, option]
        : prev.comunicacion_preferencias.filter(item => item !== option)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.situacion.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos una opción en '¿En qué estás hoy?'",
        variant: "destructive",
      });
      return;
    }

    if (formData.comunicacion_preferencias.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos una opción de comunicación",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos para Supabase
      const consultaData = {
        nombre: formData.nombre,
        email: formData.email,
        whatsapp: formData.whatsapp,
        pais: formData.pais,
        situacion: formData.situacion,
        actividad: formData.actividad,
        experiencia_nocode: formData.experiencia_nocode,
        tarea_automatizar: formData.tarea_automatizar,
        frustraciones: formData.frustraciones,
        comunicacion_preferencias: formData.comunicacion_preferencias,
        icp_generado: icp || null
      };

      // Guardar en Supabase
      const { error } = await supabase
        .from('consultas')
        .insert(consultaData);

      if (error) {
        console.error('Error guardando en Supabase:', error);
        throw error;
      }

      // Enviar al webhook (si existe)
      try {
        const webhookData = {
          ...consultaData,
          timestamp: new Date().toISOString(),
          source: 'leads_questionnaire'
        };

        // Aquí puedes agregar la URL del webhook si la tienes
        // await fetch('TU_WEBHOOK_URL', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(webhookData)
        // });
      } catch (webhookError) {
        console.warn('Error enviando webhook:', webhookError);
        // No bloqueamos el flujo si falla el webhook
      }

      setIsCompleted(true);
      toast({
        title: "¡Formulario enviado!",
        description: "Tus datos han sido guardados correctamente",
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el formulario. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    window.open('https://drive.google.com/drive/folders/1KLY55kyaWjaOpuTUiJzMD6xD7ryJscBt?usp=sharing', '_blank');
  };

  const handleClose = () => {
    setIsCompleted(false);
    setFormData({
      nombre: "",
      email: "",
      whatsapp: "",
      pais: "",
      situacion: [],
      situacion_otra: "",
      actividad: "",
      experiencia_nocode: "",
      tarea_automatizar: "",
      frustraciones: "",
      comunicacion_preferencias: []
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-aumatia-dark">
            {isCompleted ? "¡Gracias por tu información!" : "Cuestionario para Generación de Leads"}
          </DialogTitle>
        </DialogHeader>

        {isCompleted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">¡Formulario completado!</h3>
            <p className="text-gray-600 mb-6">
              Gracias por compartir tu información. Ahora puedes acceder a nuestros recursos gratuitos.
            </p>
            <Button 
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 mb-4"
              size="lg"
            >
              <ExternalLink className="mr-2 w-5 h-5" />
              Descarga gratis
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre completo *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>País *</Label>
                <Select value={formData.pais} onValueChange={(value) => setFormData(prev => ({ ...prev, pais: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu país" />
                  </SelectTrigger>
                  <SelectContent>
                    {LATINOAMERICA_COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">¿En qué estás hoy? * (Selecciona todas las que apliquen)</Label>
              <div className="space-y-2">
                {situacionOptions.map((option) => (
                  <ModernCheckbox
                    key={option}
                    id={`situacion-${option}`}
                    checked={formData.situacion.includes(option)}
                    onCheckedChange={(checked) => handleSituacionChange(option, checked)}
                    label={option}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="actividad">¿Qué tipo de actividad, proyecto o industria manejas o te interesa? *</Label>
              <Textarea
                id="actividad"
                value={formData.actividad}
                onChange={(e) => setFormData(prev => ({ ...prev, actividad: e.target.value }))}
                placeholder="Describe tu actividad o industria..."
                required
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">¿Qué tanto has usado herramientas no-code o IA hasta ahora? *</Label>
              <RadioGroup
                value={formData.experiencia_nocode}
                onValueChange={(value) => setFormData(prev => ({ ...prev, experiencia_nocode: value }))}
              >
                {experienciaOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`exp-${option}`} />
                    <Label htmlFor={`exp-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="tarea">¿Qué tarea repetitiva te gustaría automatizar YA MISMO si pudieras? *</Label>
              <Textarea
                id="tarea"
                value={formData.tarea_automatizar}
                onChange={(e) => setFormData(prev => ({ ...prev, tarea_automatizar: e.target.value }))}
                placeholder="Describe la tarea que quieres automatizar..."
                required
              />
            </div>

            <div>
              <Label htmlFor="frustraciones">¿Qué es lo que más te frustra hoy de usar herramientas de IA o automatización? *</Label>
              <Textarea
                id="frustraciones"
                value={formData.frustraciones}
                onChange={(e) => setFormData(prev => ({ ...prev, frustraciones: e.target.value }))}
                placeholder="Comparte tus frustraciones..."
                required
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">¿Quieres recibir más recursos, plantillas y guías gratis? *</Label>
              <div className="space-y-2">
                {comunicacionOptions.map((option) => (
                  <ModernCheckbox
                    key={option}
                    id={`com-${option}`}
                    checked={formData.comunicacion_preferencias.includes(option)}
                    onCheckedChange={(checked) => handleComunicacionChange(option, checked)}
                    label={option}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-aumatia-blue hover:bg-aumatia-dark"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar y Obtener Recursos"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
