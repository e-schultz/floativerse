
# FLOAT - Personal Knowledge Management System

FLOAT is a modern, intuitive personal knowledge management application designed to help you capture, organize, and explore your thoughts with ease.

## Features

### Note Management
- Create and edit notes with a rich text editor
- Organize notes with tags for easy categorization
- Real-time saving and updating

### AI Integration
- Leverage AI assistance directly in your notes with slash commands
- Extract context from your notes for more relevant AI responses
- Two primary AI modes:
  - `/send` - Quick responses for targeted questions
  - `/chat` - Context-aware conversations about your document

### User Experience
- Clean, responsive interface
- Dark/light mode support
- Mobile-friendly design

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **AI**: OpenAI integration via Supabase Edge Functions

## Project Structure

```
src/
├── api/            # API integration with Supabase
├── components/     # React components
│   ├── float/      # App-specific components
│   └── ui/         # UI component library (shadcn)
├── hooks/          # React hooks for state and logic
├── integrations/   # Third-party service integrations
├── lib/            # Utility libraries
├── pages/          # Page components
├── services/       # Service layer
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
    ├── commandDetection.ts    # Slash command processing
    ├── contextExtraction.ts   # Document context extraction
    ├── dateFormatting.ts      # Date helpers
    ├── notesStorage.ts        # Notes persistence
    └── textFormatting.ts      # Text formatting utilities
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Supabase account (for backend services)

### Installation

1. Clone the repository
```sh
git clone <repository-url>
cd float
```

2. Install dependencies
```sh
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```sh
npm run dev
```

### Supabase Setup

For the backend functionality to work, you'll need to:

1. Create a Supabase project
2. Set up the necessary tables:
   - `notes`: For storing user notes
   - `profiles`: For user profile information
3. Configure Edge Functions for AI integration
4. Set up authentication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
