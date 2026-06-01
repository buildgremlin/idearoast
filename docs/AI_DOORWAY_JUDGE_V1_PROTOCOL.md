# AI Doorway Judge v1 Protocol

This protocol is the precondition for any AI Doorway Judge v1 work.

It does not change Route Board, the 5-step Little Walker flow, result cards, gate rules, or local fallback behavior.

## Model Capability Boundary

IdeaRoast may use DeepSeek or another model underneath as an optional server-side provider adapter.

Provider keys must stay server-side in `process.env`. The browser UI must never contain, read, or assemble provider API keys. Without a configured key, IdeaRoast must keep running through local mock / fallback behavior.

The model decides the ceiling of judgment quality.
IdeaRoast decides the expression, trial-walk structure, validator, fallback, and user experience constraints.

Do not assume IdeaRoast can make a weak model smart by piling on rule patches.

Required principles:

- Model adapter raw pass is not product-ready.
- GPT output must also pass structure constraints.
- Every model output must go through a validator.
- Failed model output must fall back to local behavior.
- Developer preview must show model source and state: raw / normalized / failed / warning.
- Do not turn the product into a large rule-patch pile to compensate for weak model judgment.

## Doorway Tone Protocol

The Doorway Judge still returns stable JSON. The front-facing line can sound human, but it must not become free-form prose.

Allowed verdicts:

- `can_run`
- `ask_one_question`
- `scope_too_large`
- `reality_broken`
- `boundary_stop`

### `can_run`

Tone: catch the user's idea, light but clear.

Good:

- `小人能背着它先走一圈，但会先把自动上传压成手动发布包。`
- `这个能先走，小人会先把完整系统压成一个固定输入的小 demo。`

### `ask_one_question`

Tone: warm, not mocking.

Use when the user is abstract or has not named the object, audience, or scene.

Good:

- `小人还不知道往哪走。你先告诉它：这个工具具体帮谁做哪件事？`

Forbidden here:

- `你想屁吃`
- `做梦呢`
- harsh jokes that shame the user

### `scope_too_large`

Tone: can lightly tease, but do not humiliate the user.

Use for complete Jarvis, complete Iron Man, all-purpose robot, or other huge visions without a first runnable entry.

Good:

- `小人背了一下，差点被完整 Jarvis 压扁。先拆一个能跑的小入口。`

### `reality_broken`

Tone: can be sharper, but must explain that there is no ground under the idea.

Use for physical impossibilities such as an app making a phone float, time machines, perpetual motion, real anti-gravity UFOs.

Good:

- `小人刚出门，物理定律把门锁了。这不是难，是脚下没路。`
- `小人看了一眼：你这不是产品想法，你这是科幻片开机。`

Strong jokes such as `你想屁吃？` are only allowed as rare Easter eggs for extreme reality breaks. They must not be default output.

### `boundary_stop`

Tone: serious, clear, and restrained.

Use for illegal behavior, privacy invasion, employee surveillance, automatic trading, unauthorized scraping, platform restriction bypass, and high-risk minors scenarios.

Good:

- `这个不能当普通项目试走。这里涉及授权、隐私或合规边界，先停。`

Forbidden here:

- jokes
- ridicule
- playful toxicity

## JSON Requirements

The Doorway Judge must output structured JSON, not a report.

Required fields:

```json
{
  "verdict": "can_run | ask_one_question | scope_too_large | reality_broken | boundary_stop",
  "doorwayLine": "一句给前台用的小人话",
  "reason": "一句人话原因",
  "question": "停在门口时的一句补问；can_run 可为空",
  "rewriteOptions": [
    { "title": "可选入口 1", "body": "一句话" },
    { "title": "可选入口 2", "body": "一句话" }
  ]
}
```

Avoid report tone:

- `综合分析`
- `建议你`
- `可行性较强`
- `根据以上分析`
- `你需要进一步明确`

Prefer doorway language:

- `小人能先背着它走一圈`
- `小人还不知道往哪走`
- `小人背不动完整版本`
- `这不是难，是脚下没路`
- `这里有边界，先停`

## Shadow Audit v1

Shadow Audit does not let AI Doorway Judge own the normal user doorway.

It only compares a structured AI judgment against the current local gate and an expected verdict set.

Audit output shape:

```json
{
  "verdict": "can_run | ask_one_question | scope_too_large | reality_broken | boundary_stop",
  "confidence": "low | medium | high",
  "doorwayLine": "一句门口小人话",
  "firstRunnableArtifact": "can_run 时的第一版可运行交付物",
  "riskFlags": ["platform_automation"],
  "safetyShrink": "有自动上传 / 自动发布 / 平台数据 / 采集风险时的收缩方式",
  "oneQuestion": "ask_one_question 时只问一句",
  "reason": "一句短原因"
}
```

Validator requirements:

- `verdict` must be one of the five allowed verdicts.
- `confidence` must be `low`, `medium`, or `high`.
- `can_run` must include `firstRunnableArtifact`.
- Inputs involving automatic upload, automatic publish, platform data, scraping, collection, or similar risk actions must include `safetyShrink`.
- `ask_one_question` must include `oneQuestion`.
- `boundary_stop` must not include `firstRunnableArtifact` or dangerous execution steps.
- `doorwayLine` and `reason` must avoid report tone.
- `reason` must stay short and must not become long-form analysis.

Audit reports must show:

- local gate verdict
- AI judge verdict
- expected verdict
- pass / fail
- failure reason
- riskFlags
- safetyShrink

## Guarded Doorway Integration MVP

The first real doorway integration must stay guarded.

Required order:

```text
local hard boundary / hard reality first
-> AI Judge for ordinary inputs
-> validator
-> use AI verdict only if valid
-> fallback to local gate on any failure
```

Hard local stops are not sent to AI for reverse approval:

- clear illegal behavior
- privacy surveillance
- financial auto-trading
- high-risk minor scenarios
- platform restriction bypass
- clear physical reality breaks such as phone floating apps, time machines, perpetual motion

AI Judge may judge ordinary product inputs:

- small products
- AI tools
- content accounts
- content workflows
- open-source projects
- indie developer ideas

Failure modes must fallback to local gate:

- request failure
- timeout
- invalid JSON
- empty content
- validator failure
- report prose
- invalid verdict
- dangerous implementation detail

## Freeze Boundaries

Do not use Doorway Judge v1 work as an excuse to change:

- Route Board visuals
- 5-step Little Walker flow
- result card structure
- Any provider adapter default ownership of the normal user page
- multi-agent behavior
- platform APIs
- real upload / publishing / scraping features
- `applyAgentStateUpdate(update, options = {})`
