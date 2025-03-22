
import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/types/notes';

/**
 * Fetch all notes for the current user
 */
export const fetchNotes = async (): Promise<Note[]> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Note[];
};

/**
 * Fetch all public notes for explore page
 */
export const fetchExploreNotes = async (): Promise<Note[]> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Note[];
};

/**
 * Fetch a single note by ID
 */
export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Note;
};

/**
 * Create a new note
 */
export const createNote = async (
  note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'user_id'>, 
  userId: string
): Promise<Note> => {
  const noteWithUserId = {
    ...note,
    user_id: userId
  };
  
  const { data, error } = await supabase
    .from('notes')
    .insert(noteWithUserId)
    .select()
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Note;
};

/**
 * Update an existing note
 */
export const updateNote = async (
  id: string, 
  updates: Partial<Omit<Note, 'id' | 'created_at' | 'user_id'>>
): Promise<Note> => {
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Note;
};

/**
 * Delete a note
 */
export const deleteNote = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw new Error(error.message);
  }
};
