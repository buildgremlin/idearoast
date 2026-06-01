# Model Adapter First Contribution

This guide describes a high-leverage first contribution path for IdeaRoast.

It is not a restriction. Contributors can fork, modify, experiment, and rebuild any part of the project. The point is to explain which contribution path is most likely to improve IdeaRoast's actual reasoning quality.

## Why This Matters

IdeaRoast is currently a v0 local-first demo.

The local fallback lets the project run without an API key. That is important for safety, portability, and public demos. A contributor can clone the project, start it locally, and see the product shape without paying for a model call.

But if IdeaRoast is going to become more useful for real, messy product ideas, the most effective upgrade path is usually a reliable server-side model adapter.

The goal is not to generate a pleasant answer. The goal is to produce a structured route result that follows the Little Walker packet contract.

Good model output should help the Little Walker carry an idea through reality, expose where it stumbles, shrink the path, and bring back the smallest useful next action.

## What Contributors Can Change

Contributors can fork, modify, or replace any part of the project, including:

- UI
- Route Board
- runtime code
- validator logic
- examples
- docs
- model experiments

This guide is not a restriction.

It is a suggested high-leverage path for contributors who want to improve the product's actual reasoning quality.

## The High-Leverage Path

1. Keep provider keys server-side.
2. Add or improve a provider adapter.
3. Ask the provider to produce a Little Walker packet.
4. Normalize the output.
5. Validate it.
6. Fall back safely when the model output is missing, malformed, too report-like, unsafe, or off-contract.
7. Improve examples and validator rules based on real failure cases.

The important part is the loop: model output should be tested against concrete product cases, rejected when it drifts into generic advice, and improved through examples and validation.

## Minimal Adapter Shape

This is pseudocode only. It does not connect a real provider.

See `../examples/provider-adapter.contract.example.mjs` for the minimal adapter contract shape. Read this as a contract shape, not as a production provider implementation.

```js
async function runProviderLittleWalkerPacket({
  input,
  localPacket,
  apiKey,
  model,
  baseUrl,
  timeoutMs
}) {
  // 1. Read provider credentials from server-side env only.
  // 2. Call the provider from the local server, never the browser.
  // 3. Parse the model response.
  // 4. Normalize it into the Little Walker packet contract.
  // 5. Run validator.
  // 6. Return the valid packet, or return a fallback reason.
}
```

The browser UI should not know the provider key. The browser should only receive validated, safe output or a fallback result.

## What Good Output Means

A Little Walker packet should not read like a normal AI report.

It should feel more like:

- a route event
- a concrete stumble
- a broken assumption
- a smaller next action
- a handoff that a builder can act on

For example, a weak output says:

> Validate market demand and build an MVP.

A stronger Little Walker-style output says:

> The walker tried to sell the full dashboard, but the first user only cared about exporting one clean checklist. The route shrinks to one exportable checklist and one reply test.

The second version contains a scene, a reality hit, a route change, and a smaller next action.

## What This Is Not

This is not:

- a provider marketplace
- a hosted API service
- a user system
- a database task
- a platform automation task
- a reason to put API keys in frontend code

Provider adapters should preserve IdeaRoast's local-first shape and fallback behavior.
