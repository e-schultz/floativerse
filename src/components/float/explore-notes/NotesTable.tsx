
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Note, formatDate, getRelativeTime } from '@/utils/notesStorage';

interface NotesTableProps {
  filteredNotes: Note[];
  selectedTags: string[];
}

export const NotesTable: React.FC<NotesTableProps> = ({ filteredNotes, selectedTags }) => {
  return (
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
  );
};
