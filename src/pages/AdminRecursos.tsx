
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

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
}

interface Tutorial {
  id?: string;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  video_url: string;
}

const AdminRecursos = () => {
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [tutoriales, setTutoriales] = useState<Tutorial[]>([]);
  const [editingFlujo, setEditingFlujo] = useState<Flujo | null>(null);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);

  // Estados para formularios
  const [flujoForm, setFlujoForm] = useState<Flujo>({
    nombre: '',
    descripcion: '',
    imagen_url: '',
    link_descarga: '',
    pasos: [{ descripcion: '', codigo: '', videoUrl: '' }]
  });

  const [tutorialForm, setTutorialForm] = useState<Tutorial>({
    titulo: '',
    descripcion: '',
    imagen_url: '',
    video_url: ''
  });

  useEffect(() => {
    // Simular carga de datos existentes
    const mockFlujos: Flujo[] = [
      {
        id: "1",
        nombre: "Automatización de Email Marketing",
        descripcion: "Flujo completo para automatizar campañas de email marketing",
        imagen_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
        link_descarga: "https://example.com/download/flujo-email.zip",
        pasos: [
          {
            descripcion: "Configurar proveedor de email",
            codigo: "const emailConfig = { apiKey: 'key' }",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          }
        ]
      }
    ];

    const mockTutoriales: Tutorial[] = [
      {
        id: "1",
        titulo: "Configuración de Webhooks",
        descripcion: "Tutorial paso a paso para configurar webhooks",
        imagen_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop",
        video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ];

    setFlujos(mockFlujos);
    setTutoriales(mockTutoriales);
  }, []);

  const handleSaveFlujo = () => {
    if (editingFlujo) {
      // Actualizar flujo existente
      setFlujos(flujos.map(f => f.id === editingFlujo.id ? { ...flujoForm, id: editingFlujo.id } : f));
      toast({
        title: "Flujo actualizado",
        description: "El flujo ha sido actualizado correctamente",
      });
    } else {
      // Crear nuevo flujo
      const newFlujo = { ...flujoForm, id: Date.now().toString() };
      setFlujos([...flujos, newFlujo]);
      toast({
        title: "Flujo creado",
        description: "El nuevo flujo ha sido creado correctamente",
      });
    }
    
    resetFlujoForm();
  };

  const handleSaveTutorial = () => {
    if (editingTutorial) {
      // Actualizar tutorial existente
      setTutoriales(tutoriales.map(t => t.id === editingTutorial.id ? { ...tutorialForm, id: editingTutorial.id } : t));
      toast({
        title: "Tutorial actualizado",
        description: "El tutorial ha sido actualizado correctamente",
      });
    } else {
      // Crear nuevo tutorial
      const newTutorial = { ...tutorialForm, id: Date.now().toString() };
      setTutoriales([...tutoriales, newTutorial]);
      toast({
        title: "Tutorial creado",
        description: "El nuevo tutorial ha sido creado correctamente",
      });
    }
    
    resetTutorialForm();
  };

  const resetFlujoForm = () => {
    setFlujoForm({
      nombre: '',
      descripcion: '',
      imagen_url: '',
      link_descarga: '',
      pasos: [{ descripcion: '', codigo: '', videoUrl: '' }]
    });
    setEditingFlujo(null);
  };

  const resetTutorialForm = () => {
    setTutorialForm({
      titulo: '',
      descripcion: '',
      imagen_url: '',
      video_url: ''
    });
    setEditingTutorial(null);
  };

  const editFlujo = (flujo: Flujo) => {
    setFlujoForm(flujo);
    setEditingFlujo(flujo);
  };

  const editTutorial = (tutorial: Tutorial) => {
    setTutorialForm(tutorial);
    setEditingTutorial(tutorial);
  };

  const deleteFlujo = (id: string) => {
    setFlujos(flujos.filter(f => f.id !== id));
    toast({
      title: "Flujo eliminado",
      description: "El flujo ha sido eliminado correctamente",
    });
  };

  const deleteTutorial = (id: string) => {
    setTutoriales(tutoriales.filter(t => t.id !== id));
    toast({
      title: "Tutorial eliminado", 
      description: "El tutorial ha sido eliminado correctamente",
    });
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-aumatia-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Link to="/" className="text-aumatia-blue hover:text-white mb-4 inline-block">
              ← Volver al inicio
            </Link>
            <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-lg opacity-90">
              Gestiona workflows y tutoriales de la plataforma
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="flujos" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="flujos">Gestión de Flujos</TabsTrigger>
              <TabsTrigger value="tutoriales">Gestión de Tutoriales</TabsTrigger>
            </TabsList>

            {/* Gestión de Flujos */}
            <TabsContent value="flujos" className="space-y-8">
              {/* Formulario de Flujo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-aumatia-dark">
                    {editingFlujo ? 'Editar Flujo' : 'Crear Nuevo Flujo'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-aumatia-dark">Flujos Existentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {flujos.map((flujo) => (
                      <div key={flujo.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-aumatia-dark">{flujo.nombre}</h3>
                          <p className="text-gray-600 text-sm">{flujo.descripcion}</p>
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gestión de Tutoriales */}
            <TabsContent value="tutoriales" className="space-y-8">
              {/* Formulario de Tutorial */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-aumatia-dark">
                    {editingTutorial ? 'Editar Tutorial' : 'Crear Nuevo Tutorial'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-aumatia-dark">Tutoriales Existentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tutoriales.map((tutorial) => (
                      <div key={tutorial.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-aumatia-dark">{tutorial.titulo}</h3>
                          <p className="text-gray-600 text-sm">{tutorial.descripcion}</p>
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
