
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadsQuestionnaireModal } from "./LeadsQuestionnaireModal";
import { MessageCircle, Users, Zap } from "lucide-react";

export const ChatPanel = () => {
  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const [generatedICP, setGeneratedICP] = useState<string>("");

  // Función simulada para generar ICP - reemplaza con tu lógica real
  const handleGenerateICP = () => {
    // Aquí iría tu lógica actual de generación de ICP
    const sampleICP = "Perfil de cliente ideal generado basado en las respuestas del usuario...";
    setGeneratedICP(sampleICP);
    return sampleICP;
  };

  const handleICPOK = () => {
    // En lugar de generar leads directamente, abrir el modal del cuestionario
    const icp = handleGenerateICP();
    setShowLeadsModal(true);
  };

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            Panel de chat para interactuar con el asistente de IA y generar perfiles de clientes ideales.
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleICPOK}
              className="w-full bg-aumatia-blue hover:bg-aumatia-dark"
            >
              <Users className="mr-2 w-4 h-4" />
              Generar Leads
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => {
                // Otras funcionalidades del chat
                console.log("Chat function clicked");
              }}
            >
              <Zap className="mr-2 w-4 h-4" />
              Otra función
            </Button>
          </div>
        </CardContent>
      </Card>

      <LeadsQuestionnaireModal
        isOpen={showLeadsModal}
        onClose={() => setShowLeadsModal(false)}
        icp={generatedICP}
      />
    </>
  );
};
