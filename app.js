const stateLabels = {
  heat: "热度",
  confusion: "误解率",
  cloneRisk: "复刻风险",
  techPressure: "技术压力",
  replacementPressure: "替代品压力",
  branchCount: "分支数量"
};

const barColors = {
  heat: "#f4b24a",
  confusion: "#ee6b6e",
  cloneRisk: "#d98df4",
  techPressure: "#78a8ff",
  replacementPressure: "#58c4b8",
  branchCount: "#9edb7a"
};

const agentColors = {
  teal: "#58c4b8",
  rose: "#ee8da5",
  amber: "#f4b24a",
  gray: "#9ca3ad",
  blue: "#78a8ff",
  violet: "#b58cff",
  green: "#9edb7a",
  orange: "#f28b54"
};

const demoSpriteProfiles = {
  designer: {
    label: "自由设计师视觉壳",
    width: 104,
    height: 104,
    walkFrameMs: 170,
    baseFacing: "left",
    poses: {
      idle: "./assets/sprites/batch1/runtime-walk-enhanced/freelance-designer-idle.png",
      walk: "./assets/sprites/batch1/runtime-walk-enhanced/freelance-designer-walk-01.png",
      special: "./assets/sprites/batch1/runtime-walk-enhanced/freelance-designer-special.png"
    },
    frames: {
      walk: [
        "./assets/sprites/batch1/runtime-walk-enhanced/freelance-designer-walk-01.png",
        "./assets/sprites/batch1/runtime-walk-enhanced/freelance-designer-walk-02.png",
        "./assets/sprites/batch1/runtime-walk-enhanced/freelance-designer-walk-03.png",
        "./assets/sprites/batch1/runtime-walk-enhanced/freelance-designer-walk-04.png"
      ]
    }
  },
  student: {
    label: "发呆学生视觉壳",
    width: 104,
    height: 104,
    walkFrameMs: 118,
    walkFrameDurations: [120, 108, 112, 128, 120, 108, 128, 112],
    minWalkFrameMs: 70,
    walkFrameVarianceMs: 4,
    stepCycleFrames: 4,
    walkDurationScale: 1.22,
    walkLiftPx: 0.75,
    walkTiltA: "-0.08deg",
    walkTiltB: "0.12deg",
    baseFacing: "left",
    poses: {
      idle: "./assets/sprites/batch1/runtime-walk-enhanced/dazed-student-idle.png",
      walk: "./assets/sprites/batch1/generated-walk/dazed-student/dazed-student-walk-01.png",
      special: "./assets/sprites/batch1/runtime-walk-enhanced/dazed-student-special.png"
    },
    frames: {
      walk: [
        "./assets/sprites/batch1/generated-walk/dazed-student/dazed-student-walk-01.png",
        "./assets/sprites/batch1/generated-walk/dazed-student/dazed-student-walk-02.png",
        "./assets/sprites/batch1/generated-walk/dazed-student/dazed-student-walk-03.png",
        "./assets/sprites/batch1/generated-walk/dazed-student/dazed-student-walk-04.png",
        "./assets/sprites/batch1/generated-walk/dazed-student/dazed-student-walk-05.png",
        "./assets/sprites/batch1/generated-walk/dazed-student/dazed-student-walk-06.png",
        "./assets/sprites/batch1/generated-walk/dazed-student/dazed-student-walk-07.png",
        "./assets/sprites/batch1/generated-walk/dazed-student/dazed-student-walk-08.png"
      ]
    }
  },
  skeptic: {
    label: "秃顶怀疑者视觉壳",
    width: 104,
    height: 104,
    walkFrameMs: 190,
    baseFacing: "left",
    poses: {
      idle: "./assets/sprites/batch1/runtime-walk-enhanced/bald-skeptic-idle.png",
      walk: "./assets/sprites/batch1/runtime-walk-enhanced/bald-skeptic-walk-01.png",
      special: "./assets/sprites/batch1/runtime-walk-enhanced/bald-skeptic-special.png"
    },
    frames: {
      walk: [
        "./assets/sprites/batch1/runtime-walk-enhanced/bald-skeptic-walk-01.png",
        "./assets/sprites/batch1/runtime-walk-enhanced/bald-skeptic-walk-02.png",
        "./assets/sprites/batch1/runtime-walk-enhanced/bald-skeptic-walk-03.png",
        "./assets/sprites/batch1/runtime-walk-enhanced/bald-skeptic-walk-04.png"
      ]
    }
  },
  checker: {
    label: "查证员视觉壳",
    width: 104,
    height: 104,
    walkFrameMs: 116,
    walkFrameDurations: [116, 92, 96, 132, 116, 92, 132, 112],
    stepCycleFrames: 4,
    walkDurationScale: 1.2,
    walkLiftPx: 1,
    walkTiltA: "-0.18deg",
    walkTiltB: "0.24deg",
    baseFacing: "left",
    poses: {
      idle: "./assets/sprites/batch1/generated-walk/fact-checker/fact-checker-idle-standing.png",
      walk: "./assets/sprites/batch1/generated-walk/fact-checker/fact-checker-walk-01.png",
      special: "./assets/sprites/batch1/runtime-walk-enhanced/fact-checker-special.png"
    },
    frames: {
      walk: [
        "./assets/sprites/batch1/generated-walk/fact-checker/fact-checker-walk-01.png",
        "./assets/sprites/batch1/generated-walk/fact-checker/fact-checker-walk-02.png",
        "./assets/sprites/batch1/generated-walk/fact-checker/fact-checker-walk-03.png",
        "./assets/sprites/batch1/generated-walk/fact-checker/fact-checker-walk-04.png",
        "./assets/sprites/batch1/generated-walk/fact-checker/fact-checker-walk-05.png",
        "./assets/sprites/batch1/generated-walk/fact-checker/fact-checker-walk-06.png",
        "./assets/sprites/batch1/generated-walk/fact-checker/fact-checker-walk-07.png",
        "./assets/sprites/batch1/generated-walk/fact-checker/fact-checker-walk-08.png"
      ]
    }
  }
};

const agentSpriteProfiles = {
  ajie: "checker",
  linran: "designer",
  xiaochen: "student",
  laozhou: "skeptic",
  mapfan: "student",
  pm: "designer",
  searcher: "checker",
  budget: "skeptic"
};

const idleActivities = ["看地球", "闲聊", "查资料", "画分支", "路过", "发呆", "估成本", "看热闹", "看手机", "回短信", "记笔记", "翻资料"];

const movementBounds = {
  minX: 20,
  maxX: 80,
  minY: 48,
  maxY: 84
};

const planetEdgePath = {
  centerX: 50,
  radiusX: 30,
  topY: 49,
  bottomY: 84,
  bandY: 3.2
};

const collisionFootprint = {
  radiusX: 9.2,
  radiusY: 6.4
};

const SOLO_PROTAGONIST_ID = "xiaochen";
const RPG_STORYBOARD_STEP_NUMBER = 1;
const LITTLE_WALKER_STEP_LIMIT = 5;
const soloWalkerRouteTargets = [
  { x: 47, y: 71.2 },
  { x: 47, y: 71.2 },
  { x: 47, y: 71.2 },
  { x: 47, y: 71.2 },
  { x: 47, y: 71.2 },
  { x: 47, y: 71.2 }
];

const routeBoardNodes = ["出发", "卡住", "想到", "变形", "带回"];

let rpgStoryboardActive = false;
let rpgStoryboardFrameIndex = 0;
let rpgStoryboardStepNumber = 0;
let activeCompleteEvidenceStep = 0;

const bubbleOffsets = [
  { x: 0, y: 0 },
  { x: -168, y: -20 },
  { x: 168, y: -20 },
  { x: -112, y: -92 },
  { x: 112, y: -92 },
  { x: 0, y: -132 },
  { x: -224, y: 42 },
  { x: 224, y: 42 },
  { x: 0, y: -232 },
  { x: -288, y: -116 },
  { x: 288, y: -116 },
  { x: -288, y: 96 },
  { x: 288, y: 96 },
  { x: 0, y: 118 }
];

const backgroundPool = [
  "独立开发者",
  "自由设计师",
  "开源项目维护者",
  "路过学生",
  "竞品用户",
  "小团队创始人",
  "预算敏感用户",
  "地图库爱好者",
  "短视频创作者",
  "产品经理",
  "工具收藏党",
  "课堂展示用户"
];

const tempRolePool = ["路人", "围观者", "误解者", "验证员", "质疑者", "模仿者", "传播者", "分叉者", "冷场制造者", "预算党"];

const emotionConfig = {
  neutral: { label: "平静", color: "#b7b0a1", bubble: "#f7f0d6" },
  curious: { label: "好奇", color: "#58c4b8", bubble: "#dff7f1" },
  indifferent: { label: "冷漠", color: "#9ca3ad", bubble: "#e4e0d5" },
  skeptical: { label: "怀疑", color: "#f4b24a", bubble: "#f7e7bd" },
  excited: { label: "兴奋", color: "#9edb7a", bubble: "#e2f4c7" },
  confused: { label: "困惑", color: "#d98df4", bubble: "#ead6f6" },
  anxious: { label: "焦虑", color: "#ee6b6e", bubble: "#f8d1cf" },
  amused: { label: "看热闹", color: "#78a8ff", bubble: "#d9e7ff" }
};

const actionConfig = {
  ambient_watch: { label: "看公告", zone: "roam" },
  watch_idea: { label: "围观", zone: "idea" },
  ignore_and_leave: { label: "离开", zone: "edge" },
  misread_idea: { label: "误解", zone: "idea" },
  check_competitor: { label: "查证", zone: "desk", phone: true },
  sketch_clone: { label: "复刻", zone: "bench" },
  suggest_branch: { label: "分叉", zone: "branch" },
  argue: { label: "争论", zone: "group" },
  share: { label: "传播", zone: "group", phone: true },
  calculate_cost: { label: "算成本", zone: "desk" },
  take_note: { label: "记笔记", zone: "branch" },
  phone_scroll: { label: "看手机", zone: "roam", phone: true },
  think: { label: "思考", zone: "idea" }
};

const eventTemplates = [
  {
    event: "crowd_gathered",
    label: "突然围观",
    tempRoles: ["围观者", "传播者", "路人"],
    emotions: ["curious", "amused", "excited"],
    actions: ["watch_idea", "share"],
    bubbles: [
      "这个画面感我能想象出来，先围一下。",
      "等下，它如果像玩具一样能转，我会点开看。",
      "我不一定会用，但我想知道它长什么样。"
    ],
    signalDelta: { heat: 5, confusion: 1 }
  },
  {
    event: "cold_walkaway",
    label: "冷场离开",
    tempRoles: ["冷场制造者", "路人", "预算党"],
    emotions: ["indifferent", "skeptical"],
    actions: ["ignore_and_leave", "phone_scroll"],
    bubbles: [
      "听起来很炫，但我现在没有要解决的问题。",
      "我看一眼就懂了，然后可能就走了。",
      "如果只是好看，我不会每天打开。"
    ],
    signalDelta: { heat: -4, replacementPressure: 3 }
  },
  {
    event: "idea_misread",
    label: "误解 idea",
    tempRoles: ["误解者", "路人", "传播者"],
    emotions: ["confused", "skeptical", "amused"],
    actions: ["misread_idea", "share"],
    bubbles: [
      "所以它其实是一个新闻 App？那我为什么不用现成的？",
      "我以为这是世界时钟皮肤包，不是一个产品。",
      "等下，重点是时间、新闻，还是国家关系？"
    ],
    signalDelta: { confusion: 8, replacementPressure: 4, heat: -1 }
  },
  {
    event: "competitor_found",
    label: "查到竞品",
    tempRoles: ["验证员", "质疑者", "替代品猎人"],
    emotions: ["skeptical", "anxious", "curious"],
    actions: ["check_competitor", "take_note"],
    bubbles: [
      "查到几个相似工具。现在要证明它不是换皮世界时钟。",
      "新闻地图有不少，游戏感可能才是差异点。",
      "竞品不怕，怕的是差异点说不清。"
    ],
    signalDelta: { cloneRisk: 7, replacementPressure: 6, confusion: -2 }
  },
  {
    event: "clone_started",
    label: "开始复刻",
    tempRoles: ["模仿者", "开发者", "预算党"],
    emotions: ["excited", "skeptical"],
    actions: ["sketch_clone", "calculate_cost"],
    bubbles: [
      "我能先用假数据和 Three.js 搭个壳，真正重的是数据。",
      "这个 Demo 好复刻，难点不在地球，在事件关系。",
      "如果第一版只要手写 5 条事件，我今晚就能试。"
    ],
    signalDelta: { cloneRisk: 9, techPressure: 4, heat: 2 }
  },
  {
    event: "branch_suggested",
    label: "提出分叉",
    tempRoles: ["分叉者", "产品人", "验证员"],
    emotions: ["curious", "excited", "skeptical"],
    actions: ["suggest_branch", "take_note"],
    bubbles: [
      "别做全新闻，先做“今天世界发生了什么”的互动地球日历。",
      "我会砍成展示工具，不要一开始就碰实时新闻。",
      "分支：每天精选 5 条事件，先看用户会不会转地球。"
    ],
    signalDelta: { branchCount: 1, heat: 4, techPressure: -3, confusion: -3 }
  },
  {
    event: "argument_started",
    label: "发生争论",
    tempRoles: ["质疑者", "拥护者", "围观者"],
    emotions: ["skeptical", "excited", "anxious"],
    actions: ["argue", "watch_idea"],
    bubbles: [
      "有趣不等于有用，但没趣的工具也没人想碰。",
      "你说它像展品，我反而觉得展品方向更清楚。",
      "如果它不是日常工具，那就别用日常工具的标准审它。"
    ],
    signalDelta: { heat: 6, confusion: 2 }
  },
  {
    event: "detail_hooked",
    label: "细节吸引",
    tempRoles: ["围观者", "潜在用户", "二创者"],
    emotions: ["curious", "excited", "amused"],
    actions: ["think", "watch_idea", "take_note"],
    bubbles: [
      "国家之间有连线这个细节挺抓人，像一张会动的关系图。",
      "如果今天事件能像游戏任务一样弹出来，我愿意玩。",
      "它不一定要替代新闻，可能是一个好看的世界入口。"
    ],
    signalDelta: { heat: 7, confusion: -2, replacementPressure: -3 }
  },
  {
    event: "cost_alarm",
    label: "成本警报",
    tempRoles: ["预算党", "质疑者", "维护者"],
    emotions: ["anxious", "skeptical"],
    actions: ["calculate_cost", "check_competitor"],
    bubbles: [
      "实时新闻、事件关系、3D 画面，这三个词放一起很贵。",
      "别一上来做自动理解，先手写事件验证停留时间。",
      "如果数据源不稳，画面再好也会塌。"
    ],
    signalDelta: { techPressure: 8, heat: -2, cloneRisk: -1 }
  }
];

const eventTransitions = {
  ambient: ["crowd_gathered", "idea_misread", "detail_hooked", "cold_walkaway"],
  crowd_gathered: ["detail_hooked", "idea_misread", "competitor_found", "argument_started"],
  detail_hooked: ["crowd_gathered", "branch_suggested", "clone_started"],
  idea_misread: ["argument_started", "competitor_found", "cold_walkaway"],
  competitor_found: ["cost_alarm", "branch_suggested", "argument_started", "clone_started"],
  clone_started: ["cost_alarm", "argument_started", "branch_suggested"],
  branch_suggested: ["clone_started", "argument_started", "detail_hooked"],
  argument_started: ["branch_suggested", "cold_walkaway", "detail_hooked"],
  cost_alarm: ["branch_suggested", "cold_walkaway", "competitor_found"],
  cold_walkaway: ["detail_hooked", "crowd_gathered"]
};

const agentEventAffinities = {
  ajie: ["clone_started", "cost_alarm", "branch_suggested"],
  linran: ["detail_hooked", "idea_misread", "crowd_gathered"],
  xiaochen: ["crowd_gathered", "detail_hooked", "idea_misread"],
  laozhou: ["cost_alarm", "argument_started", "cold_walkaway"],
  mapfan: ["detail_hooked", "crowd_gathered", "branch_suggested"],
  pm: ["branch_suggested", "idea_misread", "argument_started"],
  searcher: ["competitor_found", "cost_alarm", "branch_suggested"],
  budget: ["cost_alarm", "cold_walkaway", "competitor_found"]
};

const eventMemoryDelta = {
  crowd_gathered: { attention: 12, skepticism: -2, makerEnergy: 0 },
  cold_walkaway: { attention: -22, skepticism: 4, makerEnergy: -4 },
  idea_misread: { attention: -3, skepticism: 6, makerEnergy: -2 },
  competitor_found: { attention: 6, skepticism: 8, makerEnergy: -1 },
  clone_started: { attention: 9, skepticism: -2, makerEnergy: 10 },
  branch_suggested: { attention: 8, skepticism: -3, makerEnergy: 7 },
  argument_started: { attention: 5, skepticism: 4, makerEnergy: 1 },
  detail_hooked: { attention: 14, skepticism: -6, makerEnergy: 3 },
  cost_alarm: { attention: 2, skepticism: 10, makerEnergy: -6 },
  expression_friction: { attention: -2, skepticism: 5, makerEnergy: -1 },
  execution_friction: { attention: 4, skepticism: 7, makerEnergy: 5 },
  cost_friction: { attention: -4, skepticism: 10, makerEnergy: -6 },
  replacement_friction: { attention: 3, skepticism: 9, makerEnergy: -2 },
  retention_friction: { attention: -14, skepticism: 6, makerEnergy: -5 }
};

const frictionEventLabels = {
  expression_friction: "表达摩擦",
  execution_friction: "执行摩擦",
  cost_friction: "成本摩擦",
  replacement_friction: "替代品摩擦",
  retention_friction: "冷却摩擦",
  acquisition_friction: "触达摩擦",
  trust_friction: "权限摩擦",
  evidence_needed: "替代品摩擦",
  scope_friction: "范围摩擦",
  definition_gap: "缺口诊断"
};

const stageZones = {
  idea: [
    { x: 30, y: 62 },
    { x: 39, y: 76 },
    { x: 51, y: 84 },
    { x: 64, y: 77 },
    { x: 74, y: 61 }
  ],
  desk: [
    { x: 23, y: 55 },
    { x: 30, y: 67 },
    { x: 39, y: 77 }
  ],
  bench: [
    { x: 42, y: 81 },
    { x: 51, y: 84 },
    { x: 60, y: 81 }
  ],
  branch: [
    { x: 62, y: 79 },
    { x: 71, y: 68 },
    { x: 78, y: 55 }
  ],
  group: [
    { x: 31, y: 64 },
    { x: 43, y: 80 },
    { x: 56, y: 83 },
    { x: 69, y: 68 }
  ],
  edge: [
    { x: 21, y: 50 },
    { x: 27, y: 63 },
    { x: 38, y: 77 },
    { x: 50, y: 84 },
    { x: 63, y: 77 },
    { x: 73, y: 63 },
    { x: 79, y: 50 }
  ],
  roam: [
    { x: 22, y: 51 },
    { x: 27, y: 62 },
    { x: 34, y: 72 },
    { x: 43, y: 80 },
    { x: 52, y: 84 },
    { x: 62, y: 79 },
    { x: 71, y: 67 },
    { x: 78, y: 53 }
  ]
};

const roundTitlePool = [
  "小人们随机消化这个 idea",
  "有人靠近，有人误解，有人准备复刻",
  "沙盒里冒出新的临时角色",
  "同一个 idea 被不同人扯向不同方向",
  "局部事件触发，不是全员同步表演"
];

const CUSTOM_CASE_ID = "__custom-input";

let simulation;
let currentSignals = {};
let currentRound = 0;
let playableStepCountSnapshot = 0;
let sandboxStarted = false;
let sandboxCompleted = false;
let biteInProgress = false;
let roamTimer;
let inputTimer;
let activeSeed = "";
let activeCaseId = "";
let simulationRng = Math.random;
let activeSpeakerAgentId = "";
let deepSeekShadowRunId = 0;
let deepSeekDoorwayRunId = 0;
let deepSeekPacketRunId = 0;
let activeStagePreviewMode = "local_mock";
let doorwayFeedbackHold = null;
let directBuildActive = false;

const agentNodes = new Map();
const agentStates = new Map();
const agentMemories = new Map();
const recentStateUpdates = [];

const stage = document.querySelector("#stage");
const signals = document.querySelector("#signals");
const eventLog = document.querySelector("#eventLog");
const stateFeed = document.querySelector("#stateFeed");
const roundLabel = document.querySelector("#roundLabel");
const roundTitle = document.querySelector("#roundTitle");
const branchBoard = document.querySelector("#branchBoard");
const ideaName = document.querySelector("#ideaName");
const sceneName = document.querySelector("#sceneName");
const stageDialogue = document.querySelector("#stageDialogue");
const routeBoard = document.querySelector("#routeBoard");
const routeBoardHint = document.querySelector("#routeBoardHint");
const soloAlert = document.querySelector("#soloAlert");
const controlDetails = document.querySelector("#controlDetails");
const sideDetails = document.querySelector("#sideDetails");
const pathCard = document.querySelector("#pathCard");
const biteCard = document.querySelector("#biteCard");
const resultCard = document.querySelector("#resultCard");
const walkSummaryCard = document.querySelector("#walkSummaryCard");
const observerCheckCard = document.querySelector("#observerCheckCard");
const frictionLibraryCard = document.querySelector("#frictionLibraryCard");
const frictionTrack = document.querySelector("#frictionTrack");
const clarityCard = document.querySelector("#clarityCard");
const pathStart = document.querySelector("#pathStart");
const pathMinimum = document.querySelector("#pathMinimum");
const pathValidation = document.querySelector("#pathValidation");
const ideaInput = document.querySelector("#ideaInput");
const caseSelect = document.querySelector("#caseSelect");
const seedInput = document.querySelector("#seedInput");
const roastButton = document.querySelector("#roastIdea");
const nextRoundButton = document.querySelector("#nextRound");
const resetButton = document.querySelector("#resetSim");
const randomSeedButton = document.querySelector("#randomSeed");
const deepSeekShadowCard = document.querySelector("#deepSeekShadowCard");
const deepSeekDoorwayToggle = document.querySelector("#deepSeekDoorwayToggle");
const deepSeekDoorwayStatus = document.querySelector("#deepSeekDoorwayStatus");
const aiDoorwayJudgeSummary = document.querySelector("#aiDoorwayJudgeSummary");
const deepSeekShadowToggle = document.querySelector("#deepSeekShadowToggle");
const deepSeekShadowStatus = document.querySelector("#deepSeekShadowStatus");
const deepSeekShadowOutput = document.querySelector("#deepSeekShadowOutput");
const deepSeekPacketToggle = document.querySelector("#deepSeekPacketToggle");
const deepSeekPacketStagePreviewToggle = document.querySelector("#deepSeekPacketStagePreviewToggle");
const deepSeekPacketStagePreviewStatus = document.querySelector("#deepSeekPacketStagePreviewStatus");
const deepSeekPacketStatus = document.querySelector("#deepSeekPacketStatus");
const deepSeekPacketSummary = document.querySelector("#deepSeekPacketSummary");
const deepSeekPacketDetails = document.querySelector("#deepSeekPacketDetails");
const deepSeekPacketOutput = document.querySelector("#deepSeekPacketOutput");

function loadSimulation() {
  initializeCaseSelect();
  switchSimulationCase(CUSTOM_CASE_ID, { resetIdea: true, resetSeed: true });
  startRoaming();
}

function initializeCaseSelect() {
  const cases = getFrictionCases();
  const caseIds = Object.keys(cases);
  activeCaseId = activeCaseId || CUSTOM_CASE_ID;

  if (!caseSelect) return;
  caseSelect.innerHTML = "";

  const customOption = document.createElement("option");
  customOption.value = CUSTOM_CASE_ID;
  customOption.textContent = "自己的想法";
  caseSelect.append(customOption);

  caseIds.forEach((caseId) => {
    const option = document.createElement("option");
    option.value = caseId;
    option.textContent = cases[caseId].label || cases[caseId].idea?.name || caseId;
    caseSelect.append(option);
  });

  caseSelect.value = activeCaseId;
}

function getFrictionCases() {
  return window.FRICTION_CASES || { default: window.SAMPLE_SIMULATION };
}

function getDefaultCaseId() {
  const cases = getFrictionCases();
  return cases["earth-clock"] ? "earth-clock" : Object.keys(cases)[0];
}

function switchSimulationCase(caseId, options = {}) {
  if (caseId === CUSTOM_CASE_ID) {
    switchToCustomInputSimulation({ resetIdea: options.resetIdea, resetSeed: options.resetSeed, log: false });
    return;
  }

  clearDoorwayFeedbackHold();
  activeCompleteEvidenceStep = 0;
  const cases = getFrictionCases();
  const nextCase = cases[caseId] || cases[getDefaultCaseId()] || window.SAMPLE_SIMULATION;
  activeCaseId = nextCase.id || caseId || "default";
  simulation = structuredClone(nextCase);

  if (caseSelect) caseSelect.value = activeCaseId;
  if (options.resetIdea !== false && ideaInput) {
    ideaInput.value = simulation.idea.input || simulation.idea.pitch || simulation.idea.name || "";
  }
  if (options.resetSeed !== false && seedInput) {
    seedInput.value = simulation.seed || `${activeCaseId}-01`;
  }

  currentSignals = structuredClone(simulation.signals);
  initializeSeedInput();
  resetSimulationRng("idle");
  setupScene();
  initializeAgentStates();
  renderBaseAgents();
  renderSignals(currentSignals);
  renderWaitingState();
}

function switchToCustomInputSimulation(options = {}) {
  if (options.resetIdea && ideaInput) {
    clearDoorwayFeedbackHold();
    activeCompleteEvidenceStep = 0;
    ideaInput.value = "";
  }

  const input = ideaInput?.value.trim();
  const builder = window.buildLocalFrictionPacketV0;

  activeCaseId = CUSTOM_CASE_ID;
  simulation = input && typeof builder === "function"
    ? structuredClone(builder(input))
    : createEmptyInputSimulation();

  if (caseSelect) caseSelect.value = CUSTOM_CASE_ID;
  if (options.resetSeed !== false && seedInput) {
    seedInput.value = simulation.seed || `custom-${Date.now().toString(16).slice(-6)}`;
  }

  currentSignals = structuredClone(simulation.signals);
  initializeSeedInput();
  resetSimulationRng("idle-custom");
  setupScene();
  initializeAgentStates();
  renderBaseAgents();
  renderSignals(currentSignals);
  renderWaitingState();

  if (options.log) {
    appendLog(`自定义输入已准备好：${simulation.label || simulation.idea.name}。`);
  }

  return true;
}

function createEmptyInputSimulation() {
  const fallback = window.SAMPLE_SIMULATION || Object.values(getFrictionCases())[0] || {};

  return {
    id: "custom-empty",
    label: "自己的想法",
    seed: "custom-empty-01",
    idea: {
      name: "自己的想法",
      input: "",
      pitch: "等待输入",
      scene: "等待输入"
    },
    clarityGate: {
      status: "empty",
      label: "先丢一个小产品想法进来",
      summary: "输入一个小产品、AI 工具、内容账号或开源项目想法后，再让小人替你试走。"
    },
    path: {
      start: "等待输入",
      minimumResult: "先丢一个小产品想法进来。",
      validation: "输入后再看它能不能落到第一版可运行交付物。"
    },
    selectedFrictionIds: [],
    frictionBites: [],
    verdict: {},
    signals: { heat: 30, confusion: 20, cloneRisk: 16, techPressure: 24, replacementPressure: 20, branchCount: 0 },
    agents: fallback.agents || []
  };
}

function syncSimulationToCurrentInput() {
  if (!ideaInput || (sandboxStarted && !sandboxCompleted)) return false;

  const input = ideaInput.value.trim();
  if (!input) return switchToCustomInputSimulation({ resetSeed: activeCaseId !== CUSTOM_CASE_ID, log: false });

  const activeMock = getFrictionCases()[activeCaseId];
  const activeMockInput = activeMock?.idea?.input || activeMock?.idea?.pitch || "";
  if (activeMock && input === activeMockInput) return false;

  const currentInput = simulation?.idea?.input || "";
  if (activeCaseId === CUSTOM_CASE_ID && input === currentInput) return false;

  return switchToCustomInputSimulation({ resetSeed: activeCaseId !== CUSTOM_CASE_ID, log: false });
}

function setupScene() {
  setDirectBuildDisplayMode(false);
  ideaName.textContent = simulation.idea.name;
  sceneName.textContent = getVisibleSceneName();
  updateIdeaBoard(getIdeaTitle());
  renderClarityCard();
  renderPathCard(0);
  renderFrictionLibraryCard(0);
  renderBiteCard();
  renderResultCard(false);
  renderStageDialogue();
}

function getVisibleSceneName() {
  return "小人路线板";
}

function getIdeaTitle() {
  const text = ideaInput.value.trim();
  if (!text) return simulation.idea.name;
  const firstSentence = text.split(/[。！？\n]/).find(Boolean) || text;
  return firstSentence.length > 16 ? `${firstSentence.slice(0, 16)}...` : firstSentence;
}

function updateIdeaBoard(title) {
  ideaName.textContent = title;
  const ideaBoardTitle = document.querySelector("#ideaBoard strong");
  if (ideaBoardTitle) ideaBoardTitle.textContent = title;
}

function renderPathCard(biteIndex = 0) {
  if (!pathCard) return;
  const path = simulation.path || {};
  const ideaText = ideaInput?.value.trim() || path.start || simulation.idea.pitch || simulation.idea.name;
  const labels = getVisiblePathLabels();
  const stepLabels = [...pathCard.querySelectorAll(".path-steps small")];

  stepLabels.forEach((node, index) => {
    if (labels[index]) node.textContent = labels[index];
  });

  if (pathStart) pathStart.textContent = compactText(ideaText, 68);
  if (pathMinimum) pathMinimum.textContent = path.minimumResult || "先拆出一个最小可做版本";
  if (pathValidation) pathValidation.textContent = path.validation || "先做一次最小现实验证";

  const steps = [...pathCard.querySelectorAll(".path-steps li")];
  steps.forEach((step, index) => {
    const stepNumber = index + 1;
    step.classList.toggle("is-active", getActivePathStep(biteIndex) === stepNumber);
    step.classList.toggle("is-done", getDonePathStep(biteIndex) >= stepNumber);
  });
}

function getVisiblePathLabels() {
  if (isEmptyInputMode()) return ["A 等待输入", "B 等待判断", "C 等待下一步"];
  if (isBlockedMode() || isBoundaryReviewMode() || isRealityReviewMode() || isScopeReviewMode() || isDefinitionDiagnosisMode()) {
    return getDoorwayReaction().pathLabels;
  }
  return ["A 原始想法", "B 最小可做版本", "C 先试哪一步"];
}

const GENERIC_DOORWAY_ENTRY_QUESTION = "你先告诉我，它是一个内容、一个模型、一个画面演示，还是一个真实设备？";

function getDoorwayQuestion(gate = {}, fallback = GENERIC_DOORWAY_ENTRY_QUESTION) {
  return Array.isArray(gate.nextQuestions) && gate.nextQuestions[0]
    ? gate.nextQuestions[0]
    : fallback;
}

function getDoorwayOptions(gate = {}, fallbackOptions = []) {
  const sourceOptions = Array.isArray(gate.rewriteOptions) && gate.rewriteOptions.length > 0
    ? gate.rewriteOptions
    : fallbackOptions;
  const normalizedOptions = sourceOptions
    .map((option) => ({
      title: option?.title || "先选入口",
      body: option?.body || GENERIC_DOORWAY_ENTRY_QUESTION
    }))
    .filter((option) => option.title && option.body);

  if (normalizedOptions.length > 0) return normalizedOptions;

  return [
    { title: "先问一句", body: GENERIC_DOORWAY_ENTRY_QUESTION }
  ];
}

function getDoorwayText(gate = {}, field, fallback) {
  return gate[field] || fallback;
}

function getDoorwayReaction(gate = simulation?.clarityGate || {}) {
  const status = gate.status || "ready";
  const definitionQuestion = getDoorwayQuestion(gate, getDefinitionQuestionText(gate));

  if (status === "scope_review") {
    const action = getDoorwayQuestion(gate, "先拆一个能低成本试走的小入口。");
    return {
      key: "scope",
      scene: "包太大",
      label: "包太大，要先拆",
      title: "小人先不出发",
      body: getDoorwayText(gate, "summary", "这个愿景太重，小人现在背不动完整版本。先拆一个能试走的小入口。"),
      detail: getDoorwayText(gate, "detail", getDoorwayText(gate, "reason", "它不会硬把完整愿景包装成 MVP。")),
      action,
      pathLabels: ["A 原始想法", "B 包太大", "C 先拆入口"],
      previewRows: [
        ["小人怎么说", getDoorwayText(gate, "reason", "这不是一条普通第一版路线。你给它背的是一个完整愿景。")],
        ["先怎么走", action]
      ],
      options: getDoorwayOptions(gate)
    };
  }

  if (status === "reality_review") {
    const action = getDoorwayQuestion(gate, "先选清楚它是视觉效果、硬件装置，还是科幻概念。");
    return {
      key: "reality",
      scene: "脚下没路",
      label: "脚下没路",
      title: "小人先停住",
      body: getDoorwayText(gate, "summary", "这不是难走，是脚下没有路。它不是普通软件能直接做到的结果。"),
      detail: getDoorwayText(gate, "detail", getDoorwayText(gate, "reason", "如果继续按产品路线试走，小人会变成一本正经地胡说八道。")),
      action,
      pathLabels: ["A 原始想法", "B 脚下没路", "C 先换说法"],
      previewRows: [
        ["小人怎么说", getDoorwayText(gate, "reason", "这不是执行起来难，而是普通软件脚下没有这条路。")],
        ["先怎么改", action]
      ],
      options: getDoorwayOptions(gate)
    };
  }

  if (status === "needs_definition") {
    return {
      key: "definition",
      scene: "先问一句",
      label: "先问一句",
      title: "小人还不知道往哪走",
      body: "你只需要补一个最低限度的对象或场景。",
      detail: "现在小人还没有路口可走，不急着分析。",
      action: definitionQuestion,
      pathLabels: ["A 原始想法", "B 先问一句", "C 补完再走"],
      previewRows: [
        ["小人缺什么", "它还差一个最低限度的对象或场景。"],
        ["直接补一句", definitionQuestion]
      ],
      options: getDoorwayOptions(gate, [])
    };
  }

  if (status === "blocked" || status === "boundary_review") {
    return {
      key: "boundary",
      scene: "边界先停",
      label: "边界先停",
      title: "小人先停一下",
      body: "小人不能把这当普通项目试走。这里有边界风险，需要先停。",
      detail: "先把边界确认清楚，再决定要不要继续。",
      action: "这里先停住，不继续包装成产品路线。",
      pathLabels: ["A 原始想法", "B 边界先停", "C 不硬往下推"],
      previewRows: [
        ["小人怎么说", "这里不能当普通项目直接试走。"],
        ["现在怎么做", "先停住，不把它包装成产品路线。"]
      ]
    };
  }

  if (status === "usable") {
    return {
      key: "run-light",
      scene: "能跑",
      label: "能跑",
      title: "小人可以先替你走一圈",
      body: "能跑，但包有点大，小人会先拆轻一点再走。",
      action: "先投进去，看它会在哪里变形。",
      pathLabels: ["A 原始想法", "B 拆轻一点", "C 先试一步"],
      previewRows: [
        ["小人怎么说", "先不判断好坏，它会替你低成本走一段。"],
        ["它会带回什么", "路线怎么变、哪里太重、现在最小能做哪一步。"]
      ]
    };
  }

  return {
    key: "run",
    scene: "能跑",
    label: "能跑",
    title: "小人可以先替你走一圈",
    body: "这个想法够它先出门走一段。先不判断好坏，看它会被现实怎么压形。",
    action: "先投进去，让小人替你走一圈。",
    pathLabels: ["A 原始想法", "B 先走一圈", "C 带回动作"],
    previewRows: [
      ["小人怎么说", "先不判断好坏，它会替你低成本走一段。"],
      ["它会带回什么", "幸存版本、为什么活下来、现在最小试走动作。"]
    ]
  };
}

function getDisplayFocusMode() {
  if (isEmptyInputMode()) return "idle";
  if (isPreflightStopMode() || isDefinitionDiagnosisMode()) return "doorway";
  return "run";
}

function updateDisplayFocusMode() {
  const mode = getDisplayFocusMode();
  document.body.dataset.focusMode = mode;
  document.body.classList.toggle("focus-doorway", mode === "doorway");
  document.body.classList.toggle("focus-run", mode === "run");
  document.body.classList.toggle("focus-idle", mode === "idle");
  stage?.dataset && (stage.dataset.focusMode = mode);
  updateStageDisplayMode();
  return mode;
}

function getStageDisplayMode() {
  if (sandboxCompleted) return "complete";
  if (sandboxStarted && currentRound > 0) return "run";
  if (isEmptyInputMode()) return "idle";
  return "ready";
}

function updateStageDisplayMode() {
  const mode = getStageDisplayMode();
  document.body.dataset.stageDisplayMode = mode;
  document.body.classList.toggle("stage-mode-idle", mode === "idle");
  document.body.classList.toggle("stage-mode-ready", mode === "ready");
  document.body.classList.toggle("stage-mode-run", mode === "run");
  document.body.classList.toggle("stage-mode-complete", mode === "complete");
  if (stage?.dataset) stage.dataset.displayMode = mode;
  renderRouteBoardState();
  return mode;
}

function setDirectBuildDisplayMode(isActive) {
  document.body.classList.toggle("direct-build-mode", Boolean(isActive));
}

function getRouteBoardActiveStep() {
  if (sandboxCompleted) return LITTLE_WALKER_STEP_LIMIT;
  if (!sandboxStarted || currentRound <= 0) return 0;
  return clamp(currentRound, 1, LITTLE_WALKER_STEP_LIMIT);
}

function renderRouteBoardState(stepNumber = getRouteBoardActiveStep()) {
  if (!routeBoard) return;
  const activeStep = clamp(Number(stepNumber) || 0, 0, LITTLE_WALKER_STEP_LIMIT);
  routeBoard.dataset.activeStep = String(activeStep);
  stage?.setAttribute("data-route-step", String(activeStep));

  routeBoard.querySelectorAll(".route-board-node").forEach((node, index) => {
    const nodeStep = Number(node.dataset.routeStep || index + 1);
    const isActive = activeStep === nodeStep;
    node.classList.toggle("is-active", isActive);
    node.classList.toggle("is-done", activeStep > nodeStep);
    node.classList.toggle("is-inactive", activeStep === 0 || activeStep < nodeStep);
    node.classList.toggle("is-evidence-active", sandboxCompleted && activeCompleteEvidenceStep === nodeStep);
    node.toggleAttribute("tabindex", sandboxCompleted);
    node.setAttribute("role", sandboxCompleted ? "button" : "listitem");
    node.setAttribute("aria-label", sandboxCompleted
      ? `查看第 ${nodeStep} 站路线证据：${routeBoardNodes[nodeStep - 1] || "试走"}`
      : `${routeBoardNodes[nodeStep - 1] || "试走"}`);
    if (isActive) {
      node.setAttribute("aria-current", "step");
    } else {
      node.removeAttribute("aria-current");
    }
  });
}

function setRouteBoardHint(message = "") {
  if (!routeBoardHint) return;
  routeBoardHint.textContent = message;
  routeBoardHint.hidden = !message;
}

function isDeepSeekShadowEnabled() {
  return Boolean(deepSeekShadowToggle?.checked);
}

function isDeepSeekDoorwayEnabled() {
  return true;
}

function isDeepSeekPacketEnabled() {
  return Boolean(deepSeekPacketToggle?.checked);
}

function isDeepSeekPacketStagePreviewEnabled() {
  return Boolean(deepSeekPacketStagePreviewToggle?.checked);
}

function setDeepSeekDoorwayStatus(message, state = "idle", payload = null) {
  if (!deepSeekShadowCard || !deepSeekDoorwayStatus) return;
  deepSeekShadowCard.dataset.doorwayState = state;
  deepSeekDoorwayStatus.textContent = message;
  window.__idearoastDeepSeekDoorwayReview = payload || null;
  renderAiDoorwayJudgeSummary(payload);
}

function renderAiDoorwayJudgeSummary(payload = null) {
  if (!aiDoorwayJudgeSummary) return;
  aiDoorwayJudgeSummary.innerHTML = "";

  if (!payload) {
    aiDoorwayJudgeSummary.hidden = true;
    return;
  }

  const review = payload.review || payload;
  const rows = [
    ["final verdict", payload.finalVerdict || payload.verdict || review.verdict || payload.localVerdict || "-"],
    ["doorway source", formatDoorwaySource(payload.source) || "-"],
    ["local verdict", payload.localVerdict || mapLocalStatusToDoorwayVerdict(payload.localGateStatus) || "-"],
    ["AI verdict", payload.aiVerdict || payload.verdict || review.verdict || "-"],
    ["routeMode", payload.routeMode || review.routeMode || payload.overridePacket?.clarityGate?.routeMode || "-"],
    ["validator", payload.validatorStatus || (payload.ok ? "valid" : "failed")],
    ["riskFlags", formatList(payload.riskFlags || review.riskFlags)],
    ["safetyShrink", payload.safetyShrink || review.safetyShrink || "-"],
    ["firstRunnableArtifact", payload.firstRunnableArtifact || review.firstRunnableArtifact || "-"],
    ["fallback reason", payload.fallbackReason || payload.reason || "-"]
  ];

  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "shadow-summary-row";
    const key = document.createElement("b");
    key.textContent = label;
    const text = document.createElement("span");
    text.textContent = value || "-";
    row.append(key, text);
    aiDoorwayJudgeSummary.append(row);
  });

  aiDoorwayJudgeSummary.hidden = false;
}

function formatDoorwaySource(source) {
  const labels = {
    local_hard_stop: "local hard stop",
    ai_judge_pass: "AI judge pass",
    ai_judge_stop: "AI judge pass",
    ai_judge_fallback_local: "AI judge fallback local",
    ai_judge_invalid: "AI judge invalid",
    ai_judge_failed: "AI judge failed",
    local_route_mode: "local route mode",
    loading: "AI judge pending",
    ready: "model doorway pilot"
  };
  return labels[source] || source || "";
}

function formatList(value) {
  if (Array.isArray(value)) return value.length > 0 ? value.join(" / ") : "-";
  return value || "-";
}

function mapLocalStatusToDoorwayVerdict(status) {
  const map = {
    ready: "can_run",
    usable: "can_run",
    needs_definition: "ask_one_question",
    scope_review: "scope_too_large",
    reality_review: "reality_broken",
    boundary_review: "boundary_stop",
    blocked: "boundary_stop"
  };
  return map[status] || "";
}

function getRouteMode() {
  return simulation?.clarityGate?.routeMode || "";
}

function isDirectBuildMode() {
  return getRouteMode() === "direct_build";
}

function shouldUseDirectBuildMode() {
  return isDirectBuildMode();
}

const NO_PROVIDER_KEY_MESSAGE = "No provider key configured. Using local mock / fallback.";

function getProviderFallbackMessage(reason, fallbackPrefix = "Model adapter fallback") {
  return reason === "missing_api_key"
    ? NO_PROVIDER_KEY_MESSAGE
    : `${fallbackPrefix}：${reason || "unknown_error"}。Using local mock / fallback.`;
}

function setDeepSeekShadowStatus(message, state = "idle", payload = null) {
  if (!deepSeekShadowCard || !deepSeekShadowStatus) return;
  deepSeekShadowCard.dataset.state = state;
  deepSeekShadowStatus.textContent = message;

  if (!deepSeekShadowOutput) return;
  if (payload) {
    deepSeekShadowOutput.hidden = false;
    deepSeekShadowOutput.textContent = JSON.stringify(payload, null, 2);
  } else {
    deepSeekShadowOutput.hidden = true;
    deepSeekShadowOutput.textContent = "";
  }

  if (state === "pass" || state === "fail") {
    deepSeekShadowCard.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function setDeepSeekPacketStatus(message, state = "idle", payload = null) {
  if (!deepSeekShadowCard || !deepSeekPacketStatus) return;
  deepSeekShadowCard.dataset.packetState = state;
  deepSeekPacketStatus.textContent = message;
  window.__idearoastDeepSeekLittleWalkerPacket = payload || null;

  renderDeepSeekPacketSummary(payload);

  const fullPacket = payload?.packet || payload?.rawPacket || null;
  if (deepSeekPacketDetails && deepSeekPacketOutput) {
    if (fullPacket) {
      deepSeekPacketDetails.hidden = false;
      deepSeekPacketOutput.textContent = JSON.stringify(fullPacket, null, 2);
    } else {
      deepSeekPacketDetails.hidden = true;
      deepSeekPacketOutput.textContent = "";
    }
  }

  if (state === "pass" || state === "fail") {
    deepSeekShadowCard.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function setDeepSeekPacketStagePreviewStatus(message, state = "idle", payload = null) {
  if (!deepSeekShadowCard || !deepSeekPacketStagePreviewStatus) return;
  deepSeekShadowCard.dataset.packetPreviewState = state;
  activeStagePreviewMode = payload?.mode || activeStagePreviewMode || "local_mock";
  deepSeekPacketStagePreviewStatus.textContent = message;
  window.__idearoastStagePreviewMode = activeStagePreviewMode;
  window.__idearoastDeepSeekStagePreview = payload || null;
}

function renderDeepSeekPacketSummary(payload) {
  if (!deepSeekPacketSummary) return;
  deepSeekPacketSummary.innerHTML = "";

  if (!payload) {
    deepSeekPacketSummary.hidden = true;
    return;
  }

  const summary = payload.summary || {};
  const readableSummary = summary.readableSummary || {};
  const diagnostics = payload.diagnostics || summary.validatorDiagnostics || [];
  const rows = [
    ["packet validity", getPacketValidityLabel(payload)],
    ["preview source", getDeepSeekPacketModeLabel(payload)],
    ["preview quality", getPreviewQualityLabel(summary.previewQuality)],
    ["default eligibility", getDefaultEligibilityLabel(summary.previewQuality, payload)]
  ];

  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "shadow-summary-row";
    const key = document.createElement("b");
    key.textContent = label;
    const text = document.createElement("span");
    text.textContent = value;
    row.append(key, text);
    deepSeekPacketSummary.append(row);
  });

  if (readableSummary.comebackLine || Array.isArray(readableSummary.stumbleCards) || readableSummary.tonightActionCard) {
    renderReadablePacketSummary(readableSummary);
  } else {
    renderLegacyPacketSummary(summary);
  }

  if (Array.isArray(summary.sceneLines) && summary.sceneLines.length > 0) {
    const details = document.createElement("details");
    details.className = "shadow-scene-details";
    const summaryNode = document.createElement("summary");
    summaryNode.textContent = "查看 5 步试走日志";
    const list = document.createElement("ol");
    summary.sceneLines.slice(0, 5).forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      list.append(item);
    });
    details.append(summaryNode, list);
    deepSeekPacketSummary.append(details);
  }

  if (summary.survivor || summary.whySurvived || summary.nextTinyAction) {
    const details = document.createElement("details");
    details.className = "shadow-scene-details";
    const summaryNode = document.createElement("summary");
    summaryNode.textContent = "查看 packet 结论字段";
    details.append(summaryNode);
    [
      ["survivor", summary.survivor || "-"],
      ["whySurvived", summary.whySurvived || "-"],
      ["nextTinyAction", summary.nextTinyAction || "-"]
    ].forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "shadow-summary-row";
      const key = document.createElement("b");
      key.textContent = label;
      const text = document.createElement("span");
      text.textContent = value;
      row.append(key, text);
      details.append(row);
    });
    deepSeekPacketSummary.append(details);
  }

  if (diagnostics.length > 0) {
    const row = document.createElement("div");
    row.className = "shadow-summary-row";
    const key = document.createElement("b");
    key.textContent = "validator";
    const list = document.createElement("ol");
    diagnostics.slice(0, 6).forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      list.append(item);
    });
    row.append(key, list);
    deepSeekPacketSummary.append(row);
  }

  renderDefaultEligibilityReasons(summary.previewQuality);
  renderPreviewQualityWarnings(summary.previewQuality);

  deepSeekPacketSummary.hidden = false;
}

function getPacketValidityLabel(payload = {}) {
  return payload?.ok && payload?.packet_valid ? "valid" : "invalid";
}

function getDeepSeekPacketModeLabel(payload = {}) {
  if (!payload || !payload.ok || !payload.packet_valid) return "Model adapter failed";
  const labels = {
    raw_pass: "Model adapter raw pass",
    normalized_pass: "Model adapter normalized pass",
    fallback_pass: "Model adapter fallback pass",
    failed: "Model adapter failed"
  };
  return labels[payload.packetMode] || "Model adapter raw pass";
}

function getStagePreviewModeLabel(mode = activeStagePreviewMode) {
  const labels = {
    local_mock: "local mock",
    raw_pass: "Model adapter raw pass",
    normalized_pass: "Model adapter normalized pass",
    fallback_pass: "Model adapter fallback pass",
    failed: "Model adapter failed"
  };
  return labels[mode] || "local mock";
}

function getDefaultEligibilityLabel(previewQuality = {}, payload = {}) {
  if (previewQuality?.status === "warning") return "no, warning present";
  if (!payload?.ok || !payload?.packet_valid) return "no";
  return "no, developer preview only";
}

function getPreviewQualityLabel(previewQuality = {}) {
  if (!previewQuality || previewQuality.status !== "warning") return "clean";
  const labels = Array.isArray(previewQuality.labels) && previewQuality.labels.length > 0
    ? previewQuality.labels.join(" / ")
    : "unknown";
  return `warning: ${labels}`;
}

function renderDefaultEligibilityReasons(previewQuality = {}) {
  const labels = Array.isArray(previewQuality?.labels) ? previewQuality.labels : [];
  if (previewQuality?.status !== "warning" || labels.length === 0) return;

  const row = document.createElement("div");
  row.className = "shadow-summary-row";
  const key = document.createElement("b");
  key.textContent = "default reason";
  const list = document.createElement("ol");
  labels.slice(0, 5).forEach((label) => {
    const item = document.createElement("li");
    item.textContent = `not defaultable: ${label}`;
    list.append(item);
  });
  row.append(key, list);
  deepSeekPacketSummary.append(row);
}

function renderPreviewQualityWarnings(previewQuality = {}) {
  const warnings = Array.isArray(previewQuality?.warnings) ? previewQuality.warnings : [];
  if (warnings.length === 0) return;

  const row = document.createElement("div");
  row.className = "shadow-summary-row";
  const key = document.createElement("b");
  key.textContent = "quality warning";
  const list = document.createElement("ol");
  warnings.slice(0, 5).forEach((warning) => {
    const item = document.createElement("li");
    const evidence = Array.isArray(warning.evidence) && warning.evidence.length > 0
      ? `（${warning.evidence.join(" / ")}）`
      : "";
    item.textContent = `${warning.type || "warning"}：${warning.message || ""}${evidence}`;
    list.append(item);
  });
  row.append(key, list);
  deepSeekPacketSummary.append(row);
}

function renderReadablePacketSummary(readableSummary) {
  if (readableSummary.comebackLine) {
    const comeback = document.createElement("p");
    comeback.className = "shadow-comeback-line";
    comeback.textContent = readableSummary.comebackLine;
    deepSeekPacketSummary.append(comeback);
  }

  const stumbleCards = Array.isArray(readableSummary.stumbleCards) ? readableSummary.stumbleCards.slice(0, 3) : [];
  if (stumbleCards.length > 0) {
    const wrap = document.createElement("div");
    wrap.className = "shadow-stumble-list";
    stumbleCards.forEach((card, index) => {
      const item = document.createElement("article");
      item.className = "shadow-stumble-card";

      const title = document.createElement("strong");
      title.textContent = `第 ${index + 1} 摔：${card.title || "现实打脸"}`;

      item.append(
        title,
        createReadableSummaryLine("你以为", card.youAssumed || "-"),
        createReadableSummaryLine("现实打脸", card.realityBroke || "-"),
        createReadableSummaryLine("所以先改成", card.soShrinkTo || "-")
      );
      wrap.append(item);
    });
    deepSeekPacketSummary.append(wrap);
  }

  if (readableSummary.tonightActionCard) {
    const card = readableSummary.tonightActionCard;
    const action = document.createElement("article");
    action.className = "shadow-action-card";
    const title = document.createElement("strong");
    title.textContent = "今晚动作卡";
    action.append(
      title,
      createReadableSummaryLine("打开", card.open || "-"),
      createReadableSummaryLine("输入", card.input || "-"),
      createReadableSummaryLine("产出", card.output || "-"),
      createReadableSummaryLine("过关标准", card.passCriteria || "-")
    );
    deepSeekPacketSummary.append(action);
  }
}

function renderLegacyPacketSummary(summary) {
  if (Array.isArray(summary.sceneLines) && summary.sceneLines.length > 0) {
    const row = document.createElement("div");
    row.className = "shadow-summary-row";
    const key = document.createElement("b");
    key.textContent = "sceneLine";
    const list = document.createElement("ol");
    summary.sceneLines.slice(0, 5).forEach((line) => {
      const item = document.createElement("li");
      item.textContent = line;
      list.append(item);
    });
    row.append(key, list);
    deepSeekPacketSummary.append(row);
  }
}

function createReadableSummaryLine(label, value) {
  const row = document.createElement("p");
  const key = document.createElement("b");
  key.textContent = `${label}：`;
  const text = document.createElement("span");
  text.textContent = value;
  row.append(key, text);
  return row;
}

function updateDeepSeekDoorwayReadiness() {
  if (!deepSeekDoorwayStatus) return;

  const status = getClarityStatus();
  if (shouldUseDirectBuildMode()) {
    setDeepSeekDoorwayStatus("Doorway source：local route mode。routeMode：direct_build，显示开工卡，不调用模型 adapter。", "pass", getLocalDirectBuildDoorwayPayload());
    return;
  }

  if (isHardLocalDoorwayStopMode()) {
    setDeepSeekDoorwayStatus("默认试运行：本地 hard stop 会先拦，AI Judge 不会反向放行。", "skip", {
      source: "local_hard_stop",
      localGateStatus: status,
      localVerdict: mapLocalStatusToDoorwayVerdict(status),
      validatorStatus: "not_called"
    });
    return;
  }

  setDeepSeekDoorwayStatus("默认试运行：可选模型只参与 doorway，validator 失败或请求失败就回本地 gate。", "ready", {
    source: "ready",
    localGateStatus: status,
    localVerdict: mapLocalStatusToDoorwayVerdict(status),
    validatorStatus: "pending"
  });
}

function getLocalDirectBuildDoorwayPayload() {
  return {
    source: "local_route_mode",
    finalVerdict: "can_run",
    localGateStatus: getClarityStatus(),
    localVerdict: "can_run",
    aiVerdict: "-",
    routeMode: "direct_build",
    validatorStatus: "not_called",
    riskFlags: simulation?.clarityGate?.riskFlags || [],
    safetyShrink: simulation?.clarityGate?.safetyShrink || "",
    firstRunnableArtifact: simulation?.clarityGate?.firstRunnableArtifact || "",
    fallbackReason: ""
  };
}

function updateDeepSeekShadowReadiness() {
  if (!deepSeekShadowCard) return;
  updateDeepSeekDoorwayReadiness();
  updateDeepSeekPacketReadiness();
  updateDeepSeekPacketStagePreviewReadiness();

  if (!isDeepSeekShadowEnabled()) {
    setDeepSeekShadowStatus("关闭。页面仍由本地小人试走驱动。");
    return;
  }

  const status = getClarityStatus();
  if (!["ready", "usable"].includes(status)) {
    setDeepSeekShadowStatus("已开启，但本地门口小人先停住；这个状态不会调用模型适配器。", "skip");
    return;
  }

    setDeepSeekShadowStatus("已开启。下一次丢给小人时，会在后台生成可选模型候选包。", "ready");
}

function updateDeepSeekPacketReadiness() {
  if (!deepSeekPacketStatus) return;

  if (!isDeepSeekPacketEnabled()) {
    setDeepSeekPacketStatus("关闭。Little Walker Packet 仍由本地 mock 校验。");
    return;
  }

  const status = getClarityStatus();
  if (!["ready", "usable"].includes(status)) {
    setDeepSeekPacketStatus("已开启，但本地门口小人先停住；Little Walker packet 不调用。", "skip");
    return;
  }

  setDeepSeekPacketStatus("已开启。下一次丢给小人时，可选模型适配器会生成 Little Walker Packet shadow。", "ready");
}

function updateDeepSeekPacketStagePreviewReadiness() {
  if (!deepSeekPacketStagePreviewStatus) return;

  if (!isDeepSeekPacketStagePreviewEnabled()) {
    activeStagePreviewMode = "local_mock";
    setDeepSeekPacketStagePreviewStatus("Model preview：local mock。", "idle", { mode: "local_mock" });
    return;
  }

  const status = getClarityStatus();
  if (!["ready", "usable"].includes(status)) {
    activeStagePreviewMode = "local_mock";
    setDeepSeekPacketStagePreviewStatus("Model preview 已开启，但本地门口小人先停住；不会调用模型适配器。", "skip", { mode: "local_mock" });
    return;
  }

  setDeepSeekPacketStagePreviewStatus("Model preview 已开启。下一次丢给小人时，valid packet 才会接入 5 步舞台。", "ready", {
    mode: activeStagePreviewMode || "local_mock"
  });
}

async function maybeApplyDeepSeekDoorwayReview() {
  const status = getClarityStatus();
  if (isHardLocalDoorwayStopMode()) {
    setDeepSeekDoorwayStatus("本地 hard stop 已经拦住；AI Judge 不调用，也不能反向放行。", "skip", {
      source: "local_hard_stop",
      localGateStatus: status,
      localVerdict: mapLocalStatusToDoorwayVerdict(status),
      validatorStatus: "not_called"
    });
    return "local_hard_stop";
  }

  const input = ideaInput?.value.trim();
  if (!input) {
    setDeepSeekDoorwayStatus("没有输入，不调用 AI Doorway Judge。", "skip");
    return "local";
  }

  const runId = ++deepSeekDoorwayRunId;
  setDeepSeekDoorwayStatus("可选模型 doorway adapter 正在判断；validator 通过才会使用，失败回本地 gate。", "loading", {
    source: "loading",
    localGateStatus: status,
    localVerdict: mapLocalStatusToDoorwayVerdict(status),
    validatorStatus: "pending"
  });

  try {
    const response = await fetchWithTimeout(getDeepSeekDoorwayEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input })
    }, 10000);
    const payload = await readJsonResponsePayload(response, "doorway_api_not_found");
    if (runId !== deepSeekDoorwayRunId) return "stale";
    window.__idearoastDeepSeekDoorwayReview = payload;

    if (payload.ok && payload.source === "local_hard_stop") {
      setDeepSeekDoorwayStatus("Doorway source：local hard stop。AI Judge 未调用。", "skip", payload);
      return "local_hard_stop";
    }

    if (payload.ok && payload.action === "stop_ai" && payload.overridePacket) {
      simulation = structuredClone(payload.overridePacket);
      currentSignals = structuredClone(simulation.signals);
      initializeAgentStates();
      renderBaseAgents();
      renderSignals(currentSignals);
      renderDoorwayStoppedState({
        logText: payload.review?.oneQuestion || payload.review?.reason || getDoorwayReaction().body,
        buttonText: "已停在门口"
      });
      setDeepSeekDoorwayStatus(`Doorway source：AI judge pass；AI verdict：${payload.verdict}。页面停在门口。`, "veto", payload);
      return "stopped";
    }

    if (payload.ok && payload.action === "allow_ai_run" && payload.overridePacket) {
      simulation = structuredClone(payload.overridePacket);
      currentSignals = structuredClone(simulation.signals);
      playableStepCountSnapshot = getPlayableStepCount(getFrictionBites());
      setDeepSeekDoorwayStatus(
        simulation?.clarityGate?.routeMode === "direct_build"
          ? "Doorway source：AI judge pass。routeMode：direct_build，显示开工卡。"
          : "Doorway source：AI judge pass。routeMode：try_walk，5 步仍由本地 Little Walker mock 驱动。",
        "pass",
        payload
      );
      return "run";
    }

    const reason = payload.fallbackReason || payload.reason || "unknown_doorway_failure";
    setDeepSeekDoorwayStatus(getProviderFallbackMessage(reason, "Doorway source：AI judge fallback local"), "fail", {
      ...payload,
      source: payload.source === "ai_judge_invalid" ? "ai_judge_invalid" : "ai_judge_fallback_local",
      fallbackReason: payload.fallbackReason || reason
    });
    return "fallback";
  } catch (error) {
    if (runId !== deepSeekDoorwayRunId) return "stale";
    setDeepSeekDoorwayStatus(getProviderFallbackMessage(error.message, "Doorway source：AI judge failed"), "fail", {
      source: "ai_judge_failed",
      localGateStatus: status,
      localVerdict: mapLocalStatusToDoorwayVerdict(status),
      validatorStatus: "not_run",
      fallbackReason: error.message
    });
    console.warn("IdeaRoast AI doorway request failed", error);
    return "fallback";
  }
}

function maybeRunDeepSeekShadow() {
  if (!isDeepSeekShadowEnabled()) {
    setDeepSeekShadowStatus("关闭。页面仍由本地小人试走驱动。");
    return;
  }

  const status = getClarityStatus();
  if (!["ready", "usable"].includes(status)) {
    setDeepSeekShadowStatus("本地门口小人先停住；模型 shadow 不调用。", "skip");
    return;
  }

  const input = ideaInput?.value.trim();
  if (!input) {
    setDeepSeekShadowStatus("没有输入，不调用模型 shadow。", "skip");
    return;
  }

  const runId = ++deepSeekShadowRunId;
  setDeepSeekShadowStatus("可选模型 shadow 正在后台试跑候选包；主页面仍使用本地 mock。", "loading");

  fetch(getDeepSeekShadowEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input })
  })
    .then(async (response) => {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return {
          ok: false,
          reason: response.status === 404 ? "shadow_api_not_found" : "response_not_json",
          status: response.status,
          raw: text.slice(0, 1200)
        };
      }
    })
    .then((payload) => {
      if (runId !== deepSeekShadowRunId) return;
      window.__idearoastDeepSeekShadow = payload;

      if (payload.ok && payload.candidate) {
        setDeepSeekShadowStatus("Shadow pass：候选包已生成，只用于开发者对比，不接管页面。", "pass", payload.candidate);
        console.info("IdeaRoast DeepSeek shadow candidate", payload);
        return;
      }

      const reason = payload.reason || "unknown_shadow_failure";
      setDeepSeekShadowStatus(getProviderFallbackMessage(reason, "Shadow fail"), "fail", payload);
      console.warn("IdeaRoast DeepSeek shadow fallback", payload);
    })
    .catch((error) => {
      if (runId !== deepSeekShadowRunId) return;
      setDeepSeekShadowStatus(getProviderFallbackMessage(error.message, "Shadow fail"), "fail");
      console.warn("IdeaRoast DeepSeek shadow request failed", error);
  });
}

async function maybeRunDeepSeekLittleWalkerPacket(options = {}) {
  const useForStagePreview = Boolean(options.stagePreview);
  const shouldCallPacket = isDeepSeekPacketEnabled() || useForStagePreview;

  if (!shouldCallPacket) {
    setDeepSeekPacketStatus("关闭。Little Walker Packet 仍由本地 mock 校验。");
    if (useForStagePreview) {
      setDeepSeekPacketStagePreviewStatus("Model preview：local mock。", "idle", { mode: "local_mock" });
    }
    return false;
  }

  const status = getClarityStatus();
  if (!["ready", "usable"].includes(status)) {
    setDeepSeekPacketStatus("本地门口小人先停住；Little Walker packet 不调用。", "skip");
    if (useForStagePreview) {
      setDeepSeekPacketStagePreviewStatus("Model preview：local mock。本地 gate 已停住，未调用模型适配器。", "skip", { mode: "local_mock" });
    }
    return false;
  }

  const input = ideaInput?.value.trim();
  if (!input) {
    setDeepSeekPacketStatus("没有输入，不调用 Little Walker packet。", "skip");
    if (useForStagePreview) {
      setDeepSeekPacketStagePreviewStatus("Model preview：local mock。没有输入，未调用模型适配器。", "skip", { mode: "local_mock" });
    }
    return false;
  }

  const runId = ++deepSeekPacketRunId;
  setDeepSeekPacketStatus(
    useForStagePreview
      ? "可选模型适配器正在生成 Little Walker Packet；valid 后才会接入舞台预览。"
      : "可选模型适配器正在生成 Little Walker Packet；主页面仍使用本地 mock。",
    "loading"
  );
  if (useForStagePreview) {
    setDeepSeekPacketStagePreviewStatus("Model preview：等待模型 packet。", "loading", { mode: "local_mock" });
  }

  try {
    const response = await fetch(getDeepSeekLittleWalkerPacketEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input })
    });
    const payload = await readJsonResponsePayload(response, "little_walker_packet_api_not_found");
    if (runId !== deepSeekPacketRunId) return false;
    window.__idearoastDeepSeekLittleWalkerPacket = payload;

    if (payload.ok && payload.packet_valid && payload.packet) {
      const mode = payload.packetMode || "raw_pass";
      const modeLabel = getStagePreviewModeLabel(mode);
      setDeepSeekPacketStatus(`Little Walker packet pass：${modeLabel}。${useForStagePreview ? "已接入开发者舞台预览。" : "只作为 shadow candidate。"}`, "pass", payload);
      console.info("IdeaRoast DeepSeek Little Walker packet", payload);

      if (useForStagePreview) {
        const previewSimulation = createSimulationFromLittleWalkerPacket(payload.packet, simulation, payload);
        if (previewSimulation) {
          simulation = previewSimulation;
          currentSignals = structuredClone(simulation.signals);
          activeStagePreviewMode = mode;
          window.__idearoastStagePreviewSimulation = simulation;
        setDeepSeekPacketStagePreviewStatus(`Model preview：${modeLabel}，正在驱动这轮 5 步舞台。`, "pass", { mode, payload });
          return true;
        }

        setDeepSeekPacketStagePreviewStatus("Model preview：adapter failed。packet 无法映射，回退 local mock。", "fail", { mode: "failed", payload });
        return false;
      }

      return false;
    }

    const reason = payload.reason || "unknown_packet_failure";
    setDeepSeekPacketStatus(getProviderFallbackMessage(reason, "Little Walker packet fail"), "fail", payload);
    if (useForStagePreview) {
      activeStagePreviewMode = "failed";
      setDeepSeekPacketStagePreviewStatus(getProviderFallbackMessage(reason, "Model preview：adapter failed"), "fail", { mode: "failed", payload });
    }
    console.warn("IdeaRoast Little Walker packet fallback", payload);
    return false;
  } catch (error) {
    if (runId !== deepSeekPacketRunId) return false;
    setDeepSeekPacketStatus(getProviderFallbackMessage(error.message, "Little Walker packet fail"), "fail");
    if (useForStagePreview) {
      activeStagePreviewMode = "failed";
      setDeepSeekPacketStagePreviewStatus(getProviderFallbackMessage(error.message, "Model preview：adapter failed"), "fail", { mode: "failed" });
    }
    console.warn("IdeaRoast Little Walker packet request failed", error);
    return false;
  }
}

function createSimulationFromLittleWalkerPacket(packet, baseSimulation = {}, payload = {}) {
  const steps = Array.isArray(packet?.walk?.steps) ? packet.walk.steps.slice(0, 5) : [];
  if (packet?.doorway?.status !== "can_run" || steps.length !== 5) return null;

  const baseAgents = Array.isArray(baseSimulation.agents) && baseSimulation.agents.length > 0
    ? structuredClone(baseSimulation.agents)
    : structuredClone(window.SAMPLE_SIMULATION?.agents || []);
  const sourceFrictionIds = Array.isArray(baseSimulation.selectedFrictionIds) && baseSimulation.selectedFrictionIds.length >= 5
    ? baseSimulation.selectedFrictionIds
    : ["expression_first_step", "execution_dependency", "cost_maintenance", "evidence_replacement", "retention_cooling"];

  const frictionBites = steps.map((step, index) => mapLittleWalkerStepToBite(step, index, sourceFrictionIds[index]));
  const result = packet.result || {};
  const survivor = result.survivor || steps[4]?.routeChange?.to || steps[4]?.nextCarry || packet.originalInput;
  const nextTinyAction = result.nextTinyAction || survivor;

  return {
    ...structuredClone(baseSimulation),
    id: `${baseSimulation.id || "custom"}-deepseek-preview`,
    label: `${baseSimulation.label || "自己的想法"} · model adapter preview`,
    idea: {
      ...(baseSimulation.idea || {}),
      name: baseSimulation.idea?.name || "Model adapter Little Walker preview",
      input: packet.originalInput || baseSimulation.idea?.input || ideaInput?.value.trim() || "",
      pitch: packet.originalInput || baseSimulation.idea?.pitch || "",
      scene: "Model adapter Little Walker preview"
    },
    clarityGate: {
      ...(baseSimulation.clarityGate || {}),
      status: "ready",
      label: "Model packet stage preview",
      summary: "开发者预览：本轮 5 步由通过 validator 的可选模型 Little Walker Packet 驱动。"
    },
    path: {
      ...(baseSimulation.path || {}),
      start: packet.originalInput || baseSimulation.path?.start || "",
      minimumResult: survivor,
      validation: nextTinyAction
    },
    selectedFrictionIds: frictionBites.map((bite) => bite.frictionId),
    frictionBites,
    verdict: {
      ...(baseSimulation.verdict || {}),
      strongestBranch: survivor,
      survivalReason: result.whySurvived || "它把完整路线压成了可以今晚试走的版本。",
      smallestValidation: nextTinyAction,
      biggestBlocker: normalizeRouteRecordText(result.droppedHeavyRoute?.[0]) || steps[0]?.realityHit || "原路线太重，第一步容易看不清。",
      abandonedRoutes: normalizeRouteRecords(result.droppedHeavyRoute, "reason", "完整重路线"),
      branchOptions: normalizeRouteRecords(result.sideBranch, "whyAlive", "旁边轻分叉"),
      notNow: "先别把它做成完整产品、完整后台或自动化系统；只看今晚这张卡 / 这条草稿 / 这个固定 demo 能不能过。"
    },
    signals: structuredClone(baseSimulation.signals || { heat: 38, confusion: 24, cloneRisk: 22, techPressure: 48, replacementPressure: 38, branchCount: 0 }),
    agents: baseAgents,
    runtimePreview: {
      provider: "deepseek",
      packetMode: payload.packetMode || "raw_pass",
      normalizationChanges: payload.normalizationChanges || [],
      fallbackChanges: payload.fallbackChanges || []
    }
  };
}

function mapLittleWalkerStepToBite(step, index, fallbackFrictionId) {
  const stepNumber = index + 1;
  const frictionId = fallbackFrictionId || `deepseek_packet_step_${stepNumber}`;
  const definition = getFrictionDefinition(frictionId);
  const defaults = definition?.defaultState || {};
  const routeChange = step.routeChange || {};
  const burden = normalizeLittleWalkerBurden(step.burden);
  const decision = ["continue", "mutate", "branch", "stop"].includes(step.decision) ? step.decision : "mutate";

  return {
    id: `deepseek_packet_step_${stepNumber}`,
    frictionId,
    stepNumber,
    stepTitle: `第 ${stepNumber} 步：${inferDeepSeekStepTitle(step, stepNumber)}`,
    frictionType: step.frictionType || definition?.label || "模型试走事件",
    currentSurvivingRoute: step.currentSurvivingRoute || routeChange.from || "当前路线",
    agentAttempt: step.tinyAction || "小人试了一小步。",
    realityFeedback: step.realityHit || routeChange.why || "现实反馈还不清楚。",
    burden,
    routeChange: {
      from: routeChange.from || step.currentSurvivingRoute || "当前路线",
      to: routeChange.to || step.nextCarry || "更小的路线",
      summary: routeChange.why || "路线被现实反馈压小。",
      why: routeChange.why || "路线被现实反馈压小。"
    },
    verdict: decision,
    nextMove: step.nextCarry || routeChange.to || "带着这个版本继续走。",
    lens: definition?.role || "模型试走者",
    agentId: pickDeepSeekPreviewAgentId(step, index, defaults.agentId),
    action: pickDeepSeekPreviewAction(step, defaults.action),
    emotion: pickDeepSeekPreviewEmotion(step, defaults.emotion),
    event: `deepseek_packet_${decision}`,
    evidenceStatus: "opinion",
    evidenceNote: "Optional model adapter live preview，不作为事实查证。",
    bubble: compactText(step.realityHit || step.sceneLine || "现实先打了一下。", 46),
    plainTake: step.sceneLine || step.realityHit || "小人试走了一步。",
    friction: step.realityHit || "现实反馈还不清楚。",
    mutation: routeChange.why || "路线继续压小。",
    branch: routeChange.to || step.nextCarry || "更小的路线",
    signalDelta: getDeepSeekPreviewSignalDelta(step, burden, decision)
  };
}

function inferDeepSeekStepTitle(step, stepNumber) {
  const text = `${step.sceneLine || ""}\n${step.realityHit || ""}`;
  if (/正确废话|不知道今晚|打开哪个工具/.test(text)) return "第一步说不清";
  if (/凭什么|不信|信任/.test(text)) return "信任先卡住";
  if (/划走|钩子|开头|观众/.test(text)) return "开头留不住";
  if (/自动化太早|权限|API|后端|脚本/.test(text)) return "自动化太早";
  if (/成本|维护|剪辑|字幕|录屏/.test(text)) return "成本先压上来";
  if (/数据|爬虫|抓取|合规/.test(text)) return "数据路线太重";
  return ["假设出门", "现实打脸", "路线缩小", "旁路出现", "幸存版本"][stepNumber - 1] || "继续试走";
}

function pickDeepSeekPreviewAgentId(step, index, fallbackAgentId) {
  if (fallbackAgentId) return fallbackAgentId;
  const text = `${step.sceneLine || ""}\n${step.realityHit || ""}`;
  if (/数据|查|竞品|替代/.test(text)) return "searcher";
  if (/成本|维护|剪辑|字幕|录屏|自动化/.test(text)) return "budget";
  if (/观众|开头|标题|视频|创作者/.test(text)) return index % 2 === 0 ? "linran" : "xiaochen";
  if (/凭什么|不信|正确废话/.test(text)) return "laozhou";
  return ["linran", "ajie", "budget", "searcher", "pm"][index] || "pm";
}

function pickDeepSeekPreviewAction(step, fallbackAction) {
  if (fallbackAction && actionConfig[fallbackAction]) return fallbackAction;
  const text = `${step.sceneLine || ""}\n${step.realityHit || ""}`;
  if (/查|数据|替代|竞品/.test(text)) return "check_competitor";
  if (/分叉|旁路|缩成|改成/.test(text)) return "suggest_branch";
  if (/凭什么|不信|正确废话/.test(text)) return "argue";
  if (/划走|看不懂|不知道/.test(text)) return "misread_idea";
  return "think";
}

function pickDeepSeekPreviewEmotion(step, fallbackEmotion) {
  if (fallbackEmotion && emotionConfig[fallbackEmotion]) return fallbackEmotion;
  const text = `${step.sceneLine || ""}\n${step.realityHit || ""}`;
  if (/凭什么|不信/.test(text)) return "skeptical";
  if (/划走|看不懂|不知道|正确废话/.test(text)) return "confused";
  if (/成本|维护|权限|数据/.test(text)) return "anxious";
  return "skeptical";
}

function normalizeLittleWalkerBurden(burden = {}) {
  return {
    time: burden.time || "中",
    money: burden.money || "低",
    mental: burden.mental || "中",
    trust: burden.trust || "低",
    skill: burden.skill || "中",
    people: burden.people || burden.human || "低"
  };
}

function getDeepSeekPreviewSignalDelta(step, burden = {}, decision = "mutate") {
  const delta = { confusion: 4, techPressure: 3 };
  if (decision === "branch" || decision === "stop") delta.branchCount = 1;
  if (burden.trust === "高" || /凭什么|不信/.test(step.realityHit || "")) delta.replacementPressure = 6;
  if (burden.time === "高" || burden.skill === "高" || /自动化|API|脚本|后端/.test(step.sceneLine || "")) delta.techPressure = 8;
  if (/划走|没人看|开头/.test(step.realityHit || "")) delta.heat = -5;
  return delta;
}

function normalizeRouteRecords(value, bodyKey, fallbackTitle) {
  const source = Array.isArray(value) && value.length > 0 ? value : [`${fallbackTitle}：先放下完整版本。`];
  return source.slice(0, 3).map((item, index) => {
    if (item && typeof item === "object") {
      return {
        title: item.title || `${fallbackTitle} ${index + 1}`,
        [bodyKey]: item[bodyKey] || item.reason || item.whyAlive || ""
      };
    }

    const text = normalizeRouteRecordText(item);
    const [title, ...rest] = text.split(/[：:]/);
    return {
      title: rest.length > 0 ? title : `${fallbackTitle} ${index + 1}`,
      [bodyKey]: rest.length > 0 ? rest.join("：") : text
    };
  });
}

function normalizeRouteRecordText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

async function readJsonResponsePayload(response, notFoundReason = "api_not_found") {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      ok: false,
      reason: response.status === 404 ? notFoundReason : "response_not_json",
      status: response.status,
      raw: text.slice(0, 1200)
    };
  }
}

function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {
    ...options,
    signal: controller.signal
  }).finally(() => {
    window.clearTimeout(timeout);
  });
}

function getDeepSeekDoorwayEndpoint() {
  return getLocalApiEndpoint("/api/ai-doorway-judge");
}

function getDeepSeekShadowEndpoint() {
  return getLocalApiEndpoint("/api/deepseek-shadow");
}

function getDeepSeekLittleWalkerPacketEndpoint() {
  return getLocalApiEndpoint("/api/deepseek-little-walker-packet");
}

function getLocalApiEndpoint(path) {
  if (window.location.protocol === "http:" && ["127.0.0.1", "localhost", "::1"].includes(window.location.hostname)) {
    return path;
  }

  return `http://127.0.0.1:4174${path}`;
}

function hasSoloProtagonist() {
  return Boolean(simulation?.agents?.some((agent) => agent.id === SOLO_PROTAGONIST_ID));
}

function isSoloWalkerStageMode(mode = getDisplayFocusMode()) {
  return mode === "run" && hasSoloProtagonist();
}

function getSoloWalkerRouteTarget(stepNumber = 0) {
  const index = clamp(Math.round(stepNumber || 0), 0, soloWalkerRouteTargets.length - 1);
  return soloWalkerRouteTargets[index];
}

function getSoloWalkerProjectedPoint(stepNumber = 0) {
  const target = getSoloWalkerRouteTarget(stepNumber);
  return target;
}

function setSoloWalkerStagePoint(stepNumber = 0) {
  if (!stage) return null;
  const point = getSoloWalkerProjectedPoint(stepNumber);
  stage.style.setProperty("--solo-alert-x", `${clamp(point.x + 7, 22, 78)}%`);
  stage.style.setProperty("--solo-alert-y", `${clamp(point.y - 13, 18, 74)}%`);
  stage.style.setProperty("--solo-earth-offset", `${Math.max(0, stepNumber) * -9}px`);
  stage.dataset.walkStep = String(stepNumber);
  return point;
}

function placeSoloWalkerAtRouteStep(stepNumber = 0) {
  const node = agentNodes.get(SOLO_PROTAGONIST_ID);
  if (!node) return;

  const point = setSoloWalkerStagePoint(stepNumber);
  if (!point) return;

  node.style.left = `${point.x}%`;
  node.style.top = `${point.y}%`;
  node.dataset.targetX = point.x;
  node.dataset.targetY = point.y;
  setAgentDepth(node, point.y);
}

function resetSoloWalkerStage() {
  if (!stage) return;
  rpgStoryboardActive = false;
  rpgStoryboardFrameIndex = 0;
  rpgStoryboardStepNumber = 0;
  delete stage.dataset.soloWalker;
  delete stage.dataset.rpgStoryboard;
  delete stage.dataset.walkStep;
  delete stage.dataset.routeStep;
  stage.style.removeProperty("--solo-alert-x");
  stage.style.removeProperty("--solo-alert-y");
  stage.style.removeProperty("--solo-earth-offset");
  soloAlert?.classList.remove("is-visible");
  agentNodes.forEach((node) => {
    node.classList.remove("is-solo-protagonist", "is-stopped-by-friction");
  });
}

function shouldUseRpgStoryboardForStep(stepNumber = currentRound) {
  return false;
}

function startRpgStoryboardStep(stepNumber = currentRound) {
  if (!shouldUseRpgStoryboardForStep(stepNumber)) {
    clearRpgStoryboardStep();
    return false;
  }

  rpgStoryboardActive = true;
  rpgStoryboardFrameIndex = 0;
  rpgStoryboardStepNumber = stepNumber;
  stage?.setAttribute("data-rpg-storyboard", "active");
  stage?.style.setProperty("--solo-earth-offset", "0px");
  placeRpgStoryboardProtagonist();
  return true;
}

function clearRpgStoryboardStep() {
  rpgStoryboardActive = false;
  rpgStoryboardFrameIndex = 0;
  rpgStoryboardStepNumber = 0;
  if (stage) delete stage.dataset.rpgStoryboard;
}

function isRpgStoryboardStepActive() {
  return rpgStoryboardActive && shouldUseRpgStoryboardForStep(currentRound);
}

function getRpgStoryboardTarget() {
  return { x: 50, y: 72 };
}

function placeRpgStoryboardProtagonist() {
  const node = agentNodes.get(SOLO_PROTAGONIST_ID);
  if (!node) return;

  const target = getSoloWalkerRouteTarget(LITTLE_WALKER_STEP_LIMIT);
  node.style.left = `${target.x}%`;
  node.style.top = `${target.y}%`;
  node.dataset.targetX = target.x;
  node.dataset.targetY = target.y;
  setAgentDepth(node, target.y);
}

function holdAgentForRpgStoryboard(node, state) {
  const target = getSoloWalkerRouteTarget(LITTLE_WALKER_STEP_LIMIT);
  window.clearTimeout(node.walkTimer);
  stopSpriteFrameLoop(node);
  node.classList.remove("is-walking");
  node.classList.add("is-solo-protagonist", "is-stopped-by-friction");
  node.dataset.restPose = "special";
  node.style.left = `${target.x}%`;
  node.style.top = `${target.y}%`;
  node.dataset.targetX = target.x;
  node.dataset.targetY = target.y;
  node.dataset.state = state.action || "rpg_storyboard";
  setAgentDepth(node, target.y);
  updateSpritePose(node, "think", { force: true });
  return 0;
}

function prepareSoloWalkerStage() {
  if (!isSoloWalkerStageMode("run")) {
    resetSoloWalkerStage();
    return;
  }

  stage.dataset.soloWalker = "active";
  renderRouteBoardState(0);
  setRouteBoardHint("");
  soloAlert?.classList.remove("is-visible");

  const node = agentNodes.get(SOLO_PROTAGONIST_ID);
  if (node) {
    node.classList.add("is-solo-protagonist");
    setAgentBadges(node, {
      agentId: SOLO_PROTAGONIST_ID,
      background: "替用户试走的小人",
      tempRole: "小人",
      emotion: "curious",
      action: "think",
      event: "solo_walk_start",
      bubble: "我先替你走一格。",
      signalDelta: {}
    });
    placeSoloWalkerAtRouteStep(0);
  }
}

function updateSoloWalkerStage(bite = null, stepNumber = currentRound, sourceUpdate = null) {
  if (!isSoloWalkerStageMode("run")) {
    resetSoloWalkerStage();
    return;
  }

  stage.dataset.soloWalker = "active";
  setSoloWalkerStagePoint(stepNumber);
  renderRouteBoardState(stepNumber);
  setRouteBoardHint("");

  const protagonist = agentNodes.get(SOLO_PROTAGONIST_ID);
  protagonist?.classList.add("is-solo-protagonist");
  protagonist?.classList.toggle("is-stopped-by-friction", Boolean(bite));
  soloAlert?.classList.remove("is-visible");
}

function completeSoloWalkerStage() {
  if (!isSoloWalkerStageMode("run")) return;
  stage.dataset.soloWalker = "complete";
  setSoloWalkerStagePoint(soloWalkerRouteTargets.length - 1);
  renderRouteBoardState(LITTLE_WALKER_STEP_LIMIT);
  setRouteBoardHint("");
  soloAlert?.classList.remove("is-visible");
  const node = agentNodes.get(SOLO_PROTAGONIST_ID);
  if (!node) return;

  const target = getSoloWalkerRouteTarget(LITTLE_WALKER_STEP_LIMIT);
  window.clearTimeout(node.walkTimer);
  stopSpriteFrameLoop(node);
  node.classList.add("is-solo-protagonist");
  node.classList.remove("is-walking", "is-stopped-by-friction");
  node.dataset.restPose = "special";
  node.style.left = `${target.x}%`;
  node.style.top = `${target.y}%`;
  node.dataset.targetX = target.x;
  node.dataset.targetY = target.y;
  node.dataset.state = "finished";
  setAgentDepth(node, target.y);
  updateSpritePose(node, "think", { force: true });
}

function pickSoloWalkerEmotion(step, sourceUpdate) {
  if (/成本|维护|权限|数据|拖大/.test(`${step?.realityFeedback || ""}${step?.sceneLine || ""}`)) return "anxious";
  if (/看不懂|听不懂|误解|不知道|歪/.test(`${step?.realityFeedback || ""}${step?.sceneLine || ""}`)) return "confused";
  return sourceUpdate?.emotion && emotionConfig[sourceUpdate.emotion] ? sourceUpdate.emotion : "skeptical";
}

function createSoloWalkerStageUpdate(bite, sourceUpdate, stepNumber) {
  if (!isSoloWalkerStageMode("run")) return sourceUpdate;
  const step = getSubstituteStepView(bite, stepNumber);
  return {
    ...sourceUpdate,
    agentId: SOLO_PROTAGONIST_ID,
    background: "替用户试走的小人",
    tempRole: "小人",
    emotion: pickSoloWalkerEmotion(step, sourceUpdate),
    action: "think",
    event: sourceUpdate?.event || bite?.id || "solo_friction_stop",
    bubble: buildSoloWalkerBubbleText(step, sourceUpdate?.bubble),
    target: getSoloWalkerRouteTarget(stepNumber),
    signalDelta: sourceUpdate?.signalDelta || {}
  };
}

function buildSoloWalkerBubbleText(step, fallback = "") {
  const hit = getShortBubbleClause(step.realityFeedback || fallback || step.frictionType, "这里卡住了");
  const shrink = getShortShrinkClause(step.routeChange?.to || step.nextMove || "");
  return shrink ? `卡住：${hit}。想到：${shrink}。` : `卡住：${hit}。`;
}

function getShortBubbleClause(text, fallback = "") {
  const value = stripEndPunctuation(text || fallback);
  if (/依赖|权限|数据|流程|拖大/.test(value)) return "关键依赖会把项目拖大";
  if (/入口|听懂|表达|第一步|不知道/.test(value)) return "入口还太大";
  if (/成本|维护|消耗/.test(value)) return "维护成本会吃掉第一版";
  if (/替代|竞品|已有/.test(value)) return "用户已有替代做法";
  if (/新鲜感|留下来/.test(value)) return "新鲜感之后不一定留下";
  return value.split(/[，,；;]/u)[0] || fallback;
}

function getShortShrinkClause(text) {
  const value = stripEndPunctuation(text);
  if (!value) return "";
  if (/验证动作卡/.test(value)) return "先产出一张验证动作卡";
  if (/手动|完整自动化|自动化/.test(value)) return "先手动验证，不做完整系统";
  if (/视频|短视频|草稿/.test(value)) return "先做一条短视频草稿";
  if (/判断表|表/.test(value)) return "先做一张判断表";
  return value.split(/[，,；;]/u)[0] || value;
}

function buildSoloWalkerGameLine(step) {
  const route = stripEndPunctuation(step.currentSurvivingRoute || step.routeChange?.from || "这条路线");
  const feedback = stripEndPunctuation(step.realityFeedback || step.frictionType || "现实在这里卡住了");
  return `小人带着「${route}」往前走，停在这里：${feedback}。`;
}

function buildSoloWalkerRouteShiftLine(step) {
  const nextRoute = stripEndPunctuation(step.routeChange?.to || step.nextMove || "更小的幸存版本");
  return `小人把路线收成：${nextRoute}。`;
}

function getActiveSpeakerId(mode, bite) {
  if (mode === "idle") return "";
  if (mode === "run" && hasSoloProtagonist()) return SOLO_PROTAGONIST_ID;

  const status = simulation?.clarityGate?.status || "ready";
  const fallbackByStatus = {
    needs_definition: "pm",
    reality_review: "searcher",
    scope_review: "ajie",
    boundary_review: "laozhou",
    blocked: "laozhou",
    usable: "ajie",
    ready: "ajie"
  };
  const preferredId = fallbackByStatus[status] || "ajie";
  return simulation?.agents?.some((agent) => agent.id === preferredId)
    ? preferredId
    : simulation?.agents?.[0]?.id || "";
}

function updateActiveSpeaker(agentId, options = {}) {
  activeSpeakerAgentId = agentId || "";
  if (!stage) return;

  stage.dataset.activeSpeaker = activeSpeakerAgentId;
  agentNodes.forEach((node, id) => {
    const isActive = Boolean(activeSpeakerAgentId) && id === activeSpeakerAgentId;
    node.classList.toggle("is-active-speaker", isActive);
    node.classList.toggle("is-muted-speaker", Boolean(activeSpeakerAgentId) && !isActive);
  });

  if (options.position !== false) {
    positionStageDialogueForSpeaker(activeSpeakerAgentId);
  }
}

function positionStageDialogueForSpeaker(agentId) {
  if (!stageDialogue) return;
  const speaker = agentId ? agentNodes.get(agentId) : null;

  stageDialogue.classList.remove("speaker-left", "speaker-right", "speaker-none");
  if (!speaker) {
    stageDialogue.classList.add("speaker-none");
    stageDialogue.style.removeProperty("--dialogue-left");
    stageDialogue.style.removeProperty("--dialogue-top");
    return;
  }

  const speakerX = parseFloat(speaker.style.left);
  const speakerY = parseFloat(speaker.style.top);
  if (!Number.isFinite(speakerX) || !Number.isFinite(speakerY)) return;

  const stageRect = stage.getBoundingClientRect();
  const speakerRect = speaker.getBoundingClientRect();
  const dialogueRect = stageDialogue.getBoundingClientRect();
  const width = dialogueRect.width || 360;
  const height = dialogueRect.height || 220;
  const gap = 24;
  const margin = 16;
  const speakerCenterX = speakerRect.left - stageRect.left + speakerRect.width / 2;
  const speakerCenterY = speakerRect.top - stageRect.top + speakerRect.height / 2;
  const speakerOnLeft = speakerCenterX < stageRect.width / 2;

  const clampCandidate = (candidate) => ({
    left: clamp(candidate.left, margin, Math.max(margin, stageRect.width - width - margin)),
    top: clamp(candidate.top, margin, Math.max(margin, stageRect.height - height - margin))
  });
  const overlapArea = (candidate) => {
    const left = stageRect.left + candidate.left;
    const top = stageRect.top + candidate.top;
    const right = left + width;
    const bottom = top + height;
    const overlapWidth = Math.max(0, Math.min(right, speakerRect.right) - Math.max(left, speakerRect.left));
    const overlapHeight = Math.max(0, Math.min(bottom, speakerRect.bottom) - Math.max(top, speakerRect.top));
    return overlapWidth * overlapHeight;
  };

  const sideCandidate = speakerOnLeft
    ? { left: speakerRect.right - stageRect.left + gap, top: speakerRect.top - stageRect.top - height * 0.62 }
    : { left: speakerRect.left - stageRect.left - width - gap, top: speakerRect.top - stageRect.top - height * 0.62 };
  const aboveCandidate = {
    left: speakerCenterX - width / 2,
    top: speakerRect.top - stageRect.top - height - gap
  };
  const farCandidate = speakerOnLeft
    ? { left: stageRect.width - width - margin, top: speakerRect.top - stageRect.top - height * 0.76 }
    : { left: margin, top: speakerRect.top - stageRect.top - height * 0.76 };

  const best = [sideCandidate, aboveCandidate, farCandidate]
    .map(clampCandidate)
    .sort((a, b) => overlapArea(a) - overlapArea(b))[0];
  const dialogueCenterX = best.left + width / 2;
  const dialogueCenterY = best.top + height / 2;

  stageDialogue.style.setProperty("--dialogue-left", `${(dialogueCenterX / stageRect.width) * 100}%`);
  stageDialogue.style.setProperty("--dialogue-top", `${(dialogueCenterY / stageRect.height) * 100}%`);
  stageDialogue.classList.add(dialogueCenterX >= speakerCenterX ? "speaker-left" : "speaker-right");
}

function getStageDoorwayOptions(reaction) {
  return Array.isArray(reaction.options) ? reaction.options.slice(0, 3) : [];
}

function renderStageDialogue(bite = null, biteIndex = currentRound) {
  if (!stageDialogue) return;

  const mode = updateDisplayFocusMode();
  const displayMode = getStageDisplayMode();
  stageDialogue.innerHTML = "";
  stageDialogue.hidden = false;
  stageDialogue.className = `stage-dialogue is-${mode} display-${displayMode}`;

  if (displayMode === "idle") {
    resetSoloWalkerStage();
    updateActiveSpeaker(SOLO_PROTAGONIST_ID, { position: false });
    hideStageDialoguePanel();
    renderIdleProtagonistBubble();
    renderRouteBoardState(0);
    return;
  }

  if (displayMode === "ready") {
    resetSoloWalkerStage();
    updateActiveSpeaker(SOLO_PROTAGONIST_ID, { position: false });
    hideStageDialoguePanel();
    renderReadyProtagonistBubble();
    renderRouteBoardState(0);
    return;
  }

  const speakerId = getActiveSpeakerId(mode, bite);
  updateActiveSpeaker(speakerId, { position: false });

  if (mode === "doorway") {
    const reaction = getDoorwayReaction();
    appendStageDialogueContent({
      label: reaction.label,
      title: reaction.title,
      body: reaction.body,
      options: getStageDoorwayOptions(reaction)
    });
    positionStageDialogueForSpeaker(speakerId);
    return;
  }

  const bites = getFrictionBites();
  const playableStepCount = getPlayableStepCount(bites);
  if (displayMode === "complete" && bites.length > 0) {
    completeSoloWalkerStage();
    stageDialogue.classList.add("is-complete", "is-route-board");
    if (activeCompleteEvidenceStep > 0) {
      renderCompleteRouteEvidence(activeCompleteEvidenceStep);
    } else {
      renderReturnFirstSummary();
    }
    positionStageDialogueForSpeaker(speakerId);
    return;
  }

  if (bites.length > 0 && currentRound >= playableStepCount && !biteInProgress && sandboxStarted && !isRpgStoryboardStepActive()) {
    finishFrictionLoop();
    return;
  }

  if (bites.length > 0 && currentRound === 0 && sandboxStarted) {
    updateSoloWalkerStage(null, 0);
    hideStageDialoguePanel();
    return;
  }

  const activeBite = bite || (currentRound > 0 ? bites[currentRound - 1] : null);
  const step = activeBite && !isDefinitionDiagnosisMode()
    ? getSubstituteStepView(activeBite, biteIndex || currentRound || 1)
    : null;

  if (step) {
    updateSoloWalkerStage(activeBite, step.stepNumber);
    renderRouteBoardDialogue(step, playableStepCount);
    return;
  }

  hideStageDialoguePanel();
}

function hideStageDialoguePanel() {
  if (!stageDialogue) return;
  stageDialogue.hidden = true;
  stageDialogue.innerHTML = "";
  stageDialogue.classList.add("is-hidden");
  stageDialogue.style.removeProperty("--dialogue-left");
  stageDialogue.style.removeProperty("--dialogue-top");
}

function renderRouteBoardDialogue(step, totalSteps) {
  if (!stageDialogue) return;
  stageDialogue.hidden = false;
  stageDialogue.classList.remove("is-hidden", "speaker-left", "speaker-right", "speaker-none");
  stageDialogue.classList.add("is-route-board");
  stageDialogue.style.removeProperty("--dialogue-left");
  stageDialogue.style.removeProperty("--dialogue-top");

  const routeNode = routeBoardNodes[step.stepNumber - 1] || "试走";
  const causalBridge = getRouteBoardCausalBridge(step);
  appendStageDialogueContent({
    label: `第 ${step.stepNumber}/${totalSteps} 步 · ${routeNode}`,
    title: "小人",
    body: getRouteBoardDialogueLine(step),
    purposeLabel: "刚才",
    purpose: causalBridge.before,
    nextLabel: "所以",
    next: causalBridge.after
  });
  appendRouteBoardContinueButton(step.stepNumber, totalSteps);
}

function renderReturnFirstSummary() {
  const summary = getReturnFirstSummary();
  appendStageDialogueContent({
    label: "小人回来了",
    title: "小人",
    body: summary.opening,
    returnSummary: summary,
    receipt: true
  });
}

function renderCompleteRouteEvidence(stepNumber) {
  const evidence = getRouteEvidenceView(stepNumber);
  appendStageDialogueContent({
    label: `路线证据 · ${stepNumber}/5`,
    title: "小人",
    body: evidence.line,
    purposeLabel: "刚才",
    purpose: evidence.happened,
    nextLabel: "所以",
    next: evidence.changed,
    options: [
      { title: "用什么 AI / 工具", body: evidence.tool },
      { title: "这一站输出", body: evidence.output }
    ]
  });
  appendReturnSummaryButton();
}

function getRouteBoardDialogueLine(step = {}) {
  return getOnRouteMicroDialogue(step);
}

function getOnRouteMicroDialogue(step = {}) {
  const crossBorderLine = getCrossBorderWorkflowMicroLine(step);
  if (crossBorderLine) return crossBorderLine;

  const autoUploadLine = getAutoUploadMicroLine(step);
  if (autoUploadLine) return autoUploadLine;

  const competitorLine = getCompetitorAnalysisMicroLine(step);
  if (competitorLine) return competitorLine;

  const topicJudgeLine = getTopicJudgeMicroLine(step);
  if (topicJudgeLine) return topicJudgeLine;

  const hit = getShortBubbleClause(step.realityFeedback || step.frictionType || "", "这里先卡住了");
  const shift = getShortShrinkClause(step.routeChange?.to || step.nextMove || "");
  const lines = [
    "我先背着这个想法走一段，看看哪里最重。",
    `这里卡住了：${hit}。`,
    shift ? `我先把它砍小：${shift}。` : "我先砍掉太大的部分。",
    shift ? `路线先变成：${shift}。` : "路线先变成今晚能试的一小步。",
    "我带回来了，今晚先验证这一小步。"
  ];

  return lines[clamp((step.stepNumber || 1) - 1, 0, lines.length - 1)];
}

function getCrossBorderWorkflowMicroLine(step = {}) {
  if (!isCrossBorderWorkflowIdea()) return "";
  const lines = {
    1: "我先背着这个想法走一段，看看哪里最重。",
    2: "卡住了，选品、文案、订单一起上，入口太大。",
    3: "我先砍掉全流程，只留一个商品文案草稿。",
    4: "路线先变成：一个商品 -> 一条草稿 -> 一份手动清单。",
    5: "我带回来了，今晚别做全流程，先验证这一小步。"
  };
  return lines[step.stepNumber] || "";
}

function getCompetitorAnalysisMicroLine(step = {}) {
  if (!isCompetitorAnalysisIdea()) return "";
  const lines = {
    1: "我先背着这份竞品分析走一段，只看公开资料。",
    2: "卡住了，没有公开证据就不能让 AI 猜内部规则。",
    3: "我先砍掉情报系统，只做一页公开资料简报。",
    4: "路线先变成：公开来源 -> 证据表 -> 一页简报。",
    5: "我带回来了，今晚只做公开资料版。"
  };
  return lines[step.stepNumber] || "";
}

function getAutoUploadMicroLine(step = {}) {
  if (!isAutoUploadWorkflowIdea()) return "";
  const lines = {
    1: "我先不碰自动上传，只背着草稿链路走一段。",
    2: "卡住了，自动上传会碰平台规则和账号授权。",
    3: "我先砍掉发布动作，只留视频草稿和手动清单。",
    4: "路线先变成：题目 -> 文案 -> 视频草稿 -> 上传清单。",
    5: "我带回来了，今晚先导出草稿，不自动发布。"
  };
  return lines[step.stepNumber] || "";
}

function getTopicJudgeMicroLine(step = {}) {
  if (!isTopicJudgeIdea()) return "";
  const lines = {
    1: "我先背着选题判断走一段，看创作者拿不拿得住。",
    2: "卡住了，只说会不会有人看，创作者不知道怎么改。",
    3: "我先把它砍成一张选题判断表。",
    4: "路线先变成：标题钩子 -> 评论区疑问 -> 是否继续改。",
    5: "我带回来了，今晚先填一张表。"
  };
  return lines[step.stepNumber] || "";
}

function getRouteBoardCausalBridge(step = {}) {
  const competitorBridge = getCompetitorAnalysisCausalBridge(step);
  if (competitorBridge) return competitorBridge;

  const crossBorderBridge = getCrossBorderWorkflowCausalBridge(step);
  if (crossBorderBridge) return crossBorderBridge;

  const fromRoute = getReadableRouteFrom(step);
  const toRoute = getReadableRouteTo(step);
  const hit = stripEndPunctuation(step.realityFeedback || step.friction || step.frictionType || "现实反馈还不清楚");

  return {
    before: `${fromRoute}往前走时，撞到：${hit}。`,
    after: `路线从“${fromRoute}”压成“${toRoute}”。`
  };
}

function getCompetitorAnalysisCausalBridge(step = {}) {
  if (!isCompetitorAnalysisIdea()) return null;
  const object = getCompetitorObjectLabel();
  const bridges = {
    1: {
      before: `这条路一开始想把“${object}”做成完整竞品分析，范围太宽。`,
      after: "先压成一页只基于公开资料的竞品简报。"
    },
    2: {
      before: "卡在这里：如果没有公开资料，AI 会开始编内部规则或竞品结论。",
      after: "先只收集公开页面、公开截图和官方说明，不让 AI 猜后台数据。"
    },
    3: {
      before: "完整竞品情报系统需要持续采集、清洗和维护证据，今晚做不完。",
      after: "先手动收集 3-5 个公开来源，再让 AI 整理成一页简报。"
    },
    4: {
      before: "路线如果继续扩大会碰到隐私、后台数据和未授权采集边界。",
      after: "路线变成：公开来源 -> 证据表 -> 一页竞品简报。"
    },
    5: {
      before: "没有证据的结论不能带回去当判断。",
      after: "带回一页简报：只写有公开证据的判断，没证据的标待确认。"
    }
  };
  return bridges[step.stepNumber] || null;
}

function getCrossBorderWorkflowCausalBridge(step = {}) {
  if (!isCrossBorderWorkflowIdea()) return null;

  const bridges = {
    1: {
      before: "刚开始这条路同时说选品、文案和订单，第一口太宽。",
      after: "先从完整工作流压到一个入口：拿一个商品做第一版。"
    },
    2: {
      before: "完整工作流要跨选品、商品文案和订单管理，数据和流程会一起拖住。",
      after: "先从完整工作流压成一个最小动作：输入一个商品，产出一条可给人看的商品文案草稿。"
    },
    3: {
      before: "如果一上来做自动流程，选品、文案和订单任何一段都要持续维护。",
      after: "先从全流程自动化压成手动版：输入一个商品，产出一条商品文案草稿，再看卖家要不要继续。"
    },
    4: {
      before: "手动版还不知道比表格、ERP 或现有工具强在哪个小点。",
      after: "先从通用工作流压成一个差异点：找卖家现在最别扭的文案或订单细节。"
    },
    5: {
      before: "第一次觉得有用，不代表卖家明天还会回来。",
      after: "先从一次试用压成连续动作：让同一个人连续 3 天用同一个商品文案动作。"
    }
  };

  return bridges[step.stepNumber] || null;
}

function isCrossBorderWorkflowIdea() {
  const text = [
    ideaInput?.value,
    simulation?.idea?.input,
    simulation?.idea?.pitch,
    simulation?.idea?.name
  ].filter(Boolean).join("\n");
  return /跨境电商|跨境|选品|商品文案|订单管理/.test(text);
}

function isAutoUploadWorkflowIdea() {
  const text = getCurrentIdeaText();
  const gate = simulation?.clarityGate || {};
  return /自动上传|自动发布|上传视频|平台发布|发布视频/.test([
    text,
    gate.firstRunnableArtifact || "",
    gate.safetyShrink || ""
  ].join("\n"));
}

function isTopicJudgeIdea() {
  return /选题|标题钩子|评论区|会不会有人看|创作者/.test(getCurrentIdeaText());
}

function isReadmeTutorialIdea() {
  return /README|开源|使用教程|新手教程/.test(getCurrentIdeaText());
}

function isCompetitorAnalysisIdea() {
  return /竞品分析|竞品|竞争产品|对标/.test(getCurrentIdeaText());
}

function isAmapCompetitorIdea() {
  return /高德地图|高德|商户通|商业产品|会员体系|会员规则/.test(getCurrentIdeaText());
}

function isSaasCompetitorIdea() {
  return /SaaS|定价页|功能页|用户评价/.test(getCurrentIdeaText());
}

function isShortVideoCompetitorIdea() {
  return /短视频账号|短视频|账号|选题|标题|评论区/.test(getCurrentIdeaText()) && isCompetitorAnalysisIdea();
}

function getCurrentIdeaText() {
  return [
    ideaInput?.value,
    simulation?.idea?.input,
    simulation?.idea?.pitch,
    simulation?.idea?.name
  ].filter(Boolean).join("\n");
}

function getCompetitorObjectLabel() {
  const text = getCurrentIdeaText();
  if (isAmapCompetitorIdea()) return "高德地图商业产品 / 商户通会员体系";
  if (isSaasCompetitorIdea()) return "目标 SaaS 产品的定价页、功能页和公开用户评价";
  if (isShortVideoCompetitorIdea()) return "目标短视频账号的公开选题、标题和评论区问题";
  const match = text.match(/关于[:：]\s*([^，。]+)/u)?.[1] || text.match(/研究(.+?)(?:的|，|。|$)/u)?.[1] || "这个竞品对象";
  return stripEndPunctuation(match).slice(0, 48) || "这个竞品对象";
}

function getReadableRouteFrom(step = {}) {
  return stripEndPunctuation(
    step.routeChange?.from ||
    step.currentSurvivingRoute ||
    step.agentAttempt ||
    "当前路线"
  );
}

function getReadableRouteTo(step = {}) {
  return stripEndPunctuation(
    step.routeChange?.to ||
    step.nextMove ||
    step.branch ||
    "更小的路线"
  );
}

function getReturnFirstSummary() {
  if (isCrossBorderWorkflowIdea()) return getCrossBorderReturnSummary();
  if (isAutoUploadWorkflowIdea()) return getAutoUploadReturnSummary();
  if (isCompetitorAnalysisIdea()) return getCompetitorAnalysisReturnSummary();
  if (isTopicJudgeIdea()) return getTopicJudgeReturnSummary();
  if (isReadmeTutorialIdea()) return getReadmeReturnSummary();
  return getGenericReturnSummary();
}

function getCrossBorderReturnSummary() {
  return {
    opening: "我替你走了一圈，完整路线卡在这里：",
    blocker: "选品、文案、订单管理一起做，依赖太多。",
    why: "每一段都要不同数据、不同工具和不同判断标准，一上来全做会拖住。",
    betterRoute: "先只做“一个商品 -> 一条商品文案草稿 -> 一份手动检查清单”。",
    tonightAction: "选 1 个商品，生成一条商品文案草稿，让 3 个目标卖家看懂不懂。",
    tools: [
      "ChatGPT / Gemini：生成商品文案草稿。",
      "本地文档或表格：记录商品名称、草稿版本、3 个卖家是否看懂。",
      "如果要视频，再用剪映 / CapCut 做草稿。"
    ],
    after: "回来告诉小人：你做了什么、卡在哪、对方有什么反应。"
  };
}

function getAutoUploadReturnSummary() {
  const gate = simulation?.clarityGate || {};
  const artifact = stripEndPunctuation(cleanResultText(gate.firstRunnableArtifact || getFinalSurvivingRoute() || "视频草稿、标题、发布文案和手动上传清单"));
  const safetyShrink = stripEndPunctuation(cleanResultText(gate.safetyShrink || "不默认自动上传，先导出草稿和手动发布清单"));
  return {
    opening: "我替你走了一圈，完整路线卡在这里：",
    blocker: "自动上传会撞到平台规则、账号授权和发布责任。",
    why: "一上来接发布链路，任何规则或授权都会把第一版卡死。",
    betterRoute: `先只做“题目 -> 文案 -> 视频草稿 -> 手动上传清单”。`,
    tonightAction: safetyShrink || `先做出：${artifact}。`,
    tools: [
      "ChatGPT / Gemini：生成题目、脚本和发布文案草稿。",
      "剪映 / CapCut：做视频草稿。",
      "本地文档 / 表格：保存手动上传清单；不默认自动上传。"
    ],
    after: "回来告诉小人：草稿做了什么、哪里卡住、手动发布前还缺什么。"
  };
}

function getTopicJudgeReturnSummary() {
  const artifact = stripEndPunctuation(cleanResultText(simulation?.clarityGate?.firstRunnableArtifact || "一张选题判断表：标题钩子、评论区疑问、是否继续改"));
  return {
    opening: "我替你走了一圈，完整路线卡在这里：",
    blocker: "只问“会不会有人看”，创作者拿不到能修改的抓手。",
    why: "选题判断要落到标题、疑问和下一步动作，不然只会变成空结论。",
    betterRoute: `先做“${artifact}”。`,
    tonightAction: "拿 1 个选题填表，改出 1 个标题，再决定继续还是放弃。",
    tools: [
      "ChatGPT / Gemini：生成判断表和改标题建议。",
      "本地表格：记录标题钩子、评论区疑问和是否继续改。",
      "创作者自己提供的标题 / 公开评论样本：填入真实疑问和真实标题。"
    ],
    after: "回来告诉小人：你填了哪个选题、哪里卡住、标题有没有变清楚。"
  };
}

function getReadmeReturnSummary() {
  const artifact = stripEndPunctuation(cleanResultText(simulation?.clarityGate?.firstRunnableArtifact || "README -> 新手使用教程"));
  return {
    opening: "我替你走了一圈，完整路线卡在这里：",
    blocker: "README 里安装、示例和参数混在一起，新手不知道先做哪一步。",
    why: "如果先做完整文档平台，会被格式、项目差异和长期维护拖住。",
    betterRoute: `先只做“${artifact}”。`,
    tonightAction: "选 1 个 README，整理成一页新手能照着走的使用教程。",
    tools: [
      "ChatGPT / Gemini：把 README 改写成新手步骤。",
      "Codex：需要时做本地文档或小 demo。",
      "本地文档：保存教程和新手反馈。"
    ],
    after: "回来告诉小人：教程转到哪一步、新手卡在哪、还缺哪张截图或命令。"
  };
}

function getCompetitorAnalysisReturnSummary() {
  if (isShortVideoCompetitorIdea()) return getShortVideoCompetitorReturnSummary();
  if (isSaasCompetitorIdea()) return getSaasCompetitorReturnSummary();
  if (isAmapCompetitorIdea()) return getAmapCompetitorReturnSummary();
  return getPublicCompetitorBriefReturnSummary();
}

function getAmapCompetitorReturnSummary() {
  return {
    opening: "我替你走了一圈，完整路线卡在这里：",
    blocker: "高德地图商业产品、产品形态和商户通会员规则一起看，范围会拖成完整竞品情报系统。",
    why: "商户规则和会员体系必须有公开证据；没有公开资料时，AI 很容易开始猜内部规则。",
    betterRoute: "先只做“一份只基于公开资料的竞品简报”。",
    tonightAction: "手动收集 3-5 个公开页面 / 公开截图 / 官方说明，整理成一页公开资料竞品简报。",
    tools: getAmapCompetitorToolAdvice(),
    after: "回来告诉小人：你找到了哪些公开来源、哪条规则没证据、下一步还缺哪条公开证据。"
  };
}

function getSaasCompetitorReturnSummary() {
  return {
    opening: "我替你走了一圈，完整路线卡在这里：",
    blocker: "SaaS 定价页、功能页和用户评价一起分析，容易滑成没有证据链的竞品报告。",
    why: "价格、功能和评价必须能追到公开页面；没有来源时，AI 会把猜测写得像结论。",
    betterRoute: "先只做“一页公开资料竞品简报”。",
    tonightAction: "手动收集定价页、功能页和 3-5 条公开用户评价，整理成一页公开资料竞品简报。",
    tools: getSaasCompetitorToolAdvice(),
    after: "回来告诉小人：你收集了哪些公开页面、哪 3 条判断有证据、哪些结论还不能下。"
  };
}

function getShortVideoCompetitorReturnSummary() {
  return {
    opening: "我替你走了一圈，完整路线卡在这里：",
    blocker: "短视频账号的选题、标题和评论区问题很多，直接做分析容易变成爬虫或搬运。",
    why: "公开视频和评论只能手动观察或由用户提供样本；不能默认批量抓取、采集隐私或绕平台限制。",
    betterRoute: "先只做“一页公开视频观察简报”。",
    tonightAction: "手动观察 5-10 条公开视频或用户提供样本，整理选题、标题和评论区问题。",
    tools: getShortVideoCompetitorToolAdvice(),
    after: "回来告诉小人：你看了哪些公开视频、发现了哪类标题或评论问题、哪些内容不能碰。"
  };
}

function getPublicCompetitorBriefReturnSummary() {
  const object = getCompetitorObjectLabel();
  return {
    opening: "我替你走了一圈，完整路线卡在这里：",
    blocker: `${object}不能一上来做完整竞品情报，证据来源会先卡住。`,
    why: "竞品结论必须有公开来源；没有证据时，AI 会把猜测写得像事实。",
    betterRoute: "先只做“一页公开资料竞品简报”。",
    tonightAction: `手动收集 3-5 个和${object}直接相关的公开来源，整理成一页公开资料竞品简报。`,
    tools: getPublicCompetitorToolAdvice(object),
    after: "回来告诉小人：哪些判断有公开证据、哪些结论还不能下、下一步缺哪条来源。"
  };
}

function getGenericReturnSummary() {
  const verdict = simulation?.verdict || {};
  const blocker = stripEndPunctuation(cleanResultText(verdict.biggestBlocker || getMostRelevantRealityHit() || "完整路线太重，第一步不够小"));
  const betterRoute = stripEndPunctuation(cleanResultText(getFinalSurvivingRoute() || verdict.strongestBranch || "先保留一个能今晚试的交付物"));
  const action = stripEndPunctuation(cleanResultText(verdict.smallestValidation || betterRoute || "先做一次最小现实验证"));
  return {
    opening: "我替你走了一圈，完整路线卡在这里：",
    blocker,
    why: "它一上来要同时处理太多依赖，今晚很容易做散。",
    betterRoute,
    tonightAction: action,
    tools: getMinimalToolStackForText(`${getCurrentIdeaText()}\n${betterRoute}\n${action}`),
    after: "回来告诉小人：你做了什么、卡在哪、对方或自己有什么反应。"
  };
}

function getMostRelevantRealityHit() {
  const step = getFrictionBites()
    .map((bite, index) => getSubstituteStepView(bite, index + 1))
    .find((item) => /依赖|权限|流程|成本|维护|自动|范围|平台/.test(item.realityFeedback || ""));
  return step?.realityFeedback || getFrictionBites()[0]?.realityFeedback || "";
}

function getMinimalToolStackForText(text = "") {
  if (isCompetitorAnalysisIdea() || /竞品分析|竞品|竞争产品|对标|定价页|功能页|用户评价|商户通|会员规则/.test(text)) {
    return getPublicCompetitorToolAdvice(getCompetitorObjectLabel());
  }
  if (/自动上传|自动发布|上传清单|发布文案/.test(text)) {
    return [
      "打开：ChatGPT / Gemini、剪映 / CapCut、本地文档或表格。",
      "输入：题目、脚本要点、视频素材或你自己准备的画面说明。",
      "AI 帮你做：生成脚本草稿、标题和发布文案，不接平台发布权限。",
      "产出：视频草稿、标题、发布文案和手动上传清单。",
      "边界：不默认自动上传，不绕过平台规则，不采集账号隐私。",
      "过关：你能手动检查草稿并决定是否发布。"
    ];
  }
  if (/视频|短视频|剪映|CapCut/.test(text)) {
    return [
      "打开：ChatGPT / Gemini、剪映 / CapCut、本地文档。",
      "输入：这条视频的主题、目标观众和你已有的素材说明。",
      "AI 帮你做：生成一条短视频脚本或口播文案草稿。",
      "产出：一条能放进剪映 / CapCut 的视频草稿。",
      "边界：不用未授权素材，不默认批量发布。",
      "过关：前 3 秒能让目标观众知道为什么继续看。"
    ];
  }
  if (/demo|小网页|脚本|本地/.test(text)) {
    return [
      "打开：Codex、ChatGPT / Gemini、本地文档。",
      "输入：当前想法、一个最小使用场景和你已有的样本数据。",
      "AI 帮你做：Codex 做本地 demo / 小网页 / 脚本，ChatGPT / Gemini 整理页面文案。",
      "产出：一个本地可打开的最小 demo 或脚本。",
      "边界：不接平台 API，不保存用户隐私数据。",
      "过关：别人能按一次流程看懂它解决什么。"
    ];
  }
  return [
    `打开：ChatGPT / Gemini 和本地文档 / 表格，围绕“${getSpecificObjectLabel()}”这一件事。`,
    `输入：只放和“${getSpecificObjectLabel()}”直接相关的材料、来源和你要确认的问题。`,
    `AI 帮你做：把这些材料整理成“${stripEndPunctuation(text).slice(0, 42) || "今晚这一小步"}”的第一版，不补没有证据的结论。`,
    "产出：一份能今晚交付给自己或目标用户看的小文件。",
    "边界：不采集隐私，不绕过平台限制，不使用未授权材料。",
    "过关：至少能指出 3 条来源或观察支持你的判断。"
  ];
}

function getAmapCompetitorToolAdvice() {
  return [
    "打开：浏览器手动打开高德地图商业产品、商户通、官方帮助页、公开新闻或产品介绍页，只看公开信息。",
    "输入：把 3-5 个公开页面链接 / 公开截图 / 官方说明放进本地表格。",
    "AI 帮你做：让 ChatGPT / Gemini 只基于这些公开信息整理一页竞品简报，不补写内部商户规则。",
    "产出：一页公开资料竞品简报：产品形态、商户会员规则、可模仿点、不能碰的边界、还缺哪条公开证据。",
    "边界：不抓后台数据，不采集用户隐私，不绕过平台限制，不假装有内部商户数据。",
    "过关：至少有 3 条公开证据支持判断；没有证据的内部规则只标“未知 / 待公开资料确认”。"
  ];
}

function getSaasCompetitorToolAdvice() {
  return [
    "打开：浏览器手动打开目标 SaaS 的定价页、功能页、公开帮助文档和公开评价页面。",
    "输入：记录来源链接、价格档位、核心功能、用户抱怨和可验证证据。",
    "AI 帮你做：让 ChatGPT / Gemini 只基于这些公开资料整理对比简报，不猜后台数据。",
    "产出：一页公开资料竞品简报：定价结构、核心功能、用户抱怨、可模仿点、不能下的结论。",
    "边界：不抓后台数据，不采集未授权用户信息，不绕过登录或付费限制。",
    "过关：至少 3 条判断能回指到公开页面或公开评价；没有证据的结论标“待确认”。"
  ];
}

function getShortVideoCompetitorToolAdvice() {
  return [
    "打开：手动查看目标短视频账号的公开视频页，或使用用户自己提供的视频 / 评论截图。",
    "输入：记录视频链接或截图、标题、选题方向、公开评论里的高频问题。",
    "AI 帮你做：让 ChatGPT / Gemini 归纳选题模式、标题钩子和评论区未被回答的问题。",
    "产出：一页公开视频观察简报：选题类型、标题写法、评论区疑问、可借鉴点、不能搬运的内容。",
    "边界：不默认爬虫，不批量抓取评论，不采集用户隐私，不搬运未授权内容。",
    "过关：至少 3 条公开视频或用户提供样本支撑判断；不能证明的账号策略不写成结论。"
  ];
}

function getPublicCompetitorToolAdvice(object = getCompetitorObjectLabel()) {
  return [
    `打开：浏览器手动打开和“${object}”直接相关的公开页面、官方说明、公开新闻或公开评价。`,
    "输入：把 3-5 个公开来源的链接 / 截图 / 关键文字放进本地表格。",
    "AI 帮你做：让 ChatGPT / Gemini 只基于这些公开资料整理一页竞品简报，不替你猜内部数据。",
    "产出：一页公开资料竞品简报：对象、产品形态、证据支持的判断、不能碰的边界、还缺的公开证据。",
    "边界：不抓后台数据，不采集用户隐私，不绕过平台限制，不做未授权采集。",
    "过关：至少有 3 条公开证据支持判断；没有证据的部分标“未知 / 待确认”。"
  ];
}

function getSpecificObjectLabel() {
  if (isCompetitorAnalysisIdea()) return getCompetitorObjectLabel();
  if (isTopicJudgeIdea()) return "这个选题的标题钩子、评论区疑问和是否继续改";
  if (isReadmeTutorialIdea()) return "这个 README 的安装、示例和新手第一步";
  if (isAutoUploadWorkflowIdea()) return "题目到文案、视频草稿和手动上传清单";
  return stripEndPunctuation(getCurrentIdeaText().split(/[。！？\n]/u).find(Boolean) || "当前想法").slice(0, 48) || "当前想法";
}

function getRouteEvidenceView(stepNumber) {
  const step = getEvidenceStepView(stepNumber);
  const causalBridge = getRouteBoardCausalBridge(step);
  return {
    line: `这一站：${routeBoardNodes[stepNumber - 1] || "试走"}。${getOnRouteMicroDialogue(step)}`,
    happened: causalBridge.before,
    changed: causalBridge.after,
    tool: getRouteEvidenceToolLine(step),
    output: getRouteEvidenceOutput(step)
  };
}

function getEvidenceStepView(stepNumber) {
  const bite = getFrictionBites()[stepNumber - 1];
  if (bite && !isDefinitionDiagnosisMode()) return getSubstituteStepView(bite, stepNumber);
  return {
    stepNumber,
    frictionType: routeBoardNodes[stepNumber - 1] || "试走",
    currentSurvivingRoute: stepNumber === 1 ? "原始想法" : "上一站留下的路线",
    realityFeedback: "这一站没有额外记录。",
    routeChange: { from: "当前路线", to: "更小的路线" },
    nextMove: "更小的路线"
  };
}

function getRouteEvidenceToolLine(step = {}) {
  if (isCrossBorderWorkflowIdea()) return "ChatGPT / Gemini 生成商品文案草稿，本地表格记录反馈。";
  if (isAutoUploadWorkflowIdea()) return "ChatGPT / Gemini 生成草稿，剪映 / CapCut 做视频草稿；不默认自动上传。";
  if (isCompetitorAnalysisIdea()) return getCompetitorEvidenceToolLine();
  if (isTopicJudgeIdea()) return "ChatGPT / Gemini 生成判断表，本地表格记录标题和评论疑问。";
  return getMinimalToolStackForText(`${getCurrentIdeaText()}\n${getReadableRouteTo(step)}`)[0];
}

function getCompetitorEvidenceToolLine() {
  if (isShortVideoCompetitorIdea()) return "手动查看公开视频或用户提供样本 + 本地表格记录来源 + ChatGPT / Gemini 整理观察；不默认爬虫。";
  if (isSaasCompetitorIdea()) return "浏览器打开公开定价页 / 功能页 / 评价页 + 本地表格记录来源 + ChatGPT / Gemini 整理公开证据。";
  return "浏览器手动收集公开页面 / 截图 / 官方说明 + 本地表格记录来源 + ChatGPT / Gemini 整理公开资料；不碰后台数据或隐私。";
}

function getRouteEvidenceOutput(step = {}) {
  return stripEndPunctuation(step.routeChange?.to || step.nextMove || step.branch || "一个更小的下一步");
}

function getAiDoorwayRouteBoardLine(step = {}) {
  if ((step.stepNumber || 1) !== 1) return "";
  const gate = simulation?.clarityGate || {};
  const artifact = cleanResultText(gate.firstRunnableArtifact || "");
  if (!artifact) return "";

  const safetyShrink = cleanResultText(gate.safetyShrink || "");
  const artifactLine = stripEndPunctuation(artifact);
  const text = [artifact, safetyShrink, simulation?.idea?.input || ""].join("\n");

  if (/自动上传|上传清单|视频草稿|发布文案/.test(text)) {
    return `我先不碰自动上传。第一版只做：输入一个题目，产出${artifactLine}。`;
  }

  if (safetyShrink) {
    return `我先把它压成：${artifactLine}。${safetyShrink}`;
  }

  return `我先把它压成：${artifactLine}。`;
}

function appendRouteBoardContinueButton(stepNumber, totalSteps) {
  if (!stageDialogue) return;
  const button = document.createElement("button");
  button.className = "route-board-continue";
  button.type = "button";
  button.disabled = Boolean(biteInProgress || sandboxCompleted);
  button.textContent = stepNumber >= totalSteps ? "看今晚动作" : "继续";
  button.addEventListener("click", handleRouteBoardContinueClick);
  stageDialogue.append(button);
}

function handleRouteBoardContinueClick() {
  if (sandboxCompleted) {
    resultCard?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (biteInProgress) return;

  const playableStepCount = getPlayableStepCount();
  if (currentRound >= playableStepCount) {
    finishFrictionLoop();
    return;
  }

  playRound();
}

function handleRouteBoardNodeClick(event) {
  const node = event.target?.closest?.(".route-board-node");
  if (!node || !sandboxCompleted) return;
  const stepNumber = clamp(Number(node.dataset.routeStep || 0), 1, LITTLE_WALKER_STEP_LIMIT);
  activeCompleteEvidenceStep = stepNumber;
  renderRouteBoardState(LITTLE_WALKER_STEP_LIMIT);
  renderStageDialogue();
}

function handleRouteBoardNodeKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const node = event.target?.closest?.(".route-board-node");
  if (!node || !sandboxCompleted) return;
  event.preventDefault();
  handleRouteBoardNodeClick(event);
}

function renderRpgStoryboardDialogue(step, totalSteps) {
  stageDialogue.classList.add("is-rpg-storyboard");
  lockGlobalContinueForRpg();
  rpgStoryboardStepNumber = step?.stepNumber || currentRound;
  const frames = getRpgStoryboardFrames(step);
  const index = clamp(rpgStoryboardFrameIndex, 0, frames.length - 1);
  const frame = frames[index];

  appendStageDialogueContent({
    label: `幕 ${index + 1}/${frames.length} · ${frame.title}`,
    title: "小人",
    body: frame.line,
    next: index < frames.length - 1
      ? "点继续，看小人下一句。"
      : currentRound >= totalSteps
        ? "点继续，看小人带回今晚动作。"
      : `点继续，进入第 ${Math.min(totalSteps, currentRound + 1)}/${totalSteps} 步。`
  });
  appendRpgContinueButton(index, frames.length, totalSteps);
}

function getRpgStoryboardFrames(step) {
  const ideaText = [
    ideaInput?.value,
    simulation?.idea?.input,
    simulation?.idea?.pitch,
    simulation?.idea?.name
  ].filter(Boolean).join(" ");

  if (step?.stepNumber === RPG_STORYBOARD_STEP_NUMBER && /Excel|表格|短视频/.test(ideaText)) {
    return [
      { title: "出发", line: "我先拿这个想法去试一下。" },
      { title: "卡住", line: "入口太大了，直接做账号会散。" },
      { title: "想到", line: "先做一条 Excel 场景的短视频草稿。" },
      { title: "带回", line: "今晚只验证这条草稿能不能让人看懂。" }
    ];
  }

  if (step?.stepNumber > RPG_STORYBOARD_STEP_NUMBER) {
    const hit = getShortBubbleClause(step?.realityFeedback || step?.frictionType || "", "这里卡住了");
    const shrink = getShortShrinkClause(step?.routeChange?.to || step?.nextMove || "");
    return [
      {
        title: `第 ${step.stepNumber}/${getPlayableStepCount()} 步`,
        line: shrink ? `我走到这里卡住：${hit}。先缩成：${shrink}。` : `我走到这里卡住：${hit}。`
      }
    ];
  }

  const shrink = getShortShrinkClause(step?.routeChange?.to || step?.nextMove || "");
  const hit = getShortBubbleClause(step?.realityFeedback || step?.frictionType || "", "入口还是太大");

  return [
    { title: "出发", line: "我先拿这个想法去试一下。" },
    { title: "卡住", line: `${hit}，直接做会散。` },
    { title: "想到", line: `先把它缩成：${shrink || "今晚能做的一条草稿"}。` },
    { title: "带回", line: "今晚只验证这一步能不能让人看懂。" }
  ];
}

function appendRpgContinueButton(frameIndex, frameCount, totalSteps) {
  const button = document.createElement("button");
  button.className = "stage-rpg-continue";
  button.type = "button";
  button.disabled = Boolean(biteInProgress || sandboxCompleted);
  button.textContent = getRpgContinueButtonText(frameIndex, frameCount, totalSteps);
  button.addEventListener("click", handleRpgContinueClick);
  stageDialogue.append(button);
}

function getRpgContinueButtonText(frameIndex, frameCount, totalSteps) {
  if (sandboxCompleted) return "看今晚动作";
  if (frameIndex < frameCount - 1) return "继续";
  if (currentRound >= totalSteps) return "看小人回来";
  return "进入下一步";
}

function positionRpgStoryboardProtagonistDialogue() {
  placeRpgStoryboardProtagonist();
  stageDialogue.classList.remove("speaker-left", "speaker-right");
  stageDialogue.style.removeProperty("--dialogue-left");
  stageDialogue.style.removeProperty("--dialogue-top");
}

function appendStageDialogueContent({ label, title, bodyLabel, body, purposeLabel, purpose, nextLabel, next, options = [], returnSummary = null, directBuildTask = null, receipt = false }) {
  const labelNode = document.createElement("span");
  labelNode.className = "stage-dialogue-label";
  labelNode.textContent = label || "小人说";

  const titleNode = document.createElement("strong");
  titleNode.textContent = title || "小人正在看这条路";

  stageDialogue.append(labelNode, titleNode);

  if (bodyLabel) {
    const bodyLabelNode = document.createElement("b");
    bodyLabelNode.className = "stage-dialogue-section-label";
    bodyLabelNode.textContent = bodyLabel;
    stageDialogue.append(bodyLabelNode);
  }

  const bodyNode = document.createElement("p");
  bodyNode.className = "stage-dialogue-main";
  bodyNode.textContent = body || "";

  stageDialogue.append(bodyNode);

  if (returnSummary) {
    stageDialogue.append(createReturnFirstSummaryBlock(returnSummary));
  }

  if (directBuildTask) {
    stageDialogue.append(createDirectBuildCard(directBuildTask));
  }

  if (purpose) {
    if (purposeLabel) {
      const purposeLabelNode = document.createElement("b");
      purposeLabelNode.className = "stage-dialogue-section-label";
      purposeLabelNode.textContent = purposeLabel;
      stageDialogue.append(purposeLabelNode);
    }
    const purposeNode = document.createElement("p");
    purposeNode.className = "stage-dialogue-purpose";
    purposeNode.textContent = purpose;
    stageDialogue.append(purposeNode);
  }

  if (next) {
    if (nextLabel) {
      const nextLabelNode = document.createElement("b");
      nextLabelNode.className = "stage-dialogue-section-label";
      nextLabelNode.textContent = nextLabel;
      stageDialogue.append(nextLabelNode);
    }
    const nextNode = document.createElement("p");
    nextNode.className = "stage-dialogue-next";
    nextNode.textContent = next;
    stageDialogue.append(nextNode);
  }

  if (Array.isArray(options) && options.length > 0) {
    const list = document.createElement("ul");
    list.className = "stage-dialogue-options";
    options.forEach((option) => {
      const item = document.createElement("li");
      const optionTitle = document.createElement("b");
      optionTitle.textContent = option.title;
      const optionBody = document.createElement("span");
      optionBody.textContent = option.body;
      item.append(optionTitle, optionBody);
      list.append(item);
    });
    stageDialogue.append(list);
  }

  if (receipt) {
    stageDialogue.append(createReturnReceiptBlock());
  }
}

function getDirectBuildTask() {
  return simulation?.clarityGate?.directBuildTask || {
    recommendedTool: "Codex",
    open: "Codex",
    goal: "做一个本地可运行的小 demo",
    files: ["index.html"],
    requirements: ["先做一个能打开、能操作的第一版"],
    acceptanceCriteria: ["浏览器打开后能直接使用"],
    notToDo: ["不要接后端、数据库或账号系统", "不要把 IdeaRoast 当成代码执行器；只复制任务给外部 AI / 工具执行"]
  };
}

function createDirectBuildCard(task = getDirectBuildTask()) {
  const panel = document.createElement("div");
  panel.className = "direct-build-card";

  const intro = document.createElement("p");
  intro.textContent = `这是开工指路卡：IdeaRoast 不在这里生成代码，只给你一段可复制给 ${formatDirectBuildTools(task)} 的任务。`;
  panel.append(intro, createDirectBuildTaskPanel(task), createDirectBuildButtonRow(task));
  return panel;
}

function createDirectBuildTaskPanel(task = getDirectBuildTask()) {
  const panel = document.createElement("section");
  panel.className = "direct-build-task";
  panel.append(
    createDirectBuildRow("推荐工具", formatDirectBuildTools(task)),
    createDirectBuildRow("让它做", task.goal || "做一个本地可运行的小 demo"),
    createDirectBuildRow("生成文件", formatList(task.files || ["index.html"]))
  );

  const requirements = document.createElement("div");
  requirements.className = "direct-build-row";
  const requirementsLabel = document.createElement("b");
  requirementsLabel.textContent = "功能要求";
  const requirementsList = document.createElement("ul");
  (task.requirements || []).slice(0, 6).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    requirementsList.append(li);
  });
  requirements.append(requirementsLabel, requirementsList);
  panel.append(requirements);

  const criteria = document.createElement("div");
  criteria.className = "direct-build-row";
  const label = document.createElement("b");
  label.textContent = "验收标准";
  const list = document.createElement("ul");
  (task.acceptanceCriteria || []).slice(0, 6).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  });
  criteria.append(label, list);
  panel.append(criteria);

  if (task.safetyShrink) {
    panel.append(createDirectBuildRow("安全收缩", task.safetyShrink));
  }

  if (Array.isArray(task.notToDo) && task.notToDo.length > 0) {
    const boundaries = document.createElement("div");
    boundaries.className = "direct-build-row";
    const boundariesLabel = document.createElement("b");
    boundariesLabel.textContent = "先不做";
    const boundariesList = document.createElement("ul");
    task.notToDo.slice(0, 6).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      boundariesList.append(li);
    });
    boundaries.append(boundariesLabel, boundariesList);
    panel.append(boundaries);
  }

  return panel;
}

function getDirectBuildToolNames(task = getDirectBuildTask()) {
  const rawTools = [
    task?.recommendedTool,
    task?.open,
    ...(Array.isArray(task?.recommendedTools) ? task.recommendedTools : []),
    ...(Array.isArray(task?.alternativeTools) ? task.alternativeTools : []),
    "Codex",
    "Claude",
    "Workbuddy"
  ];
  const seen = new Set();
  return rawTools
    .map((tool) => String(tool || "").trim())
    .filter(Boolean)
    .filter((tool) => {
      const key = tool.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 4);
}

function formatDirectBuildTools(task = getDirectBuildTask()) {
  return getDirectBuildToolNames(task).join(" / ") || "Codex";
}

function createDirectBuildStageCard(task = getDirectBuildTask()) {
  const panel = document.createElement("div");
  panel.className = "direct-build-stage-card";

  const header = document.createElement("div");
  header.className = "direct-build-stage-header";
  const eyebrow = document.createElement("span");
  eyebrow.className = "direct-build-stage-eyebrow";
  eyebrow.textContent = "开工卡";
  const title = document.createElement("strong");
  title.className = "direct-build-stage-title";
  title.textContent = "小人看了一眼：这条不用摔，直接交给 Codex / 合适工具做。";
  const note = document.createElement("p");
  note.className = "direct-build-stage-note";
  note.textContent = "这不是要试走的想法，这是可以直接开工的小任务。";
  header.append(eyebrow, title, note);

  const tools = document.createElement("div");
  tools.className = "direct-build-tool-list";
  const toolsLabel = document.createElement("b");
  toolsLabel.textContent = "推荐工具";
  tools.append(toolsLabel);
  getDirectBuildToolNames(task).forEach((tool) => {
    const chip = document.createElement("span");
    chip.className = "direct-build-tool-chip";
    chip.textContent = tool;
    tools.append(chip);
  });

  const grid = document.createElement("div");
  grid.className = "direct-build-stage-grid";
  grid.append(
    createDirectBuildStageBlock("让它做", task.goal || "做一个本地可运行的小 demo"),
    createDirectBuildStageBlock("交付物", formatList(task.files || ["index.html"])),
    createDirectBuildStageBlock("功能要求", task.requirements || [], { list: true, wide: true }),
    createDirectBuildStageBlock("验收标准", task.acceptanceCriteria || [], { list: true, wide: true })
  );

  if (task.safetyShrink) {
    grid.append(createDirectBuildStageBlock("安全收缩", task.safetyShrink, { wide: true }));
  }

  if (Array.isArray(task.notToDo) && task.notToDo.length > 0) {
    grid.append(createDirectBuildStageBlock("先不做", task.notToDo, { list: true, wide: true }));
  }

  panel.append(header, tools, grid, createDirectBuildButtonRow(task));
  return panel;
}

function createDirectBuildStageBlock(label, value, options = {}) {
  const block = document.createElement("section");
  block.className = options.wide ? "direct-build-stage-block is-wide" : "direct-build-stage-block";
  const title = document.createElement("b");
  title.textContent = label;
  block.append(title);

  if (options.list) {
    const list = document.createElement("ul");
    const items = Array.isArray(value) ? value : [value];
    items.filter(Boolean).slice(0, 6).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.append(li);
    });
    block.append(list);
  } else {
    const text = document.createElement("p");
    text.textContent = value || "-";
    block.append(text);
  }

  return block;
}

function createDirectBuildRow(label, value) {
  const row = document.createElement("p");
  row.className = "direct-build-row";
  const key = document.createElement("b");
  key.textContent = label;
  const text = document.createElement("span");
  text.textContent = value || "-";
  row.append(key, text);
  return row;
}

function createDirectBuildButtonRow(task = getDirectBuildTask()) {
  const row = document.createElement("div");
  row.className = "direct-build-actions";

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = "复制任务文本";
  copyButton.addEventListener("click", () => copyDirectBuildTask(task, copyButton));

  row.append(copyButton);
  return row;
}

async function copyDirectBuildTask(task = getDirectBuildTask(), button = null) {
  const copied = await copyTextToClipboard(getDirectBuildPrompt(task));
  if (button) {
    button.textContent = copied ? "已复制" : "任务文本已生成";
    window.setTimeout(() => {
      if (button.isConnected) button.textContent = "复制任务文本";
    }, 1500);
  }
  appendLog(copied ? "已复制开工任务。" : "开工任务已准备好。");
  return copied;
}

function getDirectBuildPrompt(task = getDirectBuildTask()) {
  const requirements = Array.isArray(task.requirements) ? task.requirements : [];
  const criteria = Array.isArray(task.acceptanceCriteria) ? task.acceptanceCriteria : [];
  const notToDo = Array.isArray(task.notToDo) ? task.notToDo : [];
  return [
    "请直接开工，不要先做产品路线分析。",
    "这段任务来自 IdeaRoast 的开工指路卡；IdeaRoast 不负责生成代码或创建文件，请由你来完成交付物。",
    "",
    `推荐工具：${formatDirectBuildTools(task)}`,
    `目标：${task.goal || "做一个本地可运行的小 demo"}`,
    `生成文件：${formatList(task.files || ["index.html"])}`,
    "",
    "需求：",
    ...requirements.map((item) => `- ${item}`),
    "",
    "验收标准：",
    ...criteria.map((item) => `- ${item}`),
    "",
    "不要做：",
    ...notToDo.map((item) => `- ${item}`)
  ].join("\n");
}

function createReturnFirstSummaryBlock(summary = {}) {
  const panel = document.createElement("div");
  panel.className = "return-first-summary";

  [
    ["卡在哪", summary.blocker],
    ["为什么卡", summary.why],
    ["更好走的路", summary.betterRoute],
    ["今晚动作", summary.tonightAction]
  ].forEach(([label, value]) => {
    panel.append(createReturnSummaryRow(label, value));
  });

  const toolsRow = document.createElement("section");
  toolsRow.className = "return-summary-row return-summary-tools";
  const toolsLabel = document.createElement("b");
  toolsLabel.textContent = "用什么 AI / 工具";
  const toolsList = document.createElement("ul");
  getGroundedToolAdvice(summary).slice(0, 6).forEach((tool) => {
    const item = document.createElement("li");
    item.textContent = tool;
    toolsList.append(item);
  });
  toolsRow.append(toolsLabel, toolsList);
  panel.append(toolsRow);

  panel.append(createReturnSummaryRow("做完后", summary.after));
  return panel;
}

function getGroundedToolAdvice(summary = {}) {
  const tools = Array.isArray(summary.tools) ? summary.tools.filter(Boolean) : [];
  if (tools.length === 0 || hasUngroundedToolAdvice(tools)) {
    return buildGroundedFallbackToolAdvice(summary);
  }
  return tools;
}

function hasUngroundedToolAdvice(tools = []) {
  const text = tools.join("\n");
  return /生成草稿、判断表或提示词|记录输入和反馈|用户自有样本 \/ 手动观察|作为第一轮输入|用 AI 整理一下|做个表格|收集资料|分析竞品|验证需求/.test(text);
}

function buildGroundedFallbackToolAdvice(summary = {}) {
  if (isCompetitorAnalysisIdea()) return getPublicCompetitorToolAdvice(getCompetitorObjectLabel());
  const object = getSpecificObjectLabel();
  const action = stripEndPunctuation(summary.tonightAction || "今晚这一小步");
  return [
    `打开：ChatGPT / Gemini 和本地文档 / 表格，围绕“${object}”。`,
    `输入：只放和“${object}”直接相关的材料、来源和要确认的问题。`,
    `AI 帮你做：把这些材料整理成“${action}”的第一版，不补没有证据的结论。`,
    `产出：${action}。`,
    "边界：不采集隐私，不绕过平台限制，不使用未授权材料。",
    "过关：至少能指出 3 条来源或观察支持你的判断。"
  ];
}

function createReturnSummaryRow(label, value) {
  const row = document.createElement("section");
  row.className = "return-summary-row";
  const heading = document.createElement("b");
  heading.textContent = label;
  const text = document.createElement("p");
  text.textContent = value || "-";
  row.append(heading, text);
  return row;
}

function appendReturnSummaryButton() {
  const button = document.createElement("button");
  button.className = "return-summary-button";
  button.type = "button";
  button.textContent = "看回来总结";
  button.addEventListener("click", () => {
    activeCompleteEvidenceStep = 0;
    renderRouteBoardState(LITTLE_WALKER_STEP_LIMIT);
    renderStageDialogue();
  });
  stageDialogue.append(button);
}

function createReturnReceiptBlock() {
  const panel = document.createElement("div");
  panel.className = "return-receipt-panel";

  const title = document.createElement("span");
  title.className = "return-receipt-title";
  title.textContent = "做完后带结果回来";

  const intro = document.createElement("p");
  intro.textContent = "今晚动作做完后，回来告诉小人 3 件事：";

  const list = document.createElement("ol");
  ["你实际做了什么？", "卡在哪一步？", "对方/自己有什么反应？"].forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    list.append(item);
  });

  const button = document.createElement("button");
  button.className = "return-receipt-copy";
  button.type = "button";
  button.textContent = "复制回执模板";
  button.addEventListener("click", () => copyReturnReceiptTemplate(button));

  panel.append(title, intro, list, button);
  return panel;
}

function getReturnReceiptTemplate() {
  return [
    "我做了：",
    "[一句话]",
    "",
    "卡住了：",
    "[没有卡住 / 卡在这里]",
    "",
    "看到的反应：",
    "[对方怎么说 / 我自己发现什么]",
    "",
    "下一轮想让小人继续看：",
    "[继续 / 换方向 / 缩小]"
  ].join("\n");
}

async function copyReturnReceiptTemplate(button) {
  const template = getReturnReceiptTemplate();
  const copied = await copyTextToClipboard(template);
  button.textContent = copied ? "已复制" : "模板在这里";
  window.setTimeout(() => {
    if (button.isConnected) button.textContent = "复制回执模板";
  }, 1500);
}

async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to a temporary textarea below.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}

function getActivePathStep(biteIndex) {
  if (biteIndex <= 1) return 1;
  if (biteIndex <= 3) return 2;
  return 3;
}

function getDonePathStep(biteIndex) {
  if (getFrictionBites().length === 0) return 0;
  if (biteIndex >= getFrictionBites().length) return 3;
  if (biteIndex >= 3) return 2;
  if (biteIndex >= 1) return 1;
  return 0;
}

function renderClarityCard() {
  if (!clarityCard) return;
  const gate = simulation?.clarityGate || {};
  const status = gate.status || "ready";
  const copy = getVisibleClarityCopy(gate);
  clarityCard.innerHTML = "";
  clarityCard.dataset.status = status;

  const label = document.createElement("span");
  label.textContent = getDoorwayReaction(gate).label;

  const title = document.createElement("strong");
  title.textContent = copy.title;

  const summary = document.createElement("p");
  summary.textContent = copy.body;

  const nextList = document.createElement("ul");
  nextList.className = "clarity-next-list";

  getClarityPreviewRows(gate).forEach(([headingText, bodyText]) => {
    const item = document.createElement("li");
    const heading = document.createElement("b");
    heading.textContent = headingText;
    const body = document.createElement("p");
    body.textContent = bodyText;
    item.append(heading, body);
    nextList.append(item);
  });

  clarityCard.append(label, title, summary, nextList);
}

function getVisibleClarityCopy(gate = {}) {
  const status = gate.status || "ready";
  const reaction = getDoorwayReaction(gate);

  if (status === "needs_definition") {
    return {
      title: reaction.title,
      body: reaction.body
    };
  }

  if (status === "blocked" || status === "boundary_review" || status === "reality_review" || status === "scope_review" || status === "usable" || status === "ready") {
    return {
      title: reaction.title,
      body: reaction.body
    };
  }

  if (status === "empty") {
    return {
      title: "先丢一个小产品想法进来",
      body: "适合 AI 工具、内容账号、开源项目和独立开发小产品。"
    };
  }

  return {
    title: "让小人先试走",
    body: getReadyVisibleText()
  };
}

function getClarityPreviewRows(gate = {}) {
  const status = gate.status || "ready";
  const reaction = getDoorwayReaction(gate);

  if (status === "empty") {
    return [
      ["为什么还没开始", "还没有东西可判断。"],
      ["现在该做什么", "先写一句小产品、AI 工具、内容账号或开源项目想法。"]
    ];
  }

  if (status === "blocked" || status === "boundary_review" || status === "reality_review" || status === "scope_review" || status === "needs_definition" || status === "usable" || status === "ready") {
    return reaction.previewRows;
  }

  return reaction.previewRows;
}

function getDefinitionQuestionText(gate = {}) {
  return Array.isArray(gate.nextQuestions) && gate.nextQuestions[0]
    ? gate.nextQuestions[0]
    : "先说一个方向、类目或物件。";
}

function getReadyVisibleText() {
  return getDoorwayReaction({ status: "ready" }).body;
}

function getUsableVisibleText() {
  return getDoorwayReaction({ status: "usable" }).body;
}

function getBoundaryReviewVisibleText(gate = {}) {
  return getDoorwayReaction({ ...gate, status: gate.status || "boundary_review" }).body;
}

function getRealityReviewVisibleText(gate = {}) {
  return getDoorwayReaction({ ...gate, status: "reality_review" }).body;
}

function getRealityReviewDetailText(gate = {}) {
  return getDoorwayReaction({ ...gate, status: "reality_review" }).detail;
}

function getRealityRewriteOptions(gate = {}) {
  return getDoorwayReaction({ ...gate, status: "reality_review" }).options;
}

function getScopeReviewVisibleText(gate = {}) {
  return getDoorwayReaction({ ...gate, status: "scope_review" }).body;
}

function getScopeReviewDetailText(gate = {}) {
  return getDoorwayReaction({ ...gate, status: "scope_review" }).detail;
}

function getScopeRewriteOptions(gate = {}) {
  return getDoorwayReaction({ ...gate, status: "scope_review" }).options;
}

function getBlockedVisibleText(gate = {}) {
  return getDoorwayReaction({ ...gate, status: "blocked" }).body;
}

function renderFrictionLibraryCard(activeIndex = 0) {
  if (!frictionLibraryCard || !frictionTrack) return;

  frictionTrack.innerHTML = "";
  const cardTitle = frictionLibraryCard.querySelector("span");
  if (cardTitle) {
    cardTitle.textContent = isEmptyInputMode()
      ? "等待输入"
      : isPreflightStopMode()
      ? getDoorwayReaction().label
      : isDefinitionDiagnosisMode()
        ? getDoorwayReaction().label
        : "替身试走路线";
  }

  if (isEmptyInputMode()) {
    const item = document.createElement("li");

    const marker = document.createElement("span");
    marker.className = "friction-index";
    marker.textContent = "+";

    const content = document.createElement("div");
    const label = document.createElement("strong");
    label.textContent = "先输入想法";
    const role = document.createElement("small");
    role.textContent = "输入后再判断";
    content.append(label, role);

    item.append(marker, content);
    frictionTrack.append(item);
    return;
  }

  if (isDefinitionDiagnosisMode()) {
    const item = document.createElement("li");
    item.classList.toggle("is-active", activeIndex <= 1);
    item.classList.toggle("is-done", activeIndex > 1);

    const marker = document.createElement("span");
    marker.className = "friction-index";
    marker.textContent = "?";

    const content = document.createElement("div");
    const label = document.createElement("strong");
    label.textContent = getDoorwayReaction().label;
    const role = document.createElement("small");
    role.textContent = getDoorwayReaction().body;
    content.append(label, role);

    item.append(marker, content);
    frictionTrack.append(item);
    return;
  }

  const selectedIds = getSelectedFrictionIds();

  if (selectedIds.length === 0) {
    const item = document.createElement("li");
    const marker = document.createElement("span");
    marker.className = "friction-index";
    marker.textContent = isBlockedMode() ? "!" : isRealityReviewMode() ? "x" : isScopeReviewMode() ? ">" : "?";

    const content = document.createElement("div");
    const label = document.createElement("strong");
    label.textContent = getDoorwayReaction().label;
    const role = document.createElement("small");
    role.textContent = getDoorwayReaction().action;
    content.append(label, role);

    item.append(marker, content);
    frictionTrack.append(item);
    return;
  }

  selectedIds.forEach((frictionId, index) => {
    const definition = getFrictionDefinition(frictionId);
    const bite = getFrictionBites()[index];
    const item = document.createElement("li");
    item.classList.toggle("is-active", activeIndex === index + 1);
    item.classList.toggle("is-done", activeIndex > index + 1);

    const marker = document.createElement("span");
    marker.className = "friction-index";
    marker.textContent = String(index + 1);

    const content = document.createElement("div");
    const label = document.createElement("strong");
    label.textContent = bite?.stepTitle || definition?.label || bite?.title || frictionId;
    const role = document.createElement("small");
    role.textContent = definition?.role || bite?.lens || "摩擦观察者";
    content.append(label, role);

    item.append(marker, content);
    frictionTrack.append(item);
  });
}

function getSelectedFrictionIds() {
  if (isEmptyInputMode()) {
    return [];
  }

  if (isDefinitionDiagnosisMode()) {
    return getFrictionBites().map((bite) => bite.frictionId || bite.id);
  }

  if (Array.isArray(simulation?.selectedFrictionIds) && simulation.selectedFrictionIds.length > 0) {
    return simulation.selectedFrictionIds;
  }

  return getFrictionBites().map((bite) => bite.frictionId || bite.id);
}

function getFrictionDefinition(frictionId) {
  return window.FRICTION_LIBRARY?.[frictionId] || null;
}

function isDefinitionDiagnosisMode() {
  return getClarityStatus() === "needs_definition";
}

function isEmptyInputMode() {
  return getClarityStatus() === "empty";
}

function getClarityStatus() {
  return simulation?.clarityGate?.status || "ready";
}

function isBoundaryReviewMode() {
  return getClarityStatus() === "boundary_review";
}

function isRealityReviewMode() {
  return getClarityStatus() === "reality_review";
}

function isScopeReviewMode() {
  return getClarityStatus() === "scope_review";
}

function isBlockedMode() {
  return getClarityStatus() === "blocked";
}

function isPreflightStopMode() {
  return isBlockedMode() || isBoundaryReviewMode() || isRealityReviewMode() || isScopeReviewMode();
}

function isHardLocalDoorwayStopMode() {
  return isBlockedMode() || isBoundaryReviewMode() || isRealityReviewMode();
}

function renderBiteCard(bite, biteIndex = 0) {
  if (!biteCard) return;
  biteCard.innerHTML = "";
  const substituteStep = bite && !isDefinitionDiagnosisMode()
    ? getSubstituteStepView(bite, biteIndex)
    : null;

  const label = document.createElement("span");
  label.textContent = substituteStep
    ? formatStepMeta(substituteStep, bite)
    : bite
    ? formatBiteMeta(bite, biteIndex)
    : isBlockedMode()
      ? getDoorwayReaction().label
    : isBoundaryReviewMode()
      ? getDoorwayReaction().label
    : isRealityReviewMode()
      ? getDoorwayReaction().label
    : isScopeReviewMode()
      ? getDoorwayReaction().label
    : isDefinitionDiagnosisMode()
      ? getDoorwayReaction().label
      : getDoorwayReaction().label;

  const title = document.createElement("strong");
  title.textContent = substituteStep
    ? substituteStep.stepTitle
    : bite
    ? isDefinitionDiagnosisMode()
      ? getDoorwayReaction().title
      : formatVisibleBiteTitle(bite.title)
    : isEmptyInputMode()
      ? "先丢一个小产品想法进来"
    : isBlockedMode()
      ? getDoorwayReaction().title
    : isBoundaryReviewMode()
      ? getDoorwayReaction().title
    : isRealityReviewMode()
      ? getDoorwayReaction().title
    : isScopeReviewMode()
      ? getDoorwayReaction().title
      : "等待开始";

  if (substituteStep) {
    biteCard.append(label, title, renderSubstituteStepDetails(substituteStep));
    return;
  }

  const description = document.createElement("p");
  description.textContent = bite
    ? bite.plainTake || `${bite.friction} 变形：${bite.mutation}`
    : isEmptyInputMode()
      ? "可以很短，像“我想做一个帮独立开发者拆 MVP 的 AI 工具”。"
    : isBlockedMode()
      ? getPreflightStopText()
    : isBoundaryReviewMode()
      ? getPreflightStopText()
    : isRealityReviewMode()
      ? getPreflightStopText()
    : isScopeReviewMode()
      ? getPreflightStopText()
      : isDefinitionDiagnosisMode()
        ? getDoorwayReaction().body
          : "我们先不判断这个想法好不好。小人会替你先摔一跤，看第一版哪里太重。";

  biteCard.append(label, title, description);
}

function getSubstituteStepView(bite, biteIndex = 0) {
  const definition = getFrictionDefinition(bite.frictionId || bite.id);
  const stepNumber = bite.stepNumber || biteIndex || 1;
  const frictionType = bite.frictionType || definition?.label || bite.lens || "现实反馈";
  const routeChange = bite.routeChange || {
    from: stepNumber === 1 ? "原始想法" : `第 ${stepNumber - 1} 步后的路线`,
    to: bite.branch || bite.mutation || "更小、更可验证的路线",
    summary: bite.mutation || "路线被现实反馈压小。"
  };

  const view = {
    stepNumber,
    stepTitle: bite.stepTitle || formatVisibleBiteTitle(bite.title || `第 ${stepNumber} 步：小人试走`),
    frictionType,
    currentSurvivingRoute: bite.currentSurvivingRoute || (stepNumber === 1 ? "原始想法" : `第 ${stepNumber - 1} 步后留下的路线`),
    agentAttempt: bite.agentAttempt || bite.plainTake || bite.bubble || "小人尝试把想法往前推进一步。",
    realityFeedback: bite.realityFeedback || bite.friction || bite.plainTake || "现实反馈还不清楚。",
    burden: bite.burden || { time: "中", money: "低", mental: "中", trust: "低", skill: "中" },
    routeChange,
    verdict: bite.verdict || "mutate",
    nextMove: bite.nextMove || bite.branch || "先做下一步最小动作。"
  };
  view.purpose = bite.stepPurpose || getStepPurposeText(view);

  return {
    ...view,
    sceneLine: bite.sceneLine || buildStepSceneLine(view)
  };
}

function renderSubstituteStepDetails(step) {
  const details = document.createElement("div");
  details.className = "substitute-step";

  const sceneLine = document.createElement("div");
  sceneLine.className = "scene-line";
  const sceneLabel = document.createElement("b");
  sceneLabel.textContent = "本轮发生了什么";
  const sceneText = document.createElement("p");
  sceneText.textContent = step.sceneLine;
  sceneLine.append(sceneLabel, sceneText);
  details.append(sceneLine);

  const purposeLine = document.createElement("div");
  purposeLine.className = "scene-line step-purpose-line";
  const purposeLabel = document.createElement("b");
  purposeLabel.textContent = "这一轮的目的";
  const purposeText = document.createElement("p");
  purposeText.textContent = step.purpose || getStepPurposeText(step);
  purposeLine.append(purposeLabel, purposeText);
  details.append(purposeLine);

  [
    ["当前幸存路线", step.currentSurvivingRoute],
    ["现实反馈", step.realityFeedback],
    ["这一段消耗", renderBurdenBadges(step.burden)],
    ["路线变化", renderRouteChange(step.routeChange)],
    ["本轮判断", renderVerdictBadge(step.verdict)],
    [getStepContinuationLabel(step.verdict), getStepContinuationText(step)]
  ].forEach(([labelText, value]) => {
    const row = document.createElement("div");
    row.className = "substitute-row";
    const label = document.createElement("b");
    label.textContent = labelText;
    row.append(label);

    if (value instanceof HTMLElement) {
      row.append(value);
    } else {
      const text = document.createElement("p");
      text.textContent = value;
      row.append(text);
    }

    details.append(row);
  });

  return details;
}

function buildStepSceneLine(step) {
  const currentRoute = stripEndPunctuation(step.currentSurvivingRoute || step.routeChange?.from || "当前版本");
  const nextRoute = stripEndPunctuation(step.routeChange?.to || step.nextMove || "更小的幸存版本");
  const action = formatSceneAction(step.agentAttempt);

  return `小人带着「${currentRoute}」${action}，${getSceneResultText(step.verdict, nextRoute)}`;
}

function getStepPurposeText(step = {}) {
  const purposeByStep = {
    1: "不是开始做完整产品，而是先确认这个想法有没有一个别人听得懂的入口。",
    2: "把入口拆成一次能跑通的动作，避免一上来做完整系统。",
    3: "估一遍这条路会先消耗什么，避免把自己拖进扛不住的开发量。",
    4: "看看用户现在是不是已经用别的东西凑合，避免做一个没人迁移的新工具。",
    5: "确认新鲜感过去后，这个版本有没有留下来的理由。"
  };

  return purposeByStep[step.stepNumber] || "先看这一小段为什么要走，再决定要不要继续。";
}

function formatSceneAction(attempt) {
  const action = stripEndPunctuation(attempt)
    .replace(/^小人尝试/, "")
    .replace(/^小人会/, "")
    .trim();

  if (!action) return "去推进下一小步";
  if (action.startsWith("去")) return action;
  return `去试着${action}`;
}

function getSceneResultText(verdict, nextRoute) {
  if (verdict === "branch") {
    return `现实在旁边岔出「${nextRoute}」这条更轻的路。`;
  }

  if (verdict === "stop") {
    return `现实让原路线停下，留下「${nextRoute}」这个幸存版本。`;
  }

  if (verdict === "continue") {
    return `现实让它暂时保住「${nextRoute}」这条路。`;
  }

  return `现实把它压成「${nextRoute}」。`;
}

function getStepContinuationLabel(verdict) {
  if (verdict === "stop") return "原路线在这里停止";
  if (verdict === "branch") return "旁边出现一条更轻的路";
  return "带着这个版本继续走";
}

function getStepContinuationText(step) {
  const nextMove = stripEndPunctuation(step.nextMove || step.routeChange?.to || "");
  const suffix = nextMove ? `：${nextMove}。` : "。";

  if (step.verdict === "stop") {
    return `小人转向更轻的幸存版本${suffix}`;
  }

  if (step.verdict === "branch") {
    return `小人先沿这条分叉继续试${suffix}`;
  }

  if (step.verdict === "mutate") {
    return `小人带着变形后的版本继续走${suffix}`;
  }

  return `小人带着当前版本继续走${suffix}`;
}

function stripEndPunctuation(value) {
  return String(value || "").replace(/[。！？.!?]+$/u, "").trim();
}

function renderBurdenBadges(burden = {}) {
  const wrap = document.createElement("div");
  wrap.className = "burden-row";

  [
    ["时间", burden.time],
    ["钱", burden.money],
    ["心力", burden.mental],
    ["信任", burden.trust],
    ["技能", burden.skill]
  ].forEach(([label, value]) => {
    if (!value) return;
    const badge = document.createElement("span");
    badge.textContent = `${label} ${value}`;
    wrap.append(badge);
  });

  return wrap;
}

function renderRouteChange(routeChange = {}) {
  const wrap = document.createElement("div");
  wrap.className = "route-change";

  const flow = document.createElement("p");
  flow.textContent = `${routeChange.from || "原始想法"} -> ${routeChange.to || "更小路线"}`;
  const summary = document.createElement("small");
  summary.textContent = routeChange.summary || "路线被现实反馈压小。";
  wrap.append(flow, summary);

  return wrap;
}

function renderVerdictBadge(verdict) {
  const badge = document.createElement("span");
  badge.className = `route-verdict route-verdict-${verdict || "mutate"}`;
  badge.textContent = getRouteVerdictLabel(verdict);
  return badge;
}

function renderResultCard(isReady) {
  renderWalkSummaryCard(isReady);
  if (!resultCard) return;
  resultCard.hidden = false;
  resultCard.innerHTML = "";
  resultCard.classList.toggle("is-ready", Boolean(isReady));
  renderObserverCheckCard(isReady);

  if (!isReady) {
    const waiting = document.createElement("span");
    waiting.textContent = isPreflightStopMode()
      ? getDoorwayReaction().label
      : isEmptyInputMode()
        ? "等待输入"
      : isDefinitionDiagnosisMode()
        ? getDoorwayReaction().label
        : "等待替身预演完成";
    const title = document.createElement("strong");
    title.textContent = isEmptyInputMode() ? "先输入，再判断" : "小人还没试走完";
    resultCard.append(waiting, title);
    return;
  }

  if (isPreflightStopMode()) {
    renderPreflightStopResult();
    return;
  }

  if (isDefinitionDiagnosisMode()) {
    renderDefinitionDiagnosisResult();
    return;
  }

  const verdict = simulation.verdict || {};
  const survivorSummary = renderSurvivorSummary(verdict);
  const routeShift = renderResultRows([["原路线发生了什么", verdict.biggestBlocker]]);
  const abandonedRoutes = renderRouteRecordSection("小人放下的重路线", verdict.abandonedRoutes, "reason");
  const branchOptions = renderRouteRecordSection(
    "小人看见的旁路",
    verdict.branchOptions,
    "whyAlive",
    "旁路先收着，不用现在全做。当前只试最轻那条。"
  );
  const routeEvolution = renderRouteEvolution();
  const burdenSummary = renderBurdenSummary();
  const notNowList = renderResultRows([["先别做", verdict.notNow]]);

  resultCard.append(survivorSummary);
  if (routeShift) resultCard.append(routeShift);
  if (burdenSummary) resultCard.append(burdenSummary);
  if (abandonedRoutes) resultCard.append(abandonedRoutes);
  if (branchOptions) resultCard.append(branchOptions);
  if (routeEvolution) resultCard.append(routeEvolution);
  if (notNowList) resultCard.append(notNowList);
}

function renderWalkSummaryCard(isReady) {
  if (!walkSummaryCard) return;

  walkSummaryCard.hidden = false;
  walkSummaryCard.innerHTML = "";
  walkSummaryCard.classList.toggle("is-ready", Boolean(isReady));

  const header = document.createElement("div");
  header.className = "walk-summary-header";
  const eyebrow = document.createElement("span");
  eyebrow.textContent = isReady ? "小人回执" : "试走链路";
  const title = document.createElement("strong");
  title.textContent = isReady
    ? isPreflightStopMode() || isDefinitionDiagnosisMode()
      ? "小人先停在门口"
      : "小人替你走完一圈了"
    : "小人会这样替你走一遍";
  header.append(eyebrow, title);
  walkSummaryCard.append(header);

  walkSummaryCard.append(renderWalkChain());

  if (!isReady) {
    const note = document.createElement("p");
    note.className = "walk-summary-note";
    note.textContent = isEmptyInputMode()
      ? "先丢一句小产品想法。结果出来后，这里会先显示小人回来第一句话、3 个坑和今晚动作卡。"
      : "开始后先看舞台和小人说话。试走完成后，这里会收敛成今晚能做的一步。";
    walkSummaryCard.append(note);
    return;
  }

  if (isPreflightStopMode() || isDefinitionDiagnosisMode()) {
    renderWalkDoorwayStopSummary();
    return;
  }

  const verdict = simulation.verdict || {};
  const comeback = document.createElement("p");
  comeback.className = "walk-comeback-line";
  comeback.textContent = `小人回来说：${getFinalSurvivingRoute() || cleanResultText(verdict.strongestBranch) || "这条路还能活，但要先缩小。"}`
  walkSummaryCard.append(comeback);

  renderWalkStumbleList();
  renderWalkActionCard(verdict);
}

function renderWalkChain() {
  const chain = document.createElement("ol");
  chain.className = "walk-chain";
  ["小人出发", "撞到阻力", "路线变形", "带回今晚动作"].forEach((label) => {
    const item = document.createElement("li");
    item.textContent = label;
    chain.append(item);
  });
  return chain;
}

function renderWalkDoorwayStopSummary() {
  const reaction = getDoorwayReaction();
  const comeback = document.createElement("p");
  comeback.className = "walk-comeback-line";
  comeback.textContent = `小人回来说：${reaction.body || reaction.title || "这句现在还不能直接试走。"}`
  const action = document.createElement("div");
  action.className = "walk-action-panel";
  [
    ["打开", "当前输入框。"],
    ["输入", reaction.action || reaction.options?.[0]?.body || "补一句更具体的对象、场景或今晚能做的小入口。"],
    ["产出", reaction.title || "一条能让小人低成本试走的入口。"],
    ["过关标准", "小人不用猜，就能判断这条路今晚能不能先走一小段。"]
  ].forEach(([label, value]) => action.append(createWalkSummaryLine(label, value)));
  walkSummaryCard.append(comeback, action);
}

function renderWalkStumbleList() {
  const bites = getFrictionBites().slice(0, 3);
  if (bites.length === 0) return;

  const list = document.createElement("div");
  list.className = "walk-stumble-list";
  bites.forEach((bite, index) => {
    const step = getSubstituteStepView(bite, index + 1);
    const item = document.createElement("section");
    item.className = "walk-stumble-item";
    const title = document.createElement("strong");
    title.textContent = `第 ${index + 1} 个坑：${step.stepTitle}`;
    item.append(
      title,
      createWalkSummaryLine("撞到", step.realityFeedback || step.sceneLine || "现实反馈不够清楚。"),
      createWalkSummaryLine("路线变成", step.routeChange?.to || step.nextMove || "更小的路线。")
    );
    list.append(item);
  });
  walkSummaryCard.append(list);
}

function renderWalkActionCard(verdict = {}) {
  const action = getVisualTonightActionCard(verdict);
  const panel = document.createElement("div");
  panel.className = "walk-action-panel";
  const title = document.createElement("strong");
  title.textContent = "今晚动作卡";
  panel.append(
    title,
    createWalkSummaryLine("打开", action.open),
    createWalkSummaryLine("输入", action.input),
    createWalkSummaryLine("产出", action.output),
    createWalkSummaryLine("过关标准", action.passCriteria)
  );
  const followup = document.createElement("p");
  followup.className = "walk-action-followup";
  followup.textContent = "做完这一步后，把结果带回来，小人再替你走下一圈。";
  panel.append(followup);
  walkSummaryCard.append(panel);
}

function getVisualTonightActionCard(verdict = {}) {
  const input = ideaInput?.value.trim() || simulation?.idea?.input || simulation?.idea?.pitch || "当前这个想法";
  if (isCompetitorAnalysisIdea()) {
    const summary = getCompetitorAnalysisReturnSummary();
    return {
      open: "浏览器 + 本地表格 + ChatGPT / Gemini。",
      input: `公开资料：${getCompetitorObjectLabel()} 的公开页面、截图、官方说明或公开评价。`,
      output: summary.tonightAction,
      passCriteria: getCompetitorPassCriteriaText()
    };
  }
  const output = cleanResultText(verdict.smallestValidation || getFinalSurvivingRoute() || "先做一个最小试走动作。");

  return {
    open: inferVisualActionTool(input, output),
    input: `这条原始想法：${input}`,
    output,
    passCriteria: inferVisualPassCriteria(input, output)
  };
}

function inferVisualActionTool(input, output) {
  const text = `${input}\n${output}`;
  if (/短视频|账号|视频|剪映|CapCut|拍|录屏/.test(text)) return "手机备忘录 + 相机 + 剪映 / CapCut。";
  if (/创作者|选题|标题|表格|判断表/.test(text)) return "ChatGPT + 本地表格 + 一个固定 prompt。";
  if (/README|开源/.test(text)) return "本地 README + ChatGPT / Codex。";
  return "ChatGPT / Codex + 一个本地文档。";
}

function inferVisualPassCriteria(input, output) {
  const text = `${input}\n${output}`;
  if (isCompetitorAnalysisIdea()) return getCompetitorPassCriteriaText();
  if (/短视频|账号|视频|拍|录屏/.test(text)) return "自己重看前 3 秒知道为什么要继续看，并能发给 1 个目标观众问懂不懂。";
  if (/创作者|选题|标题|判断表/.test(text)) return "看完能立刻改 1 个标题或放弃 1 个选题，而不是只得到空结论。";
  return "看完不用再问“今晚到底干什么”，10 分钟内能开始发第一条消息或做第一个假 demo。";
}

function getCompetitorPassCriteriaText() {
  if (isShortVideoCompetitorIdea()) return "至少 3 条公开视频或用户提供样本支持判断；不把未观察到的账号策略写成结论。";
  return "至少有 3 条公开证据支持判断；不对没有证据的内部规则下结论。";
}

function createWalkSummaryLine(label, value) {
  const row = document.createElement("p");
  const key = document.createElement("b");
  key.textContent = label;
  const text = document.createElement("span");
  text.textContent = value || "-";
  row.append(key, text);
  return row;
}

function renderSurvivorSummary(verdict = {}) {
  const section = document.createElement("div");
  section.className = "result-survivor";

  [
    ["小人带回来的幸存版本", getFinalSurvivingRoute() || cleanResultText(verdict.strongestBranch) || "留下一个更小、更能试走的版本。", true],
    ["为什么它活下来", verdict.survivalReason],
    ["现在最小试走动作", cleanResultText(verdict.smallestValidation || "先做一次最小现实验证。")]
  ].forEach(([label, value, isPrimary]) => {
    if (!value) return;
    const row = document.createElement("div");
    row.className = isPrimary ? "result-survivor-row is-primary" : "result-survivor-row";
    const heading = document.createElement("b");
    heading.textContent = label;
    const text = document.createElement("p");
    text.textContent = value;
    row.append(heading, text);
    section.append(row);
  });

  return section;
}

function renderRouteRecordSection(titleText, routes = [], bodyKey = "reason", introText = "") {
  if (!Array.isArray(routes) || routes.length === 0) return null;

  const section = document.createElement("div");
  section.className = "route-record-section";
  const title = document.createElement("b");
  title.textContent = titleText;
  section.append(title);

  if (introText) {
    const intro = document.createElement("p");
    intro.className = "route-record-note";
    intro.textContent = introText;
    section.append(intro);
  }

  const list = document.createElement("ul");

  routes.slice(0, 3).forEach((route) => {
    const item = document.createElement("li");
    const heading = document.createElement("span");
    heading.textContent = route.title || "一条旁路";
    const body = document.createElement("p");
    body.textContent = route[bodyKey] || route.reason || route.whyAlive || "";
    item.append(heading, body);
    list.append(item);
  });

  section.append(list);
  return section;
}

function getFinalSurvivingRoute() {
  const bites = getFrictionBites();
  if (bites.length === 0) return "";

  const finalStep = getSubstituteStepView(bites[bites.length - 1], bites.length);
  return stripEndPunctuation(finalStep.routeChange?.to || finalStep.currentSurvivingRoute || finalStep.nextMove || "");
}

function renderResultRows(rows = []) {
  const list = document.createElement("ul");
  list.className = "result-list";

  rows.forEach(([label, value]) => {
    if (!value) return;
    const item = document.createElement("li");
    const heading = document.createElement("b");
    heading.textContent = label;
    const text = document.createElement("p");
    text.textContent = cleanResultText(value);
    item.append(heading, text);
    list.append(item);
  });

  return list.children.length > 0 ? list : null;
}

function renderRouteEvolution() {
  const bites = getFrictionBites();
  if (bites.length === 0) return null;

  const section = document.createElement("div");
  section.className = "route-evolution";
  const title = document.createElement("b");
  title.textContent = "完整试走轨迹";
  const list = document.createElement("ol");

  const original = document.createElement("li");
  const originalLabel = document.createElement("span");
  originalLabel.textContent = "原始想法";
  const originalText = document.createElement("p");
  originalText.textContent = simulation.path?.start || simulation.idea?.input || simulation.idea?.pitch || simulation.idea?.name || "原始想法";
  original.append(originalLabel, originalText);
  list.append(original);

  bites.forEach((bite, index) => {
    const step = getSubstituteStepView(bite, index + 1);
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = index === bites.length - 1 ? "最终幸存版本" : `第 ${index + 1} 步后`;
    const text = document.createElement("p");
    text.textContent = step.routeChange?.to || step.currentSurvivingRoute || step.nextMove;
    item.append(label, text);
    list.append(item);
  });

  section.append(title, list);
  return section;
}

function renderBurdenSummary() {
  const bites = getFrictionBites();
  if (bites.length === 0) return null;

  const summary = getBurdenSummary(bites);
  const section = document.createElement("div");
  section.className = "burden-summary";

  const title = document.createElement("b");
  title.textContent = "最重消耗";

  const chips = document.createElement("div");
  chips.className = "burden-row";
  summary.heaviestLabels.forEach((label) => {
    const chip = document.createElement("span");
    chip.textContent = label;
    chips.append(chip);
  });

  const judgmentLabel = document.createElement("b");
  judgmentLabel.textContent = "是否扛得住";
  const judgment = document.createElement("p");
  judgment.textContent = summary.judgment;

  section.append(title, chips, judgmentLabel, judgment);
  return section;
}

function getBurdenSummary(bites = []) {
  const labels = {
    time: "时间",
    money: "钱",
    mental: "心力",
    trust: "信任",
    skill: "技能",
    people: "人力"
  };
  const scores = { time: 0, money: 0, mental: 0, trust: 0, skill: 0, people: 0 };
  const highCounts = { time: 0, money: 0, mental: 0, trust: 0, skill: 0, people: 0 };
  const valueScores = { 低: 1, 中: 2, 高: 3 };

  bites.forEach((bite, index) => {
    const burden = getSubstituteStepView(bite, index + 1).burden || {};
    Object.keys(scores).forEach((key) => {
      const value = burden[key];
      const score = valueScores[value] || 0;
      scores[key] += score;
      if (value === "高") highCounts[key] += 1;
    });
  });

  const maxScore = Math.max(...Object.values(scores));
  const heaviestKeys = Object.keys(scores).filter((key) => scores[key] === maxScore && maxScore > 0);
  const highKeys = Object.keys(highCounts).filter((key) => highCounts[key] >= 2);
  const mainKeys = highKeys.length > 0 ? highKeys : heaviestKeys;

  return {
    heaviestLabels: mainKeys.map((key) => labels[key] || key),
    judgment: getBurdenJudgment(mainKeys, highCounts)
  };
}

function getBurdenJudgment(keys = [], highCounts = {}) {
  if (keys.includes("trust")) {
    return "小人试走后发现信任消耗最重，现在不适合硬做完整产品，先走更轻、更可撤回的分叉。";
  }

  if (keys.includes("money") || keys.includes("skill")) {
    return "小人试走后发现钱或技能消耗偏重，可以继续，但必须压小范围，先做最窄版本。";
  }

  if (keys.includes("mental") || keys.includes("people")) {
    return "小人试走后发现心力或人力消耗偏重，适合先用一个很小的动作试，不适合拉长战线。";
  }

  if (keys.includes("time")) {
    return "小人试走后发现时间消耗最明显，适合单人先试，但要把验证周期压短。";
  }

  return "小人试走后没有单项消耗爆掉，适合用最小动作先试一轮。";
}

function renderObserverCheckCard(isReady) {
  if (!observerCheckCard) return;

  observerCheckCard.innerHTML = "";
  observerCheckCard.hidden = !isReady;
  observerCheckCard.dataset.selected = "";

  if (!isReady) return;

  const label = document.createElement("span");
  label.textContent = "看完以后";

  const title = document.createElement("strong");
  title.textContent = getObserverCheckTitle();

  const list = document.createElement("ul");
  list.className = "observer-check-list";

  getObserverCheckRows().forEach(([headingText, bodyText]) => {
    const item = document.createElement("li");
    const heading = document.createElement("b");
    heading.textContent = headingText;
    const body = document.createElement("p");
    body.textContent = bodyText;
    item.append(heading, body);
    list.append(item);
  });

  const choiceLabel = document.createElement("span");
  choiceLabel.textContent = "你的判断";

  const choiceRow = document.createElement("div");
  choiceRow.className = "observer-choice-row";

  [
    ["clearer", "更清楚"],
    ["same", "没变化"],
    ["messier", "更乱了"]
  ].forEach(([value, text]) => {
    const button = document.createElement("button");
    button.className = "observer-choice";
    button.type = "button";
    button.dataset.value = value;
    button.textContent = text;
    choiceRow.append(button);
  });

  observerCheckCard.append(label, title, list, choiceLabel, choiceRow);
}

function getObserverCheckTitle() {
  if (isBlockedMode() || isBoundaryReviewMode() || isRealityReviewMode() || isScopeReviewMode() || isDefinitionDiagnosisMode()) {
    return getDoorwayReaction().title;
  }
  return "下一步够不够清楚";
}

function getObserverCheckRows() {
  const gate = simulation.clarityGate || {};
  const verdict = simulation.verdict || {};

  if (isBlockedMode()) {
    return getDoorwayReaction(gate).previewRows;
  }

  if (isBoundaryReviewMode()) {
    return getDoorwayReaction(gate).previewRows;
  }

  if (isRealityReviewMode()) {
    return getDoorwayReaction(gate).previewRows;
  }

  if (isScopeReviewMode()) {
    return getDoorwayReaction(gate).previewRows;
  }

  if (isDefinitionDiagnosisMode()) {
    const missing = Array.isArray(gate.missing) && gate.missing.length > 0
      ? gate.missing.join("、")
      : "方向、类目或物件";
    const nextQuestion = Array.isArray(gate.nextQuestions) && gate.nextQuestions[0]
      ? gate.nextQuestions[0]
      : verdict.smallestValidation || "先说一个方向、类目或物件。";

    return [
      ["小人缺什么", `还差：${missing}`],
      ["直接补一句", nextQuestion]
    ];
  }

  return [
    ["路线停/变在哪", cleanResultText(verdict.biggestBlocker || "先找出最大现实卡点。")],
    ["现在最小试走动作", cleanResultText(verdict.smallestValidation || "先做一次最小现实验证。")]
  ];
}

function getVisibleVerdictTitle() {
  return "替身预演完成";
}

function cleanResultText(value) {
  return String(value || "")
    .replace(/^最大卡点/, "")
    .replace(/^是/, "")
    .replace(/^最有生命力的分叉是/, "")
    .replace(/^更有生命力的分叉是/, "")
    .replace(/^最小验证动作是/, "")
    .replace(/^现在最该做的是/, "")
    .replace(/^：/, "")
    .replace(/^，/, "")
    .trim()
    .replace(/([。！？；，,.!?;])\1+$/u, "$1")
    .trim();
}

function renderDefinitionDiagnosisResult() {
  const gate = simulation.clarityGate || {};
  const verdict = simulation.verdict || {};
  const title = document.createElement("strong");
  title.textContent = getDoorwayReaction(gate).title;

  const list = document.createElement("ul");
  list.className = "result-list";

  const missing = Array.isArray(gate.missing) && gate.missing.length > 0
    ? gate.missing.join("、")
    : "还缺一个最低限度的方向、类目或物件。";
  const nextQuestion = Array.isArray(gate.nextQuestions) && gate.nextQuestions[0]
    ? gate.nextQuestions[0]
    : verdict.smallestValidation || "先说一个方向/类目/物件，再进入完整现实摩擦。";

  [
    ["小人缺什么", missing],
    ["为什么先停", "小人还不知道该往哪走，不急着分析。"],
    ["直接回一句", nextQuestion],
    ["补完再走", "补出一个具体对象或场景后，再让小人试走。"]
  ].forEach(([label, value]) => {
    const item = document.createElement("li");
    const heading = document.createElement("b");
    heading.textContent = label;
    const text = document.createElement("p");
    text.textContent = value;
    item.append(heading, text);
    list.append(item);
  });

  resultCard.append(title, list);
}

function renderPreflightStopResult() {
  const gate = simulation.clarityGate || {};
  const title = document.createElement("strong");
  title.textContent = getDoorwayReaction(gate).title;

  const list = document.createElement("ul");
  list.className = "result-list";

  const rows = isBlockedMode()
    ? [
        ["小人怎么说", getBlockedVisibleText(gate)],
        ["现在怎么办", getDoorwayReaction(gate).action]
      ]
    : isRealityReviewMode()
      ? [
          ["小人怎么说", getRealityReviewVisibleText(gate)],
          ["为什么停", getRealityReviewDetailText(gate)],
          ...getRealityRewriteOptions(gate).map((option) => [option.title, option.body]),
          ["先选哪条路", getDoorwayReaction(gate).action]
        ]
    : isScopeReviewMode()
      ? [
          ["小人怎么说", getScopeReviewVisibleText(gate)],
          ["为什么不出发", getScopeReviewDetailText(gate)],
          ...getScopeRewriteOptions(gate).map((option) => [option.title, option.body])
        ]
      : [
          ["小人怎么说", getBoundaryReviewVisibleText(gate)],
          ["现在怎么办", getDoorwayReaction(gate).action]
        ];

  rows.forEach(([label, value]) => {
    if (!value) return;
    const item = document.createElement("li");
    const heading = document.createElement("b");
    heading.textContent = label;
    const text = document.createElement("p");
    text.textContent = value;
    item.append(heading, text);
    list.append(item);
  });

  resultCard.append(title, list);
}

function getPreflightStopText() {
  const gate = simulation?.clarityGate || {};
  if (isBlockedMode()) {
    return getBlockedVisibleText(gate);
  }
  if (isRealityReviewMode()) {
    return getRealityReviewVisibleText(gate);
  }
  if (isScopeReviewMode()) {
    return getScopeReviewVisibleText(gate);
  }
  return getBoundaryReviewVisibleText(gate);
}

function formatVisibleBiteTitle(title) {
  return String(title || "当前步骤")
    .replace(/^第\s*(\d+)\s*口[：:]\s*/, "第 $1 步：")
    .replace(/^第\s*(\d+)\s*次[：:]\s*/, "第 $1 步：");
}

function formatStepMeta(step, bite) {
  const evidenceLabel = getEvidenceLabel(bite.evidenceStatus);
  return [step.frictionType, evidenceLabel, `${step.stepNumber}/${getFrictionBites().length}`].filter(Boolean).join(" · ");
}

function formatBiteMeta(bite, biteIndex) {
  const evidenceLabel = getEvidenceLabel(bite.evidenceStatus);
  return [bite.lens, evidenceLabel, `${biteIndex}/${getFrictionBites().length}`].filter(Boolean).join(" · ");
}

function getRouteVerdictLabel(verdict) {
  const labels = {
    continue: "继续",
    mutate: "变形后继续",
    branch: "出现分叉",
    stop: "原路线停止"
  };

  return labels[verdict] || "变形后继续";
}

function getEvidenceLabel(status) {
  const labels = {
    needs_check: "待查证",
    verified: "已查证"
  };

  return labels[status] || "";
}

function compactText(text, maxLength) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized;
}

function initializeAgentStates() {
  agentStates.clear();
  agentMemories.clear();
  recentStateUpdates.length = 0;

  simulation.agents.forEach((agent, index) => {
    agentMemories.set(agent.id, createAgentMemory(agent, index));
  });

  simulation.agents.forEach((agent, index) => {
    agentStates.set(agent.id, createInitialAgentState(agent, index));
  });

  renderStateFeed();
}

function createInitialAgentState(agent, index) {
  const activity = agent.activity || idleActivities[index % idleActivities.length];
  const target = projectToPlanetEdge(agent.x, agent.y);
  return {
    agentId: agent.id,
    background: randomFrom([agent.role, ...backgroundPool]),
    tempRole: randomFrom(tempRolePool),
    emotion: "neutral",
    action: activityToAction(activity),
    event: "ambient",
    bubble: "",
    target,
    signalDelta: {}
  };
}

function createAgentMemory(agent) {
  const temper = `${agent.role} ${agent.temper}`;
  const skepticalBias = /怀疑|警惕|成本|泼冷水|竞品/.test(temper) ? 18 : 0;
  const makerBias = /开发|设计|产品|维护|搜索/.test(temper) ? 12 : 0;

  return {
    attention: randomInt(34, 62),
    skepticism: clamp(randomInt(28, 54) + skepticalBias, 0, 100),
    makerEnergy: clamp(randomInt(24, 52) + makerBias, 0, 100),
    triggerCount: 0,
    lastEvents: [],
    eventCounts: {}
  };
}

function renderBaseAgents() {
  agentNodes.forEach((node) => {
    stopSpriteFrameLoop(node);
    window.clearTimeout(node.walkTimer);
    window.clearTimeout(node.bubbleTimer);
    node.remove();
  });
  agentNodes.clear();

  simulation.agents.forEach((agent, index) => {
    const spriteProfile = getAgentSpriteProfile(agent.id);
    const position = projectToPlanetEdge(agent.x, agent.y);
    const node = document.createElement("div");
    node.className = `agent look-${agent.look || "blank"}`;
    if (spriteProfile) {
      node.classList.add("has-demo-sprite");
      node.dataset.visualShell = spriteProfile.label;
      node.style.setProperty("--sprite-width", `${spriteProfile.width}px`);
      node.style.setProperty("--sprite-height", `${spriteProfile.height}px`);
      if (Number.isFinite(spriteProfile.walkLiftPx)) {
        node.style.setProperty("--sprite-walk-lift", `${spriteProfile.walkLiftPx}px`);
      }
      if (spriteProfile.walkTiltA) node.style.setProperty("--sprite-walk-tilt-a", spriteProfile.walkTiltA);
      if (spriteProfile.walkTiltB) node.style.setProperty("--sprite-walk-tilt-b", spriteProfile.walkTiltB);
      node.style.setProperty("--sprite-facing", "1");
    }
    node.dataset.agentId = agent.id;
    node.dataset.state = agent.state;
    node.dataset.intent = agent.activity || idleActivities[index % idleActivities.length];
    node.style.left = `${position.x}%`;
    node.style.top = `${position.y}%`;
    setAgentDepth(node, position.y);
    node.style.setProperty("--agent-color", agentColors[agent.color] || "#f4b24a");

    const sprite = document.createElement("div");
    sprite.className = "sprite";

    if (spriteProfile) {
      const spriteArt = document.createElement("img");
      spriteArt.className = "sprite-art";
      spriteArt.alt = "";
      spriteArt.decoding = "async";
      spriteArt.src = spriteProfile.poses.idle;
      sprite.dataset.pose = "idle";
      sprite.append(spriteArt);
    } else {
      const face = document.createElement("div");
      face.className = "sprite-face";

      const leftArm = document.createElement("div");
      leftArm.className = "sprite-arm left";

      const rightArm = document.createElement("div");
      rightArm.className = "sprite-arm right";

      const phone = document.createElement("div");
      phone.className = "sprite-phone";

      sprite.append(face, leftArm, rightArm, phone);
    }

    const nameTag = document.createElement("div");
    nameTag.className = "name-tag";
    nameTag.textContent = agent.name;

    const identityTag = document.createElement("div");
    identityTag.className = "identity-tag";

    const activityTag = document.createElement("div");
    activityTag.className = "activity-tag";

    node.append(sprite, nameTag, identityTag, activityTag);
    setAgentBadges(node, agentStates.get(agent.id));
    stage.append(node);
    agentNodes.set(agent.id, node);
  });
}

function renderSignals(nextSignals) {
  signals.innerHTML = "";

  Object.entries(stateLabels).forEach(([key, label]) => {
    const rawValue = nextSignals[key] ?? 0;
    const displayValue = key === "branchCount" ? rawValue : `${rawValue}%`;
    const meterValue = key === "branchCount" ? Math.min(rawValue * 20, 100) : rawValue;

    const item = document.createElement("div");
    item.className = "signal";

    const row = document.createElement("div");
    row.className = "signal-row";
    row.innerHTML = `<span>${label}</span><strong>${displayValue}</strong>`;

    const meter = document.createElement("div");
    meter.className = "meter";

    const bar = document.createElement("span");
    bar.style.width = `${meterValue}%`;
    bar.style.background = barColors[key];

    meter.append(bar);
    item.append(row, meter);
    signals.append(item);
  });

  if (branchBoard) branchBoard.textContent = `分支：${nextSignals.branchCount ?? 0}`;
}

function renderWaitingState() {
  currentRound = 0;
  playableStepCountSnapshot = 0;
  sandboxStarted = false;
  sandboxCompleted = false;
  biteInProgress = false;
  directBuildActive = false;
  setDirectBuildDisplayMode(false);
  clearStateUpdates();
  roundLabel.textContent = "待投放";
  roundTitle.textContent = isEmptyInputMode()
    ? "等待你的想法"
    : isBlockedMode() || isBoundaryReviewMode() || isRealityReviewMode() || isScopeReviewMode() || isDefinitionDiagnosisMode()
      ? getDoorwayReaction().title
      : "小人可以先替你走一圈";
  eventLog.innerHTML = "";
  renderPathCard(0);
  renderFrictionLibraryCard(0);
  renderBiteCard();
  renderResultCard(false);
  renderStageDialogue();
  updateDeepSeekShadowReadiness();
  appendLog(isBlockedMode()
    ? getDoorwayReaction().body
    : isEmptyInputMode()
      ? "先丢一个小产品想法进来。"
    : isBoundaryReviewMode()
      ? getDoorwayReaction().body
    : isRealityReviewMode()
      ? getDoorwayReaction().body
    : isScopeReviewMode()
      ? getDoorwayReaction().body
      : isDefinitionDiagnosisMode()
        ? getDoorwayReaction().body
        : "现实摩擦已经待命。先看它会被哪几件事卡住。");
  roastButton.disabled = isEmptyInputMode();
  updatePrimaryActionLabel();
  nextRoundButton.disabled = true;
  nextRoundButton.textContent = "继续";
  if (caseSelect) caseSelect.disabled = false;
  if (seedInput) seedInput.disabled = false;
  if (randomSeedButton) randomSeedButton.disabled = false;
}

function renderDoorwayStoppedState(options = {}) {
  sandboxStarted = false;
  sandboxCompleted = false;
  biteInProgress = false;
  directBuildActive = false;
  setDirectBuildDisplayMode(false);
  renderPathCard(0);
  renderFrictionLibraryCard(0);
  renderBiteCard();
  renderResultCard(true);
  eventLog.innerHTML = "";
  roundLabel.textContent = getDoorwayReaction().label;
  roundTitle.textContent = getDoorwayReaction().title;
  appendLog(options.logText || (isPreflightStopMode() ? getPreflightStopText() : getDoorwayReaction().body));
  renderStageDialogue();
  updateDeepSeekShadowReadiness();
  captureDoorwayFeedbackHold();
  roastButton.disabled = true;
  nextRoundButton.disabled = true;
  nextRoundButton.textContent = options.buttonText || "已停止";
  if (caseSelect) caseSelect.disabled = false;
  if (seedInput) seedInput.disabled = false;
  if (randomSeedButton) randomSeedButton.disabled = false;
}

function renderDirectBuildState() {
  sandboxStarted = false;
  sandboxCompleted = false;
  biteInProgress = false;
  directBuildActive = true;
  setDirectBuildDisplayMode(true);
  activeCompleteEvidenceStep = 0;
  clearRpgStoryboardStep();
  renderRouteBoardState(0);
  renderPathCard(0);
  renderFrictionLibraryCard(0);
  renderBiteCard();
  renderDirectBuildSideCards();
  eventLog.innerHTML = "";
  roundLabel.textContent = "直接开工";
  roundTitle.textContent = "小人看了一眼：这条不用摔";
  appendLog("小人看了一眼：这条不用摔，直接开工。");
  renderDirectBuildStageDialogue();
  updateDeepSeekShadowReadiness();
  roastButton.disabled = false;
  roastButton.textContent = "复制任务文本";
  nextRoundButton.disabled = true;
  nextRoundButton.textContent = "继续";
  if (caseSelect) caseSelect.disabled = false;
  if (seedInput) seedInput.disabled = false;
  if (randomSeedButton) randomSeedButton.disabled = false;
}

function renderDirectBuildStageDialogue() {
  if (!stageDialogue) return;
  resetSoloWalkerStage();
  updateActiveSpeaker(SOLO_PROTAGONIST_ID, { position: false });
  stageDialogue.innerHTML = "";
  stageDialogue.hidden = false;
  stageDialogue.className = "stage-dialogue is-run display-ready is-route-board is-direct-build";
  stageDialogue.style.removeProperty("--dialogue-left");
  stageDialogue.style.removeProperty("--dialogue-top");
  if (routeBoardHint) routeBoardHint.hidden = true;
  stageDialogue.append(createDirectBuildStageCard(getDirectBuildTask()));
}

function renderDirectBuildSideCards() {
  hideDirectBuildSideCards();
  renderObserverCheckCard(false);
}

function hideDirectBuildSideCards() {
  if (walkSummaryCard) {
    walkSummaryCard.hidden = true;
    walkSummaryCard.innerHTML = "";
    walkSummaryCard.classList.remove("is-ready");
  }
  if (resultCard) {
    resultCard.hidden = true;
    resultCard.innerHTML = "";
    resultCard.classList.remove("is-ready");
  }
}

function renderDirectBuildWalkSummaryCard() {
  if (!walkSummaryCard) return;
  const task = getDirectBuildTask();
  walkSummaryCard.innerHTML = "";
  walkSummaryCard.classList.add("is-ready");

  const header = document.createElement("div");
  header.className = "walk-summary-header";
  const eyebrow = document.createElement("span");
  eyebrow.textContent = "开工卡";
  const title = document.createElement("strong");
  title.textContent = `小人建议直接交给 ${formatDirectBuildTools(task)}`;
  header.append(eyebrow, title);

  const note = document.createElement("p");
  note.className = "walk-comeback-line";
  note.textContent = "这条路不需要先摔五步，先做一个能打开的本地版本。";

  const panel = createDirectBuildTaskPanel(task);
  walkSummaryCard.append(header, note, panel);
}

function renderDirectBuildResultCard() {
  if (!resultCard) return;
  resultCard.innerHTML = "";
  resultCard.classList.add("is-ready");
  const task = getDirectBuildTask();
  const title = document.createElement("strong");
  title.textContent = "直接开工任务";
  resultCard.append(title, createDirectBuildTaskPanel(task));
}

function clearBubbles() {
  document.querySelectorAll(".bubble").forEach((node) => node.remove());
  agentNodes.forEach((node) => {
    window.clearTimeout(node.bubbleTimer);
    clearBubbleSequence(node);
  });
}

async function startSandbox() {
  if (directBuildActive && shouldUseDirectBuildMode()) {
    await copyDirectBuildTask();
    return;
  }

  if (sandboxCompleted) {
    resultCard?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  activeCompleteEvidenceStep = 0;
  syncSimulationToCurrentInput();
  if (isEmptyInputMode()) {
    clearDoorwayFeedbackHold();
    renderWaitingState();
    return;
  }
  clearDoorwayFeedbackHold();
  clearRpgStoryboardStep();
  sandboxCompleted = false;
  updateIdeaBoard(getIdeaTitle());
  prepareSimulationSeed();
  clearBubbles();
  currentSignals = structuredClone(simulation.signals);
  currentRound = 0;
  playableStepCountSnapshot = getPlayableStepCount(getFrictionBites());
  biteInProgress = false;

  if (isHardLocalDoorwayStopMode()) {
    renderDoorwayStoppedState({
      logText: getPreflightStopText(),
      buttonText: "已停止"
    });
    return;
  }

  if (shouldUseDirectBuildMode()) {
    setDeepSeekDoorwayStatus("Doorway source：local route mode。routeMode：direct_build，显示开工卡，不调用模型 adapter。", "pass", getLocalDirectBuildDoorwayPayload());
    renderDirectBuildState();
    return;
  }

  const doorwayDecision = await maybeApplyDeepSeekDoorwayReview();
  if (doorwayDecision === "stopped") return;

  if (shouldUseDirectBuildMode()) {
    renderDirectBuildState();
    return;
  }

  if (isPreflightStopMode() || isDefinitionDiagnosisMode()) {
    renderDoorwayStoppedState({
      logText: isDefinitionDiagnosisMode() ? getDoorwayReaction().action : getPreflightStopText(),
      buttonText: isDefinitionDiagnosisMode() ? "先补一句" : "已停止"
    });
    return;
  }

  currentSignals = structuredClone(simulation.signals);
  playableStepCountSnapshot = getPlayableStepCount(getFrictionBites());

  maybeRunDeepSeekShadow();
  if (isDeepSeekPacketStagePreviewEnabled()) {
    await maybeRunDeepSeekLittleWalkerPacket({ stagePreview: true });
  } else {
    activeStagePreviewMode = "local_mock";
    setDeepSeekPacketStagePreviewStatus("Model preview：local mock。", "idle", { mode: "local_mock" });
    maybeRunDeepSeekLittleWalkerPacket();
  }
  sandboxStarted = true;
  initializeAgentStates();
  renderBaseAgents();
  prepareSoloWalkerStage();
  renderSignals(currentSignals);
  renderPathCard(0);
  renderFrictionLibraryCard(0);
  renderBiteCard();
  renderResultCard(false);
  eventLog.innerHTML = "";
  roundLabel.textContent = "准备中";
  roundTitle.textContent = isDefinitionDiagnosisMode() ? getDoorwayReaction().title : "小人准备替你试走";
  appendLog(isDefinitionDiagnosisMode()
    ? getDoorwayReaction().body
    : "开始替身预演：先不判断好坏，让小人替你走一小段。");
  renderStageDialogue();
  roastButton.disabled = true;
  nextRoundButton.disabled = true;
  nextRoundButton.textContent = "继续";
  if (caseSelect) caseSelect.disabled = true;
  if (seedInput) seedInput.disabled = true;
  if (randomSeedButton) randomSeedButton.disabled = true;
  alertAgents();
  window.setTimeout(playRound, 520);
}

function playRound() {
  if (!simulation || !sandboxStarted || biteInProgress) return;
  if (sandboxCompleted) {
    lockFinishedControls();
    return;
  }

  clearBubbles();
  const bites = getFrictionBites();
  const playableStepCount = getPlayableStepCount(bites);
  currentRound = clamp(currentRound, 0, playableStepCount);
  if (currentRound >= playableStepCount) {
    finishFrictionLoop();
    return;
  }

  biteInProgress = true;
  nextRoundButton.disabled = true;
  currentRound += 1;
  const isRpgStoryboardRound = startRpgStoryboardStep(currentRound);

  const bite = bites[currentRound - 1];
  if (!bite) {
    finishFrictionLoop();
    return;
  }
  const update = createFrictionBiteUpdate(bite);
  const stageUpdate = createSoloWalkerStageUpdate(bite, update, currentRound);
  const substituteStep = !isDefinitionDiagnosisMode() ? getSubstituteStepView(bite, currentRound) : null;
  roundLabel.textContent = isDefinitionDiagnosisMode() ? getDoorwayReaction().label : `第 ${currentRound}/${playableStepCount} 步`;
  roundTitle.textContent = isDefinitionDiagnosisMode() ? getDoorwayReaction().title : substituteStep.stepTitle;
  renderPathCard(currentRound);
  renderFrictionLibraryCard(currentRound);
  renderBiteCard(bite, currentRound);
  appendLog(formatProcessStepLog(bite, currentRound));
  updateSoloWalkerStage(bite, currentRound, update);
  renderStageDialogue(bite, currentRound);

  const appliedState = applyAgentStateUpdate(stageUpdate, { bubble: false });
  if (isRpgStoryboardRound) {
    positionRpgStoryboardProtagonistDialogue();
  } else {
    positionStageDialogueForSpeaker(appliedState.agentId);
  }

  window.setTimeout(() => {
    biteInProgress = false;

    if (!isRpgStoryboardRound && currentRound >= playableStepCount) {
      finishFrictionLoop();
      return;
    }

    if (isRpgStoryboardRound) {
      lockGlobalContinueForRpg();
      renderStageDialogue(bite, currentRound);
      return;
    }

    nextRoundButton.disabled = false;
    nextRoundButton.textContent = "继续";
    renderStageDialogue(bite, currentRound);
  }, isRpgStoryboardRound ? 180 : 1150);
}

function handleNextRoundClick() {
  if (directBuildActive && shouldUseDirectBuildMode()) {
    return;
  }
  if (sandboxCompleted) {
    lockFinishedControls();
    return;
  }
  playRound();
}

function handleRpgContinueClick() {
  if (sandboxCompleted) {
    lockFinishedControls();
    return;
  }
  if (biteInProgress || getStageDisplayMode() !== "run") return;
  if (advanceRpgStoryboardFrame()) return;

  const playableStepCount = getPlayableStepCount();
  const activeStepNumber = clamp(getVisibleRoundStepNumber() || rpgStoryboardStepNumber || currentRound, 0, playableStepCount);
  if (activeStepNumber >= playableStepCount) {
    finishFrictionLoop();
    return;
  }

  currentRound = activeStepNumber;
  playRound();
}

function getVisibleRoundStepNumber() {
  const match = String(roundLabel?.textContent || "").match(/第\s*(\d+)\s*\/\s*\d+\s*步/);
  const value = match ? Number(match[1]) : 0;
  return Number.isFinite(value) ? value : 0;
}

function advanceRpgStoryboardFrame() {
  if (sandboxCompleted || !isRpgStoryboardStepActive() || biteInProgress) return false;

  const bite = getFrictionBites()[currentRound - 1];
  const step = bite && !isDefinitionDiagnosisMode()
    ? getSubstituteStepView(bite, currentRound)
    : null;
  const frames = getRpgStoryboardFrames(step);

  if (rpgStoryboardFrameIndex < frames.length - 1) {
    rpgStoryboardFrameIndex += 1;
    renderStageDialogue(bite, currentRound);
    lockGlobalContinueForRpg();
    return true;
  }

  clearRpgStoryboardStep();
  return false;
}

function getRpgStoryboardNextButtonText() {
  if (sandboxCompleted) return "看今晚动作";
  if (!isRpgStoryboardStepActive()) return "继续";
  const bite = getFrictionBites()[currentRound - 1];
  const step = bite && !isDefinitionDiagnosisMode()
    ? getSubstituteStepView(bite, currentRound)
    : null;
  const frames = getRpgStoryboardFrames(step);
  return rpgStoryboardFrameIndex < frames.length - 1 ? "继续" : "进入下一步";
}

function lockGlobalContinueForRpg() {
  if (!nextRoundButton) return;
  nextRoundButton.disabled = true;
  nextRoundButton.textContent = "看舞台分镜";
}

function formatProcessStepLog(bite, index) {
  if (isDefinitionDiagnosisMode()) {
    return `小人问一句：${bite.plainTake || bite.bubble || bite.friction}`;
  }

  const step = getSubstituteStepView(bite, index);
  return `第 ${index} 步 · ${getRouteVerdictLabel(step.verdict)}：${step.sceneLine} ${getStepContinuationText(step)}`;
}

function getFrictionBites() {
  const bites = simulation.frictionBites || [];
  return isDefinitionDiagnosisMode() ? bites.slice(0, 1) : bites;
}

function getPlayableStepCount(bites = getFrictionBites()) {
  const selectedCount = Array.isArray(simulation?.selectedFrictionIds) ? simulation.selectedFrictionIds.length : 0;
  const visibleTotal = getVisibleRoundTotalSteps();
  const count = Math.max(bites.length, selectedCount, playableStepCountSnapshot, visibleTotal);
  return Math.min(count, LITTLE_WALKER_STEP_LIMIT);
}

function getVisibleRoundTotalSteps() {
  const match = String(roundLabel?.textContent || "").match(/第\s*\d+\s*\/\s*(\d+)\s*步/);
  const value = match ? Number(match[1]) : 0;
  return Number.isFinite(value) ? value : 0;
}

function createFrictionBiteUpdate(bite) {
  const definition = getFrictionDefinition(bite.frictionId || bite.id);
  const defaults = definition?.defaultState || {};
  const agentId = bite.agentId || defaults.agentId;
  const agent = simulation.agents.find((item) => item.id === agentId);

  return {
    agentId,
    background: bite.background || agent?.role || "观察者",
    tempRole: bite.tempRole || bite.lens || definition?.role || "摩擦观察者",
    emotion: bite.emotion || defaults.emotion || "skeptical",
    action: bite.action || defaults.action || "think",
    event: bite.event || defaults.event || bite.id || "friction_bite",
    evidenceStatus: bite.evidenceStatus || "opinion",
    evidenceNote: bite.evidenceNote || "",
    bubble: bite.bubble || bite.friction || "",
    target: bite.target || pickTargetForAction(bite.action || defaults.action || "think"),
    signalDelta: bite.signalDelta || defaults.signalDelta || {}
  };
}

function finishFrictionLoop() {
  clearRpgStoryboardStep();
  activeCompleteEvidenceStep = 0;
  const bites = getFrictionBites();
  const playableStepCount = getPlayableStepCount(bites);
  currentRound = playableStepCount;
  sandboxCompleted = true;
  biteInProgress = false;
  roundLabel.textContent = isDefinitionDiagnosisMode() ? getDoorwayReaction().label : "替身预演完成";
  roundTitle.textContent = isDefinitionDiagnosisMode() ? "补完再让小人走" : "小人试走完了";
  renderPathCard(playableStepCount);
  renderFrictionLibraryCard(playableStepCount + 1);
  renderResultCard(true);
  completeSoloWalkerStage();
  renderStageDialogue();
  appendLog(isDefinitionDiagnosisMode()
    ? "小人先问到这里：现在只需要补一个对象或场景。"
    : "替身预演完成：现在只看路线怎么变、哪里停住、现在最小试走动作是什么。");
  lockFinishedControls();
}

function lockFinishedControls() {
  if (nextRoundButton) {
    nextRoundButton.disabled = true;
    nextRoundButton.textContent = "已带回";
  }
  if (roastButton) {
    roastButton.disabled = false;
    roastButton.textContent = "看今晚动作";
  }
}

function updatePrimaryActionLabel() {
  if (!roastButton) return;

  if (isEmptyInputMode()) {
    roastButton.textContent = "先写一句";
    return;
  }

  if (isPreflightStopMode()) {
    roastButton.textContent = "听小人怎么说";
    return;
  }

  if (isDefinitionDiagnosisMode()) {
    roastButton.textContent = "先问一句";
    return;
  }

  roastButton.textContent = "丢给小人";
}

function generateFakeRoundUpdates(roundIndex) {
  const minCount = roundIndex === 1 ? 3 : 2;
  const maxCount = Math.min(roundIndex === 1 ? 5 : 4, simulation.agents.length);
  const count = randomInt(minCount, maxCount);

  return selectTriggeredAgents(count, roundIndex)
    .map((agent) => createFakeAgentUpdate(agent));
}

function selectTriggeredAgents(count, roundIndex) {
  return weightedPickMany(simulation.agents, count, (agent) => scoreAgentTrigger(agent, roundIndex));
}

function scoreAgentTrigger(agent, roundIndex) {
  const memory = agentMemories.get(agent.id);
  const previous = agentStates.get(agent.id);
  let score = 4 + (memory?.attention || 40) / 14;

  if (roundIndex === 1 && agentEventAffinities[agent.id]) score += 2;
  if (previous?.event === "cold_walkaway") score -= 3;
  if (previous?.event === "detail_hooked") score += 2;
  if ((memory?.triggerCount || 0) > roundIndex / 2) score -= 1.8;

  return Math.max(0.6, score);
}

function createFakeAgentUpdate(agent) {
  const previous = agentStates.get(agent.id);
  const memory = agentMemories.get(agent.id);
  const template = pickEventTemplateForAgent(agent, previous, memory);
  const action = randomFrom(template.actions);
  const keepBackground = previous?.background && chance(0.72);

  return {
    agentId: agent.id,
    background: keepBackground ? previous.background : randomFrom([agent.role, ...backgroundPool]),
    tempRole: pickTempRole(template, previous),
    emotion: pickEmotion(template, memory),
    action,
    event: template.event,
    bubble: randomFrom(template.bubbles),
    target: pickTargetForAction(action),
    signalDelta: template.signalDelta
  };
}

function pickEventTemplateForAgent(agent, previous, memory) {
  return weightedPick(eventTemplates, (template) => scoreEventTemplate(template, agent, previous, memory));
}

function scoreEventTemplate(template, agent, previous, memory) {
  let score = 4;
  const affinities = agentEventAffinities[agent.id] || [];
  const nextEvents = eventTransitions[previous?.event || "ambient"] || [];

  if (affinities.includes(template.event)) score += 5;
  if (nextEvents.includes(template.event)) score += 4;
  if (memory?.lastEvents.includes(template.event)) score -= 4;

  const repeated = memory?.eventCounts[template.event] || 0;
  score -= repeated * 1.5;

  if ((memory?.attention || 0) < 28 && template.event === "cold_walkaway") score += 4;
  if ((memory?.attention || 0) > 66 && ["detail_hooked", "branch_suggested", "clone_started"].includes(template.event)) score += 3;
  if ((memory?.skepticism || 0) > 64 && ["competitor_found", "cost_alarm", "argument_started"].includes(template.event)) score += 3;
  if ((memory?.makerEnergy || 0) > 62 && ["clone_started", "branch_suggested"].includes(template.event)) score += 3;
  if ((currentSignals.branchCount || 0) >= 2 && template.event === "branch_suggested") score -= 2;

  return Math.max(0.4, score);
}

function pickTempRole(template, previous) {
  if (previous?.tempRole && template.tempRoles.includes(previous.tempRole) && chance(0.5)) {
    return previous.tempRole;
  }

  return randomFrom(template.tempRoles);
}

function pickEmotion(template, memory) {
  if ((memory?.skepticism || 0) > 70 && template.emotions.includes("skeptical") && chance(0.5)) {
    return "skeptical";
  }

  if ((memory?.attention || 0) > 70 && template.emotions.includes("excited") && chance(0.34)) {
    return "excited";
  }

  return randomFrom(template.emotions);
}

// Future agent hook: LLM/agent output can call this with the same fields
// generated by createFakeAgentUpdate, then the UI mapping stays unchanged.
function applyAgentStateUpdate(update, options = {}) {
  const state = normalizeAgentUpdate(update);
  const node = agentNodes.get(state.agentId);
  if (!node) return state;

  agentStates.set(state.agentId, state);
  setAgentBadges(node, state);

  const target = state.target || pickTargetForAction(state.action);
  const useRpgStoryboardHold = isRpgStoryboardStepActive() && state.agentId === SOLO_PROTAGONIST_ID;
  const walkDuration = useRpgStoryboardHold
    ? holdAgentForRpgStoryboard(node, state)
    : moveAgent(node, target.x, target.y, getActionLabel(state.action), state.action);

  if (options.signals !== false) {
    applySignalDelta(state.signalDelta);
  }

  if (options.bubble !== false && state.bubble && !useRpgStoryboardHold) {
    window.clearTimeout(node.bubbleTimer);
    node.bubbleTimer = window.setTimeout(() => {
      if (shouldPlaySoloWalkerMicroSequence(state)) {
        playSoloWalkerMicroBubbleSequence(node, state);
      } else {
        showBubble(node, state.bubble, state.emotion);
      }
    }, Math.max(900, walkDuration - 260));
  }

  if (options.log !== false) {
    appendStateLog(state);
  }

  updateAgentMemory(state);
  recordStateUpdate(state);
  return state;
}

function updateAgentMemory(state) {
  const memory = agentMemories.get(state.agentId);
  if (!memory) return;

  const delta = eventMemoryDelta[state.event] || {};
  memory.attention = clamp(Math.round(memory.attention + (delta.attention || 0)), 0, 100);
  memory.skepticism = clamp(Math.round(memory.skepticism + (delta.skepticism || 0)), 0, 100);
  memory.makerEnergy = clamp(Math.round(memory.makerEnergy + (delta.makerEnergy || 0)), 0, 100);
  memory.triggerCount += 1;
  memory.lastEvents.unshift(state.event);
  memory.lastEvents.splice(4);
  memory.eventCounts[state.event] = (memory.eventCounts[state.event] || 0) + 1;
}

function normalizeAgentUpdate(update) {
  const previous = agentStates.get(update.agentId) || {};
  return {
    agentId: update.agentId,
    background: update.background || previous.background || randomFrom(backgroundPool),
    tempRole: update.tempRole || previous.tempRole || randomFrom(tempRolePool),
    emotion: emotionConfig[update.emotion] ? update.emotion : previous.emotion || "neutral",
    action: actionConfig[update.action] ? update.action : previous.action || "ambient_watch",
    event: update.event || previous.event || "ambient",
    evidenceStatus: update.evidenceStatus || previous.evidenceStatus || "opinion",
    evidenceNote: update.evidenceNote || previous.evidenceNote || "",
    bubble: update.bubble || "",
    target: update.target || previous.target || pickTargetForAction(update.action || previous.action || "ambient_watch"),
    signalDelta: update.signalDelta || {}
  };
}

function setAgentBadges(node, agentState) {
  if (!agentState) return;

  const emotion = emotionConfig[agentState.emotion] || emotionConfig.neutral;
  const identityTag = node.querySelector(".identity-tag");
  const activityTag = node.querySelector(".activity-tag");
  const actionLabel = getActionLabel(agentState.action);

  node.dataset.background = agentState.background;
  node.dataset.tempRole = agentState.tempRole;
  node.dataset.emotion = agentState.emotion;
  node.dataset.action = agentState.action;
  node.dataset.event = agentState.event;
  node.dataset.intent = actionLabel;
  node.style.setProperty("--emotion-color", emotion.color);
  node.style.setProperty("--bubble-bg", emotion.bubble);

  if (identityTag) identityTag.textContent = agentState.background;
  if (activityTag) activityTag.textContent = `${agentState.tempRole} · ${emotion.label} · ${actionLabel}`;

  updatePhoneState(node, agentState.action);
  updateSpritePose(node, agentState.action);
}

function moveAgent(node, x, y, state, finalAction) {
  if (stage?.classList.contains("route-board-stage") && node?.dataset?.agentId === SOLO_PROTAGONIST_ID) {
    const target = {
      x: clamp(x, 10, 90),
      y: clamp(y, 22, 76)
    };
    const action = finalAction || node.dataset.action || activityToAction(state);
    window.clearTimeout(node.walkTimer);
    stopSpriteFrameLoop(node);
    node.classList.remove("is-walking");
    node.dataset.restPose = getRestSpritePose(action);
    node.style.left = `${target.x}%`;
    node.style.top = `${target.y}%`;
    setAgentDepth(node, target.y);
    node.dataset.targetX = target.x;
    node.dataset.targetY = target.y;
    node.dataset.state = state;
    updateSpritePose(node, action, { force: true });
    return 0;
  }

  const currentX = parseFloat(node.style.left);
  const currentY = parseFloat(node.style.top);
  const target = resolveTargetWithCollision(node, x, y);
  const action = finalAction || node.dataset.action || activityToAction(state);
  const profile = getAgentSpriteProfile(node.dataset.agentId);
  const duration = Math.round(getWalkDuration(currentX, currentY, target.x, target.y) * (profile?.walkDurationScale || 1));
  const stepCount = Math.max(7, Math.round(duration / 330));
  const sprite = node.querySelector(".sprite");

  leaveStepTrace(node, target.x, target.y, duration);
  node.classList.add("is-walking");
  node.dataset.restPose = getRestSpritePose(action);
  node.style.setProperty("--walk-duration", `${duration}ms`);
  node.style.setProperty("--walk-steps", stepCount);
  node.style.left = `${target.x}%`;
  node.style.top = `${target.y}%`;
  setAgentDepth(node, target.y);
  node.dataset.targetX = target.x;
  node.dataset.targetY = target.y;
  node.dataset.state = state;
  updateSpriteFacing(node, currentX, target.x);
  if (sprite) sprite.dataset.pose = "walk";
  startSpriteFrameLoop(node, getSpriteFrames(profile, "walk"), profile);
  window.clearTimeout(node.walkTimer);
  node.walkTimer = window.setTimeout(() => {
    node.classList.remove("is-walking");
    updateSpritePose(node, node.dataset.action || action, { force: true });
  }, duration + 120);
  return duration;
}

function resolveTargetWithCollision(node, x, y) {
  if (stage?.classList.contains("route-board-stage") && node?.dataset?.agentId === SOLO_PROTAGONIST_ID) {
    return {
      x: clamp(x, 10, 90),
      y: clamp(y, 22, 76)
    };
  }

  const origin = projectToPlanetEdge(x, y);
  const candidates = getCollisionCandidates(origin);

  return candidates
    .map((candidate) => {
      const projected = projectToPlanetEdge(candidate.x, candidate.y);
      return {
        x: projected.x,
        y: projected.y,
        distance: Math.hypot(projected.x - origin.x, projected.y - origin.y)
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .find((candidate) => isCollisionFree(node, candidate.x, candidate.y)) || origin;
}

function projectToPlanetEdge(x, y) {
  const edgeX = clamp(x, movementBounds.minX, movementBounds.maxX);
  const normalizedX = clamp((edgeX - planetEdgePath.centerX) / planetEdgePath.radiusX, -1, 1);
  const arcAmount = 1 - normalizedX * normalizedX;
  const edgeY = planetEdgePath.topY + (planetEdgePath.bottomY - planetEdgePath.topY) * arcAmount;
  const rawOffset = Number.isFinite(y) ? (y - edgeY) * 0.18 : 0;
  const edgeOffset = clamp(rawOffset, -planetEdgePath.bandY, planetEdgePath.bandY);

  return {
    x: edgeX,
    y: clamp(edgeY + edgeOffset, movementBounds.minY, movementBounds.maxY)
  };
}

function setAgentDepth(node, y) {
  if (!node || !Number.isFinite(y)) return;
  node.style.zIndex = String(Math.round(30 + y));
}

function getCollisionCandidates(origin) {
  const candidates = [origin];
  const rings = [
    { radiusX: collisionFootprint.radiusX * 0.85, radiusY: collisionFootprint.radiusY * 0.85, points: 8 },
    { radiusX: collisionFootprint.radiusX * 1.35, radiusY: collisionFootprint.radiusY * 1.35, points: 10 },
    { radiusX: collisionFootprint.radiusX * 1.9, radiusY: collisionFootprint.radiusY * 1.9, points: 12 }
  ];

  rings.forEach((ring) => {
    for (let index = 0; index < ring.points; index += 1) {
      const angle = (Math.PI * 2 * index) / ring.points;
      candidates.push({
        x: origin.x + Math.cos(angle) * ring.radiusX,
        y: origin.y + Math.sin(angle) * ring.radiusY
      });
    }
  });

  return candidates;
}

function isCollisionFree(node, x, y) {
  return [...agentNodes.values()].every((other) => {
    if (other === node) return true;
    if (isSoloWalkerStageMode("run") && other.dataset.agentId !== SOLO_PROTAGONIST_ID) return true;

    const otherX = parseFloat(other.dataset.targetX || other.style.left);
    const otherY = parseFloat(other.dataset.targetY || other.style.top);
    if (!Number.isFinite(otherX) || !Number.isFinite(otherY)) return true;

    const normalizedDistance = Math.hypot(
      (x - otherX) / collisionFootprint.radiusX,
      (y - otherY) / collisionFootprint.radiusY
    );
    return normalizedDistance >= 1;
  });
}

function getWalkDuration(fromX, fromY, toX, toY) {
  if (!Number.isFinite(fromX) || !Number.isFinite(fromY)) return 3200;

  const distance = Math.hypot(toX - fromX, toY - fromY);
  return Math.round(clamp(1800 + distance * 82, 2600, 6200));
}

function leaveStepTrace(node, nextX, nextY, duration) {
  if (!node.classList.contains("has-demo-sprite")) return;

  const currentX = parseFloat(node.style.left);
  const currentY = parseFloat(node.style.top);
  if (!Number.isFinite(currentX) || !Number.isFinite(currentY)) return;

  const distance = Math.hypot(nextX - currentX, nextY - currentY);
  const direction = nextX >= currentX ? 1 : -1;
  const dustCount = distance > 10 ? 2 : 1;

  for (let index = 0; index < dustCount; index += 1) {
    const isArrivalDust = index >= Math.ceil(dustCount / 2);
    const anchorX = isArrivalDust ? nextX : currentX;
    const anchorY = isArrivalDust ? nextY : currentY;
    const delay = isArrivalDust ? Math.max(0, duration - 420 + (index % 2) * 120) : index * 110;

    createStepDust(
      anchorX - direction * (1.2 + (index % 2) * 0.8),
      anchorY + 8 + (index % 2 === 0 ? 0.35 : -0.25),
      delay
    );
  }
}

function createStepDust(x, y, delay) {
  const trace = document.createElement("span");
  trace.className = "step-trace";
  trace.style.left = `${x}%`;
  trace.style.top = `${y}%`;
  trace.style.animationDelay = `${delay}ms`;
  stage.append(trace);
  window.setTimeout(() => trace.remove(), delay + 900);
}

function updateSpriteFacing(node, currentX, targetX) {
  if (!node.classList.contains("has-demo-sprite")) return;
  if (!Number.isFinite(currentX) || !Number.isFinite(targetX)) return;

  const deltaX = targetX - currentX;
  if (Math.abs(deltaX) < 0.8) return;

  const profile = getAgentSpriteProfile(node.dataset.agentId);
  const targetDirection = deltaX < 0 ? "left" : "right";
  const baseFacing = profile?.baseFacing || "right";
  const facing = targetDirection === baseFacing ? 1 : -1;
  node.dataset.direction = targetDirection;
  node.style.setProperty("--sprite-facing", facing);
}

function setActivity(node, activity) {
  const tag = node.querySelector(".activity-tag");
  const previous = agentStates.get(node.dataset.agentId);
  const action = activityToAction(activity);
  if (tag) {
    const prefix = previous?.tempRole ? `${previous.tempRole} · ` : "";
    tag.textContent = `${prefix}${activity}`;
  }

  node.dataset.intent = activity;
  node.dataset.action = action;
  updatePhoneState(node, action);
  updateSpritePose(node, action);
}

function updatePhoneState(node, action) {
  const config = actionConfig[action];
  const actionLabel = config?.label || action;
  const phoneActivities = ["看手机", "回短信", "查证", "传播"];
  node.classList.toggle("is-phone", Boolean(config?.phone) || phoneActivities.includes(actionLabel));
}

function updateSpritePose(node, action, options = {}) {
  const profile = getAgentSpriteProfile(node.dataset.agentId);
  const spriteArt = node.querySelector(".sprite-art");
  const sprite = node.querySelector(".sprite");
  if (!profile || !spriteArt || !sprite) return;

  const pose = getRestSpritePose(action);
  node.dataset.restPose = pose;

  if (node.classList.contains("is-walking") && !options.force) return;

  stopSpriteFrameLoop(node);
  sprite.dataset.pose = pose;
  setSpriteFrame(node, getSpriteFrames(profile, pose)[0] || getSpriteFrames(profile, "idle")[0]);
}

function getSpriteFrames(profile, pose) {
  if (!profile) return [];

  const frames = profile.frames?.[pose] || profile.poses?.[pose];
  return (Array.isArray(frames) ? frames : [frames]).filter(Boolean);
}

function setSpriteFrame(node, framePath) {
  const spriteArt = node.querySelector(".sprite-art");
  if (!spriteArt || !framePath) return;
  if (spriteArt.getAttribute("src") !== framePath) {
    spriteArt.src = framePath;
  }
}

function startSpriteFrameLoop(node, frames, profileOrFrameMs = 170) {
  stopSpriteFrameLoop(node);

  const usableFrames = (frames || []).filter(Boolean);
  if (!usableFrames.length) return;

  const frameMs = typeof profileOrFrameMs === "number" ? profileOrFrameMs : profileOrFrameMs?.walkFrameMs || 170;
  const frameDurations = getWalkFrameDurations(profileOrFrameMs, usableFrames.length, frameMs);
  const stepCycleFrames =
    typeof profileOrFrameMs === "number"
      ? Math.min(4, Math.max(2, Math.round(usableFrames.length / 2)))
      : profileOrFrameMs?.stepCycleFrames || Math.min(4, Math.max(2, Math.round(usableFrames.length / 2)));
  const savedFrameIndex = Number.parseInt(node.dataset.spriteFrameIndex || "", 10);
  let frameIndex = Number.isFinite(savedFrameIndex)
    ? savedFrameIndex % usableFrames.length
    : hashString(node.dataset.agentId || "") % usableFrames.length;
  const varianceStep = (hashString(`${node.dataset.agentId || ""}:walk`) % 7) - 3;
  const maxFrameVariance =
    typeof profileOrFrameMs === "number" ? 24 : Number.isFinite(profileOrFrameMs?.walkFrameVarianceMs) ? profileOrFrameMs.walkFrameVarianceMs : 24;
  const frameVariance = Math.round((varianceStep / 3) * maxFrameVariance);
  const minFrameMs =
    typeof profileOrFrameMs === "number" ? 80 : Math.max(34, profileOrFrameMs?.minWalkFrameMs || 80);
  const durations = frameDurations.map((duration) => Math.max(minFrameMs, duration + frameVariance));
  const loopMs = durations.reduce((total, duration) => total + duration, 0);
  const stepCycleMs = Math.round(loopMs / Math.max(1, usableFrames.length / stepCycleFrames));

  setSpriteFrame(node, usableFrames[frameIndex]);
  node.dataset.spriteFrameIndex = String(frameIndex);
  node.style.setProperty("--sprite-step-cycle", `${stepCycleMs}ms`);
  node.style.setProperty("--sprite-step-delay", `${-getFrameCycleOffset(durations, frameIndex, stepCycleFrames)}ms`);

  if (usableFrames.length < 2) return;

  const advanceFrame = () => {
    const currentDuration = durations[frameIndex] || frameMs;
    node.spriteFrameTimer = window.setTimeout(() => {
      frameIndex = (frameIndex + 1) % usableFrames.length;
      setSpriteFrame(node, usableFrames[frameIndex]);
      node.dataset.spriteFrameIndex = String(frameIndex);
      advanceFrame();
    }, currentDuration);
  };

  advanceFrame();
}

function getWalkFrameDurations(profileOrFrameMs, frameCount, fallbackMs) {
  if (typeof profileOrFrameMs !== "number" && Array.isArray(profileOrFrameMs?.walkFrameDurations)) {
    const durations = profileOrFrameMs.walkFrameDurations
      .slice(0, frameCount)
      .map((duration) => Math.round(Number(duration)))
      .filter((duration) => Number.isFinite(duration) && duration > 0);
    if (durations.length === frameCount) return durations;
  }

  return Array.from({ length: frameCount }, () => fallbackMs);
}

function getFrameCycleOffset(durations, frameIndex, stepCycleFrames) {
  const cycleIndex = frameIndex % stepCycleFrames;
  let offset = 0;
  for (let index = 0; index < cycleIndex; index += 1) {
    offset += durations[index] || 0;
  }
  return offset;
}

function stopSpriteFrameLoop(node) {
  if (!node?.spriteFrameTimer) return;
  window.clearTimeout(node.spriteFrameTimer);
  window.clearInterval(node.spriteFrameTimer);
  node.spriteFrameTimer = null;
}

function showBubble(agentNode, text, emotion = "neutral", options = {}) {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  if (options.className) bubble.classList.add(options.className);
  bubble.dataset.emotion = emotion;
  if (options.insight === true) {
    bubble.dataset.insight = "true";
  } else {
    bubble.dataset.friction = "true";
  }
  bubble.style.visibility = "hidden";
  bubble.textContent = options.typewriter ? "" : text;
  agentNode.append(bubble);
  placeBubble(agentNode, bubble);
  bubble.style.visibility = "";
  if (options.typewriter) {
    revealBubbleText(bubble, text, options.typeSpeedMs);
  }
  window.requestAnimationFrame(relayoutBubbles);
  return bubble;
}

function renderIdleProtagonistBubble() {
  if (!isEmptyInputMode()) return;
  const node = agentNodes.get(SOLO_PROTAGONIST_ID);
  if (!node) return;

  window.clearTimeout(node.bubbleTimer);
  clearBubbleSequence(node);
  node.querySelector(".bubble")?.remove();
  placeSoloWalkerAtRouteStep(0);
  setRouteBoardHint("写一句小产品想法，我替你先走一圈。");
}

function renderReadyProtagonistBubble() {
  if (sandboxStarted || isEmptyInputMode()) return;
  const node = agentNodes.get(SOLO_PROTAGONIST_ID);
  if (!node) return;

  window.clearTimeout(node.bubbleTimer);
  clearBubbleSequence(node);
  node.querySelector(".bubble")?.remove();
  placeSoloWalkerAtRouteStep(0);
  setRouteBoardHint(getReadyRouteBoardHint());
}

function getReadyRouteBoardHint() {
  if (!isPreflightStopMode() && !isDefinitionDiagnosisMode()) {
    return "我拿到了，点一下我就出发。";
  }

  const reaction = getDoorwayReaction();
  const action = stripEndPunctuation(reaction.action || reaction.body || "");
  if (reaction.key === "definition") {
    return action
      ? `${reaction.title}，先补一句：${action}。`
      : `${reaction.title}，先补一个具体对象或场景。`;
  }

  return action
    ? `${reaction.title}：${action}。`
    : `${reaction.title}，小人先停在门口。`;
}

function shouldPlaySoloWalkerMicroSequence(state) {
  return currentRound === 1 &&
    state.agentId === SOLO_PROTAGONIST_ID &&
    isSoloWalkerStageMode("run") &&
    /卡住：/.test(state.bubble || "") &&
    /想到：/.test(state.bubble || "");
}

function playSoloWalkerMicroBubbleSequence(agentNode, state) {
  const parts = getSoloWalkerMicroBubbleParts(state.bubble);
  clearBubbleSequence(agentNode);
  agentNode.querySelector(".bubble")?.remove();

  const firstText = parts.friction || "卡住：这里还太大。";
  const secondText = parts.insight || "想到：先缩成今晚能试的一步。";
  const firstTypingMs = getTypewriterTotalMs(firstText);
  const insightDelayMs = firstTypingMs + 520;
  const secondDelayMs = insightDelayMs + 430;

  showBubble(agentNode, firstText, state.emotion, { typewriter: true, typeSpeedMs: 24 });

  agentNode.bubbleSequenceTimers = [
    window.setTimeout(() => {
      agentNode.querySelector(".bubble")?.remove();
      showBubble(agentNode, "!", "excited", { className: "is-insight-pop", insight: true });
    }, insightDelayMs),
    window.setTimeout(() => {
      agentNode.querySelector(".bubble")?.remove();
      showBubble(agentNode, secondText, state.emotion, { typewriter: true, typeSpeedMs: 24 });
    }, secondDelayMs)
  ];
}

function getSoloWalkerMicroBubbleParts(text = "") {
  const friction = text.match(/卡住：([^。]+)。?/u)?.[1] || "";
  const insight = text.match(/想到：([^。]+)。?/u)?.[1] || "";
  return {
    friction: friction ? `卡住：${friction}。` : "",
    insight: insight ? `想到：${insight}。` : ""
  };
}

function getTypewriterTotalMs(text = "", speedMs = 24) {
  return Math.max(360, String(text).length * speedMs);
}

function revealBubbleText(bubble, text, speedMs = 24) {
  const fullText = String(text || "");
  let index = 0;
  bubble.classList.add("is-typing");

  const tick = () => {
    if (!bubble.isConnected) return;
    index += 1;
    bubble.textContent = fullText.slice(0, index);
    if (index < fullText.length) {
      bubble.typeTimer = window.setTimeout(tick, speedMs);
      return;
    }
    bubble.classList.remove("is-typing");
  };

  window.clearTimeout(bubble.typeTimer);
  tick();
}

function clearBubbleSequence(agentNode) {
  if (!agentNode?.bubbleSequenceTimers) return;
  agentNode.bubbleSequenceTimers.forEach((timer) => window.clearTimeout(timer));
  agentNode.bubbleSequenceTimers = [];
}

function placeBubble(agentNode, bubble) {
  const candidates = getBubbleCandidates(agentNode);
  const existingRects = [...document.querySelectorAll(".agent .bubble")]
    .filter((node) => node !== bubble)
    .map((node) => node.getBoundingClientRect());
  const stageRect = stage.getBoundingClientRect();

  const best = candidates
    .map((offset) => {
      bubble.style.setProperty("--bubble-x", `${offset.x}px`);
      bubble.style.setProperty("--bubble-y", `${offset.y}px`);
      const rect = bubble.getBoundingClientRect();
      return {
        offset,
        score: getBubblePlacementScore(rect, existingRects, stageRect)
      };
    })
    .sort((a, b) => a.score - b.score)[0]?.offset || candidates[0];

  bubble.style.setProperty("--bubble-x", `${best.x}px`);
  bubble.style.setProperty("--bubble-y", `${best.y}px`);
  bubble.style.setProperty("--bubble-tail-x", `${clamp(-best.x, -76, 76)}px`);
}

function relayoutBubbles() {
  const placedRects = [];
  const stageRect = stage.getBoundingClientRect();

  [...document.querySelectorAll(".agent .bubble")].forEach((bubble) => {
    const agentNode = bubble.closest(".agent");
    if (!agentNode) return;

    const best = getBubbleCandidates(agentNode)
      .map((offset) => {
        bubble.style.setProperty("--bubble-x", `${offset.x}px`);
        bubble.style.setProperty("--bubble-y", `${offset.y}px`);
        const rect = bubble.getBoundingClientRect();
        return {
          offset,
          score: getBubblePlacementScore(rect, placedRects, stageRect)
        };
      })
      .sort((a, b) => a.score - b.score)[0]?.offset;

    if (best) {
      bubble.style.setProperty("--bubble-x", `${best.x}px`);
      bubble.style.setProperty("--bubble-y", `${best.y}px`);
      bubble.style.setProperty("--bubble-tail-x", `${clamp(-best.x, -76, 76)}px`);
    }
    placedRects.push(bubble.getBoundingClientRect());
  });
}

function getBubbleCandidates(agentNode) {
  const agentX = parseFloat(agentNode.style.left);

  if (isEmptyInputMode() && agentNode.dataset.agentId === SOLO_PROTAGONIST_ID) {
    return [
      { x: 128, y: -20 },
      { x: -128, y: -20 },
      { x: 0, y: -58 }
    ];
  }

  if (isSoloWalkerStageMode("run") && agentNode.dataset.agentId === SOLO_PROTAGONIST_ID) {
    const side = Number.isFinite(agentX) && agentX < 45 ? 1 : -1;
    return [
      { x: side * 150, y: -10 },
      { x: side * 112, y: -34 },
      { x: 0, y: -42 }
    ];
  }

  if (Number.isFinite(agentX) && agentX < 22) {
    return bubbleOffsets.map((offset) => ({ x: Math.abs(offset.x) || 96, y: offset.y }));
  }

  if (Number.isFinite(agentX) && agentX > 78) {
    return bubbleOffsets.map((offset) => ({ x: -Math.abs(offset.x || 96), y: offset.y }));
  }

  return bubbleOffsets;
}

function getBubblePlacementScore(rect, existingRects, stageRect) {
  const overlapPenalty = existingRects.reduce((total, otherRect) => {
    const overlapX = Math.max(0, Math.min(rect.right, otherRect.right) - Math.max(rect.left, otherRect.left));
    const overlapY = Math.max(0, Math.min(rect.bottom, otherRect.bottom) - Math.max(rect.top, otherRect.top));
    return total + overlapX * overlapY;
  }, 0);

  const edgePenalty =
    Math.max(0, stageRect.left + 8 - rect.left) * 24 +
    Math.max(0, rect.right - stageRect.right + 8) * 24 +
    Math.max(0, stageRect.top + 8 - rect.top) * 18 +
    Math.max(0, rect.bottom - stageRect.bottom + 8) * 18;

  return overlapPenalty * 4 + edgePenalty;
}

function appendLog(text) {
  const item = document.createElement("li");
  item.textContent = text;
  eventLog.prepend(item);
}

function appendStateLog(state) {
  if (!biteInProgress) {
    const agent = simulation.agents.find((item) => item.id === state.agentId);
    const eventLabel = getVisibleStateEventLabel(state);
    appendLog(`${agent?.name || "有人"} · ${eventLabel}：${state.bubble}`);
  }
}

function recordStateUpdate(state) {
  recentStateUpdates.unshift(projectAgentState(state));
  recentStateUpdates.splice(6);
  renderStateFeed();
}

function clearStateUpdates() {
  recentStateUpdates.splice(0);
  renderStateFeed();
}

function projectAgentState(state) {
  const memory = agentMemories.get(state.agentId);
  return {
    agentId: state.agentId,
    background: state.background,
    tempRole: state.tempRole,
    emotion: state.emotion,
    action: state.action,
    event: state.event,
    evidenceStatus: state.evidenceStatus,
    bubble: state.bubble,
    attention: memory?.attention ?? 0,
    skepticism: memory?.skepticism ?? 0,
    triggerCount: memory?.triggerCount ?? 0
  };
}

function renderStateFeed() {
  if (!stateFeed) return;
  stateFeed.innerHTML = "";

  if (recentStateUpdates.length === 0) {
    const empty = document.createElement("div");
    empty.className = "state-empty";
    empty.textContent = isPreflightStopMode() ? "小人没有出发" : "等待小人带回现场反应";
    stateFeed.append(empty);
    return;
  }

  recentStateUpdates.forEach((state) => {
    const agent = simulation.agents.find((item) => item.id === state.agentId);
    const item = document.createElement("div");
    item.className = "state-record";

    const title = document.createElement("strong");
    title.textContent = `${agent?.name || "有人"} · ${getVisibleStateEventLabel(state)}`;

    const quote = document.createElement("p");
    quote.textContent = state.bubble || "没有留下反应。";

    const meta = document.createElement("small");
    const evidenceLabel = getEvidenceLabel(state.evidenceStatus);
    meta.textContent = [state.tempRole, evidenceLabel].filter(Boolean).join(" · ");

    item.append(title, quote, meta);
    stateFeed.append(item);
  });
}

function getVisibleStateEventLabel(state) {
  if (isDefinitionDiagnosisMode()) return getDoorwayReaction().label;
  return getEventLabel(state.event);
}

function applySignalDelta(delta = {}) {
  Object.entries(delta).forEach(([key, value]) => {
    if (key === "branchCount") {
      currentSignals[key] = Math.max(0, (currentSignals[key] || 0) + value);
      return;
    }

    currentSignals[key] = clamp(Math.round((currentSignals[key] || 0) + value), 0, 100);
  });

  renderSignals(currentSignals);
}

function resetSimulation() {
  currentRound = 0;
  playableStepCountSnapshot = 0;
  sandboxStarted = false;
  activeCompleteEvidenceStep = 0;
  directBuildActive = false;
  clearDoorwayFeedbackHold();
  clearRpgStoryboardStep();
  sandboxCompleted = false;
  clearBubbles();
  currentSignals = structuredClone(simulation.signals);
  resetSimulationRng("idle-reset");
  initializeAgentStates();
  renderBaseAgents();
  renderSignals(currentSignals);
  renderWaitingState();
}

function clearDoorwayFeedbackHold() {
  doorwayFeedbackHold = null;
}

function captureDoorwayFeedbackHold() {
  const hint = routeBoardHint?.textContent?.trim();
  if (!hint) return;
  doorwayFeedbackHold = {
    hint,
    roundLabel: roundLabel?.textContent || "",
    roundTitle: roundTitle?.textContent || ""
  };
}

function restoreDoorwayFeedbackHold() {
  if (!doorwayFeedbackHold || !ideaInput?.value.trim()) return false;
  setRouteBoardHint(doorwayFeedbackHold.hint);
  if (doorwayFeedbackHold.roundLabel) roundLabel.textContent = doorwayFeedbackHold.roundLabel;
  if (doorwayFeedbackHold.roundTitle) roundTitle.textContent = doorwayFeedbackHold.roundTitle;
  roastButton.disabled = false;
  roastButton.textContent = "丢给小人";
  nextRoundButton.disabled = true;
  nextRoundButton.textContent = "继续";
  return true;
}

function startRoaming() {
  window.clearInterval(roamTimer);
  roamTimer = window.setInterval(() => {
    if (sandboxStarted) return;
    if (stage?.classList.contains("route-board-stage")) {
      placeSoloWalkerAtRouteStep(0);
      return;
    }

    agentNodes.forEach((node) => {
      if (node.querySelector(".bubble")) return;
      if (node.classList.contains("is-walking")) return;
      if (ambientChance(sandboxStarted ? 0.82 : 0.68)) return;

      const activity = ambientRandomFrom(idleActivities);
      const action = activityToAction(activity);
      setActivity(node, activity);

      if (ambientChance(0.45)) {
        const target = pickAmbientTargetForAction(action);
        moveAgent(node, target.x, target.y, node.dataset.intent || "路过", action);
      }
    });
  }, 3200);
}

function alertAgents() {
  const visibleAgents = isSoloWalkerStageMode("run")
    ? [...agentNodes.entries()].filter(([id]) => id === SOLO_PROTAGONIST_ID)
    : [...agentNodes.entries()];

  visibleAgents.forEach(([, node], index) => {
    window.setTimeout(() => {
      node.classList.add("is-alert");
      if (isSoloWalkerStageMode("run")) {
        setActivity(node, "出发");
        window.setTimeout(() => node.classList.remove("is-alert"), 1000);
        return;
      }
      const startPoint = isSoloWalkerStageMode("run") ? getSoloWalkerRouteTarget(0) : null;
      const x = startPoint?.x || randomBetween(28, 72);
      const y = startPoint?.y || randomBetween(28, 70);
      const activity = index % 2 === 0 ? "围观" : "犹豫";
      setActivity(node, activity);
      moveAgent(node, x, y, activity, activityToAction(activity));
      window.setTimeout(() => node.classList.remove("is-alert"), 1000);
    }, index * 90);
  });
}

function handleIdeaInput() {
  directBuildActive = false;
  setDirectBuildDisplayMode(false);

  if (doorwayFeedbackHold && ideaInput.value.trim()) {
    updateIdeaBoard(getIdeaTitle());
    restoreDoorwayFeedbackHold();
    window.clearTimeout(inputTimer);
    return;
  }

  if (doorwayFeedbackHold) {
    clearDoorwayFeedbackHold();
  }

  syncSimulationToCurrentInput();
  updateIdeaBoard(getIdeaTitle());
  renderPathCard(currentRound);
  updateDeepSeekShadowReadiness();
  window.clearTimeout(inputTimer);
  inputTimer = window.setTimeout(() => {
    if (!sandboxStarted && ideaInput.value.trim()) {
      appendLog("新 idea 出现在输入框里，几个小人抬头看了一眼。");
      alertAgents();
    }
  }, 420);
}

function initializeSeedInput() {
  if (!seedInput) return;
  seedInput.value = seedInput.value.trim() || generateSeedLabel();
  activeSeed = seedInput.value.trim();
}

function prepareSimulationSeed() {
  activeSeed = normalizeSeed(seedInput?.value) || generateSeedLabel();
  if (seedInput) seedInput.value = activeSeed;
  resetSimulationRng("run");
}

function resetSimulationRng(scope) {
  const ideaText = ideaInput?.value.trim() || simulation?.idea?.pitch || "empty-idea";
  const seedText = normalizeSeed(seedInput?.value) || activeSeed || "default";
  simulationRng = createSeededRandom(`${scope}::${ideaText}::${seedText}`);
}

function handleRandomSeed() {
  if (!seedInput) return;
  seedInput.value = generateSeedLabel();
  activeSeed = seedInput.value;
  resetSimulationRng("idle");
  initializeAgentStates();
  renderBaseAgents();
  renderPathCard(0);
  renderFrictionLibraryCard(0);
  renderBiteCard();
  renderResultCard(false);
  appendLog("换了一次随机性。下一次丢给小人会看到另一轮结果。");
}

function handleCaseChange() {
  if (!caseSelect || sandboxStarted) return;
  const nextCaseId = caseSelect.value;

  if (nextCaseId === CUSTOM_CASE_ID) {
    switchSimulationCase(nextCaseId, { resetIdea: true, resetSeed: true });
    appendLog("自己的想法入口已清空。");
    return;
  }

  switchSimulationCase(nextCaseId, { resetIdea: true, resetSeed: true });
  appendLog(`切换案例：${simulation.label || simulation.idea.name}。`);
}

function handleObserverCheckClick(event) {
  const button = event.target.closest(".observer-choice");
  if (!button || !observerCheckCard?.contains(button)) return;

  observerCheckCard.dataset.selected = button.dataset.value || "";
  observerCheckCard.querySelectorAll(".observer-choice").forEach((item) => {
    item.classList.toggle("is-selected", item === button);
  });

  const label = button.textContent.trim();
  appendLog(`观察者判断：${label}`);
}

function normalizeSeed(value) {
  return String(value || "").trim().slice(0, 32);
}

function generateSeedLabel() {
  const value = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  return `ir-${value}`;
}

function createSeededRandom(seedText) {
  let seed = hashString(seedText) || 1;

  return function seededRandom() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let next = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(text) {
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function getActionLabel(action) {
  return actionConfig[action]?.label || action;
}

function getEventLabel(event) {
  return frictionEventLabels[event] || eventTemplates.find((template) => template.event === event)?.label || event;
}

function getAgentSpriteProfile(agentId) {
  return demoSpriteProfiles[agentSpriteProfiles[agentId]];
}

function getSpritePose(action) {
  const specialActions = ["check_competitor", "misread_idea", "sketch_clone", "suggest_branch", "argue", "calculate_cost", "take_note", "think"];
  const walkActions = ["ignore_and_leave", "ambient_watch", "phone_scroll"];

  if (specialActions.includes(action)) return "special";
  if (walkActions.includes(action)) return "walk";
  return "idle";
}

function getRestSpritePose(action) {
  return getSpritePose(action) === "special" ? "special" : "idle";
}

function pickTargetForAction(action) {
  const zoneName = actionConfig[action]?.zone || "roam";
  const base = randomFrom(stageZones[zoneName] || stageZones.roam);
  return {
    x: randomBetween(base.x - 4, base.x + 4),
    y: randomBetween(base.y - 4, base.y + 4)
  };
}

function pickAmbientTargetForAction(action) {
  const zoneName = actionConfig[action]?.zone || "roam";
  const base = ambientRandomFrom(stageZones[zoneName] || stageZones.roam);
  return {
    x: ambientRandomBetween(base.x - 4, base.x + 4),
    y: ambientRandomBetween(base.y - 4, base.y + 4)
  };
}

function activityToAction(activity) {
  const activityMap = {
    看公告: "ambient_watch",
    闲聊: "share",
    查资料: "check_competitor",
    画分支: "suggest_branch",
    路过: "ambient_watch",
    发呆: "think",
    估成本: "calculate_cost",
    看热闹: "watch_idea",
    看手机: "phone_scroll",
    回短信: "phone_scroll",
    记笔记: "take_note",
    翻资料: "take_note",
    抱臂: "argue",
    围观: "watch_idea",
    犹豫: "think"
  };

  return activityMap[activity] || "ambient_watch";
}

function randomBetween(min, max) {
  return Math.round((min + simulationRng() * (max - min)) * 10) / 10;
}

function randomInt(min, max) {
  return Math.floor(min + simulationRng() * (max - min + 1));
}

function randomFrom(items) {
  return items[Math.floor(simulationRng() * items.length)];
}

function chance(probability) {
  return simulationRng() < probability;
}

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(simulationRng() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function weightedPick(items, weightFn) {
  const weights = items.map((item) => Math.max(0, weightFn(item)));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) return randomFrom(items);

  let cursor = simulationRng() * total;

  for (let index = 0; index < items.length; index += 1) {
    cursor -= weights[index];
    if (cursor <= 0) return items[index];
  }

  return items[items.length - 1];
}

function weightedPickMany(items, count, weightFn) {
  const picked = [];
  const pool = [...items];

  while (picked.length < count && pool.length > 0) {
    const item = weightedPick(pool, weightFn);
    picked.push(item);
    pool.splice(pool.indexOf(item), 1);
  }

  return picked;
}

function ambientRandomBetween(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

function ambientRandomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function ambientChance(probability) {
  return Math.random() < probability;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

roastButton.addEventListener("click", startSandbox);
nextRoundButton.addEventListener("click", handleNextRoundClick);
resetButton.addEventListener("click", resetSimulation);
caseSelect?.addEventListener("change", handleCaseChange);
randomSeedButton?.addEventListener("click", handleRandomSeed);
observerCheckCard?.addEventListener("click", handleObserverCheckClick);
ideaInput.addEventListener("input", handleIdeaInput);
routeBoard?.addEventListener("click", handleRouteBoardNodeClick);
routeBoard?.addEventListener("keydown", handleRouteBoardNodeKeydown);
deepSeekShadowToggle?.addEventListener("change", updateDeepSeekShadowReadiness);
deepSeekDoorwayToggle?.addEventListener("change", updateDeepSeekShadowReadiness);
deepSeekPacketToggle?.addEventListener("change", updateDeepSeekShadowReadiness);
deepSeekPacketStagePreviewToggle?.addEventListener("change", updateDeepSeekShadowReadiness);

window.applyAgentStateUpdate = applyAgentStateUpdate;
window.addEventListener("idearoast:agent-state-update", (event) => {
  const detail = event.detail || {};
  if (!detail.update) return;
  applyAgentStateUpdate(detail.update, detail.options || {});
});

loadSimulation();
