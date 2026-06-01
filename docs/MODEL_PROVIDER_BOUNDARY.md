# Model Provider Boundary

IdeaRoast is local-first. The default public version works without any model API key.

## Current Boundary

- The browser UI must never contain, read, or assemble provider API keys.
- Provider keys may only be read on the local server side from `process.env`.
- If no provider key is configured, local mock / fallback behavior is the default safe path.
- DeepSeek support is an optional adapter for local development preview, not the product identity.
- The public demo must not include a hosted, shared, or bundled API key.

## Optional DeepSeek Adapter

The current adapter reads:

```env
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_SHADOW_MODEL=deepseek-v4-flash
```

Use `.env.example` as a template if you want live model preview locally. Keep the real `.env` file out of git.

## Future Provider Adapters

Future GPT, Gemini, Claude, or other providers can be added as server-side adapters behind the same boundary. This document is only a reserved direction; it does not introduce a provider marketplace, account system, database, or frontend key handling.

Before adding a new provider, read `MODEL_ADAPTER_FIRST_CONTRIBUTION.md`. The goal is not only to call a model, but to return a validated Little Walker packet while keeping provider keys server-side.
