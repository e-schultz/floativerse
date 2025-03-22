
import React from 'react';

interface TagFilterProps {
  showTagFilter: boolean;
  allTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  showTagFilter,
  allTags,
  selectedTags,
  toggleTag,
  clearTags
}) => {
  if (!showTagFilter) return null;
  
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {allTags.map(tag => (
        <button
          key={tag}
          className={`px-2.5 py-1 rounded-full text-xs ${
            selectedTags.includes(tag) 
              ? 'bg-float-accent text-white' 
              : 'bg-float-accent/10 text-float-accent'
          }`}
          onClick={() => toggleTag(tag)}
        >
          {tag}
        </button>
      ))}
      {selectedTags.length > 0 && (
        <button 
          className="px-2.5 py-1 rounded-full text-xs border border-gray-300 text-gray-500"
          onClick={clearTags}
        >
          Clear All
        </button>
      )}
    </div>
  );
};
