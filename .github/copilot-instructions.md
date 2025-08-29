# Energinet Hackathon App - AI Coding Instructions

## Architecture Overview

This is a SvelteKit 2 + Svelte 5 hackathon management app where users submit/vote on topics via AI chat. Key components:

- **Frontend**: SvelteKit with TailwindCSS 4.x and Svelte 5 runes (`$state`, `$derived`, `$effect`)
- **Database**: PostgreSQL with Drizzle ORM - device-based identification (no user accounts)
- **AI**: Anthropic Claude via Vercel AI SDK with streaming and tool calling
- **Auth**: Simple password-based sessions stored in cookies

## Essential Development Commands

**Use Bun as package manager** (not pnpm despite lockfile):
```bash
bun install && bun run dev          # Start development
bun run db:push && bun run db:studio # Database operations
```

## Critical Patterns

### Device-Based User Identification
No user accounts - uses `getBrowserId()` from `src/lib/device-utils.ts` to generate/store UUID in localStorage. All likes tracked by device ID in `subject_likes` table.

### AI Chat Integration (`src/routes/api/chat/+server.ts`)
- Uses different Claude models: `claude-3-5-haiku-latest` for first message, `claude-4-sonnet-20250514` for tool calls
- Danish system prompt for "Strømbot" with specific Energinet context
- Tool definition for creating subjects with emoji/name/description
- HTML-formatted responses (no CSS styling, direct HTML output)

### Svelte 5 Runes Usage
```javascript
// State management pattern in components
let isLoading = $derived(chat.status !== 'ready');
let showReloadButton = $state(false);

// Effects for DOM interactions
$effect(() => {
    // Auto-scroll pattern with tick()
    if (shouldScroll) {
        tick().then(() => messagesContainer.scrollTo(...));
    }
});
```

### Database Schema & Queries
Two tables: `subjects` (id, emoji, name, description) and `subject_likes` (subjectId, deviceId). Use `queryWithRetries()` wrapper for all DB operations. Complex aggregation in `+page.server.ts` joins subjects with like counts.

### Authentication Flow
Session cookie 'session' = 'authenticated' after password check. All API routes and pages verify this. Login form in `src/routes/login/+page.svelte`.

## Framework Documentation
- **Svelte/SvelteKit**: Use https://svelte-llm.khromov.se/svelte-complete-distilled
- **AI SDK**: https://ai-sdk.dev/llms.txt

## Environment Variables
```
DATABASE_URL="postgresql://..."
ANTHROPIC_API_KEY="ant-api03-..."
PASSWORD="site_secret_password"
```
