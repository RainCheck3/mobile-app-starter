# AGENTS.md

This is a lean reusable Expo / React Native mobile starter for side projects. Read the existing code and docs before changing it.

## Conventions

- Use TypeScript, Expo Router, React Native primitives, and `StyleSheet`.
- Use pnpm from `package.json` and Node from `.nvmrc`.
- Keep routes in `app/`, reusable UI in `components/`, shared logic in `lib/`, configuration in `config/`, tests in `tests/`, and documentation in `docs/`.
- Prefer small focused modules and existing platform features over abstractions and dependencies.
- Keep native dependency versions aligned using `pnpm exec expo install` and Expo's compatibility checks.
- Native directories are generated and ignored. Use app config and plugins instead of hand-editing generated projects.
- All mobile-bundled environment variables are public. Keep secrets and privileged business logic in a backend service.

## Boundaries

Add auth, payments, persistence, analytics, error tracking, AI SDKs, global state libraries, and deployment services only when requested for a concrete project. Preserve the credential-free demo and mocked tests. Never silently replace an API failure with demo data.

## Quality bar

Run `pnpm check` before finishing. It checks formatting, lint, types, behavior tests, and all-platform exports. Run `pnpm doctor` after dependency/configuration changes. Explain failed or unavailable checks. Exports and mocked component tests do not prove native compilation or device behavior; do not claim otherwise.

Update README, setup, decisions, and release notes when their instructions change. Keep `.env.example` current. Do not rewrite unrelated starter projects or add provider-specific credentials or identifiers.
