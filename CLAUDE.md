# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive online résumé built with React 19, TypeScript, and Vite. The site features scroll-driven animations, a game-style timeline, and is deployed to GitHub Pages at `stathisdaras.com`.

## Development Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server (http://localhost:5173)
npm run build      # TypeScript compile + production build to dist/
npm run preview    # preview production build locally
npm run lint       # run ESLint checks
```

## Architecture

### Data-Driven Design

All personal content (skills, work experience, education, certifications, languages) is sourced from `src/assets/ed.json`. This single JSON file acts as the data source for the entire CV. To update content, edit this JSON file rather than modifying components.

### Component Structure

- **App.tsx** - Main orchestrator. Imports data from `ed.json`, manages loading state, and arranges all sections (hero, skills, timeline, certifications, languages, interests).
- **GameTimeline** - Scroll-driven timeline that merges work experiences and education chronologically. Uses CSS animations for staged reveals with a sticky avatar.
- **SkillBadgeCloud** - Displays skills grouped by category with external icon URLs (loaded from `ed.json`).
- **CertificationsCarousel** - Horizontal scrolling carousel for certifications.
- **InterestsGrid** - Grid layout for personal interests (defined in `InterestsGrid.tsx` via `INTEREST_ORDER`).
- **LoadingOverlay** - Full-screen loading animation with spinning "SD" icon.

### Key Patterns

1. **Loading Experience**:
   - Spinning favicon animation starts on page load (`spinningFavicon.ts`)
   - Loading overlay displays until profile image loads (with fallback timeout)
   - Both animations stop simultaneously when content is ready

2. **Styling**:
   - Tailwind CSS loaded via CDN in `index.html` (not a local PostCSS setup)
   - Custom CSS files exist for specific components (e.g., `GameTimeline.css`, `LoadingOverlay.css`)
   - Color scheme: neutral beige/slate palette (`#f7f6f2`, `#ecebe6`)

3. **Copy-to-Clipboard**:
   - Email and phone have click-to-copy functionality
   - Fallback implementation for browsers without Clipboard API
   - Visual feedback with temporary "Copied!" tooltip

4. **Timeline Merging**:
   - `GameTimeline` component merges work experiences and education arrays
   - Sorted chronologically (newest first) by parsing `startDate` fields
   - Each entry typed as either 'education' or 'experience' with appropriate icons

## Deployment

Automated via GitHub Actions (`.github/workflows/deploy.yml`):
- Triggers on push to `main` branch
- Builds with `npm run build`
- Deploys `dist/` folder to GitHub Pages via `actions/deploy-pages@v4`
- Custom domain configured: `stathisdaras.com`

**Important**: `vite.config.ts` has `base: '/'` because the site uses a custom domain. If deploying to a GitHub Pages subpath (e.g., `/<repo-name>/`), update the `base` config.

## TypeScript & Linting

- TypeScript strict mode via `tsconfig.json`
- ESLint configured with React Hooks and React Refresh plugins
- Build script runs TypeScript compiler (`tsc -b`) before Vite build
- `dist` folder ignored by ESLint

## Asset Management

Static assets in `src/assets/`:
- `ed.json` - All CV data
- `ed.jpg` - Profile image
- `Efstathios_Daras_Resume.pdf` - Downloadable CV (bundled in repo)

Static assets in `public/` served as-is (favicons, etc.)
