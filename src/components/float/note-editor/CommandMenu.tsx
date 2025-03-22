
import React, { useEffect, useState, useRef } from 'react';

// Command definitions
export const COMMANDS = [
  { id: 'format.bold', label: 'Bold text', description: 'Format selected text as bold' },
  { id: 'format.italic', label: 'Italic text', description: 'Format selected text as italic' },
  { id: 'format.underline', label: 'Underline text', description: 'Format selected text as underlined' },
  { id: 'format.bullet', label: 'Bullet list', description: 'Create or remove a bullet list item' },
  { id: 'format.number', label: 'Numbered list', description: 'Create or remove a numbered list item' },
  { id: 'format.h1', label: 'Heading 1', description: 'Add or remove a level 1 heading' },
  { id: 'format.h2', label: 'Heading 2', description: 'Add or remove a level 2 heading' },
  { id: 'format.h3', label: 'Heading 3', description: 'Add or remove a level 3 heading' },
  { id: 'format.code', label: 'Code', description: 'Format text as inline code' },
  { id: 'format.link', label: 'Link', description: 'Insert a hyperlink' },
  { id: 'ai.send', label: 'Send to AI', description: 'Send the current line to AI (can include context references like h1, h2)' },
  { id: 'ai.chat', label: 'Chat with AI', description: 'Use the entire note as context for an AI chat' },
];

interface CommandMenuProps {
  isOpen: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  onSelect: (commandId: string) => void;
  filterValue: string;
  selectedIndex?: number;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ 
  isOpen, 
  position, 
  onClose, 
  onSelect,
  filterValue,
  selectedIndex = 0
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [filteredCommands, setFilteredCommands] = useState(COMMANDS);
  
  // Filter commands based on input
  useEffect(() => {
    if (!filterValue || filterValue === '/') {
      setFilteredCommands(COMMANDS);
    } else {
      const filtered = COMMANDS.filter(command => 
        command.label.toLowerCase().includes(filterValue.toLowerCase().replace('/', ''))
      );
      setFilteredCommands(filtered);
    }
  }, [filterValue]);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Scroll selected item into view
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const selectedItem = menuRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, isOpen]);
  
  if (!isOpen) return null;
  
  // Show context help for AI commands
  const showAIContextHelp = filteredCommands.some(cmd => cmd.id.startsWith('ai.'));
  
  return (
    <div 
      ref={menuRef}
      className="absolute z-10 bg-popover border border-border rounded-md shadow-md overflow-hidden w-80 max-h-96"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px` 
      }}
    >
      <div className="p-1 overflow-y-auto max-h-72">
        {filteredCommands.length === 0 ? (
          <div className="p-2 text-sm text-muted-foreground">
            No commands match '{filterValue}'
          </div>
        ) : (
          <div className="space-y-1">
            {filteredCommands.map((command, index) => (
              <div
                key={command.id}
                className={`flex flex-col p-2 rounded-sm cursor-pointer text-sm transition-colors ${
                  index === selectedIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
                onClick={() => onSelect(command.id)}
                data-index={index}
              >
                <div className="font-medium">{command.label}</div>
                <div className={`text-xs ${
                  index === selectedIndex ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {command.description}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showAIContextHelp && (
          <div className="p-2 border-t border-border mt-1">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Context references in AI prompts:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Use <code className="bg-muted px-0.5 rounded">h1</code>, <code className="bg-muted px-0.5 rounded">h2</code>, etc. to reference document sections</li>
                <li>Use quotes for specific titles: <code className="bg-muted px-0.5 rounded">"Section Title"</code></li>
                <li>Example: <code className="bg-muted px-0.5 rounded">/send summarize h2 using h1 context</code></li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-border p-2 bg-muted/50">
        <div className="flex space-x-4 text-xs text-muted-foreground">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Tab Autofill</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandMenu;
