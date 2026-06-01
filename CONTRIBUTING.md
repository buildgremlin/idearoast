# Contributing to IdeaRoast

Thanks for taking a look at IdeaRoast.

IdeaRoast is a v0 local-first prototype. Contributions are welcome, especially if they help other builders run it locally, extend model adapters safely, or improve the Little Walker route quality.

## Project Direction

IdeaRoast is:

- A local-first pixel sandbox for stress-testing small product ideas.
- A constrained idea-routing interface.
- A place to explore direct build tasks, five-step reality walks, and small next actions.

IdeaRoast is not:

- A generic chatbot wrapper.
- A hosted SaaS product.
- A business, legal, financial, or market advice engine.
- A system that promises an idea will succeed.

## Good Contributions

Good first areas:

- Documentation fixes.
- Clearer setup instructions.
- Better adapter examples.
- Better Little Walker packet validation.
- Better issue reproduction cases.
- Small UI fixes that preserve the current product shape.
- More concrete examples of user reaction, friction, and route mutation.

## Safety and Provider Keys

Do not commit secrets.

Provider API keys must stay server-side. Do not put API keys in:

- `index.html`
- `app.js`
- browser storage
- screenshots
- committed `.env` files
- public issue comments

Use `.env.example` as a template only. Real `.env` files must remain local and ignored by git.

## Product Boundaries

Please avoid changes that turn IdeaRoast into:

- A generic AI report generator.
- A provider marketplace.
- A hosted shared-key model service.
- A database-backed user product.
- A real auto-upload or auto-publishing tool.
- A high-stakes advice tool.

If you propose one of those directions, open a discussion first and explain why it should belong in this project.

## Before Opening a Pull Request

Please check:

- The app still works without an API key.
- Browser UI does not receive provider keys.
- `.env.example` is safe to commit.
- Real `.env` files are ignored.
- The README still describes the project as a v0 prototype.
- The change does not remove the local fallback path.

If you touch JavaScript files, run syntax checks where possible:

```bash
node --check app.js
node --check tools/local-static-server.mjs
```

## Issue Reports

When reporting a bug or UX problem, please include:

- What you typed.
- Which route was chosen: `direct_build`, `try_walk`, `ask_one_question`, or `hard_stop`.
- What you expected.
- What actually happened.
- Whether you used local fallback or a model provider.

