# Validation record

- Node 24.19.0, Linux x64; plugin pnpm 11.11.0.
- Official starter 1.0.2 tooling preserved and frozen-lockfile install passed.
- Plugin double-build byte identity and MCP conformance passed; 4 tools discovered.
- Independently exercised `list_packs`, `inspect_card`, and `open_demo_pack` through the official conformance runner; all passed.
- App/domain tests cover cumulative agent budget, manual spending, daily reset, duplicate receipts, exact atomic amounts, x402 price/asset/network binding, merchant URL restrictions, both payment rails, deterministic demo output and currency-aware prices.
- Live-payment tests verify no fake-success fallback and block repayment after an uncertain merchant response. This is a mocked contract test, not real settlement.
- Next.js production static export and strict TypeScript checks passed.
- Hosted PayBox tests, wallet approval, paid delivery, actual card inventory and custody remain integration steps for a configured live merchant.
- 33-second Remotion film rendered successfully in GitHub Actions. Seven scene frames and desktop/mobile product renders inspected; clipped mobile ornament and film wordmark corrected.
- H.264 1920×1080 at 30 fps; AAC 48 kHz stereo; 990 video frames. MP4 container duration 33.003 seconds from audio packet rounding.
- Uploaded music / rendered audio aligned correlation 0.9979; sub-millisecond codec offset.
- Browser interaction testing was unavailable locally; production build, rendered layouts, protocol tests and mocked payment behavior were verified.

The submission artifact is byte-identical to `plugin/dist/plugin.mjs`; its SHA-256 is recorded in SUBMISSION.md.

Final local behavior suite: **15 tests passed**.

Final film SHA-256: `64b9d0839acc2c155015ed8ee2f54d2c50f96ed1615df6fcea0d0c717e400f1b`.

Film source/render: commit `77c0491`, GitHub Actions run `39054673188`.
