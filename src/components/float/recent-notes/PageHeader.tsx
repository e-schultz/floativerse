
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PageHeader: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8 flex items-center justify-between"
    >
      <div className="flex items-center">
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
      </div>
      <Button asChild>
        <Link to="/note/editor" className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Link>
      </Button>
    </motion.div>
  );
};
