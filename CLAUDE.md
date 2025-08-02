# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is an adaptive portfolio website built with Next.js 15.3.4, React 19, and TypeScript. The project integrates AI capabilities through OpenAI API and uses Framer Motion for animations.

## Essential Commands
```bash
# Development
npm run dev        # Start development server on http://localhost:3000
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint

# Install dependencies
npm install
```

## Architecture & Structure
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 (alpha) with PostCSS
- **Animation**: Framer Motion for interactive UI elements
- **Icons**: Lucide React for consistent iconography
- **AI Integration**: OpenAI SDK for AI-powered features

## Key Configuration Files
- `tsconfig.json`: TypeScript with strict mode, `@/*` path alias maps to root
- `package.json`: Contains all scripts and dependencies
- `.env.local`: Environment variables (create from `.env.local.example`)

## Development Guidelines
1. **App Directory**: Currently empty - use Next.js 15 App Router conventions when creating pages
2. **TypeScript**: Strict mode is enabled - ensure proper typing for all components
3. **Environment Variables**: Set `OPENAI_API_KEY` in `.env.local` before using AI features
4. **Path Imports**: Use `@/` prefix for imports from project root

## Important Notes
- No testing framework currently configured
- No custom ESLint or Prettier configuration
- Tailwind CSS is using default configuration
- The project is in initial setup phase with core app files deleted