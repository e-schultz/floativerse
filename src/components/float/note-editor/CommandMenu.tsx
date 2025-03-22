import React, { useRef, useEffect } from 'react';
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
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
  ArrowDown,
  ArrowRight,
  Bug,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
} from 'lucide-react';

export type CommandOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
};

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandOption[];
  searchTerm: string;
  position?: { top: number; left: number } | null;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ 
  isOpen, 
  onClose, 
  commands,
  searchTerm,
  position
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    // Escape key handler
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute z-50 w-72 rounded-md border bg-[#222222] shadow-lg overflow-hidden"
      style={{
        top: position.top || 'auto',
        left: position.left || 'auto',
      }}
    >
      <Command className="rounded-lg border-0">
        <CommandInput 
          placeholder="Type a command..." 
          value={searchTerm}
          readOnly
          className="bg-[#222222] text-white border-b border-[#333333]"
        />
        <CommandList className="bg-[#222222] text-white">
          <CommandEmpty className="text-[#8E9196]">No results found.</CommandEmpty>
          
          <CommandGroup heading="Basic Editing" className="text-[#8E9196]">
            {commands.filter(cmd => 
              cmd.id.startsWith('format') && 
              cmd.label.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  command.action();
                  onClose();
                }}
                className="hover:bg-[#2A2A2A] cursor-pointer"
              >
                <div className="mr-2 text-[#8E9196]">{command.icon}</div>
                <span className="text-white">{command.label}</span>
                <span className="ml-auto text-xs text-[#8E9196]">{command.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading="Document Structure" className="text-[#8E9196]">
            {commands.filter(cmd => 
              cmd.id.startsWith('heading') && 
              cmd.label.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  command.action();
                  onClose();
                }}
                className="hover:bg-[#2A2A2A] cursor-pointer"
              >
                <div className="mr-2 text-[#8E9196]">{command.icon}</div>
                <span className="text-white">{command.label}</span>
                <span className="ml-auto text-xs text-[#8E9196]">{command.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading="Layout" className="text-[#8E9196]">
            {commands.filter(cmd => 
              cmd.id.startsWith('layout') && 
              cmd.label.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  command.action();
                  onClose();
                }}
                className="hover:bg-[#2A2A2A] cursor-pointer"
              >
                <div className="mr-2 text-[#8E9196]">{command.icon}</div>
                <span className="text-white">{command.label}</span>
                <span className="ml-auto text-xs text-[#8E9196]">{command.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading="AI" className="text-[#8E9196]">
            {commands.filter(cmd => 
              cmd.id.startsWith('ai') && 
              cmd.label.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  command.action();
                  onClose();
                }}
                className="hover:bg-[#2A2A2A] cursor-pointer"
              >
                <div className="mr-2 text-[#8E9196]">{command.icon}</div>
                <span className="text-white">{command.label}</span>
                <span className="ml-auto text-xs text-[#8E9196]">{command.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export const getDefaultCommands = (
  onFormatText: (format: string) => void, 
  onSendPrompt: (prompt: string) => void
): CommandOption[] => [
  // Basic formatting
  {
    id: 'format.bold',
    label: 'Bold',
    icon: <Bold size={16} />,
    description: 'Make text bold',
    action: () => onFormatText('bold')
  },
  {
    id: 'format.italic',
    label: 'Italic',
    icon: <Italic size={16} />,
    description: 'Make text italic',
    action: () => onFormatText('italic')
  },
  {
    id: 'format.underline',
    label: 'Underline',
    icon: <Underline size={16} />,
    description: 'Underline text',
    action: () => onFormatText('underline')
  },
  {
    id: 'format.bullet',
    label: 'Bullet List',
    icon: <List size={16} />,
    description: 'Create bullet list',
    action: () => onFormatText('bullet')
  },
  {
    id: 'format.number',
    label: 'Numbered List',
    icon: <ListOrdered size={16} />,
    description: 'Create numbered list',
    action: () => onFormatText('number')
  },
  {
    id: 'format.link',
    label: 'Link',
    icon: <Link size={16} />,
    description: 'Insert link',
    action: () => onFormatText('link')
  },
  {
    id: 'format.image',
    label: 'Image',
    icon: <Image size={16} />,
    description: 'Insert image',
    action: () => onFormatText('image')
  },
  {
    id: 'format.code',
    label: 'Code',
    icon: <Code size={16} />,
    description: 'Format as code',
    action: () => onFormatText('code')
  },
  
  // Headings (new)
  {
    id: 'heading.h1',
    label: 'Set as heading 1',
    icon: <Heading1 size={16} />,
    description: 'H1',
    action: () => onFormatText('h1')
  },
  {
    id: 'heading.h2',
    label: 'Set as heading 2',
    icon: <Heading2 size={16} />,
    description: 'H2',
    action: () => onFormatText('h2')
  },
  {
    id: 'heading.h3',
    label: 'Set as heading 3',
    icon: <Heading3 size={16} />,
    description: 'H3',
    action: () => onFormatText('h3')
  },
  {
    id: 'heading.h4',
    label: 'Set as heading 4',
    icon: <Heading4 size={16} />,
    description: 'H4',
    action: () => onFormatText('h4')
  },
  {
    id: 'heading.h5',
    label: 'Set as heading 5',
    icon: <Heading5 size={16} />,
    description: 'H5',
    action: () => onFormatText('h5')
  },
  {
    id: 'heading.h6',
    label: 'Set as heading 6',
    icon: <Heading6 size={16} />,
    description: 'H6',
    action: () => onFormatText('h6')
  },
  
  // Layout options (new)
  {
    id: 'layout.splitDown',
    label: 'Split down',
    icon: <ArrowDown size={16} />,
    description: 'Split editor downward',
    action: () => console.log('Split down')  // Placeholder
  },
  {
    id: 'layout.splitRight',
    label: 'Split right',
    icon: <ArrowRight size={16} />,
    description: 'Split editor to the right',
    action: () => console.log('Split right')  // Placeholder
  },
  {
    id: 'layout.debug',
    label: 'Show debug info',
    icon: <Bug size={16} />,
    description: 'Display debug information',
    action: () => console.log('Show debug info')  // Placeholder
  },
  
  // AI commands
  {
    id: 'ai.send',
    label: 'Send to ChatGPT',
    icon: <Send size={16} />,
    description: 'Send current line to ChatGPT',
    action: () => onSendPrompt('current')
  },
  {
    id: 'ai.chat',
    label: 'Chat with AI',
    icon: <MessageCircle size={16} />,
    description: 'Start AI conversation',
    action: () => onSendPrompt('chat')
  }
];

export default CommandMenu;
