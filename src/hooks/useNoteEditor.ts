
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Note } from '@/types/notes';
import { toast } from '@/hooks/use-toast';
import { useNote, useCreateNote, useUpdateNote, useDeleteNote } from '@/utils/notesStorage';

interface UseNoteEditorProps {
  noteId?: string;
}

export function useNoteEditor({ noteId }: UseNoteEditorProps) {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const { data: note, isLoading, isError } = useNote(noteId || '');
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  
  // Load note data if editing an existing note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    }
  }, [note]);

  // Handle errors in note loading
  useEffect(() => {
    if (isError && noteId) {
      toast({
        title: "Note not found",
        description: "The requested note could not be found",
        variant: "destructive"
      });
      navigate('/recent-notes');
    }
  }, [isError, noteId, navigate]);
  
  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title to your note",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (noteId) {
        // Update existing note
        await updateNote.mutateAsync({
          id: noteId,
          updates: { title, content, tags }
        });
        
        toast({
          title: "Note updated",
          description: "Your note has been successfully updated",
        });
      } else {
        // Create new note
        await createNote.mutateAsync({ title, content, tags });
        
        toast({
          title: "Note created",
          description: "Your new note has been successfully saved",
        });
        navigate('/recent-notes');
      }
    } catch (error: any) {
      console.error('Error saving note:', error);
      toast({
        title: "Error saving note",
        description: error.message || "There was a problem saving your note",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteNote = async () => {
    if (!noteId) return;
    
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        await deleteNote.mutateAsync(noteId);
        
        toast({
          title: "Note deleted",
          description: "Your note has been successfully deleted",
        });
        navigate('/recent-notes');
      } catch (error: any) {
        toast({
          title: "Error deleting note",
          description: error.message || "There was a problem deleting your note",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    tags,
    newTag,
    setNewTag,
    isLoading,
    handleSave,
    handleDeleteNote,
    handleAddTag,
    handleRemoveTag,
    isPending: createNote.isPending || updateNote.isPending,
    isDeleting: deleteNote.isPending
  };
}
