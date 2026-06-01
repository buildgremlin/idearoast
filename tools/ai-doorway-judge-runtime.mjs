const DOORWAY_JUDGE_VERDICTS = new Set([
  "can_run",
  "ask_one_question",
  "scope_too_large",
  "reality_broken",
  "boundary_stop"
]);

const ROUTE_MODES = new Set(["direct_build", "try_walk"]);
const CONFIDENCE_LEVELS = new Set(["low", "medium", "high"]);

const REPORT_TONE_PATTERNS = [
  /综合分析/,
  /建议你/,
  /可行性较强/,
  /可行性较高/,
  /根据以上分析/,
  /你需要进一步明确/
];

const RISK_ACTION_PATTERNS = [
  /自动上传/,
  /自动发布/,
  /自动发[到给]/,
  /平台数据/,
  /平台标题/,
  /标题分析/,
  /竞品分析/,
  /商业产品/,
  /商户通/,
  /会员规则/,
  /会员体系/,
  /采集/,
  /抓取/,
  /爬取/,
  /收集[^，。]*样本/,
  /公开样本/,
  /评论区/,
  /批量注册/,
  /绕过/,
  /监控/,
  /下单/,
  /交易/,
  /私信/,
  /手机号/,
  /超级玛丽|super\s*mario|mario|马里奥/i
];

const RISK_FLAGS = [
  { flag: "platform_automation", patterns: [/自动上传/, /自动发布/, /自动发[到给]/, /多平台发布/] },
  { flag: "platform_data_risk", patterns: [/平台数据/, /平台标题/, /标题分析/, /公开样本/, /评论区/, /账号数据/] },
  { flag: "data_collection", patterns: [/采集/, /抓取/, /爬取/, /收集/, /私信/, /手机号/] },
  { flag: "finance_execution", patterns: [/炒股/, /下单/, /交易/, /赚钱/] },
  { flag: "privacy_or_surveillance", patterns: [/监控/, /员工电脑/, /偷偷录音/, /隐私/] },
  { flag: "platform_abuse", patterns: [/绕过/, /批量注册/, /刷评论/, /限制/, /破解/] },
  { flag: "minor_safety", patterns: [/未成年人/, /中学生/, /小学生/, /青少年/] },
  { flag: "ip_safety", patterns: [/超级玛丽|super\s*mario|mario|马里奥/i] }
];

const HARMFUL_STEP_PATTERNS = [
  /自动炒股下单/,
  /未授权监控/,
  /监控员工电脑/,
  /绕过平台限制/,
  /未授权抓取/,
  /抓取用户数据/,
  /批量注册账号/,
  /破解付费/,
  /偷偷录音/
];

const DIRECT_BUILD_RISK_PATTERNS = [
  /自动上传/,
  /自动发布/,
  /爬虫/,
  /抓取/,
  /爬取/,
  /采集/,
  /绕过平台/,
  /自动交易/,
  /自动下单/,
  /监控/
];

const DIRECT_BUILD_IP_PATTERNS = [/超级玛丽|super\s*mario|mario|马里奥/i];
const DIRECT_BUILD_EXECUTOR_PATTERNS = [/IdeaRoast.*(生成代码|创建文件|保存文件|执行开发|运行代码)/i];

export function mapLocalGateToDoorwayVerdict(status) {
  const map = {
    ready: "can_run",
    usable: "can_run",
    needs_definition: "ask_one_question",
    scope_review: "scope_too_large",
    reality_review: "reality_broken",
    boundary_review: "boundary_stop",
    blocked: "boundary_stop"
  };
  return map[status] || "ask_one_question";
}

export function inferRiskFlags(input, rawFlags = []) {
  const text = stringifyVisibleText(input);
  const flags = new Set();
  const raw = new Set(Array.isArray(rawFlags) ? rawFlags.filter(Boolean).map(String) : []);
  RISK_FLAGS.forEach(({ flag, patterns }) => {
    const matched = patterns.some((pattern) => pattern.test(text));
    if (matched) flags.add(flag);
    if (raw.has(flag) && matched) flags.add(flag);
  });
  return [...flags];
}

export function requiresSafetyShrink(input, rawFlags = []) {
  const text = [
    stringifyVisibleText(input),
    stringifyVisibleText(rawFlags)
  ].join("\n");
  return RISK_ACTION_PATTERNS.some((pattern) => pattern.test(text));
}

export function isHardLocalDoorwayStop(localPacket = {}) {
  const status = localPacket?.clarityGate?.status || "";
  return ["blocked", "boundary_review", "reality_review"].includes(status);
}

export function validateAiDoorwayJudgeReview(rawReview, context = {}) {
  const source = rawReview?.review && typeof rawReview.review === "object" ? rawReview.review : rawReview;
  const diagnostics = [];
  const warnings = [];
  const verdict = String(source?.verdict || "").trim().toLowerCase();
  const confidence = String(source?.confidence || "medium").trim().toLowerCase();
  const doorwayLine = textOrFallback(source?.doorwayLine, "");
  let routeMode = textOrFallback(source?.routeMode, "");
  let firstRunnableArtifact = textOrFallback(source?.firstRunnableArtifact, "");
  let riskFlags = inferRiskFlags(context.input || "", source?.riskFlags);
  let safetyShrink = textOrFallback(source?.safetyShrink, "");
  const oneQuestion = textOrFallback(source?.oneQuestion ?? source?.question, "");
  const reason = textOrFallback(source?.reason, "");
  let directBuildTask = normalizeDirectBuildTask(source?.directBuildTask);

  const stableReview = getStableReviewOverride(context.input || "", verdict);
  if (stableReview) {
    routeMode = stableReview.routeMode || routeMode;
    firstRunnableArtifact = stableReview.firstRunnableArtifact || firstRunnableArtifact;
    safetyShrink = stableReview.safetyShrink ?? safetyShrink;
    riskFlags = [...new Set([...riskFlags, ...(stableReview.riskFlags || [])])];
    directBuildTask = stableReview.directBuildTask || directBuildTask;
  }
  if (!safetyShrink && directBuildTask?.safetyShrink) {
    safetyShrink = directBuildTask.safetyShrink;
  }

  if (!DOORWAY_JUDGE_VERDICTS.has(verdict)) {
    diagnostics.push(`verdict must be one of ${[...DOORWAY_JUDGE_VERDICTS].join(", ")}, got ${source?.verdict || "missing"}.`);
  }

  if (!CONFIDENCE_LEVELS.has(confidence)) {
    diagnostics.push(`confidence must be low / medium / high, got ${source?.confidence || "missing"}.`);
  }

  if (!doorwayLine) diagnostics.push("doorwayLine is missing.");
  if (!reason) diagnostics.push("reason is missing.");
  if (reason.length > 120 || reason.split(/\r?\n/).length > 1) {
    diagnostics.push("reason must stay short and must not become long analysis.");
  }

  if (verdict === "can_run" && !ROUTE_MODES.has(routeMode)) {
    diagnostics.push("can_run must include routeMode: direct_build or try_walk.");
  }

  if (verdict === "can_run" && !firstRunnableArtifact) {
    diagnostics.push("can_run must include firstRunnableArtifact.");
  }

  if (verdict === "can_run" && routeMode === "try_walk" && !firstRunnableArtifact) {
    diagnostics.push("try_walk must include firstRunnableArtifact.");
  }

  if (verdict === "can_run" && routeMode === "direct_build") {
    const taskDiagnostics = validateDirectBuildTask(directBuildTask);
    diagnostics.push(...taskDiagnostics);
    const executionText = stringifyVisibleText({
      goal: directBuildTask?.goal,
      files: directBuildTask?.files,
      requirements: directBuildTask?.requirements,
      acceptanceCriteria: directBuildTask?.acceptanceCriteria
    });
    if (DIRECT_BUILD_IP_PATTERNS.some((pattern) => pattern.test(context.input || ""))) {
      if (!safetyShrink) diagnostics.push("IP-referenced direct_build must include safetyShrink.");
      if (DIRECT_BUILD_IP_PATTERNS.some((pattern) => pattern.test(executionText))) {
        diagnostics.push("IP-referenced direct_build task must be rewritten as an original non-infringing demo.");
      }
    }
  }

  if (verdict === "can_run" && firstRunnableArtifact && artifactDriftsFromInput(context.input || "", firstRunnableArtifact)) {
    diagnostics.push("firstRunnableArtifact must stay anchored to the user's input, not reuse an unrelated example.");
  }

  if (verdict === "ask_one_question" && !oneQuestion) {
    diagnostics.push("ask_one_question must include oneQuestion.");
  }

  if (requiresSafetyShrink(context.input || "", riskFlags) && !safetyShrink) {
    diagnostics.push("risk actions or IP references must include safetyShrink.");
  }

  if (!requiresSafetyShrink(context.input || "", []) && safetyShrink) {
    diagnostics.push("safetyShrink should only appear when the input contains a risky action that needs shrinking.");
  }

  if (verdict === "boundary_stop" && firstRunnableArtifact) {
    diagnostics.push("boundary_stop must not include firstRunnableArtifact or dangerous execution steps.");
  }

  const visibleText = stringifyVisibleText({
    doorwayLine,
    routeMode,
    firstRunnableArtifact,
    riskFlags,
    safetyShrink,
    directBuildTask,
    oneQuestion,
    reason
  });

  const reportHit = REPORT_TONE_PATTERNS.find((pattern) => pattern.test(visibleText));
  if (reportHit) diagnostics.push(`report tone phrase found: ${reportHit.source}.`);

  if (verdict === "boundary_stop") {
    const harmfulHit = HARMFUL_STEP_PATTERNS.find((pattern) => pattern.test(firstRunnableArtifact));
    if (harmfulHit) diagnostics.push(`boundary_stop must not provide dangerous execution step: ${harmfulHit.source}.`);
  }

  const doorwayLineHuman = looksHumanDoorwayLine(doorwayLine);
  if (!doorwayLineHuman) {
    warnings.push("doorwayLine may be too stiff; audit should inspect human taste.");
  }

  if (diagnostics.length > 0) {
    return { ok: false, diagnostics, warnings };
  }

  return {
    ok: true,
    diagnostics: [],
    warnings,
    review: {
      verdict,
      confidence,
      doorwayLine,
      routeMode: verdict === "can_run" ? routeMode : "",
      firstRunnableArtifact,
      riskFlags,
      safetyShrink,
      directBuildTask: verdict === "can_run" && routeMode === "direct_build" ? directBuildTask : null,
      oneQuestion,
      reason,
      doorwayLineHuman
    }
  };
}

function normalizeDirectBuildTask(value) {
  if (!value || typeof value !== "object") return null;
  const recommendedTool = textOrFallback(value.recommendedTool, textOrFallback(value.open, ""));
  return {
    recommendedTool,
    open: textOrFallback(value.open, recommendedTool),
    goal: textOrFallback(value.goal, ""),
    files: Array.isArray(value.files) ? value.files.map((item) => textOrFallback(item, "")).filter(Boolean).slice(0, 6) : [],
    requirements: Array.isArray(value.requirements) ? value.requirements.map((item) => textOrFallback(item, "")).filter(Boolean).slice(0, 8) : [],
    acceptanceCriteria: Array.isArray(value.acceptanceCriteria) ? value.acceptanceCriteria.map((item) => textOrFallback(item, "")).filter(Boolean).slice(0, 8) : [],
    notToDo: Array.isArray(value.notToDo) ? value.notToDo.map((item) => textOrFallback(item, "")).filter(Boolean).slice(0, 8) : [],
    safetyShrink: textOrFallback(value.safetyShrink, "")
  };
}

function validateDirectBuildTask(task) {
  const diagnostics = [];
  if (!task || typeof task !== "object") {
    diagnostics.push("direct_build must include directBuildTask.");
    return diagnostics;
  }

  if (!task.recommendedTool) diagnostics.push("directBuildTask.recommendedTool is missing.");
  if (!task.goal) diagnostics.push("directBuildTask.goal is missing.");
  if (!Array.isArray(task.files) || task.files.length === 0) diagnostics.push("directBuildTask.files must include at least one file.");
  if (!Array.isArray(task.requirements) || task.requirements.length === 0) diagnostics.push("directBuildTask.requirements must include at least one requirement.");
  if (!Array.isArray(task.acceptanceCriteria) || task.acceptanceCriteria.length === 0) diagnostics.push("directBuildTask.acceptanceCriteria must include at least one acceptance criterion.");
  if (!Array.isArray(task.notToDo) || task.notToDo.length === 0) diagnostics.push("directBuildTask.notToDo must include at least one boundary.");

  const executionText = stringifyVisibleText({
    recommendedTool: task.recommendedTool,
    open: task.open,
    goal: task.goal,
    files: task.files,
    requirements: task.requirements,
    acceptanceCriteria: task.acceptanceCriteria
  });
  const riskHit = DIRECT_BUILD_RISK_PATTERNS.find((pattern) => pattern.test(executionText));
  if (riskHit) {
    diagnostics.push(`direct_build task contains risky action: ${riskHit.source}.`);
  }

  const executorHit = DIRECT_BUILD_EXECUTOR_PATTERNS.find((pattern) => pattern.test(stringifyVisibleText(task)));
  if (executorHit) {
    diagnostics.push(`direct_build must not make IdeaRoast execute development work: ${executorHit.source}.`);
  }

  return diagnostics;
}

export async function runAiDoorwayJudge({
  input,
  localPacket,
  apiKey,
  model = "deepseek-v4-flash",
  baseUrl = "https://api.deepseek.com",
  timeoutMs = 45000
}) {
  if (!apiKey) {
    return {
      ok: false,
      reason: "missing_api_key"
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let payload;

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: buildAiDoorwayJudgeMessages({ input, localPacket }),
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 800,
        thinking: { type: "disabled" },
        stream: false
      }),
      signal: controller.signal
    });

    const raw = await response.text();
    if (!response.ok) {
      return {
        ok: false,
        reason: "api_error",
        status: response.status,
        error: raw.slice(0, 1600)
      };
    }

    try {
      payload = JSON.parse(raw);
    } catch {
      return { ok: false, reason: "api_response_not_json", error: raw.slice(0, 1600) };
    }
  } catch (error) {
    return {
      ok: false,
      reason: error.name === "AbortError" ? "api_timeout" : "api_request_failed",
      error: error.message
    };
  } finally {
    clearTimeout(timeout);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content || !String(content).trim()) {
    return { ok: false, reason: "empty_content", usage: payload?.usage || null };
  }

  let reviewJson;
  try {
    reviewJson = JSON.parse(content);
  } catch {
    return {
      ok: false,
      reason: "content_not_json",
      rawContent: String(content).slice(0, 1600),
      usage: payload?.usage || null
    };
  }

  const normalized = validateAiDoorwayJudgeReview(reviewJson, { input, localPacket });
  if (!normalized.ok) {
    return {
      ok: false,
      reason: "review_invalid",
      diagnostics: normalized.diagnostics,
      warnings: normalized.warnings,
      rawReview: reviewJson,
      usage: payload?.usage || null
    };
  }

  return {
    ok: true,
    mode: "live",
    model,
    review: normalized.review,
    warnings: normalized.warnings,
    rawReview: reviewJson,
    usage: payload?.usage || null
  };
}

export function buildFixtureAiDoorwayJudgeReview({ input, expectedVerdict = "", sample = {} }) {
  const verdict = expectedVerdict || inferFixtureVerdict(input);
  const riskFlags = inferRiskFlags(input, sample.riskFlags || []);
  const hasRisk = riskFlags.length > 0 || requiresSafetyShrink(input, riskFlags);
  const confidence = sample.confidence || "high";

  if (verdict === "can_run") {
    const routeMode = sample.routeMode || inferFixtureRouteMode(input);
    const directBuildTask = routeMode === "direct_build"
      ? sample.directBuildTask || inferFixtureDirectBuildTask(input)
      : null;
    return {
      verdict,
      confidence,
      doorwayLine: hasRisk
        ? "小人能背着它先走一圈，但会先把危险的自动动作压成手动交付包。"
        : routeMode === "direct_build"
          ? "这条不用摔，能直接开工。"
          : "这个能先走，小人会先把它压成一个可交付的小版本。",
      routeMode,
      firstRunnableArtifact: sample.artifact || inferFixtureArtifact(input),
      riskFlags,
      safetyShrink: sample.safetyShrink || (hasRisk ? inferFixtureSafetyShrink(input) : ""),
      directBuildTask,
      oneQuestion: "",
      reason: sample.reason || (routeMode === "direct_build"
        ? "这是明确可交付的小任务，IdeaRoast 只给开工指路卡，不需要现实摩擦预演。"
        : "输入已有对象、场景和第一版交付物，可以进入 5 步试走。")
    };
  }

  if (verdict === "ask_one_question") {
    return {
      verdict,
      confidence,
      doorwayLine: "小人还不知道往哪走。先给它一个具体方向，它再替你试走。",
      firstRunnableArtifact: "",
      riskFlags,
      safetyShrink: sample.safetyShrink || "",
      oneQuestion: sample.oneQuestion || "这个想法先落到哪一类物件、场景或交付物？",
      reason: "输入还停在愿望或领域层，没有第一版可运行交付物。"
    };
  }

  if (verdict === "scope_too_large") {
    return {
      verdict,
      confidence,
      doorwayLine: "小人背了一下，差点被完整系统压扁。先拆一个能跑的小入口。",
      firstRunnableArtifact: "",
      riskFlags,
      safetyShrink: sample.safetyShrink || (hasRisk ? "不接自动平台动作，先拆成一个手动可验的小入口。" : ""),
      oneQuestion: "",
      reason: "范围是完整系统级愿景，还没有第一版入口。"
    };
  }

  if (verdict === "reality_broken") {
    return {
      verdict,
      confidence,
      doorwayLine: "小人刚出门，物理定律把门锁了。这不是难，是脚下没路。",
      firstRunnableArtifact: "",
      riskFlags,
      safetyShrink: sample.safetyShrink || "",
      oneQuestion: "",
      reason: "输入要求软件或产品直接改变现实物理前提。"
    };
  }

  return {
    verdict: "boundary_stop",
    confidence,
    doorwayLine: "这个不能当普通项目试走。这里涉及授权、隐私或合规边界，先停。",
    firstRunnableArtifact: "",
    riskFlags,
    safetyShrink: sample.safetyShrink || "不进入执行路径；先停在授权、隐私、合规和安全边界。",
    oneQuestion: "",
    reason: "输入触及明显高风险边界，不能放进普通 5 步试走。"
  };
}

export function buildAiDoorwayJudgeMessages({ input, localPacket }) {
  const localShape = {
    idea: localPacket?.idea,
    clarityGate: localPacket?.clarityGate,
    path: localPacket?.path
  };

  return [
    {
      role: "system",
      content: [
        "你是 IdeaRoast 的 AI Doorway Judge v1，只做后台 shadow audit。",
        "你现在用于普通 doorway 默认试运行，但只判断 doorway。",
        "你不接管 Route Board，不生成 5 步预演，不写报告，不给完整创业方案。",
        "你只判断：这个输入能不能进入小人替身预演，还是可以直接开工，以及第一版可运行交付物是什么。",
        "只输出 JSON object，不要 markdown，不要额外解释。",
        "verdict 只能是 can_run、ask_one_question、scope_too_large、reality_broken、boundary_stop。",
        "verdict=can_run 时必须给 routeMode：direct_build 或 try_walk。",
        "direct_build 只用于目标交付物明确、第一版可直接做出、不需要先验证市场/用户/商业价值、低风险的小 demo、小页面、小脚本、本地工具、静态页面、明确功能组件。",
        "Direct Build 只是开工指路卡，不是让 IdeaRoast 自己生成代码、创建文件、执行开发任务或变成 Codex。",
        "try_walk 用于 AI 工具、内容账号、工作流、商业/用户/平台/数据/权限/分发相关 idea。",
        "can_run 必须给 firstRunnableArtifact。",
        "routeMode=direct_build 必须给 directBuildTask：recommendedTool、goal、files、requirements、acceptanceCriteria、notToDo。",
        "routeMode=try_walk 不要给 directBuildTask。",
        "自动上传、自动发布、平台数据、采集、抓取等风险动作必须给 safetyShrink。",
        "如果用户要求明显 IP / 版权对象，例如超级玛丽，仍可 direct_build，但必须改成原创素材的非侵权 demo，并给 safetyShrink / notToDo。",
        "如果用户输入没有自动上传、自动发布、平台数据、采集、抓取等风险动作，也没有明显 IP / 版权对象，riskFlags 必须为空，safetyShrink 必须为空。",
        "firstRunnableArtifact 必须贴住用户输入里的对象和动作；不要照抄示例，不要把无关输入改成视频草稿或上传清单。",
        "direct_build 不允许包含自动上传、自动发布、爬虫、抓取、绕过平台限制、自动交易、监控等动作。",
        "ask_one_question 必须给 oneQuestion。",
        "boundary_stop 不允许给危险执行步骤。",
        "doorwayLine 要像门口小人说话，不要报告腔。",
        "禁止词：综合分析、建议你、可行性较强、可行性较高、根据以上分析、你需要进一步明确。"
      ].join("\n")
    },
    {
      role: "user",
      content: [
        "# 用户输入",
        input,
        "",
        "# 当前本地 gate 参考，只用于对比，不要求照抄",
        JSON.stringify(localShape, null, 2),
        "",
        "# 输出 JSON 形状（这里只是字段形状，具体内容必须按用户输入重写，不能照抄）",
        JSON.stringify({
          verdict: "can_run",
          confidence: "high",
          doorwayLine: "小人能背着这个具体交付物先走一圈。",
          routeMode: "try_walk",
          firstRunnableArtifact: "贴住用户输入的第一版可运行交付物",
          riskFlags: [],
          safetyShrink: "",
          directBuildTask: null,
          oneQuestion: "",
          reason: "输入已经有对象、动作或交付物，可以进入 5 步里压小。"
        }, null, 2),
        "",
        "# 判断规则",
        "- 明确小产品、AI 工具、内容账号、开源项目、独立开发 idea，并能看出第一版交付物：can_run。",
        "- 明确软件小功能/小游戏/小页面/本地小脚本/本地工具/静态页面/明确功能组件，低风险且可直接做出来：can_run + routeMode=direct_build。",
        "- direct_build 输出的是开工指路卡：推荐工具、可复制任务、交付物、验收标准和不做事项；IdeaRoast 不执行开发任务。",
        "- AI 工具、内容账号、工作流、竞品分析、商业产品、平台/数据/权限/分发相关 idea：can_run + routeMode=try_walk。",
        "- 贪食蛇、横版跳跃小游戏、Todo List、番茄钟、简单计算器、倒计时页面、个人主页、抽奖转盘、图片压缩、Markdown 转 HTML 本地小工具：direct_build。",
        "- 超级玛丽类输入：direct_build + IP safety shrink，改成原创素材横版跳跃小游戏 demo；不要使用任天堂角色、素材、关卡或名称。",
        "- 太抽象、没对象、没场景、没交付物：ask_one_question。",
        "- 完整 Jarvis、完整钢铁侠、全能机器人、超级 AI 系统、没有第一版入口：scope_too_large。",
        "- APP 让手机物理浮空、时光机、永动机、真实反重力 UFO、软件让物体凭空移动：reality_broken。",
        "- 自动炒股下单、未授权监控、绕过平台限制、未授权抓取用户数据、高风险未成年人情感服务：boundary_stop。",
        "- 内容生产工作流里出现自动上传/发布时，不要 boundary_stop；如果能改成手动导出包，仍 can_run，并给 safetyShrink。",
        "- 竞品分析如果对象是公开产品、公开账号、公开页面或公开资料范围，且第一版能收缩成公开资料竞品简报：can_run。",
        "- 竞品分析里写“某短视频账号”时，不要仅因为账号名未填就 ask_one_question；可把第一版收缩为手动观察公开视频或用户提供样本的公开资料简报。",
        "- 竞品分析涉及平台数据、账号内容、会员规则或商户规则时，必须在 safetyShrink 或 reason 里限定：只用公开资料，不抓后台数据，不采集用户隐私，不绕过平台限制，不做未授权采集。"
      ].join("\n")
    }
  ];
}

function looksHumanDoorwayLine(value) {
  const line = textOrFallback(value, "");
  if (!line || line.length > 96 || REPORT_TONE_PATTERNS.some((pattern) => pattern.test(line))) return false;
  return /小人|先|这里|这个|脚下|门口|背|压|停|能走|能跑/.test(line);
}

function inferFixtureVerdict(input) {
  const text = String(input || "").toLowerCase().replace(/\s+/g, "");
  if (/自动量化|自动.*炒股|自动.*下单|监控员工|未授权监控|未授权抓取|抓取用户私信|手机号|中学生|未成年人|绕过平台|破解付费|刷评论|偷偷录音/.test(text)) {
    return "boundary_stop";
  }
  if (/手机.*浮空|app.*浮空|时光机|永动机|反重力|凭空移动|传送到|真实天气|瞬间隐身/.test(text)) {
    return "reality_broken";
  }
  if (/完整jarvis|完整贾维斯|完整.*钢铁侠|我想做钢铁侠|全能机器人|超级ai|包办融资|全网内容账号|躺赚|统治所有/.test(text)) {
    return "scope_too_large";
  }
  if (/^我想做(ai工具|短视频|内容账号|小产品|副业赚钱)$/.test(text) || /效率提升平台|帮助创作者的工具/.test(text)) {
    return "ask_one_question";
  }
  return "can_run";
}

function inferFixtureRouteMode(input) {
  return inferFixtureDirectBuildTask(input) ? "direct_build" : "try_walk";
}

function inferFixtureDirectBuildTask(input) {
  const text = normalizeRouteModeInput(input);
  if (!text || hasDirectBuildRisk(text) || shouldTryWalkBeforeBuild(text) || isAbstractBuildWish(text)) return null;

  const task =
    buildCopyrightSafeGameTask(text) ||
    buildNamedDirectBuildTask(text) ||
    buildGenericDirectBuildTask(input, text);

  return task ? withDirectBuildDefaults(task) : null;
}

function normalizeRouteModeInput(input) {
  return String(input || "").toLowerCase().replace(/\s+/g, "").trim();
}

function hasDirectBuildRisk(text) {
  return /自动上传|自动发布|爬虫|抓取|爬取|采集|绕过平台|自动交易|自动下单|监控/.test(text);
}

function shouldTryWalkBeforeBuild(text) {
  return /ai工具|ai产品|内容账号|短视频账号|工作流|竞品分析|竞品|商业产品|商户通|会员规则|会员体系|跨境电商|独立开发|拆mvp|开源项目|readme.*教程|平台数据|用户反馈|市场|获客|分发|商业模式|权限|控制电脑|电脑控制|语音控制电脑|语音|新闻|搜索当天新闻/.test(text);
}

function isAbstractBuildWish(text) {
  return /^(我想|想)?(做|搞|开发)?(ai工具|短视频|内容|自动化|产品|小产品|副业赚钱|效率提升)$/.test(text);
}

function buildCopyrightSafeGameTask(text) {
  if (!/超级玛丽|supermario|mario|马里奥/.test(text)) return null;
  return {
    goal: "做一个原创素材的横版跳跃小游戏 demo",
    files: ["index.html"],
    requirements: ["使用原创角色、原创场景和原创关卡", "方向键控制角色移动和跳跃", "有平台、金币或收集物、障碍物", "碰到障碍物会失败或扣分", "可以重新开始"],
    acceptanceCriteria: ["浏览器打开 index.html 可以直接玩", "角色能左右移动和跳跃", "至少有一个可完成的小关卡", "失败或通关后可以重新开始", "页面不使用任天堂角色、素材、关卡或名称"],
    notToDo: ["不要使用任天堂角色、素材、关卡或名称", "不要复刻受版权保护的地图、音乐或美术", "不要接后端、账号、数据库或外部 API"],
    safetyShrink: "可以做经典横版跳跃玩法 demo，但必须使用原创素材，不使用任天堂角色、素材、关卡或名称。"
  };
}

function buildNamedDirectBuildTask(text) {
  const namedTasks = [
    {
      match: /贪食蛇|snake/,
      task: {
        goal: "做一个单文件 HTML Canvas 贪食蛇小游戏",
        files: ["index.html"],
        requirements: ["方向键控制蛇移动", "吃到食物加分并变长", "撞墙或撞到自己失败", "显示分数", "失败后可以重新开始"],
        acceptanceCriteria: ["浏览器打开 index.html 可以直接玩", "方向键能控制移动", "吃食物后蛇变长并加分", "失败后能重新开始"]
      }
    },
    {
      match: /横版跳跃|平台跳跃|platformer/,
      task: {
        goal: "做一个原创素材的横版跳跃小游戏 demo",
        files: ["index.html"],
        requirements: ["方向键控制角色移动和跳跃", "有平台、障碍物和终点", "碰到障碍物会失败或回到起点", "显示通关或失败状态", "可以重新开始"],
        acceptanceCriteria: ["浏览器打开 index.html 可以直接玩", "角色能移动和跳跃", "能从起点走到终点", "碰到障碍物会触发失败反馈", "重新开始按钮可用"]
      }
    },
    {
      match: /todolist|todo|待办/,
      task: {
        goal: "做一个单文件 Todo List 网页",
        files: ["index.html"],
        requirements: ["可以新增待办", "可以勾选完成", "可以删除待办", "刷新后保留本地数据"],
        acceptanceCriteria: ["浏览器打开 index.html 可以添加待办", "完成状态能切换", "删除后列表更新", "刷新后待办仍保留"]
      }
    },
    {
      match: /番茄钟|pomodoro/,
      task: {
        goal: "做一个单文件番茄钟网页",
        files: ["index.html"],
        requirements: ["25 分钟专注倒计时", "5 分钟休息倒计时", "开始/暂停/重置按钮", "显示当前模式和剩余时间"],
        acceptanceCriteria: ["浏览器打开 index.html 可以开始倒计时", "开始和暂停按钮有效", "重置能回到当前模式初始时间", "专注结束后能切到休息"]
      }
    },
    {
      match: /简单计算器|计算器/,
      task: {
        goal: "做一个单文件简单计算器网页",
        files: ["index.html"],
        requirements: ["支持加减乘除", "支持清空", "显示输入和结果", "避免明显非法表达式崩溃"],
        acceptanceCriteria: ["浏览器打开 index.html 可以计算四则运算", "清空按钮有效", "连续输入不会撑破界面", "非法输入时页面不崩"]
      }
    },
    {
      match: /倒计时/,
      task: {
        goal: "做一个单文件倒计时页面",
        files: ["index.html"],
        requirements: ["可以设置目标时间或分钟数", "显示剩余时间", "开始/暂停/重置按钮", "倒计时结束有明显提示"],
        acceptanceCriteria: ["浏览器打开 index.html 可以设置倒计时", "开始后时间递减", "暂停和重置有效", "结束时显示完成提示"]
      }
    },
    {
      match: /markdown.*html|html.*markdown|markdown转html/,
      task: {
        goal: "做一个本地 Markdown 转 HTML 小工具",
        files: ["index.html"],
        requirements: ["左侧输入 Markdown", "右侧预览 HTML", "支持标题、列表、加粗和代码块", "可以复制生成的 HTML"],
        acceptanceCriteria: ["浏览器打开 index.html 可以输入 Markdown", "预览区能实时更新", "常见 Markdown 语法能转换", "复制 HTML 按钮可用"]
      }
    },
    {
      match: /图片压缩|压缩图片|imagecompress/,
      task: {
        goal: "做一个本地图片压缩小工具",
        files: ["index.html"],
        requirements: ["可以选择本地图片", "可以调节压缩质量", "显示压缩前后大小", "可以下载压缩后的图片", "不上传图片到服务器"],
        acceptanceCriteria: ["浏览器打开 index.html 可以选择图片", "调整质量后能生成压缩结果", "能看到压缩前后大小", "下载按钮可用", "断网时仍可本地使用"]
      }
    },
    {
      match: /个人主页|落地页|landingpage|简单落地页/,
      task: {
        goal: "做一个单文件简单个人主页 / 落地页",
        files: ["index.html"],
        requirements: ["首屏有标题、简介和行动按钮", "有作品或功能区块", "移动端能正常阅读", "视觉简洁"],
        acceptanceCriteria: ["浏览器打开 index.html 能看到完整首屏", "按钮和区块不重叠", "手机宽度下文本不溢出", "页面无 JS 错误"]
      }
    },
    {
      match: /抽奖转盘|转盘抽奖|幸运转盘/,
      task: {
        goal: "做一个单文件简单抽奖转盘网页",
        files: ["index.html"],
        requirements: ["可以配置奖项名称", "点击按钮后转盘旋转", "停止后显示抽中的奖项", "可以重新抽取", "移动端可用"],
        acceptanceCriteria: ["浏览器打开 index.html 可以看到转盘", "点击开始后转盘会旋转并停下", "停下后显示抽中奖项", "重新抽取按钮可用", "手机宽度下不重叠"]
      }
    },
    {
      match: /readme.*(美化|排版).*脚本|readme自动排版脚本/,
      task: {
        goal: "做一个 README 自动排版本地脚本",
        files: ["format-readme.js", "README.md"],
        requirements: ["读取 README.md", "整理标题层级和空行", "保留原文内容", "输出格式化后的 README"],
        acceptanceCriteria: ["运行脚本不会删除原文重点", "标题层级更清楚", "重复空行被收敛", "脚本异常时有提示"]
      }
    }
  ];

  const match = namedTasks.find((item) => item.match.test(text));
  return match ? { ...match.task } : null;
}

function buildGenericDirectBuildTask(input, text) {
  if (/小游戏|游戏demo|小demo/.test(text)) {
    return {
      goal: `做一个原创素材的${inferDirectBuildObjectName(input, "浏览器小游戏 demo")}`,
      files: ["index.html"],
      requirements: ["有一个可操作的核心玩法", "显示当前状态或分数", "有开始和重新开始", "失败或完成时有明确反馈", "使用原创或占位素材"],
      acceptanceCriteria: ["浏览器打开 index.html 可以直接体验", "核心操作能完成", "状态或分数会变化", "失败或完成反馈清楚", "不依赖后端或外部 API"]
    };
  }

  if (/网页|页面|静态页|单文件html|html页面|小网页/.test(text)) {
    return {
      goal: `做一个单文件${inferDirectBuildObjectName(input, "静态网页")}`,
      files: ["index.html"],
      requirements: ["页面结构完整", "移动端和桌面端都能阅读", "主要按钮或链接有基础交互", "文本不溢出、不重叠", "不接后端"],
      acceptanceCriteria: ["浏览器打开 index.html 可以直接查看", "桌面和手机宽度下布局正常", "主要交互可用", "页面无 JS 错误"]
    };
  }

  if (/本地.*工具|小工具|工具/.test(text)) {
    return {
      goal: `做一个本地${inferDirectBuildObjectName(input, "小工具")}`,
      files: ["index.html"],
      requirements: ["输入区和结果区清楚", "能在浏览器本地完成核心转换或处理", "提供复制或下载结果", "错误输入时有提示", "不上传用户文件或内容"],
      acceptanceCriteria: ["浏览器打开 index.html 可以直接使用", "输入样例后能得到结果", "复制或下载按钮可用", "断网时核心功能仍可用"]
    };
  }

  if (/脚本|小脚本/.test(text)) {
    return {
      goal: `做一个本地${inferDirectBuildObjectName(input, "小脚本")}`,
      files: ["script.js", "README.md"],
      requirements: ["说明如何运行脚本", "处理一个本地输入文件或示例输入", "输出结果到控制台或本地文件", "异常时给出清楚提示"],
      acceptanceCriteria: ["按 README 命令能运行脚本", "示例输入能得到预期输出", "错误输入不会让脚本无提示崩溃"]
    };
  }

  if (/组件|功能组件/.test(text)) {
    return {
      goal: `做一个可运行的${inferDirectBuildObjectName(input, "功能组件 demo")}`,
      files: ["index.html"],
      requirements: ["组件默认状态可见", "至少有一个可操作交互", "交互后状态会更新", "移动端不溢出", "不接后端"],
      acceptanceCriteria: ["浏览器打开 index.html 可以看到组件", "点击或输入后组件有反馈", "桌面和手机宽度下不重叠", "页面无 JS 错误"]
    };
  }

  return null;
}

function inferDirectBuildObjectName(input, fallback) {
  const cleaned = String(input || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^我想(要)?/, "")
    .replace(/^(做|开发|写|搞|生成)/, "")
    .replace(/^(一个|一款|一套|个)/, "")
    .trim();
  return cleaned || fallback;
}

function withDirectBuildDefaults(task = {}) {
  const recommendedTool = task.recommendedTool || task.open || "Codex";
  const notToDo = Array.isArray(task.notToDo) && task.notToDo.length > 0
    ? task.notToDo
    : ["不要接后端、数据库或账号系统", "不要接外部平台 API", "不要把 IdeaRoast 当成代码执行器；只复制任务给外部 AI / 工具执行"];

  return {
    recommendedTool,
    open: recommendedTool,
    goal: task.goal || "做一个本地可运行的小 demo",
    files: Array.isArray(task.files) && task.files.length > 0 ? task.files : ["index.html"],
    requirements: Array.isArray(task.requirements) && task.requirements.length > 0 ? task.requirements : ["先做一个能打开、能操作的第一版"],
    acceptanceCriteria: Array.isArray(task.acceptanceCriteria) && task.acceptanceCriteria.length > 0 ? task.acceptanceCriteria : ["浏览器打开后能直接使用"],
    notToDo,
    safetyShrink: task.safetyShrink || ""
  };
}

function inferFixtureArtifact(input) {
  const text = String(input || "");
  const directBuildTask = inferFixtureDirectBuildTask(input);
  if (directBuildTask) return directBuildTask.goal.replace(/^做一个?/, "一个");
  if (/自动上传视频|生成题目.*文案.*视频/.test(text)) return "一条可手动发布的视频草稿 + 上传清单";
  if (/竞品分析.*高德|高德地图.*商户通|商户通.*会员/.test(text)) return "一页只基于公开资料的高德地图商业产品竞品简报";
  if (/竞品分析.*saas|saas.*定价页|saas.*功能页/.test(text)) return "一页 SaaS 定价页、功能页和公开评价竞品简报";
  if (/竞品分析.*短视频账号|短视频账号.*选题.*评论区/.test(text)) return "一页短视频账号公开视频观察简报";
  if (/竞品分析|竞品|对标/.test(text)) return "一页只基于公开资料的竞品简报";
  if (/选题.*会不会有人看|标题分析/.test(text)) return "一张手动录入标题样本后的选题判断卡";
  if (/AI 工具实战|AI工具实战|工具实战.*短视频/.test(text)) return "一条 AI 工具实战短视频选题和脚本草稿";
  if (/跨境电商.*文案.*短视频|商品文案.*短视频/.test(text)) return "一条跨境电商商品文案和短视频草稿";
  if (/独立开发者.*第一步验证|拆成第一步验证|独立开发者.*拆 MVP|拆 MVP/.test(text)) return "一张独立开发者产品想法到首个验证动作的拆解卡";
  if (/Excel.*短视频|教 Excel/.test(text)) return "一条具体 Excel 场景的一分钟视频草稿";
  if (/README.*教程/.test(text)) return "一个 README 转使用教程的页面 demo";
  if (/小红书/.test(text)) return "一篇小红书图文草稿 + 手动发布检查清单";
  if (/播客/.test(text)) return "一段播客切片短视频草稿 + 多平台手动发布清单";
  if (/小猫|带货视频/.test(text)) return "三条 AI 小猫带货视频草稿 + 手动发布清单";
  return "一个可手动试用的第一版交付物";
}

function inferFixtureSafetyShrink(input) {
  const text = String(input || "");
  if (/自动上传视频|生成题目.*文案.*视频/.test(text)) return "不默认自动上传，第一版先导出视频草稿、标题、发布文案和手动上传清单。";
  if (/竞品分析.*高德|高德地图.*商户通|商户通.*会员/.test(text)) return "只用公开页面、公开截图和官方说明，不抓后台数据，不采集用户隐私，不绕过平台限制。";
  if (/竞品分析.*saas|saas.*定价页|saas.*功能页/.test(text)) return "只用公开定价页、功能页和公开评价，不抓后台数据，不绕过登录或付费限制。";
  if (/竞品分析.*短视频账号|短视频账号.*选题.*评论区/.test(text)) return "只手动观察公开视频或用户提供样本，不默认爬虫，不批量抓取评论，不采集隐私。";
  if (/竞品分析|竞品|对标/.test(text)) return "只用公开资料，不抓后台数据，不采集用户隐私，不绕过平台限制，不做未授权采集。";
  if (/超级玛丽|super\s*mario|mario|马里奥/i.test(text)) return "可以做经典横版跳跃玩法 demo，但必须使用原创素材，不使用任天堂角色、素材、关卡或名称。";
  if (/自动发布|小红书/.test(text)) return "不默认自动发布，第一版只导出内容草稿、标题、标签和手动发布清单。";
  if (/采集|抓取|公开样本|评论区/.test(text)) return "不默认自动采集平台数据，第一版让用户手动导入少量公开样本。";
  if (/平台标题|标题分析/.test(text)) return "不抓平台数据，第一版只分析用户手动粘贴的标题样本。";
  return "不接平台自动动作，第一版只导出草稿、清单和手动检查步骤。";
}

function getStableReviewOverride(input, verdict) {
  const text = String(input || "");
  if (verdict !== "can_run") return null;
  const directBuildTask = inferFixtureDirectBuildTask(input);
  if (directBuildTask) {
    return {
      routeMode: "direct_build",
      firstRunnableArtifact: directBuildTask.goal.replace(/^做一个?/, "一个"),
      safetyShrink: directBuildTask.safetyShrink || "",
      riskFlags: directBuildTask.safetyShrink ? ["ip_safety"] : [],
      directBuildTask
    };
  }
  if (/自动上传视频|生成题目.*文案.*视频/.test(text)) {
    return {
      routeMode: "try_walk",
      firstRunnableArtifact: "一条可手动发布的视频草稿 + 上传清单",
      safetyShrink: "不默认自动上传，第一版先导出视频草稿、标题、发布文案和手动上传清单。",
      riskFlags: ["platform_automation"]
    };
  }
  if (/选题.*会不会有人看|标题分析/.test(text)) {
    return {
      routeMode: "try_walk",
      firstRunnableArtifact: "一张选题判断表：标题钩子、评论区疑问、是否继续改",
      safetyShrink: "",
      riskFlags: []
    };
  }
  if (/README.*教程/.test(text)) {
    return {
      routeMode: "try_walk",
      firstRunnableArtifact: "README → 新手使用教程",
      safetyShrink: "",
      riskFlags: []
    };
  }
  if (/竞品分析.*高德|高德地图.*商户通|商户通.*会员/.test(text)) {
    return {
      routeMode: "try_walk",
      firstRunnableArtifact: "一页只基于公开资料的高德地图商业产品竞品简报",
      safetyShrink: "只用公开页面、公开截图和官方说明，不抓后台数据，不采集用户隐私，不绕过平台限制。",
      riskFlags: ["public_sources_only"]
    };
  }
  if (/竞品分析.*saas|saas.*定价页|saas.*功能页/.test(text)) {
    return {
      routeMode: "try_walk",
      firstRunnableArtifact: "一页 SaaS 定价页、功能页和公开评价竞品简报",
      safetyShrink: "只用公开定价页、功能页和公开评价，不抓后台数据，不绕过登录或付费限制。",
      riskFlags: ["public_sources_only"]
    };
  }
  if (/竞品分析.*短视频账号|短视频账号.*选题.*评论区/.test(text)) {
    return {
      routeMode: "try_walk",
      firstRunnableArtifact: "一页短视频账号公开视频观察简报",
      safetyShrink: "只手动观察公开视频或用户提供样本，不默认爬虫，不批量抓取评论，不采集隐私。",
      riskFlags: ["public_sources_only"]
    };
  }
  return null;
}

function artifactDriftsFromInput(input, artifact) {
  const inputText = String(input || "");
  const artifactText = String(artifact || "");
  const anchors = collectDistinctInputAnchors(inputText);
  if (anchors.length === 0) return false;
  return !anchors.some((anchor) => artifactText.includes(anchor));
}

function collectDistinctInputAnchors(input) {
  const anchors = [
    "README",
    "Excel",
    "选题",
    "创作者",
    "独立开发者",
    "验证动作",
    "产品想法",
    "使用教程",
    "开源项目",
    "语音",
    "电脑",
    "读书",
    "陪练",
    "宠物",
    "小猫",
    "带货",
    "题目",
    "文案",
    "视频",
    "上传",
    "短视频",
    "发布",
    "标题"
  ];
  return anchors.filter((anchor) => input.includes(anchor));
}

function textOrFallback(value, fallback = "") {
  const text = String(value || "").trim();
  return text || String(fallback || "").trim();
}

function stringifyVisibleText(value) {
  if (Array.isArray(value)) return value.map((item) => stringifyVisibleText(item)).join("\n");
  if (value && typeof value === "object") return Object.values(value).map((item) => stringifyVisibleText(item)).join("\n");
  return String(value || "");
}
