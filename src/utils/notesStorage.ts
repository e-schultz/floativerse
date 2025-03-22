import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user_id?: string;
}

// Get all notes for the current user
export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Note[];
    }
  });
};

// Get all public notes for explore page
export const useExploreNotes = () => {
  return useQuery({
    queryKey: ['explore-notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Note[];
    }
  });
};

// Get a single note by ID
export const useNote = (id: string) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Note;
    },
    enabled: !!id
  });
};

// Create a new note
export const useCreateNote = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) {
        throw new Error("User must be authenticated to create notes");
      }
      
      const noteWithUserId = {
        ...note,
        user_id: user.id
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });
};

// Update an existing note
export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Omit<Note, 'id' | 'created_at' | 'user_id'>> }) => {
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
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', data.id] });
    }
  });
};

// Delete a note
export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', id] });
    }
  });
};

// Get the formatted relative time (e.g., "2 hours ago")
export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
};

// Format date to a readable string (e.g., "Oct 12, 2023")
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
