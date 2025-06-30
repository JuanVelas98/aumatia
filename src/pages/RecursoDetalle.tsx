import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SocialLinks } from "@/components/SocialLinks";
import { PlatformChips } from "@/components/PlatformChips";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Check, Play, Copy, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Platform {
  nombre: string;
  link: string;
}

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
  plataformas: Platform[];
}

interface Tutorial {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  video_url: string;
  plataformas: Platform[];
}

// Helper function for type conversion
const parseJsonArray = (jsonData: any): any[] => {
  if (!jsonData) return [];
  if (Array.isArray(jsonData)) return jsonData;
  if (typeof jsonData === 'string') {
    try {
      return JSON.parse(jsonData);
    } catch {
      return [];
    }
  }
  return [];
};

const RecursoDetalle = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const tipo = searchParams.get('tipo');
  
  const [flujo, setFlujo] = useState<Flujo | null>(null);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const fetchRecurso = async () => {
      if (!id) return;

      try {
        setLoading(true);

        if (tipo === 'tutorial') {
          const { data, error } = await supabase
            .from('tutoriales')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error('Error fetching tutorial:', error);
          } else {
            // Convert Json fields to typed arrays
            const convertedTutorial = {
              ...data,
              plataformas: parseJsonArray(data.plataformas) as Platform[]
            };
            setTutorial(convertedTutorial);
          }
        } else {
          const { data, error } = await supabase
            .from('flujos')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error('Error fetching flujo:', error);
          } else {
            // Convert Json fields to typed arrays
            const convertedFlujo = {
              ...data,
              pasos: parseJsonArray(data.pasos) as Paso[],
              plataformas: parseJsonArray(data.plataformas) as Platform[]
            };
            setFlujo(convertedFlujo);
          }
        }
      } catch (error) {
        console.error('Error general:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecurso();
  }, [id, tipo]);

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex)
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Código copiado",
        description: "El código ha sido copiado al portapapeles",
      });
    } catch (err) {
      console.error('Error copying code:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <header className="bg-aumatia-dark text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <img 
                src="https://i.imgur.com/cuWJ50n.png" 
                alt="Aumatia Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold">Cargando recurso...</h1>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-20">
          <div className="flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-aumatia-blue" />
            <span className="ml-2 text-lg text-aumatia-dark">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!flujo && !tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <header className="bg-aumatia-dark text-white py-8">
          <div className="container mx-auto px-4">
            <Link to="/recursos" className="text-aumatia-blue hover:text-white inline-flex items-center group">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver a recursos
            </Link>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-aumatia-dark mb-4">Recurso no encontrado</h2>
            <p className="text-gray-600">El recurso que buscas no existe o ha sido eliminado.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render Tutorial
  if (tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <header className="bg-aumatia-dark text-white py-8 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link to="/recursos" className="text-aumatia-blue hover:text-white mb-4 inline-flex items-center group transition-colors">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Volver a recursos
              </Link>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://i.imgur.com/cuWJ50n.png" 
                    alt="Aumatia Logo" 
                    className="h-12 w-auto"
                  />
                  <div>
                    <h1 className="text-3xl font-bold">{tutorial.titulo}</h1>
                    <p className="text-lg opacity-90">Tutorial paso a paso</p>
                  </div>
                </div>
                <SocialLinks iconSize={24} />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-white mb-8">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <img
                      src={tutorial.imagen_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"}
                      alt={tutorial.titulo}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-aumatia-dark mb-4">{tutorial.titulo}</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">{tutorial.descripcion}</p>
                    <PlatformChips platforms={tutorial.plataformas || []} />
                  </div>
                </div>

                {tutorial.video_url && (
                  <div className="video-container">
                    <iframe
                      src={tutorial.video_url}
                      title={tutorial.titulo}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-aumatia-dark text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img 
                  src="https://i.imgur.com/cuWJ50n.png" 
                  alt="Aumatia Logo" 
                  className="h-10 w-auto"
                />
                <div>
                  <h3 className="text-xl font-bold">Aumatia</h3>
                  <p className="text-gray-300 text-sm">Automatización inteligente para tu negocio</p>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-gray-300 mb-2">Síguenos en nuestras redes</p>
                <SocialLinks />
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Render Flujo
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <header className="bg-aumatia-dark text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/recursos" className="text-aumatia-blue hover:text-white mb-4 inline-flex items-center group transition-colors">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver a recursos
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="https://i.imgur.com/cuWJ50n.png" 
                  alt="Aumatia Logo" 
                  className="h-12 w-auto"
                />
                <div>
                  <h1 className="text-3xl font-bold">{flujo?.nombre}</h1>
                  <p className="text-lg opacity-90">
                    Workflow de automatización
                    {flujo?.link_descarga && <span className="ml-2">⬇️ Descarga gratis al final</span>}
                  </p>
                </div>
              </div>
              <SocialLinks iconSize={24} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Intro Card */}
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <img
                    src={flujo?.imagen_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop"}
                    alt={flujo?.nombre}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-aumatia-dark mb-4">{flujo?.nombre}</h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">{flujo?.descripcion}</p>
                  <PlatformChips platforms={flujo?.plataformas || []} />
                </div>
              </div>

              {/* Video Principal */}
              {flujo?.pasos && flujo.pasos.length > 0 && flujo.pasos[0].videoUrl && (
                <div>
                  <h3 className="text-xl font-semibold text-aumatia-dark mb-4">🎥 Video Principal</h3>
                  <div className="video-container">
                    <iframe
                      src={flujo.pasos[0].videoUrl}
                      title="Video principal del flujo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pasos */}
          {flujo?.pasos && flujo.pasos.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-aumatia-dark text-center">
                📋 Pasos del Flujo
              </h3>
              
              {flujo.pasos.map((paso, index) => (
                <Card 
                  key={index} 
                  className={`border-0 shadow-lg transition-all duration-300 ${
                    completedSteps.includes(index) 
                      ? 'bg-green-50 border-l-4 border-l-green-500' 
                      : 'bg-white border-l-4 border-l-aumatia-blue'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-aumatia-dark flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          completedSteps.includes(index) ? 'bg-green-500' : 'bg-aumatia-blue'
                        }`}>
                          {completedSteps.includes(index) ? <Check size={16} /> : index + 1}
                        </span>
                        Paso {index + 1}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`step-${index}`}
                          checked={completedSteps.includes(index)}
                          onCheckedChange={() => toggleStep(index)}
                        />
                        <label
                          htmlFor={`step-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Completar paso
                        </label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-700 text-lg leading-relaxed">{paso.descripcion}</p>

                    {paso.codigo && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-aumatia-dark">Código:</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyCode(paso.codigo)}
                            className="text-aumatia-blue border-aumatia-blue hover:bg-aumatia-blue hover:text-white"
                          >
                            <Copy size={16} className="mr-1" />
                            Copiar
                          </Button>
                        </div>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{paso.codigo}</code>
                        </pre>
                      </div>
                    )}

                    {paso.videoUrl && (
                      <div>
                        <h4 className="font-semibold text-aumatia-dark mb-2 flex items-center gap-2">
                          <Play size={18} />
                          Video del paso:
                        </h4>
                        <div className="video-container">
                          <iframe
                            src={paso.videoUrl}
                            title={`Video del paso ${index + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Download Section */}
          {flujo?.link_descarga && (
            <Card className="border-0 shadow-lg bg-gradient-to-r from-aumatia-blue to-aumatia-dark text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-6">🎉 ¡Felicitaciones!</h3>
                <p className="text-lg mb-6 opacity-90">
                  Has completado {completedSteps.length} de {flujo?.pasos?.length || 0} pasos. 
                  Descarga el flujo completo para tenerlo siempre disponible.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-aumatia-dark hover:bg-gray-100 font-semibold px-8 py-3"
                  onClick={() => window.open(flujo.link_descarga, '_blank')}
                >
                  <Download className="mr-2 w-5 h-5" />
                  Descargar Flujo Completo
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-aumatia-dark text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img 
                src="https://i.imgur.com/cuWJ50n.png" 
                alt="Aumatia Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h3 className="text-xl font-bold">Aumatia</h3>
                <p className="text-gray-300 text-sm">Automatización inteligente para tu negocio</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-300 mb-2">Síguenos en nuestras redes</p>
              <SocialLinks />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecursoDetalle;
