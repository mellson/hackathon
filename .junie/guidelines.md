# Energinet Hackathon 2025 - Project Overview

## Project Description
This is a SvelteKit web application designed to collect and discuss topics for the Energinet developer hackathon in 2025. The application allows users to:
- Submit new hackathon topic ideas
- View existing topic suggestions
- Discuss topics through a chat interface
- Use AI assistance (via Anthropic's Claude) for topic generation and refinement

## Technical Stack
- **Frontend Framework**: SvelteKit 2.x with Svelte 5
- **Styling**: Tailwind CSS
- **Database**: Drizzle ORM with NeonDB (serverless Postgres)
- **AI Integration**: Anthropic Claude via AI SDK
- **Authentication**: Simple password-based authentication
- **Language**: TypeScript
- **Development Tools**: ESLint, Prettier, Vite

## Project Structure
- **src/routes/+page.svelte**: Main application page displaying topics and chat
- **src/routes/login/+page.svelte**: Authentication page
- **src/lib/components/**: Reusable components including Chat and Subject
- **src/lib/shared-data.svelte**: Shared data store for topics

## Setup Requirements
1. Create a `.env` file in the project root with:
   ```
   DATABASE_URL="your database url"
   ANTHROPIC_API_KEY="your anthropic api key"
   PASSWORD="site secret password"
   ```
2. Install dependencies using pnpm (or another package manager)
3. Run the development server

## Development Commands
- `pnpm i`: Install dependencies
- `pnpm run dev`: Start development server
- `pnpm run build`: Build for production
- `pnpm run db:push`: Push database schema changes
- `pnpm run db:studio`: Open Drizzle Studio for database management

## Notes
- The application interface is in Danish
- The application works best in Chrome and Edge browsers
- The project is hosted on GitHub at https://github.com/mellson/hackathon