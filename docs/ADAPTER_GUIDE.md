# Model Adapter Guide

IdeaRoast is local-first. The browser UI can run without any model key. Optional model experiments should stay behind the local server boundary.

This guide explains where to start if you want to connect your own model provider.

## Rule One: Keep Keys Server-Side

Provider keys must never be exposed to:

- `index.html`
- `app.js`
- browser storage
- client-side logs
- committed files

Use `.env.example` as a template and keep your real values in your local environment or private tooling.

## Existing Entry Points

Start with these files:

- `tools/local-static-server.mjs`: local server, endpoint routing, provider boundary.
- `tools/ai-doorway-judge-runtime.mjs`: optional doorway judge runtime.
- `tools/little-walker-runtime.mjs`: optional Little Walker packet runtime.
- `data/little-walker-packet.schema.js`: packet shape, enums, validation helpers.
- `tools/validate-little-walker-packet.mjs`: validator entry point.

## Doorway Judge

The doorway judge decides whether an input can start.

It should return structured data, not free-form advice. The important route modes are:

- `direct_build`: clear small webpages, local tools, scripts, or demos.
- `try_walk`: product or workflow ideas that need a five-step reality walk.
- `ask_one_question`: vague inputs that need one clarifying question.
- `hard_stop`: unsafe, impossible, or misleading inputs.

The doorway judge must not generate the full five-step route board.

## Little Walker Packet

The Little Walker packet is the five-step route. It should feel like a small character carrying the idea through reality, not like a business report.

Each step should preserve:

- What the current surviving route is.
- What happened in this scene.
- What reality pushed back on.
- What changed in the route.
- What gets carried into the next step.

See `docs/LITTLE_WALKER_PACKET_CONTRACT.md` for the stricter packet contract.

## Adapter Pattern

A simple adapter should:

1. Read the provider key from `process.env`.
2. Return a safe fallback when no key is configured.
3. Call the provider from the local server only.
4. Parse provider output as JSON.
5. Validate the output before the browser UI uses it.
6. Return local fallback behavior when validation fails.

Do not let raw model output become the default product path without validation.

## Suggested Experiment Flow

1. Run IdeaRoast without an API key.
2. Confirm local fallback behavior works.
3. Add your provider key locally.
4. Test one doorway input.
5. Test one Little Walker packet.
6. Check validation results.
7. Compare whether the model output feels more like a route event or a generic report.

Good test inputs:

- `I want to build a local image compression tool.`
- `I want an AI tool that helps creators judge whether a topic is worth making.`
- `I want to build an AI tool.`

## Non-Goals

Do not add a hosted shared API key. Do not expose keys in the browser. Do not turn IdeaRoast into a generic provider marketplace.

