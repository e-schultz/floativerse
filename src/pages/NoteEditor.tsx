
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FloatLayout from '@/components/float/FloatLayout';
import FloatNoteEditor from '@/components/float/FloatNoteEditor';

const NoteEditor = () => {
  const { id } = useParams();
  
  return (
    <FloatLayout>
      <FloatNoteEditor noteId={id} />
    </FloatLayout>
  );
};

export default NoteEditor;
