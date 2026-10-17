# Validation record

[← Documentation](README.md)

- Node 24.19.0, Linux x64; plugin pnpm 11.11.0.
- Official starter 1.0.2 tooling preserved and frozen-lockfile install passed.
- Plugin double-build byte identity and MCP conformance passed; 5 tools discovered.
- Independently exercised `get_setup_status`, `list_packs`, `inspect_card`, and `open_demo_pack` through the official conformance runner; all passed.
- App/domain tests cover cumulative agent budget, manual spending, daily reset, duplicate receipts, exact atomic amounts, x402 price/asset/network binding, merchant URL restrictions, both payment rails, deterministic demo output and currency-aware prices.
- Live-payment tests verify no fake-success fallback and block repayment after an uncertain merchant response. This is a mocked contract test, not real settlement.
- Next.js production static export and strict TypeScript checks passed.
- Hosted PayBox tests, wallet approval, paid delivery, actual card inventory and custody remain integration steps for a configured live merchant.
- 33-second Remotion film exported and inspected. Seven scene frames and desktop/mobile product renders inspected; clipped mobile ornament and film wordmark corrected.
- H.264 1920×1080 at 30 fps; AAC 48 kHz stereo; 990 video frames. MP4 container duration 33.003 seconds from audio packet rounding.
- Uploaded music / rendered audio aligned correlation 0.9979; sub-millisecond codec offset.
- Browser interaction testing was unavailable locally; production build, rendered layouts, protocol tests and mocked payment behavior were verified.

The submission artifact is byte-identical to `plugin/dist/plugin.mjs`; its SHA-256 is recorded in SUBMISSION.md.

Final local behavior suite: **25 tests passed**.

Final film SHA-256: `4bf9825294b138344eb4fb8357ab8327922dd45d75894d961d5ef486297902fc`.

The released film is a retained build artifact. Its checksum identifies the exact verified export independently of commit-history changes.

## Reproduce locally

Run `npm run check` for the application. In `plugin/`, use pnpm 11.11.0 and run `pnpm install --frozen-lockfile` followed by `pnpm test`. Render the film with `npm run video:render` on a machine that supports Chrome and a localhost render server.

No hosted build or render workflows are configured. The updated film was rendered locally with the current logo and a cursor whose arrow tip and click ripple are anchored to the center of the selected button.

Version 1.1.0 adds direct upload-bundle runtime tests for tool discovery, unsigned proposals on both supported rails, and rejection of unconfigured purchases. The full generated catalog is in `plugin-tools.json`. No hosted PayBox account or real payment was exercised.

## Version 1.1.0 verification

- Official pinned starter double-build identity and conformance passed with five tools.
- Four read/demo tools passed separate official sample calls.
- Direct bundle tests verified discovery with no variables, capped proposal construction on both rails, and rejection of a purchase without a merchant.
- Full local behavior suite: 25 tests passed; strict TypeScript and static export passed.
- Corrected click frame inspected: cursor tip and ripple are anchored to the selected button's center.
- Updated film rendered locally: 990 frames, 1920 × 1080, stereo soundtrack; no hosted workflow was used.
