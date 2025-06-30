
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface Paso {
  descripcion: string;
  codigo: string;
  videoUrl: string;
}

interface Flujo {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  link_descarga: string;
  pasos: Paso[];
}

interface Tutorial {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  video_url: string;
}

const RecursoDetalle = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const tipo = searchParams.get("tipo");
  
  const [flujo, setFlujo] = useState<Flujo | null>(null);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Simular datos de ejemplo
    if (tipo === "tutorial") {
      const mockTutorial: Tutorial = {
        id: id,
        titulo: "Configuración Inicial de Webhooks",
        descripcion: "En este tutorial aprenderás paso a paso cómo configurar webhooks para recibir datos en tiempo real en tus aplicaciones. Cubriremos desde la configuración básica hasta casos de uso avanzados.",
        imagen_url: `https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop`,
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      };
      setTutorial(mockTutorial);
    } else {
      const mockFlujo: Flujo = {
        id: id,
        nombre: "Automatización de Email Marketing",
        descripcion: "Flujo completo para automatizar campañas de email marketing con seguimiento de conversiones y personalización avanzada.",
        imagen_url: `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop`,
        link_descarga: "https://example.com/download/flujo-email-marketing.zip",
        pasos: [
          {
            descripcion: "Configurar la conexión con el proveedor de email",
            codigo: `// Configuración inicial del proveedor de email
const emailConfig = {
  apiKey: 'tu-api-key',
  domain: 'tu-dominio.com',
  from: 'no-reply@tu-dominio.com'
};

// Inicializar el cliente
const emailClient = new EmailClient(emailConfig);`,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          },
          {
            descripcion: "Crear la lista de contactos y segmentación",
            codigo: `// Crear segmentos de audiencia
const segments = {
  nuevos_usuarios: {
    filter: 'signup_date > 7_days_ago',
    tags: ['nuevo', 'onboarding']
  },
  usuarios_activos: {
    filter: 'last_activity < 30_days_ago', 
    tags: ['activo', 'engagement']
  }
};

// Aplicar segmentación
await emailClient.createSegments(segments);`,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          },
          {
            descripcion: "Configurar el flujo de automatización",
            codigo: `// Definir el flujo de emails
const emailFlow = {
  trigger: 'user_signup',
  steps: [
    {
      delay: 0,
      template: 'welcome_email',
      subject: 'Bienvenido a nuestra plataforma'
    },
    {
      delay: '3_days',
      template: 'onboarding_tips',
      subject: 'Consejos para empezar'
    },
    {
      delay: '7_days',
      template: 'feature_highlight',
      subject: 'Descubre estas funcionalidades'
    }
  ]
};

await emailClient.createFlow(emailFlow);`,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          }
        ]
      };
      setFlujo(mockFlujo);
      setCompletedSteps(new Array(mockFlujo.pasos.length).fill(false));
    }

    setLoading(false);
  }, [id, tipo]);

  const handleStepComplete = (index: number) => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[index] = !newCompletedSteps[index];
    setCompletedSteps(newCompletedSteps);
    
    if (newCompletedSteps[index]) {
      toast({
        title: "Paso completado",
        description: `Has marcado como completado el paso ${index + 1}`,
      });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado",
      description: "El código ha sido copiado al portapapeles",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aumatia-blue mx-auto mb-4"></div>
          <p className="text-aumatia-dark">Cargando recurso...</p>
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
            <Link to="/recursos" className="text-aumatia-blue hover:text-white mb-4 inline-block">
              ← Volver a recursos
            </Link>
            <h1 className="text-4xl font-bold mb-2">
              {tipo === "tutorial" ? tutorial?.titulo : flujo?.nombre}
            </h1>
            {flujo && (
              <div className="bg-aumatia-blue/20 text-aumatia-blue px-4 py-2 rounded-lg inline-block">
                ⬇️ Descarga gratis al final
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Tutorial View */}
          {tipo === "tutorial" && tutorial && (
            <div className="space-y-8">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={tutorial.imagen_url} 
                  alt={tutorial.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-aumatia-dark">Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{tutorial.descripcion}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-aumatia-dark">Video Tutorial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="video-container">
                    <iframe
                      src={tutorial.video_url}
                      title={tutorial.titulo}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Flujo View */}
          {!tipo && flujo && (
            <div className="space-y-8">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={flujo.imagen_url} 
                  alt={flujo.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-aumatia-dark">Descripción del Flujo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{flujo.descripcion}</p>
                </CardContent>
              </Card>

              {/* Video principal */}
              {flujo.pasos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-aumatia-dark">Video Principal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="video-container">
                      <iframe
                        src={flujo.pasos[0].videoUrl}
                        title="Video principal del flujo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pasos del flujo */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-aumatia-dark">Pasos del Flujo</h2>
                
                {flujo.pasos.map((paso, index) => (
                  <Card key={index} className={`transition-all duration-300 ${completedSteps[index] ? 'bg-green-50 border-green-200' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Checkbox
                          id={`step-${index}`}
                          checked={completedSteps[index]}
                          onCheckedChange={() => handleStepComplete(index)}
                        />
                        <CardTitle className="text-aumatia-dark">
                          Paso {index + 1}: {paso.descripcion}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    
                    {(!completedSteps[index] || completedSteps[index]) && (
                      <CardContent className="space-y-4">
                        {/* Código */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-aumatia-dark">Código:</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyCode(paso.codigo)}
                              className="text-aumatia-blue border-aumatia-blue hover:bg-aumatia-blue hover:text-white"
                            >
                              Copiar código
                            </Button>
                          </div>
                          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{paso.codigo}</code>
                          </pre>
                        </div>

                        {/* Video del paso */}
                        <div>
                          <h4 className="font-semibold text-aumatia-dark mb-2">Video explicativo:</h4>
                          <div className="video-container">
                            <iframe
                              src={paso.videoUrl}
                              title={`Video paso ${index + 1}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>

              {/* Descarga */}
              <Card className="bg-aumatia-blue/5 border-aumatia-blue">
                <CardHeader>
                  <CardTitle className="text-aumatia-dark">🎉 ¡Felicitaciones!</CardTitle>
                  <CardDescription>
                    Has completado el flujo. Ahora puedes descargar todos los archivos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a href={flujo.link_descarga} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-aumatia-blue hover:bg-aumatia-blue/90">
                      ⬇️ Descargar este flujo
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecursoDetalle;
