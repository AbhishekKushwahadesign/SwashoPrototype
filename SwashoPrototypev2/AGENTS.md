This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Swasho Design & Implementation Rules

### Figma is the source of truth
- Treat the Swasho Figma file as the single source of truth for visual design.
- Do not redesign, simplify, or reinterpret the UI unless explicitly asked.
- Match the Figma layout, spacing, typography, colors, icons, imagery, component states, and interactions as closely as possible.
- Use Figma variables and component properties when they are available.
- If Figma does not contain a token or variable, do not invent a new design system value without checking existing project values first.

### Design fidelity
- Swasho primary brand color is #5D30F7.
- Do not approximate colors when an exact Figma value is available.
- Preserve the intended mobile screen dimensions and responsive behavior.
- Prefer reusable components for repeated UI patterns.
- Do not create duplicate components when an existing component can be reused.
- Keep repeated colors, spacing, typography, radii, and other design values centralized.

### Functional prototype
- This project is a recruiter-facing and user-testing prototype, not a production backend.
- Use local/mock data where a real backend is unnecessary.
- Interactions shown in Figma should work in the prototype whenever reasonably possible.
- Important flows should be functional, including navigation, garment quantity, service selection, photo upload, cart calculations, subscription discounts, checkout, order confirmation/tracking, and subscription management.
- Do not add unnecessary backend infrastructure.

### Before implementing a Figma screen
1. Inspect the Figma frame through the connected Figma MCP.
2. Identify layout, components, variables, typography, colors, spacing, assets, states, and interactions.
3. Check whether reusable components already exist in the codebase.
4. Implement the screen using React Native and existing project patterns.
5. Test the screen in Expo Web.
6. Compare the implementation against the Figma design and correct visual differences.

### AI implementation behavior
- Do not generate the entire application from assumptions.
- Work flow-by-flow and screen-by-screen.
- Do not invent screens or functionality that is not present in the Figma design.
- When something is ambiguous in Figma, ask for clarification rather than silently redesigning it.
