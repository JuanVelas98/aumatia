import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PlatformEditor } from "@/components/PlatformEditor";
import { StepEditor } from "@/components/StepEditor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  Video,
  ExternalLink,
  BarChart3,
  Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

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

const AdminRecursos = () => {
  const [flujos, setFlujos] = useState<Flujo[]>([]);
  const [tutoriales, setTutoriales] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateFlujo, setShowCreateFlujo] = useState(false);
  const [showCreateTutorial, setShowCreateTutorial] = useState(false);
  const [editingFlujo, setEditingFlujo] = useState<Flujo | null>(null);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);

  const [flujoForm, setFlujoForm] = useState({
    nombre: '',
    descripcion: '',
    imagen_url: '',
    link_descarga: '',
    pasos: [] as Paso[],
    plataformas: [] as Platform[]
  });

  const [tutorialForm, setTutorialForm] = useState({
    titulo: '',
    descripcion: '',
    imagen_url: '',
    video_url: '',
    plataformas: [] as Platform[]
  });

  useEffect(() => {
    fetchRecursos();
  }, []);

  const fetchRecursos = async () => {
    try {
      setLoading(true);
      
      const [flujosResponse, tutorialesResponse] = await Promise.all([
        supabase.from('flujos').select('*').order('creado_en', { ascending: false }),
        supabase.from('tutoriales').select('*').order('creado_en', { ascending: false })
      ]);

      if (flujosResponse.error) {
        console.error('Error fetching flujos:', flujosResponse.error);
      } else {
        const processedFlujos = flujosResponse.data.map(flujo => ({
          ...flujo,
          pasos: Array.isArray(flujo.pasos) ? flujo.pasos : (flujo.pasos ? JSON.parse(String(flujo.pasos)) : []),
          plataformas: Array.isArray(flujo.plataformas) ? flujo.plataformas : (flujo.plataformas ? JSON.parse(String(flujo.plataformas)) : [])
        }));
        setFlujos(processedFlujos);
      }

      if (tutorialesResponse.error) {
        console.error('Error fetching tutoriales:', tutorialesResponse.error);
      } else {
        const processedTutoriales = tutorialesResponse.data.map(tutorial => ({
          ...tutorial,
          plataformas: Array.isArray(tutorial.plataformas) ? tutorial.plataformas : (tutorial.plataformas ? JSON.parse(String(tutorial.plataformas)) : [])
        }));
        setTutoriales(processedTutoriales);
      }
    } catch (error) {
      console.error('Error general:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al cargar los recursos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetFlujoForm = () => {
    setFlujoForm({
      nombre: '',
      descripcion: '',
      imagen_url: '',
      link_descarga: '',
      pasos: [],
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

  const handleCreateFlujo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!flujoForm.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre del flujo es requerido",
        variant: "destructive"
      });
      return;
    }

    try {
      const flujoData = {
        nombre: flujoForm.nombre.trim(),
        descripcion: flujoForm.descripcion.trim() || null,
        imagen_url: flujoForm.imagen_url.trim() || null,
        link_descarga: flujoForm.link_descarga.trim() || null,
        pasos: flujoForm.pasos as any,
        plataformas: flujoForm.plataformas as any
      };

      const { error } = await supabase
        .from('flujos')
        .insert(flujoData);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Flujo creado correctamente"
      });

      setShowCreateFlujo(false);
      resetFlujoForm();
      fetchRecursos();
    } catch (error) {
      console.error('Error creating flujo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el flujo",
        variant: "destructive"
      });
    }
  };

  const handleCreateTutorial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tutorialForm.titulo.trim()) {
      toast({
        title: "Error",
        description: "El título del tutorial es requerido",
        variant: "destructive"
      });
      return;
    }

    if (!tutorialForm.video_url.trim()) {
      toast({
        title: "Error",
        description: "La URL del video es requerida",
        variant: "destructive"
      });
      return;
    }

    try {
      const tutorialData = {
        titulo: tutorialForm.titulo.trim(),
        descripcion: tutorialForm.descripcion.trim() || null,
        imagen_url: tutorialForm.imagen_url.trim() || null,
        video_url: tutorialForm.video_url.trim(),
        plataformas: tutorialForm.plataformas as any
      };

      const { error } = await supabase
        .from('tutoriales')
        .insert(tutorialData);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Tutorial creado correctamente"
      });

      setShowCreateTutorial(false);
      resetTutorialForm();
      fetchRecursos();
    } catch (error) {
      console.error('Error creating tutorial:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el tutorial",
        variant: "destructive"
      });
    }
  };

  const handleEditFlujo = (flujo: Flujo) => {
    console.log('Editing flujo:', flujo);
    setFlujoForm({
      nombre: flujo.nombre,
      descripcion: flujo.descripcion || '',
      imagen_url: flujo.imagen_url || '',
      link_descarga: flujo.link_descarga || '',
      pasos: Array.isArray(flujo.pasos) ? flujo.pasos : [],
      plataformas: Array.isArray(flujo.plataformas) ? flujo.plataformas : []
    });
    setEditingFlujo(flujo);
    setShowCreateFlujo(true);
  };

  const handleEditTutorial = (tutorial: Tutorial) => {
    setTutorialForm({
      titulo: tutorial.titulo,
      descripcion: tutorial.descripcion || '',
      imagen_url: tutorial.imagen_url || '',
      video_url: tutorial.video_url || '',
      plataformas: tutorial.plataformas || []
    });
    setEditingTutorial(tutorial);
    setShowCreateTutorial(true);
  };

  const handleUpdateFlujo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingFlujo) {
      toast({
        title: "Error",
        description: "No se encontró el flujo a actualizar",
        variant: "destructive"
      });
      return;
    }

    if (!flujoForm.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre del flujo es requerido",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Updating flujo with ID:', editingFlujo.id);
      console.log('Form data:', flujoForm);
      
      const updateData = {
        nombre: flujoForm.nombre.trim(),
        descripcion: flujoForm.descripcion.trim() || null,
        imagen_url: flujoForm.imagen_url.trim() || null,
        link_descarga: flujoForm.link_descarga.trim() || null,
        pasos: flujoForm.pasos as any,
        plataformas: flujoForm.plataformas as any
      };

      console.log('Update data to be sent:', updateData);

      const { data, error } = await supabase
        .from('flujos')
        .update(updateData)
        .eq('id', editingFlujo.id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Update successful:', data);

      toast({
        title: "Éxito",
        description: "Flujo actualizado correctamente"
      });

      setShowCreateFlujo(false);
      resetFlujoForm();
      fetchRecursos();
    } catch (error) {
      console.error('Error updating flujo:', error);
      toast({
        title: "Error",
        description: `No se pudo actualizar el flujo: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive"
      });
    }
  };

  const handleUpdateTutorial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTutorial || !tutorialForm.titulo.trim()) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tutoriales')
        .update({
          titulo: tutorialForm.titulo.trim(),
          descripcion: tutorialForm.descripcion.trim() || null,
          imagen_url: tutorialForm.imagen_url.trim() || null,
          video_url: tutorialForm.video_url.trim() || null,
          plataformas: tutorialForm.plataformas as any
        })
        .eq('id', editingTutorial.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Tutorial actualizado correctamente"
      });

      setShowCreateTutorial(false);
      resetTutorialForm();
      fetchRecursos();
    } catch (error) {
      console.error('Error updating tutorial:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el tutorial",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFlujo = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este flujo?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('flujos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Flujo eliminado correctamente"
      });

      fetchRecursos();
    } catch (error) {
      console.error('Error deleting flujo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el flujo",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTutorial = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este tutorial?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tutoriales')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Tutorial eliminado correctamente"
      });

      fetchRecursos();
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el tutorial",
        variant: "destructive"
      });
    }
  };

  const generateWordDocument = async (flujo: Flujo) => {
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Title
              new Paragraph({
                children: [
                  new TextRun({
                    text: flujo.nombre,
                    bold: true,
                    size: 32,
                  }),
                ],
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),
              
              // Generation date
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Generado el: ${new Date().toLocaleDateString('es-ES')}`,
                    italics: true,
                    size: 20,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 },
              }),

              // Description section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Descripción",
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: flujo.descripcion || "Sin descripción disponible",
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              }),

              // Platforms section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Plataformas Compatibles",
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: flujo.plataformas?.length > 0 
                      ? flujo.plataformas.map(p => `• ${p.nombre}`).join('\n')
                      : "• No se especificaron plataformas",
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              }),

              // Download link section
              ...(flujo.link_descarga ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Enlace de Descarga",
                      bold: true,
                      size: 24,
                    }),
                  ],
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: flujo.link_descarga,
                      size: 22,
                      color: "0000FF",
                    }),
                  ],
                  spacing: { after: 400 },
                }),
              ] : []),

              // Steps section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Pasos del Flujo",
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 },
              }),

              // Generate steps
              ...(flujo.pasos?.flatMap((paso, index) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Paso ${index + 1}`,
                      bold: true,
                      size: 22,
                    }),
                  ],
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 300, after: 150 },
                }),
                
                new Paragraph({
                  children: [
                    new TextRun({
                      text: paso.descripcion || "Sin descripción",
                      size: 22,
                    }),
                  ],
                  spacing: { after: 200 },
                }),

                ...(paso.codigo ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Código:",
                        bold: true,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: paso.codigo,
                        size: 20,
                        font: "Courier New",
                      }),
                    ],
                    spacing: { after: 200 },
                  }),
                ] : []),

                ...(paso.videoUrl ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Video de referencia: ",
                        bold: true,
                        size: 20,
                      }),
                      new TextRun({
                        text: paso.videoUrl,
                        size: 20,
                        color: "0000FF",
                      }),
                    ],
                    spacing: { after: 300 },
                  }),
                ] : []),
              ]) || []),
            ],
          },
        ],
      });

      // Generate and download the document
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flujo-${flujo.nombre.toLowerCase().replace(/\s+/g, '-')}-pasos.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Descarga completada",
        description: `El documento "${flujo.nombre}" se ha descargado correctamente`,
      });
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el documento Word",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600 mt-2">Gestiona flujos y tutoriales de Aumatia</p>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex gap-3">
            <Link to="/admin_metrica">
              <Button className="bg-aumatia-blue hover:bg-aumatia-dark text-white">
                <BarChart3 className="mr-2 w-4 h-4" />
                Ver Métricas
              </Button>
            </Link>
            <Link to="/recursos">
              <Button variant="outline">
                <Eye className="mr-2 w-4 h-4" />
                Ver Sitio Público
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="flujos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="flujos" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Flujos ({flujos.length})
            </TabsTrigger>
            <TabsTrigger value="tutoriales" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Tutoriales ({tutoriales.length})
            </TabsTrigger>
          </TabsList>

          
          <TabsContent value="flujos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Gestión de Flujos</h2>
              <Dialog open={showCreateFlujo} onOpenChange={setShowCreateFlujo}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetFlujoForm()} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 w-4 h-4" />
                    Crear Flujo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingFlujo ? 'Editar Flujo' : 'Crear Nuevo Flujo'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingFlujo ? 'Modifica los datos del flujo' : 'Completa la información para crear un nuevo flujo'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={editingFlujo ? handleUpdateFlujo : handleCreateFlujo} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nombre">Nombre del Flujo *</Label>
                        <Input
                          id="nombre"
                          value={flujoForm.nombre}
                          onChange={(e) => setFlujoForm({...flujoForm, nombre: e.target.value})}
                          placeholder="Nombre descriptivo del flujo"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="imagen_url">URL de Imagen</Label>
                        <Input
                          id="imagen_url"
                          value={flujoForm.imagen_url}
                          onChange={(e) => setFlujoForm({...flujoForm, imagen_url: e.target.value})}
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={flujoForm.descripcion}
                        onChange={(e) => setFlujoForm({...flujoForm, descripcion: e.target.value})}
                        placeholder="Describe qué hace este flujo..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="link_descarga">Link de Descarga</Label>
                      <Input
                        id="link_descarga"
                        value={flujoForm.link_descarga}
                        onChange={(e) => setFlujoForm({...flujoForm, link_descarga: e.target.value})}
                        placeholder="https://drive.google.com/..."
                      />
                    </div>

                    <StepEditor
                      steps={flujoForm.pasos}
                      onChange={(steps) => setFlujoForm({...flujoForm, pasos: steps})}
                    />

                    <PlatformEditor
                      platforms={flujoForm.plataformas}
                      onChange={(platforms) => setFlujoForm({...flujoForm, plataformas: platforms})}
                    />

                    <div className="flex justify-end gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowCreateFlujo(false);
                          resetFlujoForm();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        {editingFlujo ? 'Actualizar Flujo' : 'Crear Flujo'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando flujos...</p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Flujos</CardTitle>
                  <CardDescription>
                    Todos los flujos disponibles en la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Plataformas</TableHead>
                        <TableHead>Pasos</TableHead>
                        <TableHead>Creado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flujos.map((flujo) => (
                        <TableRow key={flujo.id}>
                          <TableCell className="font-medium">{flujo.nombre}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {flujo.descripcion || 'Sin descripción'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {flujo.plataformas?.slice(0, 2).map((platform, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {platform.nombre}
                                </Badge>
                              ))}
                              {flujo.plataformas?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{flujo.plataformas.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{flujo.pasos?.length || 0} pasos</TableCell>
                          <TableCell>
                            {flujo.creado_en ? new Date(flujo.creado_en).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/recursos/detalle?id=${flujo.id}`} target="_blank">
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => generateWordDocument(flujo)}
                                title="Descargar pasos en Word"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditFlujo(flujo)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteFlujo(flujo.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tutoriales" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Gestión de Tutoriales</h2>
              <Dialog open={showCreateTutorial} onOpenChange={setShowCreateTutorial}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetTutorialForm()} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 w-4 h-4" />
                    Crear Tutorial
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTutorial ? 'Editar Tutorial' : 'Crear Nuevo Tutorial'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingTutorial ? 'Modifica los datos del tutorial' : 'Completa la información para crear un nuevo tutorial'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={editingTutorial ? handleUpdateTutorial : handleCreateTutorial} className="space-y-4">
                    <div>
                      <Label htmlFor="titulo">Título del Tutorial *</Label>
                      <Input
                        id="titulo"
                        value={tutorialForm.titulo}
                        onChange={(e) => setTutorialForm({...tutorialForm, titulo: e.target.value})}
                        placeholder="Título descriptivo del tutorial"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={tutorialForm.descripcion}
                        onChange={(e) => setTutorialForm({...tutorialForm, descripcion: e.target.value})}
                        placeholder="Describe de qué trata el tutorial..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="video_url">URL del Video *</Label>
                        <Input
                          id="video_url"
                          value={tutorialForm.video_url}
                          onChange={(e) => setTutorialForm({...tutorialForm, video_url: e.target.value})}
                          placeholder="https://youtube.com/watch?v=..."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="imagen_url">URL de Imagen</Label>
                        <Input
                          id="imagen_url"
                          value={tutorialForm.imagen_url}
                          onChange={(e) => setTutorialForm({...tutorialForm, imagen_url: e.target.value})}
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                      </div>
                    </div>

                    <PlatformEditor
                      platforms={tutorialForm.plataformas}
                      onChange={(platforms) => setTutorialForm({...tutorialForm, plataformas: platforms})}
                    />

                    <div className="flex justify-end gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowCreateTutorial(false);
                          resetTutorialForm();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        {editingTutorial ? 'Actualizar Tutorial' : 'Crear Tutorial'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando tutoriales...</p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Tutoriales</CardTitle>
                  <CardDescription>
                    Todos los tutoriales disponibles en la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Plataformas</TableHead>
                        <TableHead>Video</TableHead>
                        <TableHead>Creado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tutoriales.map((tutorial) => (
                        <TableRow key={tutorial.id}>
                          <TableCell className="font-medium">{tutorial.titulo}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {tutorial.descripcion || 'Sin descripción'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {tutorial.plataformas?.slice(0, 2).map((platform, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {platform.nombre}
                                </Badge>
                              ))}
                              {tutorial.plataformas?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{tutorial.plataformas.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {tutorial.video_url ? (
                              <Badge variant="outline" className="text-xs text-green-600">
                                ✓ Video
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-red-600">
                                ✗ Sin video
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {tutorial.creado_en ? new Date(tutorial.creado_en).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/recursos/detalle?id=${tutorial.id}&tipo=tutorial`} target="_blank">
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditTutorial(tutorial)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteTutorial(tutorial.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminRecursos;
