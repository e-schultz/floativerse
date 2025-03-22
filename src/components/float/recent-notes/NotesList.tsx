import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Note } from '@/types/notes';
import { formatDate, getRelativeTime } from '@/utils/dateFormatting';

interface NotesListProps {
  notes: Note[];
}

export const NotesList: React.FC<NotesListProps> = ({ notes }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8">
      {notes.map((note, index) => (
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
                  Last edited: {getRelativeTime(note.updated_at)}
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
                {formatDate(note.created_at)}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/note/editor/${note.id}`}>View & Edit</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
