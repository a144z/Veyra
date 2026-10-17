# PayBox documentation review

[← Documentation](README.md)

Reviewed the eleven pages in PayBox's published documentation index, plus the hackathon skill and plugin developer guide, for the 1.1.0 integration audit. This coverage refers to those pages, not every external link or every operation in the separate OpenAPI contract.

| Published page | Integration finding |
| --- | --- |
| [Introduction](https://docs.paybox.sh/index) | PayBox provides scoped credential access; the plugin must not receive wallet keys |
| [Getting started](https://docs.paybox.sh/getting-started) | Wallets and grants are configured by the user in PayBox |
| [Credentials and agents](https://docs.paybox.sh/concepts/model) | Credential grants and approval modes are separate from plugin enablement |
| [Approvals](https://docs.paybox.sh/concepts/approvals) | Approval is tied to the operation; changing parameters requires a new request |
| [Request lifecycle](https://docs.paybox.sh/concepts/requests) | Submit once and poll; broadcast or signature alone is not confirmed success |
| [MCP connector](https://docs.paybox.sh/connect/mcp) | Enabled plugin tools are discovered by the connected account |
| [OAuth 2.1](https://docs.paybox.sh/connect/oauth) | Direct public clients use PKCE; there is no browser client secret |
| [MCP tools](https://docs.paybox.sh/reference/mcp-tools) | Official and unofficial plugin discovery differs; resolve current tool contracts rather than inventing IDs |
| [API and endpoints](https://docs.paybox.sh/api-reference) | Account management routes are not the public integration surface |
| [SDK and CLI](https://docs.paybox.sh/sdk-cli) | The SDK is a Node integration; advanced v2 options are not exposed by every wrapper |
| [Integration skill](https://docs.paybox.sh/skill) | Use provider/service discovery and the returned contract; do not assume a provider route exists |
| [Hackathon skill](https://developer.paybox.sh/skill.md) | Build the pinned starter and give the participant the tested `plugin.mjs` |
| [Plugin developer guide](https://developer.paybox.sh/requirements.md) | Stateless hosted tools return unsigned native proposals; discovery must not depend on secrets or network calls |

## Implementation changes

- Added an embedded SVG icon, server title, description, explicit tools capability, and version 1.1.0 metadata.
- Added `get_setup_status`, which works without configuration and can explicitly probe a configured merchant without paying.
- Added a direct bundle discovery report and runtime tests of all five registered tools.
- Tested native capped proposal construction for Base and Solana; no funds were signed or sent.
- Kept the official starter's supported protocol and pinned dependencies.

## Verification boundary

This repository contains a real PayBox plugin and working demo tools. A successful local tool call does not prove that the user's portal selected the latest upload, installed that version, or exposed its tools in the app. The setup guide describes how to isolate those cases.

No live card merchant or physical inventory has been provided. Veyra does not currently complete a real card purchase or physical redemption on its own. The x402 proposal path is implemented; commercial fulfillment remains an external integration.
