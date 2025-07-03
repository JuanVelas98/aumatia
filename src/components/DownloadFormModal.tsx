
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Download, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  correo: z.string().email('Ingresa un correo electrónico válido'),
  whatsapp: z.string().optional(),
  pais: z.string().min(1, 'Selecciona un país'),
  flujo: z.string(),
  situacion_actual: z.array(z.string()).min(1, 'Selecciona al menos una opción'),
  situacion_otra: z.string().optional(),
  actividad_proyecto: z.string().min(1, 'Este campo es obligatorio').max(200, 'Máximo 200 caracteres'),
  experiencia_nocode: z.string().min(1, 'Selecciona una opción'),
  tarea_automatizar: z.string().min(1, 'Este campo es obligatorio').max(350, 'Máximo 350 caracteres'),
  frustracion_ia: z.string().min(1, 'Este campo es obligatorio').max(400, 'Máximo 400 caracteres'),
  quiere_recursos: z.array(z.string()).min(1, 'Selecciona al menos una opción'),
});

type FormData = z.infer<typeof formSchema>;

interface DownloadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  flujoNombre: string;
  linkDescarga: string;
}

const countries = [
  'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Antigua y Barbuda', 'Arabia Saudí', 'Argelia', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaiyán', 'Bahamas', 'Bahrein', 'Bangladesh', 'Barbados', 'Bélgica', 'Belice', 'Benín',
  'Bielorrusia', 'Bolivia', 'Bosnia y Herzegovina', 'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Bután',
  'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'Catar', 'Chad', 'Chile', 'China', 'Chipre', 'Colombia',
  'Comoras', 'Congo', 'Corea del Norte', 'Corea del Sur', 'Costa Rica', 'Costa de Marfil', 'Croacia', 'Cuba', 'Dinamarca', 'Dominica',
  'Ecuador', 'Egipto', 'El Salvador', 'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia', 'Eslovenia', 'España', 'Estados Unidos', 'Estonia',
  'Etiopía', 'Fiji', 'Filipinas', 'Finlandia', 'Francia', 'Gabón', 'Gambia', 'Georgia', 'Ghana', 'Granada',
  'Grecia', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guinea Ecuatorial', 'Guyana', 'Haití', 'Honduras', 'Hungría', 'India',
  'Indonesia', 'Irak', 'Irán', 'Irlanda', 'Islandia', 'Israel', 'Italia', 'Jamaica', 'Japón', 'Jordania',
  'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati', 'Kuwait', 'Laos', 'Lesoto', 'Letonia', 'Líbano', 'Liberia',
  'Libia', 'Liechtenstein', 'Lituania', 'Luxemburgo', 'Macedonia del Norte', 'Madagascar', 'Malasia', 'Malaui', 'Maldivas', 'Malí',
  'Malta', 'Marruecos', 'Mauricio', 'Mauritania', 'México', 'Micronesia', 'Moldavia', 'Mónaco', 'Mongolia', 'Montenegro',
  'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Níger', 'Nigeria', 'Noruega', 'Nueva Zelanda',
  'Omán', 'Países Bajos', 'Pakistán', 'Palaos', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polonia', 'Portugal',
  'Reino Unido', 'República Centroafricana', 'República Checa', 'República Democrática del Congo', 'República Dominicana', 'Ruanda', 'Rumania', 'Rusia', 'Samoa', 'San Cristóbal y Nieves',
  'San Marino', 'San Vicente y las Granadinas', 'Santa Lucía', 'Santo Tomé y Príncipe', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur', 'Siria',
  'Somalia', 'Sri Lanka', 'Suazilandia', 'Sudáfrica', 'Sudán', 'Sudán del Sur', 'Suecia', 'Suiza', 'Surinam', 'Tailandia',
  'Tanzania', 'Tayikistán', 'Timor Oriental', 'Togo', 'Tonga', 'Trinidad y Tobago', 'Túnez', 'Turkmenistán', 'Turquía', 'Tuvalu',
  'Ucrania', 'Uganda', 'Uruguay', 'Uzbekistán', 'Vanuatu', 'Vaticano', 'Venezuela', 'Vietnam', 'Yemen', 'Yibuti',
  'Zambia', 'Zimbabue'
];

const situacionOptions = [
  'Tengo un negocio o emprendimiento',
  'Trabajo en una empresa',
  'Soy freelancer / independiente',
  'Estoy aprendiendo por mi cuenta',
  'Otro'
];

const experienciaOptions = [
  'Nada, soy completamente nuevo',
  'Las conozco pero no las uso aún',
  'Las uso de forma básica',
  'Ya las uso bastante y quiero profundizar'
];

const recursosOptions = [
  'Sí, por WhatsApp',
  'Sí, por correo',
  'No por ahora'
];

export const DownloadFormModal: React.FC<DownloadFormModalProps> = ({
  isOpen,
  onClose,
  flujoNombre,
  linkDescarga,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      correo: '',
      whatsapp: '',
      pais: '',
      flujo: flujoNombre,
      situacion_actual: [],
      situacion_otra: '',
      actividad_proyecto: '',
      experiencia_nocode: '',
      tarea_automatizar: '',
      frustracion_ia: '',
      quiere_recursos: [],
    },
  });

  const handleSituacionChange = (value: string, checked: boolean) => {
    const currentValues = form.getValues('situacion_actual');
    if (checked) {
      form.setValue('situacion_actual', [...currentValues, value]);
    } else {
      form.setValue('situacion_actual', currentValues.filter(v => v !== value));
      if (value === 'Otro') {
        form.setValue('situacion_otra', '');
      }
    }
  };

  const handleRecursosChange = (value: string, checked: boolean) => {
    const currentValues = form.getValues('quiere_recursos');
    if (checked) {
      form.setValue('quiere_recursos', [...currentValues, value]);
    } else {
      form.setValue('quiere_recursos', currentValues.filter(v => v !== value));
    }
  };

  const validateStep = async (step: number): Promise<boolean> => {
    const values = form.getValues();
    
    switch (step) {
      case 1:
        return !!(values.nombre && values.correo && values.pais && 
                 /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo));
      case 2:
        return values.situacion_actual.length > 0;
      case 3:
        return !!(values.actividad_proyecto && values.experiencia_nocode);
      case 4:
        return !!(values.tarea_automatizar && values.frustracion_ia);
      case 5:
        return values.quiere_recursos.length > 0;
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos obligatorios antes de continuar.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('descargas')
        .insert([{
          nombre: data.nombre,
          correo: data.correo,
          whatsapp: data.whatsapp || null,
          pais: data.pais,
          celular: '', // Mantener por compatibilidad
          flujo: data.flujo,
          situacion_actual: data.situacion_actual,
          situacion_otra: data.situacion_otra || null,
          actividad_proyecto: data.actividad_proyecto,
          experiencia_nocode: data.experiencia_nocode,
          tarea_automatizar: data.tarea_automatizar,
          frustracion_ia: data.frustracion_ia,
          quiere_recursos: data.quiere_recursos,
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Ahora serás redirigido a tu flujo de automatización",
      });

      onClose();
      window.open(linkDescarga, '_blank');
      
    } catch (error) {
      console.error('Error al registrar descarga:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu solicitud. Inténtalo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const situacionActual = form.watch('situacion_actual');
    const quiereRecursos = form.watch('quiere_recursos');

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="correo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="juanperez@email.com" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+57 300 123 4567" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Selecciona tu país" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="situacion_actual"
              render={() => (
                <FormItem>
                  <FormLabel>¿En qué estás hoy? (Selecciona todas las que apliquen) *</FormLabel>
                  <div className="space-y-3">
                    {situacionOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={situacionActual.includes(option)}
                          onCheckedChange={(checked) => handleSituacionChange(option, checked as boolean)}
                        />
                        <label htmlFor={option} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {situacionActual.includes('Otro') && (
              <FormField
                control={form.control}
                name="situacion_otra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especifica tu situación</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe tu situación..." {...field} className="rounded-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="actividad_proyecto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Qué tipo de actividad, proyecto o industria manejas o te interesa? *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Restaurantes, marketing digital, salud, ecommerce, educación, etc."
                      {...field}
                      className="rounded-lg min-h-[80px]"
                      maxLength={200}
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500">
                    {field.value?.length || 0}/200 caracteres
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experiencia_nocode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Qué tanto has usado herramientas no-code o IA hasta ahora? *</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                      {experienciaOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={option} />
                          <label htmlFor={option} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {option}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="tarea_automatizar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Qué tarea repetitiva te gustaría automatizar YA MISMO si pudieras? *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Responder mensajes en WhatsApp, agendar citas, enviar cotizaciones, generar contenido para redes, etc."
                      {...field}
                      className="rounded-lg min-h-[100px]"
                      maxLength={350}
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500">
                    {field.value?.length || 0}/350 caracteres
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frustracion_ia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Qué es lo que más te frustra hoy de usar herramientas de IA o automatización? *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="No sé por dónde empezar, Me abruman tantas opciones, No entiendo cómo conectar herramientas, etc."
                      {...field}
                      className="rounded-lg min-h-[100px]"
                      maxLength={400}
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500">
                    {field.value?.length || 0}/400 caracteres
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="quiere_recursos"
              render={() => (
                <FormItem>
                  <FormLabel>¿Quieres recibir más recursos, plantillas y guías gratis? *</FormLabel>
                  <div className="space-y-3">
                    {recursosOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={quiereRecursos.includes(option)}
                          onCheckedChange={(checked) => handleRecursosChange(option, checked as boolean)}
                        />
                        <label htmlFor={option} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-aumatia-dark mb-2">Flujo seleccionado:</h4>
              <p className="text-aumatia-blue font-medium">{flujoNombre}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-aumatia-dark text-center">
            Accedé a tu flujo gratuito
          </DialogTitle>
        </DialogHeader>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-aumatia-blue">
              Paso {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% completado
            </span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-aumatia-blue hover:bg-aumatia-dark text-white flex items-center gap-2"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-aumatia-blue hover:bg-aumatia-dark text-white flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Enviar y acceder al flujo
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
