
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface DynamicHeaderProps {
  children?: React.ReactNode;
}

export const DynamicHeader = ({ children }: DynamicHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-2' : 'py-6'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <img 
              src="https://i.imgur.com/wR2n4Hg.png" 
              alt="Aumatia Logo" 
              className={`w-auto object-contain transition-all duration-300 ${
                scrolled ? 'h-12 md:h-14' : 'h-20 md:h-24 lg:h-28'
              }`}
            />
          </Link>
          
          {children}
        </div>
      </div>
    </header>
  );
};
