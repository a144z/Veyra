# Integration contracts

[← Documentation](README.md)

## Submit the PayBox plugin

The primary hackathon deliverable is **`dist/plugin.mjs`** in the repository root. It is copied byte-for-byte from the official starter build in `plugin/dist/plugin.mjs`.

Built from PayBox starter 1.0.2 with its pinned dependencies, MCP 2026-07-28, Node 24, and pnpm 11.11.0. The original build/conformance tooling and proposal helpers are preserved.

```sh
cd plugin
corepack pnpm install --frozen-lockfile
corepack pnpm test
cp dist/plugin.mjs ../dist/plugin.mjs
```

Use the pinned `packageManager` with Corepack (or install pnpm 11.11.0). Do not use a different globally installed pnpm.

### Portal fields

**Project name:** Veyra

**Description (under 280 characters):**
Veyra is an agent-native Pokémon collecting plugin. Browse packs, inspect card metadata, try free demo reveals, and propose capped USDC x402 purchases through PayBox. Clear budgets and honest receipts turn agent payments into a delightful collecting experience.

**Built plugin file:** `dist/plugin.mjs` — upload this file alone, not a ZIP or TypeScript source.

### Network hosts

- `api.pokemontcg.io`: `inspect_card` public card metadata and pricing. Optional; three bundled references remain available offline.
- Your real merchant's exact hostname: only needed for `propose_pack_purchase`. No wildcard. No real merchant is supplied or claimed by this project.
- No image hostname is fetched by plugin code. It only returns public image URLs as metadata.

### Variables and secrets

- `VEYRA_MERCHANT_URL` (optional non-sensitive environment variable): the real HTTPS x402 pack endpoint, e.g. a merchant-controlled `/pack/rip` route. No query, fragment, URL credentials, or secrets. Veyra adds `?pack=base|holo|chase`.
- No secrets required for offline demo tools. Optional Pokémon API key belongs in a portal brokered header: host `api.pokemontcg.io`, header `X-Api-Key`, value your key. Do not put it in environment variables or this bundle.
- x402 requests do not support custom headers or injected credentials. Merchant access must use the public paid endpoint.

### Tools

| Tool | Sample input | Result |
|---|---|---|
| `list_packs` | `{}` | Prices, pack IDs and readiness |
| `inspect_card` | `{"cardId":"base1-4"}` | Public card metadata, price source, currency, date |
| `open_demo_pack` | `{"pack":"holo","seed":0}` | Reproducible free simulation, `paid:false`, `ownershipGranted:false` |
| `propose_pack_purchase` | `{"pack":"holo","chain":"eip155:8453"}` | Native `io.paybox/transactionProposal` x402 envelope |

`propose_pack_purchase` caps Base or Solana USDC at exactly $2/$5/$10 in six-decimal atomic units. The proposal expires after four minutes. It never selects a wallet, asks for keys, pays, or fabricates confirmation. PayBox fetches and validates the merchant's live 402 challenge, applies wallet policy, obtains approval, signs and retries the paid endpoint.

The sandbox ends before payment. Poll the returned PayBox request ID through the host. Inspect payment and service status separately. Never call the proposal tool again merely to poll an existing payment. Store the paid service response outside the stateless sandbox.

### Testing and submission

Local conformance proves protocol/schema compatibility, not real merchant payment, hosted access, custody, or delivery. In the portal: upload → configure → run hosted checks → load tools → test `open_demo_pack` → configure a real merchant before validating `propose_pack_purchase`. Complete the required terms and Submit Project yourself; uploading alone does not enter the hackathon.

The hosted plugin cannot deliver executable custom UI. The Next.js app is a standalone companion demo with browser-local persistence.

## Browser companion

The browser is fully usable in demo mode. Its local $10/day check is only a simulation, not a production security policy.

For an independently hosted live merchant, set `NEXT_PUBLIC_MERCHANT_URL` or enter its endpoint in Settings. An authenticated host may supply `window.veyraPaybox.payX402({challenge,accepted})`, returning `{paymentSignature}`. **This is Veyra's adapter interface, not an official PayBox injected global.** The host must authorize through PayBox and support x402 v2. Never expose Node SDK keys or signing keys in a static bundle.

The merchant must expose `PAYMENT-REQUIRED` in its CORS response and accept `PAYMENT-SIGNATURE` and `X-Request-Id`. The latter binds an idempotent payment attempt. The challenge must match exact Base USDC price, network, asset and resource URL. On success it must return:

```json
{
  "settled": true,
  "transaction": "0x<64 hex chars>",
  "receiptId": "merchant-receipt-id",
  "card": {
    "id": "allocated-card-id",
    "name": "Card name",
    "hp": "120",
    "rarity": "Rare Holo",
    "set": "Verified merchant inventory",
    "image": "https://merchant.example/card.png",
    "price": null,
    "currency": "USD",
    "source": "reference",
    "priceDate": null
  }
}
```

The merchant must verify payment, allocate real inventory exactly once, verify grade/custody independently, and provide redemption. This JSON is a delivery contract, not cryptographic proof. The demo does not ship a merchant, custody service, or browser PayBox OAuth flow.

## Node SDK agent

`agent/rip.ts` demonstrates the real documented `PayboxClient.useService` method for your own configured merchant. Use PayBox CLI login/connect and an authorized wallet. It prints the request snapshot; a pending result must be polled to terminal status, never treated as success. This tool is not run during builds/tests.
