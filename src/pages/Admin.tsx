
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Settings, Eye, EyeOff } from "lucide-react";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [mockupEnabled, setMockupEnabled] = useState(true);
  const [accessForAll, setAccessForAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    // Cargar configuraciones guardadas
    const savedMockup = localStorage.getItem('mockup_enabled');
    const savedAccess = localStorage.getItem('access_for_all');
    
    if (savedMockup !== null) {
      setMockupEnabled(savedMockup === 'true');
    }
    if (savedAccess !== null) {
      setAccessForAll(savedAccess === 'true');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Contraseña simple hardcodeada
    if (password === 'aumatia2024') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      toast({
        title: "Acceso concedido",
        description: "Bienvenido al panel de administración",
      });
    } else {
      toast({
        title: "Error",
        description: "Contraseña incorrecta",
        variant: "destructive",
      });
    }
  };

  const handleMockupChange = (enabled: boolean) => {
    setMockupEnabled(enabled);
    localStorage.setItem('mockup_enabled', enabled.toString());
    toast({
      title: "Configuración actualizada",
      description: `Mockup Pre-inscripción ${enabled ? 'activado' : 'desactivado'}`,
    });
  };

  const handleAccessChange = (enabled: boolean) => {
    setAccessForAll(enabled);
    localStorage.setItem('access_for_all', enabled.toString());
    toast({
      title: "Configuración actualizada",
      description: `Acceso para todos ${enabled ? 'activado' : 'desactivado'}`,
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setPassword("");
    toast({
      title: "Sesión cerrada",
      description: "Has salido del panel de administración",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-aumatia-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-aumatia-blue" />
            </div>
            <CardTitle className="text-2xl text-aumatia-dark">Panel de Administración</CardTitle>
            <CardDescription>Ingresa la contraseña para acceder</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-aumatia-blue hover:bg-aumatia-dark">
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-aumatia-dark mb-2">Panel de Administración</h1>
            <p className="text-gray-600">Configuraciones del sistema</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="text-red-600 hover:text-red-700">
            Cerrar Sesión
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Control de Mockups
            </CardTitle>
            <CardDescription>
              Configura la visibilidad y acceso de los componentes del sitio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium">Mockup Pre-inscripción</Label>
                <p className="text-sm text-gray-600">
                  Controla si se muestra el overlay de beta en la página principal
                </p>
              </div>
              <div className="flex items-center gap-2">
                {mockupEnabled ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                <Switch
                  checked={mockupEnabled}
                  onCheckedChange={handleMockupChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-base font-medium">Acceso para Todos</Label>
                <p className="text-sm text-gray-600">
                  Permite acceso sin verificación de correo electrónico
                </p>
              </div>
              <div className="flex items-center gap-2">
                {accessForAll ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                <Switch
                  checked={accessForAll}
                  onCheckedChange={handleAccessChange}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-aumatia-dark mb-2">Estado Actual:</h4>
              <ul className="text-sm space-y-1">
                <li>• Mockup Pre-inscripción: <span className={mockupEnabled ? "text-green-600" : "text-red-600"}>{mockupEnabled ? "Activado" : "Desactivado"}</span></li>
                <li>• Acceso para Todos: <span className={accessForAll ? "text-green-600" : "text-red-600"}>{accessForAll ? "Activado" : "Desactivado"}</span></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
