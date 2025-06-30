import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PlatformChips } from "@/components/PlatformChips";
import { ResourceFilters } from "@/components/ResourceFilters";
import { SEOHelmet } from "@/components/SEOHelmet";
import { SocialLinks } from "@/components/SocialLinks";
import { DynamicHeader } from "@/components/DynamicHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ChevronRight, Play, Download } from "lucide-react";

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
  pasos: string[];
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

const Recursos = () => {
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [tutoriales, setTutoriales] = useState<Tutorial[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'flujos' | 'tutoriales'>('flujos');
  const navigate = useNavigate();

  const fetchFlujos = async () => {
    try {
      const { data, error } = await supabase
        .from('flujos')
        .select('*')
        .order('creado_en', { ascending: false });
      
      if (error) {
        console.error('Error fetching flujos:', error);
      } else {
        const convertedFlujos = (data || []).map(flujo => ({
          ...flujo,
          plataformas: parseJsonArray(flujo.plataformas) as Platform[],
          pasos: parseJsonArray(flujo.pasos) as string[]
        }));
        setFlujos(convertedFlujos);
      }
    } catch (error) {
      console.error('Error fetching flujos:', error);
    }
  };

  const fetchTutoriales = async () => {
    try {
      const { data, error } = await supabase
        .from('tutoriales')
        .select('*')
        .order('creado_en', { ascending: false });
      
      if (error) {
        console.error('Error fetching tutoriales:', error);
      } else {
        const convertedTutoriales = (data || []).map(tutorial => ({
          ...tutorial,
          plataformas: parseJsonArray(tutorial.plataformas) as Platform[]
        }));
        setTutoriales(convertedTutoriales);
      }
    } catch (error) {
      console.error('Error fetching tutoriales:', error);
    }
  };

  useEffect(() => {
    fetchFlujos();
    fetchTutoriales();
  }, []);

  // Filter logic
  const filteredFlujos = flujos.filter(flujo => {
    const matchesSearch = flujo.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         flujo.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatforms.length === 0 || 
                           flujo.plataformas.some(plat => selectedPlatforms.includes(plat.nombre));
    return matchesSearch && matchesPlatform;
  });

  const filteredTutoriales = tutoriales.filter(tutorial => {
    const matchesSearch = tutorial.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatforms.length === 0 || 
                           tutorial.plataformas.some(plat => selectedPlatforms.includes(plat.nombre));
    return matchesSearch && matchesPlatform;
  });

  const allPlatforms = Array.from(new Set([
    ...flujos.flatMap(f => f.plataformas.map(p => p.nombre)),
    ...tutoriales.flatMap(t => t.plataformas.map(p => p.nombre))
  ]));

  const handleVerMas = (id: string, tipo: 'flujo' | 'tutorial') => {
    navigate(`/recursos/detalle?id=${id}&tipo=${tipo}`);
  };

  return (
    <>
      <SEOHelmet 
        title="Recursos de automatización - Aumatia" 
        description="Descarga workflows gratuitos y mira tutoriales para automatizar tu negocio. Recursos listos para usar con las mejores herramientas de automatización." 
        ogTitle="Recursos gratuitos de automatización" 
        ogDescription="Workflows, tutoriales y herramientas para automatizar tu negocio. Completamente gratis." 
        ogImage="https://i.imgur.com/wR2n4Hg.png" 
        ogUrl="https://aumatia.lovable.app/recursos" 
      />
      
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 font-poppins">
        <DynamicHeader>
          <nav className="hidden md:flex items-center gap-6">
            <SocialLinks iconSize={20} className="gap-4" />
          </nav>
          
          <div className="md:hidden">
            <SocialLinks iconSize={20} className="gap-3" />
          </div>
        </DynamicHeader>

        <main>
          <ScrollReveal>
            <section className="py-16 md:py-20 bg-gradient-to-r from-aumatia-blue to-aumatia-dark text-white">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Recursos gratuitos de automatización
                </h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
                  Descarga workflows listos para usar y aprende con nuestros tutoriales prácticos. 
                  Todo completamente gratis para ayudarte a automatizar tu negocio.
                </p>
              </div>
            </section>
          </ScrollReveal>

          <section className="py-12">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <ResourceFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedPlatforms={selectedPlatforms}
                  onPlatformChange={setSelectedPlatforms}
                  allPlatforms={allPlatforms}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </ScrollReveal>

              {activeTab === 'flujos' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                  {filteredFlujos.map((flujo, index) => (
                    <ScrollReveal key={flujo.id} delay={index * 100}>
                      <Card className="h-full flex flex-col card-hover border-0 shadow-md bg-white">
                        <div className="relative">
                          {flujo.imagen_url && (
                            <img 
                              src={flujo.imagen_url} 
                              alt={flujo.nombre}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-aumatia-blue hover:bg-aumatia-dark">
                              Flujo
                            </Badge>
                          </div>
                        </div>
                        
                        <CardHeader className="flex-1">
                          <CardTitle className="text-aumatia-dark text-lg leading-tight">
                            {flujo.nombre}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 line-clamp-3">
                            {flujo.descripcion}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="mb-4">
                            <PlatformChips platforms={flujo.plataformas} />
                          </div>
                          
                          <Button 
                            onClick={() => handleVerMas(flujo.id, 'flujo')}
                            className="w-full bg-aumatia-blue hover:bg-aumatia-dark transition-all duration-300 group"
                          >
                            Ver más
                            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  ))}
                </div>
              )}

              {activeTab === 'tutoriales' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                  {filteredTutoriales.map((tutorial, index) => (
                    <ScrollReveal key={tutorial.id} delay={index * 100}>
                      <Card className="h-full flex flex-col card-hover border-0 shadow-md bg-white">
                        <div className="relative">
                          {tutorial.imagen_url && (
                            <img 
                              src={tutorial.imagen_url} 
                              alt={tutorial.titulo}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-green-600 hover:bg-green-700">
                              <Play className="w-3 h-3 mr-1" />
                              Tutorial
                            </Badge>
                          </div>
                        </div>
                        
                        <CardHeader className="flex-1">
                          <CardTitle className="text-aumatia-dark text-lg leading-tight">
                            {tutorial.titulo}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 line-clamp-3">
                            {tutorial.descripcion}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="mb-4">
                            <PlatformChips platforms={tutorial.plataformas} />
                          </div>
                          
                          <Button 
                            onClick={() => handleVerMas(tutorial.id, 'tutorial')}
                            className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 group"
                          >
                            Ver tutorial
                            <Play className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  ))}
                </div>
              )}

              {((activeTab === 'flujos' && filteredFlujos.length === 0) || 
                (activeTab === 'tutoriales' && filteredTutoriales.length === 0)) && (
                <ScrollReveal>
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Download className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-aumatia-dark mb-4">
                      No se encontraron {activeTab === 'flujos' ? 'flujos' : 'tutoriales'}
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Prueba ajustando los filtros o la búsqueda para encontrar el contenido que necesitas.
                    </p>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </section>
        </main>

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
            
            <div className="border-t border-gray-600 mt-8 pt-6 text-center text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} Aumatia. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Recursos;
