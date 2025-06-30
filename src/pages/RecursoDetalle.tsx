
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlatformChips } from "@/components/PlatformChips";
import { DownloadModal } from "@/components/DownloadModal";
import { DynamicHeader } from "@/components/DynamicHeader";
import { SEOHelmet } from "@/components/SEOHelmet";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Play, Copy, Check, ExternalLink, FileText, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEventTracking } from "@/hooks/useEventTracking";
import { useScrollVisibility } from "@/hooks/useScrollVisibility";

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
  descripcion: string | null;
  imagen_url: string | null;
  link_descarga: string | null;
  pasos: Paso[];
  plataformas: Platform[];
  creado_en: string | null;
}

interface Tutorial {
  id: string;
  titulo: string;
  descripcion: string | null;
  imagen_url: string | null;
  video_url: string | null;
  plataformas: Platform[];
  creado_en: string | null;
}

const RecursoDetalle = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const tipo = searchParams.get('tipo') || 'flujo';
  
  const [recurso, setRecurso] = useState<Flujo | Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [copiedSteps, setCopiedSteps] = useState<Set<number>>(new Set());
  const { registrarEvento } = useEventTracking();

  // Refs para scroll visibility
  const heroRef = useScrollVisibility({
    descripcion: `Vista detalle de ${tipo}`,
    recurso_id: id || undefined
  });

  const stepsRef = useScrollVisibility({
    descripcion: `Sección de pasos - ${tipo}`,
    recurso_id: id || undefined
  });

  useEffect(() => {
    if (id) {
      fetchRecurso();
    }
  }, [id, tipo]);

  const fetchRecurso = async () => {
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
          return;
        }

        if (data) {
          const processedData: Tutorial = {
            ...data,
            plataformas: Array.isArray(data.plataformas) 
              ? data.plataformas as Platform[]
              : (data.plataformas ? JSON.parse(String(data.plataformas)) : [])
          };
          setRecurso(processedData);
        }
      } else {
        const { data, error } = await supabase
          .from('flujos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching flujo:', error);
          return;
        }

        if (data) {
          const processedData: Flujo = {
            ...data,
            pasos: Array.isArray(data.pasos) 
              ? data.pasos as Paso[]
              : (data.pasos ? JSON.parse(String(data.pasos)) : []),
            plataformas: Array.isArray(data.plataformas) 
              ? data.plataformas as Platform[]
              : (data.plataformas ? JSON.parse(String(data.plataformas)) : [])
          };
          setRecurso(processedData);
        }
      }
    } catch (error) {
      console.error('Error general:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    if (completedSteps.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
      
      // Registrar evento de paso completado
      registrarEvento({
        tipo_evento: 'paso_completado',
        paso_numero: stepIndex + 1,
        recurso_id: id || undefined,
        descripcion: `Paso ${stepIndex + 1} completado`
      });
    }
    setCompletedSteps(newCompleted);
    
    // Simular guardado en localStorage
    if (id) {
      localStorage.setItem(`steps_${id}`, JSON.stringify(Array.from(newCompleted)));
    }
  };

  const handleCopyCode = async (code: string, stepIndex: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedSteps(prev => new Set([...prev, stepIndex]));
      
      registrarEvento({
        tipo_evento: 'click',
        descripcion: `Código copiado - Paso ${stepIndex + 1}`,
        recurso_id: id || undefined
      });

      toast({
        title: "Código copiado",
        description: "El código ha sido copiado al portapapeles"
      });

      // Remover el estado de copiado después de 2 segundos
      setTimeout(() => {
        setCopiedSteps(prev => {
          const newSet = new Set(prev);
          newSet.delete(stepIndex);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar el código",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    registrarEvento({
      tipo_evento: 'click',
      descripcion: 'Botón acceso gratuito clickeado',
      recurso_id: id || undefined
    });
    setShowDownloadModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aumatia-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando recurso...</p>
        </div>
      </div>
    );
  }

  if (!recurso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-aumatia-dark mb-4">Recurso no encontrado</h2>
          <p className="text-gray-600 mb-6">El recurso que buscas no existe o ha sido eliminado.</p>
          <Link to="/recursos">
            <Button className="bg-aumatia-blue hover:bg-aumatia-dark">
              Volver a recursos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isFlujo = tipo === 'flujo';
  const titulo = isFlujo ? (recurso as Flujo).nombre : (recurso as Tutorial).titulo;
  const descripcion = recurso.descripcion;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 font-poppins">
      <SEOHelmet 
        title={`${titulo} - Aumatia`}
        description={descripcion || `${isFlujo ? 'Flujo' : 'Tutorial'} de automatización en Aumatia`}
      />
      
      <DynamicHeader>
        <Link to="/recursos" className="text-aumatia-blue hover:text-aumatia-dark inline-flex items-center group transition-colors">
          <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver a recursos
        </Link>
      </DynamicHeader>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div ref={heroRef} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              {isFlujo ? (
                <FileText className="w-6 h-6 text-aumatia-blue" />
              ) : (
                <Video className="w-6 h-6 text-aumatia-blue" />
              )}
              <Badge variant="secondary" className="bg-aumatia-blue/10 text-aumatia-blue">
                {isFlujo ? 'Flujo' : 'Tutorial'}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-aumatia-dark mb-6">
              {titulo}
            </h1>
            
            {descripcion && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {descripcion}
              </p>
            )}

            {recurso.plataformas && recurso.plataformas.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-aumatia-dark mb-4">
                  Plataformas utilizadas:
                </h3>
                <PlatformChips platforms={recurso.plataformas} />
              </div>
            )}

            {isFlujo && (
              <Button
                onClick={handleDownload}
                size="lg"
                className="bg-aumatia-blue hover:bg-aumatia-dark text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                🎯 Acceso Gratuito
              </Button>
            )}
          </div>

          <Separator className="mb-12" />

          {/* Steps Section for Flujos */}
          {isFlujo && (recurso as Flujo).pasos && (recurso as Flujo).pasos.length > 0 && (
            <div ref={stepsRef} className="mb-12">
              <h2 className="text-3xl font-bold text-aumatia-dark mb-8 text-center">
                📋 Pasos del flujo
              </h2>
              
              <div className="space-y-8">
                {(recurso as Flujo).pasos.map((paso, index) => (
                  <Card key={index} className={`border-l-4 transition-all duration-300 ${
                    completedSteps.has(index) 
                      ? 'border-l-green-500 bg-green-50' 
                      : 'border-l-aumatia-blue bg-white'
                  } shadow-lg hover:shadow-xl`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-3 text-aumatia-dark">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              completedSteps.has(index) ? 'bg-green-500' : 'bg-aumatia-blue'
                            }`}>
                              {completedSteps.has(index) ? '✓' : index + 1}
                            </div>
                            Paso {index + 1}
                          </CardTitle>
                          <CardDescription className="text-gray-600 mt-2">
                            {paso.descripcion}
                          </CardDescription>
                        </div>
                        <Button
                          variant={completedSteps.has(index) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStepComplete(index)}
                          className={completedSteps.has(index) ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {completedSteps.has(index) ? 'Completado' : 'Marcar'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {paso.codigo && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-aumatia-dark">Código:</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyCode(paso.codigo, index)}
                              className="gap-2"
                            >
                              {copiedSteps.has(index) ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Copiado
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copiar
                                </>
                              )}
                            </Button>
                          </div>
                          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto border">
                            <code className="text-sm font-mono">{paso.codigo}</code>
                          </pre>
                        </div>
                      )}
                      
                      {paso.videoUrl && (
                        <div>
                          <h4 className="font-semibold text-aumatia-dark mb-2">Video explicativo:</h4>
                          <a
                            href={paso.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-aumatia-blue hover:text-aumatia-dark transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            Ver video del paso
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Video Section for Tutorials */}
          {!isFlujo && (recurso as Tutorial).video_url && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-aumatia-dark mb-8 text-center">
                🎥 Tutorial
              </h2>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <a
                      href={(recurso as Tutorial).video_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-aumatia-blue text-white px-6 py-3 rounded-lg hover:bg-aumatia-dark transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      Ver Tutorial
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Download Modal */}
      {showDownloadModal && isFlujo && (
        <DownloadModal
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          flujo={recurso as Flujo}
        />
      )}
    </div>
  );
};

export default RecursoDetalle;
