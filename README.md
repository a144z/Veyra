# Veyra

**A little luck. A rare feeling.** An agent-native Pokémon collecting experience for the PayBox hackathon.

Veyra is a static Next.js app with a complete, explicitly labeled simulation: pack selection → policy check → payment handshake → foil opening → card reveal → persistent collection. No real funds, ownership, grades, vault custody, or shipping are implied by demo results.

## Run

Node 24 recommended (required for the PayBox plugin).

```sh
npm ci
npm run dev
npm run test
npm run typecheck
npm run build
```

`out/` is the static website. Serve it with any static host. `npm start` serves the exported app with `serve`.

## Product

- Three original foil packs: First light ($2), Afterglow ($5), Fireline ($10).
- Agent / manual modes, $10 daily demo allowance, $25 demo balance.
- Cross-tab purchase locking where Web Locks is supported; repeat-click guard and receipt deduplication.
- Public Pokémon TCG metadata with timeout and bundled offline card images.
- Raw card market references preserve USD / EUR and source dates. Never presented as graded valuations.
- Responsive interface, keyboard-accessible dialogs, reduced-motion support, archive export.
- Real live-payment integration boundary and Node PayBox agent: see [integration guide](docs/INTEGRATION.md).
- 33-second Remotion product film using the supplied audio and shared product components.

## Honest integration status

The official `@paybox-sh/sdk` is a **Node SDK**. `window.paybox.requestPayment(challenge)` from the initial specification is not a documented browser method. It is not used here. The static app cannot securely allocate physical inventory, enforce a server-side agent policy, prove grade, or ship an item. Those functions require an independently operated merchant and real PayBox authorization. There is no hidden fake-success fallback in live mode.

Pokémon, PSA, Courtyard and PayBox marks belong to their owners. This is an independent hackathon concept. The slab is an explicitly labeled grade visualization, not a certificate.

## Hackathon upload

Upload **`dist/plugin.mjs`**. The primary deliverable is a native PayBox plugin, not the companion website. See [portal fields and setup](docs/INTEGRATION.md).

## Product film

```sh
npm run audio:analyze # Python: numpy + scipy; FFmpeg required
npm run video:studio
npm run video:render
```

The exact 33-second master lives at `public/soundtrack.m4a`. Film: 1920 × 1080, 30 fps, 990 frames. Analysis envelopes and the fitted 96 BPM beat grid are committed, so rendering does not need Python. GitHub Actions can render the film and visual QA frames on a machine that supports Chrome's local render server.

The rendered film is included at [releases/veyra-film.mp4](releases/veyra-film.mp4). Upload the root [dist/plugin.mjs](dist/plugin.mjs) file to PayBox; the video and source files are separate deliverables.
