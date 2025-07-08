import { ElevenLabsAgent } from "@/components/ElevenLabsAgent";

const Hablar = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Habla con nuestro Asistente IA
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Conversa en tiempo real con nuestro asistente de voz inteligente
        </p>
        
        {/* ElevenLabs Agent - positioned in the center */}
        <ElevenLabsAgent 
          agentId="agent_01jzh0ts0cf5ta62mx8c6kd28j" 
          className="mx-auto"
        />
      </div>
    </div>
  );
};

export default Hablar;