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

## Learning workflow

Read `docs/learning.md`. When `git config --local --get learning.notebook` is configured, read the notebook's direction, relevant playbook lessons, and the project's overview and recent notes before meaningful work. After a meaningful task, save one concise private note with `python3 scripts/learning.py note --area engineering` (or product/revenue), passing Markdown on stdin. Include hypothesis, observed evidence and links, what changed in understanding, decision/next action, and confidence. Mark missing product/revenue evidence unknown; never infer demand or income from a successful build. Do not create notes for every trivial edit.

The build/check wrappers and local post-commit hook capture facts automatically after one-time setup. A build is not a deployment. Only record deployment after provider/environment verification. If learning capture is unconfigured or sandbox-blocked, report that briefly; never move private notes into tracked product files. Do not change notebook visibility, publish its contents, or propagate a proposed lesson to other projects without authorization.
