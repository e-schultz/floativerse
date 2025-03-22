
import React from 'react';
import { Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showTagFilter: boolean;
  setShowTagFilter: (show: boolean) => void;
  selectedTags: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  showTagFilter,
  setShowTagFilter,
  selectedTags
}) => {
  return (
    <div className="float-card p-5">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search your recent notes..."
            className="float-input w-full pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowTagFilter(!showTagFilter)}
        >
          <Tag className="mr-2 h-4 w-4" />
          Filter by Tags
          {selectedTags.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-float-accent/20 text-float-accent rounded-full text-xs">
              {selectedTags.length}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};
