# Documentation

[← Project overview](../README.md)

Veyra has three independently runnable parts: the static collecting app, the native PayBox plugin, and the Remotion product film. Start with the guide for the part you are working on.

| Guide | Read this when you want to… |
| --- | --- |
| [Architecture](ARCHITECTURE.md) | Understand the runtime boundaries and data flow |
| [Plugin setup](PLUGIN_SETUP.md) | Portal settings, empty-list troubleshooting, and real-purchase readiness |
| [Integration](INTEGRATION.md) | Configure a real merchant or an authenticated payment host |
| [Submission](SUBMISSION.md) | Upload and test the PayBox plugin |
| [Brand](BRAND.md) | Use the identity or rebuild the vector exports |
| [Validation](VALIDATION.md) | Reproduce checks and understand verification limits |
| [Audio analysis](audio-analysis.md) | Inspect the soundtrack timing and animation envelopes |

## Common tasks

| Task | Command from the repository root |
| --- | --- |
| Start the collecting app | `npm run dev` |
| Run all app checks | `npm run check` |
| Verify the plugin | `npm run plugin:test` |
| Copy the verified upload bundle | `node scripts/publish-plugin.mjs` |
| Open the film in Remotion Studio | `npm run video:studio` |
| Render the film | `npm run video:render` |

Use pnpm 11.11.0 for plugin commands. Checks and rendering are local processes; the repository contains no hosted workflow configuration.
