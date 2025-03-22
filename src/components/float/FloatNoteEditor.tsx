
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Save,
  ArrowLeft,
  Hash,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { getNoteById, saveNote, updateNote, deleteNote } from '@/utils/notesStorage';
import type { Note } from '@/utils/notesStorage';

interface FloatNoteEditorProps {
  noteId?: string;
}

const FloatNoteEditor = ({ noteId }: FloatNoteEditorProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const effectiveNoteId = noteId || id;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load note data if editing an existing note
  useEffect(() => {
    if (effectiveNoteId) {
      setIsLoading(true);
      const note = getNoteById(effectiveNoteId);
      
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags);
      } else {
        toast({
          title: "Note not found",
          description: "The requested note could not be found",
          variant: "destructive"
        });
        navigate('/recent-notes');
      }
      
      setIsLoading(false);
    }
  }, [effectiveNoteId, navigate]);
  
  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title to your note",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (effectiveNoteId) {
        // Update existing note
        updateNote(effectiveNoteId, { title, content, tags });
        toast({
          title: "Note updated",
          description: "Your note has been successfully updated",
        });
      } else {
        // Create new note
        saveNote({ title, content, tags });
        toast({
          title: "Note created",
          description: "Your new note has been successfully saved",
        });
        navigate('/recent-notes');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error saving note",
        description: "There was a problem saving your note",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteNote = () => {
    if (!effectiveNoteId) return;
    
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      const deleted = deleteNote(effectiveNoteId);
      
      if (deleted) {
        toast({
          title: "Note deleted",
          description: "Your note has been successfully deleted",
        });
        navigate('/recent-notes');
      } else {
        toast({
          title: "Error deleting note",
          description: "There was a problem deleting your note",
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
  
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto pt-16 px-4 text-center">
        <p>Loading note...</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto pt-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/recent-notes')}
            className="mr-3"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">
            {effectiveNoteId ? 'Edit Note' : 'Create New Note'}
          </h1>
        </div>
        
        {effectiveNoteId && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDeleteNote}
            className="ml-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        )}
      </div>
      
      <div className="float-card p-6 mb-6">
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-medium mb-4 border-none px-0 h-auto focus-visible:ring-0"
        />
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <span 
              key={tag} 
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-float-accent/10 text-float-accent"
            >
              {tag}
              <button 
                className="ml-1.5 text-float-accent/70 hover:text-float-accent"
                onClick={() => handleRemoveTag(tag)}
              >
                &times;
              </button>
            </span>
          ))}
          <div className="inline-flex items-center">
            <Hash size={14} className="text-float-text-secondary mr-1" />
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add tag"
              className="border-none bg-transparent text-xs focus:outline-none w-20"
            />
            <button 
              className="text-xs text-float-text-secondary hover:text-float-accent ml-1"
              onClick={handleAddTag}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="border-b border-float-border mb-4 pb-2">
          <div className="flex gap-1 mb-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bold size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Italic size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Underline size={16} />
            </Button>
            <span className="w-px h-8 bg-float-border mx-1"></span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <List size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ListOrdered size={16} />
            </Button>
            <span className="w-px h-8 bg-float-border mx-1"></span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Image size={16} />
            </Button>
          </div>
        </div>
        
        <Textarea
          placeholder="Start writing your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] border-none px-0 focus-visible:ring-0 text-float-text"
        />
      </div>
      
      <div className="flex justify-end mb-16">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => navigate('/recent-notes')}
        >
          Cancel
        </Button>
        <Button 
          className="float-button float-button-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Note</>}
        </Button>
      </div>
    </motion.div>
  );
};

export default FloatNoteEditor;
