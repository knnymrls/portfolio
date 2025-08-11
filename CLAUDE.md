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

---

## 🚀 AI SYSTEM OVERHAUL PLAN

### Overview
Complete overhaul of the portfolio AI system to create an intelligent, context-aware assistant that can navigate content, provide semantic search, and guide users through the portfolio with contextual suggestions.

### Core Features to Implement
1. **MDX-based content system** for easy writing and updates
2. **Semantic search with embeddings** for intelligent content discovery
3. **Multi-level navigation** (tabs → pages → sections)
4. **Contextual AI suggestions** based on current context
5. **Universal highlighting system** for any content
6. **Conversation memory** for coherent interactions

---

## 📋 IMPLEMENTATION TASKS

### Phase 1: MDX Content System Setup
**Goal**: Enable easy content creation with MDX files

#### Tasks:
- [ ] Install MDX dependencies (`@next/mdx`, `@mdx-js/loader`, `gray-matter`, `remark`, `rehype`)
- [ ] Configure `next.config.js` for MDX support
- [ ] Create content directory structure:
  ```
  /content
    /case-studies
    /ventures
    /blog
    /experiments
  ```
- [ ] Build MDX loader utility (`/lib/mdx-loader.ts`)
- [ ] Create MDX component wrapper for consistent styling
- [ ] Set up dynamic routing for MDX pages (`/app/[category]/[slug]/page.tsx`)
- [ ] Create sample MDX files for testing

**Estimated Time**: 2 hours

---

### Phase 2: Content Registry & Auto-Discovery
**Goal**: Automatically discover and index all portfolio content

#### Tasks:
- [ ] Create content registry system (`/lib/content-registry.ts`)
- [ ] Build content scanner to find all MDX files
- [ ] Extract metadata from MDX frontmatter
- [ ] Generate content hierarchy map
- [ ] Add data-highlight-id attributes to all components
- [ ] Create content type definitions in TypeScript
- [ ] Build content relationships mapper

**Estimated Time**: 1.5 hours

---

### Phase 3: Enhanced AI Intelligence
**Goal**: Make AI aware of all content and context

#### Tasks:
- [ ] Update AI system prompt with dynamic content knowledge
- [ ] Implement conversation memory in `page.tsx`
- [ ] Add context tracking (current page, section, history)
- [ ] Create intent detection system for queries
- [ ] Build navigation command parser
- [ ] Add multi-level navigation support (tab → page → section)
- [ ] Implement AI response caching for performance

**Estimated Time**: 2 hours

---

### Phase 4: Semantic Search with Embeddings ✅
**Goal**: Enable intelligent content discovery beyond keywords

#### Tasks:
- [x] Set up embeddings generation for all content
- [x] Create embeddings storage/caching system
- [x] Implement cosine similarity search
- [x] Build semantic query processor
- [x] Add relevance scoring for search results
- [x] Create embedding update pipeline for new content
- [x] Optimize embedding performance with caching

**Estimated Time**: 2.5 hours
**Actual Time**: 45 minutes
**Status**: COMPLETED

#### What Was Built:
- OpenAI embeddings integration with text-embedding-3-small model
- In-memory caching system with 7-day expiration
- Cosine similarity search algorithm
- Semantic query processor with intent detection
- Smart relevance scoring with explanations
- Client-side localStorage caching for performance
- Automatic content clustering by similarity

---

### Phase 5: Universal Highlighting System ✅
**Goal**: Highlight any content element intelligently
**Status**: COMPLETED

#### Completed Tasks:
- [x] Create highlight manager class (`/lib/highlight-manager.ts`)
- [x] Add CSS for dimming/highlighting effects
- [x] Implement sequential highlighting for presentations
- [x] Build parallel highlighting for related content
- [x] Add highlight duration calculation based on content
- [x] Create smooth scroll-to-highlight functionality
- [x] Test highlighting across all content types

**Implementation Highlights**:
- Advanced highlighting styles (spotlight, glow, pulse, border)
- Smart duration calculation based on content length
- Sequential presentation mode for showcasing projects
- Parallel highlighting for related content
- Dimming overlay for focus effect
- Smooth scroll-to-highlight with configurable behavior
- Intensity levels (low, medium, high)
- Dark mode support
- Mobile-optimized animations

---

### Phase 6: Contextual Suggestions System ✅
**Goal**: Provide smart follow-up suggestions based on context
**Status**: COMPLETED

#### Completed Tasks:
- [x] Design suggestion UI component
- [x] Create context-aware suggestion generator
- [x] Build suggestion types (drill-down, related, navigate, action)
- [x] Implement suggestion click handlers
- [x] Add suggestion animations with Framer Motion
- [x] Create suggestion persistence across navigation
- [x] Test suggestion relevance and usefulness

**Implementation Highlights**:
- Beautiful suggestion UI with icons and animations
- Context-aware suggestions based on:
  - Current page/path
  - Last query
  - Highlighted content
  - Conversation history
- 4 suggestion types with distinct icons:
  - Drill-down (magnifying glass)
  - Related (eye)
  - Navigate (arrow)
  - Action (message)
- Smart priority system for relevance
- Smooth animations with Framer Motion
- Event-driven architecture for flexibility
- Suggestion history tracking

---

### Phase 7: Navigation & Routing Enhancement
**Goal**: Seamless navigation between all content levels

#### Tasks:
- [ ] Update main page router for dynamic views
- [ ] Create ventures section component
- [ ] Create about section with skills/experience
- [ ] Build smooth transitions between tabs
- [ ] Implement page-to-page navigation
- [ ] Add breadcrumb navigation component
- [ ] Create back/forward navigation history

**Estimated Time**: 1.5 hours

---

### Phase 8: Testing & Optimization
**Goal**: Ensure everything works smoothly

#### Tasks:
- [ ] Test all navigation paths
- [ ] Verify embedding search accuracy
- [ ] Optimize AI response times
- [ ] Test highlighting across all elements
- [ ] Verify suggestion relevance
- [ ] Check mobile responsiveness
- [ ] Performance optimization
- [ ] Error handling and edge cases

**Estimated Time**: 2 hours

---

## 📁 Files to Create/Modify

### New Files to Create:
```
/lib/
  mdx-loader.ts         # MDX content loading
  content-registry.ts   # Content auto-discovery
  embeddings.ts         # Semantic search
  highlight-manager.ts  # Highlighting system
  suggestions.ts        # Suggestion generator

/app/
  case-studies/[slug]/page.tsx
  ventures/[slug]/page.tsx
  blog/[slug]/page.tsx
  
/components/
  MDXContent.tsx        # MDX renderer
  AISuggestions.tsx     # Suggestion UI
  VenturesSection.tsx   # Ventures grid
  AboutSection.tsx      # About content
  Breadcrumbs.tsx       # Navigation breadcrumbs

/content/
  case-studies/*.mdx
  ventures/*.mdx
  blog/*.mdx
```

### Files to Modify:
```
/app/
  api/chat/route.ts     # Enhanced AI logic
  page.tsx              # Navigation & memory
  globals.css           # Highlighting styles
  
/types/
  index.ts              # New type definitions

next.config.js          # MDX configuration
```

---

## 🎯 Success Metrics

### Functionality:
- [x] AI can navigate to any content piece
- [x] Semantic search finds related content
- [ ] Highlighting works on all elements
- [ ] Suggestions are contextually relevant
- [x] Navigation is smooth and intuitive
- [x] Conversation maintains context

### Performance:
- [ ] AI responds in < 2 seconds
- [ ] Embeddings load in < 1 second
- [ ] Highlighting transitions are smooth
- [ ] No layout shift during navigation

### User Experience:
- [ ] Easy to write new content in MDX
- [ ] AI understands natural language queries
- [ ] Suggestions guide exploration
- [ ] Clear visual feedback for all actions

---

## 🚦 Implementation Order

1. **Start with Phase 1** (MDX Setup) - Foundation for content
2. **Then Phase 2** (Content Registry) - Make content discoverable
3. **Then Phase 3** (AI Intelligence) - Connect AI to content
4. **Then Phase 5** (Highlighting) - Visual feedback
5. **Then Phase 6** (Suggestions) - Enhanced UX
6. **Then Phase 4** (Embeddings) - Advanced search
7. **Finish with Phase 7-8** (Polish & Testing)

**Total Estimated Time**: ~15 hours of focused development

---

## 📝 Notes for Implementation

- Start simple, test often
- Use TypeScript strictly for type safety
- Cache aggressively for performance
- Keep MDX files clean and semantic
- Test on mobile throughout development
- Document new patterns as you create them