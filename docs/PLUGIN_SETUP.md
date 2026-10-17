# PayBox plugin setup and discovery

[← Documentation](README.md)

## What Veyra does

Veyra 1.1.0 exposes **five tools**. Discovery, setup diagnostics, and demo reveals work with no secrets, variables, wallet, or network hosts.

| Display title | Tool name | Behavior |
| --- | --- | --- |
| Discover Veyra packs | `list_packs` | Reads the three Veyra demo tiers and fixed prices |
| Inspect a Pokémon card | `inspect_card` | Fetches public metadata and raw-card price references, with three labeled offline references |
| Open a Veyra demo pack | `open_demo_pack` | Returns a reproducible preview; no payment or ownership |
| Propose a Veyra x402 pack purchase | `propose_pack_purchase` | Returns a capped native unsigned payment proposal for a configured merchant |
| Check Veyra setup | `get_setup_status` | Explains readiness, required configuration, and optional unpaid merchant probing |

The exact catalog and schemas discovered from the upload bundle are retained in [`plugin-tools.json`](plugin-tools.json). Run `npm run plugin:discover` to reproduce that report.

## Portal configuration

| Feature | Network access | Variables | Secrets |
| --- | --- | --- | --- |
| Tool discovery | None | None | None |
| Setup status, default call | None | None | None |
| Demo pack opening | None | None | None |
| Live public card lookup | `api.pokemontcg.io` | None | None required |
| Live payment proposal and merchant validation | Real merchant's exact hostname | `VEYRA_MERCHANT_URL` = real HTTPS pack endpoint | None required by Veyra |

An optional Pokémon API key can be configured as a host-scoped brokered `X-Api-Key` header for `api.pokemontcg.io`. Do not add a PayBox signing key or a wallet private key to this plugin.

A normal shopping homepage is not an x402 API. Setting `VEYRA_MERCHANT_URL` to `https://courtyard.io` does not enable Courtyard purchases. This repository does not include a contracted Courtyard seller integration or real vaulted inventory.

## An empty “What it can do” list

An empty display is not expected from the current bundle. The bundle returns five tools over the official hosted protocol, without reading any variables or making network calls at discovery time. A missing allowlist cannot explain an empty **local** catalog.

To verify the exact uploaded and installed version:

1. Upload the current root `dist/plugin.mjs`, not a source file or an older download.
2. Run the portal's hosted checks against that upload.
3. Open **Test → Load tools**. Confirm five names matching the table above.
4. Test `get_setup_status` with `{}`. No configuration is needed for this call.
5. Complete the portal submission/install flow. In the same PayBox account, enable the Veyra upload under Unofficial plugins.
6. Refresh agent discovery. Discover the actual plugin and tool IDs from PayBox; do not guess a prefixed name.

The developer guide says tool lists expire after ten minutes and should be loaded again after an upload or configuration change. Installed plugins keep their code version until updated. An older installation can therefore differ from a newly uploaded bundle.

If hosted **Load tools** also returns zero after a successful check, preserve the upload/version ID and hosted error report for PayBox support. If hosted Test lists five tools but the installed app shows an empty list, that narrows the issue to installation/version selection or app display/discovery. Local tests cannot determine which applies to an unseen account.

Do not change the hosted protocol to match the public connector protocol: the official plugin starter uses MCP `2026-07-28`; the public PayBox connector documentation separately describes its `2025-06-18` endpoint.

## Real purchase readiness

`propose_pack_purchase` can create the native PayBox x402 proposal, but a proposal is not a purchase receipt. A live purchase additionally needs:

- A real merchant endpoint that returns an eligible 402 challenge for a pack.
- Inventory or a provider integration that can allocate and deliver the purchased collectible.
- A granted, funded compatible wallet and any approval PayBox requires.
- A terminal PayBox payment result and successful merchant delivery response.

The missing piece in the supplied configuration is a real merchant, not another generic API secret. No code-only change can establish physical inventory, custody, or a commercial seller relationship.

After configuring a real merchant, optionally run:

```json
{
  "probeMerchant": true,
  "pack": "holo",
  "chain": "eip155:8453"
}
```

with `get_setup_status`. This sends one bounded unpaid GET. A matching challenge confirms only the challenge; it does not pay or prove inventory or fulfillment. For an actual purchase, submit one proposal and poll the returned PayBox request ID. Check payment and service response independently before deciding whether to retry.

## About text

Discover Pokémon pack tiers, inspect public card metadata, preview demo reveals, and propose capped USDC x402 purchases through PayBox. Live purchases require a configured merchant; payment approval and execution remain in PayBox.
