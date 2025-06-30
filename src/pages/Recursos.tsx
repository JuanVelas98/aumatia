
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialLinks } from "@/components/SocialLinks";
import { PlatformChips } from "@/components/PlatformChips";
import { ResourceFilters } from "@/components/ResourceFilters";
import { SEOHelmet } from "@/components/SEOHelmet";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ExternalLink, Play, Loader2 } from "lucide-react";

interface Platform {
  nombre: string;
  link: string;
}
interface Flujo {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  link_descarga: string;
  plataformas: Platform[];
  creado_en: string;
}
interface Tutorial {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  video_url: string;
  plataformas: Platform[];
  creado_en: string;
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

const Recursos = () => {
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [tutoriales, setTutoriales] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        setLoading(true);

        // Fetch flujos
        const {
          data: flujosData,
          error: flujosError
        } = await supabase.from('flujos').select('*').order('creado_en', {
          ascending: false
        });
        if (flujosError) {
          console.error('Error fetching flujos:', flujosError);
        } else {
          // Convert Json fields to typed arrays
          const convertedFlujos = (flujosData || []).map(flujo => ({
            ...flujo,
            plataformas: parseJsonArray(flujo.plataformas) as Platform[]
          }));
          setFlujos(convertedFlujos);
        }

        // Fetch tutoriales
        const {
          data: tutorialesData,
          error: tutorialesError
        } = await supabase.from('tutoriales').select('*').order('creado_en', {
          ascending: false
        });
        if (tutorialesError) {
          console.error('Error fetching tutoriales:', tutorialesError);
        } else {
          // Convert Json fields to typed arrays
          const convertedTutoriales = (tutorialesData || []).map(tutorial => ({
            ...tutorial,
            plataformas: parseJsonArray(tutorial.plataformas) as Platform[]
          }));
          setTutoriales(convertedTutoriales);
        }
      } catch (error) {
        console.error('Error general:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecursos();
  }, []);

  // Filter logic
  const filteredFlujos = activeFilter === 'tutoriales' ? [] : flujos;
  const filteredTutoriales = activeFilter === 'flujos' ? [] : tutoriales;

  if (loading) {
    return <>
        <SEOHelmet title="Cargando recursos... | Aumatia" description="Cargando recursos de automatización gratuitos para tu negocio." />
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
          {/* Modern Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                  <img 
                    src="https://i.imgur.com/wR2n4Hg.png" 
                    alt="Aumatia Logo" 
                    className="h-24 md:h-28 lg:h-32 w-auto object-contain" 
                  />
                </Link>
                <SocialLinks iconSize={20} className="gap-4" />
              </div>
            </div>
          </header>
          
          <main className="container mx-auto px-4 py-20">
            <div className="flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-aumatia-blue" />
              <span className="ml-2 text-lg text-aumatia-dark">Cargando recursos...</span>
            </div>
          </main>
        </div>
      </>;
  }

  return <>
      <SEOHelmet title="Recursos gratuitos para automatizar tu negocio | Aumatia" description="Explora flujos listos para usar, tutoriales prácticos y agentes automatizados para tu negocio. Totalmente gratis." ogTitle="Recursos de automatización | Aumatia" ogDescription="Accede a flujos, tutoriales y herramientas sin costo para mejorar tu operación." ogImage="https://i.imgur.com/wR2n4Hg.png" ogUrl="https://aumatia.lovable.app/recursos" />
      
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
        {/* Modern Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                  <img 
                    src="https://i.imgur.com/wR2n4Hg.png" 
                    alt="Aumatia Logo" 
                    className="h-24 md:h-28 lg:h-32 w-auto object-contain" 
                  />
                </Link>
                <SocialLinks iconSize={20} className="gap-4" />
              </div>
              
              <Link to="/" className="text-aumatia-blue hover:text-aumatia-dark mb-6 inline-flex items-center group transition-colors">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Volver al inicio
              </Link>
              
              {/* Hero Section for Resources */}
              <div className="text-center py-12 md:py-16 bg-gradient-to-r from-aumatia-blue/10 to-aumatia-dark/10 rounded-2xl mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-aumatia-dark mb-4">
                  🚀 Recursos de Automatización
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Descubre workflows listos para usar, tutoriales paso a paso y herramientas que transformarán tu negocio. 
                  <span className="block mt-2 font-semibold text-aumatia-blue">
                    Completamente gratis y diseñados para impulsar tu productividad.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
            
            {/* Filtros de navegación */}
            <ResourceFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} flujosCount={flujos.length} tutorialesCount={tutoriales.length} />

            {/* Workflows Section */}
            {activeFilter !== 'tutoriales' && <section className="animate-fade-in-up">
                <div className="text-center mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-aumatia-dark mb-4">
                    🚀 Workflows de Automatización
                  </h2>
                  <p className="text-gray-600 text-base md:text-lg">
                    Descarga flujos completos y optimizados para tu negocio
                  </p>
                </div>

                {filteredFlujos.length > 0 ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredFlujos.map(flujo => <article key={flujo.id} className="card-hover border-0 shadow-lg bg-white overflow-hidden rounded-lg">
                        <div className="aspect-video relative overflow-hidden">
                          <img src={flujo.imagen_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop"} alt={flujo.nombre} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onError={e => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop";
                  }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-bold text-lg md:text-xl mb-1 line-clamp-2">{flujo.nombre}</h3>
                          </div>
                        </div>
                        
                        <CardContent className="p-4 md:p-6">
                          <CardDescription className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed line-clamp-3">
                            {flujo.descripcion}
                          </CardDescription>

                          <PlatformChips platforms={flujo.plataformas || []} className="mb-4" />

                          <Link to={`/recursos/detalle?id=${flujo.id}`} className="block">
                            <Button className="w-full bg-[#4A90E2] hover:bg-[#357ABD] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                              <Play className="mr-2 w-4 h-4" />
                              Ver Flujo
                              <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </CardContent>
                      </article>)}
                  </div> : <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500 text-lg">No hay workflows disponibles en este momento.</p>
                    <p className="text-gray-400">¡Vuelve pronto para ver nuevos recursos!</p>
                  </div>}
              </section>}

            {/* Tutorials Section */}
            {activeFilter !== 'flujos' && <section className="animate-fade-in-up">
                <div className="text-center mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-aumatia-dark mb-4">
                    🎥 Tutoriales Paso a Paso
                  </h2>
                  <p className="text-gray-600 text-base md:text-lg">
                    Aprende con videos detallados y fáciles de seguir
                  </p>
                </div>

                {filteredTutoriales.length > 0 ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredTutoriales.map(tutorial => <article key={tutorial.id} className="card-hover border-0 shadow-lg bg-white overflow-hidden rounded-lg">
                        <div className="aspect-video relative overflow-hidden">
                          <img src={tutorial.imagen_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop"} alt={tutorial.titulo} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onError={e => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop";
                  }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-bold text-lg md:text-xl mb-1 line-clamp-2">{tutorial.titulo}</h3>
                          </div>
                          <div className="absolute top-4 right-4">
                            <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
                              VIDEO
                            </div>
                          </div>
                        </div>
                        
                        <CardContent className="p-4 md:p-6">
                          <CardDescription className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed line-clamp-3">
                            {tutorial.descripcion}
                          </CardDescription>

                          <PlatformChips platforms={tutorial.plataformas || []} className="mb-4" />

                          <Link to={`/recursos/detalle?id=${tutorial.id}&tipo=tutorial`}>
                            <Button className="w-full bg-[#4A90E2] hover:bg-[#357ABD] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                              <Play className="mr-2 w-4 h-4" />
                              Ver Tutorial
                              <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </CardContent>
                      </article>)}
                  </div> : <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500 text-lg">No hay tutoriales disponibles en este momento.</p>
                    <p className="text-gray-400">¡Vuelve pronto para ver nuevos contenidos!</p>
                  </div>}
              </section>}
          </div>
        </main>

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

export default Recursos;
