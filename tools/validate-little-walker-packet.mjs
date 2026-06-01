#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { buildLocalPacket, loadLocalSimulationContext } from "./deepseek-shadow-runtime.mjs";

const require = createRequire(import.meta.url);
const { LITTLE_WALKER_PACKET_SCHEMA } = require("../data/little-walker-packet.schema.js");

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

export function toLittleWalkerPacket(localPacket) {
  const originalInput = textOrFallback(localPacket?.idea?.input, localPacket?.idea?.pitch || "");
  const gateStatus = localPacket?.clarityGate?.status || "needs_definition";
  const doorwayStatus = mapDoorwayStatus(gateStatus);
  const result = buildLittleWalkerResult(localPacket, originalInput);
  const steps = doorwayStatus === "can_run"
    ? buildLittleWalkerSteps(localPacket, result.survivor, originalInput)
    : [];

  result.routeTrace = steps.length > 0
    ? [originalInput, ...steps.map((step) => step.routeChange.to)]
    : [originalInput];

  return {
    originalInput,
    doorway: {
      status: doorwayStatus,
      speakerLine: buildDoorwaySpeakerLine(localPacket, doorwayStatus),
      reason: textOrFallback(
        localPacket?.clarityGate?.reason,
        localPacket?.clarityGate?.summary || "门口小人完成判断。"
      ),
      rewriteOptions: normalizeRewriteOptions(localPacket?.clarityGate?.rewriteOptions)
    },
    walk: { steps },
    result
  };
}

export function validateLittleWalkerPacket(packet, options = {}) {
  const diagnostics = [];
  const schema = options.schema || LITTLE_WALKER_PACKET_SCHEMA;

  if (!packet || typeof packet !== "object" || Array.isArray(packet)) {
    return { ok: false, diagnostics: ["packet must be an object."] };
  }

  requireObjectFields(packet, schema.requiredTopLevelFields, "packet", diagnostics);
  validateDoorway(packet.doorway, diagnostics, schema);

  const status = packet.doorway?.status;
  const steps = Array.isArray(packet.walk?.steps) ? packet.walk.steps : [];
  if (status === "can_run") {
    if (steps.length !== 5) diagnostics.push(`walk.steps length must be 5 for can_run, got ${steps.length}.`);
    validateWalkSteps(steps, packet.result, packet.originalInput, diagnostics, schema);
  } else if (steps.length > 0) {
    diagnostics.push(`walk.steps must be empty when doorway.status is ${status}.`);
  }

  validateResult(packet.result, packet.originalInput, steps, diagnostics, schema);
  validateTone(packet, diagnostics, schema);
  validatePlatformAutomationSafety(packet, diagnostics, schema);
  validateSpecificity(packet, diagnostics, schema);

  return {
    ok: diagnostics.length === 0,
    diagnostics
  };
}

function buildLittleWalkerResult(localPacket, originalInput) {
  const verdict = localPacket?.verdict || {};
  const pathInfo = localPacket?.path || {};
  const bites = localPacket?.frictionBites || [];
  const finalRoute = bites[bites.length - 1]?.routeChange?.to;
  const survivor = textOrFallback(verdict.strongestBranch, pathInfo.minimumResult || finalRoute || originalInput);
  const nextTinyAction = normalizePacketNextTinyAction(
    originalInput,
    textOrFallback(verdict.smallestValidation, pathInfo.validation || survivor)
  );

  return {
    survivor,
    whySurvived: textOrFallback(verdict.survivalReason, "它放下了过重路线，只保留第一版可试走动作。"),
    nextTinyAction,
    droppedHeavyRoute: normalizeRouteList(verdict.abandonedRoutes, "title", "reason"),
    sideBranch: normalizeRouteList(verdict.branchOptions, "title", "whyAlive"),
    routeTrace: []
  };
}

function buildLittleWalkerSteps(localPacket, finalSurvivor, originalInput = "") {
  const bites = localPacket?.frictionBites || [];
  let currentRoute = textOrFallback(
    bites[0]?.currentSurvivingRoute,
    localPacket?.path?.start || `原始想法：${localPacket?.idea?.name || localPacket?.idea?.input || "这个想法"}`
  );

  return bites.map((bite, index) => {
    const isFinalStep = index === bites.length - 1;
    const routeTo = isFinalStep
      ? textOrFallback(finalSurvivor, bite.routeChange?.to || bite.nextMove)
      : textOrFallback(bite.routeChange?.to, bite.nextMove || bite.branch || "更小、更可验证的路线");
    const routeWhy = textOrFallback(
      bite.routeChange?.why,
      bite.routeChange?.summary || bite.mutation || bite.plainTake || "现实反馈让路线继续压小。"
    );

    const step = {
      stepNumber: index + 1,
      sceneLine: textOrFallback(
        bite.sceneLine,
        buildFallbackSceneLine({
          index,
          originalInput,
          attempt: bite.agentAttempt,
          reality: bite.realityFeedback || bite.friction,
          routeTo,
          routeWhy
        })
      ),
      currentSurvivingRoute: currentRoute,
      tinyAction: textOrFallback(bite.agentAttempt, bite.plainTake || "小人尝试推进一个最小动作。"),
      realityHit: textOrFallback(bite.realityFeedback, bite.friction || bite.plainTake || "现实反馈还不清楚。"),
      burden: normalizeBurden(bite.burden),
      routeChange: {
        from: currentRoute,
        to: routeTo,
        why: routeWhy
      },
      decision: textOrFallback(bite.verdict, "mutate"),
      nextCarry: routeTo
    };

    currentRoute = routeTo;
    return step;
  });
}

function validateDoorway(doorway, diagnostics, schema) {
  if (!doorway || typeof doorway !== "object") {
    diagnostics.push("doorway must be an object.");
    return;
  }

  requireObjectFields(doorway, schema.requiredDoorwayFields, "doorway", diagnostics);

  if (!schema.doorwayStatuses.includes(doorway.status)) {
    diagnostics.push(`doorway.status must be one of ${schema.doorwayStatuses.join(", ")}.`);
  }

  if (schema.stopDoorwayStatuses.includes(doorway.status)) {
    const options = Array.isArray(doorway.rewriteOptions) ? doorway.rewriteOptions : [];
    if (doorway.status !== "boundary_stop" && (options.length < 2 || options.length > 4)) {
      diagnostics.push("stopped doorway packets should include 2-4 rewriteOptions.");
    }
  }

  validateDoorwayTone(doorway, diagnostics, schema);
}

function validateDoorwayTone(doorway, diagnostics, schema) {
  const visibleDoorwayText = collectDoorwayVisibleText(doorway).join("\n");
  if (!visibleDoorwayText.trim()) return;

  (schema.reportTonePatterns || []).forEach((phrase) => {
    if (includesLoose(visibleDoorwayText, phrase)) {
      diagnostics.push(`doorway report tone phrase found: ${phrase}.`);
    }
  });

  if (doorway.status === "ask_one_question") {
    (schema.doorwayHarshJokePatterns || []).forEach((phrase) => {
      if (includesLoose(visibleDoorwayText, phrase)) {
        diagnostics.push(`ask_one_question doorway text must not mock the user: ${phrase}.`);
      }
    });
  }

  if (doorway.status === "boundary_stop") {
    (schema.doorwayBoundaryJokePatterns || []).forEach((phrase) => {
      if (includesLoose(visibleDoorwayText, phrase)) {
        diagnostics.push(`boundary_stop doorway text must stay serious: ${phrase}.`);
      }
    });
  }
}

function collectDoorwayVisibleText(doorway) {
  return [
    doorway?.speakerLine,
    doorway?.reason,
    doorway?.question,
    ...(Array.isArray(doorway?.rewriteOptions)
      ? doorway.rewriteOptions.flatMap((item) => [item?.title, item?.body])
      : [])
  ].filter(hasValue).map((item) => String(item));
}

function validateWalkSteps(steps, result, originalInput, diagnostics, schema) {
  steps.forEach((step, index) => {
    const label = `step ${index + 1}`;
    requireObjectFields(step, schema.requiredStepFields, label, diagnostics);

    if (step.stepNumber !== index + 1) {
      diagnostics.push(`${label} stepNumber must be ${index + 1}.`);
    }

    const sceneLine = textOrFallback(step.sceneLine, "");
    if (/^第\s*\d+\s*步/.test(sceneLine) || sceneLine.length < 12) {
      diagnostics.push(`${label} sceneLine must read like an event, not only a title.`);
    }

    validateSceneLineCausalBridge(sceneLine, label, diagnostics, schema);
    validateSceneLineAssumptionBreak(sceneLine, label, diagnostics, schema);
    if (index === 0) validateFirstStepBuildOrder(sceneLine, originalInput, label, diagnostics, schema);

    if (!schema.stepDecisions.includes(step.decision)) {
      diagnostics.push(`${label} decision must be one of ${schema.stepDecisions.join(", ")}.`);
    }

    validateBurden(step.burden, label, diagnostics, schema);

    if (!step.routeChange || typeof step.routeChange !== "object") {
      diagnostics.push(`${label} routeChange must be an object.`);
    } else {
      requireObjectFields(step.routeChange, schema.requiredRouteChangeFields, `${label}.routeChange`, diagnostics);
    }

    const current = normalizeRouteText(step.currentSurvivingRoute);
    const from = normalizeRouteText(step.routeChange?.from);
    const to = normalizeRouteText(step.routeChange?.to);
    const nextCarry = normalizeRouteText(step.nextCarry);

    if (from && current && from !== current) {
      diagnostics.push(`${label} routeChange.from must equal currentSurvivingRoute.`);
    }

    if (to && nextCarry && nextCarry !== to) {
      diagnostics.push(`${label} nextCarry must equal routeChange.to.`);
    }

    if (index > 0) {
      const previousTo = normalizeRouteText(steps[index - 1]?.routeChange?.to);
      if (previousTo && current !== previousTo) {
        diagnostics.push(`${label} currentSurvivingRoute is not continuous with previous routeChange.to.`);
      }
      if (previousTo && from !== previousTo) {
        diagnostics.push(`${label} routeChange.from is not continuous with previous routeChange.to.`);
      }
    }
  });

  validateDomainSceneFriction(steps, originalInput, diagnostics, schema);

  const finalTo = normalizeRouteText(steps[steps.length - 1]?.routeChange?.to);
  if (finalTo && normalizeRouteText(result?.survivor) !== finalTo) {
    diagnostics.push("result.survivor must equal step 5 routeChange.to.");
  }
}

function buildFallbackSceneLine({ index, originalInput, attempt, reality, routeTo, routeWhy }) {
  const attemptText = textOrFallback(attempt, "小人带着当前版本往前走");
  const realityText = textOrFallback(reality, "现实给了反馈");
  const routeText = textOrFallback(routeTo, "更小、更可验证的路线");
  const whyText = textOrFallback(routeWhy, "现实反馈让路线继续压小");
  const input = String(originalInput || "");

  if (isContentAccountInput(input)) {
    const contentBreaks = [
      "小人原本以为把步骤讲完整就会有人看，于是录了一条两分钟教程；结果自己重看都觉得开头没钩子，观众前 3 秒更可能划走，于是把路线缩成「{route}」。",
      "小人以为选到一个工具就能开拍，于是写了三个标题；结果标题像功能说明，观众看完不知道痛点在哪，于是改成先说一个具体工作卡点，留下「{route}」。",
      "小人以为录屏越详细越有价值，于是把每个按钮都讲了一遍；结果字幕和剪辑成本先压上来，重点还被埋住，于是改成只拍一个前后对比，路线变成「{route}」。",
      "小人以为发布后没人看就是账号不行，于是换了一个选题再发；结果评论和播放都指向开头痛点没说清，于是不再追完整教程，只留下「{route}」。",
      "小人以为把 AI 工具实战讲完就算完成，于是重剪了一版；结果完播还是卡在前半段，于是只保留能让观众立刻看到结果的「{route}」。"
    ];
    return fillFallbackSceneLine(contentBreaks[index] || contentBreaks[contentBreaks.length - 1], routeText, whyText);
  }

  if (/创作者|选题|会不会有人看/.test(input)) {
    const topicBreaks = [
      "小人原本以为 AI 输出“会火/不会火”就能帮创作者决定，于是输入一个真实选题试了一下；结果创作者第一反应是“凭什么”，不信这个结论，于是路线改成「{route}」。",
      "小人以为多给几条评分就更可信，于是做了一张完整判断卡；结果看完还是不知道标题哪里该改，于是缩成只给 3 个理由和 1 个改题建议，留下「{route}」。",
      "小人以为判断越全面越有用，于是把受众、平台和热点都塞进去；结果输出太泛，创作者不知道今晚该改哪一句，于是改成「{route}」。",
      "小人以为接入数据后就能让人信服，于是先用假数据跑一遍；结果现实里数据来源和解释成本太重，于是不再下结论，只留下「{route}」。",
      "小人以为工具能替创作者做决定，于是让它直接给通过/不通过；结果用户还是要自己判断启发度，于是路线缩成「{route}」。"
    ];
    return fillFallbackSceneLine(topicBreaks[index] || topicBreaks[topicBreaks.length - 1], routeText, whyText);
  }

  if (/独立开发者|产品想法|验证动作|MVP/.test(input)) {
    const indieBreaks = [
      "小人原本以为生成一张验证动作卡就能让独立开发者开干，于是拿一个真实产品想法丢给 ChatGPT；结果吐出一堆正确废话，用户还是不知道今晚打开哪个工具，于是路线缩成「{route}」。",
      "小人以为字段越完整越专业，于是做了一张模板卡；结果用户看完不会复制，也不知道用在哪，于是改成只保留一条今晚动作和一个复制即用提示词，留下「{route}」。",
      "小人以为自动化越早越省事，于是想把拆解流程接成系统；结果手动能用，自动化太早会先吞掉时间，于是路线改成「{route}」。",
      "小人以为先找用户聊就能验证，于是写了访谈问题；结果问题太泛，独立开发者仍然不知道今晚做什么，于是改成先跑一张固定输入输出卡，留下「{route}」。",
      "小人以为通用拆解器更有价值，于是把场景都塞进去；结果用户看完还是不知道今晚做什么，只需要下一步能执行，于是不再追通用，缩成「{route}」。"
    ];
    return fillFallbackSceneLine(indieBreaks[index] || indieBreaks[indieBreaks.length - 1], routeText, whyText);
  }

  if (isToolOrProductLikeInput(input)) {
    const toolBreaks = [
      "小人原本以为只要把核心功能说清楚就能开做，于是{attempt}；结果现实里的具体操作让用户看不懂下一步，凭什么要用也不清楚，于是路线改成「{route}」。",
      "小人以为先做完整流程会更像产品，于是用固定输入跑了一次；结果用户不知道输出该复制到哪里用，于是缩成一个固定输入和一个固定输出，留下「{route}」。",
      "小人以为自动化越完整越有价值，于是估了一遍实现；结果手动能用，自动化太早会把脚本、权限和维护都拉进来，于是改成「{route}」。",
      "小人以为差异点写清楚就够了，于是拿替代方案对比；结果用户第一反应是“不信它更省事”，于是只保留一个替代品没做好的细节，路线变成「{route}」。",
      "小人以为第一版可以顺手多支持几种场景，于是把入口铺开；结果每多一个场景都会让测试失败更难解释，于是不再追通用，只支持「{route}」。"
    ];
    return fillFallbackSceneLine(toolBreaks[index] || toolBreaks[toolBreaks.length - 1], routeText, whyText, attemptText);
  }

  const genericBreaks = [
    "小人原本以为这个想法只要先往前推就会变清楚，于是{attempt}；结果现实里的第一步让它看见{reality}，于是把路线改成「{route}」。",
    "小人以为上一轮留下的版本已经够轻，于是继续试了一小步；结果看完还是不知道下一步怎么落地，于是路线缩成「{route}」。",
    "小人以为把范围再补完整会更稳，于是估了一遍资源；结果成本和心力先压上来，于是不再追完整，只留下「{route}」。",
    "小人以为换个说法就能打动人，于是拿现有替代品比了一下；结果用户第一反应是不知道差异在哪，于是改成「{route}」。",
    "小人以为多留几个分叉更保险，于是把路线摊开；结果每条都让执行变重，于是只带回「{route}」。"
  ];
  return fillFallbackSceneLine(genericBreaks[index] || genericBreaks[genericBreaks.length - 1], routeText, whyText, attemptText, realityText);
}

function fillFallbackSceneLine(template, routeText, whyText, attemptText = "试了一小步", realityText = "默认假设不成立") {
  return template
    .replace("{attempt}", attemptText)
    .replace("{reality}", realityText)
    .replace("{route}", routeText)
    + `；留下它的原因是：${whyText}`;
}

function validateSceneLineCausalBridge(sceneLine, label, diagnostics, schema) {
  const patterns = schema.sceneCausalBridgePatterns || [];
  if (!patterns.some((token) => includesLoose(sceneLine, token))) {
    diagnostics.push(`${label} sceneLine must include a causal bridge such as 因为 / 所以 / 于是 / 发现 / 撞到 / 改成 / 缩成.`);
  }
}

function validateSceneLineAssumptionBreak(sceneLine, label, diagnostics, schema) {
  const hasAssumption = (schema.sceneAssumptionPatterns || []).some((token) => includesLoose(sceneLine, token));
  const hasAction = (schema.sceneActionPatterns || []).some((token) => includesLoose(sceneLine, token));
  const hasBreak = (schema.sceneBreakPatterns || []).some((token) => includesLoose(sceneLine, token));
  const hasTransform = (schema.sceneTransformPatterns || []).some((token) => includesLoose(sceneLine, token));

  if (!hasAssumption || !hasAction || !hasBreak || !hasTransform) {
    diagnostics.push(`${label} sceneLine must show assumption break: original assumption, concrete trial, reality breaking it, and route transformation.`);
  }

  const hasAbstractBreak = (schema.abstractBreakPatterns || []).some((token) => includesLoose(sceneLine, token));
  const hasConcreteBreak = hasConcreteBreakSignal(sceneLine, schema);
  if (hasAbstractBreak && !hasConcreteBreak) {
    diagnostics.push(`${label} sceneLine is too abstract; include a concrete scene, human reaction, or operation failure instead of only 太泛 / 太重 / 不稳定 / 用户不信 / 成本高.`);
  }
}

function hasConcreteBreakSignal(sceneLine, schema) {
  if ((schema.concreteBreakPatterns || []).some((token) => includesLoose(sceneLine, token))) return true;
  if (/[“"][^”"]{2,}[”"]/.test(sceneLine)) return true;
  if (/\d+\s*(秒|分钟|小时|天|个|条|次|%|MB|播放|回复|互动)/i.test(sceneLine)) return true;
  if (/(比如|例如|具体|指标|链接|案例|命令|按钮|代码块|配置项|环境变量|延迟|误识别|噪音|双击|上传|泄露|花了|反复跳转)/i.test(sceneLine)) return true;
  return false;
}

function validateDomainSceneFriction(steps, originalInput, diagnostics, schema) {
  const joinedSceneLines = steps.map((step) => step?.sceneLine || "").join("\n");

  if (isContentAccountInput(originalInput)) {
    const hits = countPatternHits(joinedSceneLines, schema.contentFrictionPatterns || []);
    if (hits < 2) {
      diagnostics.push("content-account sceneLines should include concrete content friction such as 选题 / 标题 / 开头 / 3 秒 / 观众 / 留存 / 录屏 / 剪辑 / 字幕 / 封面 / 播放 / 划走.");
    }
  }

  if (isToolOrProductLikeInput(originalInput)) {
    const hits = countPatternHits(joinedSceneLines, schema.toolUseFrictionPatterns || []);
    if (hits < 2) {
      diagnostics.push("tool/product sceneLines should include concrete user reaction or usage friction such as 看不懂 / 不知道下一步 / 不会复制 / 凭什么 / 不信 / 正确废话 / 手动能用，自动化太早.");
    }
  }
}

function validateFirstStepBuildOrder(sceneLine, originalInput, label, diagnostics, schema) {
  if (!isToolOrProductLikeInput(originalInput)) return;

  const heavyPatterns = schema.earlyHeavyBuildPatterns || [];
  const allowPatterns = schema.earlyHeavyBuildAllowPatterns || [];
  const hasHeavyBuild = heavyPatterns.some((token) => includesLoose(sceneLine, token));
  if (!hasHeavyBuild) return;

  const hasManualOrFakeDemoContext = allowPatterns.some((token) => includesLoose(sceneLine, token));
  if (!hasManualOrFakeDemoContext) {
    diagnostics.push(`${label} sceneLine starts tool/product walking too heavy; first step should be manual-first / prompt-first / fixed-input demo before functions, API, database, login, permissions, or backend.`);
  }
}

function validateResult(result, originalInput, steps, diagnostics, schema) {
  if (!result || typeof result !== "object") {
    diagnostics.push("result must be an object.");
    return;
  }

  requireObjectFields(result, schema.requiredResultFields, "result", diagnostics);

  const trace = Array.isArray(result.routeTrace) ? result.routeTrace : [];
  if (steps.length === 5) {
    if (trace.length !== 6) diagnostics.push(`result.routeTrace must contain original input plus 5 route changes, got ${trace.length}.`);
    if (normalizeRouteText(trace[0]) !== normalizeRouteText(originalInput)) {
      diagnostics.push("result.routeTrace must start with originalInput.");
    }
    steps.forEach((step, index) => {
      if (normalizeRouteText(trace[index + 1]) !== normalizeRouteText(step.routeChange?.to)) {
        diagnostics.push(`result.routeTrace item ${index + 1} must equal step ${index + 1} routeChange.to.`);
      }
    });
    if (normalizeRouteText(trace[trace.length - 1]) !== normalizeRouteText(result.survivor)) {
      diagnostics.push("result.routeTrace must end with result.survivor.");
    }
  }

  if (!hasListContent(result.droppedHeavyRoute)) diagnostics.push("result.droppedHeavyRoute must include at least one route.");
  if (!hasListContent(result.sideBranch)) diagnostics.push("result.sideBranch must include at least one branch.");
}

function validateTone(packet, diagnostics, schema) {
  const visibleText = collectVisibleText(packet).join("\n");

  schema.reportTonePatterns.forEach((phrase) => {
    if (visibleText.includes(phrase)) diagnostics.push(`report tone phrase found: ${phrase}.`);
  });

  schema.markdownPatterns.forEach((source) => {
    const pattern = new RegExp(source, "m");
    if (pattern.test(visibleText)) diagnostics.push(`markdown-like longform pattern found: ${source}.`);
  });
}

function validatePlatformAutomationSafety(packet, diagnostics, schema) {
  const visibleText = collectVisibleText(packet).join("\n");
  const allowPatterns = schema.platformAutomationAllowPatterns || [];

  (schema.unsafePlatformAutomationPatterns || []).forEach((source) => {
    const pattern = new RegExp(source, "i");
    if (!pattern.test(visibleText)) return;

    const hasSafeContext = allowPatterns.some((token) => includesLoose(visibleText, token));
    if (!hasSafeContext) {
      diagnostics.push(`unsafe platform automation found: ${source}. Use manual observation, user-provided samples, or a clearly compliant official API instead.`);
    }
  });
}

function validateSpecificity(packet, diagnostics, schema) {
  const resultText = [
    packet.result?.survivor,
    packet.result?.whySurvived,
    packet.result?.nextTinyAction
  ].join("\n");
  const visibleText = collectVisibleText(packet).join("\n");

  schema.genericResultPatterns.forEach((source) => {
    const pattern = new RegExp(source, "i");
    if (pattern.test(resultText)) {
      diagnostics.push(`generic result phrase found: ${source}.`);
    }
  });

  const anchors = extractInputAnchors(packet.originalInput);
  if (anchors.length > 0 && !anchors.some((anchor) => visibleText.toLowerCase().includes(anchor.toLowerCase()))) {
    diagnostics.push("packet does not keep any concrete anchor from originalInput.");
  }

  schema.anchorRules.forEach((rule) => {
    if (!rule.when.every((token) => includesLoose(packet.originalInput, token))) return;
    const missing = rule.resultMustInclude.filter((token) => !includesLoose(resultText, token));
    if (missing.length > 0) {
      diagnostics.push(`result text lost required input anchors: ${missing.join(", ")}.`);
    }
  });

  validateDemoFirstNextTinyAction(packet, diagnostics);
}

function requireObjectFields(object, fields, label, diagnostics) {
  fields.forEach((field) => {
    if (!hasValue(object?.[field])) diagnostics.push(`${label}.${field} is missing.`);
  });
}

function normalizeRouteList(value, titleKey, bodyKey) {
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (!item || typeof item !== "object") return "";
        const title = textOrFallback(item[titleKey], "");
        const body = textOrFallback(item[bodyKey], "");
        return [title, body].filter(Boolean).join("：");
      })
      .filter(Boolean);
    if (normalized.length > 0) return normalized.slice(0, 4);
  }

  return ["完整重路线：第一版先放下。"];
}

function normalizeRewriteOptions(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({
      title: textOrFallback(item?.title, "可选入口"),
      body: textOrFallback(item?.body, "")
    }))
    .filter((item) => item.body)
    .slice(0, 4);
}

function normalizeBurden(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { time: "中", money: "低", mental: "中", trust: "低", skill: "中" };
  }

  return Object.fromEntries(
    Object.entries(value).filter(([, burdenValue]) => hasValue(burdenValue))
  );
}

function validateBurden(burden, label, diagnostics, schema) {
  if (!burden || typeof burden !== "object" || Array.isArray(burden)) {
    diagnostics.push(`${label}.burden must be an object.`);
    return;
  }

  const keys = Object.keys(burden);
  if (!keys.some((key) => schema.burdenKeys.includes(key))) {
    diagnostics.push(`${label}.burden must include at least one allowed burden key.`);
  }
}

function buildDoorwaySpeakerLine(localPacket, doorwayStatus) {
  if (doorwayStatus === "can_run") {
    return textOrFallback(localPacket?.clarityGate?.summary, "这个入口能跑，小人可以先替你走一圈。");
  }

  return textOrFallback(
    localPacket?.clarityGate?.summary,
    localPacket?.clarityGate?.reason || "小人先停在门口。"
  );
}

function mapDoorwayStatus(status) {
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

function collectVisibleText(value, output = []) {
  if (typeof value === "string") {
    output.push(value);
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectVisibleText(item, output));
    return output;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectVisibleText(item, output));
  }

  return output;
}

function extractInputAnchors(input) {
  const text = String(input || "");
  const anchors = [];
  const known = [
    "Excel",
    "短视频",
    "AI",
    "读书",
    "陪练",
    "语音",
    "控制电脑",
    "打开软件",
    "独立开发者",
    "MVP",
    "开源项目",
    "README",
    "使用教程"
  ];

  known.forEach((token) => {
    if (includesLoose(text, token)) anchors.push(token);
  });

  const asciiTokens = text.match(/[A-Za-z][A-Za-z0-9+-]{1,}/g) || [];
  asciiTokens.forEach((token) => {
    if (!anchors.some((anchor) => anchor.toLowerCase() === token.toLowerCase())) anchors.push(token);
  });

  return anchors;
}

function normalizePacketNextTinyAction(originalInput, action) {
  if (!isToolOrProductLikeInput(originalInput) || !isResearchOnlyWithoutDemoFirst(action)) return action;

  const input = String(originalInput || "");
  if (/产品想法|验证动作|独立开发者/.test(input)) {
    return "今天先拿 1 个真实产品想法，用 ChatGPT/Codex 手动生成一张“第一步验证动作卡”，固定成一个输入和一个卡片输出。";
  }
  if (/创作者|选题|会不会有人看/.test(input)) {
    return "今天先手写 5 个选题和 3 条判断规则，做一张模板卡，固定输出“为什么可能没人看”和“下一句标题怎么改”。";
  }
  if (/语音|控制电脑|打开软件/.test(input)) {
    return "今天先写死 3 条语音命令：打开计算器、打开记事本、打开浏览器，先把语音到动作的本地 demo 跑通。";
  }
  if (/README|开源项目|使用教程/.test(input)) {
    return "今天先拿 1 个 README，手动整理成一页使用教程模板，再把输入字段和输出格式固定住。";
  }

  return "今天先用一个固定输入和一个固定输出手动跑通核心动作，做成一张模板卡或本地假 demo。";
}

function validateDemoFirstNextTinyAction(packet, diagnostics) {
  if (!isToolOrProductLikeInput(packet.originalInput)) return;

  const action = String(packet.result?.nextTinyAction || "");
  if (isResearchOnlyWithoutDemoFirst(action)) {
    diagnostics.push("tool-like nextTinyAction should be demo-first, not only user research.");
  }
}

function isResearchOnlyWithoutDemoFirst(action) {
  const text = String(action || "");
  const hasDemoFirstSignal = /(今天|先写死|写死|手写|手动|固定输入|固定命令|固定输出|本地|demo|脚本|跑通|不用智能|假数据|样例|规则|原型|命令|模板卡|假按钮|假页面|ChatGPT|Codex)/i.test(text);
  const isUserResearchFirst = /(找\s*\d+\s*个|找几个|用户|调研|访谈|试用|连续\s*\d+\s*天)/.test(text);
  return isUserResearchFirst && !hasDemoFirstSignal;
}

function isContentAccountInput(input) {
  const text = String(input || "");
  return /(短视频账号|内容账号|账号|短视频|视频|频道)/.test(text) && /(短视频|内容|讲|教|实战|账号|视频|拍|发布)/.test(text);
}

function isToolOrProductLikeInput(input) {
  const text = String(input || "");
  const isContentAccount = /(短视频账号|内容账号|账号)/.test(text) && /(短视频|内容|讲|教|实战|账号)/.test(text);
  if (isContentAccount && !/(帮|判断|整理|控制|打开|生成|拆成|处理)/.test(text)) return false;

  return /(AI\s*工具|小工具|工具|小产品|独立开发|开源项目|README|选题|产品想法|控制电脑|打开软件|语音|自动整理)/i.test(text);
}

function countPatternHits(text, patterns) {
  return patterns.reduce((count, token) => count + (includesLoose(text, token) ? 1 : 0), 0);
}

function includesLoose(text, token) {
  return String(text || "").toLowerCase().includes(String(token || "").toLowerCase());
}

function normalizeRouteText(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/[。.!！?？]+$/g, "");
}

function hasListContent(value) {
  if (Array.isArray(value)) return value.some((item) => hasValue(item));
  return hasValue(value);
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return String(value || "").trim().length > 0;
}

function textOrFallback(value, fallback = "") {
  const text = String(value || "").trim();
  return text || String(fallback || "").trim();
}

function runGuardChecks(validPacket) {
  const missingScene = structuredClone(validPacket);
  delete missingScene.walk.steps[0].sceneLine;
  assertInvalid(missingScene, "missing sceneLine");

  const discontinuous = structuredClone(validPacket);
  discontinuous.walk.steps[2].currentSurvivingRoute = "突然换成另一条不连续路线";
  assertInvalid(discontinuous, "discontinuous route");

  const reportTone = structuredClone(validPacket);
  reportTone.result.whySurvived = "根据以上分析，这个方向可行性较高。";
  assertInvalid(reportTone, "report tone");

  const doorwayReportTone = structuredClone(validPacket);
  doorwayReportTone.doorway.speakerLine = "根据以上分析，这个方向可行性较高。";
  assertInvalid(doorwayReportTone, "doorway report tone");

  const askOneQuestionMocking = structuredClone(validPacket);
  askOneQuestionMocking.doorway.status = "ask_one_question";
  askOneQuestionMocking.doorway.speakerLine = "你想屁吃？先告诉小人具体帮谁做哪件事。";
  askOneQuestionMocking.doorway.reason = "对象和场景没说清。";
  askOneQuestionMocking.doorway.question = "这个工具具体帮谁做哪件事？";
  askOneQuestionMocking.doorway.rewriteOptions = [
    { title: "选对象", body: "先说清它帮谁。" },
    { title: "选场景", body: "先说清它在哪个场景用。" }
  ];
  askOneQuestionMocking.walk.steps = [];
  assertInvalid(askOneQuestionMocking, "ask_one_question mocking doorway tone");

  const boundaryStopJoke = structuredClone(validPacket);
  boundaryStopJoke.doorway.status = "boundary_stop";
  boundaryStopJoke.doorway.speakerLine = "小人吐槽一下：这事先停。";
  boundaryStopJoke.doorway.reason = "这里涉及授权、隐私或合规边界。";
  boundaryStopJoke.doorway.rewriteOptions = [];
  boundaryStopJoke.walk.steps = [];
  assertInvalid(boundaryStopJoke, "boundary_stop joke doorway tone");

  const realityBrokenSharp = structuredClone(validPacket);
  realityBrokenSharp.doorway.status = "reality_broken";
  realityBrokenSharp.doorway.speakerLine = "小人刚出门，物理定律把门锁了。这不是难，是脚下没路。";
  realityBrokenSharp.doorway.reason = "现实前提断裂。";
  realityBrokenSharp.doorway.question = "先选一个能在现实里试走的小入口。";
  realityBrokenSharp.doorway.rewriteOptions = [
    { title: "做概念演示", body: "先做一个不承诺真实物理效果的视觉 demo。" },
    { title: "做科普内容", body: "先解释为什么它在现实里走不通。" }
  ];
  realityBrokenSharp.walk.steps = [];
  const realityBrokenSharpResult = validateLittleWalkerPacket(realityBrokenSharp);
  if (!realityBrokenSharpResult.ok) {
    throw new Error(`validator guard failed: reality_broken sharp doorway line should pass: ${realityBrokenSharpResult.diagnostics.join("; ")}`);
  }

  const generic = structuredClone(validPacket);
  generic.result.survivor = "做一个简单 MVP";
  generic.result.routeTrace[generic.result.routeTrace.length - 1] = "做一个简单 MVP";
  generic.walk.steps[4].routeChange.to = "做一个简单 MVP";
  generic.walk.steps[4].nextCarry = "做一个简单 MVP";
  assertInvalid(generic, "generic survivor");

  const noCausalBridge = structuredClone(validPacket);
  noCausalBridge.walk.steps[0].sceneLine = "小人打开页面开始做第一版功能卡片。";
  assertInvalid(noCausalBridge, "sceneLine without causal bridge");

  const noAssumptionBreak = structuredClone(validPacket);
  noAssumptionBreak.walk.steps[0].sceneLine = "因为路线还很重，所以小人做了一张卡片，发现需要继续变小，于是路线缩成固定模板。";
  assertInvalid(noAssumptionBreak, "sceneLine without assumption break should fail");

  const abstractOnlyBreak = structuredClone(validPacket);
  abstractOnlyBreak.walk.steps[0].sceneLine = "小人原本以为做完整就行，于是试了一下；结果太泛、太重、成本高，于是路线缩成固定模板。";
  assertInvalid(abstractOnlyBreak, "sceneLine with only abstract break should fail");

  const unsafePlatformAutomation = structuredClone(validPacket);
  unsafePlatformAutomation.result.nextTinyAction = "今天先写一个小红书爬虫，自动抓取平台数据，看哪些标题点赞高。";
  assertInvalid(unsafePlatformAutomation, "unsafe platform automation should fail");

  const heavyFirstStep = structuredClone(validPacket);
  heavyFirstStep.walk.steps[0].sceneLine = "小人原本以为直接做完整系统更像产品，于是打开编辑器写函数和写 API，把独立开发者想法直接接成完整后端；结果用户看完不知道下一步，凭什么用也不清楚，于是路线缩成固定模板。";
  assertInvalid(heavyFirstStep, "tool first step should not start with heavy build");

  const manualFirstStep = structuredClone(validPacket);
  manualFirstStep.walk.steps[0].sceneLine = "小人原本以为写函数才能验证工具价值，于是先不写函数，只用 ChatGPT 手动生成一张验证动作卡；结果用户看完知道今晚打开哪个工具，于是把路线缩成固定输入输出。";
  const manualFirstResult = validateLittleWalkerPacket(manualFirstStep);
  if (!manualFirstResult.ok) {
    throw new Error(`validator guard failed: manual-first heavy wording should pass: ${manualFirstResult.diagnostics.join("; ")}`);
  }
}

function assertInvalid(packet, label) {
  const result = validateLittleWalkerPacket(packet);
  if (result.ok) {
    throw new Error(`validator guard failed: ${label} should be invalid.`);
  }
}

function readPacketFile(filePath) {
  const absolutePath = path.resolve(projectRoot, filePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function loadEntryDemoPackets() {
  const context = loadLocalSimulationContext(projectRoot);
  const cases = context.window.FRICTION_CASES || {};
  const packets = LITTLE_WALKER_PACKET_SCHEMA.entryDemoInputs.map((input) => {
    const demoPacket = Object.values(cases).find((caseItem) => caseItem?.idea?.input === input);
    return demoPacket || buildLocalPacket(projectRoot, input);
  });

  return packets;
}

function runCli() {
  const fileIndex = process.argv.indexOf("--file");
  if (fileIndex !== -1) {
    const packet = readPacketFile(process.argv[fileIndex + 1]);
    const result = validateLittleWalkerPacket(packet);
    if (!result.ok) {
      console.error(JSON.stringify(result.diagnostics, null, 2));
      process.exit(1);
    }
    console.log("Little Walker packet file is valid.");
    return;
  }

  const packets = loadEntryDemoPackets().map(toLittleWalkerPacket);
  packets.forEach((packet) => {
    const result = validateLittleWalkerPacket(packet);
    if (!result.ok) {
      console.error(`FAIL\t${packet.originalInput}`);
      console.error(JSON.stringify(result.diagnostics, null, 2));
      process.exit(1);
    }
    console.log(`OK\t${packet.walk.steps.length} steps\t${packet.originalInput}`);
  });

  runGuardChecks(packets.find((packet) => /独立开发者|工具|小工具/.test(packet.originalInput)) || packets[0]);
  console.log("Validator guard checks passed.");
  console.log("All Little Walker demo packets passed.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli();
}
