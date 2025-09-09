# AGENTS.md

This file provides guidance to AI assistants when working with code in this repository.

## Development Workflow

**Task Planning**: Use the TodoWrite tool to create detailed task plans before making any code changes. Break down complex tasks into smaller, manageable steps and track progress using the todo system.

**Development Server**: Expect that the development server is already running, so you should be able to just open the browser at localhost:5173 to see the changes that you're making.

**Code Quality**: After making changes, always run lint and typecheck commands if available to ensure code quality.

## Available Tool Integrations

**Azure DevOps Integration**: When users ask about work items, tasks, project management, or sprint planning, use the Azure DevOps tools (ado\_\*). The user's work items are typically located in the project: `ENDK`.

**Browser Automation**: For browser-based tasks including identifying UI elements, downloading images, visual testing, taking screenshots, or working on visual changes, use the Playwright tools (playwright*browser*\*). This includes:

- Downloading images or files from websites
- Taking screenshots
- Identifying UI elements
- Visual testing
- Any interaction with web pages
- Web navigation and form filling

**File Operations**: Use Read, Write, Edit tools for file operations. Always read files before editing them. Use Glob and Grep tools for searching through the codebase.

## Development Commands

- **Start development server**: `bun run dev` (runs on port 5173)
- **Build for production**: `bun run build`
- **Preview production build**: `bun run preview`
- **Type checking**: `bun run check` (or `bun run check:watch` for continuous)
- **Linting and formatting**: `bun run lint` and `bun run format`
- **Database operations**:
  - `bun run db:push` - Push schema changes to database
  - `bun run db:migrate` - Run migrations
  - `bun run db:studio` - Open Drizzle Studio

## Architecture Overview

This is a SvelteKit application for collecting hackathon topics at Energinet, featuring AI chat capabilities and subject management.

### Tech Stack

- **Frontend**: SvelteKit 5 with TypeScript, Tailwind CSS
- **AI Integration**: Anthropic Claude via @ai-sdk/anthropic and @ai-sdk/svelte
- **Database**: PostgreSQL with Drizzle ORM
- **Hosting**: Neon Database (serverless PostgreSQL)

### Key Components

**Database Schema** (`src/lib/server/db/schema.ts`):

- `subjectsTable` - Stores hackathon topics with emoji, name, description
- `subjectLikesTable` - Tracks likes per device using composite primary key (subjectId + deviceId)

**State Management** (`src/lib/shared-data.svelte.ts`):

- Global reactive state using Svelte 5's `$state()` rune
- Stores subjects array with client-side reactivity across components

**Chat System** (`src/routes/api/chat/+server.ts`):

- Uses Anthropic Claude models (Haiku for first message, Sonnet for tool calls)
- Custom tool for creating subjects with structured schema validation
- Session-based authentication via cookies

**Core Components**:

- `Chat.svelte` - AI chat interface with auto-scroll, loading states, error handling
- `Subject.svelte` - Subject display/editing with optimistic updates and device-based likes
- Uses hydration-safe patterns to avoid SSR mismatches

### Critical Patterns

**Hydration Safety**: Components use `typeof window !== 'undefined'` and `clientSideReady` state to prevent hydration mismatches, especially for device-specific features like likes.

**Optimistic Updates**: Like functionality updates UI immediately, then syncs with server, reverting on error.

**Auto-scroll Chat**: Uses Svelte effects with `tick()` to scroll chat after DOM updates while preserving user scroll position.

**Device Identification**: Uses localStorage-based device IDs for anonymous like tracking without user accounts.

## Environment Setup

Required `.env` variables:

```
DATABASE_URL="your neon database url"
ANTHROPIC_API_KEY="your anthropic api key"
PASSWORD="site authentication password"
```

## Authentication

Simple password-based authentication stored in session cookies. Login required to access chat API endpoints.

## Danish Language Context

The application is in Danish for Energinet employees. The AI assistant "Strømbot" helps brainstorm hackathon topics and knows specific details about the January 16, 2025 event at KulturØen in Middelfart.
