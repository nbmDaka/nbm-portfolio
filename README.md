# Nurdaulet Beketov — Engineering Portfolio

A personal engineering console, not a template portfolio. Dark, terminal-inspired interface presenting backend systems work: distributed systems, high-concurrency infrastructure, and production AI.

Built with **Astro** (islands architecture), **React** (only where interactivity demands it), **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, **React Three Fiber / Three.js**, and **MDX** for case studies. Deploy-ready for Vercel.

## Commands

```bash
npm install
npm run dev       # start dev server
npm run build     # astro check + production build
npm run preview   # preview production build
```

## Structure

```
src/
├── layouts/
│   ├── BaseLayout.astro        # shell: nav, palette, skip-link, meta
│   └── CaseStudyLayout.astro   # MDX case study shell: hero, stats, diagram, prose
├── pages/
│   ├── index.astro             # console home: hero, profile, timeline, systems, lab, logs, contact
│   ├── stack.astro             # runtime manifest — technology modules
│   └── projects/               # MDX case studies (Problem → Architecture → Decisions → Results)
│       ├── national-testing-platform.mdx
│       ├── ai-job-search.mdx
│       └── ai-media-generation.mdx
├── components/
│   ├── Hero.astro              # terminal hero + live system topology
│   ├── Profile.astro           # engineering profile as system modules
│   ├── Projects.astro          # production systems index
│   ├── ArchitectureLab.astro   # interactive 3D service map
│   ├── ArchitectureDiagram.astro  # static request-path diagram
│   ├── EngineeringLogs.astro   # operational record
│   ├── Contact.astro           # connection channel
│   ├── SiteNav.astro
│   └── react/                  # interactive islands (only JS shipped to client)
│       ├── TerminalConsole.tsx # typing console (client:visible)
│       ├── SystemNetwork.tsx   # R3F topology, hero + interactive lab modes
│       ├── ExperienceTimeline.tsx  # scroll-animated timeline (client:visible)
│       └── CommandPalette.tsx  # ⌘K palette with keyboard navigation
└── styles/global.css           # design tokens, prose, reduced-motion support
```

## Design system

| Token | Value | Use |
|---|---|---|
| `#050505` | background | ink |
| `#FFFFFF` | primary text | paper |
| `#A1A1AA` | secondary text | muted |
| `#00FF88` | status green | signal |
| `#6366F1` | indigo | AI layer |

Fonts: Geist Variable (display), Inter (body), JetBrains Mono (code/labels).

## Notes

- Zero client JS for static sections; React hydrates only the console, palette, timeline, and 3D topology.
- `prefers-reduced-motion` is respected globally.
- Command palette: `⌘K` / `Ctrl+K`, arrows + Enter to navigate.
