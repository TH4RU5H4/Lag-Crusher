<h1 align="center">Lag Crusher — Internet Stabilizer</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4.svg?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/TanStack_Start-1.168-EF4444.svg" alt="TanStack Start">
  <img src="https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
</p>

<p align="center">
  A menacing pinger UI for Sri Lankan mobile networks — crush lag with Stand Power.
</p>

---

## Purpose

Lag Crusher is a mobile-first web app that stabilizes internet connections on Sri Lankan mobile networks (Dialog, Mobitel, Hutch, Airtel) by continuously pinging optimized provider endpoints. Built with a heavy JoJo's Bizarre Adventure aesthetic — dramatic typography, halftone patterns, and Japanese sound effects.

## Structure

```
lag-crusher/
├── public/                  # Static assets (favicon, robots.txt)
├── src/
│   ├── components/
│   │   ├── JojoSelect.tsx   # Custom dropdown with JoJo styling
│   │   └── ui/              # Radix UI shadcn components
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── jojo-fx.tsx      # Animation system (bursts, shakes, SFX)
│   │   ├── utils.ts         # Utility helpers
│   │   └── lovable-error-reporting.ts
│   ├── routes/
│   │   ├── __root.tsx       # TanStack root layout
│   │   └── index.tsx        # Main pinger screen
│   ├── styles.css           # Global styles + Tailwind
│   ├── router.tsx           # TanStack Router config
│   └── start.ts             # TanStack Start entry
├── .github/workflows/       # CI/CD (release workflow)
├── eslint.config.js         # ESLint + Prettier config
├── vite.config.ts           # Vite + TanStack Start config
├── tsconfig.json            # TypeScript strict config
└── package.json             # Dependencies and scripts
```

## Features

- **Provider presets** — Dialog, Mobitel, Hutch, Airtel with optimized ping URLs
- **Custom URL support** — Ping any endpoint with localStorage persistence
- **Configurable intervals** — 1s, 3s, 5s, or 10s ping frequency
- **Live latency readout** — Real-time ms response time display
- **Packet loss tracking** — Percentage calculation from ping history
- **Ping log** — Scrollable history of last 25 pings with timestamps
- **JoJo animations** — Halftone backgrounds, screen shakes, floating Japanese SFX (ゴゴゴゴ)
- **Mobile-first design** — 420px wide layout optimized for phones

## Getting Started

```sh
git clone https://github.com/TH4RU5H4/stand-power-pinger.git
cd stand-power-pinger
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Prerequisites

- **Node.js** 18+ — [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** 9+ (or bun)

## Installation

```sh
npm install
```

## Development

```sh
npm run dev          # Start dev server (Vite + TanStack Start)
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

## Building

```sh
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
```

## Usage

1. Select your **Service Provider** from the dropdown
2. Choose an **Interval Delay** (1s for aggressive, 10s for battery saver)
3. Click the **START CRUSHER** button to begin pinging
4. Watch live latency, average response time, and packet loss stats
5. Use **Custom URL** mode to ping any endpoint

## Configuration

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite + TanStack Start configuration |
| `tsconfig.json` | TypeScript compiler options (strict mode) |
| `eslint.config.js` | ESLint rules + Prettier integration |
| `components.json` | shadcn/ui component configuration |

## Architecture

- **Frontend**: React 19 + TanStack Start (SSR-ready)
- **Routing**: TanStack Router with file-based routes
- **Styling**: Tailwind CSS 4 + custom JoJo theme (CSS variables)
- **Animations**: Custom `jojo-fx` system (dramatic bursts, screen shakes, floating SFX)
- **UI Components**: Radix UI primitives via shadcn/ui
- **Build**: Vite 8 with Nitro server (Cloudflare-ready)

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI framework |
| TypeScript | 5.8 | Type safety |
| TanStack Start | 1.168 | Full-stack React framework |
| TanStack Router | 1.170 | Client-side routing |
| Tailwind CSS | 4.2 | Utility-first styling |
| Vite | 8 | Build tool |
| Radix UI | Various | Accessible primitives |
| Zod | 3.25 | Schema validation |
| Lucide React | 0.575 | Icons |

## Links

- [GitHub Repository](https://github.com/TH4RU5H4/stand-power-pinger)
- [Issue Tracker](https://github.com/TH4RU5H4/stand-power-pinger/issues)

## Credits

- **TH4RU5H4** — Creator and maintainer
- **JoJo's Bizarre Adventure** — Visual inspiration (荒木飛呂彦)
- [Lovable](https://lovable.dev) — AI-powered development platform

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <sub>ゴゴゴ · Keep the app open in the background to hold the connection.</sub>
</p>
