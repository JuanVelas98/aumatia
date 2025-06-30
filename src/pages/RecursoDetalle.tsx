import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlatformEditor } from "@/components/PlatformEditor";
import { SocialLinks } from "@/components/SocialLinks";
import { SEOHelmet } from "@/components/SEOHelmet";
import { DynamicHeader } from "@/components/DynamicHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useEventTracking } from "@/hooks/useEventTracking";
import { useScrollVisibility } from "@/hooks/useScrollVisibility";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  ExternalLink, 
  FileText, 
  Video,
  Copy,
  CheckCircle,
  AlertCircle
} from "lucide-react";

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
  const location = useLocation();
  const navigate = useNavigate();
  const { registrarEvento } = useEventTracking();
  const [recurso, setRecurso] = useState<Flujo | Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [editingPasoIndex, setEditingPasoIndex] = useState<number | null>(null);
  const [newPaso, setNewPaso] = useState<Paso>({ descripcion: '', codigo: '', videoUrl: '' });
  const [pasos, setPasos] = useState<Paso[]>([]);
  const [plataformas, setPlataformas] = useState<Platform[]>([]);
  const [showPlatformEditor, setShowPlatformEditor] = useState(false);
  const [id, setID] = useState<string | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id');
    const tipoParam = params.get('tipo') || 'flujo';

    if (!idParam) {
      setError('ID del recurso no proporcionado.');
      setLoading(false);
      return;
    }

    setID(idParam);
    setTipo(tipoParam);
    fetchRecurso(idParam, tipoParam);
  }, [location.search]);

  const fetchRecurso = async (id: string, tipo: string) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (tipo === 'tutorial') {
        response = await supabase
          .from('tutoriales')
          .select('*')
          .eq('id', id)
          .single();
      } else {
        response = await supabase
          .from('flujos')
          .select('*')
          .eq('id', id)
          .single();
      }

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data) {
        throw new Error('Recurso no encontrado.');
      }

      if (tipo === 'tutorial') {
        const tutorial = {
          ...response.data,
          plataformas: Array.isArray(response.data.plataformas) ? response.data.plataformas : (response.data.plataformas ? JSON.parse(String(response.data.plataformas)) : [])
        } as Tutorial;
        setRecurso(tutorial);
        setPlataformas(tutorial.plataformas || []);
      } else {
        const flujo = {
          ...response.data,
          pasos: Array.isArray(response.data.pasos) ? response.data.pasos : (response.data.pasos ? JSON.parse(String(response.data.pasos)) : []),
          plataformas: Array.isArray(response.data.plataformas) ? response.data.plataformas : (response.data.plataformas ? JSON.parse(String(response.data.plataformas)) : [])
        } as Flujo;
        setRecurso(flujo);
        setPasos(flujo.pasos || []);
        setPlataformas(flujo.plataformas || []);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar el recurso.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasoUpdate = async (index: number, field: keyof Paso, value: string) => {
    const newPasos = [...pasos];
    newPasos[index] = { ...newPasos[index], [field]: value };
    setPasos(newPasos);
  
    // Optimistic update
    setRecurso(prevRecurso => {
      if (prevRecurso && 'pasos' in prevRecurso) {
        const updatedPasos = [...prevRecurso.pasos];
        updatedPasos[index] = { ...updatedPasos[index], [field]: value };
        return { ...prevRecurso, pasos: updatedPasos };
      }
      return prevRecurso;
    });
  
    try {
      if (tipo === 'flujo' && id) {
        const updatedPasos = [...pasos]; // Use the local state 'pasos'
        updatedPasos[index] = { ...updatedPasos[index], [field]: value };
  
        const { data, error } = await supabase
          .from('flujos')
          .update({ pasos: updatedPasos })
          .eq('id', id);
  
        if (error) {
          throw error;
        }
  
        toast({
          title: "Éxito",
          description: "Paso actualizado correctamente"
        });
      }
    } catch (error: any) {
      console.error("Error updating paso:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el paso",
        variant: "destructive"
      });
    }
  };

  const handleAddPaso = async () => {
    if (!newPaso.descripcion.trim() || !newPaso.codigo.trim()) {
      toast({
        title: "Error",
        description: "Descripción y código son requeridos",
        variant: "destructive"
      });
      return;
    }
  
    try {
      if (tipo === 'flujo' && id) {
        const updatedPasos = [...pasos, newPaso];
  
        const { data, error } = await supabase
          .from('flujos')
          .update({ pasos: updatedPasos })
          .eq('id', id);
  
        if (error) {
          throw error;
        }
  
        setPasos(updatedPasos);
        setRecurso(prevRecurso => {
          if (prevRecurso && 'pasos' in prevRecurso) {
            return { ...prevRecurso, pasos: updatedPasos };
          }
          return prevRecurso;
        });
        setNewPaso({ descripcion: '', codigo: '', videoUrl: '' });
  
        toast({
          title: "Éxito",
          description: "Paso agregado correctamente"
        });
      }
    } catch (error: any) {
      console.error("Error adding paso:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar el paso",
        variant: "destructive"
      });
    }
  };

  const handleRemovePaso = async (indexToRemove: number) => {
    try {
      if (tipo === 'flujo' && id) {
        const updatedPasos = pasos.filter((_, index) => index !== indexToRemove);
  
        const { data, error } = await supabase
          .from('flujos')
          .update({ pasos: updatedPasos })
          .eq('id', id);
  
        if (error) {
          throw error;
        }
  
        setPasos(updatedPasos);
        setRecurso(prevRecurso => {
          if (prevRecurso && 'pasos' in prevRecurso) {
            return { ...prevRecurso, pasos: updatedPasos };
          }
          return prevRecurso;
        });
  
        toast({
          title: "Éxito",
          description: "Paso eliminado correctamente"
        });
      }
    } catch (error: any) {
      console.error("Error removing paso:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el paso",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePlatforms = async (updatedPlatforms: Platform[]) => {
    try {
      if (tipo === 'tutorial' && id) {
        const { data, error } = await supabase
          .from('tutoriales')
          .update({ plataformas: updatedPlatforms })
          .eq('id', id);

        if (error) {
          throw error;
        }

        setPlataformas(updatedPlatforms);
        setRecurso(prevRecurso => {
          if (prevRecurso && 'plataformas' in prevRecurso) {
            return { ...prevRecurso, plataformas: updatedPlatforms };
          }
          return prevRecurso;
        });

        toast({
          title: "Éxito",
          description: "Plataformas actualizadas correctamente"
        });
      } else if (tipo === 'flujo' && id) {
        const { data, error } = await supabase
          .from('flujos')
          .update({ plataformas: updatedPlatforms })
          .eq('id', id);

        if (error) {
          throw error;
        }

        setPlataformas(updatedPlatforms);
        setRecurso(prevRecurso => {
          if (prevRecurso && 'plataformas' in prevRecurso) {
            return { ...prevRecurso, plataformas: updatedPlatforms };
          }
          return prevRecurso;
        });

        toast({
          title: "Éxito",
          description: "Plataformas actualizadas correctamente"
        });
      }
    } catch (error: any) {
      console.error("Error updating plataformas:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar las plataformas",
        variant: "destructive"
      });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
        toast({
          title: "Error",
          description: "No se pudo copiar el código",
          variant: "destructive"
        });
      });
  };

  // Scroll visibility tracking
  const recursoRef = useScrollVisibility({ 
    descripcion: 'Visualización detalle recurso', 
    recurso_id: id || 'unknown'
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aumatia-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando recurso...</p>
        </div>
      </div>
    );
  }

  if (error || !recurso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recurso no encontrado</h1>
          <p className="text-gray-600 mb-6">
            El recurso que buscas no existe o ha sido eliminado.
          </p>
          <Link to="/recursos">
            <Button className="bg-aumatia-blue hover:bg-aumatia-dark">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Volver a Recursos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const esTutorial = tipo === 'tutorial';

  return (
    <>
      <SEOHelmet 
        title={`${recurso.nombre || recurso.titulo} - Aumatia`}
        description={recurso.descripcion || `Recurso de automatización: ${recurso.nombre || recurso.titulo}`}
        ogTitle={`${recurso.nombre || recurso.titulo} - Aumatia`}
        ogDescription={recurso.descripcion || `Descubre este recurso de automatización en Aumatia`}
        ogImage={recurso.imagen_url || "https://i.imgur.com/wR2n4Hg.png"}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <DynamicHeader>
          <nav className="flex items-center gap-4">
            <Link to="/recursos">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Recursos
              </Button>
            </Link>
            <SocialLinks iconSize={20} className="gap-3" />
          </nav>
        </DynamicHeader>

        <main className="container mx-auto px-4 py-8">
          <div ref={recursoRef} className="max-w-4xl mx-auto">
            <Card className="shadow-lg rounded-lg">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-x-4 p-6">
                <div>
                  <CardTitle className="text-2xl font-bold text-aumatia-dark">
                    {esTutorial ? (recurso as Tutorial).titulo : (recurso as Flujo).nombre}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {esTutorial ? (recurso as Tutorial).descripcion : (recurso as Flujo).descripcion}
                  </CardDescription>
                </div>
                {esTutorial ? (
                  <div className="flex items-center gap-2">
                    {((recurso as Tutorial).video_url) && (
                      <a href={(recurso as Tutorial).video_url} target="_blank" rel="noopener noreferrer">
                        <Button>
                          <Video className="mr-2 w-4 h-4" />
                          Ver Tutorial
                        </Button>
                      </a>
                    )}
                    <Link to="/admin_recursos">
                      <Button variant="outline">
                        <Settings className="mr-2 w-4 h-4" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {((recurso as Flujo).link_descarga) && (
                      <a href={(recurso as Flujo).link_descarga} target="_blank" rel="noopener noreferrer">
                        <Button>
                          <FileText className="mr-2 w-4 h-4" />
                          Descargar Flujo
                        </Button>
                      </a>
                    )}
                    <Link to="/admin_recursos">
                      <Button variant="outline">
                        <Settings className="mr-2 w-4 h-4" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                )}
              </CardHeader>

              {((recurso as Flujo).imagen_url || (recurso as Tutorial).imagen_url) && (
                <img
                  src={(recurso as Flujo).imagen_url || (recurso as Tutorial).imagen_url}
                  alt={esTutorial ? (recurso as Tutorial).titulo : (recurso as Flujo).nombre}
                  className="w-full object-cover rounded-b-lg"
                />
              )}

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-aumatia-dark mb-4">
                  Plataformas Utilizadas
                </h3>
                {plataformas && plataformas.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {plataformas.map((platform, index) => (
                      <a
                        key={index}
                        href={platform.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        {platform.nombre}
                        <ExternalLink className="ml-1 w-4 h-4" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No se especificaron plataformas.</p>
                )}

                {!esTutorial && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-aumatia-dark">
                        Pasos del Flujo
                      </h3>
                      <Button variant="secondary" size="sm" onClick={() => setShowAllSteps(!showAllSteps)}>
                        {showAllSteps ? 'Ver menos pasos' : 'Ver todos los pasos'}
                      </Button>
                    </div>

                    {pasos.slice(0, showAllSteps ? pasos.length : 3).map((paso, index) => (
                      <Card key={index} className="mb-4 border">
                        <CardHeader>
                          <CardTitle>Paso {index + 1}</CardTitle>
                          <CardDescription>{paso.descripcion}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="relative">
                            <Textarea
                              value={paso.codigo}
                              onChange={(e) => handlePasoUpdate(index, 'codigo', e.target.value)}
                              rows={4}
                              className="w-full rounded-md resize-none"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 text-gray-500 hover:text-aumatia-blue"
                              onClick={() => handleCopyToClipboard(paso.codigo)}
                              disabled={isCopied}
                            >
                              {isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                          {paso.videoUrl && (
                            <a href={paso.videoUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="link">
                                Ver Video
                                <ExternalLink className="ml-1 w-4 h-4" />
                              </Button>
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {!showAllSteps && pasos.length > 3 && (
                      <p className="text-center text-gray-500">
                        Mostrando los primeros 3 pasos. Haz clic en "Ver todos los pasos" para ver el resto.
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default RecursoDetalle;
