
import React from 'react';
import { 
  Command,
  CommandDialog,
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
  Send
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
}

const CommandMenu: React.FC<CommandMenuProps> = ({ 
  isOpen, 
  onClose, 
  commands,
  searchTerm
}) => {
  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Type a command..." 
          value={searchTerm}
          readOnly
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Formatting">
            {commands.filter(cmd => 
              cmd.id.startsWith('format') && 
              cmd.label.toLowerCase().includes(searchTerm.toLowerCase().replace('/', ''))
            ).map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  command.action();
                  onClose();
                }}
              >
                <div className="mr-2">{command.icon}</div>
                <span>{command.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{command.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="AI">
            {commands.filter(cmd => 
              cmd.id.startsWith('ai') && 
              cmd.label.toLowerCase().includes(searchTerm.toLowerCase().replace('/', ''))
            ).map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  command.action();
                  onClose();
                }}
              >
                <div className="mr-2">{command.icon}</div>
                <span>{command.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{command.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export const getDefaultCommands = (onFormatText: (format: string) => void, onSendPrompt: (prompt: string) => void): CommandOption[] => [
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
