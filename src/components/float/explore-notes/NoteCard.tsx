
import React from 'react';
import { Note } from '@/types/notes';
import { NoteCardItem } from './NoteCardItem';

interface NoteCardProps {
  note: Note;
  index: number;
  selectedTags: string[];
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, index, selectedTags }) => {
  return (
    <NoteCardItem 
      note={note} 
      index={index} 
      selectedTags={selectedTags} 
    />
  );
};
