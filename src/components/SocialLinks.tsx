
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
      color: "hover:text-[#0077B5]"
    },
    {
      name: "YouTube", 
      url: "https://www.youtube.com/@Aumatia",
      icon: Youtube,
      color: "hover:text-[#FF0000]"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/aumatia.ai/?hl=es", 
      icon: Instagram,
      color: "hover:text-[#E4405F]"
    },
    {
      name: "WhatsApp",
      url: "https://wa.link/dmvgi0",
      icon: MessageCircle,
      color: "hover:text-[#25D366]"
    }
  ];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-aumatia-blue ${social.color} transition-colors duration-200`}
          aria-label={`Visitar ${social.name} de Aumatia`}
        >
          <social.icon size={iconSize} />
        </a>
      ))}
    </div>
  );
};
