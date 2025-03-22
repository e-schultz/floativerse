
import React, { useEffect, useRef, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image,
  MessageCircle,
  Code,
  Send,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

export type CommandOption = {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  action: () => void;
};

interface CommandMenuProps {
  isOpen: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  onSelect: (commandId: string) => void;
  filterValue: string;
}

const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  position,
  onClose,
  onSelect,
  filterValue
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const filteredCommands = COMMANDS.filter(cmd => 
    !filterValue || cmd.label.toLowerCase().includes(filterValue.toLowerCase().replace('/', ''))
  );
  
  // Reset selectedIndex when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filterValue]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          onClose();
          event.preventDefault();
          break;
        case 'ArrowDown':
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
          event.preventDefault();
          break;
        case 'ArrowUp':
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          event.preventDefault();
          break;
        case 'Enter':
          if (filteredCommands.length > 0) {
            onSelect(filteredCommands[selectedIndex].id);
            event.preventDefault();
          }
          break;
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onSelect, filteredCommands, selectedIndex]);
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-[#222222] rounded-md shadow-lg border border-[#333333] w-64 max-h-80 overflow-y-auto overflow-x-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="p-1 text-xs font-medium text-[#8E9196] border-b border-[#333333]">
        {filterValue ? `Search: ${filterValue}` : 'Commands'}
      </div>
      
      <div className="py-1">
        {filteredCommands.length === 0 ? (
          <div className="px-3 py-2 text-sm text-[#8E9196]">
            No commands found
          </div>
        ) : (
          filteredCommands.map((command, index) => (
            <button
              key={command.id}
              className={`flex items-center w-full px-3 py-2 text-sm text-white text-left ${index === selectedIndex ? 'bg-[#2A2A2A]' : 'hover:bg-[#2A2A2A]'}`}
              onClick={() => onSelect(command.id)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="mr-2 text-[#8E9196]">{command.icon}</span>
              <span>{command.label}</span>
              <span className="ml-auto text-xs text-[#8E9196]">{command.description}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export const COMMANDS: CommandOption[] = [
  // Basic formatting
  {
    id: 'format.bold',
    icon: <Bold size={16} />,
    label: 'Bold',
    description: 'Ctrl+B',
    action: () => {} // Placeholder, will be set in the parent component
  },
  {
    id: 'format.italic',
    icon: <Italic size={16} />,
    label: 'Italic',
    description: 'Ctrl+I',
    action: () => {}
  },
  {
    id: 'format.underline',
    icon: <Underline size={16} />,
    label: 'Underline',
    description: 'Ctrl+U',
    action: () => {}
  },
  {
    id: 'format.bullet',
    icon: <List size={16} />,
    label: 'Bullet List',
    description: '- list',
    action: () => {}
  },
  {
    id: 'format.number',
    icon: <ListOrdered size={16} />,
    label: 'Numbered List',
    description: '1. list',
    action: () => {}
  },
  {
    id: 'format.link',
    icon: <Link size={16} />,
    label: 'Insert Link',
    description: '[text](url)',
    action: () => {}
  },
  {
    id: 'format.image',
    icon: <Image size={16} />,
    label: 'Insert Image',
    description: '![alt](url)',
    action: () => {}
  },
  {
    id: 'format.code',
    icon: <Code size={16} />,
    label: 'Code',
    description: '`code`',
    action: () => {}
  },
  // Headings
  {
    id: 'format.h1',
    icon: <Heading1 size={16} />,
    label: 'Heading 1',
    description: '# Heading',
    action: () => {}
  },
  {
    id: 'format.h2',
    icon: <Heading2 size={16} />,
    label: 'Heading 2',
    description: '## Heading',
    action: () => {}
  },
  {
    id: 'format.h3',
    icon: <Heading3 size={16} />,
    label: 'Heading 3',
    description: '### Heading',
    action: () => {}
  },
  // AI
  {
    id: 'ai.send',
    icon: <Send size={16} />,
    label: 'Send to AI',
    description: 'Get AI response',
    action: () => {}
  },
  {
    id: 'ai.chat',
    icon: <MessageCircle size={16} />,
    label: 'Chat with AI',
    description: 'Start conversation',
    action: () => {}
  }
];

export default CommandMenu;
