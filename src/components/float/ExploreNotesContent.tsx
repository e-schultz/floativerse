
import React, { useState } from 'react';
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

// Mock data for notes to explore
const allNotesData = [
  {
    id: '1',
    title: 'Concept Drift Mappings',
    excerpt: 'Stitching thoughts to time-stamped annotations creates a cohesive narrative of mental evolution.',
    tags: ['concept', 'knowledge', 'evolution'],
    date: 'Oct 12, 2023',
    views: 24
  },
  {
    id: '2',
    title: 'Cognitive Loops and Recursion',
    excerpt: 'Examining the patterns of thought that create self-referential structures in knowledge systems.',
    tags: ['cognition', 'patterns', 'recursion'],
    date: 'Oct 15, 2023',
    views: 18
  },
  {
    id: '3',
    title: 'Paradoxical Illuminations',
    excerpt: 'Highlighting contradictions within content can reveal deeper truths and unexpected connections.',
    tags: ['paradox', 'insight', 'connections'],
    date: 'Oct 20, 2023',
    views: 32
  },
  {
    id: '4',
    title: 'Constellatory Graphics',
    excerpt: 'Visualizing the evolution of thoughts as a graphic tale spanning multiple connected nodes.',
    tags: ['visualization', 'networks', 'evolution'],
    date: 'Oct 25, 2023',
    views: 15
  },
  {
    id: '5',
    title: 'Temporal Knowledge Structures',
    excerpt: 'How time affects the relevance and connections between ideas in a personal knowledge system.',
    tags: ['time', 'structure', 'knowledge'],
    date: 'Nov 1, 2023',
    views: 29
  },
  {
    id: '6',
    title: 'Semantic Bridges',
    excerpt: 'Creating meaningful connections between seemingly unrelated concepts through contextual anchors.',
    tags: ['semantics', 'connections', 'context'],
    date: 'Nov 5, 2023',
    views: 21
  }
];

// Aggregate all unique tags
const allTags = [...new Set(allNotesData.flatMap(note => note.tags))];

export const ExploreNotesContent = () => {
  const [activeViewType, setActiveViewType] = useState('grid');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Filter notes based on selected tags
  const filteredNotes = selectedTags.length > 0
    ? allNotesData.filter(note => 
        selectedTags.some(tag => note.tags.includes(tag))
      )
    : allNotesData;

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
                        <p className="text-float-text-secondary mb-4">{note.excerpt}</p>
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
                          Created: {note.date} • {note.views} views
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
                        <TableHead>Views</TableHead>
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
                          <TableCell>{note.date}</TableCell>
                          <TableCell>{note.views}</TableCell>
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
        </motion.div>
      </div>
    </div>
  );
};
