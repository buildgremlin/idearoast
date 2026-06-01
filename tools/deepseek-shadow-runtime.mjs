import fs from "node:fs";
import vm from "node:vm";

const DATA_PATH = "data/sample-simulation.js";
const RUNNABLE_STATUSES = new Set(["ready", "usable"]);
const REPORT_TONE_PATTERNS = [/综合分析/, /建议你/, /可行性较强/, /可行性较高/, /风险较高/, /根据以上分析/, /你需要进一步明确/];
const GENERIC_PATTERNS = [/只做一个动作/, /做一个最小版本/, /验证核心需求/, /找\s*3\s*个目标用户/, /访谈\s*5\s*个人/, /做一个\s*MVP/i];
const ROUTE_VERDICTS = new Set(["continue", "mutate", "branch", "stop"]);
const DOORWAY_VERDICTS = new Set(["can_run", "ask_one_question", "scope_too_large", "reality_broken", "boundary_stop"]);
const DOORWAY_STOP_VERDICTS = new Set(["ask_one_question", "scope_too_large", "reality_broken", "boundary_stop"]);
const DOORWAY_HARSH_JOKE_PATTERNS = [/你想屁吃/, /做梦呢/, /科幻片开机/];
const DOORWAY_BOUNDARY_JOKE_PATTERNS = [/你想屁吃/, /做梦呢/, /科幻片开机/, /压扁/, /吐槽/];

export function loadLocalSimulationContext(projectRoot) {
  const dataCode = fs.readFileSync(`${projectRoot}/${DATA_PATH}`, "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(dataCode, context);
  if (typeof context.window.buildLocalFrictionPacketV0 !== "function") {
    throw new Error("window.buildLocalFrictionPacketV0 is not available.");
  }
  return context;
}

export function buildLocalPacket(projectRoot, input) {
  const context = loadLocalSimulationContext(projectRoot);
  return context.window.buildLocalFrictionPacketV0(input);
}

export function buildDoorwayReviewOverridePacket(projectRoot, input, review) {
  const context = loadLocalSimulationContext(projectRoot);
  if (typeof context.window.buildDoorwayReviewOverridePacketV0 !== "function") {
    throw new Error("window.buildDoorwayReviewOverridePacketV0 is not available.");
  }
  return context.window.buildDoorwayReviewOverridePacketV0(input, review);
}

export function buildAiDoorwayJudgePacket(projectRoot, input, review) {
  const context = loadLocalSimulationContext(projectRoot);
  if (typeof context.window.buildAiDoorwayJudgePacketV0 !== "function") {
    throw new Error("window.buildAiDoorwayJudgePacketV0 is not available.");
  }
  return context.window.buildAiDoorwayJudgePacketV0(input, review);
}

export function isRunnableForShadow(packet) {
  return RUNNABLE_STATUSES.has(packet?.clarityGate?.status || "");
}

export async function runDeepSeekDoorwayReview({
  input,
  localPacket,
  apiKey,
  projectRoot,
  model = "deepseek-v4-flash",
  baseUrl = "https://api.deepseek.com",
  timeoutMs = 45000
}) {
  if (!isRunnableForShadow(localPacket)) {
    return {
      ok: false,
      skipped: true,
      reason: "local_gate_not_runnable",
      gateStatus: localPacket?.clarityGate?.status || "unknown"
    };
  }

  if (!apiKey) {
    return {
      ok: false,
      skipped: false,
      reason: "missing_api_key",
      gateStatus: localPacket?.clarityGate?.status || "unknown"
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
        messages: buildDoorwayReviewMessages({ input, localPacket }),
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 600,
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
        error: raw.slice(0, 1200)
      };
    }

    try {
      payload = JSON.parse(raw);
    } catch {
      return { ok: false, reason: "api_response_not_json", error: raw.slice(0, 1200) };
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
      rawContent: String(content).slice(0, 1200),
      usage: payload?.usage || null
    };
  }

  const normalized = normalizeDoorwayReview(reviewJson);
  if (!normalized.ok) {
    return {
      ok: false,
      reason: "review_invalid",
      diagnostics: normalized.diagnostics,
      rawReview: reviewJson,
      usage: payload?.usage || null
    };
  }

  const result = {
    ok: true,
    model,
    gateStatus: localPacket.clarityGate.status,
    verdict: normalized.review.verdict,
    review: normalized.review,
    usage: payload?.usage || null
  };

  if (DOORWAY_STOP_VERDICTS.has(normalized.review.verdict)) {
    result.action = "veto";
    if (projectRoot) {
      result.overridePacket = buildDoorwayReviewOverridePacket(projectRoot, input, normalized.review);
    }
  } else {
    result.action = "allow_local_run";
  }

  return result;
}

export async function runDeepSeekShadow({ input, localPacket, apiKey, model = "deepseek-v4-flash", baseUrl = "https://api.deepseek.com", timeoutMs = 90000 }) {
  if (!isRunnableForShadow(localPacket)) {
    return {
      ok: false,
      skipped: true,
      reason: "local_gate_not_runnable",
      gateStatus: localPacket?.clarityGate?.status || "unknown"
    };
  }

  if (!apiKey) {
    return {
      ok: false,
      skipped: false,
      reason: "missing_api_key",
      gateStatus: localPacket?.clarityGate?.status || "unknown"
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
        messages: buildShadowMessages({ input, localPacket }),
        response_format: { type: "json_object" },
        temperature: 0.45,
        max_tokens: 2600,
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
        error: raw.slice(0, 1200)
      };
    }

    try {
      payload = JSON.parse(raw);
    } catch {
      return { ok: false, reason: "api_response_not_json", error: raw.slice(0, 1200) };
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

  let shadowJson;
  try {
    shadowJson = JSON.parse(content);
  } catch {
    return {
      ok: false,
      reason: "content_not_json",
      rawContent: String(content).slice(0, 1800),
      usage: payload?.usage || null
    };
  }

  const normalized = normalizeShadowCandidate(shadowJson, localPacket);
  if (!normalized.ok) {
    return {
      ok: false,
      reason: "candidate_invalid",
      diagnostics: normalized.diagnostics,
      rawCandidate: shadowJson,
      usage: payload?.usage || null
    };
  }

  return {
    ok: true,
    model,
    gateStatus: localPacket.clarityGate.status,
    candidate: normalized.candidate,
    diagnostics: normalized.diagnostics,
    usage: payload?.usage || null
  };
}

export function buildDoorwayReviewMessages({ input, localPacket }) {
  const localShape = {
    idea: localPacket.idea,
    clarityGate: localPacket.clarityGate,
    path: localPacket.path
  };

  return [
    {
      role: "system",
      content: [
        "你是 IdeaRoast 的门口小人 reviewer，只做进入沙盒前的一次现实入口判断。",
        "你不是创业顾问，不写报告，不生成 5 步预演，不给完整方案。",
        "模型能力边界：底层模型决定判断上限；IdeaRoast 只负责表达方式、结构约束、validator、fallback 和体验表达。",
        "DeepSeek raw pass 不等于 product-ready；GPT 输出也必须过结构约束；所有模型输出都必须能被 validator 拦下并 fallback。",
        "不要为了迁就弱模型，把产品变成一堆规则补丁。",
        "只返回 JSON object，不要 markdown，不要多余解释。",
        "verdict 只能是 can_run、ask_one_question、scope_too_large、reality_broken、boundary_stop。",
        "判断核心：这个输入有没有一个明确、现实、低成本可试走的入口。",
        "如果本地 gate 已经可跑，但你发现它没有现实入口、范围太大、现实前提断裂或边界风险，你可以 veto。",
        "不要因为想法普通、不成熟或需要压小就拦下；只有门口就不该进 5 步时才拦。",
        "语气协议：can_run 接住用户，轻松但明确；ask_one_question 温和，不嘲讽；scope_too_large 可以吐槽但不羞辱；reality_broken 可以更毒舌但要解释脚下没路；boundary_stop 严肃清楚，不开玩笑。",
        "强吐槽如“你想屁吃”只允许作为极端 reality_broken 的低频彩蛋，不要默认输出；ask_one_question 和 boundary_stop 禁止使用。"
      ].join("\n")
    },
    {
      role: "user",
      content: [
        "请判断下面输入能不能进入 IdeaRoast 的 5 步小人替身预演。",
        "",
        "# 用户输入",
        input,
        "",
        "# 本地 gate 参考",
        JSON.stringify(localShape, null, 2),
        "",
        "# 只输出这个 JSON 形状",
        JSON.stringify({
          verdict: "can_run | ask_one_question | scope_too_large | reality_broken | boundary_stop",
          doorwayLine: "一句给前台用的小人话",
          reason: "一句人话原因",
          question: "如果要停在门口，给用户的一句补问或改写入口；can_run 时可以为空",
          rewriteOptions: [
            { title: "可选入口 1", body: "一句话" },
            { title: "可选入口 2", body: "一句话" }
          ]
        }, null, 2),
        "",
        "# 判断例子",
        "- 我想做个 UFO => ask_one_question，因为模型、游戏画面、视频特效、真实飞行器都没选。",
        "- 我想做 UFO 风格小游戏 => can_run。",
        "- 我想做 UFO 风格视频特效 => can_run。",
        "- 我想造一个真实 UFO 飞行器 => scope_too_large。",
        "- 我想做一个反重力 UFO => reality_broken。",
        "- 我想做个永动机 => reality_broken。",
        "- 我想做一个帮老板监控员工电脑屏幕的工具 => boundary_stop。",
        "",
        "# 语气例子",
        "- can_run：小人能背着它先走一圈，但会先把自动上传压成手动发布包。",
        "- ask_one_question：小人还不知道往哪走。你先告诉它：这个工具具体帮谁做哪件事？",
        "- scope_too_large：小人背了一下，差点被完整 Jarvis 压扁。先拆一个能跑的小入口。",
        "- reality_broken：小人刚出门，物理定律把门锁了。这不是难，是脚下没路。",
        "- boundary_stop：这个不能当普通项目试走。这里涉及授权、隐私或合规边界，先停。",
        "",
        "# 禁止",
        "- 不要输出“综合分析”“建议你”“可行性较高”“根据以上分析”“你需要进一步明确”。",
        "- ask_one_question 不要用“你想屁吃”“做梦呢”等嘲讽。",
        "- boundary_stop 不要开玩笑，不要毒舌。",
        "- 不要把没有现实入口的东西包装成“先做 MVP”。"
      ].join("\n")
    }
  ];
}

export function normalizeDoorwayReview(rawReview) {
  const source = rawReview?.review && typeof rawReview.review === "object" ? rawReview.review : rawReview;
  const diagnostics = [];
  const verdict = String(source?.verdict || "").toLowerCase().trim();

  if (!DOORWAY_VERDICTS.has(verdict)) {
    diagnostics.push(`verdict must be one of ${[...DOORWAY_VERDICTS].join(", ")}, got ${source?.verdict || "missing"}.`);
  }

  const reason = textOrFallback(source?.reason, "");
  if (!reason && verdict !== "can_run") diagnostics.push("reason is missing.");
  const doorwayLine = textOrFallback(source?.doorwayLine, "");
  const question = textOrFallback(source?.question, "");
  const visibleDoorwayText = [
    doorwayLine,
    reason,
    question,
    ...(Array.isArray(source?.rewriteOptions)
      ? source.rewriteOptions.flatMap((item) => [item?.title, item?.body])
      : [])
  ].filter(Boolean).join("\n");

  const reportToneHit = REPORT_TONE_PATTERNS.find((pattern) => pattern.test(visibleDoorwayText));
  if (reportToneHit) diagnostics.push(`doorway text contains report tone: ${reportToneHit}.`);

  if (verdict === "ask_one_question") {
    const harshHit = DOORWAY_HARSH_JOKE_PATTERNS.find((pattern) => pattern.test(visibleDoorwayText));
    if (harshHit) diagnostics.push(`ask_one_question doorway text must not mock the user: ${harshHit}.`);
  }

  if (verdict === "boundary_stop") {
    const boundaryJokeHit = DOORWAY_BOUNDARY_JOKE_PATTERNS.find((pattern) => pattern.test(visibleDoorwayText));
    if (boundaryJokeHit) diagnostics.push(`boundary_stop doorway text must stay serious: ${boundaryJokeHit}.`);
  }

  if (diagnostics.length > 0) {
    return { ok: false, diagnostics };
  }

  const rewriteOptions = Array.isArray(source?.rewriteOptions)
    ? source.rewriteOptions
      .filter((item) => item && typeof item === "object")
      .slice(0, 3)
      .map((item) => ({
        title: textOrFallback(item.title, "可选入口"),
        body: textOrFallback(item.body, "")
      }))
      .filter((item) => item.body)
    : [];

  return {
    ok: true,
    review: {
      verdict,
      doorwayLine,
      reason: reason || "可以先让小人走一圈。",
      question,
      rewriteOptions
    }
  };
}

export function buildShadowMessages({ input, localPacket }) {
  const localShape = {
    idea: localPacket.idea,
    clarityGate: localPacket.clarityGate,
    path: localPacket.path,
    selectedFrictionIds: localPacket.selectedFrictionIds,
    localStepTitles: (localPacket.frictionBites || []).map((bite) => bite.stepTitle),
    localFinal: {
      strongestBranch: localPacket.verdict?.strongestBranch,
      survivalReason: localPacket.verdict?.survivalReason,
      smallestValidation: localPacket.verdict?.smallestValidation
    }
  };

  return [
    {
      role: "system",
      content: [
        "你是 IdeaRoast 的 DeepSeek shadow runtime，只生成候选小人试走包，不接管页面。",
        "你不是创业顾问，不是报告作者，不要写 markdown，不要输出长文。",
        "你是一个替用户背着想法先走一圈的小人，用人话记录 5 步低成本替身预演。",
        "必须输出合法 JSON object。JSON 顶层只能包含 path, verdict, frictionBites。",
        "禁止报告腔：不要出现“综合分析”“建议你”“可行性较强”“可行性较高”“风险较高”“根据以上分析”。",
        "不要新增产品字段，不要写 API、runtime、多智能体或自动执行方案。"
      ].join("\n")
    },
    {
      role: "user",
      content: [
        "请为下面输入生成一份 JSON shadow candidate。只输出 JSON，不要 Markdown。",
        "",
        "# 用户输入",
        input,
        "",
        "# 本地 gate 与 packet 参考",
        JSON.stringify(localShape, null, 2),
        "",
        "# JSON 形状",
        JSON.stringify({
          path: {
            minimumResult: "小人带回来的幸存版本",
            validation: "现在最小试走动作"
          },
          verdict: {
            strongestBranch: "小人带回来的幸存版本",
            survivalReason: "为什么它活下来",
            smallestValidation: "现在最小试走动作",
            abandonedRoutes: ["小人放下的重路线 1", "小人放下的重路线 2"],
            branchOptions: ["小人看见的旁路 1", "小人看见的旁路 2"]
          },
          frictionBites: [
            {
              stepNumber: 1,
              stepTitle: "第 1 步：小人尝试...",
              frictionType: "表达/第一步摩擦",
              currentSurvivingRoute: "原始想法：...",
              sceneLine: "本轮发生了什么：...",
              stepPurpose: "这一轮的目的：...",
              agentAttempt: "小人具体尝试了什么。",
              realityFeedback: "现实怎么压它。",
              routeChange: {
                from: "原始想法：...",
                to: "第一步后留下的幸存路线",
                summary: "路线变化一句话。"
              },
              verdict: "mutate",
              nextMove: "带着什么继续走。",
              plainTake: "小人说的人话。",
              bubble: "短气泡。"
            }
          ]
        }, null, 2),
        "",
        "# 强约束",
        "- frictionBites 必须正好 5 步。",
        "- 每一步必须有 sceneLine、stepPurpose、currentSurvivingRoute、realityFeedback、routeChange、verdict。",
        "- verdict 只能是 continue / mutate / branch / stop 之一。",
        "- 连续性必须清楚：第 2 步的 currentSurvivingRoute 必须等于第 1 步 routeChange.to；后面同理。",
        "- 最后 verdict.strongestBranch 必须等于第 5 步 routeChange.to。",
        "- path.minimumResult 必须等于 verdict.strongestBranch。",
        "- path.validation 必须等于 verdict.smallestValidation。",
        "- 内容必须贴住用户输入里的对象和动作，不要只说“做一个最小版本”“验证需求”。"
      ].join("\n")
    }
  ];
}

export function normalizeShadowCandidate(rawCandidate, localPacket) {
  const diagnostics = [];
  const source = rawCandidate?.candidate && typeof rawCandidate.candidate === "object"
    ? rawCandidate.candidate
    : rawCandidate;
  const localBites = localPacket.frictionBites || [];
  const bites = Array.isArray(source?.frictionBites) ? source.frictionBites : [];
  const verdict = source?.verdict || {};
  const path = source?.path || {};

  if (bites.length !== 5) diagnostics.push(`frictionBites length must be 5, got ${bites.length}.`);
  if (!verdict.strongestBranch) diagnostics.push("verdict.strongestBranch is missing.");
  if (!verdict.survivalReason) diagnostics.push("verdict.survivalReason is missing.");
  if (!verdict.smallestValidation) diagnostics.push("verdict.smallestValidation is missing.");

  const normalizedBites = bites.map((bite, index) => normalizeShadowBite(bite, localBites[index], index, diagnostics));
  validateContinuity(normalizedBites, verdict, path, diagnostics);
  validateToneAndSpecificity({ localPacket, path, verdict, bites: normalizedBites }, diagnostics);

  if (diagnostics.length > 0) {
    return { ok: false, diagnostics };
  }

  const candidate = {
    ...structuredClone(localPacket),
    id: `${localPacket.id || "custom"}-deepseek-shadow`,
    label: `${localPacket.label || "自定义"} · DeepSeek shadow`,
    path: {
      ...localPacket.path,
      minimumResult: path.minimumResult || verdict.strongestBranch,
      validation: path.validation || verdict.smallestValidation
    },
    verdict: {
      ...localPacket.verdict,
      strongestBranch: verdict.strongestBranch,
      survivalReason: verdict.survivalReason,
      smallestValidation: verdict.smallestValidation,
      abandonedRoutes: Array.isArray(verdict.abandonedRoutes) ? verdict.abandonedRoutes.slice(0, 4) : localPacket.verdict?.abandonedRoutes || [],
      branchOptions: Array.isArray(verdict.branchOptions) ? verdict.branchOptions.slice(0, 4) : localPacket.verdict?.branchOptions || []
    },
    frictionBites: normalizedBites
  };

  return { ok: true, candidate, diagnostics: ["candidate_valid"] };
}

function normalizeShadowBite(bite, localBite = {}, index, diagnostics) {
  const stepNumber = index + 1;
  const routeChange = bite?.routeChange || {};
  const rawRequired = {
    stepTitle: bite?.stepTitle,
    currentSurvivingRoute: bite?.currentSurvivingRoute,
    sceneLine: bite?.sceneLine,
    stepPurpose: bite?.stepPurpose,
    realityFeedback: bite?.realityFeedback,
    "routeChange.from": routeChange.from,
    "routeChange.to": routeChange.to,
    "routeChange.summary": routeChange.summary,
    verdict: bite?.verdict
  };
  Object.entries(rawRequired).forEach(([field, value]) => {
    if (!textOrFallback(value, "")) diagnostics.push(`step ${stepNumber} missing ${field}.`);
  });

  const normalized = {
    ...localBite,
    stepNumber,
    stepTitle: textOrFallback(bite?.stepTitle, localBite.stepTitle || `第 ${stepNumber} 步：小人试走`),
    frictionType: textOrFallback(bite?.frictionType, localBite.frictionType || localBite.lens || "现实摩擦"),
    currentSurvivingRoute: textOrFallback(bite?.currentSurvivingRoute, localBite.currentSurvivingRoute),
    sceneLine: textOrFallback(bite?.sceneLine, localBite.sceneLine || bite?.agentAttempt),
    stepPurpose: textOrFallback(bite?.stepPurpose, localBite.stepPurpose),
    agentAttempt: textOrFallback(bite?.agentAttempt, localBite.agentAttempt || bite?.sceneLine),
    realityFeedback: textOrFallback(bite?.realityFeedback, localBite.realityFeedback),
    routeChange: {
      from: textOrFallback(routeChange.from, localBite.routeChange?.from),
      to: textOrFallback(routeChange.to, localBite.routeChange?.to || bite?.nextMove),
      summary: textOrFallback(routeChange.summary, localBite.routeChange?.summary)
    },
    verdict: ROUTE_VERDICTS.has(bite?.verdict) ? bite.verdict : localBite.verdict || "mutate",
    nextMove: textOrFallback(bite?.nextMove, localBite.nextMove || routeChange.to),
    plainTake: textOrFallback(bite?.plainTake, localBite.plainTake || bite?.sceneLine),
    bubble: textOrFallback(bite?.bubble, localBite.bubble || bite?.plainTake),
    evidenceStatus: bite?.evidenceStatus || localBite.evidenceStatus || "opinion"
  };

  return normalized;
}

function validateContinuity(bites, verdict, path, diagnostics) {
  bites.forEach((bite, index) => {
    if (index === 0) return;
    const previousRoute = normalizeRouteText(bites[index - 1]?.routeChange?.to);
    const currentRoute = normalizeRouteText(bite.currentSurvivingRoute);
    const fromRoute = normalizeRouteText(bite.routeChange?.from);
    if (previousRoute && currentRoute !== previousRoute) {
      diagnostics.push(`step ${index + 1} currentSurvivingRoute is not continuous with previous route.`);
    }
    if (previousRoute && fromRoute && fromRoute !== previousRoute) {
      diagnostics.push(`step ${index + 1} routeChange.from is not continuous with previous route.`);
    }
  });

  const finalRoute = normalizeRouteText(bites[bites.length - 1]?.routeChange?.to);
  if (finalRoute && normalizeRouteText(verdict.strongestBranch) !== finalRoute) {
    diagnostics.push("verdict.strongestBranch must equal step 5 routeChange.to.");
  }

  if (normalizeRouteText(path.minimumResult) && normalizeRouteText(path.minimumResult) !== normalizeRouteText(verdict.strongestBranch)) {
    diagnostics.push("path.minimumResult must equal verdict.strongestBranch.");
  }

  if (normalizeRouteText(path.validation) && normalizeRouteText(path.validation) !== normalizeRouteText(verdict.smallestValidation)) {
    diagnostics.push("path.validation must equal verdict.smallestValidation.");
  }
}

function validateToneAndSpecificity({ localPacket, path, verdict, bites }, diagnostics) {
  const input = localPacket.idea?.input || localPacket.idea?.pitch || "";
  const fullText = JSON.stringify({ path, verdict, bites });
  REPORT_TONE_PATTERNS.forEach((pattern) => {
    if (pattern.test(fullText)) diagnostics.push(`report tone phrase found: ${pattern.source}`);
  });

  const finalText = [verdict.strongestBranch, verdict.smallestValidation].join("\n");
  const genericHit = GENERIC_PATTERNS.some((pattern) => pattern.test(finalText));
  if (genericHit && !hasInputAnchor(finalText, input, localPacket.idea?.name || "")) {
    diagnostics.push("final survivor/action is too generic and not anchored to input.");
  }
}

function textOrFallback(value, fallback = "") {
  const text = String(value || "").trim();
  return text || String(fallback || "").trim();
}

function normalizeRouteText(value) {
  return String(value || "").replace(/\s+/g, "").replace(/[。.!！?？]+$/g, "");
}

function hasInputAnchor(text, input, ideaName) {
  const haystack = String(text || "").toLowerCase();
  if (ideaName && haystack.includes(String(ideaName).replace(/\.\.\.$/, "").toLowerCase())) return true;
  const asciiTokens = String(input || "").match(/[A-Za-z][A-Za-z0-9+-]{1,}/g) || [];
  if (asciiTokens.some((token) => haystack.includes(token.toLowerCase()))) return true;
  const chineseTokens = String(input || "").match(/[\u4e00-\u9fff]{2,}/g) || [];
  return chineseTokens.some((token) => token.length <= 12 && haystack.includes(token));
}
