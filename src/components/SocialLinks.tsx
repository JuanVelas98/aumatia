
import { Linkedin, Youtube, Instagram, MessageCircle } from "lucide-react";

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
}

export const SocialLinks = ({ className = "", iconSize = 20 }: SocialLinksProps) => {
  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/juancvelam/",
      icon: Linkedin,
      color: "hover:bg-[#0077B5] hover:text-white",
      tooltip: "Seguir en LinkedIn"
    },
    {
      name: "YouTube", 
      url: "https://www.youtube.com/@Aumatia",
      icon: Youtube,
      color: "hover:bg-[#FF0000] hover:text-white",
      tooltip: "Ir a YouTube"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/aumatia.ai/?hl=es", 
      icon: Instagram,
      color: "hover:bg-[#E4405F] hover:text-white",
      tooltip: "Seguir en Instagram"
    },
    {
      name: "WhatsApp",
      url: "https://wa.link/dmvgi0",
      icon: MessageCircle,
      color: "hover:bg-[#25D366] hover:text-white",
      tooltip: "Contactar por WhatsApp"
    }
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            relative group w-10 h-10 rounded-full bg-aumatia-blue/10 border border-aumatia-blue/20 
            flex items-center justify-center text-aumatia-blue transition-all duration-300 
            hover:scale-110 hover:shadow-lg ${social.color}
          `}
          aria-label={social.tooltip}
          title={social.tooltip}
        >
          <social.icon size={iconSize} />
          
          {/* Tooltip */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {social.tooltip}
          </div>
        </a>
      ))}
    </div>
  );
};
