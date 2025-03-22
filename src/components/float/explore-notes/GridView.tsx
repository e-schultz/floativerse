
import React from 'react';
import { Note } from '@/utils/notesStorage';
import { NoteCard } from './NoteCard';

interface GridViewProps {
  filteredNotes: Note[];
  selectedTags: string[];
}

export const GridView: React.FC<GridViewProps> = ({ filteredNotes, selectedTags }) => {
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
