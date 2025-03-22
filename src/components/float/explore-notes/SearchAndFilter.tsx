
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  allTags: string[];
  toggleTag: (tag: string) => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTags,
  allTags,
  toggleTag
}) => {
  return (
    <Card className="float-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Search & Filter</CardTitle>
        <CardDescription>Find notes by title, content, or tags</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex-1 mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search across all notes..."
            className="float-input w-full pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="mb-2">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter by Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Button
                key={tag}
                size="sm"
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`text-xs px-3 py-1 h-7 ${
                  selectedTags.includes(tag) 
                    ? "bg-float-accent text-white" 
                    : "text-float-accent"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
