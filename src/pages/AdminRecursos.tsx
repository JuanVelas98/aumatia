import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { PlatformEditor } from "@/components/PlatformEditor";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Sun, Moon } from "lucide-react";

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

const AdminRecursos = () => {
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [tutoriales, setTutoriales] = useState<Tutorial[]>([]);
  const [nuevoFlujo, setNuevoFlujo] = useState<Flujo>({
    id: '',
    nombre: '',
    descripcion: '',
    imagen_url: '',
    link_descarga: '',
    plataformas: [],
    pasos: []
  });
  const [nuevoTutorial, setNuevoTutorial] = useState<Tutorial>({
    id: '',
    titulo: '',
    descripcion: '',
    imagen_url: '',
    video_url: '',
    plataformas: []
  });
  const [showFlujoForm, setShowFlujoForm] = useState(false);
  const [showTutorialForm, setShowTutorialForm] = useState(false);
  const [editingFlujo, setEditingFlujo] = useState<Flujo | null>(null);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [plataformas, setPlataformas] = useState<Platform[]>([]);
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);

  const fetchFlujos = async () => {
    try {
      const { data, error } = await supabase
        .from('flujos')
        .select('*')
        .order('creado_en', { ascending: false });
      if (error) {
        console.error('Error fetching flujos:', error);
      } else {
        // Convert Json fields to typed arrays
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
        // Convert Json fields to typed arrays
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

  const handleCreateFlujo = async () => {
    try {
      const { data, error } = await supabase
        .from('flujos')
        .insert([{
          ...nuevoFlujo,
          plataformas: JSON.stringify(plataformas),
          pasos: JSON.stringify(nuevoFlujo.pasos)
        }]);

      if (error) {
        console.error('Error creating flujo:', error);
        toast({
          title: "Error creando el flujo",
          description: "Hubo un problema al guardar el flujo. Intenta nuevamente.",
          variant: "destructive",
        });
      } else {
        console.log('Flujo created successfully:', data);
        toast({
          title: "Flujo creado exitosamente!",
          description: "El flujo se ha guardado correctamente.",
        });
        fetchFlujos();
        setShowFlujoForm(false);
        setNuevoFlujo({ id: '', nombre: '', descripcion: '', imagen_url: '', link_descarga: '', plataformas: [], pasos: [] });
        setPlataformas([]);
      }
    } catch (error) {
      console.error('Error creating flujo:', error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error inesperado. Contacta al administrador.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFlujo = async () => {
    if (!editingFlujo) return;

    try {
      const { data, error } = await supabase
        .from('flujos')
        .update({
          ...nuevoFlujo,
          plataformas: JSON.stringify(plataformas),
          pasos: JSON.stringify(nuevoFlujo.pasos)
        })
        .eq('id', editingFlujo.id);

      if (error) {
        console.error('Error updating flujo:', error);
        toast({
          title: "Error actualizando el flujo",
          description: "Hubo un problema al actualizar el flujo. Intenta nuevamente.",
          variant: "destructive",
        });
      } else {
        console.log('Flujo updated successfully:', data);
        toast({
          title: "Flujo actualizado exitosamente!",
          description: "El flujo se ha actualizado correctamente.",
        });
        fetchFlujos();
        setEditingFlujo(null);
        setNuevoFlujo({ id: '', nombre: '', descripcion: '', imagen_url: '', link_descarga: '', plataformas: [], pasos: [] });
        setPlataformas([]);
      }
    } catch (error) {
      console.error('Error updating flujo:', error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error inesperado. Contacta al administrador.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFlujo = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('flujos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting flujo:', error);
        toast({
          title: "Error eliminando el flujo",
          description: "Hubo un problema al eliminar el flujo. Intenta nuevamente.",
          variant: "destructive",
        });
      } else {
        console.log('Flujo deleted successfully:', data);
        toast({
          title: "Flujo eliminado exitosamente!",
          description: "El flujo se ha eliminado correctamente.",
        });
        fetchFlujos();
      }
    } catch (error) {
      console.error('Error deleting flujo:', error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error inesperado. Contacta al administrador.",
        variant: "destructive",
      });
    }
  };

  const handleEditFlujo = (flujo: Flujo) => {
    setEditingFlujo(flujo);
    setNuevoFlujo({
      ...flujo,
      pasos: flujo.pasos || []
    });
    setPlataformas(flujo.plataformas);
    setShowFlujoForm(true);
  };

  const handleCreateTutorial = async () => {
    try {
      const { data, error } = await supabase
        .from('tutoriales')
        .insert([{
          ...nuevoTutorial,
          plataformas: JSON.stringify(plataformas)
        }]);

      if (error) {
        console.error('Error creating tutorial:', error);
        toast({
          title: "Error creando el tutorial",
          description: "Hubo un problema al guardar el tutorial. Intenta nuevamente.",
          variant: "destructive",
        });
      } else {
        console.log('Tutorial created successfully:', data);
        toast({
          title: "Tutorial creado exitosamente!",
          description: "El tutorial se ha guardado correctamente.",
        });
        fetchTutoriales();
        setShowTutorialForm(false);
        setNuevoTutorial({ id: '', titulo: '', descripcion: '', imagen_url: '', video_url: '', plataformas: [] });
        setPlataformas([]);
      }
    } catch (error) {
      console.error('Error creating tutorial:', error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error inesperado. Contacta al administrador.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTutorial = async () => {
    if (!editingTutorial) return;

    try {
      const { data, error } = await supabase
        .from('tutoriales')
        .update({
          ...nuevoTutorial,
          plataformas: JSON.stringify(plataformas)
        })
        .eq('id', editingTutorial.id);

      if (error) {
        console.error('Error updating tutorial:', error);
        toast({
          title: "Error actualizando el tutorial",
          description: "Hubo un problema al actualizar el tutorial. Intenta nuevamente.",
          variant: "destructive",
        });
      } else {
        console.log('Tutorial updated successfully:', data);
        toast({
          title: "Tutorial actualizado exitosamente!",
          description: "El tutorial se ha actualizado correctamente.",
        });
        fetchTutoriales();
        setEditingTutorial(null);
        setNuevoTutorial({ id: '', titulo: '', descripcion: '', imagen_url: '', video_url: '', plataformas: [] });
        setPlataformas([]);
      }
    } catch (error) {
      console.error('Error updating tutorial:', error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error inesperado. Contacta al administrador.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTutorial = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('tutoriales')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting tutorial:', error);
        toast({
          title: "Error eliminando el tutorial",
          description: "Hubo un problema al eliminar el tutorial. Intenta nuevamente.",
          variant: "destructive",
        });
      } else {
        console.log('Tutorial deleted successfully:', data);
        toast({
          title: "Tutorial eliminado exitosamente!",
          description: "El tutorial se ha eliminado correctamente.",
        });
        fetchTutoriales();
      }
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error inesperado. Contacta al administrador.",
        variant: "destructive",
      });
    }
  };

  const handleEditTutorial = (tutorial: Tutorial) => {
    setEditingTutorial(tutorial);
    setNuevoTutorial(tutorial);
    setPlataformas(tutorial.plataformas);
    setShowTutorialForm(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('adminDarkMode', (!darkMode).toString());
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode');
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-white via-gray-50 to-blue-50'
    }`}>
      {/* Admin Header with Dark Mode Toggle */}
      <header className={`border-b shadow-sm ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://i.imgur.com/wR2n4Hg.png" 
                alt="Aumatia Logo" 
                className="h-12 md:h-16 w-auto object-contain" 
              />
              <div>
                <h1 className={`text-xl md:text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-aumatia-dark'
                }`}>
                  Panel de Administración
                </h1>
                <p className={`text-sm md:text-base ${
                  darkMode ? 'text-gray-300' : 'text-aumatia-blue'
                }`}>
                  Gestión de recursos
                </p>
              </div>
            </div>
            
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="sm"
              className={`${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="ml-2 hidden sm:inline">
                {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="flujos" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-2 ${
            darkMode 
              ? 'bg-gray-800 text-gray-300' 
              : 'bg-white'
          }`}>
            <TabsTrigger 
              value="flujos"
              className={darkMode ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' : ''}
            >
              Gestión de Flujos
            </TabsTrigger>
            <TabsTrigger 
              value="tutoriales"
              className={darkMode ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' : ''}
            >
              Gestión de Tutoriales
            </TabsTrigger>
          </TabsList>

          {/* Flujos Tab */}
          <TabsContent value="flujos" className="space-y-6">
            <Card className={`${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Crear Nuevo Flujo</span>
                  <Button
                    onClick={() => setShowFlujoForm(!showFlujoForm)}
                    className="bg-aumatia-blue hover:bg-aumatia-dark"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Flujo
                  </Button>
                </CardTitle>
              </CardHeader>
              
              {showFlujoForm && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="flujo-nombre">Nombre del Flujo</Label>
                    <Input
                      id="flujo-nombre"
                      value={nuevoFlujo.nombre}
                      onChange={(e) => setNuevoFlujo({...nuevoFlujo, nombre: e.target.value})}
                      className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="flujo-descripcion">Descripción</Label>
                    <Textarea
                      id="flujo-descripcion"
                      value={nuevoFlujo.descripcion}
                      onChange={(e) => setNuevoFlujo({...nuevoFlujo, descripcion: e.target.value})}
                      className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flujo-imagen_url">URL de la Imagen</Label>
                    <Input
                      id="flujo-imagen_url"
                      value={nuevoFlujo.imagen_url}
                      onChange={(e) => setNuevoFlujo({...nuevoFlujo, imagen_url: e.target.value})}
                      className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flujo-link_descarga">Link de Descarga</Label>
                    <Input
                      id="flujo-link_descarga"
                      value={nuevoFlujo.link_descarga}
                      onChange={(e) => setNuevoFlujo({...nuevoFlujo, link_descarga: e.target.value})}
                      className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Plataformas</Label>
                    <PlatformEditor
                      platforms={plataformas}
                      setPlatforms={setPlataformas}
                      darkMode={darkMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flujo-pasos">Pasos (separados por coma)</Label>
                    <Textarea
                      id="flujo-pasos"
                      value={nuevoFlujo.pasos ? nuevoFlujo.pasos.join(', ') : ''}
                      onChange={(e) => setNuevoFlujo({ ...nuevoFlujo, pasos: e.target.value.split(',').map(s => s.trim()) })}
                      className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => editingFlujo ? handleUpdateFlujo() : handleCreateFlujo()}
                      className="bg-aumatia-blue hover:bg-aumatia-dark"
                    >
                      {editingFlujo ? 'Actualizar' : 'Crear'} Flujo
                    </Button>
                    {editingFlujo && (
                      <Button 
                        onClick={() => {
                          setEditingFlujo(null);
                          setNuevoFlujo({ id: '', nombre: '', descripcion: '', imagen_url: '', link_descarga: '', plataformas: [], pasos: [] });
                          setPlataformas([]);
                        }}
                        variant="outline"
                        className={darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : ''}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Existing Flujos List */}
            <div className="grid gap-4">
              {flujos.map((flujo) => (
                <Card key={flujo.id} className={`${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-200'
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{flujo.nombre}</span>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditFlujo(flujo)}
                          size="sm"
                          variant="outline"
                          className={darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : ''}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteFlujo(flujo.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                      {flujo.descripcion}
                    </p>
                    {flujo.imagen_url && (
                      <img 
                        src={flujo.imagen_url} 
                        alt={flujo.nombre}
                        className="w-full h-32 object-cover rounded mb-4"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tutoriales Tab */}
          <TabsContent value="tutoriales" className="space-y-6">
            <Card className={`${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Crear Nuevo Tutorial</span>
                  <Button
                    onClick={() => setShowTutorialForm(!showTutorialForm)}
                    className="bg-aumatia-blue hover:bg-aumatia-dark"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Tutorial
                  </Button>
                </CardTitle>
              </CardHeader>
              
              {showTutorialForm && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tutorial-titulo">Título del Tutorial</Label>
                    <Input
                      id="tutorial-titulo"
                      value={nuevoTutorial.titulo}
                      onChange={(e) => setNuevoTutorial({...nuevoTutorial, titulo: e.target.value})}
                      className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tutorial-descripcion">Descripción</Label>
                    <Textarea
                      id="tutorial-descripcion"
                      value={nuevoTutorial.descripcion}
                      onChange={(e) => setNuevoTutorial({...nuevoTutorial, descripcion: e.target.value})}
                      className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tutorial-imagen_url">URL de la Imagen</Label>
                    <Input
                      id="tutorial-imagen_url"
                      value={nuevoTutorial.imagen_url}
                      onChange={(e) => setNuevoTutorial({...nuevoTutorial, imagen_url: e.target.value})}
                      className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tutorial-video_url">URL del Video</Label>
                    <Input
                      id="tutorial-video_url"
                      value={nuevoTutorial.video_url}
                      onChange={(e) => setNuevoTutorial({...nuevoTutorial, video_url: e.target.value})}
                      className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Plataformas</Label>
                    <PlatformEditor
                      platforms={plataformas}
                      setPlatforms={setPlataformas}
                      darkMode={darkMode}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => editingTutorial ? handleUpdateTutorial() : handleCreateTutorial()}
                      className="bg-aumatia-blue hover:bg-aumatia-dark"
                    >
                      {editingTutorial ? 'Actualizar' : 'Crear'} Tutorial
                    </Button>
                    {editingTutorial && (
                      <Button 
                        onClick={() => {
                          setEditingTutorial(null);
                          setNuevoTutorial({ id: '', titulo: '', descripcion: '', imagen_url: '', video_url: '', plataformas: [] });
                          setPlataformas([]);
                        }}
                        variant="outline"
                        className={darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : ''}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Existing Tutoriales List */}
            <div className="grid gap-4">
              {tutoriales.map((tutorial) => (
                <Card key={tutorial.id} className={`${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-200'
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{tutorial.titulo}</span>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditTutorial(tutorial)}
                          size="sm"
                          variant="outline"
                          className={darkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : ''}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteTutorial(tutorial.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                      {tutorial.descripcion}
                    </p>
                    {tutorial.imagen_url && (
                      <img 
                        src={tutorial.imagen_url} 
                        alt={tutorial.titulo}
                        className="w-full h-32 object-cover rounded mb-4"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminRecursos;
