
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNotes } from '@/utils/notesStorage';
import { PageHeader } from './recent-notes/PageHeader';
import { SearchBar } from './recent-notes/SearchBar';
import { TagFilter } from './recent-notes/TagFilter';
import { NotesList } from './recent-notes/NotesList';
import { EmptyState } from './recent-notes/EmptyState';
import { NotePagination } from './recent-notes/NotePagination';
import { LoadingState } from './recent-notes/LoadingState';
import { ErrorState } from './recent-notes/ErrorState';

export const RecentNotesContent = () => {
  const { data: notes = [], isLoading, isError } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const notesPerPage = 5;
  
  // Get all available tags from notes
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [notes]);
  
  // Filter notes when search query or selected tags change
  const filteredNotes = useMemo(() => {
    let filtered = notes;
    
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
        selectedTags.every(tag => note.tags.includes(tag))
      );
    }
    
    return filtered;
  }, [searchQuery, selectedTags, notes]);
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Clear all selected tags
  const clearTags = () => {
    setSelectedTags([]);
    setCurrentPage(1); // Reset to first page when clearing tags
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
  const currentNotes = filteredNotes.slice(
    (currentPage - 1) * notesPerPage,
    currentPage * notesPerPage
  );
  
  return (
    <div className="min-h-screen pt-16 pr-4 pb-16 pl-4">
      <div className="max-w-4xl mx-auto">
        <PageHeader />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={(query) => {
              setSearchQuery(query);
              setCurrentPage(1); // Reset to first page when search changes
            }}
            showTagFilter={showTagFilter}
            setShowTagFilter={setShowTagFilter}
            selectedTags={selectedTags}
          />
          
          <TagFilter 
            showTagFilter={showTagFilter}
            allTags={allTags}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            clearTags={clearTags}
          />
        </motion.div>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState />
        ) : filteredNotes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <NotesList notes={currentNotes} />
            <NotePagination 
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};
