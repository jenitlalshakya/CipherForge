# CipherForge

CipherForge is a privacy-first cryptographic toolkit built with Next.js. It generates passwords, API keys, hexadecimal values, Base64 strings, SHA-256 hashes, and UUID v4 identifiers entirely in the browser with the Web Crypto API. Generated values never touch a server, are never logged, and are never persisted.

## Getting started

Requirements: Node.js 20.9+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server with Turbopack |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | Run ESLint |

## Theme

The header theme control is a single click-to-cycle button rather than a dropdown. Each click advances through:

1. **Light**
2. **Dark**
3. **System**

**System** is the default, so a first visit follows the operating system's appearance. System mode also responds to OS theme changes while the page is open. The selected mode is stored locally by `next-themes` in `localStorage`; no preference is sent to a server.

The button shows a sun for light mode, a moon for dark mode, and a monitor for system mode. Its accessible label and tooltip describe the current mode and the mode the next click will select.

Theme wiring lives in:

- `components/providers/site-providers.tsx` — `ThemeProvider` configuration and the `system` default.
- `components/brand/theme-toggle.tsx` — the click-to-cycle control.
- `app/layout.tsx` — viewport `colorScheme` and light/dark `themeColor` metadata.

## Features

- Cryptographically secure password generation with selectable character sets, ambiguous-character filtering, and batch output.
- API key generation with custom prefixes and configurable token length.
- Hex and Base64 generation from secure random bytes.
- SHA-256 hashing via `crypto.subtle`.
- UUID v4 generation with a secure `getRandomValues()` fallback.
- Entropy and strength estimates for generated secrets.
- Batch generation (up to 20 values) with per-item copy, copy-all, masking, and clear controls.
- Responsive layout, keyboard-accessible controls, and reduced-motion support.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [Base UI](https://base-ui.com) primitives
- [next-themes](https://github.com/pacocoursey/next-themes) for theme handling
- [lucide-react](https://lucide.dev) icons
- [Zod](https://zod.dev) validation

## Privacy and security

All generation and hashing happen locally in the browser. CipherForge fails closed when the Web Crypto API is unavailable instead of falling back to an insecure random source. Copy and download actions only use the browser clipboard and local Blob URLs.

Client-side tools cannot defend against malware, hostile browser extensions, or clipboard monitors. For high-value credentials, use a hardened device and a reputable password manager.

## Project structure

```text
app/                  App Router entry points, metadata, and global styles
components/brand/     Logo and theme toggle
components/generator/ Strength meter
components/layout/    Header, footer, and info dialogs
components/sections/  Page sections and generator studio
components/shared/    Reusable form controls and output components
components/tools/     Password, API key, hex, Base64, SHA-256, and UUID tools
components/ui/        Base UI primitives styled for CipherForge
hooks/                Client-side hooks
lib/crypto/           Randomness, character sets, entropy, hashing, and tokens
lib/                  Constants, validation, and utilities
types/                Shared TypeScript types
```
