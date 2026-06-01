#!/usr/bin/env node

import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildAiDoorwayJudgePacket, buildLocalPacket, runDeepSeekDoorwayReview, runDeepSeekShadow } from "./deepseek-shadow-runtime.mjs";
import {
  buildFixtureAiDoorwayJudgeReview,
  isHardLocalDoorwayStop,
  mapLocalGateToDoorwayVerdict,
  runAiDoorwayJudge,
  validateAiDoorwayJudgeReview
} from "./ai-doorway-judge-runtime.mjs";
import { runDeepSeekLittleWalkerPacket } from "./little-walker-runtime.mjs";

const root = path.resolve(process.cwd());
const host = "127.0.0.1";
const port = Number.parseInt(process.env.PORT || "4173", 10);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml; charset=utf-8"
};

const deniedStaticSegments = new Set([
  ".git",
  "artifacts",
  "backups",
  "handoffs",
  "node_modules",
  "tasks"
]);

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${host}:${port}`);

  if (request.method === "POST" && requestUrl.pathname === "/api/deepseek-shadow") {
    await handleDeepSeekShadow(request, response);
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/deepseek-doorway-review") {
    await handleDeepSeekDoorwayReview(request, response);
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/ai-doorway-judge") {
    await handleAiDoorwayJudge(request, response);
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/deepseek-little-walker-packet") {
    await handleDeepSeekLittleWalkerPacket(request, response);
    return;
  }

  let pathname = decodeURIComponent(requestUrl.pathname);
  if (pathname === "/favicon.ico") {
    response.writeHead(204, { "Cache-Control": "no-store" });
    response.end();
    return;
  }
  if (pathname === "/") pathname = "/index.html";

  const filePath = path.resolve(root, `.${pathname}`);
  if (!filePath.startsWith(root)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }
  if (isDeniedStaticPath(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

function isDeniedStaticPath(filePath) {
  const relativePath = path.relative(root, filePath);
  const parts = relativePath.split(path.sep).filter(Boolean);
  return parts.some((part) => {
    if (deniedStaticSegments.has(part)) return true;
    if (part.startsWith(".") && part !== ".env.example") return true;
    if (part === ".env.example") return true;
    return false;
  });
}

server.listen(port, host, () => {
  console.log(`IdeaRoast static server listening at http://${host}:${port}/`);
});

async function handleDeepSeekShadow(request, response) {
  try {
    const body = await readJsonBody(request);
    const input = String(body.input || "").trim();

    if (!input) {
      writeJsonResponse(response, 400, { ok: false, reason: "missing_input" });
      return;
    }

    const localPacket = buildLocalPacket(root, input);
    const result = await runDeepSeekShadow({
      input,
      localPacket,
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_SHADOW_MODEL || "deepseek-v4-flash",
      baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
      timeoutMs: Number.parseInt(process.env.DEEPSEEK_SHADOW_TIMEOUT_MS || "90000", 10)
    });

    writeJsonResponse(response, 200, {
      ...result,
      localGateStatus: localPacket.clarityGate?.status || "unknown"
    });
  } catch (error) {
    writeJsonResponse(response, 500, {
      ok: false,
      reason: "shadow_server_error",
      error: error.message
    });
  }
}

async function handleDeepSeekDoorwayReview(request, response) {
  try {
    const body = await readJsonBody(request);
    const input = String(body.input || "").trim();

    if (!input) {
      writeJsonResponse(response, 400, { ok: false, reason: "missing_input" });
      return;
    }

    const localPacket = buildLocalPacket(root, input);
    const result = await runDeepSeekDoorwayReview({
      input,
      localPacket,
      projectRoot: root,
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_DOORWAY_MODEL || process.env.DEEPSEEK_SHADOW_MODEL || "deepseek-v4-flash",
      baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
      timeoutMs: Number.parseInt(process.env.DEEPSEEK_DOORWAY_TIMEOUT_MS || "45000", 10)
    });

    writeJsonResponse(response, 200, {
      ...result,
      localGateStatus: localPacket.clarityGate?.status || "unknown"
    });
  } catch (error) {
    writeJsonResponse(response, 500, {
      ok: false,
      reason: "doorway_review_server_error",
      error: error.message
    });
  }
}

async function handleAiDoorwayJudge(request, response) {
  try {
    const body = await readJsonBody(request);
    const input = String(body.input || "").trim();

    if (!input) {
      writeJsonResponse(response, 400, { ok: false, reason: "missing_input" });
      return;
    }

    const localPacket = buildLocalPacket(root, input);
    const localGateStatus = localPacket.clarityGate?.status || "unknown";
    const localVerdict = mapLocalGateToDoorwayVerdict(localGateStatus);
    const localRouteMode = getLocalRouteMode(localPacket);

    if (isHardLocalDoorwayStop(localPacket)) {
      writeJsonResponse(response, 200, {
        ok: true,
        source: "local_hard_stop",
        action: "use_local_gate",
        localGateStatus,
        localVerdict,
        verdict: localVerdict,
        routeMode: localRouteMode,
        validatorStatus: "not_called",
        fallbackReason: ""
      });
      return;
    }

    if (body.forceFailure || process.env.AI_DOORWAY_JUDGE_FORCE_FAILURE === "1") {
      writeJsonResponse(response, 200, {
        ok: false,
        source: "ai_judge_failed",
        action: "fallback_local",
        reason: "forced_failure",
        fallbackReason: "forced_failure",
        localGateStatus,
        localVerdict,
        routeMode: localRouteMode,
        directBuildTask: localPacket.clarityGate?.directBuildTask || null,
        validatorStatus: "not_run"
      });
      return;
    }

    const judgeMode = process.env.AI_DOORWAY_JUDGE_MODE || "live";
    const result = judgeMode === "fixture"
      ? runFixtureAiDoorwayJudge({ input, localPacket })
      : await runAiDoorwayJudge({
        input,
        localPacket,
        apiKey: process.env.DEEPSEEK_API_KEY,
        model: process.env.DEEPSEEK_DOORWAY_JUDGE_MODEL || process.env.DEEPSEEK_SHADOW_MODEL || "deepseek-v4-flash",
        baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
        timeoutMs: Number.parseInt(process.env.DEEPSEEK_DOORWAY_TIMEOUT_MS || "45000", 10)
      });

    if (!result.ok) {
      const invalid = result.reason === "review_invalid";
      writeJsonResponse(response, 200, {
        ...result,
        source: invalid ? "ai_judge_invalid" : "ai_judge_failed",
        action: "fallback_local",
        fallbackReason: result.reason || "ai_judge_failed",
        localGateStatus,
        localVerdict,
        routeMode: localRouteMode,
        directBuildTask: localPacket.clarityGate?.directBuildTask || null,
        validatorStatus: invalid ? "invalid" : "not_run"
      });
      return;
    }

    const overridePacket = buildAiDoorwayJudgePacket(root, input, result.review);

    writeJsonResponse(response, 200, {
      ok: true,
      source: "ai_judge_pass",
      action: result.review.verdict === "can_run" ? "allow_ai_run" : "stop_ai",
      mode: judgeMode,
      verdict: result.review.verdict,
      localGateStatus,
      localVerdict,
      aiVerdict: result.review.verdict,
      validatorStatus: "valid",
      routeMode: result.review.routeMode || "",
      riskFlags: result.review.riskFlags,
      safetyShrink: result.review.safetyShrink,
      firstRunnableArtifact: result.review.firstRunnableArtifact,
      directBuildTask: result.review.directBuildTask || null,
      fallbackReason: "",
      review: result.review,
      overridePacket,
      warnings: result.warnings || [],
      usage: result.usage || null
    });
  } catch (error) {
    writeJsonResponse(response, 500, {
      ok: false,
      source: "ai_judge_failed",
      action: "fallback_local",
      reason: "ai_doorway_judge_server_error",
      error: error.message
    });
  }
}

function getLocalRouteMode(localPacket) {
  const explicitRouteMode = localPacket?.clarityGate?.routeMode || "";
  if (explicitRouteMode) return explicitRouteMode;
  const status = localPacket?.clarityGate?.status || "";
  const stepCount = Array.isArray(localPacket?.frictionBites) ? localPacket.frictionBites.length : 0;
  return ["ready", "usable"].includes(status) && stepCount > 0 ? "try_walk" : "";
}

function runFixtureAiDoorwayJudge({ input, localPacket }) {
  const rawReview = buildFixtureAiDoorwayJudgeReview({ input });
  const normalized = validateAiDoorwayJudgeReview(rawReview, { input, localPacket });
  if (!normalized.ok) {
    return {
      ok: false,
      mode: "fixture",
      reason: "review_invalid",
      diagnostics: normalized.diagnostics,
      warnings: normalized.warnings,
      rawReview
    };
  }

  return {
    ok: true,
    mode: "fixture",
    review: normalized.review,
    warnings: normalized.warnings,
    rawReview
  };
}

async function handleDeepSeekLittleWalkerPacket(request, response) {
  try {
    const body = await readJsonBody(request);
    const input = String(body.input || "").trim();

    if (!input) {
      writeJsonResponse(response, 400, { ok: false, reason: "missing_input" });
      return;
    }

    const localPacket = buildLocalPacket(root, input);
    const result = await runDeepSeekLittleWalkerPacket({
      input,
      localPacket,
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_LITTLE_WALKER_MODEL || process.env.DEEPSEEK_SHADOW_MODEL || "deepseek-v4-flash",
      baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
      timeoutMs: Number.parseInt(process.env.DEEPSEEK_LITTLE_WALKER_TIMEOUT_MS || "180000", 10)
    });

    writeJsonResponse(response, 200, {
      ...result,
      localGateStatus: localPacket.clarityGate?.status || "unknown"
    });
  } catch (error) {
    writeJsonResponse(response, 500, {
      ok: false,
      reason: "little_walker_packet_server_error",
      error: error.message
    });
  }
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 24000) {
        reject(new Error("request_body_too_large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("invalid_json_body"));
      }
    });
    request.on("error", reject);
  });
}

function writeJsonResponse(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(`${JSON.stringify(payload, null, 2)}\n`);
}
