import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModernCheckbox } from "@/components/ui/modern-checkbox";
import { SocialLinks } from "@/components/SocialLinks";
import { PlatformChips } from "@/components/PlatformChips";
import { SEOHelmet } from "@/components/SEOHelmet";
import { DownloadModal } from "@/components/DownloadModal";
import { supabase } from "@/integrations/supabase/client";
import { convertYouTubeUrl, isValidYouTubeUrl } from "@/utils/youtubeHelper";
import { ArrowLeft, Download, Play, Copy, Loader2, CheckCircle, ChevronDown, ChevronUp, Lock } from "lucide-react";
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
  const [openSteps, setOpenSteps] = useState<number[]>([0]); // Solo el primer paso abierto por defecto
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  useEffect(() => {
    const fetchRecurso = async () => {
      if (!id) return;
      try {
        setLoading(true);
        if (tipo === 'tutorial') {
          const {
            data,
            error
          } = await supabase.from('tutoriales').select('*').eq('id', id).single();
          if (error) {
            console.error('Error fetching tutorial:', error);
          } else {
            const convertedTutorial = {
              ...data,
              plataformas: parseJsonArray(data.plataformas) as Platform[]
            };
            setTutorial(convertedTutorial);
          }
        } else {
          const {
            data,
            error
          } = await supabase.from('flujos').select('*').eq('id', id).single();
          if (error) {
            console.error('Error fetching flujo:', error);
          } else {
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
    const newCompletedSteps = completedSteps.includes(stepIndex) ? completedSteps.filter(i => i !== stepIndex) : [...completedSteps, stepIndex];
    setCompletedSteps(newCompletedSteps);

    // Si se marca como completado, cerrar el paso actual y abrir el siguiente
    if (!completedSteps.includes(stepIndex)) {
      // Cerrar el paso actual
      setOpenSteps(prev => prev.filter(i => i !== stepIndex));

      // Abrir el siguiente paso si existe
      const nextStep = stepIndex + 1;
      if (flujo && nextStep < flujo.pasos.length) {
        setOpenSteps(prev => [...prev, nextStep]);
      }
    }
  };
  const toggleStepVisibility = (stepIndex: number) => {
    // Solo permitir abrir si es un paso anterior completado o el siguiente paso disponible
    const isCompleted = completedSteps.includes(stepIndex);
    const isPreviousCompleted = stepIndex === 0 || completedSteps.includes(stepIndex - 1);
    if (isCompleted || isPreviousCompleted) {
      setOpenSteps(prev => prev.includes(stepIndex) ? prev.filter(i => i !== stepIndex) : [...prev, stepIndex]);
    }
  };
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Código copiado",
        description: "El código ha sido copiado al portapapeles"
      });
    } catch (err) {
      console.error('Error copying code:', err);
    }
  };
  const canAccessStep = (stepIndex: number) => {
    return stepIndex === 0 || completedSteps.includes(stepIndex - 1);
  };
  if (loading) {
    return <>
        <SEOHelmet title="Cargando recurso... | Aumatia" description="Cargando recurso de automatización." />
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
          <header className="bg-white text-aumatia-dark py-8 shadow-lg border-b">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4">
                <img src="https://i.imgur.com/wR2n4Hg.png" alt="Aumatia Logo" className="h-24 w-auto max-h-24 object-contain" />
                <div>
                  <h1 className="text-3xl font-bold">Cargando recurso...</h1>
                </div>
              </div>
            </div>
          </header>
          
          <main className="container mx-auto px-4 py-20">
            <div className="flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-aumatia-blue" />
              <span className="ml-2 text-lg text-aumatia-dark">Cargando...</span>
            </div>
          </main>
        </div>
      </>;
  }
  if (!flujo && !tutorial) {
    return <>
        <SEOHelmet title="Recurso no encontrado | Aumatia" description="El recurso solicitado no se encontró." />
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
          <header className="bg-white text-aumatia-dark py-8 shadow-lg border-b">
            <div className="container mx-auto px-4">
              <Link to="/recursos" className="text-aumatia-blue hover:text-aumatia-dark inline-flex items-center group">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Volver a recursos
              </Link>
            </div>
          </header>
          
          <main className="container mx-auto px-4 py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-aumatia-dark mb-4">Recurso no encontrado</h2>
              <p className="text-gray-600">El recurso que buscas no existe o ha sido eliminado.</p>
            </div>
          </main>
        </div>
      </>;
  }

  // Render Tutorial
  if (tutorial) {
    return <>
        <SEOHelmet title={`${tutorial.titulo} | Tutorial Aumatia`} description={tutorial.descripcion || "Tutorial paso a paso de automatización con Aumatia"} ogTitle={`${tutorial.titulo} | Tutorial Aumatia`} ogDescription={tutorial.descripcion || "Tutorial paso a paso de automatización con Aumatia"} ogImage={tutorial.imagen_url || "https://i.imgur.com/wR2n4Hg.png"} ogUrl={`https://aumatia.lovable.app/recursos/detalle?id=${tutorial.id}&tipo=tutorial`} />
        
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 font-poppins">
          <header className="bg-white text-aumatia-dark py-8 shadow-lg border-b">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Link to="/recursos" className="text-aumatia-blue hover:text-aumatia-dark mb-4 inline-flex items-center group transition-colors">
                  <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Volver a recursos
                </Link>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src="https://i.imgur.com/wR2n4Hg.png" alt="Aumatia Logo" className="h-24 w-auto max-h-24 object-contain" />
                    <div>
                      <h1 className="text-3xl font-bold">{tutorial.titulo}</h1>
                      <p className="text-lg text-aumatia-blue font-medium">Automatiza sin miedo, crece sin límites</p>
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
                      <img src={tutorial.imagen_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"} alt={tutorial.titulo} className="w-full h-64 object-cover rounded-lg shadow-md" onError={e => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop";
                    }} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-aumatia-dark mb-4">{tutorial.titulo}</h2>
                      <p className="text-gray-600 text-lg leading-relaxed mb-6">{tutorial.descripcion}</p>
                      <PlatformChips platforms={tutorial.plataformas || []} />
                    </div>
                  </div>

                  {tutorial.video_url && <div className="video-container">
                      {isValidYouTubeUrl(tutorial.video_url) ? <iframe src={convertYouTubeUrl(tutorial.video_url)} title={tutorial.titulo} frameBorder="0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> : <div className="bg-gray-100 p-8 rounded-lg text-center">
                          <p className="text-gray-600">🎥 Este video no está disponible</p>
                        </div>}
                    </div>}
                </CardContent>
              </Card>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-aumatia-dark text-white py-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img src="https://i.imgur.com/wR2n4Hg.png" alt="Aumatia Logo" className="h-10 w-auto" />
                  <div>
                    <h3 className="text-xl font-bold">Aumatia</h3>
                    <p className="text-gray-300 text-sm">Automatiza sin miedo, crece sin límites</p>
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
      </>;
  }

  // Render Flujo
  return <>
      <SEOHelmet title={`${flujo?.nombre} | Workflow Aumatia`} description={flujo?.descripcion || "Workflow de automatización paso a paso con Aumatia"} ogTitle={`${flujo?.nombre} | Workflow Aumatia`} ogDescription={flujo?.descripcion || "Workflow de automatización paso a paso"} ogImage={flujo?.imagen_url || "https://i.imgur.com/wR2n4Hg.png"} ogUrl={`https://aumatia.lovable.app/recursos/detalle?id=${flujo?.id}`} />
      
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 font-poppins">
        <header className="bg-white text-aumatia-dark py-8 shadow-lg border-b my-0">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link to="/recursos" className="text-aumatia-blue hover:text-aumatia-dark mb-4 inline-flex items-center group transition-colors">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Volver a recursos
              </Link>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="https://i.imgur.com/wR2n4Hg.png" alt="Aumatia Logo" className="h-24 w-auto max-h-24 object-contain" />
                  <div>
                    
                    
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
                    <img src={flujo?.imagen_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop"} alt={flujo?.nombre} className="w-full h-64 object-cover rounded-lg shadow-md" onError={e => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop";
                  }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-aumatia-dark mb-4">{flujo?.nombre}</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">{flujo?.descripcion}</p>
                    <PlatformChips platforms={flujo?.plataformas || []} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Steps with improved UX */}
            {flujo?.pasos && flujo.pasos.length > 0 && <div className="space-y-6">
                <h3 className="text-2xl font-bold text-aumatia-dark text-center">
                  📋 Pasos del Flujo ({completedSteps.length}/{flujo.pasos.length} completados)
                </h3>
                
                {flujo.pasos.map((paso, index) => {
              const isCompleted = completedSteps.includes(index);
              const isOpen = openSteps.includes(index);
              const canAccess = canAccessStep(index);
              return <Card key={index} className={`border-0 shadow-lg transition-all duration-500 ${isCompleted ? 'bg-green-50 border-l-4 border-l-green-500' : canAccess ? 'bg-aumatia-blue/5 border-l-4 border-l-aumatia-blue' : 'bg-gray-50 border-l-4 border-l-gray-300'}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-aumatia-dark flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isCompleted ? 'bg-green-500' : canAccess ? 'bg-aumatia-blue' : 'bg-gray-400'}`}>
                              {isCompleted ? <CheckCircle size={16} /> : index + 1}
                            </span>
                            Paso {index + 1}
                          </CardTitle>
                          
                          <div className="flex items-center gap-2">
                            {canAccess && <ModernCheckbox id={`step-${index}`} checked={isCompleted} onCheckedChange={() => toggleStep(index)} label="Completar" />}
                            
                            {canAccess ? <Button variant="ghost" size="sm" onClick={() => toggleStepVisibility(index)} className="p-2">
                                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </Button> : <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Lock size={16} />
                                🔒 Completá el paso anterior
                              </div>}
                          </div>
                        </div>
                      </CardHeader>
                      
                      {isOpen && canAccess && <CardContent className="space-y-6">
                          {/* Video first (reordered) */}
                          {paso.videoUrl && <div>
                              <h4 className="font-semibold text-aumatia-dark mb-2 flex items-center gap-2">
                                <Play size={18} />
                                Video del paso:
                              </h4>
                              <div className="video-container">
                                {isValidYouTubeUrl(paso.videoUrl) ? <iframe src={convertYouTubeUrl(paso.videoUrl)} title={`Video del paso ${index + 1}`} frameBorder="0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> : <div className="bg-gray-100 p-8 rounded-lg text-center">
                                    <p className="text-gray-600">🎥 Este video no está disponible</p>
                                  </div>}
                              </div>
                            </div>}

                          {/* Description second */}
                          <p className="text-gray-700 text-lg leading-relaxed">{paso.descripcion}</p>

                          {/* Code block last with scroll for long content */}
                          {paso.codigo && <div>
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-aumatia-dark">Código:</h4>
                                <Button variant="outline" size="sm" onClick={() => copyCode(paso.codigo)} className="text-aumatia-blue border-aumatia-blue hover:bg-aumatia-blue hover:text-white">
                                  <Copy size={16} className="mr-1" />
                                  📋 Copiar
                                </Button>
                              </div>
                              <pre className={`bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono ${paso.codigo.length > 200 ? 'max-h-[200px] overflow-y-scroll' : ''}`}>
                                <code>{paso.codigo}</code>
                              </pre>
                            </div>}
                        </CardContent>}
                    </Card>;
            })}
              </div>}

            {/* Download Section - Enhanced */}
            {flujo?.link_descarga && <Card className="border-0 shadow-lg bg-gradient-to-r from-aumatia-blue to-aumatia-dark text-white">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-6">🎉 ¡Felicitaciones!</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Has completado {completedSteps.length} de {flujo?.pasos?.length || 0} pasos. 
                    Descarga el flujo completo para tenerlo siempre disponible.
                  </p>
                  <Button size="lg" className="bg-white text-aumatia-dark hover:bg-gray-100 font-semibold px-12 py-4 text-lg rounded-full shadow-lg hover:scale-105 transition-all duration-300" onClick={() => setShowDownloadModal(true)}>
                    <Download className="mr-3 w-6 h-6" />
                    ⬇️ Descargar este flujo
                  </Button>
                </CardContent>
              </Card>}

          </div>
        </main>

        {/* Download Modal */}
        {flujo && <DownloadModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} flujo={{
        nombre: flujo.nombre,
        link_descarga: flujo.link_descarga
      }} />}

        {/* Footer */}
        <footer className="bg-aumatia-dark text-white py-12 mt-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img src="https://i.imgur.com/wR2n4Hg.png" alt="Aumatia Logo" className="h-10 w-auto" />
                <div>
                  <h3 className="text-xl font-bold">Aumatia</h3>
                  <p className="text-gray-300 text-sm">Automatiza sin miedo, crece sin límites</p>
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
    </>;
};
export default RecursoDetalle;