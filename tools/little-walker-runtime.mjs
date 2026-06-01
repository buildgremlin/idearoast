import { isRunnableForShadow } from "./deepseek-shadow-runtime.mjs";
import { validateLittleWalkerPacket } from "./validate-little-walker-packet.mjs";

export async function runDeepSeekLittleWalkerPacket({
  input,
  localPacket,
  apiKey,
  model = "deepseek-v4-flash",
  baseUrl = "https://api.deepseek.com",
  timeoutMs = 180000
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
        messages: buildLittleWalkerPacketMessages({ input, localPacket }),
        response_format: { type: "json_object" },
        temperature: 0.25,
        max_tokens: 3200,
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

  let packetJson;
  try {
    packetJson = JSON.parse(content);
  } catch {
    return {
      ok: false,
      reason: "content_not_json",
      rawContent: String(content).slice(0, 1800),
      usage: payload?.usage || null
    };
  }

  const normalized = normalizeLittleWalkerPacketCandidate(packetJson, localPacket, { demoFirst: true });
  if (!normalized.ok) {
    return {
      ok: false,
      reason: "packet_invalid",
      diagnostics: normalized.diagnostics,
      packetMode: "failed",
      normalizationChanges: normalized.normalizationChanges,
      fallbackChanges: normalized.fallbackChanges,
      rawPacket: normalized.packet,
      summary: summarizeLittleWalkerPacket(normalized.packet, normalized.diagnostics),
      usage: payload?.usage || null
    };
  }

  return {
    ok: true,
    packet_valid: true,
    model,
    gateStatus: localPacket.clarityGate.status,
    packetMode: normalized.packetMode,
    normalizationChanges: normalized.normalizationChanges,
    fallbackChanges: normalized.fallbackChanges,
    packet: normalized.packet,
    summary: summarizeLittleWalkerPacket(normalized.packet, []),
    diagnostics: ["packet_valid"],
    usage: payload?.usage || null
  };
}

export function normalizeLittleWalkerPacketCandidate(rawCandidate, localPacket = {}, options = {}) {
  const source = rawCandidate?.packet && typeof rawCandidate.packet === "object"
    ? rawCandidate.packet
    : rawCandidate?.candidate && typeof rawCandidate.candidate === "object"
      ? rawCandidate.candidate
      : rawCandidate;

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return {
      ok: false,
      packet: source,
      diagnostics: ["packet must be an object."],
      packetMode: "failed",
      normalizationChanges: [],
      fallbackChanges: []
    };
  }

  const rawSourcePacket = structuredClone(source);
  const rawDiagnostics = validateRuntimePacketCandidate(rawSourcePacket, localPacket, options);
  if (rawDiagnostics.length === 0) {
    return {
      ok: true,
      packet: rawSourcePacket,
      diagnostics: [],
      packetMode: "raw_pass",
      normalizationChanges: [],
      fallbackChanges: []
    };
  }

  const packet = structuredClone(source);
  const normalizationChanges = [];
  const fallbackChanges = [];

  normalizationChanges.push(...normalizeRuntimeDemoFirstPacket(packet));

  let validation = validateLittleWalkerPacket(packet);
  fallbackChanges.push(...repairRuntimeSceneLinesFromDiagnostics(packet, validation.diagnostics));
  if (fallbackChanges.length > 0) {
    validation = validateLittleWalkerPacket(packet);
  }

  const diagnostics = validateRuntimePacketCandidate(packet, localPacket, options, validation);

  return {
    ok: diagnostics.length === 0,
    packet,
    diagnostics,
    packetMode: diagnostics.length > 0
      ? "failed"
      : fallbackChanges.length > 0
        ? "fallback_pass"
        : normalizationChanges.length > 0
          ? "normalized_pass"
          : "failed",
    normalizationChanges,
    fallbackChanges
  };
}

function validateRuntimePacketCandidate(packet, localPacket = {}, options = {}, precomputedValidation = null) {
  const diagnostics = [];
  const input = localPacket?.idea?.input || localPacket?.idea?.pitch || "";
  if (input && normalizeText(packet.originalInput) !== normalizeText(input)) {
    diagnostics.push("originalInput must equal the local input.");
  }

  if (localPacket?.clarityGate?.status && isRunnableForShadow(localPacket) && packet.doorway?.status !== "can_run") {
    diagnostics.push("ready / usable local input must produce doorway.status can_run.");
  }

  const validation = precomputedValidation || validateLittleWalkerPacket(packet);
  diagnostics.push(...validation.diagnostics);
  if (options.demoFirst) {
    validateRuntimeDemoFirstAction(packet, diagnostics);
  }
  diagnostics.push(...validateReadableLittleWalkerSummary(buildReadableLittleWalkerSummary(packet), packet));

  return diagnostics;
}

function normalizeRuntimeDemoFirstPacket(packet) {
  const changes = [];
  const input = String(packet?.originalInput || "");
  if (/语音|控制电脑|打开软件/.test(input)) {
    changes.push(...normalizeVoiceControlDemoFirstPacket(packet));
  }
  if (/README/.test(input) && /教程/.test(input)) {
    changes.push(...normalizeReadmeTutorialAnchors(packet));
  }
  return changes;
}

function normalizeVoiceControlDemoFirstPacket(packet) {
  const changes = [];
  const steps = Array.isArray(packet?.walk?.steps) ? packet.walk.steps : [];
  const firstStep = steps[0];
  if (firstStep && /(语音\s*API|语音API|权限系统|系统权限|权限文档|SpeechRecognition|完整的语音识别|先搭一套完整)/i.test(firstStep.sceneLine || "")) {
    const routeTo = firstStep.routeChange?.to || firstStep.nextCarry || "先只试“用一句语音打开一个指定软件”";
    firstStep.sceneLine = `小人以为语音控制电脑打开软件先要证明一句固定命令能触发真实动作，于是先不用语音识别和权限系统，只把“打开计算器”当成固定输入，手动触发打开一个指定软件。结果发现命令能跑通，但还没有语音入口，也不知道是否比快捷键更快；于是路线缩成：${routeTo}。`;
    firstStep.tinyAction = "先把“打开计算器”当成固定输入，手动触发打开一个指定软件";
    firstStep.realityHit = "固定命令能打开软件，但还没有语音入口，也不知道是否比快捷键更快";
    if (firstStep.routeChange) {
      firstStep.routeChange.why = "先绕开语音识别和权限系统，只证明固定命令能触发真实打开软件动作";
    }
    changes.push("normalized voice-control first step to fixed-command demo-first sceneLine.");
  }

  const action = String(packet?.result?.nextTinyAction || "");
  if (/(找\s*\d+\s*个|找几个|用户|调研|访谈|试用|连续\s*\d+\s*天|观察)/.test(action) && !/(今天|先写死|写死|固定命令|本地|demo|脚本|跑通|命令)/i.test(action)) {
    packet.result.nextTinyAction = "今天先写死 3 条语音命令：打开浏览器、打开记事本、打开计算器；用本地脚本把固定命令映射到指定软件，连续试 5 次，看是否 4 次能在 3 秒内打开正确软件。";
    changes.push("normalized voice-control nextTinyAction to local fixed-command demo.");
  }
  return changes;
}

function normalizeReadmeTutorialAnchors(packet) {
  const changes = [];
  const result = packet?.result;
  if (!result) return changes;
  const resultText = [
    result.survivor,
    result.whySurvived,
    result.nextTinyAction
  ].join("\n");
  if (/README/.test(resultText) && /教程/.test(resultText)) return changes;

  const previousSurvivor = String(result.survivor || "");
  const anchoredSurvivor = withReadmeTutorialAnchor(previousSurvivor || "README 新手使用教程");
  result.survivor = anchoredSurvivor;
  result.whySurvived = withReadmeTutorialAnchor(result.whySurvived || "它只保留 README 到新手使用教程的核心动作。");
  result.nextTinyAction = withReadmeTutorialAnchor(result.nextTinyAction || "今天手动把一个 README 整理成一页新手使用教程。");

  const steps = Array.isArray(packet?.walk?.steps) ? packet.walk.steps : [];
  const finalStep = steps[4];
  if (finalStep?.routeChange) finalStep.routeChange.to = anchoredSurvivor;
  if (finalStep) finalStep.nextCarry = anchoredSurvivor;
  if (Array.isArray(result.routeTrace) && result.routeTrace.length >= 6) {
    result.routeTrace[5] = anchoredSurvivor;
  }
  changes.push("normalized README result anchors to keep README / 教程 visible.");
  return changes;
}

function withReadmeTutorialAnchor(value) {
  const text = String(value || "");
  if (/README/.test(text) && /教程/.test(text)) return text;
  if (/README/.test(text) && /指南/.test(text)) return text.replace(/指南/g, "教程指南");
  if (/README/.test(text)) return `${text}（README 使用教程）`;
  if (/教程/.test(text)) return `README ${text}`;
  return `README 使用教程：${text}`;
}

function repairRuntimeSceneLinesFromDiagnostics(packet, diagnostics = []) {
  const steps = Array.isArray(packet?.walk?.steps) ? packet.walk.steps : [];
  const indexes = new Set();
  diagnostics.forEach((diagnostic) => {
    const match = String(diagnostic).match(/^step\s+(\d+)\s+sceneLine\s+(?:must show assumption break|is too abstract)/);
    if (match) indexes.add(Number(match[1]) - 1);
  });

  indexes.forEach((index) => {
    const step = steps[index];
    if (!step) return;
    step.sceneLine = buildRuntimeFallbackSceneLine(packet, step, index);
  });

  return [...indexes].map((index) => `fallback rebuilt sceneLine for step ${index + 1} from tinyAction / realityHit / routeChange.`);
}

function buildRuntimeFallbackSceneLine(packet, step, index) {
  const routeFrom = cleanRouteText(step?.currentSurvivingRoute || step?.routeChange?.from || packet?.originalInput || "当前路线");
  const routeTo = cleanRouteText(step?.routeChange?.to || step?.nextCarry || packet?.result?.survivor || "更小的路线");
  const action = cleanSceneFragment(step?.tinyAction || `试走「${routeFrom}」`);
  const reality = cleanSceneFragment(step?.realityHit || step?.routeChange?.why || "现实反馈不支持这个默认以为");
  const why = cleanSceneFragment(step?.routeChange?.why || "这一步把路线继续压小");
  const prefix = index === 0 ? "小人原本以为" : "小人以为";

  return `${prefix}「${routeFrom}」已经够小，于是真的${ensureActionVerb(action)}。结果${reality}，这个以为被现实打破；于是路线缩成「${routeTo}」。留下它的原因是：${why}`;
}

function ensureActionVerb(action) {
  const text = String(action || "").trim();
  if (/^(试|做|写|录|发|输入|打开|手动|拿|用|发布|整理|生成|粘贴|运行)/.test(text)) return text;
  return `试了${text}`;
}

function cleanSceneFragment(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[。；;]+$/g, "")
    .trim();
}

export function summarizeLittleWalkerPacket(packet, diagnostics = []) {
  const steps = Array.isArray(packet?.walk?.steps) ? packet.walk.steps : [];
  const sceneLines = steps.map((step) => step?.sceneLine || "").filter(Boolean).slice(0, 5);
  const readableSummary = buildReadableLittleWalkerSummary(packet);
  return {
    packet_valid: diagnostics.length === 0,
    survivor: packet?.result?.survivor || "",
    whySurvived: packet?.result?.whySurvived || "",
    nextTinyAction: packet?.result?.nextTinyAction || "",
    readableSummary,
    sceneLines,
    previewQuality: buildPreviewQualityReport(packet, readableSummary, sceneLines),
    validatorDiagnostics: diagnostics
  };
}

export function buildPreviewQualityReport(packet, readableSummary = buildReadableLittleWalkerSummary(packet), sceneLines = []) {
  const warnings = [
    ...detectExampleDrift(packet, readableSummary, sceneLines),
    ...detectActionMismatch(packet, readableSummary, sceneLines),
    ...detectAnchorDrift(packet, readableSummary, sceneLines),
    ...detectPlatformDataRisk(packet, readableSummary, sceneLines)
  ];
  const deduped = dedupeQualityWarnings(warnings);

  return {
    status: deduped.length > 0 ? "warning" : "clean",
    labels: uniqueStrings(deduped.map((warning) => warning.type)),
    warnings: deduped
  };
}

function detectExampleDrift(packet, readableSummary, sceneLines) {
  const summaryExamples = extractExampleObjects([
    readableSummary?.comebackLine,
    readableSummary?.tonightActionCard?.input,
    readableSummary?.tonightActionCard?.output,
    readableSummary?.tonightActionCard?.passCriteria
  ].join("\n"));
  const sceneExamples = extractExampleObjects(sceneLines.join("\n"));
  if (summaryExamples.length === 0 || sceneExamples.length === 0) return [];

  const mismatches = [];
  summaryExamples.forEach((summaryExample) => {
    sceneExamples.forEach((sceneExample) => {
      if (areSimilarExampleObjects(summaryExample, sceneExample)) return;
      if (!isLikelyDifferentExample(summaryExample, sceneExample)) return;
      mismatches.push({
        type: "example_drift",
        message: `summary example「${summaryExample}」和 sceneLine example「${sceneExample}」不是同一个试走对象。`,
        evidence: [
          `summary / tonightActionCard: ${summaryExample}`,
          `sceneLine: ${sceneExample}`
        ]
      });
    });
  });

  return mismatches.slice(0, 2);
}

function extractExampleObjects(text) {
  const source = String(text || "");
  const quoted = [
    ...source.matchAll(/[“「"]([^”」"]{4,80})[”」"]/g)
  ].map((match) => cleanExampleObject(match[1]));
  const explicitExamples = [
    ...source.matchAll(/例如[:：]\s*([^。；;\n]{4,80})/g)
  ].map((match) => cleanExampleObject(match[1]));

  return uniqueStrings([...quoted, ...explicitExamples])
    .filter(isSpecificExampleObject)
    .slice(0, 8);
}

function cleanExampleObject(value) {
  return String(value || "")
    .replace(/[。；;，,]+$/g, "")
    .replace(/^比如[:：]\s*/, "")
    .trim();
}

function isSpecificExampleObject(value) {
  const text = String(value || "");
  if (text.length < 5) return false;
  if (/^(凭什么|会火\s*\/\s*不会火|不会火|会火|3分钟|一键生成|模板|大家好|这个选题会火|这个选题不会火)$/.test(text)) return false;
  if (/^(今晚验证动作卡|第一步验证动作卡|动作\+判断标准|动作标题|所需工具|预计耗时|复制即用提示词)$/.test(text)) return false;
  return /(AI|ChatGPT|Codex|工具|插件|周报|代码|注释|VSCode|会议|纪要|简历|写作|选题|标题|猫|太空|绘图|程序员|创作者|小红书|GitHub|Google Forms|landing page|landing)/i.test(text);
}

function areSimilarExampleObjects(a, b) {
  const left = normalizeQualityText(a);
  const right = normalizeQualityText(b);
  if (!left || !right) return true;
  if (left.includes(right) || right.includes(left)) return true;
  const leftTokens = qualityTokens(left);
  const rightTokens = qualityTokens(right);
  const overlap = leftTokens.filter((token) => rightTokens.includes(token));
  return overlap.length >= 2;
}

function isLikelyDifferentExample(a, b) {
  const left = normalizeQualityText(a);
  const right = normalizeQualityText(b);
  if (!left || !right) return false;
  if (/周报/.test(left) && !/周报/.test(right)) return true;
  if (/代码|注释|VSCode|插件/i.test(left) !== /代码|注释|VSCode|插件/i.test(right)) return true;
  if (/绘图|猫|太空/.test(left) !== /绘图|猫|太空/.test(right)) return true;
  if (/会议|纪要/.test(left) !== /会议|纪要/.test(right)) return true;
  if (/简历/.test(left) !== /简历/.test(right)) return true;
  if (/写作助手/.test(left) !== /写作助手/.test(right)) return true;
  return qualityTokens(left).length > 0 && qualityTokens(right).length > 0 && !areSimilarExampleObjects(left, right);
}

function detectActionMismatch(packet, readableSummary, sceneLines) {
  const actionText = [
    readableSummary?.tonightActionCard?.output,
    readableSummary?.tonightActionCard?.passCriteria
  ].join("\n");
  const finalText = [
    packet?.result?.survivor,
    packet?.result?.nextTinyAction,
    sceneLines[sceneLines.length - 1] || ""
  ].join("\n");
  const actionArtifact = classifyPreviewArtifact(actionText);
  const finalArtifact = classifyPreviewArtifact(finalText);

  if (!actionArtifact || !finalArtifact || actionArtifact === finalArtifact) return [];
  return [{
    type: "action_mismatch",
    message: `tonightActionCard 指向「${actionArtifact}」，但最终 sceneLine / survivor 指向「${finalArtifact}」。`,
    evidence: [
      `tonightActionCard: ${compactQualityEvidence(actionText)}`,
      `final sceneLine / survivor: ${compactQualityEvidence(finalText)}`
    ]
  }];
}

function classifyPreviewArtifact(text) {
  const value = String(text || "");
  if (/验证动作卡|4\s*行|发给谁|问对方什么|反馈/.test(value)) return "validation_action_card";
  if (/短视频|视频草稿|20-45\s*秒|20\s*秒|录屏|剪映|CapCut/.test(value)) return "short_video_draft";
  if (/半自动判断表|判断表|3\s*列|标题钩子|评论区.*是否继续/.test(value)) return "topic_judgment_table";
  if (/标题建议|高点击率标题|3\s*个.*标题/.test(value)) return "title_suggestion";
  if (/选题改写卡|改题建议|3\s*个判断理由/.test(value)) return "topic_rewrite_card";
  if (/本地\s*demo|脚本|固定命令/.test(value)) return "local_demo";
  if (/README|教程/.test(value)) return "readme_tutorial";
  if (/追问|书摘/.test(value)) return "reading_prompt";
  return "";
}

function detectAnchorDrift(packet, readableSummary, sceneLines) {
  const input = String(packet?.originalInput || "");
  const visibleText = [
    readableSummary?.comebackLine,
    readableSummary?.tonightActionCard?.input,
    readableSummary?.tonightActionCard?.output,
    ...((readableSummary?.stumbleCards || []).flatMap((card) => [card?.youAssumed, card?.realityBroke, card?.soShrinkTo])),
    ...sceneLines,
    packet?.result?.survivor,
    packet?.result?.nextTinyAction
  ].join("\n");
  const anchorGroups = getPreviewAnchorGroups(input);
  const missingGroups = anchorGroups.filter((group) => !group.tokens.some((token) => includesLooseQuality(visibleText, token)));
  if (missingGroups.length === 0) return [];

  return [{
    type: "anchor_drift",
    message: `用户输入里的核心锚点在 preview 文本里变弱：${missingGroups.map((group) => group.label).join(" / ")}。`,
    evidence: [
      `originalInput: ${input}`,
      `missing anchors: ${missingGroups.map((group) => group.tokens.join("|")).join(" ; ")}`
    ]
  }];
}

function getPreviewAnchorGroups(input) {
  const text = String(input || "");
  const groups = [];
  if (/独立开发者/.test(text)) groups.push({ label: "目标人群：独立开发者", tokens: ["独立开发者"] });
  if (/产品想法/.test(text)) groups.push({ label: "对象：产品想法", tokens: ["产品想法", "想法"] });
  if (/验证动作|第一步/.test(text)) groups.push({ label: "动作：第一步验证动作", tokens: ["验证动作", "第一步", "今晚"] });
  if (/短视频账号|短视频/.test(text)) groups.push({ label: "对象：短视频账号", tokens: ["短视频", "视频", "账号"] });
  if (/AI\s*工具|AI 工具/.test(text)) groups.push({ label: "对象：AI 工具", tokens: ["AI 工具", "AI", "工具"] });
  if (/创作者/.test(text)) groups.push({ label: "目标人群：创作者", tokens: ["创作者"] });
  if (/选题/.test(text)) groups.push({ label: "动作：选题判断", tokens: ["选题", "标题", "题"] });
  if (/会不会有人看/.test(text)) groups.push({ label: "目标：是否有人看", tokens: ["有人看", "看", "播放", "观众"] });
  return groups;
}

function detectPlatformDataRisk(packet, readableSummary, sceneLines) {
  const text = [
    readableSummary?.comebackLine,
    readableSummary?.tonightActionCard?.input,
    readableSummary?.tonightActionCard?.output,
    ...sceneLines,
    packet?.result?.nextTinyAction
  ].join("\n");
  const hasPlatformData = /(小红书|抖音|B\s*站|哔哩哔哩|知乎|GitHub).{0,30}(数据|点赞|评论|高频词|搜|搜索|记录|笔记|issue|公开)/i.test(text)
    || /(数据|点赞|评论|高频词|搜|搜索|记录|笔记|issue|公开).{0,30}(小红书|抖音|B\s*站|哔哩哔哩|知乎|GitHub)/i.test(text);
  if (!hasPlatformData) return [];

  const hasUnsafeAutomation = /(爬虫|爬取|抓取|采集|自动抓|自动采|批量抓|绕过)/i.test(text);
  const hasCollectionIntent = /(搜索|搜|记录|收集|整理|提取|导出|观察|采集|抓取|爬取|爬虫|高频词|爆款笔记|公开内容|公开样本|平台数据)/i.test(text);
  if (!hasUnsafeAutomation && !hasCollectionIntent) return [];

  const hasSafeContext = /(手动|公开|用户提供|用户自带|用户自己提供|自有数据|合规\s*API|官方\s*API|注明数据来源|不爬虫|不做自动抓取|不写爬虫)/i.test(text);
  if (!hasUnsafeAutomation && hasSafeContext) return [];

  return [{
    type: "platform_data_risk",
    message: "preview 里出现平台数据采集倾向，但没有足够明确手动观察公开内容、用户自带样本或合规 API。",
    evidence: [compactQualityEvidence(text)]
  }];
}

function dedupeQualityWarnings(warnings) {
  const seen = new Set();
  return warnings.filter((warning) => {
    const key = `${warning.type}:${warning.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 5);
}

function normalizeQualityText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[“”"「」'‘’：:，,。；;（）()]/g, "")
    .trim();
}

function qualityTokens(value) {
  const text = String(value || "");
  const tokens = ["ai", "chatgpt", "codex", "工具", "插件", "周报", "代码", "注释", "vscode", "会议", "纪要", "简历", "写作", "选题", "标题", "绘图", "小红书", "github", "程序员", "创作者"];
  return tokens.filter((token) => text.includes(token));
}

function compactQualityEvidence(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

function uniqueStrings(items) {
  return [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];
}

function includesLooseQuality(text, token) {
  return normalizeQualityText(text).includes(normalizeQualityText(token));
}

export function buildReadableLittleWalkerSummary(packet) {
  const steps = Array.isArray(packet?.walk?.steps) ? packet.walk.steps : [];
  const stumbleCards = pickReadableStumbleSteps(steps).map((step, index) => buildStumbleCard(step, index, packet?.originalInput || ""));
  const tonightActionCard = buildTonightActionCard(packet);

  return {
    comebackLine: buildComebackLine(stumbleCards, tonightActionCard),
    stumbleCards,
    tonightActionCard
  };
}

function pickReadableStumbleSteps(steps) {
  const usableSteps = steps.filter(Boolean);
  if (usableSteps.length <= 3) return usableSteps;

  const scored = usableSteps.map((step, index) => ({
    step,
    index,
    score: getStumbleScore(step)
  }));

  const pickedIndexes = new Set(
    scored
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, 3)
      .map((item) => item.index)
  );

  [0, Math.floor((usableSteps.length - 1) / 2), usableSteps.length - 1].forEach((index) => {
    if (pickedIndexes.size < 3) pickedIndexes.add(index);
  });

  return [...pickedIndexes]
    .sort((a, b) => a - b)
    .slice(0, 3)
    .map((index) => usableSteps[index]);
}

function getStumbleScore(step) {
  const text = [
    step?.sceneLine,
    step?.realityHit,
    step?.routeChange?.why
  ].join("\n");
  const weightedTokens = [
    ["正确废话", 8],
    ["打开哪个工具", 8],
    ["不知道今晚", 8],
    ["凭什么", 8],
    ["划走", 7],
    ["没钩子", 7],
    ["没有钩子", 7],
    ["不信", 6],
    ["不会复制", 6],
    ["复制到哪里", 6],
    ["自己重看", 6],
    ["太泛", 5],
    ["自动化太早", 5],
    ["延迟", 5],
    ["误识别", 5],
    ["没人", 4],
    ["成本", 3]
  ];

  return weightedTokens.reduce((score, [token, weight]) => score + (includesText(text, token) ? weight : 0), 0);
}

function buildStumbleCard(step, index, originalInput = "") {
  const sceneLine = String(step?.sceneLine || "");
  const realityHit = String(step?.realityHit || "");
  const routeTo = String(step?.routeChange?.to || step?.nextCarry || "");
  const title = inferStumbleTitle(sceneLine, realityHit, index);
  const realityBreak = pickRealityBreak(sceneLine, realityHit);
  const domainContent = inferDomainStumbleContent(originalInput, title, index);

  return {
    title: domainContent.title || title,
    youAssumed: completeReadableText(domainContent.youAssumed || extractAssumption(sceneLine) || step?.tinyAction || "这一步顺着做下去就会变清楚。"),
    realityBroke: completeReadableText(
      shouldUseDomainReality(realityBreak) && domainContent.realityBroke
        ? domainContent.realityBroke
        : realityBreak || domainContent.realityBroke || "现实没有按这个默认以为走。"
    ),
    soShrinkTo: completeReadableText(domainContent.soShrinkTo || inferReadableShrink(originalInput, title, routeTo, step?.routeChange?.why))
  };
}

function inferDomainStumbleContent(originalInput, title, index) {
  if (isIndieValidationInput(originalInput)) {
    const cards = [
      {
        title: "正确废话",
        youAssumed: "把一个真实产品想法丢给 AI，它就能直接吐出能开干的验证动作卡。",
        realityBroke: "AI 很容易写出“调研用户、做原型、收反馈”这类正确废话，独立开发者看完仍然不知道今晚先打开什么。",
        soShrinkTo: "一张今晚验证动作卡，卡里只保留 4 行：发给谁、问什么、要拿到什么反馈、什么情况算还能继续。"
      },
      {
        title: "卡片太满",
        youAssumed: "字段越完整越专业，用户就越容易照着做。",
        realityBroke: "字段一多，用户反而不知道从哪一行开始，也不知道要把卡复制到哪里用。",
        soShrinkTo: "一个复制即用的固定 prompt，加一个真实产品想法，只产出一张 4 行验证动作卡。"
      },
      {
        title: "自动化太早",
        youAssumed: "把拆解流程尽早做成系统，会比手动生成更像产品。",
        realityBroke: "手动生成已经能试出卡片有没有用，自动化会先吞掉登录、保存、模板和维护时间。",
        soShrinkTo: "先用 ChatGPT / Codex 手动跑 3 个真实产品想法，留下最清楚的一张验证动作卡，再决定要不要做页面。"
      }
    ];
    return cards[index] || cards[cards.length - 1];
  }

  if (isCreatorTopicInput(originalInput)) {
    const cards = [
      {
        title: "凭什么信你",
        youAssumed: "AI 直接告诉创作者“会火 / 不会火”，创作者就能做决定。",
        realityBroke: "创作者第一反应是“凭什么”，因为一个结论没有标题钩子、受众理由或评论区疑问支撑。",
        soShrinkTo: "一个半自动判断表：用户贴 5 个同类选题，AI 只输出标题钩子、评论区疑问和是否继续。"
      },
      {
        title: "全面反而空",
        youAssumed: "把受众、平台、热点和内容角度都算进去，判断就会更可靠。",
        realityBroke: "信息一多，输出变成泛泛评分，创作者仍然不知道今晚该改标题、开头还是选题角度。",
        soShrinkTo: "一张选题改写卡，只输出 3 个判断理由和 1 个改题建议，不直接下“会火 / 不会火”。"
      },
      {
        title: "数据太重",
        youAssumed: "接上平台数据，判断才会让人信服。",
        realityBroke: "平台数据来源、解释成本和合规边界会先变重，默认写爬虫还会把产品带偏。",
        soShrinkTo: "手动观察 10 条公开内容或使用用户提供样本，记录标题、点赞和评论区高频疑问，再跑固定判断表。"
      }
    ];
    return cards[index] || cards[cards.length - 1];
  }

  if (isContentIdea(originalInput)) {
    const cards = [
      {
        title: "开头留不住",
        youAssumed: "把 AI 工具的操作步骤讲完整，观众就会觉得有价值。",
        realityBroke: "自己重看前 3 秒都还没看到结果，观众更可能直接划走。",
        soShrinkTo: "一条 20-45 秒视频草稿，只讲一个 AI 工具动作前后的对比，前 3 秒先给结果或痛点。"
      },
      {
        title: "录屏太重",
        youAssumed: "教程越详细越专业，按钮、字幕和配音都讲清楚才算完整。",
        realityBroke: "录屏、字幕、剪辑和配音成本先压上来，重点反而被埋在流程里。",
        soShrinkTo: "一个手机录屏草稿，只保留 1 个动作、1 个前后对比和 1 句解释，不做完整教程。"
      },
      {
        title: "发出去不知道改哪",
        youAssumed: "发布后播放少，就说明账号方向不行。",
        realityBroke: "播放和评论更可能先暴露标题、开头或痛点没说清，不是整条路线马上判死。",
        soShrinkTo: "一张复盘小表，只记录标题、前 3 秒钩子、观众是否说出解决了什么问题。"
      }
    ];
    return cards[index] || cards[cards.length - 1];
  }

  return {};
}

function shouldUseDomainReality(value) {
  const text = String(value || "");
  if (!text) return true;
  if (/(关键依赖|权限|数据或流程|长期维护|单次运行成本|成熟产品|替代行为|已有习惯|现实没有按|反馈还不清楚)/.test(text)) return true;
  return !isConcreteRealityBreak(text);
}

function pickRealityBreak(sceneLine, realityHit) {
  const hit = cleanReadableText(realityHit);
  const extracted = extractRealityBreak(sceneLine);
  if (isConcreteRealityBreak(hit)) return hit;
  if (isConcreteRealityBreak(extracted)) return extracted;
  return hit || extracted;
}

function isConcreteRealityBreak(value) {
  const text = String(value || "");
  return /正确废话|打开哪个工具|不知道|不会|看不懂|凭什么|不信|划走|自己重看|没钩子|没有钩子|前\s*3\s*秒|前\s*10\s*秒|评论|播放|留存|完播|观众|用户|朋友|创作者|独立开发者|报错|懒得|复制|太长|记不住/.test(text);
}

function inferStumbleTitle(sceneLine, realityHit, index) {
  const text = `${sceneLine}\n${realityHit}`;
  if (includesText(text, "正确废话")) return "正确废话";
  if (includesText(text, "打开哪个工具") || includesText(text, "不知道今晚")) return "不知道先做啥";
  if (includesText(text, "凭什么")) return "凭什么信你";
  if (includesText(text, "划走") || includesText(text, "没钩子") || includesText(text, "没有钩子")) return "开头留不住";
  if (includesText(text, "不会复制") || includesText(text, "复制到哪里")) return "拿不到手";
  if (includesText(text, "自动化太早")) return "自动化太早";
  if (includesText(text, "延迟") || includesText(text, "误识别")) return "操作不顺";
  if (includesText(text, "数据") || includesText(text, "爬虫") || includesText(text, "抓取")) return "数据太重";
  return ["第一下就虚", "中途露馅", "最后变轻"][index] || "现实打脸";
}

function extractAssumption(sceneLine) {
  const text = normalizeInline(sceneLine);
  const match = text.match(/(?:小人)?(?:原本|本来|默认)?以为(.+?)(?:，?于是|，?所以|，?就|；|。)/);
  return cleanReadableText(match?.[1]);
}

function extractRealityBreak(sceneLine) {
  const text = normalizeInline(sceneLine);
  const match = text.match(/结果(?:现实(?:是|里)?[，,]?)?(.+?)(?:于是|所以|小人发现|因为|；|。)/);
  return cleanReadableText(match?.[1]);
}

function cleanReadableText(value) {
  return String(value || "")
    .replace(/^[:：,，\s]+/, "")
    .replace(/^这个以为不成立[:：,，]?/, "")
    .replace(/小人/g, "我替你")
    .replace(/用户/g, "人")
    .replace(/[，,。；;]+$/g, "")
    .trim();
}

function cleanRouteText(value) {
  return String(value || "")
    .replace(/^最终幸存版本[:：]\s*/, "")
    .replace(/^第[一二三四五\d]+版[:：]\s*/, "")
    .trim();
}

function buildTonightActionCard(packet) {
  const input = String(packet?.originalInput || "");

  if (/独立开发者|产品想法|验证动作|拆\s*MVP|拆 MVP/.test(input)) {
    return {
      open: "ChatGPT / Codex + 一个本地文档。",
      input: "一个真实产品想法，例如：“帮程序员自动写周报的 AI 工具”。再贴固定 prompt：只生成今晚验证动作卡。",
      output: "一张“今晚验证动作卡”，只包含 4 行：今晚发给谁、问对方什么、要拿到什么反馈、什么情况算这条 idea 还能继续。",
      passCriteria: "独立开发者看完这张卡，不需要再问“我今晚到底干什么”，能在 10 分钟内开始发第一条消息或做第一个假 demo。"
    };
  }

  if (/创作者|选题|会不会有人看/.test(input)) {
    return {
      open: "ChatGPT + 本地表格 + 一个固定 prompt。",
      input: "5 个同类选题，例如：“如何用 AI 写周报”“用 AI 做会议纪要”“AI 帮新手改简历”，再填目标受众和发布平台。",
      output: "一张半自动判断表，每个选题只输出 3 列：标题钩子、评论区可能会问什么、是否值得继续改。",
      passCriteria: "创作者看完能立刻改 1 个标题或放弃 1 个选题，而不是只得到“会火 / 不会火”的空结论。"
    };
  }

  if (isContentIdea(input)) {
    return {
      open: "手机备忘录 + 相机 + 剪映 / CapCut。",
      input: "一个具体选题，例如：“用 ChatGPT 把一段会议记录变成 3 条待办”。写 1 句 3 秒开头钩子和 1 个前后对比。",
      output: "一条 20-45 秒短视频草稿：前 3 秒先给痛点，中间只录 1 个 AI 工具动作，结尾展示前后对比结果。",
      passCriteria: "自己重看前 3 秒知道为什么要继续看；发给 1 个目标观众，对方能说出这条视频解决了什么问题。"
    };
  }

  if (/语音|控制电脑|打开软件/.test(input)) {
    return {
      open: "本地编辑器 / Python / 终端。",
      input: "3 条写死语音命令，例如“打开浏览器 / 打开记事本 / 打开计算器”。",
      output: "一个只识别固定命令并打开指定软件的本地 demo。",
      passCriteria: "连续试 5 次，至少 4 次能在 3 秒内打开正确软件。"
    };
  }

  if (/README|开源项目|使用教程/.test(input)) {
    return {
      open: "README 文件 + ChatGPT / Codex + 文本编辑器。",
      input: "一个真实 README + 目标读者：第一次使用这个项目的新手。",
      output: "一页新手使用教程，包含第一条命令、预期输出和一个常见错误处理。",
      passCriteria: "没看过项目的人能照着跑出第一步，或明确指出卡在哪个命令。"
    };
  }

  if (/读书|陪练/.test(input)) {
    return {
      open: "ChatGPT / Codex。",
      input: "一页书摘 + 固定提示词：只问一个让人停下来思考的问题。",
      output: "一个追问，不做整本书总结。",
      passCriteria: "读者回答时需要引用这一页内容，而不是只说“有道理”。"
    };
  }

  return buildFallbackTonightActionCard(packet);
}

function inferReadableShrink(originalInput, title, routeTo, routeWhy) {
  const routeText = cleanRouteText(routeTo);
  if (routeText && !isGenericReadableRoute(routeText) && hasConcreteReadableArtifact(routeText)) return routeText;

  const whyText = cleanRouteText(routeWhy);
  if (whyText && !isGenericReadableRoute(whyText) && hasConcreteReadableArtifact(whyText)) return whyText;

  if (/独立开发者|产品想法|验证动作|拆\s*MVP|拆 MVP/.test(originalInput)) {
    if (title === "正确废话" || title === "不知道先做啥") return "一张今晚验证动作卡，卡里只保留 4 行：发给谁、问什么、要拿到什么反馈、什么情况算还能继续。";
    if (title === "自动化太早") return "先用 ChatGPT / Codex 手动跑 3 个真实产品想法，留下最清楚的一张验证动作卡。";
    return "一个复制即用的固定 prompt，加一个真实产品想法，只产出一张 4 行验证动作卡。";
  }

  if (/创作者|选题|会不会有人看/.test(originalInput)) {
    if (title === "凭什么信你") return "一个半自动判断表：用户贴 5 个同类选题，AI 只输出标题钩子、评论区疑问和是否继续。";
    if (title === "数据太重") return "手动观察 10 条公开内容或使用用户提供样本，记录标题、点赞和评论区高频疑问，再跑固定判断表。";
    return "一张选题改写卡，只输出 3 个判断理由和 1 个改题建议，不直接下“会火 / 不会火”。";
  }

  if (isContentIdea(originalInput)) {
    if (title === "开头留不住") return "一条 20-45 秒视频草稿，只讲一个 AI 工具动作前后的对比，前 3 秒先给结果或痛点。";
    return "一个手机录屏草稿，只保留 1 个动作、1 个前后对比和 1 句解释，不做完整教程。";
  }

  if (/语音|控制电脑|打开软件/.test(originalInput)) return "只写死一条语音命令，先跑通打开一个指定软件";
  if (/README|开源项目|使用教程/.test(originalInput)) return "先手动把一个 README 压成一页新手命令卡";
  if (/读书|陪练/.test(originalInput)) return "只让用户粘贴一页内容，并问一个追问";

  return "先把路线缩到一个今晚能完成并能判断过不过的动作";
}

function isGenericReadableRoute(value) {
  return /(第一版只证明一个核心动作|先做一次手动或半自动交付|只保留一个替代品没处理好的细节|更小、更可验证|路线继续压小|一个明确差异点|从完整系统缩成一段可跑通流程|从全量自动化缩到低成本验证|从完整愿景压成第一个动作|具体动作|动作抓手|验证需求|简单\s*MVP|最小版本)/.test(value);
}

function hasConcreteReadableArtifact(value) {
  return /(卡|表|草稿|视频|prompt|提示词|规则|脚本|demo|文件|消息|标题|理由|建议|命令|教程|追问|样例|录屏|页面|按钮|输出|4\s*行|3\s*个|1\s*个|20-45\s*秒|10\s*条)/i.test(String(value || ""));
}

function buildFallbackTonightActionCard(packet) {
  const nextAction = String(packet?.result?.nextTinyAction || "");
  const survivor = String(packet?.result?.survivor || "一个固定输出");

  return {
    open: inferOpenTool(nextAction),
    input: "一个真实样例 + 一条固定提示词或固定规则。",
    output: cleanRouteText(survivor),
    passCriteria: "10 分钟内得到一个能展示的输出，并能判断这条路是继续、缩小还是停下。"
  };
}

function inferOpenTool(text) {
  if (/ChatGPT|Codex/i.test(text)) return "ChatGPT / Codex";
  if (/Excel|表格/.test(text)) return "Excel / 本地表格";
  if (/Python|脚本|终端/.test(text)) return "本地编辑器 / Python / 终端";
  if (/剪映|CapCut|视频|手机/.test(text)) return "手机备忘录 + 剪映 / CapCut";
  return "ChatGPT / Codex / 文本编辑器";
}

function buildComebackLine(stumbleCards, actionCard) {
  const firstTitle = stumbleCards[0]?.title || "第一下";
  const output = actionCard?.output || "一个固定输出";
  return completeReadableText(`我替你试了一圈，先摔的不是完整版本，而是「${firstTitle}」。今晚不用展开长日志，先产出：${output}`);
}

function isContentIdea(input) {
  return /(短视频|内容账号|短视频账号|账号|视频|小红书|抖音|B站|B 站|剪辑|拍)/.test(input);
}

function normalizeInline(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function completeReadableText(value) {
  const text = normalizeInline(value).trim();
  if (!text) return "";
  if (/[。！？.!?）」]$/.test(text)) return text;
  return `${text}。`;
}

function includesText(text, token) {
  return String(text || "").toLowerCase().includes(String(token || "").toLowerCase());
}

export function validateReadableLittleWalkerSummary(readableSummary, packet = {}) {
  const diagnostics = [];
  const label = "readableSummary";

  if (!readableSummary || typeof readableSummary !== "object" || Array.isArray(readableSummary)) {
    return [`${label} must exist.`];
  }

  const comebackLine = String(readableSummary.comebackLine || "").trim();
  if (!comebackLine) diagnostics.push(`${label}.comebackLine is missing.`);
  if (looksLikeHalfSentence(comebackLine)) diagnostics.push(`${label}.comebackLine looks truncated or unfinished.`);
  if (/小人以为/.test(comebackLine)) diagnostics.push(`${label}.comebackLine should use user-facing return language, not third-person assumption language.`);

  const cards = Array.isArray(readableSummary.stumbleCards) ? readableSummary.stumbleCards : [];
  if (cards.length !== 3) diagnostics.push(`${label}.stumbleCards must include exactly 3 cards.`);
  cards.forEach((card, index) => {
    const cardLabel = `${label}.stumbleCards[${index}]`;
    ["title", "youAssumed", "realityBroke", "soShrinkTo"].forEach((field) => {
      const value = String(card?.[field] || "").trim();
      if (!value) diagnostics.push(`${cardLabel}.${field} is missing.`);
      if (looksLikeHalfSentence(value)) diagnostics.push(`${cardLabel}.${field} looks truncated or unfinished.`);
    });

    const shrink = String(card?.soShrinkTo || "").trim();
    if (!hasConcreteReadableArtifact(shrink) || isAbstractReadableSummaryText(shrink)) {
      diagnostics.push(`${cardLabel}.soShrinkTo must name a concrete product or action, not only a generic shrink.`);
    }
  });

  const action = readableSummary.tonightActionCard || {};
  ["open", "input", "output", "passCriteria"].forEach((field) => {
    const value = String(action?.[field] || "").trim();
    if (!value) diagnostics.push(`${label}.tonightActionCard.${field} is missing.`);
    if (field !== "open" && looksLikeHalfSentence(value)) diagnostics.push(`${label}.tonightActionCard.${field} looks truncated or unfinished.`);
    if (isGenericActionField(field, value)) diagnostics.push(`${label}.tonightActionCard.${field} is too generic; include an example-first handle.`);
  });

  const summaryText = collectReadableSummaryText(readableSummary).join("\n");
  if (/(具体动作|验证需求|简单\s*MVP|最小版本|更具体|输出一条具体动作)/.test(summaryText) && !hasSpecificActionHandle(summaryText)) {
    diagnostics.push(`${label} uses abstract wording without a concrete open/input/output/pass criterion.`);
  }
  if (/(小红书爬虫|抖音爬虫|B\s*站爬虫|知乎爬虫|自动抓取平台数据|绕过平台限制|未授权采集用户内容)/i.test(summaryText)) {
    diagnostics.push(`${label} should not suggest unsafe platform automation.`);
  }

  const originalInput = String(packet?.originalInput || "");
  if (originalInput && !keepsReadableInputAnchor(originalInput, summaryText)) {
    diagnostics.push(`${label} lost the concrete object from originalInput.`);
  }

  return diagnostics;
}

function looksLikeHalfSentence(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  if (/[.…]$/.test(text) || /\.{3}$/.test(text)) return true;
  if (/[，,、：:；;]$/.test(text)) return true;
  if (/(只要|因为|所以|于是|然后|以及|或者|并且|把|让|给|对|向|和|或)$/.test(text)) return true;
  if (/(观众|独立开发者|创作者|用户)$/.test(text) && /只要|因为|所以|于是|如果|当/.test(text)) return true;
  return false;
}

function isAbstractReadableSummaryText(value) {
  const text = String(value || "").trim();
  return /^(更具体|先做最小版本|输出一条具体动作|只输出一条具体动作|验证用户需求|验证核心需求|做一个简单\s*MVP|做一个\s*MVP|做一个最小版本|只输出一个能让人今晚动手的动作抓手)$/.test(text);
}

function isGenericActionField(field, value) {
  const text = String(value || "").trim();
  if (!text) return false;
  if (field === "open") {
    return !/(ChatGPT|Codex|本地文档|本地表格|表格|Excel|手机|备忘录|相机|剪映|CapCut|Python|终端|README|文本编辑器|浏览器|文档)/i.test(text);
  }
  if (field === "input") {
    return !/(例如|真实|一个具体|5\s*个|3\s*条|README|书摘|语音命令|产品想法|选题|目标受众|发布平台|样例)/i.test(text);
  }
  if (field === "output") {
    return !hasConcreteReadableArtifact(text) || /^(做一个\s*demo|做一个验证动作|做一个最小版本|输出一条具体动作)$/.test(text);
  }
  if (field === "passCriteria") {
    return !/(10\s*分钟|3\s*秒|4\s*次|能|是否|至少|对方|看完|开始|跑出|说出|指出|判断|继续|放弃|需要|引用|回答|照着)/.test(text);
  }
  return false;
}

function hasSpecificActionHandle(text) {
  return /(ChatGPT|Codex|本地文档|本地表格|表格|手机|相机|剪映|CapCut|README|Python|终端).+(输入|例如|产出|只包含|过关|10\s*分钟|3\s*秒|4\s*行)/is.test(String(text || ""));
}

function collectReadableSummaryText(value, output = []) {
  if (typeof value === "string") {
    output.push(value);
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectReadableSummaryText(item, output));
    return output;
  }
  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectReadableSummaryText(item, output));
  }
  return output;
}

function keepsReadableInputAnchor(input, summaryText) {
  const anchors = [];
  if (/独立开发者|产品想法|验证动作|拆\s*MVP|拆 MVP/.test(input)) anchors.push("独立开发者", "产品想法", "验证动作");
  if (/创作者|选题|会不会有人看/.test(input)) anchors.push("创作者", "选题");
  if (isContentIdea(input)) anchors.push("AI 工具", "视频");
  if (/语音|控制电脑|打开软件/.test(input)) anchors.push("语音", "软件");
  if (/README|开源项目|使用教程/.test(input)) anchors.push("README", "教程");
  if (/读书|陪练/.test(input)) anchors.push("书", "追问");
  if (anchors.length === 0) return true;
  return anchors.some((anchor) => includesText(summaryText, anchor));
}

function isIndieValidationInput(input) {
  return /独立开发者|产品想法|验证动作|拆\s*MVP|拆 MVP/.test(String(input || ""));
}

function isCreatorTopicInput(input) {
  return /创作者|选题|会不会有人看/.test(String(input || ""));
}

export function buildLittleWalkerPacketMessages({ input, localPacket }) {
  const localReference = {
    idea: localPacket.idea,
    clarityGate: localPacket.clarityGate,
    path: localPacket.path,
    localResult: {
      survivor: localPacket.verdict?.strongestBranch || localPacket.path?.minimumResult,
      whySurvived: localPacket.verdict?.survivalReason,
      nextTinyAction: localPacket.verdict?.smallestValidation || localPacket.path?.validation,
      droppedHeavyRoute: localPacket.verdict?.abandonedRoutes,
      sideBranch: localPacket.verdict?.branchOptions
    },
    localRouteSkeleton: (localPacket.frictionBites || []).map((bite) => ({
      stepNumber: bite.stepNumber,
      frictionType: bite.frictionType,
      currentSurvivingRoute: bite.currentSurvivingRoute,
      tinyActionReference: bite.agentAttempt,
      realityHitReference: bite.realityFeedback,
      routeChange: bite.routeChange,
      decision: bite.verdict
    }))
  };

  const jsonShape = {
    originalInput: input,
    doorway: {
      status: "can_run",
      speakerLine: "门口小人说的一句话",
      reason: "为什么这个输入能先试走",
      rewriteOptions: []
    },
    walk: {
      steps: [
        {
          stepNumber: 1,
          sceneLine: "像一幕事情：小人原本以为什么，所以真的试了一个具体动作；结果现实打破这个以为，于是路线变小或换入口。",
          currentSurvivingRoute: "本轮开始时小人手里的路线",
          tinyAction: "小人这一轮真的尝试做什么",
          realityHit: "现实撞到了什么",
          burden: {
            time: "低",
            money: "低",
            mental: "中",
            trust: "低",
            skill: "中",
            human: "低"
          },
          routeChange: {
            from: "本轮开始时的路线",
            to: "本轮后留下的路线",
            why: "路线为什么这样变"
          },
          decision: "continue | mutate | branch | stop",
          nextCarry: "必须等于 routeChange.to"
        }
      ]
    },
    result: {
      survivor: "必须等于第 5 步 routeChange.to",
      whySurvived: "为什么它活下来",
      nextTinyAction: "现在最小试走动作",
      droppedHeavyRoute: ["被放下的重路线"],
      sideBranch: ["旁边出现的轻分叉"],
      routeTrace: [
        input,
        "第 1 步后路线",
        "第 2 步后路线",
        "第 3 步后路线",
        "第 4 步后路线",
        "最终幸存版本"
      ]
    }
  };

  return [
    {
      role: "system",
      content: [
        "你是 IdeaRoast 的 Little Walker Packet generator。",
        "你不是创业顾问，不是报告作者，不做市场分析，不写 markdown。",
        "你的任务是生成一个“小人试走事件 packet”：一个小人背着用户的小产品想法先走 5 步，记录每一步发生了什么。",
        "Little Walker 不是为了顺利完成任务，也不是故意找茬。",
        "Little Walker 是为了预演：这个想法一旦真的执行，哪个默认假设会先被现实打破。",
        "只输出合法 JSON object，不要代码块，不要标题，不要解释。",
        "顶层必须是 originalInput, doorway, walk, result。",
        "doorway.status 对本轮输入必须是 can_run。",
        "walk.steps 必须正好 5 步，每一步都是连续路线变形，不是 5 条独立建议。",
        "每一步必须像一幕事情：小人做了一个具体 tinyAction，现实给了 realityHit，路线从 from 变到 to。",
        "每个 sceneLine 必须写出因果桥：因为上一轮或当前路线撞到什么，所以这一轮只试什么，并把路线改成什么。",
        "每个 sceneLine 还必须写出 assumption break / 假设破裂：小人原本以为 X，所以真的试了 Y；结果现实里的 Z 让这个以为不成立，于是路线改成 W。",
        "每个 sceneLine 都必须自然出现“小人以为 / 小人原本以为 / 小人本来以为”这类假设表达。",
        "不要用“上一轮发现 X，所以小人这次...”替代假设破裂。可以承接上一轮，但仍要写“小人以为这个缩小版本会怎样”。",
        "不要机械套同一句模板，但每个 sceneLine 都要能看出：原假设、具体试走动作、假设被打破的现实细节、路线变形。",
        "现实细节要具体，不要只写太泛、太重、用户不信、成本高。要写出人的反应或操作失败，例如看完不知道今晚做什么、前 3 秒划走、第一反应是凭什么、不会复制到哪里、自己重看都想关。",
        "sceneLine 不要只写“小人开始做 A”，要写成“上一轮发现 X 太重，所以小人这次只试 A，结果撞到 Y，于是路线缩成 B”。",
        "下一步 currentSurvivingRoute 和 routeChange.from 必须等于上一轮 routeChange.to。",
        "每一步 nextCarry 必须等于本步 routeChange.to。",
        "result.survivor 必须等于第 5 步 routeChange.to。",
        "result 第一眼只收束成三件事：survivor, whySurvived, nextTinyAction。",
        "所有内容必须贴住 originalInput 的对象和动作。不要泛化成“做一个简单 MVP”。",
        "result.survivor / whySurvived / nextTinyAction 必须保留 originalInput 的关键词，不要用同义词把 README、Excel、语音、软件、独立开发者、第一版这些锚点替换掉。",
        "任何字段都不要出现禁词短语：验证核心需求、做一个简单 MVP、综合分析、建议你、可行性较强、根据以上分析。",
        "如果想表达验证，不要写“验证核心需求”，要写成“看这个具体动作是否有人愿意照做 / 是否有人回复 / 是否能跑通”。",
        "不要默认建议爬取小红书、抖音、B 站、知乎，不要写平台爬虫、自动抓取平台数据、绕过平台限制或未授权采集用户内容。",
        "涉及平台内容时，优先写手动观察公开内容、用户自己提供样本、手动记录标题 / 点赞 / 评论区高频词，或使用明确合规的官方 API。",
        "不要把样例选题写成“Python 爬取网页 / 小红书爬虫 / 抖音爬虫”这类会把方向带向抓取的平台自动化主题。",
        "nextTinyAction 优先写今天能做出来的 demo-first 动作，不要默认写找 3 个用户调研。",
        "对工具类 idea，nextTinyAction 优先是手写固定输入、固定命令、固定输出、本地脚本或本地 demo。",
        "对 AI 工具 / 小产品类 idea，前 1-2 步优先 no-code / fake-door / manual-first / prompt-first / fixed-input demo。",
        "不要第一步就写函数、写 API、搭数据库、做完整后端、用户登录、权限系统或复杂脚本。",
        "工具类试走顺序：第 1 步手动模拟核心动作；第 2 步固定输入和输出；第 3 步再做固定 prompt / 固定规则 / 半自动；第 4-5 步才考虑本地 demo、API 或简单脚本。",
        "语音控制电脑 / 打开软件类 idea：第 1 步不要查语音 API、权限系统或完整语音识别文档；先手动模拟一句固定命令能不能触发打开一个指定软件。",
        "语音控制电脑 / 打开软件类 idea：nextTinyAction 必须是今天能跑的本地 demo，例如写死 3 条语音/文本命令并映射到指定软件；不要写找用户、连续观察、访谈或纯调研。"
      ].join("\n")
    },
    {
      role: "user",
      content: [
        "请为下面输入生成 Little Walker Packet。只输出 JSON，不要 Markdown。",
        "",
        "# originalInput",
        input,
        "",
        "# 本地 mock 参考，只能当路线和字段参考，不能输出报告",
        JSON.stringify(localReference, null, 2),
        "",
        "# 必须输出的 JSON 形状",
        JSON.stringify(jsonShape, null, 2),
        "",
        "# 强约束",
        "- originalInput 必须和上面的 originalInput 完全一致。",
        "- doorway.status 必须是 can_run。",
        "- walk.steps 必须正好 5 步。",
        "- stepNumber 必须是 1 到 5。",
        "- sceneLine 必须像一幕事情，不要只写“第 1 步：表达摩擦”。",
        "- sceneLine 必须体现 assumption break / 假设破裂：小人原本以为 X，所以真的试了 Y；结果现实里的 Z 让这个以为不成立，于是路线改成 W。",
        "- 每个 sceneLine 都必须自然出现“小人以为 / 小人原本以为 / 小人本来以为”。不要从第 2 步开始只写“上一轮发现...所以...”。",
        "- 不要每句机械套模板，但每句都必须能看出：原假设、具体试走动作、假设破裂、路线变形。",
        "- Little Walker 不是为了顺利完成任务，也不是故意找茬；它要暴露一个想法真的执行时默认以为不成立的地方。",
        "- 每个 sceneLine 必须有因果桥，至少自然出现“因为 / 所以 / 于是 / 发现 / 撞到 / 只先 / 改成 / 缩成 / 留下”这类表达。",
        "- sceneLine 必须写清：小人为什么做这一步、撞到了什么、所以路线如何变小或变清楚。",
        "- sceneLine 不要只写“太泛 / 太重 / 用户不信 / 成本高”；必须写具体场景、具体人类反应或具体操作失败。",
        "- 不要只写“小人开始做 A”；要写成“上一轮发现 X 太重，所以这轮只试 A，结果撞到 Y，于是路线缩成 B”。",
        "- routeChange 必须包含 from / to / why。",
        "- 第 1 步 routeChange.from 必须等于第 1 步 currentSurvivingRoute。",
        "- 第 2 步 currentSurvivingRoute 和 routeChange.from 必须等于第 1 步 routeChange.to；后面同理。",
        "- nextCarry 必须等于本步 routeChange.to。",
        "- result.routeTrace 必须是 originalInput + 5 个 routeChange.to。",
        "- result.survivor 必须等于第 5 步 routeChange.to。",
        "- result.survivor / whySurvived / nextTinyAction 必须保留 originalInput 的关键词锚点。",
        "- droppedHeavyRoute 和 sideBranch 用短句数组，不要对象数组。",
        "- burden 至少包含 time / money / mental / trust / skill，可以加 human。",
        "- 不要出现“综合分析”“建议你”“可行性较强”“可行性较高”“风险较高”“根据以上分析”“市场前景”“商业模式完整分析”。",
        "- 不要泛泛说“先做 MVP 找用户验证”“做一个简单 MVP”“验证核心需求”。",
        "- 任何字段都不要写“验证核心需求”；如果要表达验证，请写具体对象：验证这条动作是否有人照做、这个视频是否有人看完、这个本地 demo 是否能跑通。",
        "- 不要默认写“小红书爬虫 / 抖音爬虫 / B 站爬虫 / 知乎爬虫 / 自动抓取平台数据 / 绕过平台限制 / 未授权采集用户内容”。",
        "- 需要平台观察时，写成“手动观察 10 条公开内容 / 用户自己提供样本 / 手动记录标题、点赞、评论区高频词 / 使用公开合规 API”。",
        "- 不要把示例选题写成“Python 爬取网页 / 小红书爬虫 / 抖音爬虫”；选题判断工具的样例用安全内容题，例如“如何用 AI 写周报”。",
        "- AI 工具 / 小产品类 idea 的第 1 步不要直接写函数、写 API、搭数据库、完整后端、用户登录、权限系统或复杂脚本。",
        "- AI 工具 / 小产品类 idea 的前 1-2 步优先用 no-code / fake-door / manual-first / prompt-first / fixed-input demo。",
        "- 工具类推荐顺序：第 1 步手动模拟核心动作；第 2 步固定输入和输出；第 3 步固定 prompt / 固定规则 / 半自动；第 4-5 步才考虑本地 demo、API 或简单脚本。",
        "- 帮独立开发者拆验证动作时，第一步应先不用写代码：拿一个真实产品想法丢给 ChatGPT/Codex，手动生成一张“第一步验证动作卡”，看这张卡本身有没有用。",
        "- 帮独立开发者拆验证动作时，不要只写“卡片太泛所以改格式”；要写出：小人以为生成验证动作卡就能让人开干，结果 ChatGPT 吐出“调研用户、做原型、收反馈”的正确废话，用户仍然不知道今晚打开哪个工具，于是只输出一条今晚动作和复制即用提示词。",
        "- 判断选题会不会有人看时，第一步要说明完整判断工具需要数据和信任所以太重；先做一个假版本：输入一个选题，输出 3 个判断理由和一个修改建议。",
        "- 判断选题会不会有人看时，不要只写“需要数据和信任”；要写出：小人以为 AI 输出“会火/不会火”就有用，结果创作者第一反应是“凭什么”，于是改成 3 个判断理由和 1 个改题建议。",
        "- 内容账号类 idea 的 sceneLine 要保留拍摄 / 发布 / 反馈 / 改短 / 改选题的事件感；撞到问题后必须说明下一步怎么变小。",
        "- 内容账号类 sceneLine 至少要碰到真实内容摩擦：选题有没有痛点、开头 3 秒能不能留住人、标题/封面能不能让人停下、文案是不是先说痛点、录屏/字幕/剪辑/配音成本、发出去没人看是否说明角度错了。",
        "- 例如内容账号：小人以为把 AI 工具步骤讲完整就有价值，于是录了一条 2 分钟教程；结果自己重看都觉得前 10 秒没钩子，观众更不会等到重点，于是改成 20-45 秒前后对比。",
        "- nextTinyAction 不要默认写“找 3 个用户调研”。",
        "- 工具类 idea 的 nextTinyAction 应该先写一个当天可跑的 demo：手写固定输入 / 固定命令 / 固定输出 / 本地脚本 / 本地 demo。",
        "- 语音控制电脑 / 打开软件类 idea 的第 1 步不要写查语音 API、系统权限、SpeechRecognition 文档或完整语音识别；第 1 步只手动模拟一句固定命令能不能打开一个指定软件。",
        "- 语音控制电脑 / 打开软件类 idea 的 nextTinyAction 必须是今天可跑的本地 demo：写死 3 条语音/文本命令，映射到 3 个指定软件，连续试 5 次；不要写找用户、连续观察、访谈或纯调研。",
        "- 例如语音控制电脑：今天先写死 3 条语音命令：打开网页、搜索当天新闻、读出前三条标题。先不用智能，先把语音到动作再到读出来跑通。",
        "- 例如判断选题：今天先手写 5 个选题和 3 条判断规则，输出“为什么可能没人看 / 下一句标题怎么改”的本地 demo。",
        "- 如果输入是 Excel 短视频，结果必须保留 Excel / 视频。",
        "- 如果输入是语音控制电脑打开软件，结果必须保留语音 / 软件。",
        "- 如果输入是 README 自动整理成使用教程，结果必须保留 README / 教程。",
        "- 如果输入是 README 自动整理成使用教程，result.survivor 或 nextTinyAction 必须直接写出 README，不要只写“项目教程”。",
        "- 如果输入是帮独立开发者拆 MVP，结果必须保留独立开发者 / 第一版。",
        "- 如果输入是帮独立开发者拆 MVP，result.survivor 或 nextTinyAction 必须直接写出“独立开发者”和“第一版”，不要只写“验证路径”或“实验设计”。",
        "- 如果输入包含“拆 MVP”，result.survivor 必须直接出现“第一版”，例如“第一版交付物模板”或“第一版验证动作卡”。"
      ].join("\n")
    }
  ];
}

function validateRuntimeDemoFirstAction(packet, diagnostics) {
  const input = String(packet?.originalInput || "");
  const action = String(packet?.result?.nextTinyAction || "");
  const isToolLike = /(AI\s*工具|小工具|工具|控制电脑|打开软件|语音|自动|本地|README|选题)/i.test(input);
  if (!isToolLike) return;

  const hasDemoFirstSignal = /(今天|先写死|写死|手写|手动|固定输入|固定命令|固定输出|本地|demo|脚本|跑通|不用智能|假数据|样例|规则|原型|命令|模板卡|假按钮|假页面|ChatGPT|Codex)/i.test(action);
  const isUserResearchFirst = /(找\s*\d+\s*个|找几个|用户|调研|访谈|试用|连续\s*\d+\s*天)/.test(action);

  if (isUserResearchFirst && !hasDemoFirstSignal) {
    diagnostics.push("tool-like nextTinyAction should be demo-first, not only user research.");
  }
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, "").trim();
}
