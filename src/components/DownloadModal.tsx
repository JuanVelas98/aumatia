import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useEventTracking } from "@/hooks/useEventTracking";
import { Download, DollarSign, FileText, Loader2 } from "lucide-react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  flujo: {
    nombre: string;
    link_descarga: string;
  };
}

interface CountryCode {
  code: string;
  name: string;
  flag: string;
}

const countryCodes: CountryCode[] = [
  { code: '+1', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: '+34', name: 'España', flag: '🇪🇸' },
  { code: '+52', name: 'México', flag: '🇲🇽' },
  { code: '+51', name: 'Perú', flag: '🇵🇪' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾' },
];

export const DownloadModal = ({ isOpen, onClose, flujo }: DownloadModalProps) => {
  const [step, setStep] = useState<'choose' | 'form'>('choose');
  const [loading, setLoading] = useState(false);
  const { registrarEvento } = useEventTracking();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    celular: '',
    pais_codigo: '+57',
    interes: ''
  });

  const handlePayment = () => {
    // Registrar evento de click en pago
    registrarEvento({
      tipo_evento: 'click',
      descripcion: `Pago USD $1 - ${flujo.nombre}`,
      recurso_id: flujo.nombre
    });

    const message = `Hola, quiero comprar el flujo de automatización llamado ${flujo.nombre}`;
    const whatsappUrl = `https://wa.link/dmvgi0?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('descargas')
        .insert({
          nombre: formData.nombre,
          correo: formData.correo,
          celular: formData.celular,
          pais_codigo: formData.pais_codigo,
          flujo: flujo.nombre,
          interes: formData.interes
        });

      if (error) {
        console.error('Error al registrar descarga:', error);
        toast({
          title: "Error",
          description: "Hubo un problema al procesar tu solicitud. Inténtalo de nuevo.",
          variant: "destructive"
        });
        return;
      }

      // Registrar evento de formulario enviado
      registrarEvento({
        tipo_evento: 'formulario_enviado',
        descripcion: `Formulario completado - ${flujo.nombre}`,
        recurso_id: flujo.nombre
      });

      toast({
        title: "¡Éxito!",
        description: "Información registrada correctamente. Iniciando descarga...",
      });

      // Registrar evento de descarga
      setTimeout(() => {
        registrarEvento({
          tipo_evento: 'descarga',
          descripcion: `Descarga flujo - ${flujo.nombre}`,
          recurso_id: flujo.nombre
        });

        window.open(flujo.link_descarga, '_blank');
        onClose();
        setStep('choose');
        setFormData({
          nombre: '',
          correo: '',
          celular: '',
          pais_codigo: '+57',
          interes: ''
        });
      }, 1000);

    } catch (error) {
      console.error('Error inesperado:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('choose');
    setFormData({
      nombre: '',
      correo: '',
      celular: '',
      pais_codigo: '+57',
      interes: ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-aumatia-dark text-xl">
            {step === 'choose' ? 'Acceder al flujo' : 'Completá tus datos'}
          </DialogTitle>
        </DialogHeader>

        {step === 'choose' ? (
          <div className="space-y-6 py-4">
            <p className="text-gray-600 text-center">
              Para acceder a este flujo tenés dos opciones:
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => setStep('form')}
                className="w-full bg-aumatia-blue hover:bg-aumatia-dark text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <FileText className="mr-3 w-6 h-6" />
                Llenar formulario corto (GRATIS)
              </Button>
              
              <div className="text-center text-sm text-gray-500">o</div>
              
              <Button
                onClick={handlePayment}
                variant="outline"
                className="w-full border-2 border-aumatia-blue text-aumatia-blue hover:bg-aumatia-blue hover:text-white py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                <DollarSign className="mr-3 w-6 h-6" />
                Pagar USD $1
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-aumatia-dark mb-2">
                Nombre completo *
              </label>
              <Input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                required
                className="border-gray-300 focus:border-aumatia-blue focus:ring-aumatia-blue"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-aumatia-dark mb-2">
                Correo electrónico *
              </label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({...formData, correo: e.target.value})}
                required
                className="border-gray-300 focus:border-aumatia-blue focus:ring-aumatia-blue"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-aumatia-dark mb-2">
                Celular *
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.pais_codigo}
                  onChange={(e) => setFormData({...formData, pais_codigo: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-aumatia-blue focus:border-aumatia-blue w-32"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <Input
                  type="tel"
                  value={formData.celular}
                  onChange={(e) => setFormData({...formData, celular: e.target.value})}
                  required
                  className="flex-1 border-gray-300 focus:border-aumatia-blue focus:ring-aumatia-blue"
                  placeholder="Número de celular"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-aumatia-dark mb-2">
                Flujo seleccionado
              </label>
              <Input
                type="text"
                value={flujo.nombre}
                readOnly
                className="bg-gray-100 border-gray-300"
              />
            </div>

            <div>
              <label htmlFor="interes" className="block text-sm font-medium text-aumatia-dark mb-2">
                ¿Qué te gustaría automatizar?
              </label>
              <Textarea
                id="interes"
                value={formData.interes}
                onChange={(e) => setFormData({...formData, interes: e.target.value})}
                className="border-gray-300 focus:border-aumatia-blue focus:ring-aumatia-blue"
                placeholder="Contanos qué procesos querés optimizar..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('choose')}
                className="flex-1"
                disabled={loading}
              >
                Volver
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-aumatia-blue hover:bg-aumatia-dark text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 w-4 h-4" />
                    Enviar y descargar
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
