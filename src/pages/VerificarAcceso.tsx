
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2, CheckCircle } from "lucide-react";

const VerificarAcceso = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verificar si el correo existe en beta_registrations
      const { data, error } = await supabase
        .from('beta_registrations')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 es "no rows returned"
        console.error('Error verificando acceso:', error);
        throw error;
      }

      if (data) {
        // El correo existe, guardar verificación y redirigir
        localStorage.setItem('user_verified', 'true');
        localStorage.setItem('verified_email', email);
        
        toast({
          title: "¡Acceso verificado!",
          description: "Bienvenido a Aumatia. Redirigiendo...",
        });

        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // El correo no existe
        toast({
          title: "Acceso no autorizado",
          description: "Tu correo no está en nuestra lista de acceso. Contáctanos para más información.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Hubo un problema verificando tu acceso. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-aumatia-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-aumatia-blue" />
            </div>
            <CardTitle className="text-2xl text-aumatia-dark">Verificar Acceso</CardTitle>
            <CardDescription>
              Ingresa tu correo electrónico para verificar tu acceso a Aumatia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-aumatia-blue hover:bg-aumatia-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 w-4 h-4" />
                    Verificar acceso
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                Si no tienes acceso y quieres unirte a nuestra lista, contáctanos a través de nuestras redes sociales.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificarAcceso;
