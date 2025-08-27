# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit-based hackathon project management application for Energinet's developer hackathon. The app allows users to submit and vote on hackathon topics/subjects using an AI-powered chat interface.

## Package Manager

**Use Bun as the package manager** (not pnpm or npm). The project is configured to work with bun despite having a pnpm-lock.yaml file present.

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type checking and validation
bun run check
bun run check:watch

# Code formatting and linting
bun run format
bun run lint

# Database operations
bun run db:push     # Push schema changes to database
bun run db:migrate  # Run database migrations
bun run db:studio   # Open Drizzle Studio
```

## Tech Stack Architecture

- **Framework**: SvelteKit 2 with Svelte 5 (use documentation from https://svelte-llm.khromov.se/svelte-complete-distilled)
- **Styling**: TailwindCSS 4.x with forms and typography plugins
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Anthropic Claude API via Vercel AI SDK
- **TypeScript**: Full TypeScript support with strict type checking

## Environment Setup

Required environment variables in `.env`:

```
DATABASE_URL="your_postgresql_database_url"
ANTHROPIC_API_KEY="your_anthropic_api_key"
PASSWORD="site_secret_password"
```

## Database Schema

Two main tables:

- `subjects`: Hackathon topics with id, emoji, name, description
- `subject_likes`: Many-to-many relationship tracking device-based likes for subjects

The database uses a device-based identification system (not user accounts) to track likes.

## Authentication System

Simple session-based authentication using cookies. Users must enter the correct password (from PASSWORD env var) to access the main application. Session is stored as 'authenticated' cookie value.

## AI Chat Integration

The chat system (`/api/chat`) uses Anthropic's Claude model (claude-4-sonnet-20250514) with:

- Custom Danish system prompt for "Strømbot" assistant
- Tool integration for creating new subjects
- Streaming responses via Vercel AI SDK
- Context about existing subjects to prevent duplicates

## Key Application Flow

1. Users login with shared password
2. Main page displays all subjects sorted by likes
3. Users can like/unlike subjects (tracked by device ID)
4. AI chat helps users create new hackathon subjects
5. Subjects are stored in database and appear on main page

## Component Structure

- `Chat.svelte`: AI chat interface with streaming responses
- `Subject.svelte`: Individual subject display with like functionality
- Authentication guards on both server and API routes

## Development Notes

- Project uses ES modules (type: "module" in package.json)
- Database queries use Drizzle ORM with retry logic
- Frontend uses device fingerprinting for user identification
- AI model can be updated in `/api/chat/+server.ts:30`

## AI SDK Resources

- Complete AI SDK documentation: https://ai-sdk.dev/llms.txt
- Supports Node.js 18+ with pnpm, npm, yarn, or bun
- Unified interface for multiple LLM providers (OpenAI, Anthropic, Google)
- Easy provider switching with minimal code changes
