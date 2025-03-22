
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useExploreNotes } from '@/utils/notesStorage';
import { PageHeader } from './explore-notes/PageHeader';
import { SearchAndFilter } from './explore-notes/SearchAndFilter';
import { NotesView } from './explore-notes/NotesView';

export const ExploreNotesContent = () => {
  const { data: notesData = [], isLoading } = useExploreNotes();
  const [activeViewType, setActiveViewType] = useState('grid');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique tags from real notes data
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    notesData.forEach(note => {
      note.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [notesData]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Filter notes based on selected tags and search query
  const filteredNotes = useMemo(() => {
    let filtered = notesData;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note => 
        selectedTags.some(tag => note.tags.includes(tag))
      );
    }
    
    return filtered;
  }, [notesData, selectedTags, searchQuery]);

  return (
    <div className="min-h-screen pt-16 pr-4 pb-16 pl-4">
      <div className="max-w-5xl mx-auto">
        <PageHeader />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <SearchAndFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTags={selectedTags}
            allTags={allTags}
            toggleTag={toggleTag}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <NotesView
            activeViewType={activeViewType}
            setActiveViewType={setActiveViewType}
            filteredNotes={filteredNotes}
            selectedTags={selectedTags}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </div>
  );
};
