# Architecture

[← Documentation](README.md)

Veyra separates the collecting interface, payment intent, and merchant fulfillment. The static application can simulate the complete experience; only an authorized payment host and a real merchant can complete a live purchase.

## Runtime boundaries

| Runtime | Responsibility | State |
| --- | --- | --- |
| Next.js static app | Pack selection, demo policy, checkout visualization, animation, collection | Browser-local ledger and archive |
| PayBox plugin | Small MCP tool interface and unsigned x402 proposals | Stateless between hosted calls |
| PayBox host | Wallet selection, grants, approval, signing, submission, request status | Managed outside this repository |
| Merchant | Live 402 challenge, settlement verification, inventory allocation, delivery | Managed outside this repository |
| Remotion | Deterministic visual composition and soundtrack playback | Frame-indexed render inputs |

## Source layout

```text
agent/                 Node SDK integration example
  rip.ts
src/
  app/                 Static Next.js entry points and styles
  components/          Collecting interface, dialogs, foil packs, slabs, brand
  lib/                 Catalog, card normalization, payment contracts, identity
plugin/
  src/                 MCP tools, catalog logic, official proposal helpers
  scripts/             Official starter conformance and deterministic-build checks
  paybox-plugin.json   Successful sample tool call
public/
  brand/               SVG identity exports and transparent PNG mark
  cards/               Offline reference images
  fonts/               Bundled Inter font and license
video/                 Frame-driven film and audio analysis data
scripts/               Local validation, asset generation, and artifact packaging
tests/                 Payment, policy, catalog, and proposal behavior tests
dist/plugin.mjs        Portal upload artifact
releases/              Finished product film
```

## Demo opening

1. Select a catalog pack.
2. Agent mode starts authorization automatically; manual mode waits for approval.
3. Read the current ledger and check balance and the daily agent allowance.
4. Fetch public card metadata while the simulated handshake runs.
5. Record the receipt once, update the collection, and play the opening.
6. Reveal the card and persist the archive in the browser.

A purchase guard prevents repeated clicks. Web Locks serialize demo spending between tabs where supported. Receipt IDs prevent duplicate ledger entries. The local policy is a demonstration of the interaction model, not a production authorization boundary.

## Live purchase

The plugin constructs a native `io.paybox/transactionProposal` with an exact pack cap and a four-minute expiry. PayBox independently fetches and checks the merchant challenge before approval and execution. The plugin does not choose a wallet, hold signing keys, or resume after payment.

The optional browser adapter is an application-specific contract, not an official injected PayBox global. It validates the challenge's asset, amount, network, and resource before requesting a signature. An uncertain submitted payment leaves a reconciliation marker and blocks another payment attempt. See [Integration](INTEGRATION.md) for the complete contract.

## Metadata and identity

Public card metadata is normalized separately from payment results. Prices retain their currency and update date, and missing prices remain unavailable. Offline data is labeled as reference material.

The app and film share `Mark`, `PackArt`, and `SlabArt`. The logo path is defined in `src/lib/brand.ts`; the vector export generator uses the same geometry. Film animation uses frame values rather than browser animation clocks, making repeated renders deterministic.
