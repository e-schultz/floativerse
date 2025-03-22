
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Search, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { getNotes, getRelativeTime, formatDate } from '@/utils/notesStorage';
import type { Note } from '@/utils/notesStorage';

export const RecentNotesContent = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const notesPerPage = 5;
  
  // Get all available tags from notes
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [notes]);
  
  // Load notes from storage
  useEffect(() => {
    const storedNotes = getNotes();
    setNotes(storedNotes);
    setFilteredNotes(storedNotes);
  }, []);
  
  // Filter notes when search query or selected tags change
  useEffect(() => {
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
    
    setFilteredNotes(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedTags, notes]);
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex items-center"
        >
          <Button variant="ghost" size="sm" className="mr-4" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Clock className="mr-3 h-6 w-6 text-float-accent" />
            Recent Notes
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="float-card p-5">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your recent notes..."
                  className="float-input w-full pl-10 pr-4 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            
            {showTagFilter && (
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
                    onClick={() => setSelectedTags([])}
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-float-text-secondary">No notes found. Try adjusting your search or creating a new note.</p>
            <Button className="mt-4" asChild>
              <Link to="/note/editor">Create New Note</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {currentNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
              >
                <Card className="float-card hover:translate-y-[-2px] transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex justify-between items-center">
                      {note.title}
                      <span className="text-sm font-normal text-float-text-secondary">
                        Last edited: {getRelativeTime(note.updatedAt)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-float-text-secondary">
                      {note.content.length > 150 
                        ? `${note.content.substring(0, 150)}...` 
                        : note.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {note.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-float-accent/10 text-float-accent rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-2">
                    <span className="text-xs text-float-text-secondary">
                      {formatDate(note.createdAt)}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/note/editor/${note.id}`}>View & Edit</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(prev => Math.max(prev - 1, 1));
                    }} 
                  />
                </PaginationItem>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    href="#" 
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    }} 
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};
