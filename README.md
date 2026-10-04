# Mobile App Starter

A lean Expo / React Native foundation for iOS and Android side projects, with TypeScript, file-based navigation, an offline demo, and an optional connection to a Python API.

## Start locally

```bash
nvm use
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Open the QR code with an Expo Go version compatible with SDK 57, or use `pnpm ios` / `pnpm android` with a configured simulator/emulator. `pnpm web` provides a quick browser preview. No account, API key, or backend is needed for the demo.

Open **Connection check**, then **Check connection**. Demo success is clearly labeled and makes no network request. Set `EXPO_PUBLIC_API_MODE=api` and `EXPO_PUBLIC_API_URL` to connect to your backend's `GET /health` endpoint (`{"status":"ok"}`). See [setup](docs/setup.md) for physical-device networking.

## Quality checks

```bash
pnpm check
pnpm doctor
```

`check` runs Prettier, ESLint, strict TypeScript, Jest / React Native Testing Library tests, and production exports for iOS, Android, and web. Tests cover configuration, response validation, failure/retry, timeout, cancellation, and duplicate taps. Tests use mocked networking and no paid services.

**Exports are JavaScript/assets, not signed installable apps.** Native builds and device checks are separate; see [release](docs/release.md). `doctor` checks Expo compatibility and needs internet access.

GitHub Actions runs `pnpm check` on pushes, pull requests, and manual dispatch, using pinned Node/pnpm versions and a frozen lockfile. This directory should be the root of its own GitHub repository for that workflow to run.

## Structure

- `app/`: home, connection, missing-route screen, and stack layout.
- `components/`: reusable screen container and example connection flow.
- `config/`: validated public configuration and light/dark colors.
- `lib/health.ts`: small typed API integration with timeout and cancellation.
- `tests/`: behavior tests, with native modules provided by the Expo Jest preset.
- `docs/`: setup, stack decisions, and release / product extension guidance.

## Use for a new project

Use GitHub's **Use this template** once published as a template repository, or copy this folder without `.git`, `node_modules`, `.expo`, `dist`, and `.env.local` into a new directory. Run the setup commands above.

Rename `package.json` and the app name, slug, URL scheme, iOS bundle identifier, and Android package in `app.json`. Replace the example screens, README, and app artwork before publishing. Identifiers must be unique to the new product; `com.example.mobilestarter` is a placeholder.

The base has no persistence, auth, payments, analytics, or AI SDK. Connection results live in memory. Start with the smallest useful feature; add backend services and monetization only when the product needs them. [Stack decisions](docs/decisions.md) explain where Python fits.

## Automatic learning capture

Run `python3 scripts/learning.py setup --notebook ../founder-notebook --project my-product` once per clone to connect a private notebook. Commits and `pnpm check` then record engineering evidence automatically. Coding agents also save concise learning notes. See [the learning workflow](docs/learning.md) for setup, privacy, deployment integration, and weekly reviews.
