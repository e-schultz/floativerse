
import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image,
  Slash 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorToolbarProps {
  onFormatText: (format: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onFormatText }) => {
  return (
    <div className="border-b border-float-border mb-4 pb-2">
      <div className="flex gap-1 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onFormatText('bold')}
          title="Bold"
        >
          <Bold size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onFormatText('italic')}
          title="Italic"
        >
          <Italic size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onFormatText('underline')}
          title="Underline"
        >
          <Underline size={16} />
        </Button>
        <span className="w-px h-8 bg-float-border mx-1"></span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onFormatText('bullet')}
          title="Bullet List"
        >
          <List size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onFormatText('number')}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </Button>
        <span className="w-px h-8 bg-float-border mx-1"></span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onFormatText('link')}
          title="Add Link"
        >
          <Link size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onFormatText('image')}
          title="Add Image"
        >
          <Image size={16} />
        </Button>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center text-muted-foreground text-xs">
          <Slash size={14} className="mr-1" />
          <span>Type <kbd className="px-1 rounded bg-muted">/</kbd> for commands</span>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
