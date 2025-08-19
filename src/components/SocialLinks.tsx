
import { useEventTracking } from "@/hooks/useEventTracking";
import { Instagram, Youtube, Phone } from "lucide-react";

interface SocialLinksProps {
  iconSize?: number;
  className?: string;
}

export const SocialLinks = ({ 
  iconSize = 24, 
  className = "flex items-center gap-4" 
}: SocialLinksProps) => {
  const { registrarEvento } = useEventTracking();

  const handleSocialClick = (platform: string, url: string) => {
    registrarEvento({
      tipo_evento: 'click',
      descripcion: `Red social - ${platform}`
    });
    window.open(url, '_blank');
  };

  return (
    <div className={className}>
      <button
        onClick={() => handleSocialClick('Instagram', 'https://www.instagram.com/aumatia')}
        className="text-gray-600 hover:text-aumatia-blue transition-colors p-2 rounded-full hover:bg-gray-100"
        aria-label="Síguenos en Instagram"
      >
        <Instagram size={iconSize} />
      </button>
      
      <button
        onClick={() => handleSocialClick('YouTube', 'https://www.youtube.com/@Aumatia')}
        className="text-gray-600 hover:text-aumatia-blue transition-colors p-2 rounded-full hover:bg-gray-100"
        aria-label="Síguenos en YouTube"
      >
        <Youtube size={iconSize} />
      </button>
      
      <button
        onClick={() => handleSocialClick('WhatsApp', 'https://wa.link/dmvgi0')}
        className="text-gray-600 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-gray-100"
        aria-label="Contáctanos por WhatsApp"
      >
        <Phone size={iconSize} />
      </button>
    </div>
  );
};
