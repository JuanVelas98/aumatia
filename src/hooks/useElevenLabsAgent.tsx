
import { useEffect, useState } from 'react';

interface UseElevenLabsAgentProps {
  agentId: string;
}

export const useElevenLabsAgent = ({ agentId }: UseElevenLabsAgentProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadElevenLabsScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]')) {
        console.log('ElevenLabs script already loaded');
        setIsLoaded(true);
        return;
      }

      console.log('Loading ElevenLabs script...');
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      
      script.onload = () => {
        console.log('ElevenLabs script loaded successfully');
        setIsLoaded(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load ElevenLabs script');
        setError('Failed to load ElevenLabs script');
      };
      
      document.head.appendChild(script);
    };

    loadElevenLabsScript();

    return () => {
      // Cleanup if needed
      const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
      if (existingScript) {
        console.log('ElevenLabs script cleanup');
      }
    };
  }, []);

  return { isLoaded, error };
};
