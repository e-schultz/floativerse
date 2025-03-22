
import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NoteHeaderProps {
  isEditing: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}

const NoteHeader: React.FC<NoteHeaderProps> = ({ isEditing, onDelete, isDeleting }) => {
  const navigate = useNavigate();
  
  return (
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
          {isEditing ? 'Edit Note' : 'Create New Note'}
        </h1>
      </div>
      
      {isEditing && (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onDelete}
          className="ml-auto"
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" /> {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      )}
    </div>
  );
};

export default NoteHeader;
