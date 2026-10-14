# Winston Liang — Portfolio

Source for [winstonl.vercel.app](https://winstonl.vercel.app). A dark, lab-styled
single-page portfolio with an interactive multi-agent pathfinding scene in the hero.

## The hero scene

The landing scene is a small multi-agent pathfinding world — the same problem I
research at NUS. Agents plan routes with A* across a grid, and re-plan whenever
the world changes. Click any cell to drop a wall and watch them route around it.

- `src/lib/pathfinding.ts` — pure A*, grid helpers, goal selection. No three.js,
  no React, fully testable on its own.
- `src/components/three/agent-world.tsx` — the react-three-fiber scene.
- `src/components/three/hero-scene.tsx` — lazy-loads the scene only once it
  scrolls into view, and swaps in a static panel under `prefers-reduced-motion`.

## Tech

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4 with CSS custom-property theming
- **3D:** three.js via @react-three/fiber and @react-three/drei
- **Motion:** motion (Framer Motion)
- **Content:** MDX blog posts via content-collections, with KaTeX math
- **Deployment:** Vercel

## Content

Everything on the page is driven by `src/data/resume.tsx` — experience, projects,
skills, honors, leadership, certifications, and the headline metrics. Edit that
file and the whole site follows.

Blog posts are MDX files in `content/`. Frontmatter requires `title`,
`publishedAt`, and `summary`; `updatedAt`, `author`, and `image` are optional.

## Running locally

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build      # production build
pnpm lint       # eslint
```

## Credits

The original scaffold came from the [Magic UI portfolio template](https://github.com/magicuidesign/portfolio).
The current design, content model, and hero scene are my own.
