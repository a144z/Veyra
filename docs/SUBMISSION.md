# Veyra — submission card

**Project name:** Veyra

**What does your project do?**

Veyra is an agent-native Pokémon collecting plugin. Browse packs, inspect card metadata, try free demo reveals, and propose capped USDC x402 purchases through PayBox. Clear budgets and honest receipts turn agent payments into a delightful collecting experience.

**Upload:** `dist/plugin.mjs` (399,223 bytes; 4 tools; official starter 1.0.2).

**SHA-256:** `fa1b4d22e02b56da84c0a32e234425dd27cd3a77f3dbde6741d4c0af182829ce`

## One-minute judging walkthrough

1. Ask your connected agent: “Discover my Veyra plugin and show the available packs.” It must discover the actual plugin ID and tool IDs through PayBox, not guess them.
2. Run `list_packs` with `{}`. Explain the three fixed USDC tiers.
3. Run `open_demo_pack` with `{"pack":"holo","seed":0}`. Point out the explicitly labeled simulation and Charizard metadata.
4. Run `inspect_card` with `{"cardId":"base1-4"}` to demonstrate live catalog lookup and currency/source-aware pricing, with an honest offline fallback.
5. If you have a real pack merchant configured, call `propose_pack_purchase` with `{"pack":"holo","chain":"eip155:8453"}`. Show the capped native PayBox proposal. Approval and actual merchant delivery require that live setup; never describe a proposal as a settled purchase.
6. Show the companion app's pack selection, agent policy, animated opening and local collection, then the 33-second film.

## Hosted setup

Network hostname `api.pokemontcg.io` enables live metadata. No secrets needed for demo tools. The real merchant's exact hostname plus non-sensitive `VEYRA_MERCHANT_URL` are required only for live proposals. Configure an optional Pokémon API key as a host-scoped `X-Api-Key` brokered header, not a source-code value.

Upload alone does not submit the project. Run hosted checks, test tools, review the hackathon terms, and choose Submit Project in the portal. Local tests do not prove hosted execution, payment settlement, inventory, grade, or custody.
