# Decisions

## Recommend Expo + React Native + TypeScript

For a Python-first solo builder, use TypeScript for the mobile client and the existing FastAPI starter for backend work. This creates a reusable iOS/Android foundation while sharing React concepts and tooling with the web and AI starters. Expo supplies navigation integration, native modules, and a path from local experiments to store builds. [Expo overview](https://docs.expo.dev/get-started/create-a-project/).

| Option                   | Fit for these side projects                                                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Expo / React Native      | Recommended default: one client for iOS/Android; reuse React and TypeScript knowledge                                                                       |
| SwiftUI                  | Consider for an intentionally Apple-only product with extensive Apple-specific UI/integration                                                               |
| Flutter                  | Viable cross-platform choice, but introduces Dart alongside Python and existing TypeScript projects                                                         |
| Python mobile frameworks | Consider for a specific Python-centric niche; existing Python fluency alone is not enough reason to make every mobile integration depend on Python bindings |

For products that do not need device features, offline behavior, or app-store distribution, the web starter may validate demand faster. Choose the mobile template when a mobile experience is part of the product's value.

## Reuse repository conventions

Reviewed `web-app-starter`, `api-starter`, and `ai-app-starter`: retain separate template folders, pinned Node/pnpm, ESLint/Prettier, `components/`, `lib/`, `config/`, `tests/`, concise docs, and a local quality gate mirrored in CI. The AI starter's deterministic demo inspired a visibly labeled, network-free mobile demo. The optional API adapter uses the Python starter's existing `/health` contract without changing that starter.

Use root `app/` for routes to match the neighboring projects; Expo Router supports this layout. Use React Native `StyleSheet` and system fonts to avoid a second styling framework, external font downloads, or an icon package for two screens. System light/dark mode, scrollable layouts, safe areas, accessible controls, and missing-route handling are included.

## Stay small

Local React state is enough for one example request. There is no query cache, global state framework, custom generic API framework, database, auth, payment provider, analytics, or AI SDK. Add a query library when multiple screens actually share server state. Add offline storage when a real use case defines what must survive restarts and how sync conflicts should work.

## Align dependencies with Expo

SDK 57 is the stable baseline at creation (September 2026); SDK 58 is still in preview. Native package versions follow Expo's compatibility map rather than independent latest releases. [SDK 57 release notes](https://expo.dev/changelog/sdk-57).

`@react-native/metro-config` matches React Native 0.86.3. The pnpm override keeps the transitive worklets peer on Expo's compatible 0.10.1 line. `test-renderer` stays on 1.2.x, matching React 19.2 rather than the 1.3.x React 19.3 reconciler. Re-evaluate these constraints together when upgrading Expo; do not suppress peer warnings to force an upgrade. ESLint 9 follows the SDK's current lint configuration and the neighboring templates; review its next-major compatibility during the next tooling upgrade.

`expo-build-properties` enables the SDK 57 iOS scene lifecycle backport so Xcode 27 builds can launch on iOS 27. It requires Expo 57.0.23 or newer. Remove this flag after moving to SDK 58, where scenes become the default. [Expo lifecycle migration](https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md#staying-on-sdk-57-with-xcode-27).

## Test behavior and export every target

Jest with `jest-expo` and React Native Testing Library exercises native-component behavior in Node, replacing the web starter's browser-focused tooling where appropriate. Network tests use mocks and timers. CI exports iOS, Android, and web to catch platform-specific import/bundling problems without store credentials, an emulator, or paid builds. Native compilation and device behavior still need separate verification before release. [Expo testing guide](https://docs.expo.dev/develop/unit-testing/).

The basic quality gate does not call online diagnostics. Run `pnpm doctor` when changing dependencies or configuration; its remote compatibility services can change independently of the lockfile.

## Optional private learning capture

A standard-library Python helper records commit/build/check evidence outside the repository after one-time setup. Shell wrappers preserve command output and exit status, and are inert before setup. Private reflection stays out of public repositories and CI artifacts. Agent notes and weekly reviews connect factual evidence to decisions; no model calls run inside builds or Git hooks.
