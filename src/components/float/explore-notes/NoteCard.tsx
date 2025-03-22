
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Note, formatDate, getRelativeTime } from '@/utils/notesStorage';

interface NoteCardProps {
  note: Note;
  index: number;
  selectedTags: string[];
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, index, selectedTags }) => {
  return (
    <motion.div
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
  );
};
