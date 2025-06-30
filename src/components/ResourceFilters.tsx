
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface ResourceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
  allPlatforms: string[];
  activeTab: 'flujos' | 'tutoriales';
  onTabChange: (tab: 'flujos' | 'tutoriales') => void;
}

export const ResourceFilters = ({ 
  searchQuery,
  onSearchChange,
  selectedPlatforms,
  onPlatformChange,
  allPlatforms,
  activeTab,
  onTabChange
}: ResourceFiltersProps) => {
  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onPlatformChange([...selectedPlatforms, platform]);
    }
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onPlatformChange([]);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <nav className="flex justify-center">
        <div className="inline-flex rounded-lg bg-white shadow-lg p-1 border">
          <button
            onClick={() => onTabChange('flujos')}
            className={`
              px-6 py-3 rounded-md font-medium transition-all duration-200
              ${activeTab === 'flujos' 
                ? 'bg-aumatia-blue text-white shadow-md' 
                : 'text-gray-600 hover:text-aumatia-blue hover:bg-gray-50'
              }
            `}
          >
            Flujos
          </button>
          <button
            onClick={() => onTabChange('tutoriales')}
            className={`
              px-6 py-3 rounded-md font-medium transition-all duration-200
              ${activeTab === 'tutoriales' 
                ? 'bg-aumatia-blue text-white shadow-md' 
                : 'text-gray-600 hover:text-aumatia-blue hover:bg-gray-50'
              }
            `}
          >
            Tutoriales
          </button>
        </div>
      </nav>

      {/* Search and Filters */}
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={`Buscar ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border-gray-200 focus:border-aumatia-blue focus:ring-aumatia-blue"
          />
        </div>

        {/* Platform Filters */}
        {allPlatforms.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Filtrar por plataforma:</h3>
              {(selectedPlatforms.length > 0 || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpiar filtros
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allPlatforms.map((platform) => (
                <Badge
                  key={platform}
                  variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedPlatforms.includes(platform)
                      ? 'bg-aumatia-blue hover:bg-aumatia-dark text-white'
                      : 'hover:bg-gray-100 hover:border-aumatia-blue'
                  }`}
                  onClick={() => handlePlatformToggle(platform)}
                >
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(selectedPlatforms.length > 0 || searchQuery) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Filtros activos:</span>
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Búsqueda: "{searchQuery}"
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => onSearchChange('')}
                />
              </Badge>
            )}
            {selectedPlatforms.map((platform) => (
              <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                {platform}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => handlePlatformToggle(platform)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
