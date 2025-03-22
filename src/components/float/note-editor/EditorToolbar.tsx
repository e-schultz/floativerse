
import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditorToolbar: React.FC = () => {
  return (
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
  );
};

export default EditorToolbar;
