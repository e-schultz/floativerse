
/**
 * Represents a note in the application
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user_id?: string;
}
