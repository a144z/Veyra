# Validation record

- Node 24.19.0, Linux x64; plugin pnpm 11.11.0.
- Official starter 1.0.2 tooling preserved and frozen-lockfile install passed.
- Plugin double-build byte identity and MCP conformance passed; 4 tools discovered.
- Independently exercised `list_packs`, `inspect_card`, and `open_demo_pack` through the official conformance runner; all passed.
- App/domain tests cover cumulative agent budget, manual spending, daily reset, duplicate receipts, exact atomic amounts, x402 price/asset/network binding, merchant URL restrictions, both payment rails, deterministic demo output and currency-aware prices.
- Live-payment tests verify no fake-success fallback and block repayment after an uncertain merchant response. This is a mocked contract test, not real settlement.
- Next.js production static export and strict TypeScript checks passed.
- Hosted PayBox tests, wallet approval, paid delivery, actual card inventory and custody remain integration steps for a configured live merchant.
- 33-second Remotion film rendering and visual QA run in GitHub Actions because the local environment blocks Remotion's localhost server.

The submission artifact is byte-identical to `plugin/dist/plugin.mjs`; its SHA-256 is recorded in SUBMISSION.md.
