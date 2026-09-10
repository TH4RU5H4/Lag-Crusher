<p align="center">
  <img src="public/favicon.ico" alt="Lag Crusher" width="120">
</p>

<h1 align="center">Lag Crusher — Internet Stabilizer</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript&logoColor=white" alt="TypeScript 5.8">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4.svg?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4.2">
  <img src="https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite&logoColor=white" alt="Vite 8">
  <img src="https://img.shields.io/badge/Tauri-2-24C8DB.svg?logo=tauri&logoColor=white" alt="Tauri 2">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
</p>

<p align="center">A Tauri Android app that stabilizes internet connections on Sri Lankan mobile networks by continuously pinging optimized provider endpoints — with a JoJo's Bizarre Adventure themed UI.</p>

---

## Purpose

Lag Crusher stabilizes internet connections on Sri Lankan mobile networks (Dialog, Mobitel, Hutch, Airtel) by continuously pinging optimized provider endpoints to prevent idle disconnects and reduce jitter.

## Structure

```
lag-crusher/
├── src/
│   ├── __tests__/
│   │   ├── ping.test.ts          # Ping logic tests (9 tests)
│   │   └── stats.test.ts         # Stats calculation tests (15 tests)
│   ├── components/
│   │   └── JojoSelect.tsx        # Custom dropdown with JoJo styling
│   ├── lib/
│   │   ├── jojo-fx.tsx           # Animation system (bursts, shakes, SFX)
│   │   ├── ping.ts               # Ping logic with fallback endpoints
│   │   ├── stats.ts              # Latency, loss, quality calculations
│   │   └── utils.ts              # Utility helpers
│   ├── routes/
│   │   ├── __root.tsx            # TanStack root layout
│   │   └── index.tsx             # Main pinger screen
│   ├── main.tsx                  # Client SPA entry point
│   ├── router.tsx                # TanStack Router config
│   ├── routeTree.gen.ts          # Auto-generated route tree
│   └── styles.css                # Global styles + Tailwind
├── public/                       # Static assets
├── src-tauri/                    # Tauri Android wrapper
├── vite.config.ts                # Vite SPA config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies and scripts
```

## Features

- **Provider presets** — Dialog, Mobitel, Hutch, Airtel with optimized ping URLs and fallback endpoints
- **Custom URL support** — Ping any endpoint with localStorage persistence
- **Configurable intervals** — 1s, 3s, 5s, or 10s ping frequency
- **Live stats** — Real-time latency, average latency, packet loss, and connection quality
- **Scrollable ping log** — History of the last 25 pings with timestamps
- **JoJo animations** — Halftone backgrounds, screen shakes, and floating ゴゴゴゴ SFX
- **Mobile-first layout** — 420px container optimized for phones
- **24 passing tests** — Vitest coverage for ping and stats logic

## Getting Started

```sh
git clone https://github.com/TH4RU5H4/Lag-Crusher.git
cd Lag-Crusher
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Prerequisites

- **Bun** 1.0+ — Package manager and runtime ([bun.sh](https://bun.sh))
- **Node.js** 18+ — Required by Vite and tooling
- **Rust** (stable) + **Cargo** — Required for Tauri Android builds ([rustup.rs](https://rustup.rs))
- **Android SDK + NDK** — Required for `cargo tauri android build`
- **Java JDK 17+** — Required for Android Gradle builds

## Installation

```sh
# 1. Clone the repository
git clone https://github.com/TH4RU5H4/Lag-Crusher.git
cd Lag-Crusher

# 2. Install dependencies (uses bun, not npm)
bun install

# 3. Verify setup
bun run dev
```

## Development

```sh
bun run dev        # Start Vite SPA dev server at http://localhost:3000
bun run test       # Run Vitest (24 tests)
bun run lint       # Run ESLint
```

Development uses Vite in SPA mode (no SSR). Routes are file-based via TanStack Router — `routeTree.gen.ts` is auto-generated, do not edit manually. The entry point is `src/main.tsx`.

## Building

```sh
bun run build                  # Vite production build (SPA) -> dist/
cargo tauri android build      # Android APK + AAB (requires Rust + Android SDK)
```

| Command | Output |
|---------|--------|
| `bun run build` | Static SPA in `dist/` |
| `cargo tauri android build` | `APK` and `AAB` bundles in `src-tauri/gen/android/app/build/outputs/` |

Production builds are SPA-only — no Nitro server or SSR output.

## Usage

1. Select your **Service Provider** — Dialog, Mobitel, Hutch, or Airtel — or choose **Custom URL**.
2. If using Custom URL, enter your endpoint (saved to `localStorage`).
3. Choose an **Interval Delay** — `1s` (aggressive), `3s`, `5s`, or `10s` (battery saver).
4. Tap **START CRUSHER** to begin pinging. The button triggers JoJo burst/shake effects on activation.
5. Monitor **Live Latency**, **Average**, **Packet Loss**, and **Quality** in real time.
6. Scroll the **Ping Log** to review the last 25 pings with latency and timestamps.
7. Tap **STOP** to halt pinging.

Provider endpoints include fallback URLs handled automatically in `src/lib/ping.ts`.

## Shortcuts

| Command | Description |
|---------|-------------|
| `bun install` | Install dependencies |
| `bun run dev` | Start dev server at http://localhost:3000 |
| `bun run build` | Production SPA build |
| `bun run test` | Run Vitest (24 tests) |
| `cargo tauri android build` | Build Android APK + AAB |
| `cargo tauri android dev` | Run on connected Android device/emulator |

## Configuration

| File / Key | Purpose |
|------------|---------|
| `vite.config.ts` | Vite SPA configuration (no SSR/Nitro) |
| `tsconfig.json` | TypeScript 5.8 strict compiler options |
| `eslint.config.js` | ESLint rules |
| `src/lib/ping.ts` | Provider endpoint URLs and fallback logic |
| `src/lib/stats.ts` | Latency averaging, packet loss, and quality thresholds |
| `localStorage` (`customUrl`, provider selection) | Persists custom URL and last selected provider/interval |

No environment variables are required. Custom endpoints and interval preferences are stored client-side via `localStorage`.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `bun: command not found` | Install Bun from [bun.sh](https://bun.sh) and restart your shell |
| Dev server not on 5173 | This project runs on **http://localhost:3000** (not the Vite default) |
| `cargo tauri` not found | Install Rust via [rustup.rs](https://rustup.rs) then `cargo install tauri-cli` |
| Android build fails (SDK/NDK) | Install Android Studio, set `ANDROID_HOME`, and install NDK via SDK Manager |
| Ping fails / high packet loss | Try a different provider preset or a custom URL closer to your network; check fallback endpoints in `src/lib/ping.ts` |
| Tests fail | Run `bun run test` — ensure `ping.test.ts` (9) + `stats.test.ts` (15) = 24 tests pass |

## Architecture

- **SPA, not SSR** — `src/main.tsx` bootstraps React 19 as a client-only SPA. No TanStack Start, Nitro, or server rendering.
- **Routing** — TanStack Router 1.170 with file-based routes (`src/routes/__root.tsx`, `src/routes/index.tsx`). `routeTree.gen.ts` is auto-generated.
- **Core Logic** — `src/lib/ping.ts` handles `fetch`-based pings with provider-optimized URLs and fallbacks; `src/lib/stats.ts` derives latency average, packet loss %, and quality rating from ping history.
- **UI** — Tailwind CSS 4.2 + custom JoJo theme (CSS variables, halftone patterns). `JojoSelect.tsx` is a bespoke dropdown; `jojo-fx.tsx` provides bursts, shakes, and floating SFX.
- **Native Wrapper** — Tauri 2 wraps the SPA for Android (`src-tauri/`). GitHub Actions builds APK + AAB only.
- **Data Flow** — `index.tsx` owns ping interval state → calls `ping.ts` on each tick → accumulates results → feeds `stats.ts` for display and the scrollable log.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI framework |
| TypeScript | 5.8 | Type safety |
| TanStack Router | 1.170 | File-based client routing |
| Tailwind CSS | 4.2 | Utility-first styling |
| Vite | 8 | Build tool (SPA) |
| Tauri | 2 | Android native wrapper |
| Vitest | 3.2 | Testing |

<p>
  <img src="https://img.shields.io/badge/React-19.2-61DAFB.svg?logo=react&logoColor=white" alt="React 19.2">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript&logoColor=white" alt="TypeScript 5.8">
  <img src="https://img.shields.io/badge/TanStack_Router-1.170-EF4444.svg" alt="TanStack Router 1.170">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4.svg?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4.2">
  <img src="https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite&logoColor=white" alt="Vite 8">
  <img src="https://img.shields.io/badge/Tauri-2-24C8DB.svg?logo=tauri&logoColor=white" alt="Tauri 2">
  <img src="https://img.shields.io/badge/Vitest-3.2-6E9F18.svg?logo=vitest&logoColor=white" alt="Vitest 3.2">
</p>

## Downloads

No npm package is published. Install from source or download Android binaries:

```sh
# From source (requires Bun)
git clone https://github.com/TH4RU5H4/Lag-Crusher.git
cd Lag-Crusher
bun install
bun run build
```

**Android binaries** — Download `APK` or `AAB` from [GitHub Releases](https://github.com/TH4RU5H4/Lag-Crusher/releases) (built via Android-only GitHub Actions workflow).

## Links

- [GitHub Repository](https://github.com/TH4RU5H4/Lag-Crusher)
- [Issue Tracker](https://github.com/TH4RU5H4/Lag-Crusher/issues)
- [Releases (APK/AAB)](https://github.com/TH4RU5H4/Lag-Crusher/releases)
- [Tauri Documentation](https://tauri.app/)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## Credits

- **TH4RU5H4** — Creator and maintainer ([@TH4RU5H4](https://github.com/TH4RU5H4))
- **JoJo's Bizarre Adventure** — Visual and thematic inspiration — 荒木飛呂彦 (Hirohiko Araki)

## License

MIT License — see [LICENSE](LICENSE) for details.
