
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNoteEditor } from '@/hooks/useNoteEditor';
import { toast } from '@/hooks/use-toast';
import NoteHeader from './note-editor/NoteHeader';
import TagInput from './note-editor/TagInput';
import EditorToolbar from './note-editor/EditorToolbar';
import CommandMenu, { COMMANDS } from './note-editor/CommandMenu';
import { 
  checkForSlashCommand, 
  processAIPrompt, 
  insertAIResponse, 
  getCursorCoordinates,
  formatTextInTextarea,
  handleTabIndent,
  extractContextFromHeaders
} from '@/utils/textFormatting';
import { generateAIResponse } from '@/services/aiService';

interface FloatNoteEditorProps {
  noteId?: string;
}

const FloatNoteEditor = ({ noteId }: FloatNoteEditorProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const effectiveNoteId = noteId || id;
  
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [commandWithText, setCommandWithText] = useState<string | null>(null);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isUsingHeaderContext, setIsUsingHeaderContext] = useState(false);
  
  const { 
    title, 
    setTitle, 
    content, 
    setContent,
    tags,
    newTag,
    setNewTag,
    textareaRef,
    isLoading,
    handleSave,
    handleDeleteNote,
    handleAddTag,
    handleRemoveTag,
    isPending,
    isDeleting
  } = useNoteEditor({ noteId: effectiveNoteId });
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (!textareaRef.current) return;
    
    const cursorPosition = e.target.selectionStart;
    const lineStart = newContent.lastIndexOf('\n', cursorPosition - 1) + 1;
    const currentLineText = newContent.substring(lineStart, cursorPosition);
    
    const slashCommandInfo = checkForSlashCommand(currentLineText);
    
    if (slashCommandInfo) {
      const position = getCursorCoordinates(textareaRef.current);
      setMenuPosition(position);
      setCommandFilter(slashCommandInfo.command);
      setCommandWithText(slashCommandInfo.fullText);
      setShowCommandMenu(true);
      setSelectedCommandIndex(0);
    } else {
      setShowCommandMenu(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      if (!textareaRef.current) return;
      
      e.preventDefault();
      
      const newContent = handleTabIndent(
        textareaRef.current, 
        e.shiftKey
      );
      
      if (newContent) {
        setContent(newContent);
      }
      
      return;
    }
    
    if (showCommandMenu) {
      if (e.key === 'Escape') {
        setShowCommandMenu(false);
        e.preventDefault();
      }
      
      if (e.key === 'Tab' && commandFilter.startsWith('/')) {
        const matchingCommands = COMMANDS.filter(cmd => 
          cmd.label.toLowerCase().includes(commandFilter.toLowerCase().replace('/', ''))
        );
        
        if (matchingCommands.length === 1) {
          handleCommandSelect(matchingCommands[0].id);
          e.preventDefault();
        }
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        
        const matchingCommands = COMMANDS.filter(cmd => 
          cmd.label.toLowerCase().includes(commandFilter.toLowerCase().replace('/', ''))
        );
        
        setSelectedCommandIndex(prev => 
          prev > 0 ? prev - 1 : matchingCommands.length - 1
        );
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        
        const matchingCommands = COMMANDS.filter(cmd => 
          cmd.label.toLowerCase().includes(commandFilter.toLowerCase().replace('/', ''))
        );
        
        setSelectedCommandIndex(prev => 
          prev < matchingCommands.length - 1 ? prev + 1 : 0
        );
      }
      
      if (e.key === 'Enter') {
        e.preventDefault();
        
        const matchingCommands = COMMANDS.filter(cmd => 
          cmd.label.toLowerCase().includes(commandFilter.toLowerCase().replace('/', ''))
        );
        
        if (matchingCommands.length > 0) {
          const actualIndex = Math.min(selectedCommandIndex, matchingCommands.length - 1);
          handleCommandSelect(matchingCommands[actualIndex].id);
        }
      }
    }
  };
  
  const handleTextareaClick = () => {
    if (showCommandMenu) {
      setShowCommandMenu(false);
    }
  };
  
  const handleFormatText = (format: string) => {
    if (!textareaRef.current) return;
    const newContent = formatTextInTextarea(textareaRef.current, format);
    setContent(newContent);
  };
  
  const handleSendPrompt = async (type: string) => {
    if (!textareaRef.current) return;
    
    setShowCommandMenu(false);
    
    // Check if we have a command with text after it (e.g., "/send prompt text")
    let promptInfo;
    if (commandWithText && (commandWithText.startsWith('/send') || commandWithText.startsWith('/chat'))) {
      promptInfo = processAIPrompt(textareaRef.current, type, commandWithText);
      
      // Check if the prompt references headers for context
      if (promptInfo && promptInfo.prompt.match(/h[1-6]|header|section|title|document/i)) {
        setIsUsingHeaderContext(true);
      }
    } else {
      promptInfo = processAIPrompt(textareaRef.current, type);
    }
    
    if (!promptInfo) return;
    
    const { prompt, insertPosition } = promptInfo;
    
    if (!prompt) {
      toast({
        title: "Empty prompt",
        description: "Please enter some text to send to AI",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessingAI(true);
    
    try {
      // If we're using header context, show a toast to inform the user
      if (isUsingHeaderContext) {
        toast({
          title: "Using document context",
          description: "Adding relevant header sections to your prompt",
        });
      }
      
      const response = await generateAIResponse(prompt);
      
      if (response.success) {
        const newContent = insertAIResponse(textareaRef.current, response.text, insertPosition);
        setContent(newContent);
        
        // After inserting AI response, clear the commandWithText and reset context flag
        setCommandWithText(null);
        setIsUsingHeaderContext(false);
        
        toast({
          title: "AI response added",
          description: "The AI response has been added to your note",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to get AI response",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsProcessingAI(false);
    }
  };
  
  const handleCommandSelect = (commandId: string) => {
    console.log('Command selected:', commandId);
    
    const command = COMMANDS.find(cmd => cmd.id === commandId);
    if (!command) return;
    
    if (commandId.startsWith('format.')) {
      const format = commandId.replace('format.', '');
      handleFormatText(format);
    } else if (commandId.startsWith('ai.')) {
      const aiAction = commandId.replace('ai.', '');
      handleSendPrompt(aiAction);
    }
    
    setShowCommandMenu(false);
    setCommandWithText(null);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };
  
  if (isLoading && effectiveNoteId) {
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
      <NoteHeader 
        isEditing={!!effectiveNoteId} 
        onDelete={handleDeleteNote}
        isDeleting={isDeleting}
      />
      
      <div className="float-card p-6 mb-6">
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-medium mb-4 border-none px-0 h-auto focus-visible:ring-0"
        />
        
        <TagInput
          tags={tags}
          newTag={newTag}
          setNewTag={setNewTag}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
        
        <EditorToolbar onFormatText={handleFormatText} />
        
        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Start writing your thoughts... (Type / for commands)"
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onClick={handleTextareaClick}
            className="min-h-[300px] border-none px-0 focus-visible:ring-0 text-float-text"
          />
          
          {showCommandMenu && (
            <CommandMenu
              isOpen={showCommandMenu}
              position={menuPosition}
              onClose={() => setShowCommandMenu(false)}
              onSelect={handleCommandSelect}
              filterValue={commandFilter}
              selectedIndex={selectedCommandIndex}
            />
          )}
          
          {isProcessingAI && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  {isUsingHeaderContext 
                    ? "Processing AI request with document context..." 
                    : "Processing AI request..."}
                </p>
              </div>
            </div>
          )}
        </div>
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
          disabled={isPending}
        >
          {isPending ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Note</>}
        </Button>
      </div>
    </motion.div>
  );
};

export default FloatNoteEditor;

