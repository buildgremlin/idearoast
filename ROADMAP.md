# IdeaRoast Roadmap

IdeaRoast is a v0 open-source prototype. The goal is not to become a heavy SaaS platform immediately. The goal is to make a small, local-first idea preflight sandbox that other builders can understand, run, and extend.

## v0: Public Prototype

Current status:

- Local-first static demo.
- Direct build vs. try-walk routing.
- Five-step Little Walker route board.
- Local fallback works without an API key.
- Optional server-side provider adapter experiments.
- API key boundary documented.
- MIT licensed public repository.

## v0.1: Contributor Handoff

The next small milestone is to make the project easier for other builders to pick up.

Planned work:

- Keep README clear about v0 status and local-first behavior.
- Document how to contribute safely.
- Document how to add a server-side model adapter.
- Add issue templates for bugs, model adapters, and UX feedback.
- Keep the core product boundary clear: IdeaRoast is not a generic chatbot wrapper.

Done when:

- A new contributor can understand what the project is in 5 minutes.
- A developer can find the adapter entry points without reading the whole codebase.
- Feedback arrives in a structured form instead of vague "it does not work" reports.

## v0.2: Adapter Exploration

The next technical direction is a cleaner provider adapter contract.

Possible work:

- Add a mock provider adapter example.
- Define a small adapter interface for doorway judging and Little Walker packets.
- Make it easier to test OpenAI, Claude, Gemini, local models, or other providers server-side.
- Keep all provider keys outside the browser UI.

Non-goals:

- No provider marketplace.
- No hosted shared API key.
- No model lock-in.
- No browser-side API keys.

## v0.3: Little Walker Quality

The core product quality issue is not adding more features. It is making the route feel less like generated advice and more like a small character actually carrying the idea through reality.

Possible work:

- Improve `sceneLine` quality.
- Add stronger examples of concrete user reaction and usage friction.
- Reduce report-like language.
- Improve validator guidance without turning the product into a rule pile.
- Keep the "little walker brings back the smallest useful next action" feeling.

## Not Now

These are intentionally out of scope for the near future:

- User accounts.
- Database-backed history.
- Hosted shared model service.
- Platform data scraping.
- Real auto-upload or auto-publishing.
- Multi-agent world simulation.
- Provider marketplace.
- Turning IdeaRoast into a generic business report generator.

