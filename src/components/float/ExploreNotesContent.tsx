
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Tag, ArrowLeft, BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useExploreNotes, getRelativeTime, formatDate } from '@/utils/notesStorage';

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
            <BookOpen className="mr-3 h-6 w-6 text-float-accent" />
            Explore Notes
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {selectedTags.length > 0 
                ? `Notes with tags: ${selectedTags.join(', ')}` 
                : 'All Notes'}
            </h2>
            <Tabs value={activeViewType} onValueChange={setActiveViewType} className="w-auto">
              <TabsList className="grid w-[180px] grid-cols-2">
                <TabsTrigger value="grid">Card View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-float-text-secondary">Loading notes...</p>
            </div>
          ) : (
            <Tabs value={activeViewType} className="w-full">
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {filteredNotes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (index * 0.05) }}
                    >
                      <Card className="float-card hover:translate-y-[-2px] transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{note.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-float-text-secondary mb-4">
                            {note.content.length > 150 
                              ? `${note.content.substring(0, 150)}...` 
                              : note.content}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {note.tags.map(tag => (
                              <span 
                                key={tag} 
                                className={`px-2 py-1 rounded-full text-xs ${
                                  selectedTags.includes(tag)
                                    ? "bg-float-accent text-white"
                                    : "bg-float-accent/10 text-float-accent"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center pt-2">
                          <span className="text-xs text-float-text-secondary">
                            Created: {formatDate(note.created_at)} • Updated: {getRelativeTime(note.updated_at)}
                          </span>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/note/editor/${note.id}`}>View & Edit</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="table" className="mt-0">
                <Card className="float-card">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredNotes.map((note) => (
                          <TableRow key={note.id}>
                            <TableCell className="font-medium">{note.title}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {note.tags.map(tag => (
                                  <span 
                                    key={tag} 
                                    className={`px-2 py-0.5 rounded-full text-xs ${
                                      selectedTags.includes(tag)
                                        ? "bg-float-accent text-white"
                                        : "bg-float-accent/10 text-float-accent"
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(note.created_at)}</TableCell>
                            <TableCell>{getRelativeTime(note.updated_at)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/note/editor/${note.id}`}>View & Edit</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </div>
    </div>
  );
};
