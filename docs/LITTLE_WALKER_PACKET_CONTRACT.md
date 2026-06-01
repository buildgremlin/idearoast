# Little Walker Packet Contract

更新时间：2026-05-28

这份合同定义未来 server-side model provider adapter 必须输出的“小人试走事件 packet”。它不是新的 UI 结构，也不接管当前本地 mock；它只规定以后“小人的脑子”能把什么交给 IdeaRoast。

Provider 边界：DeepSeek 目前只是可选 adapter，不是产品身份；没有 API key 时必须默认使用 local mock / fallback；前端不得读取、拼接或接收任何 provider key。

目标很窄：

- 输出小人试走事件，不输出 AI 顾问报告。
- 让 5 步形成连续路线变形，不变成 5 条独立建议。
- 让非法 packet 可以被 validator 拦下，然后 fallback 到本地 mock。

## 顶层结构

```js
{
  originalInput: "用户原始输入",
  doorway: {
    status: "can_run | ask_one_question | scope_too_large | reality_broken | boundary_stop",
    speakerLine: "门口小人说的一句话",
    reason: "为什么能跑 / 为什么先停",
    rewriteOptions: [
      { title: "入口选项", body: "一句话说明" }
    ]
  },
  walk: {
    steps: [
      {
        stepNumber: 1,
        sceneLine: "本轮发生了什么，必须像一幕事情，不是标题",
        currentSurvivingRoute: "当前幸存路线",
        tinyAction: "小人这一轮真的尝试做什么",
        realityHit: "现实撞到了什么",
        burden: {
          time: "低 | 中 | 高",
          money: "低 | 中 | 高",
          mental: "低 | 中 | 高",
          trust: "低 | 中 | 高",
          skill: "低 | 中 | 高",
          human: "低 | 中 | 高"
        },
        routeChange: {
          from: "本轮开始时的路线",
          to: "本轮后留下的路线",
          why: "路线为什么这样变"
        },
        decision: "continue | mutate | branch | stop",
        nextCarry: "小人带着哪个版本继续走"
      }
    ]
  },
  result: {
    survivor: "小人带回来的幸存版本",
    whySurvived: "为什么它活下来",
    nextTinyAction: "现在最小试走动作",
    droppedHeavyRoute: ["被放下的重路线"],
    sideBranch: ["旁边出现的轻分叉"],
    routeTrace: [
      "原始想法",
      "第 1 步后路线",
      "第 2 步后路线",
      "第 3 步后路线",
      "第 4 步后路线",
      "最终幸存版本"
    ]
  }
}
```

## Doorway 规则

`doorway.status` 只允许：

- `can_run`
- `ask_one_question`
- `scope_too_large`
- `reality_broken`
- `boundary_stop`

如果 `status` 是 `can_run`，`walk.steps` 必须正好 5 步。

如果 `status` 不是 `can_run`，packet 必须停在门口，`walk.steps` 必须为空或不存在；`rewriteOptions` 应该给 2-4 个现实入口选项，除非是边界直接停。

### AI Doorway Judge v1 前置协议

Doorway Judge 的完整前置协议见 `docs/AI_DOORWAY_JUDGE_V1_PROTOCOL.md`。核心原则：

- 底层模型决定判断上限；IdeaRoast 决定表达方式、结构约束、validator、fallback 和体验表达。
- Model adapter raw pass 不等于 product-ready。
- GPT 输出也必须经过结构约束。
- 所有模型输出必须经过 validator；失败时必须 fallback。
- developer 区必须能看出模型来源以及 raw / normalized / failed / warning 状态。
- 不要为了迁就弱模型，把产品变成一堆规则补丁。

Doorway 语气按 `status` 分层：

- `can_run`：接住用户，轻松但明确。
- `ask_one_question`：温和，不嘲讽。
- `scope_too_large`：可以吐槽，但不要羞辱用户。
- `reality_broken`：可以更毒舌一点，但要解释为什么脚下没路。
- `boundary_stop`：严肃、清楚，不开玩笑。

Doorway 文案仍禁止报告腔，例如：`综合分析`、`建议你`、`可行性较强`、`根据以上分析`、`你需要进一步明确`。

## Walk Step 规则

每一步必须是“小人试走事件”，不是栏目报告。必填字段：

- `stepNumber`
- `sceneLine`
- `currentSurvivingRoute`
- `tinyAction`
- `realityHit`
- `burden`
- `routeChange.from`
- `routeChange.to`
- `routeChange.why`
- `decision`
- `nextCarry`

连续性要求：

- 第 1 步的 `routeChange.from` 必须等于第 1 步的 `currentSurvivingRoute`。
- 第 2 步的 `currentSurvivingRoute` 和 `routeChange.from` 必须等于第 1 步的 `routeChange.to`。
- 后续步骤同理。
- `nextCarry` 必须等于本步 `routeChange.to`。
- 第 5 步的 `routeChange.to` 必须等于 `result.survivor`。

`sceneLine` 必须像一幕事件，并带有因果桥。它不能只写“小人开始做 A”，而要写清：

- 为什么这一轮要做这个动作。
- 上一轮或当前路线撞到了什么。
- 所以这一轮怎么把路线变小、变清楚或留下。

合格的 `sceneLine` 通常会自然出现“因为 / 所以 / 于是 / 发现 / 撞到 / 只先 / 改成 / 缩成 / 留下”这类连接词。

### Assumption Break / 假设破裂

`sceneLine` 不只要顺，还要暴露假设破裂。IdeaRoast 不负责给用户顺滑答案，也不是故意找茬，而是让用户看到：小人真的按这个想法走一步时，哪个默认以为会被现实打破。

每个 `sceneLine` 必须能看出四件事：

- 小人原本以为什么。
- 小人真的试了哪个具体动作。
- 现实怎样打破这个以为。
- 路线因此怎么缩小、变形、换入口或停下。

推荐句式是：

> 小人以为 X，所以试了 Y；结果现实里的 Z 让这个假设破了，于是它把路线改成 W。

不要机械套同一句模板，但必须能看出这四件事。

不要只写抽象判断，例如“太泛 / 太重 / 用户不信 / 成本高”。要写出现实细节、人的反应或操作失败，例如：

- 用户看完还是不知道今晚打开哪个工具。
- 观众前 3 秒划走。
- 创作者第一反应是“凭什么”。
- 模板看起来完整，但用户不知道复制到哪里用。
- 录屏讲了 90 秒，自己重看都想关。

对 AI 工具 / 小产品类 idea，前 1-2 步优先使用 no-code / fake-door / manual-first / prompt-first / fixed-input demo。第 1 步不要突兀进入写函数、写 API、搭数据库、完整后端、用户登录、权限系统或复杂脚本，除非语义明确是“先不用完整系统，只写死一个本地假 demo”。

推荐试走顺序：

1. 手动模拟核心动作，例如用 ChatGPT / Codex / 手写模板跑一次。
2. 固定输入和输出，例如只支持一个输入样例和一个输出格式。
3. 再考虑半自动化，例如固定 prompt、固定规则、固定脚本。
4. 第 4-5 步才考虑本地 demo、API 或简单脚本。

内容账号类 idea 要保留“拍摄 / 发布 / 反馈 / 改短 / 改选题”的事件感。如果撞到问题，下一步必须明确路线怎么变小，例如“完整教程太长，所以小人改成 45 秒前后对比”。

内容账号类还要至少部分碰到真实内容摩擦，例如选题、标题、开头 3 秒、观众留存、完播、录屏、剪辑、字幕、封面、评论、播放或划走。

AI 工具 / 小产品类还要至少部分碰到真实用户反应或使用摩擦，例如看不懂、不知道下一步、不会复制、不知道用在哪、凭什么、不信、输出太泛、正确废话、仍然不知道今晚做什么、手动能用但自动化太早。

## Result 规则

结果第一眼只能收束成三件事：

1. 小人带回来的幸存版本：`result.survivor`
2. 为什么它活下来：`result.whySurvived`
3. 现在最小试走动作：`result.nextTinyAction`

`droppedHeavyRoute` 和 `sideBranch` 是辅助信息，可以是 1-4 条短句。`routeTrace` 必须从 `originalInput` 走到 `result.survivor`。

`result.nextTinyAction` 对工具类 idea 应继续保持 demo-first：优先是用 ChatGPT / Codex 手动跑一次、写死一个输入、写死一个输出、做一张模板卡、做一个假按钮 / 假页面或跑通本地固定 demo，而不是默认“找 3 个用户调研”。

## Readable Summary / 用户可读摘要

Little Walker Packet 可以继续保留完整 5 步，但普通用户第一眼不应该读完整长日志。runtime 可以从 packet 派生 `readableSummary`，不需要改变 packet 顶层结构。

派生结构：

```js
{
  comebackLine: "我替你试了一圈，真正先摔的是哪里。",
  stumbleCards: [
    {
      title: "正确废话",
      youAssumed: "你原本可能以为...",
      realityBroke: "现实打脸...",
      soShrinkTo: "所以先改成..."
    }
  ],
  tonightActionCard: {
    open: "打开什么工具",
    input: "输入什么",
    output: "产出什么",
    passCriteria: "怎么判断这一步过不过"
  }
}
```

规则：

- `comebackLine` 只写 1-2 句。
- `stumbleCards` 只展示 3 条最关键假设破裂，不展示完整 5 步。
- 摔跤卡语言使用“你以为 / 现实打脸 / 所以先改成”，不要默认写“小人以为”。
- `readableSummary` 必须独立可读。用户只看这一层，就应该知道小人拿什么样例去试、哪个默认假设被现实打脸、路线具体缩成什么。
- `readableSummary` 不允许硬裁断字段。不能出现“只要把 AI 工具的操作步骤讲清楚，观众”这类没有收尾的半句话。
- `stumbleCards[].soShrinkTo` 必须写出具体产物或动作，例如 4 行验证动作卡、20-45 秒视频草稿、半自动判断表、固定 prompt 或本地 demo。
- `stumbleCards[].soShrinkTo` 不能只写“更具体 / 先做最小版本 / 输出一条具体动作 / 验证用户需求 / 做一个简单 MVP”。
- `tonightActionCard` 必须有行动抓手：打开、输入、产出、过关标准。
- `tonightActionCard` 不能只写“做一个 demo / 做一个验证动作 / 做一个最小版本”。
- `tonightActionCard` 必须 example-first：输入里给一个可复制的真实例子，产出里写清卡片、表格、草稿、脚本或 demo 的具体形状，过关标准写清怎么判断能不能开始下一步。
- 完整 5 步和完整 JSON 可以继续折叠展示。

## Developer-only Stage Preview

可选 model adapter 的 Little Walker Packet 可以通过开发者开关驱动 5 步舞台预览，但不能默认接管普通用户主页面。

规则：

- 默认关闭；关闭时主页面仍走本地 mock。
- 本地 gate 已停住的输入不调用 model adapter。
- 只有本地 gate 判定 `ready / usable` 的输入才允许请求 packet。
- 只有 `packet_valid` 后才允许把 packet 映射到现有 5 步舞台结构。
- `packet_invalid`、请求失败或映射失败时，页面继续使用 local mock，并在开发者区显示失败原因。
- 完整 JSON 与 5 步试走日志继续折叠，不默认展开。
- 不改 `applyAgentStateUpdate(update, options = {})`；预览只把 packet step 转成现有 `simulation.frictionBites` 形状，复用原 `playRound()`。

开发者区必须明确显示当前模式：

- `local mock`
- `Model adapter raw pass`
- `Model adapter normalized pass`
- `Model adapter fallback pass`
- `Model adapter failed`

`normalized_pass` 和 `fallback_pass` 必须带 `normalizationChanges / fallbackChanges`，避免 normalizer 或 fallback 把坏输出“洗白”。

## 禁止项

Packet 内任何可见文本都不能出现报告腔：

- 综合分析
- 建议你
- 可行性较强
- 可行性较高
- 风险较高
- 根据以上分析
- 市场前景
- 商业模式完整分析

Packet 不能输出 markdown 长文，不要出现代码块、标题式 markdown 或长篇分点报告。

Packet 和派生摘要不能默认建议高风险平台自动化：

- 小红书爬虫
- 抖音爬虫
- B 站爬虫
- 知乎爬虫
- 自动抓取平台数据
- 绕过平台限制
- 未授权采集用户内容

涉及平台内容时，优先写：

- 手动观察 10 条公开内容。
- 用户自己提供样本。
- 手动记录标题、点赞、评论区高频词。
- 明确合规的官方 API。

Packet 不能过泛。尤其禁止把结果收束成：

- 做一个简单 MVP
- 做一个最小版本
- 验证核心需求
- 做一个小工具
- 找几个目标用户聊聊

除非这些话被明确锚定到 `originalInput` 的具体对象和动作，否则 validator 必须判失败。

## 输入锚定要求

所有内容必须贴住 `originalInput` 的具体对象和动作。

- `originalInput` 是“语音控制电脑打开软件的小工具”时，结果必须保留语音 / 电脑 / 打开软件这条入口，不能泛化成“做一个简单 MVP”。
- `originalInput` 是“教 Excel 的短视频账号”时，结果必须保留 Excel / 短视频 / 教学场景。
- `originalInput` 是“README 自动整理成使用教程”时，结果必须保留 README / 使用教程。

## Fallback 规则

未来 runtime 输出 packet 后，必须先过 validator。

- validator 通过：可以作为候选 packet 进入后续对比或接管实验。
- validator 失败：必须 fallback 到本地 mock，不允许污染主页面。
- API 失败、JSON 失败、字段缺失、报告腔、路线不连续、结果过泛，都算失败。
