
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface FloatNoteEditorProps {
  noteId?: string;
}

const FloatNoteEditor = ({ noteId }: FloatNoteEditorProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(noteId ? 'Loading...' : 'Untitled Note');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Simulate loading a note if noteId is provided
  React.useEffect(() => {
    if (noteId) {
      // In a real app, we would fetch the note data from a backend
      setTimeout(() => {
        // Mock data for demonstration
        const mockNote = {
          title: noteId === '1' ? 'Concept Drift Mappings' : 
                 noteId === '2' ? 'Cognitive Loops and Recursion' :
                 noteId === '3' ? 'Paradoxical Illuminations' :
                 noteId === '4' ? 'Constellatory Graphics' : 'Note ' + noteId,
          content: 'This is the content of note ' + noteId + '. In a real application, this would be loaded from a database.',
          tags: ['sample', 'note', noteId === '1' ? 'concept' : 
                noteId === '2' ? 'cognition' : 
                noteId === '3' ? 'paradox' : 
                noteId === '4' ? 'visualization' : 'misc']
        };
        
        setTitle(mockNote.title);
        setContent(mockNote.content);
        setTags(mockNote.tags);
      }, 500);
    }
  }, [noteId]);
  
  const handleSave = () => {
    // In a real app, we would save the note to a backend
    console.log('Saving note:', { title, content, tags });
    toast({
      title: "Note saved",
      description: "Your note has been successfully saved",
    });
    
    if (!noteId) {
      navigate('/');
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
  
  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto pt-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-3"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">
          {noteId ? 'Edit Note' : 'Create New Note'}
        </h1>
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
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>
        <Button 
          className="float-button float-button-primary"
          onClick={handleSave}
        >
          <Save className="mr-2 h-4 w-4" /> Save Note
        </Button>
      </div>
    </motion.div>
  );
};

export default FloatNoteEditor;
