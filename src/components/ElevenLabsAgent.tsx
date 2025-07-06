
import { useEffect, useRef, useState } from 'react';
import { useElevenLabsAgent } from '@/hooks/useElevenLabsAgent';
import { Mic, MicOff, MessageCircle } from 'lucide-react';

interface ElevenLabsAgentProps {
  agentId: string;
  className?: string;
}

export const ElevenLabsAgent = ({ agentId, className = "" }: ElevenLabsAgentProps) => {
  const { isLoaded, error } = useElevenLabsAgent({ agentId });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoaded && containerRef.current) {
      console.log('Creating ElevenLabs agent element...');
      
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create the elevenlabs-convai element
      const agentElement = document.createElement('elevenlabs-convai');
      agentElement.setAttribute('agent-id', agentId);
      
      // Hide the default widget and handle it manually
      agentElement.style.display = 'none';
      
      containerRef.current.appendChild(agentElement);
      
      console.log('ElevenLabs agent element created and appended');
    }
  }, [isLoaded, agentId]);

  if (error) {
    console.error('ElevenLabs Agent Error:', error);
    return null;
  }

  const toggleWidget = () => {
    setIsVisible(!isVisible);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here you would integrate with the actual ElevenLabs API
  };

  return (
    <>
      {/* Hidden ElevenLabs widget */}
      <div ref={containerRef} style={{ display: 'none' }} />
      
      {/* Custom UI */}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        {isVisible && (
          <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="p-6 text-center">
              {/* Avatar */}
              <div className="relative mx-auto mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                  <img 
                    src="/lovable-uploads/4935478e-480a-4786-a2e8-83300a91aa20.png" 
                    alt="AI Assistant" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Listening indicator */}
                {isListening && (
                  <div className="absolute -inset-2 rounded-full border-2 border-aumatia-blue animate-pulse"></div>
                )}
              </div>
              
              {/* Status */}
              <p className="text-gray-600 text-sm mb-6">
                {isListening ? 'Listening...' : 'Ready to help'}
              </p>
              
              {/* Message input area */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Send a message"
                  className="w-full px-4 py-3 bg-gray-50 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aumatia-blue focus:bg-white transition-all"
                  onFocus={toggleListening}
                  onBlur={() => setIsListening(false)}
                />
                <button
                  onClick={toggleListening}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white' 
                      : 'bg-aumatia-blue text-white hover:bg-aumatia-dark'
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Toggle button */}
        <button
          onClick={toggleWidget}
          className="w-14 h-14 bg-aumatia-blue hover:bg-aumatia-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    </>
  );
};
