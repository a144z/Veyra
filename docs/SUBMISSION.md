# Veyra — submission card

[← Documentation](README.md)

**Project name:** Veyra

**What does your project do?**

Veyra brings Pokémon collecting to AI agents: discover packs, research cards, preview reveals, and request capped USDC purchases through PayBox’s x402 approval flow. A visual companion makes every reveal memorable while keeping demo and live activity explicit.

**Upload:** `dist/plugin.mjs` (404,330 bytes; 5 tools; version 1.1.0; official starter 1.0.2).

**SHA-256:** `777321a203504f9098069bc726f30c0e19fe973e57c814b0bd408fbe89470cfd`

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

## If the app shows no capabilities

Follow [Plugin setup and discovery](PLUGIN_SETUP.md). Compare the uploaded bundle against [the generated tool catalog](plugin-tools.json), then reload tools and verify the installed version.
