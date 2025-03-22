
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Initial sample notes for first-time users
const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Concept Drift Mappings',
    content: 'Stitching thoughts to time-stamped annotations creates a cohesive narrative of mental evolution.',
    tags: ['concept', 'knowledge', 'evolution'],
    createdAt: new Date(2023, 9, 12).toISOString(), // Oct 12, 2023
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: '2',
    title: 'Cognitive Loops and Recursion',
    content: 'Examining the patterns of thought that create self-referential structures in knowledge systems.',
    tags: ['cognition', 'patterns', 'recursion'],
    createdAt: new Date(2023, 9, 15).toISOString(), // Oct 15, 2023
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: '3',
    title: 'Paradoxical Illuminations',
    content: 'Highlighting contradictions within content can reveal deeper truths and unexpected connections.',
    tags: ['paradox', 'insight', 'connections'],
    createdAt: new Date(2023, 9, 20).toISOString(), // Oct 20, 2023
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: '4',
    title: 'Constellatory Graphics',
    content: 'Visualizing the evolution of thoughts as a graphic tale spanning multiple connected nodes.',
    tags: ['visualization', 'networks', 'evolution'],
    createdAt: new Date(2023, 9, 25).toISOString(), // Oct 25, 2023
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week ago
  },
  {
    id: '5',
    title: 'Temporal Knowledge Structures',
    content: 'How time affects the relevance and connections between ideas in a personal knowledge system.',
    tags: ['time', 'structure', 'knowledge'],
    createdAt: new Date(2023, 10, 1).toISOString(), // Nov 1, 2023
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 2 weeks ago
  },
  {
    id: '6',
    title: 'Semantic Bridges',
    content: 'Creating meaningful connections between seemingly unrelated concepts through contextual anchors.',
    tags: ['semantics', 'connections', 'context'],
    createdAt: new Date(2023, 10, 5).toISOString(), // Nov 5, 2023
    updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString() // 3 weeks ago
  }
];

// Storage key for localStorage
const NOTES_STORAGE_KEY = 'float_notes';

// Initialize notes in localStorage if they don't exist
const initializeNotes = (): void => {
  if (!localStorage.getItem(NOTES_STORAGE_KEY)) {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(sampleNotes));
  }
};

// Get all notes
export const getNotes = (): Note[] => {
  initializeNotes();
  const notesJson = localStorage.getItem(NOTES_STORAGE_KEY);
  return notesJson ? JSON.parse(notesJson) : [];
};

// Get a single note by ID
export const getNoteById = (id: string): Note | undefined => {
  const notes = getNotes();
  return notes.find(note => note.id === id);
};

// Save a new note
export const saveNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
  const notes = getNotes();
  const newNote: Note = {
    ...note,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify([newNote, ...notes]));
  return newNote;
};

// Update an existing note
export const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null => {
  const notes = getNotes();
  const index = notes.findIndex(note => note.id === id);
  
  if (index === -1) return null;
  
  const updatedNote: Note = {
    ...notes[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  notes[index] = updatedNote;
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  
  return updatedNote;
};

// Delete a note
export const deleteNote = (id: string): boolean => {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === notes.length) return false;
  
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filteredNotes));
  return true;
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

export type { Note };
