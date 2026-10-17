# Contributing

Thank you for taking an interest in Veyra. Keep changes focused, preserve the distinction between simulations and real payments, and make the result straightforward to review.

## Development setup

Use Node.js 24 for the app. Plugin development requires Node.js 24 and pnpm 11.11.0; reference versions are recorded under `plugin/`.

```sh
npm ci
npm run dev
```

Run the local checks before proposing a change:

```sh
npm run check
```

For plugin changes, run the frozen-lockfile installation and `pnpm test` inside `plugin/`, then publish the verified bundle with `node scripts/publish-plugin.mjs` from the repository root. Preserve the official starter's pinned dependencies and conformance tooling.

## Change guidelines

- Keep browser code, hosted plugin code, and merchant responsibilities separate.
- Keep all payment amounts exact in the asset's atomic units.
- Preserve explicit demo labels, unavailable-price states, and payment reconciliation behavior.
- Keep tool interfaces small, input schemas strict, and hosted calls bounded.
- Never add wallet secrets, API credentials, or private customer data to source, fixtures, or bundles.
- Keep pointer, keyboard, mobile, and reduced-motion behavior usable.
- Use the shared geometric identity instead of creating competing logo variations.

## Pull requests

Describe the problem, resulting behavior, and checks performed. Include visual comparisons for interface or identity changes. Explain any changes to public tool schemas, payment contracts, or saved browser state. Keep unrelated refactors separate.

## Film and identity work

Use `npm run video:studio` and `npm run video:render` on a machine that supports the Remotion render server. Inspect representative frames and the exported audio before replacing a released film.

Run `python3 scripts/build_brand.py` to regenerate vector identity assets; this requires FontTools. Inter's license must stay with redistributed font-derived assets. Brand geometry and export locations are documented in [Brand](docs/BRAND.md).

## Execution model

Validation and rendering run locally. This repository does not use hosted workflow automation. Report checks that could not run; do not describe an untested live payment or delivery as successful.
