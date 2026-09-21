# From template to product

## Create an independent project

Copy the starter or use GitHub's template feature, then choose unique package/app names, a URL scheme, and iOS/Android identifiers. Put the entire starter at the new repository root so `.github/workflows/ci.yml` runs. Replace the example connection screen with the first useful product workflow and add behavior tests for it.

The template intentionally has no EAS owner, project ID, signing credentials, app icons, or paid-service integration. Add your own icon, adaptive icon, splash artwork, and store metadata for the product.

## Build installable apps

`pnpm build` only exports JavaScript and assets. It does not compile Swift/Kotlin, create an IPA/APK/AAB, sign an app, submit it, or deploy anything.

For local native development, install the native toolchains, then:

```bash
pnpm exec expo install expo-dev-client
pnpm exec expo run:ios
# Or, with Android Studio / Android SDK configured:
pnpm exec expo run:android
```

These commands generate native projects. This template ignores `ios/` and `android/`; maintain native configuration through `app.json` and config plugins. Native dependency/config changes require rebuilding the development client. If you choose to maintain native projects manually, change the ignore policy and own those files deliberately.

For optional EAS cloud builds, follow the [official build setup](https://docs.expo.dev/build/setup/). In your new product repository:

```bash
pnpm dlx eas-cli@latest login
pnpm dlx eas-cli@latest build:configure
```

Review the generated `eas.json` and project linkage. Configure preview and production environments explicitly. Set `EXPO_PUBLIC_API_MODE=api` and the production HTTPS API URL in the build environment when the product needs a backend; `.env.local` is ignored and is not a release configuration strategy. Public values remain public even if configured through a secret-management UI.

After setting up the build profile, accounts, and signing:

```bash
pnpm dlx eas-cli@latest build --platform all --profile production
```

EAS builds may consume account quota or incur charges depending on your plan. Store distribution requires the relevant developer accounts. Cloud build and submission are separate from this repository's credential-free CI. Nothing is submitted automatically. Select and pin a supported native build image in your product's EAS configuration; SDK 57's Xcode 27 scene-support flag is already enabled here.

## Verify before releasing

- Run `pnpm check` and `pnpm doctor`, then compile and install native builds for both target platforms.
- Test on a real device: navigation/back behavior, cold-start links using the product's URL scheme, large text, light/dark themes, safe areas, offline errors, retry, and background/foreground transitions.
- Test the real HTTPS API from a device outside your development network. Confirm the release is using the intended environment.
- Replace starter identity/artwork and complete store metadata and privacy disclosures that match the features actually added.

Add device end-to-end tests (for example Maestro) once you have a stable product flow. Keep those tests distinct from the Node component tests and bundle-export checks already in CI.

## Add monetization around a useful feature

Start with one audience, one problem, and one usable feature. Add services in response to product needs:

| Need                      | Extension point                                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Accounts / sync           | Add backend auth and storage; use secure device storage for session tokens                                                              |
| Paid digital features     | Evaluate store billing for your distribution model; verify purchases and entitlements on the backend, including restore/refund handling |
| AI features               | Call your Python service; keep model credentials, usage budgets, and provider calls server-side                                         |
| Offline work              | Define persistence, migration, sync, and conflict behavior before choosing a storage library                                            |
| Analytics / crash reports | Add only the events and diagnostics needed to understand the product, with appropriate disclosures                                      |

The client should display entitlements returned by the backend; a local boolean is not payment verification. Payment rules depend on product, storefront, and region: check current store requirements when implementing billing. No payment provider is preselected or installed in this template.
