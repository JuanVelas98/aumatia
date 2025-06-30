
import { ExternalLink } from "lucide-react";

interface Platform {
  nombre: string;
  link: string;
}

interface PlatformChipsProps {
  platforms: Platform[];
  className?: string;
}

export const PlatformChips = ({ platforms, className = "" }: PlatformChipsProps) => {
  if (!platforms || platforms.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <span className="text-sm font-medium text-aumatia-dark mb-1 w-full">
        Plataformas usadas:
      </span>
      {platforms.map((platform, index) => (
        <a
          key={index}
          href={platform.link}
          target="_blank"
          rel="noopener noreferrer"
          className="platform-chip group"
        >
          <span>{platform.nombre}</span>
          <ExternalLink size={14} className="opacity-70 group-hover:opacity-100" />
        </a>
      ))}
    </div>
  );
};
