
// This file re-exports from the new module structure
// for backward compatibility

export type { Note } from '@/types/notes';
export { 
  getRelativeTime,
  formatDate 
} from '@/utils/dateFormatting';

export {
  useNotes,
  useExploreNotes,
  useNote,
  useCreateNote,
  useUpdateNote,
  useDeleteNote
} from '@/hooks/useNotesData';
