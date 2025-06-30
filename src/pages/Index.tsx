import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialLinks } from "@/components/SocialLinks";
import { SEOHelmet } from "@/components/SEOHelmet";
import { BookOpen, Settings, ArrowRight, Zap, Users, Target, Download, MessageCircle } from "lucide-react";
const Index = () => {
  return <>
      <SEOHelmet title="Aumatia - Recursos gratuitos para automatizar tu negocio" description="Accede a workflows, tutoriales y herramientas de automatización completamente gratis. Optimiza tu negocio con Aumatia." ogTitle="Aumatia - Recursos de automatización gratuitos" ogDescription="Explora flujos listos para usar, tutoriales prácticos y herramientas de automatización para tu negocio. Totalmente gratis." ogImage="https://i.imgur.com/wR2n4Hg.png" ogUrl="https://aumatia.lovable.app" />
      
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 font-poppins">
        {/* Header with white background */}
        <header className="bg-white text-aumatia-dark py-8 shadow-lg border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="https://i.imgur.com/wR2n4Hg.png" alt="Aumatia Logo" className="h-12 w-auto" />
                <div>
                  
                  <p className="text-lg text-aumatia-blue font-medium -bottom-1/3 ">Automatiza sin miedo, crece sin límites</p>
                </div>
              </div>
              <SocialLinks iconSize={24} />
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 animate-fade-in-up">
                <h2 className="text-5xl font-bold text-aumatia-dark mb-6">
                  Bienvenido a <span className="text-aumatia-blue">Aumatia</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Accede a nuestros workflows de automatización y tutoriales paso a paso para optimizar tus procesos. 
                  Transforma tu negocio con soluciones inteligentes y eficientes.
                </p>
              </div>

              {/* Conversion Section - Main CTA */}
              <section className="mb-16 bg-gradient-to-r from-aumatia-blue to-aumatia-dark rounded-3xl p-12 text-white text-center shadow-2xl">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-4xl font-bold mb-6">
                    ¿Listo para automatizar tu negocio?
                  </h3>
                  <p className="text-xl mb-8 opacity-90">
                    Contanos qué procesos querés optimizar y crearemos un flujo personalizado para vos.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button size="lg" className="bg-white text-aumatia-dark hover:bg-gray-100 font-bold text-lg px-12 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300" onClick={() => window.open('https://wa.link/dmvgi0', '_blank')}>
                      <Zap className="mr-3 w-6 h-6" />
                      Automatizar mi empresa
                    </Button>
                    <div className="text-white/80">
                      <p className="text-sm mb-2">O explorá nuestros recursos listos para usar</p>
                      <Link to="/recursos">
                        <Button variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-full">
                          Ver recursos gratuitos
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="text-center p-6 rounded-lg bg-white shadow-sm card-hover">
                  <div className="w-16 h-16 bg-aumatia-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-aumatia-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-aumatia-dark mb-2">Automatización Inteligente</h3>
                  <p className="text-gray-600">Workflows optimizados para maximizar tu productividad</p>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-white shadow-sm card-hover">
                  <div className="w-16 h-16 bg-aumatia-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-aumatia-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-aumatia-dark mb-2">Comunidad Activa</h3>
                  <p className="text-gray-600">Únete a miles de profesionales que confían en Aumatia</p>
                </div>
                
                <div className="text-center p-6 rounded-lg bg-white shadow-sm card-hover">
                  <div className="w-16 h-16 bg-aumatia-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-aumatia-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-aumatia-dark mb-2">Resultados Comprobados</h3>
                  <p className="text-gray-600">Soluciones probadas que generan impacto real</p>
                </div>
              </div>

              {/* Navigation Cards */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                      <Button className="w-full bg-aumatia-blue hover:bg-aumatia-dark transition-all duration-300 group" size="lg">
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
    </>;
};
export default Index;