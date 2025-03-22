
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Note } from '@/utils/notesStorage';
import { GridView } from './GridView';
import { NotesTable } from './NotesTable';
import { ViewToggle } from './ViewToggle';

interface NotesViewProps {
  activeViewType: string;
  setActiveViewType: (value: string) => void;
  filteredNotes: Note[];
  selectedTags: string[];
  isLoading: boolean;
}

export const NotesView: React.FC<NotesViewProps> = ({
  activeViewType,
  setActiveViewType,
  filteredNotes,
  selectedTags,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-float-text-secondary">Loading notes...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {selectedTags.length > 0 
            ? `Notes with tags: ${selectedTags.join(', ')}` 
            : 'All Notes'}
        </h2>
        <ViewToggle 
          activeViewType={activeViewType} 
          setActiveViewType={setActiveViewType} 
        />
      </div>

      <Tabs value={activeViewType} className="w-full">
        <TabsContent value="grid" className="mt-0">
          <GridView 
            filteredNotes={filteredNotes} 
            selectedTags={selectedTags} 
          />
        </TabsContent>
        
        <TabsContent value="table" className="mt-0">
          <NotesTable 
            filteredNotes={filteredNotes} 
            selectedTags={selectedTags} 
          />
        </TabsContent>
      </Tabs>
    </>
  );
};
