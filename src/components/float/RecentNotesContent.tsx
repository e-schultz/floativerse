
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Search, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Mock data for recent notes
const recentNotesData = [
  {
    id: '1',
    title: 'Concept Drift Mappings',
    excerpt: 'Stitching thoughts to time-stamped annotations creates a cohesive narrative of mental evolution.',
    tags: ['concept', 'knowledge', 'evolution'],
    date: 'Oct 12, 2023',
    lastEdited: '2 hours ago'
  },
  {
    id: '2',
    title: 'Cognitive Loops and Recursion',
    excerpt: 'Examining the patterns of thought that create self-referential structures in knowledge systems.',
    tags: ['cognition', 'patterns', 'recursion'],
    date: 'Oct 15, 2023',
    lastEdited: '1 day ago'
  },
  {
    id: '3',
    title: 'Paradoxical Illuminations',
    excerpt: 'Highlighting contradictions within content can reveal deeper truths and unexpected connections.',
    tags: ['paradox', 'insight', 'connections'],
    date: 'Oct 20, 2023',
    lastEdited: '3 days ago'
  },
  {
    id: '4',
    title: 'Constellatory Graphics',
    excerpt: 'Visualizing the evolution of thoughts as a graphic tale spanning multiple connected nodes.',
    tags: ['visualization', 'networks', 'evolution'],
    date: 'Oct 25, 2023',
    lastEdited: '1 week ago'
  },
  {
    id: '5',
    title: 'Temporal Knowledge Structures',
    excerpt: 'How time affects the relevance and connections between ideas in a personal knowledge system.',
    tags: ['time', 'structure', 'knowledge'],
    date: 'Nov 1, 2023',
    lastEdited: '2 weeks ago'
  },
  {
    id: '6',
    title: 'Semantic Bridges',
    excerpt: 'Creating meaningful connections between seemingly unrelated concepts through contextual anchors.',
    tags: ['semantics', 'connections', 'context'],
    date: 'Nov 5, 2023',
    lastEdited: '3 weeks ago'
  }
];

export const RecentNotesContent = () => {
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
                />
              </div>
              <Button variant="outline" size="sm">
                <Tag className="mr-2 h-4 w-4" />
                Filter by Tags
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {recentNotesData.map((note, index) => (
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
                      Last edited: {note.lastEdited}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-float-text-secondary">{note.excerpt}</p>
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
                  <span className="text-xs text-float-text-secondary">{note.date}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/note/editor/${note.id}`}>View & Edit</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
