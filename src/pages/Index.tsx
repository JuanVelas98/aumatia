
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-aumatia-dark text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Aumatia</h1>
          <p className="text-lg opacity-90">Sistema de Recursos de Automatización</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-aumatia-dark mb-4">
            Bienvenido a Aumatia
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Accede a nuestros workflows de automatización y tutoriales paso a paso para optimizar tus procesos.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-aumatia-dark">📚 Recursos Públicos</CardTitle>
              <CardDescription>
                Explora nuestros workflows y tutoriales disponibles para toda la comunidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/recursos">
                <Button className="w-full bg-aumatia-blue hover:bg-aumatia-blue/90">
                  Ver Recursos
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-aumatia-dark">⚙️ Panel de Administración</CardTitle>
              <CardDescription>
                Gestiona y crea nuevos recursos para la plataforma (solo administradores)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin_recursos">
                <Button className="w-full bg-aumatia-dark hover:bg-aumatia-dark/90">
                  Panel Admin
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
