
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialLinks } from "@/components/SocialLinks";
import { SEOHelmet } from "@/components/SEOHelmet";
import { BookOpen, Settings, ArrowRight, Zap, Users, Target, MessageCircle } from "lucide-react";

const Index = () => {
  return (
    <>
      <SEOHelmet 
        title="Aumatia - Recursos gratuitos para automatizar tu negocio" 
        description="Accede a workflows, tutoriales y herramientas de automatización completamente gratis. Optimiza tu negocio con Aumatia." 
        ogTitle="Aumatia - Recursos de automatización gratuitos" 
        ogDescription="Explora flujos listos para usar, tutoriales prácticos y herramientas de automatización para tu negocio. Totalmente gratis." 
        ogImage="https://i.imgur.com/wR2n4Hg.png" 
        ogUrl="https://aumatia.lovable.app" 
      />
      
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 font-poppins">
        {/* Modern Startup Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                <img 
                  src="https://i.imgur.com/wR2n4Hg.png" 
                  alt="Aumatia Logo" 
                  className="h-24 md:h-28 lg:h-32 w-auto object-contain" 
                />
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/recursos" className="text-aumatia-dark hover:text-aumatia-blue transition-colors font-medium">
                  Recursos
                </Link>
                <SocialLinks iconSize={20} className="gap-4" />
              </nav>
              
              {/* Mobile menu */}
              <div className="md:hidden">
                <SocialLinks iconSize={20} className="gap-3" />
              </div>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section - Centered and Large */}
          <section className="py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 animate-fade-in-up max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-aumatia-dark mb-8 leading-tight">
                  Automatiza sin miedo, <br className="hidden md:block" />
                  <span className="text-aumatia-blue">crece sin límites</span>
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Transforma tu negocio con soluciones inteligentes y eficientes.
                </p>
              </div>

              {/* Conversion Section - Main CTA */}
              <section className="mb-16 bg-gradient-to-r from-aumatia-blue to-aumatia-dark rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                    ¿Listo para automatizar tu negocio?
                  </h2>
                  <p className="text-lg md:text-xl mb-8 opacity-90">
                    Contanos qué procesos querés optimizar y crearemos un flujo personalizado para vos.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Button 
                      size="lg" 
                      className="bg-white text-aumatia-dark hover:bg-gray-100 hover:shadow-lg hover:-translate-y-1 font-bold text-lg px-8 md:px-12 py-4 rounded-full shadow-lg transition-all duration-300" 
                      onClick={() => window.open('https://wa.link/dmvgi0', '_blank')}
                    >
                      <Zap className="mr-3 w-6 h-6" />
                      Automatizar mi empresa
                    </Button>
                    <div className="text-white/80">
                      <p className="text-sm mb-3">O explorá nuestros recursos listos para usar</p>
                      <Link to="/recursos">
                        <Button 
                          size="lg" 
                          className="bg-[#4A90E2] text-white hover:bg-[#357ABD] hover:shadow-lg hover:-translate-y-1 font-semibold px-6 md:px-8 py-3 rounded-full transition-all duration-300"
                        >
                          Ver recursos gratuitos
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                <div className="text-center p-6 md:p-8 rounded-lg bg-white shadow-sm card-hover">
                  <div className="w-16 h-16 bg-aumatia-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-aumatia-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-aumatia-dark mb-2">Automatización Inteligente</h3>
                  <p className="text-gray-600">Workflows optimizados para maximizar tu productividad</p>
                </div>
                
                <div className="text-center p-6 md:p-8 rounded-lg bg-white shadow-sm card-hover">
                  <div className="w-16 h-16 bg-aumatia-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-aumatia-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-aumatia-dark mb-2">Comunidad Activa</h3>
                  <p className="text-gray-600">Únete a miles de profesionales que confían en Aumatia</p>
                </div>
                
                <div className="text-center p-6 md:p-8 rounded-lg bg-white shadow-sm card-hover sm:col-span-2 lg:col-span-1">
                  <div className="w-16 h-16 bg-aumatia-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-aumatia-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-aumatia-dark mb-2">Resultados Comprobados</h3>
                  <p className="text-gray-600">Soluciones probadas que generan impacto real</p>
                </div>
              </div>

              {/* Navigation Cards */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                <Card className="card-hover border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-aumatia-blue/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-aumatia-blue" />
                      </div>
                      <div>
                        <CardTitle className="text-aumatia-dark text-xl">Recursos Públicos</CardTitle>
                        <CardDescription className="text-gray-600">
                          Explora nuestros workflows y tutoriales disponibles para toda la comunidad
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link to="/recursos">
                      <Button className="w-full bg-[#4A90E2] hover:bg-[#357ABD] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group" size="lg">
                        Ver Recursos
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="card-hover border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-aumatia-dark/10 rounded-lg flex items-center justify-center">
                        <Settings className="w-6 h-6 text-aumatia-dark" />
                      </div>
                      <div>
                        <CardTitle className="text-aumatia-dark text-xl">Nuestras Redes</CardTitle>
                        <CardDescription className="text-gray-600">
                          Síguenos en nuestras redes sociales para estar al día con novedades
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <SocialLinks iconSize={28} className="gap-6" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
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
            
            <div className="border-t border-gray-600 mt-8 pt-6 text-center text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} Aumatia. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
