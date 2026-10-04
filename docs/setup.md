# Setup

## Tooling and local development

Use Node from `.nvmrc` and pnpm from `package.json`, matching the web and AI starters. Run `nvm use`, `corepack enable`, and `pnpm install --frozen-lockfile`. Copy `.env.example` to `.env.local` and start with `pnpm dev`.

The app targets Expo SDK 57 / React Native 0.86 with React 19.2. Use [Expo's device setup guide](https://docs.expo.dev/get-started/set-up-your-environment/) for compatible Expo Go, an Android emulator, or an iOS simulator. iOS simulation needs macOS and full Xcode; command-line tools alone are insufficient. A physical phone can run Expo Go without a local native toolchain. Use development builds when adding native libraries that Expo Go does not include.

| Command                     | Purpose                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `pnpm dev`                  | Metro dev server and device QR code                        |
| `pnpm ios` / `pnpm android` | Open the dev app in a configured simulator/emulator        |
| `pnpm web`                  | Browser preview                                            |
| `pnpm check`                | Format check, lint, types, tests, all-platform export      |
| `pnpm test:watch`           | Interactive tests                                          |
| `pnpm format`               | Apply formatting                                           |
| `pnpm build`                | Export production bundles and static web routes to `dist/` |
| `pnpm doctor`               | Online Expo configuration/dependency diagnostics           |

No custom Metro or Babel configuration is needed. Use `pnpm exec expo install <package>` for native dependencies, then run `pnpm exec expo install --check`, `pnpm doctor`, and `pnpm check`. Commit the updated lockfile. See dependency alignment notes in [decisions](decisions.md) before upgrading SDKs.

## Public configuration

| Variable               | Default | Purpose                                                                            |
| ---------------------- | ------- | ---------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_API_MODE` | `demo`  | `demo` returns a labeled offline result; `api` requires a base URL                 |
| `EXPO_PUBLIC_API_URL`  | Unset   | Absolute HTTP(S) base URL; `/health` is appended, preserving an optional base path |

Invalid mode/URL configuration appears as a check error. API mode never silently falls back to demo. Requests time out after eight seconds and are cancelled when the connection screen unmounts. Retry is manual to avoid unintended repeated requests.

All `EXPO_PUBLIC_*` values are embedded in the app and are readable by users. A mobile bundle cannot protect backend credentials, AI provider keys, or signing secrets. Keep those in the Python service. URLs must not contain credentials, query strings, or fragments.

After changing `.env.local`, restart Metro and fully reload the app. Production values are fixed during bundling; changing the backend host's environment does not change an installed client. See [Expo environment variables](https://docs.expo.dev/guides/environment-variables/).

## Connect the Python API starter

In your copy of `api-starter`:

```bash
uv sync --locked
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

In this app's `.env.local`:

```dotenv
EXPO_PUBLIC_API_MODE=api
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
```

Replace the example address with your computer's LAN IP. Keep the phone and computer on the same trusted Wi-Fi network and allow the development server through the local firewall. Binding `0.0.0.0` exposes this development server to that network; it is not a production deployment.

| Client                     | Backend address                                       |
| -------------------------- | ----------------------------------------------------- |
| Physical iOS/Android phone | Computer's LAN IP, e.g. `http://192.168.1.100:8000`   |
| iOS simulator              | `http://127.0.0.1:8000`                               |
| Android Studio emulator    | `http://10.0.2.2:8000`                                |
| Browser on the computer    | `http://127.0.0.1:8000`, with backend CORS configured |

`localhost` on a physical phone refers to the phone. Metro's tunnel shares the app dev server; it does not automatically expose FastAPI. Use HTTPS for deployed APIs. Native development/release builds may block plain HTTP; use an HTTPS development endpoint if blocked instead of weakening release network settings.

Native fetch does not use browser CORS. The web preview does: in your backend project, add `CORSMiddleware` with the exact web origin (usually `http://localhost:8081`, check Metro output), `allow_methods=["GET"]`, and `allow_headers=["Accept"]`. Do not add unrestricted CORS to the shared API template. An HTTPS web preview also requires an HTTPS API to avoid mixed-content blocking.

## Python-to-mobile orientation

`app/*.tsx` defines screens; `components/` holds reusable UI. React state (`useState`) drives rerendering. `async` functions return promises; use `await` and `try/catch` much like async Python. TypeScript types help at development time but do not validate network JSON: `lib/health.ts` demonstrates the runtime check at the boundary.

Keep business rules, database access, expensive jobs, AI provider calls, and billing verification in Python. The mobile client handles presentation, device APIs, and user input. When the API grows beyond a few endpoints, consider generating TypeScript contracts from FastAPI's OpenAPI schema.

## Learning setup

For each new project, complete the one-time [learning setup](learning.md) before starting work. Keep the notebook outside the product repository.
