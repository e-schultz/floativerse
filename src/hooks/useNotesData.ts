
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Note } from '@/types/notes';
import { 
  fetchNotes, 
  fetchExploreNotes, 
  fetchNoteById,
  createNote,
  updateNote,
  deleteNote
} from '@/api/notesApi';

/**
 * Hook to get all notes for the current user
 */
export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes
  });
};

/**
 * Hook to get all public notes for explore page
 */
export const useExploreNotes = () => {
  return useQuery({
    queryKey: ['explore-notes'],
    queryFn: fetchExploreNotes
  });
};

/**
 * Hook to get a single note by ID
 */
export const useNote = (id: string) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id
  });
};

/**
 * Hook to create a new note
 */
export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) {
        throw new Error("User must be authenticated to create notes");
      }
      
      return createNote(note, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });
};

/**
 * Hook to update an existing note
 */
export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Omit<Note, 'id' | 'created_at' | 'user_id'>> }) => {
      return updateNote(id, updates);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', data.id] });
    }
  });
};

/**
 * Hook to delete a note
 */
export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteNote(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', id] });
    }
  });
};
