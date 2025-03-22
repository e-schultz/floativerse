
import React from 'react';
import { Hash } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ 
  tags, 
  newTag, 
  setNewTag, 
  onAddTag, 
  onRemoveTag 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map(tag => (
        <span 
          key={tag} 
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-float-accent/10 text-float-accent"
        >
          {tag}
          <button 
            className="ml-1.5 text-float-accent/70 hover:text-float-accent"
            onClick={() => onRemoveTag(tag)}
          >
            &times;
          </button>
        </span>
      ))}
      <div className="inline-flex items-center">
        <Hash size={14} className="text-float-text-secondary mr-1" />
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddTag()}
          placeholder="Add tag"
          className="border-none bg-transparent text-xs focus:outline-none w-20"
        />
        <button 
          className="text-xs text-float-text-secondary hover:text-float-accent ml-1"
          onClick={onAddTag}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TagInput;
