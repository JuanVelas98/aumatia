
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Download, Loader2 } from 'lucide-react';

const formSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  correo: z.string().email('Ingresa un correo electrónico válido'),
  pais_codigo: z.string().min(1, 'Selecciona un código de país'),
  celular: z.string().min(5, 'El número de celular debe tener al menos 5 dígitos'),
  flujo: z.string(),
  interes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DownloadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  flujoNombre: string;
  linkDescarga: string;
}

const countryCodes = [
  { code: '+54', country: 'Argentina' },
  { code: '+57', country: 'Colombia' },
  { code: '+1', country: 'Estados Unidos' },
  { code: '+52', country: 'México' },
  { code: '+51', country: 'Perú' },
  { code: '+56', country: 'Chile' },
  { code: '+598', country: 'Uruguay' },
  { code: '+34', country: 'España' },
  { code: '+55', country: 'Brasil' },
  { code: '+58', country: 'Venezuela' },
];

export const DownloadFormModal: React.FC<DownloadFormModalProps> = ({
  isOpen,
  onClose,
  flujoNombre,
  linkDescarga,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      correo: '',
      pais_codigo: '',
      celular: '',
      flujo: flujoNombre,
      interes: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('descargas')
        .insert([{
          nombre: data.nombre,
          correo: data.correo,
          celular: data.celular,
          pais_codigo: data.pais_codigo,
          flujo: data.flujo,
          interes: data.interes || null,
        }]);

      if (error) {
        throw error;
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Ahora serás redirigido a tu flujo de automatización",
      });

      // Cerrar modal
      onClose();
      
      // Redirigir al link de descarga
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-aumatia-dark text-center">
            Accedé a tu flujo gratuito
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Tu nombre completo" 
                      {...field}
                      className="rounded-lg"
                    />
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
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="tu@email.com" 
                      {...field}
                      className="rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="pais_codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Código" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.code} {country.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="celular"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel"
                          placeholder="1234567890" 
                          {...field}
                          className="rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="flujo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del flujo</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      readOnly
                      className="rounded-lg bg-gray-50 text-gray-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Qué te gustaría automatizar? (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Cuéntanos qué procesos te gustaría automatizar..."
                      {...field}
                      className="rounded-lg min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-aumatia-blue hover:bg-aumatia-dark text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Enviar y acceder al flujo
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
