const FALLBACK_REASONS = Object.freeze({
  missingProviderClient: "missing_provider_client",
  providerTimeout: "provider_timeout",
  invalidJson: "invalid_json",
  packetContractFailed: "packet_contract_failed",
  reportTone: "report_tone",
  routeDiscontinuity: "route_discontinuity",
  unsafePlatformAutomation: "unsafe_platform_automation"
});

const FAKE_PROVIDER_RESPONSE = {
  text: JSON.stringify({
    originalInput: "I want an AI tool that helps creators judge whether a topic is worth making.",
    result: {
      survivor: "A one-page topic check with title hook, comment question, and one next rewrite.",
      nextTinyAction: "Manually test five topics with three creators before building automation."
    },
    walk: {
      steps: [
        {
          sceneLine: "The walker tried a full topic scoring dashboard, but creators only copied the one sharper title rewrite.",
          currentSurvivingRoute: "A topic scoring dashboard",
          realityHit: "The full score felt like generic advice.",
          routeChange: {
            from: "A topic scoring dashboard",
            to: "One topic check with one title rewrite",
            why: "The smaller version creates an action the creator can use immediately."
          },
          nextCarry: "One topic check with one title rewrite"
        }
      ]
    }
  })
};

export async function runProviderAdapterContractExample({
  input,
  localPacket,
  providerClient,
  timeoutMs = 15000
}) {
  if (!providerClient) {
    return fallback(localPacket, FALLBACK_REASONS.missingProviderClient);
  }

  // 1. Keep provider credentials server-side.
  //    Credentials should be owned by providerClient, which is injected by the local server.
  //    This example never reads .env and never exposes keys to the browser.

  let providerResponse;
  try {
    providerResponse = await callProviderWithTimeout({
      providerClient,
      input,
      localPacket,
      timeoutMs
    });
  } catch (error) {
    return fallback(localPacket, error.message === "provider_timeout"
      ? FALLBACK_REASONS.providerTimeout
      : FALLBACK_REASONS.packetContractFailed);
  }

  // 2. Parse provider output.
  const parsed = parseProviderJson(providerResponse);
  if (!parsed.ok) {
    return fallback(localPacket, FALLBACK_REASONS.invalidJson);
  }

  // 3. Normalize into the Little Walker packet contract.
  const normalizedPacket = normalizeToLittleWalkerPacket({
    input,
    localPacket,
    providerPayload: parsed.value
  });

  // 4. Validate before returning.
  const validation = validateLittleWalkerPacketContract(normalizedPacket);
  if (!validation.ok) {
    return fallback(localPacket, validation.reason);
  }

  // 5. Return a valid packet. The adapter goal is not ordinary chat text.
  return {
    ok: true,
    source: "provider_adapter_contract_example",
    packet: normalizedPacket,
    fallbackReason: null
  };
}

async function callProviderWithTimeout({
  providerClient,
  input,
  localPacket,
  timeoutMs
}) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("provider_timeout")), timeoutMs);
  });

  const providerCall = Promise.resolve(providerClient.generateLittleWalkerPacket({
    input,
    localPacket,
    exampleResponse: FAKE_PROVIDER_RESPONSE
  }));

  return Promise.race([providerCall, timeout]);
}

function parseProviderJson(providerResponse) {
  const rawText = providerResponse?.text;
  if (typeof rawText !== "string") {
    return { ok: false, value: null };
  }

  try {
    return { ok: true, value: JSON.parse(rawText) };
  } catch {
    return { ok: false, value: null };
  }
}

function normalizeToLittleWalkerPacket({
  input,
  localPacket,
  providerPayload
}) {
  return {
    ...localPacket,
    originalInput: providerPayload.originalInput || input,
    walk: providerPayload.walk || localPacket?.walk,
    result: providerPayload.result || localPacket?.result
  };
}

function validateLittleWalkerPacketContract(packet) {
  const steps = packet?.walk?.steps;
  if (!Array.isArray(steps) || steps.length === 0) {
    return { ok: false, reason: FALLBACK_REASONS.packetContractFailed };
  }

  if (containsReportTone(packet)) {
    return { ok: false, reason: FALLBACK_REASONS.reportTone };
  }

  if (hasRouteDiscontinuity(steps)) {
    return { ok: false, reason: FALLBACK_REASONS.routeDiscontinuity };
  }

  if (containsUnsafePlatformAutomation(packet)) {
    return { ok: false, reason: FALLBACK_REASONS.unsafePlatformAutomation };
  }

  return { ok: true, reason: null };
}

function containsReportTone(packet) {
  const text = JSON.stringify(packet);
  return /comprehensive analysis|market potential|建议你|综合分析|可行性较高/i.test(text);
}

function hasRouteDiscontinuity(steps) {
  for (let index = 1; index < steps.length; index += 1) {
    const previousTo = steps[index - 1]?.routeChange?.to;
    const currentFrom = steps[index]?.routeChange?.from || steps[index]?.currentSurvivingRoute;
    if (previousTo && currentFrom && previousTo !== currentFrom) return true;
  }

  return false;
}

function containsUnsafePlatformAutomation(packet) {
  const text = JSON.stringify(packet);
  return /auto[- ]?upload|auto[- ]?publish|automatic trading|自动上传|自动发布|自动下单/i.test(text);
}

function fallback(localPacket, reason) {
  return {
    ok: false,
    source: "local_fallback",
    packet: localPacket,
    fallbackReason: reason
  };
}

export { FALLBACK_REASONS, FAKE_PROVIDER_RESPONSE };
