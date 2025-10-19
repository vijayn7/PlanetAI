# Planet - Productivity Hub

Your space garden for productivity. A modern productivity app with AI chat, task management, calendar integration, and workflow automation.

## Features

- **Dashboard**: Overview of your productivity metrics and quick actions
- **Tasks**: Manage to-dos with list and kanban views
- **Calendar**: Visual timeline with Google Calendar sync
- **AI Chat**: Powered by GPT-5 Mini for productivity assistance
- **Automations**: Manage n8n workflows and integrations
- **Files**: Store and manage your documents
- **Settings**: Customize your experience

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui with Radix UI primitives
- **Authentication**: NextAuth.js v5 with Google OAuth
- **AI**: Vercel AI SDK v5 with AI Gateway
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google OAuth credentials (for authentication)
- OpenAI API access (via Vercel AI Gateway)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd planet
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` and add your credentials:
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `AUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env.local`

### Running the App

Development mode:
\`\`\`bash
npm run dev
\`\`\`

Build for production:
\`\`\`bash
npm run build
npm start
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design System

Planet uses a green-centric "space garden" theme with:
- **Primary Color**: `#34C759` (Apple-style lime green)
- **Typography**: Inter font family
- **Border Radius**: 20px for cards, 12px for buttons
- **Shadows**: Soft shadows with green glow effects
- **Motion**: Subtle hover animations and transitions

## Project Structure

\`\`\`
planet/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth.js handlers
│   │   └── chat/         # AI chat endpoint
│   ├── login/            # Login page
│   ├── chat/             # AI chat interface
│   ├── tasks/            # Task management
│   ├── calendar/         # Calendar view
│   ├── automations/      # Workflow automation
│   ├── files/            # File management
│   ├── settings/         # User settings
│   └── page.tsx          # Dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── app-sidebar.tsx   # Navigation sidebar
│   ├── app-header.tsx    # Page header
│   └── user-profile.tsx  # User profile display
├── lib/                   # Utility functions
├── auth.ts               # NextAuth.js configuration
└── middleware.ts         # Route protection
\`\`\`

## License

MIT
