
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Flujo {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  creado_en: string;
}

interface Tutorial {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  creado_en: string;
}

const Recursos = () => {
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [tutoriales, setTutoriales] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular datos de ejemplo ya que no hay conexión real a Supabase
    const mockFlujos: Flujo[] = [
      {
        id: "1",
        nombre: "Automatización de Email Marketing",
        descripcion: "Flujo completo para automatizar campañas de email marketing con seguimiento de conversiones",
        imagen_url: `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop`,
        creado_en: "2024-01-15T10:00:00Z"
      },
      {
        id: "2", 
        nombre: "Sistema de CRM Automatizado",
        descripcion: "Workflow para gestión automática de clientes y leads con seguimiento personalizado",
        imagen_url: `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop`,
        creado_en: "2024-01-14T15:30:00Z"
      }
    ];

    const mockTutoriales: Tutorial[] = [
      {
        id: "1",
        titulo: "Configuración Inicial de Webhooks",
        descripcion: "Aprende paso a paso cómo configurar webhooks para recibir datos en tiempo real",
        imagen_url: `https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop`,
        creado_en: "2024-01-13T09:15:00Z"
      },
      {
        id: "2",
        titulo: "Integración con APIs REST",
        descripcion: "Tutorial completo sobre cómo integrar APIs REST en tus automatizaciones",
        imagen_url: `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop`,
        creado_en: "2024-01-12T14:20:00Z"
      }
    ];

    // Simular carga asíncrona
    setTimeout(() => {
      setFlujos(mockFlujos);
      setTutoriales(mockTutoriales);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aumatia-blue mx-auto mb-4"></div>
          <p className="text-aumatia-dark">Cargando recursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-aumatia-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="text-aumatia-blue hover:text-white mb-4 inline-block">
              ← Volver al inicio
            </Link>
            <h1 className="text-4xl font-bold mb-2">Recursos de Automatización</h1>
            <p className="text-lg opacity-90">
              Descubre nuestros workflows y tutoriales para optimizar tus procesos
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Workflows Section */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-aumatia-dark mb-4">
                🔄 Workflows de Automatización
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Flujos completos listos para implementar en tu organización
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {flujos.map((flujo) => (
                <Card key={flujo.id} className="hover:shadow-lg transition-all duration-300 animate-fade-in">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    <img 
                      src={flujo.imagen_url} 
                      alt={flujo.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-aumatia-dark">{flujo.nombre}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {flujo.descripcion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/recursos/detalle?id=${flujo.id}`}>
                      <Button className="w-full bg-aumatia-blue hover:bg-aumatia-blue/90">
                        Ver más
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Tutorials Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-aumatia-dark mb-4">
                🎓 Tutoriales Paso a Paso
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Aprende con nuestros tutoriales detallados y videos explicativos
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {tutoriales.map((tutorial) => (
                <Card key={tutorial.id} className="hover:shadow-lg transition-all duration-300 animate-fade-in">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    <img 
                      src={tutorial.imagen_url} 
                      alt={tutorial.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-aumatia-dark">{tutorial.titulo}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {tutorial.descripcion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/recursos/detalle?id=${tutorial.id}&tipo=tutorial`}>
                      <Button className="w-full bg-aumatia-blue hover:bg-aumatia-blue/90">
                        Ver más
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Recursos;
