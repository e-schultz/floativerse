
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatContentProps {
  sidebarOpen: boolean;
}

const FloatContent = ({ sidebarOpen }: FloatContentProps) => {
  const isMobile = useIsMobile();
  
  const contentVariants = {
    expanded: { 
      paddingLeft: isMobile ? '1rem' : sidebarOpen ? '18rem' : '5rem',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    narrowed: { 
      paddingLeft: isMobile ? '1rem' : sidebarOpen ? '18rem' : '5rem',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    }
  };

  const notesData = [
    {
      id: '1',
      title: 'Concept Drift Mappings',
      excerpt: 'Stitching thoughts to time-stamped annotations creates a cohesive narrative of mental evolution.',
      tags: ['concept', 'knowledge', 'evolution'],
      date: 'Oct 12, 2023'
    },
    {
      id: '2',
      title: 'Cognitive Loops and Recursion',
      excerpt: 'Examining the patterns of thought that create self-referential structures in knowledge systems.',
      tags: ['cognition', 'patterns', 'recursion'],
      date: 'Oct 15, 2023'
    },
    {
      id: '3',
      title: 'Paradoxical Illuminations',
      excerpt: 'Highlighting contradictions within content can reveal deeper truths and unexpected connections.',
      tags: ['paradox', 'insight', 'connections'],
      date: 'Oct 20, 2023'
    },
    {
      id: '4',
      title: 'Constellatory Graphics',
      excerpt: 'Visualizing the evolution of thoughts as a graphic tale spanning multiple connected nodes.',
      tags: ['visualization', 'networks', 'evolution'],
      date: 'Oct 25, 2023'
    }
  ];

  return (
    <motion.main
      className={cn("min-h-screen pt-16 pr-4 pb-16", isMobile && "pl-4")}
      initial="narrowed"
      animate={sidebarOpen ? "expanded" : "narrowed"}
      variants={contentVariants}
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2"
          >
            <div className="text-sm font-medium text-float-accent">Personal Knowledge Management</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-bold mb-4">Your Thought Universe</h1>
            <p className="text-float-text-secondary max-w-2xl">
              Capture, connect, and cultivate your ideas in this personal knowledge ecosystem. 
              Link concepts across time and space to reveal patterns in your thinking.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 mt-6"
          >
            <Button className="float-button float-button-primary" as={Link} to="/note/editor">
              <Plus className="mr-2 h-4 w-4" /> Create New Note
            </Button>
            <Button className="float-button" variant="outline">
              <Search className="mr-2 h-4 w-4" /> Explore Notes
            </Button>
          </motion.div>
        </header>

        <section className="space-y-6 mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Recent Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notesData.map((note, index) => (
                <motion.div
                  key={note.id}
                  className="float-card p-5 hover:translate-y-[-2px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                >
                  <h3 className="text-lg font-medium mb-2">{note.title}</h3>
                  <p className="text-float-text-secondary text-sm mb-4">{note.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-float-accent/10 text-float-accent rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-float-text-secondary">
                    <span>{note.date}</span>
                    <Link to={`/note/editor/${note.id}`} className="text-float-primary hover:underline">View note</Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Concept Connections</h2>
            <div className="float-card p-6 flex flex-col items-center justify-center">
              <div className="w-full h-64 bg-gradient-to-br from-float-primary/5 to-float-accent/5 rounded-lg flex items-center justify-center mb-4">
                <p className="text-float-text-secondary text-center px-6">
                  Interactive concept map visualization will appear here in the next iteration.
                </p>
              </div>
              <p className="text-sm text-float-text-secondary max-w-lg text-center">
                Visualize the connections between your notes, tags, and concepts. 
                Discover patterns and insights through the interconnected web of your knowledge.
              </p>
            </div>
          </motion.div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Thought Evolution</h2>
            <div className="float-card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-float-primary"></div>
                <div className="h-px flex-1 bg-float-border"></div>
                <div className="h-3 w-3 rounded-full bg-float-accent"></div>
              </div>
              <p className="text-float-text-secondary mb-4">
                Track how your ideas evolve over time, from initial concepts to developed theories.
                Capture the journey of your thoughts as they mature and connect with other ideas.
              </p>
              <Button variant="outline" size="sm" className="float-button">
                <ArrowLeft className="mr-2 h-4 w-4" /> Timeline View
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.main>
  );
};

export default FloatContent;
