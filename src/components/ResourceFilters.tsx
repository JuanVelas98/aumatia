
interface ResourceFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  flujosCount: number;
  tutorialesCount: number;
}

export const ResourceFilters = ({ 
  activeFilter, 
  onFilterChange, 
  flujosCount, 
  tutorialesCount 
}: ResourceFiltersProps) => {
  const filters = [
    { key: 'all', label: 'Todos', count: flujosCount + tutorialesCount },
    { key: 'flujos', label: 'Flujos', count: flujosCount },
    { key: 'tutoriales', label: 'Tutoriales', count: tutorialesCount }
  ];

  return (
    <nav className="flex justify-center mb-8">
      <div className="inline-flex rounded-lg bg-white shadow-lg p-1 border">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`
              px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2
              ${activeFilter === filter.key 
                ? 'bg-aumatia-blue text-white shadow-md' 
                : 'text-gray-600 hover:text-aumatia-blue hover:bg-gray-50'
              }
            `}
          >
            {filter.label}
            <span className={`
              text-xs px-2 py-1 rounded-full
              ${activeFilter === filter.key 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-100 text-gray-500'
              }
            `}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
