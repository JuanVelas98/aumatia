
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Video, BarChart3, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useRecursos, Flujo, Tutorial } from "@/hooks/useRecursos";
import { FlujosTable } from "@/components/FlujosTable";
import { TutorialesTable } from "@/components/TutorialesTable";
import { FlujoFormDialog } from "@/components/FlujoFormDialog";
import { TutorialFormDialog } from "@/components/TutorialFormDialog";
import { ElevenLabsAgent } from "@/components/ElevenLabsAgent";

const AdminRecursos = () => {
  const { 
    flujos, 
    tutoriales, 
    loading, 
    fetchRecursos, 
    toggleFlujoVisibility, 
    deleteFlujo, 
    deleteTutorial 
  } = useRecursos();

  const [showCreateFlujo, setShowCreateFlujo] = useState(false);
  const [showCreateTutorial, setShowCreateTutorial] = useState(false);
  const [editingFlujo, setEditingFlujo] = useState<Flujo | null>(null);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);

  const handleEditFlujo = (flujo: Flujo) => {
    console.log('Editing flujo:', flujo);
    setEditingFlujo(flujo);
    setShowCreateFlujo(true);
  };

  const handleEditTutorial = (tutorial: Tutorial) => {
    console.log('Editing tutorial:', tutorial);
    setEditingTutorial(tutorial);
    setShowCreateTutorial(true);
  };

  const handleCreateFlujo = () => {
    setEditingFlujo(null);
    setShowCreateFlujo(true);
  };

  const handleCreateTutorial = () => {
    setEditingTutorial(null);
    setShowCreateTutorial(true);
  };

  const handleFlujoFormClose = () => {
    setShowCreateFlujo(false);
    setEditingFlujo(null);
  };

  const handleTutorialFormClose = () => {
    setShowCreateTutorial(false);
    setEditingTutorial(null);
  };

  const handleFormSuccess = () => {
    fetchRecursos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600 mt-2">Gestiona flujos y tutoriales de Aumatia</p>
          </div>
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
                  <Button onClick={handleCreateFlujo} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 w-4 h-4" />
                    Crear Flujo
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <FlujosTable 
              flujos={flujos}
              loading={loading}
              onEdit={handleEditFlujo}
              onDelete={deleteFlujo}
              onToggleVisibility={toggleFlujoVisibility}
            />
          </TabsContent>

          <TabsContent value="tutoriales" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Gestión de Tutoriales</h2>
              <Dialog open={showCreateTutorial} onOpenChange={setShowCreateTutorial}>
                <DialogTrigger asChild>
                  <Button onClick={handleCreateTutorial} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 w-4 h-4" />
                    Crear Tutorial
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <TutorialesTable 
              tutoriales={tutoriales}
              loading={loading}
              onEdit={handleEditTutorial}
              onDelete={deleteTutorial}
            />
          </TabsContent>
        </Tabs>

        <FlujoFormDialog
          open={showCreateFlujo}
          onOpenChange={setShowCreateFlujo}
          editingFlujo={editingFlujo}
          onSuccess={handleFormSuccess}
        />

        <TutorialFormDialog
          open={showCreateTutorial}
          onOpenChange={setShowCreateTutorial}
          editingTutorial={editingTutorial}
          onSuccess={handleFormSuccess}
        />
      </div>

      {/* ElevenLabs Conversational AI Agent */}
      <ElevenLabsAgent agentId="agent_01jzdz2swkesv97bjfscggh56j" />
    </div>
  );
};

export default AdminRecursos;
