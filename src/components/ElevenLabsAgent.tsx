
import { useEffect, useRef } from 'react';
import { useElevenLabsAgent } from '@/hooks/useElevenLabsAgent';

interface ElevenLabsAgentProps {
  agentId: string;
  className?: string;
}

export const ElevenLabsAgent = ({ agentId, className = "" }: ElevenLabsAgentProps) => {
  const { isLoaded, error } = useElevenLabsAgent({ agentId });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded && containerRef.current) {
      console.log('Creating ElevenLabs agent element...');
      
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create the elevenlabs-convai element
      const agentElement = document.createElement('elevenlabs-convai');
      agentElement.setAttribute('agent-id', agentId);
      
      containerRef.current.appendChild(agentElement);
      
      console.log('ElevenLabs agent element created and appended');
    }
  }, [isLoaded, agentId]);

  if (error) {
    console.error('ElevenLabs Agent Error:', error);
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`elevenlabs-agent-container ${className}`}
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9999,
        pointerEvents: 'auto'
      }}
    />
  );
};
