
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformEditor } from "@/components/PlatformEditor";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";

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
  id?: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  link_descarga: string;
  pasos: Paso[];
  plataformas: Platform[];
}

interface Tutorial {
  id?: string;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  video_url: string;
  plataformas: Platform[];
}

const AdminRecursos = () => {
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [tutoriales, setTutoriales] = useState<Tutorial[]>([]);
  const [editingFlujo, setEditingFlujo] = useState<Flujo | null>(null);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para formularios
  const [flujoForm, setFlujoForm] = useState<Flujo>({
    nombre: '',
    descripcion: '',
    imagen_url: '',
    link_descarga: '',
    pasos: [{ descripcion: '', codigo: '', videoUrl: '' }],
    plataformas: []
  });

  const [tutorialForm, setTutorialForm] = useState<Tutorial>({
    titulo: '',
    descripcion: '',
    imagen_url: '',
    video_url: '',
    plataformas: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch flujos
      const { data: flujosData, error: flujosError } = await supabase
        .from('flujos')
        .select('*')
        .order('creado_en', { ascending: false });

      if (flujosError) {
        console.error('Error fetching flujos:', flujosError);
        toast({
          title: "Error",
          description: "No se pudieron cargar los flujos",
          variant: "destructive",
        });
      } else {
        setFlujos(flujosData || []);
      }

      // Fetch tutoriales
      const { data: tutorialesData, error: tutorialesError } = await supabase
        .from('tutoriales')
        .select('*')
        .order('creado_en', { ascending: false });

      if (tutorialesError) {
        console.error('Error fetching tutoriales:', tutorialesError);
        toast({
          title: "Error",
          description: "No se pudieron cargar los tutoriales",
          variant: "destructive",
        });
      } else {
        setTutoriales(tutorialesData || []);
      }
    } catch (error) {
      console.error('Error general:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFlujo = async () => {
    try {
      if (editingFlujo) {
        // Actualizar flujo existente
        const { error } = await supabase
          .from('flujos')
          .update({
            nombre: flujoForm.nombre,
            descripcion: flujoForm.descripcion,
            imagen_url: flujoForm.imagen_url,
            link_descarga: flujoForm.link_descarga,
            pasos: flujoForm.pasos,
            plataformas: flujoForm.plataformas
          })
          .eq('id', editingFlujo.id);

        if (error) throw error;

        toast({
          title: "Flujo actualizado",
          description: "El flujo ha sido actualizado correctamente",
        });
      } else {
        // Crear nuevo flujo
        const { error } = await supabase
          .from('flujos')
          .insert({
            nombre: flujoForm.nombre,
            descripcion: flujoForm.descripcion,
            imagen_url: flujoForm.imagen_url,
            link_descarga: flujoForm.link_descarga,
            pasos: flujoForm.pasos,
            plataformas: flujoForm.plataformas
          });

        if (error) throw error;

        toast({
          title: "Flujo creado",
          description: "El nuevo flujo ha sido creado correctamente",
        });
      }
      
      resetFlujoForm();
      fetchData();
    } catch (error) {
      console.error('Error saving flujo:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el flujo",
        variant: "destructive",
      });
    }
  };

  const handleSaveTutorial = async () => {
    try {
      if (editingTutorial) {
        // Actualizar tutorial existente
        const { error } = await supabase
          .from('tutoriales')
          .update({
            titulo: tutorialForm.titulo,
            descripcion: tutorialForm.descripcion,
            imagen_url: tutorialForm.imagen_url,
            video_url: tutorialForm.video_url,
            plataformas: tutorialForm.plataformas
          })
          .eq('id', editingTutorial.id);

        if (error) throw error;

        toast({
          title: "Tutorial actualizado",
          description: "El tutorial ha sido actualizado correctamente",
        });
      } else {
        // Crear nuevo tutorial
        const { error } = await supabase
          .from('tutoriales')
          .insert({
            titulo: tutorialForm.titulo,
            descripcion: tutorialForm.descripcion,
            imagen_url: tutorialForm.imagen_url,
            video_url: tutorialForm.video_url,
            plataformas: tutorialForm.plataformas
          });

        if (error) throw error;

        toast({
          title: "Tutorial creado",
          description: "El nuevo tutorial ha sido creado correctamente",
        });
      }
      
      resetTutorialForm();
      fetchData();
    } catch (error) {
      console.error('Error saving tutorial:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el tutorial",
        variant: "destructive",
      });
    }
  };

  const resetFlujoForm = () => {
    setFlujoForm({
      nombre: '',
      descripcion: '',
      imagen_url: '',
      link_descarga: '',
      pasos: [{ descripcion: '', codigo: '', videoUrl: '' }],
      plataformas: []
    });
    setEditingFlujo(null);
  };

  const resetTutorialForm = () => {
    setTutorialForm({
      titulo: '',
      descripcion: '',
      imagen_url: '',
      video_url: '',
      plataformas: []
    });
    setEditingTutorial(null);
  };

  const editFlujo = (flujo: Flujo) => {
    setFlujoForm({
      ...flujo,
      pasos: flujo.pasos || [{ descripcion: '', codigo: '', videoUrl: '' }],
      plataformas: flujo.plataformas || []
    });
    setEditingFlujo(flujo);
  };

  const editTutorial = (tutorial: Tutorial) => {
    setTutorialForm({
      ...tutorial,
      plataformas: tutorial.plataformas || []
    });
    setEditingTutorial(tutorial);
  };

  const deleteFlujo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('flujos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Flujo eliminado",
        description: "El flujo ha sido eliminado correctamente",
      });
      
      fetchData();
    } catch (error) {
      console.error('Error deleting flujo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el flujo",
        variant: "destructive",
      });
    }
  };

  const deleteTutorial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tutoriales')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Tutorial eliminado", 
        description: "El tutorial ha sido eliminado correctamente",
      });
      
      fetchData();
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el tutorial",
        variant: "destructive",
      });
    }
  };

  const addPaso = () => {
    setFlujoForm({
      ...flujoForm,
      pasos: [...flujoForm.pasos, { descripcion: '', codigo: '', videoUrl: '' }]
    });
  };

  const removePaso = (index: number) => {
    setFlujoForm({
      ...flujoForm,
      pasos: flujoForm.pasos.filter((_, i) => i !== index)
    });
  };

  const updatePaso = (index: number, field: keyof Paso, value: string) => {
    const newPasos = [...flujoForm.pasos];
    newPasos[index] = { ...newPasos[index], [field]: value };
    setFlujoForm({ ...flujoForm, pasos: newPasos });
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
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-aumatia-dark text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Link to="/" className="text-aumatia-blue hover:text-white mb-4 inline-flex items-center group transition-colors">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </Link>
            <div className="flex items-center gap-4">
              <img 
                src="https://i.imgur.com/cuWJ50n.png" 
                alt="Aumatia Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-4xl font-bold">Panel de Administración</h1>
                <p className="text-lg opacity-90">
                  Gestiona workflows y tutoriales de la plataforma
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="flujos" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
              <TabsTrigger value="flujos" className="data-[state=active]:bg-aumatia-blue data-[state=active]:text-white">
                Gestión de Flujos
              </TabsTrigger>
              <TabsTrigger value="tutoriales" className="data-[state=active]:bg-aumatia-blue data-[state=active]:text-white">
                Gestión de Tutoriales
              </TabsTrigger>
            </TabsList>

            {/* Gestión de Flujos */}
            <TabsContent value="flujos" className="space-y-8">
              {/* Formulario de Flujo */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-aumatia-dark text-white rounded-t-lg">
                  <CardTitle>
                    {editingFlujo ? 'Editar Flujo' : 'Crear Nuevo Flujo'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="flujo-nombre">Nombre del Flujo</Label>
                      <Input
                        id="flujo-nombre"
                        value={flujoForm.nombre}
                        onChange={(e) => setFlujoForm({ ...flujoForm, nombre: e.target.value })}
                        placeholder="Ej: Automatización de Email Marketing"
                      />
                    </div>
                    <div>
                      <Label htmlFor="flujo-imagen">URL de Imagen</Label>
                      <Input
                        id="flujo-imagen"
                        value={flujoForm.imagen_url}
                        onChange={(e) => setFlujoForm({ ...flujoForm, imagen_url: e.target.value })}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="flujo-descripcion">Descripción</Label>
                    <Textarea
                      id="flujo-descripcion"
                      value={flujoForm.descripcion}
                      onChange={(e) => setFlujoForm({ ...flujoForm, descripcion: e.target.value })}
                      placeholder="Describe qué hace este flujo de automatización..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="flujo-descarga">Link de Descarga</Label>
                    <Input
                      id="flujo-descarga"
                      value={flujoForm.link_descarga}
                      onChange={(e) => setFlujoForm({ ...flujoForm, link_descarga: e.target.value })}
                      placeholder="https://ejemplo.com/descarga.zip"
                    />
                  </div>

                  {/* Editor de Plataformas */}
                  <PlatformEditor
                    platforms={flujoForm.plataformas}
                    onChange={(plataformas) => setFlujoForm({ ...flujoForm, plataformas })}
                  />

                  {/* Editor de Pasos */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-lg font-semibold">Pasos del Flujo</Label>
                      <Button onClick={addPaso} size="sm" className="bg-aumatia-blue hover:bg-aumatia-blue/90">
                        + Agregar Paso
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {flujoForm.pasos.map((paso, index) => (
                        <Card key={index} className="border-l-4 border-l-aumatia-blue">
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-aumatia-dark">Paso {index + 1}</CardTitle>
                              {flujoForm.pasos.length > 1 && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => removePaso(index)}
                                >
                                  Eliminar
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Descripción del Paso</Label>
                              <Input
                                value={paso.descripcion}
                                onChange={(e) => updatePaso(index, 'descripcion', e.target.value)}
                                placeholder="Ej: Configurar la conexión con el proveedor"
                              />
                            </div>
                            <div>
                              <Label>Código</Label>
                              <Textarea
                                value={paso.codigo}
                                onChange={(e) => updatePaso(index, 'codigo', e.target.value)}
                                placeholder="// Código del paso..."
                                rows={4}
                                className="font-mono"
                              />
                            </div>
                            <div>
                              <Label>URL del Video</Label>
                              <Input
                                value={paso.videoUrl}
                                onChange={(e) => updatePaso(index, 'videoUrl', e.target.value)}
                                placeholder="https://www.youtube.com/embed/..."
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleSaveFlujo} className="bg-aumatia-blue hover:bg-aumatia-blue/90">
                      {editingFlujo ? 'Actualizar Flujo' : 'Crear Flujo'}
                    </Button>
                    {editingFlujo && (
                      <Button variant="outline" onClick={resetFlujoForm}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Flujos Existentes */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-aumatia-dark text-white rounded-t-lg">
                  <CardTitle>Flujos Existentes</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {flujos.map((flujo) => (
                      <div key={flujo.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm card-hover">
                        <div>
                          <h3 className="font-semibold text-aumatia-dark">{flujo.nombre}</h3>
                          <p className="text-gray-600 text-sm">{flujo.descripcion}</p>
                          {flujo.plataformas && flujo.plataformas.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {flujo.plataformas.map((plat, i) => (
                                <span key={i} className="text-xs bg-aumatia-blue/10 text-aumatia-blue px-2 py-1 rounded">
                                  {plat.nombre}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editFlujo(flujo)}
                            className="text-aumatia-blue border-aumatia-blue hover:bg-aumatia-blue hover:text-white"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteFlujo(flujo.id!)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {flujos.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No hay flujos creados aún.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gestión de Tutoriales */}
            <TabsContent value="tutoriales" className="space-y-8">
              {/* Formulario de Tutorial */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-aumatia-dark text-white rounded-t-lg">
                  <CardTitle>
                    {editingTutorial ? 'Editar Tutorial' : 'Crear Nuevo Tutorial'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tutorial-titulo">Título del Tutorial</Label>
                      <Input
                        id="tutorial-titulo"
                        value={tutorialForm.titulo}
                        onChange={(e) => setTutorialForm({ ...tutorialForm, titulo: e.target.value })}
                        placeholder="Ej: Configuración de Webhooks"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tutorial-imagen">URL de Imagen</Label>
                      <Input
                        id="tutorial-imagen"
                        value={tutorialForm.imagen_url}
                        onChange={(e) => setTutorialForm({ ...tutorialForm, imagen_url: e.target.value })}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tutorial-descripcion">Descripción</Label>
                    <Textarea
                      id="tutorial-descripcion"
                      value={tutorialForm.descripcion}
                      onChange={(e) => setTutorialForm({ ...tutorialForm, descripcion: e.target.value })}
                      placeholder="Describe qué aprenderán en este tutorial..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tutorial-video">URL del Video</Label>
                    <Input
                      id="tutorial-video"
                      value={tutorialForm.video_url}
                      onChange={(e) => setTutorialForm({ ...tutorialForm, video_url: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  </div>

                  {/* Editor de Plataformas */}
                  <PlatformEditor
                    platforms={tutorialForm.plataformas}
                    onChange={(plataformas) => setTutorialForm({ ...tutorialForm, plataformas })}
                  />

                  <div className="flex gap-4">
                    <Button onClick={handleSaveTutorial} className="bg-aumatia-blue hover:bg-aumatia-blue/90">
                      {editingTutorial ? 'Actualizar Tutorial' : 'Crear Tutorial'}
                    </Button>
                    {editingTutorial && (
                      <Button variant="outline" onClick={resetTutorialForm}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Tutoriales Existentes */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-aumatia-dark text-white rounded-t-lg">
                  <CardTitle>Tutoriales Existentes</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {tutoriales.map((tutorial) => (
                      <div key={tutorial.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm card-hover">
                        <div>
                          <h3 className="font-semibold text-aumatia-dark">{tutorial.titulo}</h3>
                          <p className="text-gray-600 text-sm">{tutorial.descripcion}</p>
                          {tutorial.plataformas && tutorial.plataformas.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {tutorial.plataformas.map((plat, i) => (
                                <span key={i} className="text-xs bg-aumatia-blue/10 text-aumatia-blue px-2 py-1 rounded">
                                  {plat.nombre}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editTutorial(tutorial)}
                            className="text-aumatia-blue border-aumatia-blue hover:bg-aumatia-blue hover:text-white"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteTutorial(tutorial.id!)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {tutoriales.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No hay tutoriales creados aún.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminRecursos;
