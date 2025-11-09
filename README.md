# Online CV

Interactive résumé for Efstathios Daras, built with React, TypeScript, and Vite.

## Highlights

- Responsive hero with copy-friendly contact chips and a downloadable CV button
- Scroll-driven “Game Timeline” with a sticky avatar and staged reveal animations
- Skills, certifications, languages, and interests sourced from JSON for easy updates
- Tailwind utilities (via CDN) and modern React 19 patterns (StrictMode, hooks, TS)

## Getting Started

```bash
npm install        # install dependencies
npm run dev        # start the dev server on http://localhost:5173
npm run build      # produce a production build in dist/
npm run preview    # preview the production build locally
npm run lint       # run ESLint checks
```

## Project Structure

- `src/App.tsx` – page layout and section orchestration
- `src/assets/` – JSON data, profile image, and downloadable résumé PDF
- `src/components/` – modular UI sections (skills cloud, timeline, certifications, interests)
- `public/` – static assets served as-is (favicons, etc.)
- `vite.config.ts` – Vite setup (base is `/` because the site uses the custom domain `stathisdaras.com`)

## Deploying to GitHub Pages

1. Update `vite.config.ts` `defineConfig({ base: '/<repo-name>/' })` if the site will live under a subpath.
2. Build locally: `npm run build`.
3. Commit the latest changes and push the `main` branch.
4. Deploy one of the following ways:
   - **GitHub Pages → Deploy from branch:** In the repo settings, set *Pages* → *Branch* to `gh-pages` and push the contents of `dist/` (e.g. `git subtree push --prefix dist origin gh-pages`).
   - **GitHub Actions workflow (preconfigured):** The repo includes `.github/workflows/deploy.yml`, which builds and publishes via [`actions/deploy-pages`](https://github.com/actions/deploy-pages) whenever you push to `main`. Enable *Pages → Source: GitHub Actions* in the repo settings to activate it.

## Notes

- Tailwind runs from the CDN declared in `index.html`; you can migrate to a local PostCSS setup when the design stabilises.
- The bundled résumé PDF is small and infrequently updated, making it convenient to keep in the repo. For frequent changes, consider hosting it externally and linking to the hosted file instead.
