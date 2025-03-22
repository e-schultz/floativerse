
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-10">
      <p className="text-float-text-secondary">No notes found. Try adjusting your search or creating a new note.</p>
      <Button className="mt-4" asChild>
        <Link to="/note/editor">Create New Note</Link>
      </Button>
    </div>
  );
};
