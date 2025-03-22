
import React from 'react';
import { Note } from '@/utils/notesStorage';
import { NoteCard } from './NoteCard';
import { LoadingState } from '../recent-notes/LoadingState';

interface GridViewProps {
  filteredNotes: Note[];
  selectedTags: string[];
  isLoading?: boolean;
}

export const GridView: React.FC<GridViewProps> = ({ 
  filteredNotes, 
  selectedTags,
  isLoading = false
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (filteredNotes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-float-text-secondary">No notes found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {filteredNotes.map((note, index) => (
        <NoteCard 
          key={note.id} 
          note={note} 
          index={index} 
          selectedTags={selectedTags} 
        />
      ))}
    </div>
  );
};
