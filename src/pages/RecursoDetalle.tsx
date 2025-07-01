import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PlatformChips } from "@/components/PlatformChips";
import { DownloadFormModal } from "@/components/DownloadFormModal";
import { DynamicHeader } from "@/components/DynamicHeader";
import { SEOHelmet } from "@/components/SEOHelmet";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Copy, Check, ExternalLink, FileText, Video, ChevronDown, ChevronUp, Info, Download, Image as ImageIcon } from "lucide-react";
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
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set([0])); // Solo el primer paso abierto
  const [imageError, setImageError] = useState(false);
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

  // Función para convertir URL de YouTube a embed
  const convertToEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Convertir diferentes formatos de YouTube a embed
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url; // Si no es YouTube, devolver la URL original
  };

  // Verificar si todos los pasos están completados
  const areAllStepsCompleted = () => {
    if (!isFlujo || !(recurso as Flujo).pasos) return false;
    const totalSteps = (recurso as Flujo).pasos.length;
    return completedSteps.size === totalSteps && totalSteps > 0;
  };

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
              ? data.plataformas as unknown as Platform[]
              : (data.plataformas ? JSON.parse(String(data.plataformas)) as Platform[] : [])
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
              ? data.pasos as unknown as Paso[]
              : (data.pasos ? JSON.parse(String(data.pasos)) as Paso[] : []),
            plataformas: Array.isArray(data.plataformas) 
              ? data.plataformas as unknown as Platform[]
              : (data.plataformas ? JSON.parse(String(data.plataformas)) as Platform[] : [])
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
    const newOpen = new Set(openSteps);
    
    if (completedSteps.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
      
      // Colapsar el paso actual y abrir el siguiente
      newOpen.delete(stepIndex);
      if (stepIndex + 1 < ((recurso as Flujo).pasos?.length || 0)) {
        newOpen.add(stepIndex + 1);
      }
      
      // Registrar evento de paso completado
      registrarEvento({
        tipo_evento: 'paso_completado',
        paso_numero: stepIndex + 1,
        recurso_id: id || undefined,
        descripcion: `Paso ${stepIndex + 1} completado`
      });
    }
    
    setCompletedSteps(newCompleted);
    setOpenSteps(newOpen);
    
    // Simular guardado en localStorage
    if (id) {
      localStorage.setItem(`steps_${id}`, JSON.stringify(Array.from(newCompleted)));
    }
  };

  const handleStepToggle = (stepIndex: number) => {
    // Solo permitir abrir pasos anteriores o el siguiente inmediato si el anterior está completado
    const canOpen = stepIndex === 0 || 
                   completedSteps.has(stepIndex - 1) || 
                   Array.from(completedSteps).some(completed => completed >= stepIndex - 1);
    
    if (!canOpen) {
      toast({
        title: "Paso bloqueado",
        description: "Debes completar el paso anterior para acceder a este paso",
        variant: "destructive"
      });
      return;
    }

    const newOpen = new Set(openSteps);
    if (openSteps.has(stepIndex)) {
      newOpen.delete(stepIndex);
    } else {
      newOpen.add(stepIndex);
    }
    setOpenSteps(newOpen);
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

  const [showDownloadFormModal, setShowDownloadFormModal] = useState(false);

  const handleDownload = () => {
    registrarEvento({
      tipo_evento: 'click',
      descripcion: 'Botón descargar flujo gratis clickeado',
      recurso_id: id || undefined
    });
    
    setShowDownloadFormModal(true);
  };

  // Función para renderizar la descripción con saltos de línea
  const renderDescription = (text: string | null) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
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
            
            {/* Imagen del recurso */}
            {recurso.imagen_url && !imageError ? (
              <div className="mb-8 flex justify-center">
                <img 
                  src={recurso.imagen_url} 
                  alt={titulo}
                  className="max-w-full h-auto max-h-96 rounded-lg shadow-lg object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="mb-8 flex justify-center">
                <div className="w-full max-w-md h-48 bg-gray-100 rounded-lg shadow-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Imagen no disponible</p>
                  </div>
                </div>
              </div>
            )}
            
            {descripcion && (
              <div className="text-xl text-gray-600 mb-8 leading-relaxed text-left max-w-3xl mx-auto">
                {renderDescription(descripcion)}
              </div>
            )}

            {recurso.plataformas && recurso.plataformas.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-aumatia-dark mb-4">
                  Plataformas utilizadas:
                </h3>
                <PlatformChips platforms={recurso.plataformas} />
              </div>
            )}
          </div>

          <Separator className="mb-12" />

          {/* Mensaje de bienvenida para flujos */}
          {isFlujo && (recurso as Flujo).pasos && (recurso as Flujo).pasos.length > 0 && (
            <div className="mb-8">
              <Card className="bg-slate-50 border-l-4 border-l-aumatia-blue">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-aumatia-dark mb-3">
                      ¡Bienvenido a tu flujo de automatización!
                    </h3>
                    <p className="text-aumatia-blue text-lg font-medium">
                      ⬇️ El botón para descargar este flujo estará disponible al finalizar todos los pasos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Steps Section for Flujos */}
          {isFlujo && (recurso as Flujo).pasos && (recurso as Flujo).pasos.length > 0 && (
            <div ref={stepsRef} className="mb-12">
              <h2 className="text-3xl font-bold text-aumatia-dark mb-8 text-center">
                📋 Pasos del flujo
              </h2>
              
              <div className="space-y-4">
                {(recurso as Flujo).pasos.map((paso, index) => {
                  const isOpen = openSteps.has(index);
                  const isCompleted = completedSteps.has(index);
                  const canOpen = index === 0 || 
                                 completedSteps.has(index - 1) || 
                                 Array.from(completedSteps).some(completed => completed >= index - 1);
                  
                  return (
                    <Card key={index} className={`border-l-4 transition-all duration-300 ${
                      isCompleted 
                        ? 'border-l-green-500 bg-green-50' 
                        : canOpen 
                          ? 'border-l-aumatia-blue bg-white' 
                          : 'border-l-gray-300 bg-gray-50'
                    } shadow-lg hover:shadow-xl`}>
                      <Collapsible open={isOpen} onOpenChange={() => handleStepToggle(index)}>
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                                  isCompleted ? 'bg-green-500' : canOpen ? 'bg-aumatia-blue' : 'bg-gray-400'
                                }`}>
                                  {isCompleted ? '✓' : index + 1}
                                </div>
                                <div>
                                  <CardTitle className={`${canOpen ? 'text-aumatia-dark' : 'text-gray-500'}`}>
                                    Paso {index + 1}
                                  </CardTitle>
                                  {!canOpen && (
                                    <Badge variant="secondary" className="mt-1 text-xs">
                                      Bloqueado
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant={isCompleted ? "default" : "outline"}
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStepComplete(index);
                                  }}
                                  className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
                                  disabled={!canOpen}
                                >
                                  {isCompleted ? 'Completado' : 'Marcar'}
                                </Button>
                                {isOpen ? (
                                  <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <CardContent className="space-y-4 pt-0">
                            <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                              {renderDescription(paso.descripcion)}
                            </div>

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
                                <h4 className="font-semibold text-aumatia-dark mb-3">Video explicativo:</h4>
                                <div className="aspect-video w-full max-w-full rounded-lg overflow-hidden shadow-md">
                                  <iframe
                                    src={convertToEmbedUrl(paso.videoUrl)}
                                    title={`Video del paso ${index + 1}`}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sección de descarga completada - Solo para flujos */}
          {isFlujo && areAllStepsCompleted() && (
            <div className="mb-12">
              <Card className="bg-green-50 border-green-200 text-center">
                <CardContent className="pt-8 pb-8">
                  <div className="space-y-4">
                    <div className="text-2xl">🎉</div>
                    <h3 className="text-2xl font-bold text-green-700">
                      ¡Has completado todos los pasos!
                    </h3>
                    <p className="text-green-600 text-lg">
                      🎁 Ahora podés descargar tu flujo de automatización
                    </p>
                    <Button
                      onClick={handleDownload}
                      size="lg"
                      className="bg-aumatia-blue hover:bg-aumatia-dark text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Descargar flujo gratis
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                      <Video className="w-5 h-5" />
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

      {/* Download Form Modal */}
      {showDownloadFormModal && isFlujo && (
        <DownloadFormModal
          isOpen={showDownloadFormModal}
          onClose={() => setShowDownloadFormModal(false)}
          flujoNombre={(recurso as Flujo).nombre}
          linkDescarga={(recurso as Flujo).link_descarga || ''}
        />
      )}
    </div>
  );
};

export default RecursoDetalle;
