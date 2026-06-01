const COMMON_AGENTS = [
  { id: "ajie", name: "阿杰", role: "独立开发者", temper: "警惕平台级大坑", state: "路过", x: 23, y: 52, color: "teal", look: "glasses", activity: "看手机" },
  { id: "linran", name: "林然", role: "自由设计师", temper: "先看好不好玩", state: "路过", x: 77, y: 52, color: "rose", look: "cap", activity: "回短信" },
  { id: "xiaochen", name: "小人", role: "学生", temper: "喜欢展示型工具", state: "路过", x: 44, y: 81, color: "amber", look: "blank", activity: "发呆" },
  { id: "laozhou", name: "老周", role: "怀疑者", temper: "先泼冷水", state: "路过", x: 56, y: 81, color: "gray", look: "bald", activity: "抱臂" },
  { id: "mapfan", name: "地图控", role: "地图爱好者", temper: "对地图、信息关系和展示感敏感", state: "路过", x: 31, y: 66, color: "blue", look: "visor", activity: "看地球" },
  { id: "pm", name: "若琪", role: "产品人", temper: "会追问使用场景", state: "路过", x: 69, y: 66, color: "violet", look: "sharp", activity: "记笔记" },
  { id: "searcher", name: "查证员", role: "竞品搜索者", temper: "先去找有没有人做过", state: "路过", x: 37, y: 76, color: "green", look: "glasses", activity: "查资料" },
  { id: "budget", name: "小赵", role: "成本敏感用户", temper: "听到长期维护就皱眉", state: "路过", x: 63, y: 76, color: "orange", look: "tired", activity: "算成本" }
];

const FRICTION_SIGNALS = {
  heat: 38,
  confusion: 24,
  cloneRisk: 22,
  techPressure: 48,
  replacementPressure: 38,
  branchCount: 0
};

const FRICTION_LIBRARY = {
  expression_first_step: {
    id: "expression_first_step",
    label: "表达/第一步摩擦",
    role: "听不懂的人",
    whatItCatches: "用户听完不知道这是给谁用、第一步要做什么，或把重点听歪。",
    whenToUse: ["一句话塞了太多卖点", "目标像愿景但缺少第一个动作", "用户对象和入口不清楚"],
    avoidSaying: ["直接替用户做产品定位", "用咨询腔复述愿景", "还没听懂就给复杂方案"],
    evidencePolicy: "opinion",
    defaultState: {
      agentId: "linran",
      action: "misread_idea",
      emotion: "confused",
      event: "expression_friction",
      signalDelta: { confusion: 14, heat: -2 }
    }
  },
  real_demand_pain: {
    id: "real_demand_pain",
    label: "真实需求/痛感摩擦",
    role: "不够痛的人",
    whatItCatches: "想法看起来有用，但目标用户可能没有强到愿意换习惯、付钱或持续使用的痛点。",
    whenToUse: ["用户问题可能只是好奇或新鲜感", "已有低成本替代行为", "付费动机不清楚"],
    avoidSaying: ["一上来否定想法", "把个人不需要说成所有人不需要", "不区分兴趣和痛点"],
    evidencePolicy: "opinion",
    defaultState: {
      agentId: "laozhou",
      action: "ignore_and_leave",
      emotion: "indifferent",
      event: "demand_friction",
      signalDelta: { heat: -6, replacementPressure: 4 }
    }
  },
  execution_dependency: {
    id: "execution_dependency",
    label: "执行/依赖摩擦",
    role: "工程执行者",
    whatItCatches: "看得见的界面能做，但关键依赖、权限、数据、流程或维护会拖大工程。",
    whenToUse: ["需要数据源/API/上传/导入", "依赖外部平台或人工维护", "第一版容易变成系统工程"],
    avoidSaying: ["只说技术上可行", "忽略权限和数据来源", "把手动验证直接做成完整系统"],
    evidencePolicy: "opinion",
    defaultState: {
      agentId: "ajie",
      action: "sketch_clone",
      emotion: "skeptical",
      event: "execution_friction",
      signalDelta: { techPressure: 10, branchCount: 1 }
    }
  },
  cost_maintenance: {
    id: "cost_maintenance",
    label: "成本/维护摩擦",
    role: "成本敏感者",
    whatItCatches: "时间、钱、token、人工审核、客服、更新频率和长期维护成本会吃掉第一版。",
    whenToUse: ["长文本/实时数据/多轮 AI", "需要持续更新", "个人或小团队资源有限"],
    avoidSaying: ["为了省成本砍掉核心体验", "只算开发成本不算维护", "把低成本等同低体验"],
    evidencePolicy: "opinion",
    defaultState: {
      agentId: "budget",
      action: "calculate_cost",
      emotion: "anxious",
      event: "cost_friction",
      signalDelta: { techPressure: 8, heat: -2 }
    }
  },
  evidence_replacement: {
    id: "evidence_replacement",
    label: "查证/替代品摩擦",
    role: "查证者",
    whatItCatches: "想法可能撞到竞品、替代路径或已有习惯，但必须区分怀疑、待查证和已证实。",
    whenToUse: ["方向已有成熟品类", "用户声称很新", "需要判断差异点是否真实"],
    avoidSaying: ["无证据说类似工具很多", "把猜测说成事实", "把没查过的竞品当结论"],
    evidencePolicy: "needs_check_or_verified",
    defaultState: {
      agentId: "searcher",
      action: "check_competitor",
      emotion: "skeptical",
      event: "replacement_friction",
      signalDelta: { replacementPressure: 12, cloneRisk: 10 }
    }
  },
  acquisition_reach: {
    id: "acquisition_reach",
    label: "获客/触达摩擦",
    role: "找用户的人",
    whatItCatches: "产品即使有用，也可能找不到第一批愿意试、愿意付钱、愿意反馈的人。",
    whenToUse: ["目标用户不具体", "依赖内容分发/社群/销售", "个人产品需要找到前 10 个用户"],
    avoidSaying: ["只说做出来就会有人用", "把流量当默认资源", "不问用户从哪里来"],
    evidencePolicy: "opinion",
    defaultState: {
      agentId: "pm",
      action: "take_note",
      emotion: "skeptical",
      event: "acquisition_friction",
      signalDelta: { heat: -2, branchCount: 1 }
    }
  },
  trust_permission_risk: {
    id: "trust_permission_risk",
    label: "信任/权限/风险摩擦",
    role: "谨慎用户",
    whatItCatches: "用户可能不愿交出数据、笔记、账号、隐私、决策权或敏感内容。",
    whenToUse: ["需要上传个人资料/内容", "涉及隐私/版权/安全", "AI 输出会影响用户判断"],
    avoidSaying: ["默认用户愿意授权", "淡化隐私和版权", "用功能好用掩盖信任成本"],
    evidencePolicy: "opinion",
    defaultState: {
      agentId: "xiaochen",
      action: "think",
      emotion: "anxious",
      event: "trust_friction",
      signalDelta: { confusion: 6, techPressure: 4 }
    }
  },
  retention_cooling: {
    id: "retention_cooling",
    label: "留存/冷却摩擦",
    role: "冷却/离场者",
    whatItCatches: "第一眼有趣不等于第二天回来，新鲜感、习惯和付费意愿会冷掉。",
    whenToUse: ["靠新奇感吸引点击", "需要持续使用", "行为改变比功能更难"],
    avoidSaying: ["把第一次喜欢当留存", "只看点击不看回访", "忽略用户原本习惯"],
    evidencePolicy: "opinion",
    defaultState: {
      agentId: "laozhou",
      action: "ignore_and_leave",
      emotion: "indifferent",
      event: "retention_friction",
      signalDelta: { heat: -7, replacementPressure: 5, branchCount: 1 }
    }
  },
  scope_creep: {
    id: "scope_creep",
    label: "范围蔓延/项目漂移摩擦",
    role: "砍范围的人",
    whatItCatches: "MVP 很容易从一个验证动作膨胀成平台、系统、账号、后台和完整工作流。",
    whenToUse: ["想法同时包含很多模块", "第一版想做完整闭环", "做着做着会偏离最小验证"],
    avoidSaying: ["把完整系统当第一版", "为了显得专业加后台/账号/自动化", "忘记最小验证动作"],
    evidencePolicy: "opinion",
    defaultState: {
      agentId: "ajie",
      action: "suggest_branch",
      emotion: "skeptical",
      event: "scope_friction",
      signalDelta: { techPressure: 8, branchCount: 1 }
    }
  },
  organization_alignment: {
    id: "organization_alignment",
    label: "组织/协作摩擦",
    role: "协作拦路人",
    whatItCatches: "团队、老板、客户、审批、交接和责任边界会让想法在组织里变形。",
    whenToUse: ["面向公司/团队/客户流程", "需要多人协作或审批", "责任归属和交付边界不清"],
    avoidSaying: ["只看个人使用体验", "忽略审批链", "不问谁负责执行和维护"],
    evidencePolicy: "opinion",
    defaultState: {
      agentId: "pm",
      action: "argue",
      emotion: "skeptical",
      event: "organization_friction",
      signalDelta: { confusion: 6, techPressure: 5 }
    }
  }
};

window.FRICTION_LIBRARY = FRICTION_LIBRARY;

window.FRICTION_PACKET_SCHEMA = {
  version: "0.1",
  requiredCaseFields: ["id", "label", "idea", "clarityGate", "path", "selectedFrictionIds", "frictionBites", "verdict"],
  requiredBiteFields: [
    "id",
    "frictionId",
    "stepNumber",
    "stepTitle",
    "frictionType",
    "currentSurvivingRoute",
    "agentAttempt",
    "realityFeedback",
    "burden",
    "routeChange",
    "verdict",
    "nextMove",
    "lens",
    "agentId",
    "event",
    "evidenceStatus",
    "bubble",
    "plainTake",
    "friction",
    "mutation",
    "branch",
    "signalDelta"
  ],
  clarityStatuses: ["ready", "usable", "needs_definition", "reality_review", "scope_review", "boundary_review", "blocked"],
  preflightStopStatuses: ["reality_review", "scope_review", "boundary_review", "blocked"],
  evidenceStatuses: ["opinion", "needs_check", "verified"],
  frictionLibraryFields: ["id", "label", "role", "whatItCatches", "whenToUse", "avoidSaying", "evidencePolicy", "defaultState"],
  routeVerdicts: ["continue", "mutate", "branch", "stop"],
  note: "Cases choose five selectedFrictionIds from FRICTION_LIBRARY when they can run. blocked and boundary_review stop before frictionBites. Runnable bites are low-cost substitute preview steps: attempt, reality feedback, burden, route change, verdict, next move. Little-person bubble/plainTake should be human speech. Checkers cannot claim competitor facts unless evidenceStatus is verified."
};

function buildLocalFrictionPacketV0(rawInput, options = {}) {
  const input = normalizeIdeaInput(rawInput);
  const name = inferIdeaName(input);
  const safety = classifySafetyBoundary(input);

  if (safety.status === "blocked" || safety.status === "boundary_review") {
    return createStoppedPacket(input, name, safety);
  }

  const reality = classifyRealityPremise(input);
  if (reality.status === "reality_review") {
    return createStoppedPacket(input, name, reality);
  }

  const scope = classifyScopePremise(input);
  if (scope.status === "scope_review") {
    return createStoppedPacket(input, name, scope);
  }

  const directBuildTask = inferDirectBuildTask(input);
  if (directBuildTask && !options.forceTryWalk) {
    return createDirectBuildPacket(input, name, directBuildTask);
  }

  const doorway = classifyDoorwaySanity(input);
  if (doorway.status === "needs_definition") {
    return createDefinitionPacket(input, name, doorway);
  }
  if (doorway.status === "reality_review" || doorway.status === "scope_review" || doorway.status === "boundary_review") {
    return createStoppedPacket(input, name, doorway);
  }

  const clarity = classifyIdeaClarity(input);

  if (clarity.status === "needs_definition") {
    return createDefinitionPacket(input, name, clarity);
  }

  const profile = inferIdeaProfile(input);
  const selectedFrictionIds = selectLocalFrictionIds(input, profile);

  return createRunnablePacket(input, name, clarity, profile, selectedFrictionIds);
}

function normalizeIdeaInput(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function inferIdeaName(input) {
  if (/(AI|即梦|生成).*(小猫|猫).*(视频|短视频)|小猫.*(视频|短视频).*(带货|流量)/i.test(input)) return "AI 小猫视频流量工具";
  if (/贾维斯|jarvis/i.test(input) && /控制电脑|语音/.test(input)) return "类 Jarvis 电脑 AI";
  if (/教.*Excel.*短视频|Excel.*短视频/.test(input)) return "Excel 教学短视频";
  if (/猫咪?自动喂食器|自动喂食器/.test(input)) return "猫咪自动喂食器";
  if (/租房.*房源.*表格|房源.*表格/.test(input)) return "房源比较表格";
  if (/AI.*简历|简历.*AI/.test(input)) return "AI 简历修改器";

  const cleaned = input
    .replace(/^我想(要)?/, "")
    .replace(/^(做|开|卖|开发|打造|搞)/, "")
    .replace(/^(一个|一款|一家|一套)/, "")
    .split(/[。！？?]/)[0]
    .trim();

  const title = cleaned || input || "自定义 idea";
  return title.length > 18 ? `${title.slice(0, 18)}...` : title;
}

function extractIdeaAnchors(input, name = inferIdeaName(input)) {
  const fallback = {
    ideaObject: name,
    coreAction: "完成一个最小动作",
    deliveryMode: "",
    targetScene: "",
    concreteNarrowMove: "",
    validationAction: "",
    biggestBlocker: "",
    survivalReason: "",
    abandonedRoutes: [],
    branchOptions: [],
    routeByFriction: {}
  };

  const mentionsJarvis = /贾维斯|jarvis/i.test(input);
  const mentionsJarvisControl = /控制电脑|语音控制|语音/.test(input);
  const mentionsNewsRoute = /新闻|大事|摘要|搜索/.test(input);

  if (mentionsJarvis && mentionsJarvisControl && !mentionsNewsRoute) {
    return {
      ideaObject: "小 Jarvis 电脑控制工具",
      coreAction: "语音控制电脑执行一个固定动作",
      deliveryMode: "语音指令 + 本机动作",
      targetScene: "电脑重度用户想少点几步完成一个固定操作",
      concreteNarrowMove: "只做“语音控制电脑执行一个固定动作”的窄版本",
      validationAction: "找 3 个电脑重度用户，让他们用一句语音触发一个安全白名单动作，比如打开指定软件或执行一个快捷键，看他们第二天还会不会再用。",
      biggestBlocker: "最大卡点是电脑控制权限和动作安全边界，不是完整 Jarvis 愿景。",
      survivalReason: "它放下了完整电脑系统、自学习和通用控制，只保留“语音 -> 一个固定安全动作”这个能低成本验证的交付物。",
      abandonedRoutes: [
        {
          title: "完整 Jarvis 电脑系统",
          reason: "权限、长期记忆、自学习和全局控制太重，第一版先不碰。"
        },
        {
          title: "通用电脑控制路线",
          reason: "可控性和误操作风险太高，先缩到一个白名单动作。"
        },
        {
          title: "自学习助手路线",
          reason: "隐私、数据和持续维护压力太大，暂时放下。"
        }
      ],
      branchOptions: [
        {
          title: "固定动作语音助手",
          whyAlive: "只做一个电脑操作，可以先绕开通用 Jarvis 的范围膨胀。"
        },
        {
          title: "Jarvis 风格 UI 演示",
          whyAlive: "不碰系统权限，只验证用户是否喜欢这种交互感。"
        },
        {
          title: "本地资料问答助手",
          whyAlive: "把控制电脑换成问答，也能保留助手感但降低权限风险。"
        }
      ],
      routeByFriction: {
        execution_dependency: "先不做完整 Jarvis，只验证“语音控制电脑执行一个固定动作”这一件事能不能稳定完成。",
        trust_permission_risk: "第一版只开放一个白名单动作，让用户看得见它做了什么、能随时撤回。",
        cost_maintenance: "先用现成语音识别和脚本手动串起来，别先做完整系统。",
        evidence_replacement: "只比较“语音触发一个固定电脑动作”是否比快捷键或启动器更顺手。",
        scope_creep: "只做“语音控制电脑执行一个固定动作”的窄版本。",
        retention_cooling: "让用户第二天还愿意用语音触发同一个固定动作。"
      }
    };
  }

  if (mentionsJarvis && mentionsJarvisControl) {
    return {
      ideaObject: "类 Jarvis 电脑 AI",
      coreAction: "语音搜索当天新闻并读出摘要",
      deliveryMode: "语音 + 文字回答",
      targetScene: "电脑重度用户想不用打开网页就听到当天新闻摘要",
      concreteNarrowMove: "只做“语音搜索当天新闻并读出摘要”的窄版本",
      validationAction: "找 3 个电脑重度用户，现场让他们用一句语音问今天新闻，你手动或半自动返回一段文字 + 声音摘要，看他们第二天还会不会再问。",
      biggestBlocker: "最大卡点是电脑控制权限和新闻摘要这一件事的可信度，不是完整 Jarvis 愿景。",
      survivalReason: "它避开了完整控制电脑和自学习助手的重成本，只保留“语音问新闻 -> 得到可听摘要”这个能低成本验证的动作。",
      abandonedRoutes: [
        {
          title: "完整语音控制电脑路线",
          reason: "权限和安全边界太重，第一版先不碰。"
        },
        {
          title: "自学习通用 AI 助手路线",
          reason: "记忆、隐私和长期维护范围过大，低成本试走撑不住。"
        },
        {
          title: "新闻搜索 + 文字 + 语音全自动路线",
          reason: "先放下全自动，只保留半自动摘要交付。"
        }
      ],
      branchOptions: [
        {
          title: "半自动新闻摘要助手",
          whyAlive: "不用先做完整控制电脑，也能验证用户是否真的想用语音获得新闻摘要。"
        },
        {
          title: "单一电脑动作语音助手",
          whyAlive: "只做一个固定电脑操作，可以先绕开通用 Jarvis 的范围膨胀。"
        },
        {
          title: "每日语音播报小工具",
          whyAlive: "不控制电脑，只验证新闻获取和朗读这条轻路线。"
        }
      ],
      routeByFriction: {
        execution_dependency: "先不做完整 Jarvis，只验证“语音搜索当天新闻并读出摘要”这一件事能不能被用户接受。",
        trust_permission_risk: "第一版只请求完成新闻搜索和朗读所需的最小权限。",
        cost_maintenance: "先用手动或半自动方式完成一次“语音提问 -> 搜索新闻 -> 读出摘要”。",
        evidence_replacement: "只保留现有搜索工具没处理好的细节：不用打开网页，直接听到一段可用摘要。",
        scope_creep: "只做“语音搜索当天新闻并读出摘要”的窄版本。",
        retention_cooling: "让用户第二天还愿意用语音再问一次当天新闻。"
      }
    };
  }

  if (/AI.*读书陪练|读书陪练/i.test(input)) {
    return {
      ideaObject: "AI 读书陪练",
      coreAction: "陪用户读完一页内容并问一个问题",
      deliveryMode: "读书提问工具",
      targetScene: "正在读书但容易读完就忘的人",
      concreteNarrowMove: "只做“一页内容读完后问一个问题”的读书陪练",
      validationAction: "找 3 个正在读书的人，让他们读完一页内容后回答一个追问，看第二天是否愿意回来改一张卡。",
      biggestBlocker: "最大卡点是用户是否愿意继续读和回来回答问题，不是 AI 能不能总结整本书。",
      survivalReason: "它避开了整本书导入和完整学习系统，只保留“一页内容读完后问一个问题”这个最小互动。",
      abandonedRoutes: [
        {
          title: "完整导入整本书路线",
          reason: "入口太重，用户第一步不一定愿意上传或整理整本书。"
        },
        {
          title: "泛泛聊天式陪读路线",
          reason: "容易变成普通 AI 问答，读书陪练的差异会被冲淡。"
        },
        {
          title: "全流程学习系统路线",
          reason: "书库、提醒、卡片和长期记录会把第一版维护成本拉高。"
        }
      ],
      branchOptions: [
        {
          title: "一页一问陪读",
          whyAlive: "只陪用户读完一页并问一个问题，是最轻的互动闭环。"
        },
        {
          title: "读后复述检查",
          whyAlive: "不陪读，只检查用户是否真的读懂，成本更低。"
        },
        {
          title: "章节卡片陪练",
          whyAlive: "把陪读压成章节后的 3 个问题，仍保留读书场景。"
        }
      ],
      routeByFriction: {
        expression_first_step: "先把 AI 读书陪练压成“一页内容读完后问一个问题”。",
        execution_dependency: "MVP 只接收用户粘贴的一页内容，不做整本书库和导入。",
        cost_maintenance: "每次只生成 1 个追问和 1 张简单复习卡，控制成本。",
        trust_permission_risk: "只处理用户主动粘贴的一页内容，不保存书库和长期笔记。",
        evidence_replacement: "只保留普通总结工具没处理好的细节：读完以后被问一个扎心问题。",
        retention_cooling: "只做“一页内容读完后问一个问题”的读书陪练。",
        scope_creep: "只做“一页内容读完后问一个问题”的读书陪练。"
      }
    };
  }

  if (/Excel.*短视频|教.*Excel.*短视频/.test(input)) {
    return {
      ideaObject: "Excel 教学短视频",
      coreAction: "用一分钟解决一个具体 Excel 场景",
      deliveryMode: "短视频账号",
      targetScene: "经常被 Excel 小问题卡住的职场人",
      concreteNarrowMove: "先做“一个具体 Excel 场景的一分钟解决视频”",
      validationAction: "找 5 个经常用 Excel 的人，先给他们看 1 条一分钟场景视频，看他们是否收藏、转发或追问下一题。",
      biggestBlocker: "最大卡点是选题是否具体到一个 Excel 场景，而不是泛泛教 Excel。",
      survivalReason: "它放下了泛泛教 Excel 的账号路线，只保留一个具体场景和一分钟解决动作。",
      abandonedRoutes: [
        {
          title: "泛泛 Excel 教学账号路线",
          reason: "题目太散，第一批观众很难知道为什么关注。"
        },
        {
          title: "完整课程路线",
          reason: "交付太重，第一版不适合先做大课。"
        }
      ],
      branchOptions: [
        {
          title: "一分钟场景解决视频",
          whyAlive: "只解决一个 Excel 场景，观众能立刻判断有没有用。"
        },
        {
          title: "职场表格急救栏目",
          whyAlive: "围绕真实表格卡点，比泛泛教学更容易被收藏。"
        }
      ],
      routeByFriction: {
        expression_first_step: "先把账号压成“一个 Excel 场景的一分钟解决视频”。",
        acquisition_reach: "先从一个明确场景找第一批 Excel 用户，比如表格汇总、筛选或公式出错。",
        real_demand_pain: "只做一个今天就会卡住人的 Excel 小问题。",
        evidence_replacement: "先做“一个具体 Excel 场景的一分钟解决视频”，只抓现有教程没讲清的一步。",
        retention_cooling: "先做“一个具体 Excel 场景的一分钟解决视频”。"
      }
    };
  }

  if (/宠物用品品牌|宠物用品/.test(input)) {
    return {
      ideaObject: "宠物用品品牌",
      coreAction: "验证一种宠物用品的具体使用痛点",
      deliveryMode: "宠物用品品牌",
      targetScene: "有明确宠物用品痛点的养宠人",
      concreteNarrowMove: "先验证“某一种宠物用品的一个具体使用痛点”",
      validationAction: "找 5 个养宠人，只问一种宠物用品的一个具体痛点，并用图片或假样品测试他们是否愿意问价格。",
      biggestBlocker: "最大卡点是先选出一种宠物用品和一个真实使用痛点，而不是先做品牌。",
      survivalReason: "它避开了先做品牌和备货的重路线，只保留一种用品里的一个真实使用痛点。",
      abandonedRoutes: [
        {
          title: "宠物用品品牌路线",
          reason: "品牌、供应链和库存太重，第一版先放下。"
        },
        {
          title: "多品类上新路线",
          reason: "品类一多就看不清哪个痛点是真的。"
        }
      ],
      branchOptions: [
        {
          title: "单一用品痛点验证",
          whyAlive: "只看一种用品的一个使用痛点，能快速判断需求。"
        },
        {
          title: "图片/假样品预售测试",
          whyAlive: "不用先备货，也能看养宠人是否会问价格。"
        }
      ],
      routeByFriction: {
        execution_dependency: "先不做宠物用品品牌，只选一种用品和一个使用痛点。",
        cost_maintenance: "先用图片、样品或代工询价验证一种用品，不先备货。",
        trust_permission_risk: "先证明这个用品对宠物安全、材质可信、场景明确。",
        evidence_replacement: "只保留现有宠物用品没解决好的一个痛点。",
        retention_cooling: "先验证“某一种宠物用品的一个具体使用痛点”。"
      }
    };
  }

  if (/(AI|即梦|生成).*(小猫|猫).*(视频|短视频)|小猫.*(视频|短视频).*(带货|流量)|AI.*(视频|短视频).*(带货|流量)/i.test(input)) {
    return {
      ideaObject: "AI 小猫视频流量工具",
      coreAction: "从选题到剪辑跑通一条 AI 小猫视频",
      deliveryMode: "短视频工具链",
      targetScene: "想用 AI 小猫视频博流量或测试带货内容的人",
      concreteNarrowMove: "先手动跑通 3 条同主题 AI 小猫视频",
      validationAction: "先用现成工具手动做 3 条同主题 AI 小猫视频，看完播、评论、收藏和商品点击，再决定要不要做全集成。",
      biggestBlocker: "最大卡点不是能不能生成小猫视频，而是这个小猫内容模板有没有持续流量。",
      survivalReason: "它避开了全集成自动化和多平台矩阵，只保留 3 条同主题 AI 小猫视频来验证内容模板。",
      abandonedRoutes: [
        {
          title: "全集成自动化视频工具路线",
          reason: "选题、文案、生成、剪辑和标题全自动太重，第一版先放下。"
        },
        {
          title: "直接带货路线",
          reason: "商品、素材授权和平台规则会干扰流量模板验证。"
        }
      ],
      branchOptions: [
        {
          title: "同主题 AI 小猫短视频",
          whyAlive: "先看内容模板有没有完播、评论和收藏。"
        },
        {
          title: "不挂商品的流量版",
          whyAlive: "先验证流量，再单独测试带货表达。"
        }
      ],
      routeByFriction: {
        execution_dependency: "先手动串起选题、文案、生成、剪辑和标题，跑通 1 条 AI 小猫视频。",
        acquisition_reach: "先固定一个平台、一个账号和一个小猫内容模板。",
        cost_maintenance: "先记录 3 条小猫视频从选题到发布前的总耗时和工具额度。",
        trust_permission_risk: "先做不挂商品的流量版，再单独测试一个低风险品类。",
        retention_cooling: "先手动跑通 3 条同主题 AI 小猫视频。"
      }
    };
  }

  if (/开源项目.*商业化|商业化机会.*开源项目/.test(input)) {
    return {
      ideaObject: "开源项目商业化机会工具",
      coreAction: "给一个开源项目做一页商业化机会清单",
      deliveryMode: "项目机会整理工具",
      targetScene: "维护者想知道自己的开源项目能不能收钱",
      concreteNarrowMove: "先手动给一个开源项目做 1 页商业化机会清单",
      validationAction: "找 3 个有开源项目的维护者，用他们的 README、issue 和用户场景手动做 1 页机会清单，看他们是否愿意约第二次或付费继续深挖。",
      biggestBlocker: "最大卡点是维护者是否真的愿意围绕项目商业化行动，而不是只觉得清单有趣。",
      survivalReason: "它避开了自动分析平台和完整商业化顾问路线，只保留给一个开源项目做 1 页机会清单来验证维护者是否买账。",
      abandonedRoutes: [
        {
          title: "开源商业化平台路线",
          reason: "项目分析、市场数据和推荐系统太重，第一版先放下。"
        },
        {
          title: "完整商业顾问路线",
          reason: "咨询交付太长，先验证维护者是否要一页清单。"
        }
      ],
      branchOptions: [
        {
          title: "1 页商业化机会清单",
          whyAlive: "只围绕一个项目列出可卖服务、托管、模板或赞助入口，维护者能立刻判断有没有用。"
        },
        {
          title: "开源项目商业化访谈",
          whyAlive: "先用人工访谈找真实付费路径，不急着做工具。"
        }
      ],
      routeByFriction: {
        expression_first_step: "先不做工具，先把一个开源项目压成 1 页商业化机会清单。",
        execution_dependency: "先手动读 README、issue 和用户场景，不做自动扫描平台。",
        cost_maintenance: "先记录做 1 页商业化机会清单要花多少时间，不先搭数据管道。",
        evidence_replacement: "只保留通用创业建议没处理好的细节：这个开源项目具体能卖什么。",
        retention_cooling: "让维护者看完清单后一周内愿意继续补资料或约第二次。"
      }
    };
  }

  if (/语音控制.*电脑.*(打开|软件)|控制电脑.*(打开|软件).*小工具|打开软件.*(语音|电脑)/.test(input)) {
    return {
      ideaObject: "语音控制电脑打开软件的小工具",
      coreAction: "用一句语音打开一个指定软件",
      deliveryMode: "本机小工具",
      targetScene: "电脑重度用户想少点几步打开常用软件",
      concreteNarrowMove: "只做“语音打开一个指定软件”的窄版本",
      validationAction: "找 3 个电脑重度用户，只让他们用语音打开一个常用软件，连续 3 天看他们是否还愿意用。",
      biggestBlocker: "最大卡点是电脑权限、误操作和它是否真的比快捷键更顺手。",
      survivalReason: "它放下了完整电脑控制和通用助手，只保留“语音打开一个指定软件”这个能低成本验证的交付物。",
      abandonedRoutes: [
        { title: "完整电脑控制路线", reason: "权限和误操作风险太重，第一版先放下。" },
        { title: "通用语音助手路线", reason: "范围太散，会遮住一个固定动作是否有用。" }
      ],
      branchOptions: [
        { title: "语音打开指定软件", whyAlive: "只做一个白名单动作，权限和风险都最小。" },
        { title: "快捷键触发版", whyAlive: "先绕开语音识别，验证这个动作本身有没有价值。" }
      ],
      routeByFriction: {
        execution_dependency: "先只跑通“语音打开一个指定软件”这一段，不碰完整电脑控制。",
        trust_permission_risk: "第一版只允许白名单软件，并在执行前让用户看见动作。",
        cost_maintenance: "先用现成语音识别和本地脚本串起来，不做常驻大助手。",
        evidence_replacement: "只比较它是否比快捷键、启动器或系统搜索更顺手。",
        scope_creep: "只做“语音打开一个指定软件”的窄版本。"
      }
    };
  }

  if (/独立开发者.*(拆|梳理).*MVP|拆.*MVP.*独立开发者|MVP.*工具/.test(input)) {
    return {
      ideaObject: "独立开发者 MVP 拆解工具",
      coreAction: "把一个小产品想法拆成第一版可运行交付物",
      deliveryMode: "AI 工具",
      targetScene: "独立开发者脑子里有想法但不知道第一版该砍到哪里",
      concreteNarrowMove: "先做“输入一句想法 -> 输出一个第一版交付物和一个验证动作”的窄版本",
      validationAction: "找 3 个独立开发者，用他们真实想法手动生成第一版交付物和验证动作，看他们是否愿意照着做第一步。",
      biggestBlocker: "最大卡点是输出是否能让开发者立刻少做东西，而不是分析是否全面。",
      survivalReason: "它避开了完整创业顾问和项目管理平台，只保留拆 MVP 这一件能当场验证的小动作。",
      abandonedRoutes: [
        { title: "完整创业咨询工具", reason: "商业模式、竞品、财务和路线图太重，第一版先放下。" },
        { title: "项目管理平台路线", reason: "任务、协作和进度管理会冲淡拆 MVP 的核心价值。" }
      ],
      branchOptions: [
        { title: "一句话拆 MVP", whyAlive: "只把想法压到第一版交付物，用户马上能判断有没有用。" },
        { title: "人工拆解服务", whyAlive: "先手动给开发者拆 3 个想法，再决定要不要工具化。" }
      ],
      routeByFriction: {
        expression_first_step: "先把工具压成“一句话想法 -> 第一版交付物”。",
        execution_dependency: "先手动生成拆解结果，不做完整自动化顾问。",
        cost_maintenance: "先验证单次拆解是否有价值，再考虑模型成本。",
        evidence_replacement: "只保留普通创业建议没处理好的细节：到底第一版先做什么。",
        scope_creep: "只做“输入一句想法 -> 输出一个第一版交付物和验证动作”的窄版本。"
      }
    };
  }

  if (/开源项目.*README.*(使用教程|教程)|README.*(自动)?整理成使用教程|README.*教程/.test(input)) {
    return {
      ideaObject: "README 自动整理成使用教程的开源项目工具",
      coreAction: "把一个 README 整理成一页新手使用教程",
      deliveryMode: "开源项目文档工具",
      targetScene: "开源项目维护者想让新用户更快跑起来",
      concreteNarrowMove: "先做“README -> 一页新手使用教程”的窄版本",
      validationAction: "找 3 个开源项目维护者，手动把他们的 README 整理成一页教程，看他们是否愿意放进文档或继续补资料。",
      biggestBlocker: "最大卡点是教程是否真的帮新用户跑起来，而不是摘要写得漂不漂亮。",
      survivalReason: "它避开了完整文档平台和自动维护系统，只保留 README 到一页教程这个能低成本验证的交付物。",
      abandonedRoutes: [
        { title: "完整文档平台路线", reason: "版本、导航、搜索和托管太重，第一版先放下。" },
        { title: "全自动文档维护路线", reason: "持续同步和准确性压力太大，先做一次性整理。" }
      ],
      branchOptions: [
        { title: "README 到一页教程", whyAlive: "只处理一个项目的一份 README，维护者能马上判断有没有用。" },
        { title: "手动文档整理服务", whyAlive: "先人工整理几份，再决定哪部分值得自动化。" }
      ],
      routeByFriction: {
        expression_first_step: "先把工具压成“README -> 一页新手使用教程”。",
        execution_dependency: "先手动读 README 并整理教程，不做完整文档平台。",
        cost_maintenance: "先记录整理一份 README 要花多少时间和模型成本。",
        evidence_replacement: "只保留普通 README 摘要没解决的细节：新手第一步怎么跑起来。",
        retention_cooling: "让维护者一周后还愿意继续用它整理第二个文档页面。"
      }
    };
  }

  if (/自由职业者.*客户线索|客户线索.*自由职业者/.test(input)) {
    return {
      ideaObject: "自由职业者客户线索整理小工具",
      coreAction: "把散落客户线索整理成下一步跟进清单",
      deliveryMode: "客户线索整理工具",
      targetScene: "自由职业者同时跟多个潜在客户时容易忘记下一步",
      concreteNarrowMove: "先做一张客户线索跟进表，只整理来源、需求、下一步和下次跟进时间",
      validationAction: "找 3 个自由职业者，把他们最近 10 条客户线索手动整理成跟进表，看一周后是否继续用它追踪下一步。",
      biggestBlocker: "最大卡点是自由职业者是否真的会按跟进表回访客户，而不是整理完就放着。",
      survivalReason: "它避开了完整 CRM 和自动销售系统，只保留客户来源、需求、下一步、下次跟进时间这张最轻跟进表。",
      abandonedRoutes: [
        {
          title: "自由职业者 CRM 路线",
          reason: "客户管理、报价、合同和自动提醒太重，第一版先放下。"
        },
        {
          title: "全自动销售助手路线",
          reason: "自动识别和自动跟进边界太多，先用手动表格验证。"
        }
      ],
      branchOptions: [
        {
          title: "客户线索跟进表",
          whyAlive: "只整理 10 条真实线索和下一步动作，马上能看出是否有用。"
        },
        {
          title: "手动线索整理服务",
          whyAlive: "先替自由职业者整理一遍，再决定要不要工具化。"
        }
      ],
      routeByFriction: {
        organization_alignment: "先不做 CRM，只把自由职业者的 10 条客户线索整理成下一步跟进表。",
        trust_permission_risk: "第一版只处理用户主动给出的客户线索，不接通讯录、聊天记录或邮箱。",
        execution_dependency: "先手动整理来源、需求、下一步和下次跟进时间，不做自动导入。",
        cost_maintenance: "先算清整理 10 条客户线索要花多久，再决定是否工具化。",
        acquisition_reach: "先找 3 个正在接客户的自由职业者，用他们真实线索试一周。"
      }
    };
  }

  if (/本地咖啡店.*会员社群|咖啡店.*社群/.test(input)) {
    return {
      ideaObject: "本地咖啡店会员社群",
      coreAction: "让一批常客进群并完成一次到店互动",
      deliveryMode: "线下店社群",
      targetScene: "本地咖啡店想让常客更频繁回店",
      concreteNarrowMove: "先建一个常客群，只发本周一次到店福利和一次新品试喝互动",
      validationAction: "找一家本地咖啡店，把 20 个常客拉进群，连续 7 天只做一次福利和一次互动，看回店、回复和退群情况。",
      biggestBlocker: "最大卡点是常客是否愿意留下并回店，而不是社群名字或会员体系是否完整。",
      survivalReason: "它避开了完整会员系统和长期社群运营路线，只保留 20 个常客、一次到店福利和一次互动来验证回店。",
      abandonedRoutes: [
        {
          title: "完整会员系统路线",
          reason: "积分、等级、储值和后台太重，第一版先放下。"
        },
        {
          title: "长期社群运营路线",
          reason: "每天内容和活动会拉高维护成本，先测一次回店。"
        }
      ],
      branchOptions: [
        {
          title: "20 人常客群",
          whyAlive: "只看真实常客是否愿意进群、回复和回店。"
        },
        {
          title: "一次到店福利测试",
          whyAlive: "不用先做会员系统，也能验证社群能不能带来回店。"
        }
      ],
      routeByFriction: {
        expression_first_step: "先不做会员社群体系，只建一个 20 人常客群。",
        acquisition_reach: "先从店里真实常客开始，不买流量、不做公开大群。",
        real_demand_pain: "只验证常客是否愿意为一次到店福利进群并回复。",
        evidence_replacement: "只保留普通优惠券没处理好的细节：店主能和常客直接互动。",
        retention_cooling: "连续 7 天观察常客是否回复、回店或退群。"
      }
    };
  }

  if (/每天复盘|复盘.*小应用|提醒.*复盘/.test(input)) {
    return {
      ideaObject: "每日复盘提醒小应用",
      coreAction: "每天固定时间提醒用户写 3 句复盘",
      deliveryMode: "复盘提醒应用",
      targetScene: "想复盘但总是忘记或写不下去的人",
      concreteNarrowMove: "先做一个每天提醒写 3 句复盘的半手动版本",
      validationAction: "找 5 个想复盘但总忘的人，连续 3 天用群消息或日历提醒他们写 3 句，看第 4 天是否主动补一次复盘。",
      biggestBlocker: "最大卡点是用户能不能连续写下 3 句复盘，而不是提醒功能能不能做出来。",
      survivalReason: "它避开了完整习惯养成系统和数据统计路线，只保留每天提醒写 3 句复盘这个最小动作。",
      abandonedRoutes: [
        {
          title: "完整习惯养成 App 路线",
          reason: "打卡、统计、成就和社区太重，第一版先放下。"
        },
        {
          title: "复杂复盘模板路线",
          reason: "模板越多越容易拖延，先保留 3 句。"
        }
      ],
      branchOptions: [
        {
          title: "3 句复盘提醒",
          whyAlive: "只让用户写 3 句，能把行动门槛压到最低。"
        },
        {
          title: "半手动复盘陪跑",
          whyAlive: "先用人工提醒验证连续性，再决定是否做应用。"
        }
      ],
      routeByFriction: {
        expression_first_step: "先不做完整小应用，只验证每天提醒写 3 句复盘。",
        execution_dependency: "先用群消息、日历或备忘录半手动提醒，不开发 App。",
        cost_maintenance: "先看连续 3 天提醒和检查要花多少精力。",
        evidence_replacement: "只保留普通提醒没处理好的细节：提醒后真的写下 3 句。",
        retention_cooling: "看第 4 天用户是否主动补一次复盘，而不是只靠第一天新鲜感。"
      }
    };
  }

  return fallback;
}

function classifySafetyBoundary(input) {
  if (hasAny(input, ["刷单", "诈骗", "盗号", "木马", "黑产", "洗钱", "偷拍视频", "偷拍"])) {
    return {
      status: "blocked",
      label: "直接拒绝",
      summary: "这个方向触发安全红线，不能继续。",
      refusal: "拒绝：这个方向涉及违法、犯罪或伤害风险，不能继续。",
      reason: "安全红线先于清晰度判断。这里不会继续分析。"
    };
  }

  if (/偷偷.*(聊天记录|定位|监控|录音|摄像)/.test(input) || /(抓取|窃取).*(聊天记录|隐私|通讯录|定位)/.test(input)) {
    return {
      status: "blocked",
      label: "直接拒绝",
      summary: "这个方向涉及隐私侵犯，不能继续。",
      refusal: "拒绝：这涉及隐私侵犯，不能继续。",
      reason: "安全红线先于清晰度判断。这里不会继续分析。"
    };
  }

  if (
    /(中学生|小学生|未成年|未成年人).*(情感|恋爱|女友|男友|陪伴)/.test(input)
    || /(情感|恋爱|女友|男友|陪伴).*(中学生|小学生|未成年|未成年人)/.test(input)
  ) {
    return {
      status: "blocked",
      label: "直接拒绝",
      summary: "这个方向涉及未成年人情感服务高风险，不能继续。",
      refusal: "拒绝：这个方向涉及未成年人情感服务高风险，不能继续。",
      reason: "安全红线先于清晰度判断。这里不会继续分析。"
    };
  }

  if (/监控.*(员工|电脑|屏幕|聊天)/.test(input) || /(员工|老板).*(监控|屏幕记录|行为记录)/.test(input)) {
    return {
      status: "boundary_review",
      label: "先停边界",
      summary: "这类想法涉及监控、授权、隐私和公司合规边界。IdeaRoast 不让观察者当场裁定，也不把它当普通创意继续推演。",
      reason: "它可能合法，也可能越界；具体取决于地区、劳动关系、告知授权、数据范围和公司制度，需要安全/边界智能体或外部合规判断。"
    };
  }

  if (
    /(炒股|股票|期货|量化交易|量化炒股|自动交易)/.test(input)
    && /(自动下单|代管|带单|荐股|收益承诺|稳赚|帮用户.*赚钱|自动.*赚钱)/.test(input)
  ) {
    return {
      status: "boundary_review",
      label: "先停边界",
      summary: "这个方向涉及金融交易、收益表达和用户资金风险，先不能当普通产品推演。",
      reason: "先明确金融边界：不提供荐股、收益承诺、带单、代管资金或自动下单路线；通过边界判断前不进入现实摩擦。"
    };
  }

  if (/(AI\s*)?(女友|男友|恋爱聊天|情感陪伴|心理陪伴|心理咨询)/i.test(input)) {
    return {
      status: "boundary_review",
      label: "先停边界",
      summary: "这个方向涉及情感依赖、隐私和可能的服务边界，先不能当普通产品推演。",
      reason: "它需要先判断对象、年龄、依赖诱导、付费操控、隐私和平台规则。通过前不进入现实摩擦。"
    };
  }

  return { status: "clear" };
}

function classifyRealityPremise(input) {
  if (isRealityFeasibleVariant(input)) {
    return { status: "clear" };
  }

  const mentionsSoftware = /(APP|App|app|应用|软件|小程序)/i.test(input);
  const softwareImpossible = mentionsSoftware && (
    /(浮空|悬浮|飞起来|自动飞|隐身|凭空移动|水.*变.*汽油|变成汽油)/.test(input)
    || /让.*(物体|东西).*(移动|凭空移动)/.test(input)
  );
  const phoneImpossible = /手机.*(自己浮空|能自己浮空|自动飞起来|自己.*飞起来|自己.*浮空|不靠任何硬件.*(飞|浮|悬浮))/.test(input);
  const materialImpossible = mentionsSoftware && /(水.*(变|变成).*汽油|汽油.*凭空|物质.*转换)/.test(input);

  if (!softwareImpossible && !phoneImpossible && !materialImpossible) {
    return { status: "clear" };
  }

  return {
    status: "reality_review",
    label: "现实前提断裂",
    summary: "这个想法说得清楚，但它不是普通 APP 能直接完成的事。",
    reason: "当前不是执行摩擦，而是现实前提不成立：软件不能直接制造物理浮空、隐身、物质变化或凭空移动这类物理结果。",
    detail: "比如“让手机物理浮空”需要硬件、磁悬浮结构、外部支架、材料和供电系统，不是软件单独能做到的结果。现在不能继续按普通产品路线试走，否则会把一个现实前提不成立的问题，误包装成 MVP 验证。",
    nextQuestions: ["先选清楚它到底是视觉效果、硬件装置，还是科幻概念。"],
    rewriteOptions: [
      {
        title: "如果你想做视觉效果",
        body: "可以改成“做一个让视频里的手机看起来浮空的 AR / 特效工具”。"
      },
      {
        title: "如果你想做真实悬浮",
        body: "这不是 APP 项目，而是“磁悬浮手机支架 / 硬件装置”项目。"
      },
      {
        title: "如果你只是想写奇思妙想",
        body: "可以先把它当成科幻设定，而不是产品预演。"
      }
    ]
  };
}

function isRealityFeasibleVariant(input) {
  if (/不靠任何硬件|没有任何硬件|无需任何硬件|不需要任何硬件/.test(input)) {
    return false;
  }

  if (/\bAR\b/i.test(input) || /(增强现实|特效|视频特效|滤镜|合成|动画|看起来|视觉效果|视频里|画面里)/.test(input)) {
    return true;
  }

  if (/(磁悬浮|悬浮支架|手机支架|硬件|装置|外部支架|外部装置|材料|供电|无人机|IoT|物联网|台灯|开关|传感器|蓝牙|智能家居|带硬件|设备)/i.test(input)) {
    return true;
  }

  return false;
}

function classifyScopePremise(input) {
  const text = normalizeScopeInput(input);
  const mentionsJarvis = /贾维斯|jarvis/.test(text);
  const jarvisModuleCount = [
    /电脑系统|控制电脑|语音控制/,
    /自己学习|自学习|自动学习/,
    /搜索.*(新闻|大事)|今天.*(新闻|大事)|国内.*大事/,
    /文字.*回答|文本.*回答/,
    /声音.*回答|语音.*回答/
  ].filter((pattern) => pattern.test(text)).length;
  const jarvisVision = mentionsJarvis;
  const ironManVision = /钢铁侠|ironman/.test(text);
  const robotVision = /(全能机器人|机器人管家|全自动机器人)/.test(text);
  const superAiVision = /(超级ai|全自动ai系统|全自动ai|通用ai助手|通用ai)/.test(text)
    || (/(ai|系统|智能体)/.test(text)
      && /(自己学习|自学习|自动学习)/.test(text)
      && /(自己赚钱|自动赚钱|自己执行|执行任务|自主执行)/.test(text));
  const overloadModuleCount = [
    /语音控制|控制电脑/,
    /自己学习|自学习|自动学习/,
    /搜索.*新闻|搜索.*大事/,
    /文字.*回答|声音.*回答|语音.*回答/,
    /硬件|飞行|装甲|动力/,
    /全自动|自动赚钱|执行任务/
  ].filter((pattern) => pattern.test(text)).length;
  const overloadedSystem = /(系统|产品|机器人|ai)/.test(text) && overloadModuleCount >= 4;
  const scopeOverloaded = jarvisModuleCount >= 3 || superAiVision || overloadedSystem;

  if (hasFirstRunnableArtifact(input) && !scopeOverloaded) {
    return { status: "clear" };
  }

  if (!jarvisVision && !ironManVision && !robotVision && !superAiVision && !overloadedSystem) {
    const speculativeTarget = getSpeculativeTargetKind(input);
    if (!speculativeTarget) return { status: "clear" };
  }

  const missingArtifactTarget = getMissingFirstRunnableArtifactTarget(input);
  if (missingArtifactTarget) {
    return createDoorwayGate("ask_one_question", input, {
      reason: buildMissingArtifactReason(missingArtifactTarget),
      question: buildMissingArtifactQuestion(missingArtifactTarget),
      rewriteOptions: buildFirstArtifactRewriteOptions(missingArtifactTarget)
    });
  }

  if (isExplicitExtremeEngineeringTarget(input)) {
    const target = getSpeculativeTargetKind(input) || "generic";
    return createDoorwayGate("scope_too_large", input, {
      reason: "这个真实工程目标不是一个能直接试走的第一版交付物。它背后有材料、动力、安全、许可和长期工程能力，不是小人能低成本背着走的包。",
      question: buildMissingArtifactQuestion(target),
      rewriteOptions: buildFirstArtifactRewriteOptions(target)
    });
  }

  return {
    status: "scope_review",
    label: "先拆入口",
    summary: "这个想法说得清楚，但它不是一个能直接试走的第一版路线。",
    reason: "当前不是执行摩擦，而是目标范围过载：它把多个巨大模块叠在一起了，技术、权限、资金、硬件/软件、安全和长期维护都压在同一条路上。",
    detail: "如果现在直接进入 5 步预演，系统会把一个超级愿景误包装成普通 MVP 路线。这里小人看的是目标本身，不是你用了“开发”还是“研发”。只要目标还是完整钢铁侠 / 完整 Jarvis，它就不能直接试走。",
    nextQuestions: ["先别让小人背着完整愿景出发。先选一条能试走的小入口。"],
    rewriteOptions: [
      {
        title: "以“贾维斯电脑系统”为例",
        body: "可以先拆成：语音搜索当天新闻并读出摘要、语音控制电脑完成一个固定动作、本地资料问答助手、Jarvis 风格 UI / 交互概念演示。默认推荐：先沿“语音搜索当天新闻并读出摘要”这条最轻入口试走。"
      },
      {
        title: "以“开发钢铁侠”为例",
        body: "可以先拆成：科幻设定 / 概念项目、cosplay / 展示服、单一外骨骼辅助模块、钢铁侠风格游戏或模拟器、AI 助手界面概念。默认推荐：先改写成“钢铁侠风格的语音助手界面概念”或“外骨骼单关节辅助概念”。"
      },
      {
        title: "先选哪条路",
        body: "先别让小人背着完整愿景出发。先选一条能试走的小入口。"
      }
    ]
  };
}

function normalizeScopeInput(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();
}

function inferDirectBuildTask(input) {
  const text = normalizeScopeInput(input);
  if (!text || hasDirectBuildRisk(text) || shouldTryWalkBeforeBuild(text) || isAbstractBuildWish(text)) return null;

  const task =
    buildCopyrightSafeGameTask(text) ||
    buildNamedDirectBuildTask(text) ||
    buildGenericDirectBuildTask(input, text);

  return task ? withDirectBuildDefaults(task) : null;
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
  const cleaned = normalizeIdeaInput(input)
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

function getDirectBuildArtifact(task = {}) {
  return String(task.goal || "一个可直接开工的小 demo").replace(/^做一个?/, "一个");
}

function classifyDoorwaySanity(input) {
  if (hasFirstRunnableArtifact(input)) {
    return { status: "clear" };
  }

  const text = normalizeScopeInput(input);
  const mentionsUfo = /\bufo\b|飞碟/.test(text);
  const mentionsTimeMachine = /时光机|时间机器|穿越时间/.test(text);
  const mentionsPerpetualMotion = /永动机|永久动机|永动/.test(text);
  const mentionsAntiGravity = /反重力|无重力|消除重力|违反重力/.test(text);
  const wantsRealFlight = isExplicitRealImplementation(input);

  if ((mentionsUfo && mentionsAntiGravity) || mentionsTimeMachine || mentionsPerpetualMotion || isExplicitRealityBrokenTarget(input)) {
    return createDoorwayGate("reality_broken", input, {
      reason: mentionsUfo
        ? "这里不是执行起来难，而是把“反重力 UFO”当成现实产品入口了。小人脚下没有这条普通低成本试走路。"
        : "这里不是执行摩擦，而是现实前提不成立。小人不能把它包装成普通 MVP 路线。",
      question: "先把它改成视觉效果、游戏/故事设定、科普内容，或一个能用现有材料做出来的模型。"
    });
  }

  if ((mentionsUfo && wantsRealFlight) || isExplicitExtremeEngineeringTarget(input)) {
    return createDoorwayGate("scope_too_large", input, {
      reason: "这个真实工程目标不是一个能直接试走的第一版交付物。它背后有材料、动力、安全、许可和长期工程能力，不是小人能低成本背着走的包。",
      question: buildMissingArtifactQuestion(getSpeculativeTargetKind(input) || "generic")
    });
  }

  const missingArtifactTarget = getMissingFirstRunnableArtifactTarget(input);
  if (missingArtifactTarget) {
    return createDoorwayGate("ask_one_question", input, {
      reason: buildMissingArtifactReason(missingArtifactTarget),
      question: buildMissingArtifactQuestion(missingArtifactTarget),
      rewriteOptions: buildFirstArtifactRewriteOptions(missingArtifactTarget)
    });
  }

  return { status: "clear" };
}

function hasFirstRunnableArtifact(input) {
  return Boolean(getFirstRunnableArtifactType(input));
}

function getFirstRunnableArtifactType(input) {
  const text = normalizeScopeInput(input);

  if (/(语音控制.*电脑|控制电脑|执行快捷键|快捷键|查新闻|新闻摘要|读出摘要|语音搜索|文件整理|整理文件|固定自动化动作|自动化动作|固定动作|打开软件|打开某个软件|本地资料问答|资料问答)/.test(text)) {
    return "software";
  }

  if (/(科普短视频|科普视频|教学账号|教学类账号|短视频账号|短视频|账号|概念讲解|选题|文案|视频脚本|脚本|内容|资料整理|科普资料|图文内容)/.test(text)) {
    return "content";
  }

  if (/\bAR\b/i.test(input) || /(增强现实|ui|界面|概念演示|交互概念|网页动画|动画|视频特效|特效|科幻短片|游戏画面|小游戏|游戏|demo|物理模拟|模拟小demo|模拟demo|游戏设定|视觉效果|画面演示|滤镜|合成|看起来|风格)/.test(text)) {
    return "visual_demo";
  }

  if (/(头盔模型|玩具模型|展示模型|手工原型|模型|cosplay|道具|外观壳|展示服|外骨骼.*(模型|演示|辅助|单关节)|硬件小件|桌面摆件)/.test(text)) {
    return "physical_mock";
  }

  if (/(技术路线图|路线图|可行性资料|可行性.*(收集|整理|调研)|资料收集|资料整理|对比表|学习计划|研究计划|调研报告|学习路线)/.test(text)) {
    return "research";
  }

  return "";
}

function getSpeculativeTargetKind(input) {
  const text = normalizeScopeInput(input);
  if (/\bufo\b|飞碟/.test(text)) return "ufo";
  if (/钢铁侠|ironman/.test(text)) return "iron_man";
  if (/贾维斯|jarvis/.test(text)) return "jarvis";
  if (/行星推进器|小行星推进器|推进小行星|推离轨道/.test(text)) return "planetary_thruster";
  if (/任意门|传送门/.test(text)) return "portal";
  if (/反重力车|反重力汽车|反重力/.test(text)) return "anti_gravity_vehicle";
  if (/隐身衣/.test(text)) return "invisibility_cloak";
  return "";
}

function getMissingFirstRunnableArtifactTarget(input) {
  const target = getSpeculativeTargetKind(input);
  if (!target || hasFirstRunnableArtifact(input)) return "";
  if (isExplicitRealityBrokenTarget(input) || isExplicitExtremeEngineeringTarget(input)) return "";

  const text = normalizeScopeInput(input);
  if (target === "jarvis" && /(电脑系统|ai产品|完整|一样的系统|研发一个jarvis)/.test(text)) return "";
  if (target === "iron_man" && !/小钢铁侠/.test(text) && /(开发|研发|造|打造|设计|复刻|做钢铁侠|像钢铁侠一样的东西)/.test(text)) return "";

  return target;
}

function isExplicitRealImplementation(input) {
  const text = normalizeScopeInput(input);
  return /(真实|真的|实体|现实|物理|飞行器|飞起来|能飞|载人|战斗|战甲|装甲|武器|动力|造|制造|打造|研发|开发|发明|实现|还原|工程装置|真实设备|推离轨道|改变轨道|把.*(小行星|行星).*推)/.test(text);
}

function isExplicitRealityBrokenTarget(input) {
  const text = normalizeScopeInput(input);
  return /(真实|真的|现实|物理|实现|制造|造|研发|开发|发明|不靠任何硬件|没有任何硬件|无需任何硬件)/.test(text)
    && /(任意门|传送门|反重力|无重力|消除重力|违反重力)/.test(text);
}

function isExplicitExtremeEngineeringTarget(input) {
  const text = normalizeScopeInput(input);
  return /(真实|真的|现实|物理|工程|飞起来|能飞|战斗|战甲|装甲|武器|载人|制造|造|研发|开发|实现|推离轨道|改变轨道|把.*(小行星|行星).*推)/.test(text)
    && /(钢铁侠|ironman|行星推进器|小行星推进器|推进小行星|\bufo\b|飞碟)/.test(text);
}

function buildMissingArtifactReason(kind) {
  const labels = {
    ufo: "“UFO”还没有落到第一版可运行物。它可能是内容、模型、画面演示，也可能是一个真实飞行器愿景。",
    iron_man: "“钢铁侠”还没有落到第一版可运行物。小人需要先知道你要做的是演示、模型、道具、内容，还是现实战甲。",
    jarvis: "“Jarvis”还没有落到第一版可运行物。小人需要先知道它是固定电脑动作、UI 演示、资料问答，还是完整系统愿景。",
    planetary_thruster: "“行星推进器”还没有落到第一版可运行物。它可能是科普内容、概念动画、游戏设定、物理模拟 demo，也可能是真实工程装置。",
    portal: "“任意门”还没有落到第一版可运行物。它可能是游戏设定、动画演示、科普内容、模型道具，也可能是真实传送愿景。",
    anti_gravity_vehicle: "“反重力车”还没有落到第一版可运行物。它可能是特效画面、游戏 demo、模型道具、科普内容，也可能是真实设备愿景。",
    invisibility_cloak: "“隐身衣”还没有落到第一版可运行物。它可能是游戏道具、视频特效、cosplay 展示，或真实材料研发。"
  };
  return labels[kind] || "这个想法还没有落到第一版可运行物。先选一个现实入口，小人才知道往哪走。";
}

function buildMissingArtifactQuestion(kind) {
  const questions = {
    ufo: "你要做 UFO 风格小游戏、视觉特效 / 科幻短片、玩具模型、科普内容，还是现实飞行器？",
    iron_man: "你要做 UI 概念演示、头盔模型、cosplay 道具、短视频内容，还是现实战甲？",
    jarvis: "你要做语音控制电脑的一个固定动作、Jarvis 风格 UI 演示、本地资料问答，还是完整电脑系统？",
    planetary_thruster: "你要做科普内容、概念动画、游戏设定、物理模拟 demo，还是现实工程装置？",
    portal: "你要做游戏设定、网页动画、视频特效、模型道具，还是现实传送设备？",
    anti_gravity_vehicle: "你要做游戏画面 demo、视频特效、玩具模型、科普内容，还是现实设备？",
    invisibility_cloak: "你说的隐身衣，是游戏/特效/cosplay/概念演示，还是想做真实材料装置？"
  };
  return questions[kind] || "你先告诉我，它是一个内容、一个模型、一个画面演示，还是一个真实设备？";
}

function buildFirstArtifactRewriteOptions(kind) {
  const options = {
    ufo: [
      { title: "UFO 风格小游戏", body: "先做一个只在屏幕里飞的小游戏入口。" },
      { title: "UFO 视觉特效 / 科幻短片", body: "先做视频里的 UFO 飞行画面或一段科幻短片。" },
      { title: "UFO 玩具模型", body: "先做一个桌面玩具模型或手工原型。" },
      { title: "UFO 科普内容", body: "先做 UFO 主题科普短视频或图文内容。" },
      { title: "真实飞行器", body: "这个入口不成立：包太大，低成本试走时脚下没路。" }
    ],
    iron_man: [
      { title: "UI 概念演示", body: "先做一个钢铁侠风格界面或交互 demo。" },
      { title: "头盔模型", body: "先做一个钢铁侠头盔模型或外观壳。" },
      { title: "cosplay 道具", body: "先做可展示、可拍摄的一件道具。" },
      { title: "短视频内容", body: "先做钢铁侠主题概念讲解或短视频。" },
      { title: "现实战甲", body: "这不是第一版可运行物，先不进 5 步。" }
    ],
    jarvis: [
      { title: "固定电脑动作", body: "先做语音控制电脑完成一个固定动作。" },
      { title: "UI 概念演示", body: "先做 Jarvis 风格界面或交互 demo。" },
      { title: "资料问答", body: "先做本地资料问答助手。" },
      { title: "完整系统", body: "完整 Jarvis 先不当第一版入口。" }
    ],
    planetary_thruster: [
      { title: "科普内容", body: "先做行星推进器科普视频或概念讲解。" },
      { title: "概念动画", body: "先做一个解释原理的动画画面。" },
      { title: "游戏设定", body: "先做游戏里的行星推进器设定或画面。" },
      { title: "物理模拟 demo", body: "先做一个简化参数的物理模拟小 demo。" },
      { title: "现实工程装置", body: "这不是第一版可运行物，先不进 5 步。" }
    ],
    portal: [
      { title: "游戏设定", body: "先做任意门游戏机制或关卡设定。" },
      { title: "网页动画", body: "先做一个传送门视觉动画。" },
      { title: "视频特效", body: "先做短片里的任意门特效。" },
      { title: "模型道具", body: "先做一个外观模型或展示道具。" }
    ],
    anti_gravity_vehicle: [
      { title: "游戏画面 demo", body: "先做反重力车在画面里运动的 demo。" },
      { title: "视频特效", body: "先做车悬浮的视觉特效。" },
      { title: "玩具模型", body: "先做一个外观模型或桌面摆件。" },
      { title: "科普内容", body: "先做反重力概念科普内容。" }
    ],
    invisibility_cloak: [
      { title: "视觉效果", body: "做隐身衣视频特效或滤镜。" },
      { title: "展示", body: "做隐身衣 cosplay / 概念演示。" },
      { title: "设定", body: "先把它当成游戏或科幻设定。" }
    ]
  };

  return options[kind] || [
    { title: "先问一句", body: "你先告诉我，它是一个内容、一个模型、一个画面演示，还是一个真实设备？" },
    { title: "再让小人走", body: "入口明确后，再进入 5 步替身预演。" }
  ];
}

function createDoorwayGate(verdict, input, override = {}) {
  const normalized = normalizeDoorwayVerdict(verdict);
  const labelByVerdict = {
    ask_one_question: "先问一句",
    scope_too_large: "先拆入口",
    reality_broken: "现实前提断裂",
    boundary_stop: "先停边界"
  };
  const statusByVerdict = {
    ask_one_question: "needs_definition",
    scope_too_large: "scope_review",
    reality_broken: "reality_review",
    boundary_stop: "boundary_review"
  };
  const reasonByVerdict = {
    ask_one_question: "这个想法不是不能做，而是现在还没有一个明确、现实、低成本可试走的入口。",
    scope_too_large: "这个目标范围过载，不能把完整愿景直接包装成普通 5 步预演。",
    reality_broken: "这个目标的现实前提不成立，不能按普通产品路线试走。",
    boundary_stop: "这个方向有边界风险，不能按普通项目试走。"
  };
  const questionByVerdict = {
    ask_one_question: "你先告诉我，它是一个内容、一个模型、一个画面演示，还是一个真实设备？",
    scope_too_large: "先拆一个能低成本试走的小入口。",
    reality_broken: "先改成视觉效果、硬件装置、科幻设定或可做模型。",
    boundary_stop: "先把边界说清楚，再决定能不能继续。"
  };

  return {
    status: statusByVerdict[normalized],
    label: override.label || labelByVerdict[normalized],
    summary: override.summary || reasonByVerdict[normalized],
    reason: override.reason || reasonByVerdict[normalized],
    detail: override.detail || override.reason || reasonByVerdict[normalized],
    missing: normalized === "ask_one_question" ? ["现实入口"] : [],
    nextQuestions: [override.question || questionByVerdict[normalized]],
    inferenceRule: "doorway sanity check：进入 5 步前，先确认有没有明确、现实、低成本可试走的入口。",
    rewriteOptions: override.rewriteOptions || buildDoorwayRewriteOptions(input, normalized)
  };
}

function normalizeDoorwayVerdict(verdict) {
  const normalized = String(verdict || "").toLowerCase().trim();
  if (["ask_one_question", "scope_too_large", "reality_broken", "boundary_stop"].includes(normalized)) {
    return normalized;
  }
  return "ask_one_question";
}

function buildDoorwayRewriteOptions(input, verdict) {
  const text = normalizeScopeInput(input);
  if (/\bufo\b|飞碟/.test(text)) {
    return [
      { title: "UFO 风格小游戏", body: "先做一个只在屏幕里飞的小游戏入口。" },
      { title: "UFO 视觉特效 / 科幻短片", body: "先做视频里的 UFO 飞行画面或一段科幻短片。" },
      { title: "UFO 玩具模型", body: "先做一个桌面玩具模型或手工原型。" },
      { title: "UFO 科普内容", body: "先做 UFO 主题科普短视频或图文内容。" },
      { title: "真实飞行器", body: "这个入口不成立：包太大，低成本试走时脚下没路。" }
    ];
  }

  if (/隐身衣/.test(text)) {
    return [
      { title: "视觉效果", body: "做隐身衣视频特效或滤镜。" },
      { title: "展示", body: "做隐身衣 cosplay / 概念演示。" },
      { title: "设定", body: "先把它当成游戏或科幻设定。" }
    ];
  }

  if (verdict === "reality_broken") {
    return [
      { title: "视觉效果", body: "让画面里看起来像发生了。" },
      { title: "模型/设定", body: "先做模型、科普内容或科幻设定。" },
      { title: "真实装置", body: "只有在明确材料、结构和供电后，才按硬件项目试走。" }
    ];
  }

  return [
    { title: "先问一句", body: "你先告诉我，它是一个内容、一个模型、一个画面演示，还是一个真实设备？" },
    { title: "再让小人走", body: "入口明确后，再进入 5 步替身预演。" }
  ];
}

function buildDoorwayReviewOverridePacketV0(rawInput, review = {}) {
  const input = normalizeIdeaInput(rawInput);
  const name = inferIdeaName(input);
  const gate = createDoorwayGate(review.verdict, input, {
    reason: review.reason,
    question: review.question,
    rewriteOptions: review.rewriteOptions
  });

  if (gate.status === "needs_definition") {
    return createDefinitionPacket(input, name, gate);
  }

  return createStoppedPacket(input, name, gate);
}

function buildAiDoorwayJudgePacketV0(rawInput, review = {}) {
  const input = normalizeIdeaInput(rawInput);
  const name = inferIdeaName(input);
  const verdict = String(review.verdict || "").toLowerCase().trim();

  if (verdict !== "can_run") {
    return buildDoorwayReviewOverridePacketV0(input, {
      verdict,
      reason: review.reason,
      question: review.oneQuestion || review.question,
      rewriteOptions: review.rewriteOptions
    });
  }

  if (review.routeMode === "direct_build" && review.directBuildTask) {
    const packet = createDirectBuildPacket(input, name, review.directBuildTask);
    packet.clarityGate = {
      ...(packet.clarityGate || {}),
      firstRunnableArtifact: review.firstRunnableArtifact || packet.clarityGate.firstRunnableArtifact,
      routeMode: "direct_build",
      directBuildTask: review.directBuildTask,
      doorwayLine: review.doorwayLine || packet.clarityGate.doorwayLine,
      reason: review.reason || packet.clarityGate.reason,
      riskFlags: Array.isArray(review.riskFlags) ? review.riskFlags.slice(0, 6) : [],
      doorwaySource: "ai_judge_pass"
    };
    return packet;
  }

  const profile = inferIdeaProfile(input);
  const selectedFrictionIds = selectLocalFrictionIds(input, profile);
  const clarity = {
    status: "usable",
    label: "AI 门口通过",
    summary: review.doorwayLine || "小人能先背着它走一圈。",
    reason: review.reason || "AI Doorway Judge 判断它有第一版可运行交付物，可以进入 5 步。",
    detail: review.safetyShrink || review.reason || "",
    missing: [],
    nextQuestions: [],
    inferenceRule: "AI Doorway Judge guarded pass：AI 只判断 doorway，5 步仍由本地 Little Walker mock 驱动。",
    routeMode: "try_walk",
    firstRunnableArtifact: review.firstRunnableArtifact || "",
    safetyShrink: review.safetyShrink || "",
    riskFlags: Array.isArray(review.riskFlags) ? review.riskFlags.slice(0, 6) : [],
    doorwaySource: "ai_judge_pass"
  };
  const packet = createRunnablePacket(input, name, clarity, profile, selectedFrictionIds);
  return applyAiDoorwayReviewToRunnablePacket(packet, review);
}

function applyAiDoorwayReviewToRunnablePacket(packet, review = {}) {
  const firstRunnableArtifact = String(review.firstRunnableArtifact || "").trim();
  const safetyShrink = String(review.safetyShrink || "").trim();
  const reason = String(review.reason || "").trim();
  const doorwayLine = String(review.doorwayLine || "").trim();
  const riskFlags = Array.isArray(review.riskFlags) ? review.riskFlags.slice(0, 6) : [];

  packet.clarityGate = {
    ...(packet.clarityGate || {}),
    firstRunnableArtifact,
    safetyShrink,
    riskFlags,
    routeMode: review.routeMode || packet.clarityGate?.routeMode || "try_walk",
    doorwayLine: doorwayLine || packet.clarityGate?.summary || "",
    reason: reason || packet.clarityGate?.reason || "",
    doorwaySource: "ai_judge_pass"
  };

  if (firstRunnableArtifact) {
    const firstStep = buildAiDoorwayAnchoredFirstStep(packet, { firstRunnableArtifact, safetyShrink, riskFlags, doorwayLine, reason });
    packet.path.minimumResult = firstRunnableArtifact;
    packet.verdict.strongestBranch = firstRunnableArtifact;
    packet.verdict.smallestValidation = firstStep.tonightAction;
    packet.verdict.survivalReason = safetyShrink
      ? `${firstRunnableArtifact} 活下来，是因为它先避开危险自动动作：${safetyShrink}`
      : `${firstRunnableArtifact} 活下来，是因为它已经是第一版能拿去试走的交付物。`;

    const firstBite = packet.frictionBites?.[0];
    if (firstBite) {
      firstBite.stepTitle = firstStep.stepTitle;
      firstBite.agentAttempt = firstStep.agentAttempt;
      firstBite.realityFeedback = firstStep.realityFeedback;
      firstBite.routeChange = {
        ...(firstBite.routeChange || {}),
        to: firstRunnableArtifact,
        summary: firstStep.routeSummary,
        why: firstStep.routeSummary
      };
      firstBite.nextMove = firstStep.tonightAction;
      firstBite.branch = firstRunnableArtifact;
      firstBite.plainTake = firstStep.sceneLine;
      firstBite.bubble = firstStep.bubble;
      firstBite.sceneLine = firstStep.sceneLine;
      firstBite.stepPurpose = firstStep.stepPurpose;
    }

    const finalBite = packet.frictionBites?.[packet.frictionBites.length - 1];
    if (finalBite) {
      finalBite.routeChange = {
        ...(finalBite.routeChange || {}),
        to: firstRunnableArtifact,
        summary: safetyShrink || finalBite.routeChange?.summary || "最后把路线压成第一版可运行交付物。"
      };
      finalBite.nextMove = firstRunnableArtifact;
      finalBite.branch = firstRunnableArtifact;
    }

    packet.frictionBites = chainSurvivingRoutes(packet.frictionBites, `原始想法：${packet.idea?.name || packet.idea?.input || "这个想法"}`);
  }

  if (safetyShrink) {
    packet.verdict.notNow = safetyShrink;
  }

  return packet;
}

function buildAiDoorwayAnchoredFirstStep(packet, anchor = {}) {
  const artifact = anchor.firstRunnableArtifact || "一个可运行的第一版交付物";
  const safetyShrink = anchor.safetyShrink || "";
  const input = packet.idea?.input || "";

  if (/自动上传|上传清单|视频草稿|发布文案/.test(`${input}\n${artifact}\n${safetyShrink}`)) {
    return {
      stepTitle: "第 1 步：小人先把自动上传放下",
      agentAttempt: "小人先不碰自动上传，只跑题目到文案、视频草稿和手动上传清单这一段。",
      realityFeedback: "自动上传一上来就会撞到平台规则、账号授权和发布责任。",
      routeSummary: safetyShrink || "不默认自动上传，先导出可手动发布的视频草稿包。",
      tonightAction: "先生成一条视频草稿、标题、发布文案和手动上传清单。",
      bubble: "我先不碰自动上传。",
      sceneLine: `小人先把完整工作流压成：题目 -> 文案 -> 视频草稿 -> 手动上传清单；${safetyShrink || "不默认自动上传。"}`,
      stepPurpose: "先确认手动发布包能不能成形，再谈自动上传。"
    };
  }

  if (/选题|标题钩子|评论区疑问|是否继续改/.test(`${input}\n${artifact}`)) {
    return {
      stepTitle: "第 1 步：小人先做选题判断表",
      agentAttempt: "小人先把选题判断压成一张表：标题钩子、评论区疑问、是否继续改。",
      realityFeedback: "如果只说会不会有人看，创作者拿不到能改标题的依据。",
      routeSummary: `先把路线压成：${artifact}。`,
      tonightAction: "先做一张选题判断表，填入标题钩子、评论区疑问和是否继续改。",
      bubble: "先别预测爆不爆，先做判断表。",
      sceneLine: `小人先把选题工具压成：${artifact}。`,
      stepPurpose: "先让创作者拿到能改选题的表，而不是一句空判断。"
    };
  }

  if (/README|使用教程|新手教程/.test(`${input}\n${artifact}`)) {
    return {
      stepTitle: "第 1 步：小人先把 README 转成教程",
      agentAttempt: "小人先只跑 README -> 新手使用教程这一段。",
      realityFeedback: "README 信息常常散在安装、示例和参数里，新手不知道先看哪一步。",
      routeSummary: `先把路线压成：${artifact}。`,
      tonightAction: "先选一个 README，整理成一页新手使用教程。",
      bubble: "先把 README 变成新手能走的教程。",
      sceneLine: `小人先把开源项目路线压成：${artifact}。`,
      stepPurpose: "先证明 README 能变成一个新手看得懂的入口，再谈更完整的文档系统。"
    };
  }

  return {
    stepTitle: "第 1 步：小人先压成第一版交付物",
    agentAttempt: `小人先把它压成：${artifact}。`,
    realityFeedback: safetyShrink || "完整想法太大，第一步必须先落到一个具体交付物。",
    routeSummary: safetyShrink || `先把路线压成：${artifact}。`,
    tonightAction: safetyShrink ? `${safetyShrink}` : `先做出：${artifact}。`,
    bubble: "我先压成一个能拿去试的交付物。",
    sceneLine: safetyShrink
      ? `小人先把它压成：${artifact}。${safetyShrink}`
      : `小人先把它压成：${artifact}。`,
    stepPurpose: "先拿到一个具体交付物，再让现实摩擦继续压路线。"
  };
}

function classifyIdeaClarity(input) {
  const question = getDefinitionQuestion(input);
  if (question) {
    return {
      status: "needs_definition",
      label: "先说具体一点",
      summary: "这句话还停在愿望层或大类词上。先说清最低限度的方向、类目或物件，再进入现实摩擦。",
      missing: [question.missing],
      inferenceRule: "这里只问最低限度的信息，不把目标用户、痛点、获客和成本全丢回给观察者。",
      nextQuestions: [question.text]
    };
  }

  if (hasFunctionalShape(input)) {
    return {
      status: "ready",
      label: "可以进入预演",
      summary: "已经能看出项目对象、功能逻辑或使用流程。它不一定合理，但已经足够进入现实摩擦。"
    };
  }

  return {
    status: "usable",
    label: "能往下看",
    summary: "方向基本有了，但第一步还不够清楚。可以先进入现实摩擦，让第一轮把入口压小。"
  };
}

function getDefinitionQuestion(input) {
  const trimmed = input.replace(/[。！？?]/g, "").trim();
  const exactNeeds = [
    [/^我想(要)?赚钱$/, "赚钱靠什么具体东西？内容、工具、服务、商品，还是别的？", "赚钱方式"],
    [/^我想(做)?副业赚钱$/, "副业具体是什么？卖东西、做服务、内容，还是工具？", "副业形态"],
    [/^我想(要)?不上班$/, "你准备靠什么具体东西替代收入？", "替代收入的东西"],
    [/^我想(要)?创业$/, "创业做什么方向？先落到一个类目或物件。", "创业方向"],
    [/^我想做(一个)?产品$/, "产品帮谁做什么？先说一个对象、场景或动作。", "产品对象/动作"],
    [/^我想做(一个)?小产品$/, "小产品是什么？工具、模板、内容，还是一个具体物件？", "小产品类目"],
    [/^我想做(一个)?能帮人的东西$/, "帮谁做什么？先说一个对象、场景或动作。", "具体对象/动作"],
    [/^我想做(一个)?App$/i, "App 干什么？先说它帮人完成哪件事。", "App 解决的事"],
    [/^我想做(一个)?网站$/, "网站干什么？别先说网站，先说它帮人完成哪件事。", "网站用途"],
    [/^我想做(一个)?玩具$/, "什么玩具？具体是做什么的？", "玩具类型"],
    [/^我想做(一个)?课程$/, "什么课程？教什么，给谁学？", "课程主题"],
    [/^我想卖课$/, "卖什么课？先说主题。", "课程主题"],
    [/^我想开一家店$/, "开什么店？卖东西、做服务，还是线下体验？", "店铺类型"]
  ];

  const exact = exactNeeds.find(([pattern]) => pattern.test(trimmed));
  if (exact) return { text: exact[1], missing: exact[2] };

  if (hasSupportedScopeUsableOverride(input)) {
    return null;
  }

  if (/短视频/.test(input) && !hasAny(input, ["Excel", "Python", "咖啡", "记录生活", "装修", "育儿", "健身", "英语", "数学", "编程", "做饭", "手账", "小猫", "猫", "带货", "流量", "即梦", "生成视频", "钢铁侠", "Jarvis", "jarvis", "贾维斯", "UFO", "飞碟", "科普"])) {
    return { text: "你要做哪类短视频？教学什么、记录什么，还是围绕哪个具体主题？", missing: "短视频具体主题" };
  }

  if (/(教学类|知识分享)/.test(input) && !hasAny(input, ["Excel", "Python", "英语", "数学", "机械", "做饭", "健身", "装修", "编程", "摄影", "财务"])) {
    return { text: "教学什么？知识分享也太大了，先说一个具体主题。", missing: "教学主题" };
  }

  if (/AI\s*工具/i.test(input) && !hasAny(input, ["写文案", "整理资料", "做表格", "写代码", "读书", "简历", "会议", "录音", "控制电脑", "搜索", "背单词", "生成视频", "剪辑", "标题", "小猫", "带货", "流量", "即梦"])) {
    return { text: "你想用 AI 做什么具体事？", missing: "AI 要处理的具体事" };
  }

  if (/提升效率/.test(input) && !hasAny(input, ["写文案", "整理资料", "做表格", "写代码", "会议", "客服", "销售", "学习"])) {
    return { text: "提升什么效率？", missing: "效率场景" };
  }

  if (/教育产品/.test(input) && !hasAny(input, ["数学", "英语", "Python", "背单词", "错题", "小学", "初中", "成人", "陪练", "测评"])) {
    return { text: "教育产品太大了。你想做课、练习工具、陪练、测评，还是某个年龄段/学科用的东西？", missing: "教育产品类型" };
  }

  if (/(独立开发|靠小产品|小产品赚钱)/.test(input) && !hasAny(input, ["工具", "AI", "MVP", "插件", "小程序", "App", "网站", "模板", "账号", "课程", "游戏", "玩具", "品牌", "店", "服务", "表格", "番茄钟", "简历", "会议", "房源", "喂食器", "短视频", "小猫", "记账", "提醒"])) {
    return { text: "小产品是什么？先说一个方向、类目或物件。", missing: "小产品方向" };
  }

  if (/(量化炒股|炒股赚钱|靠炒股赚钱)/.test(input) && !hasAny(input, ["工具", "复盘", "模拟", "学习", "记录", "提醒", "风控", "自动下单"])) {
    return { text: "你是想做学习/复盘工具，还是实际交易系统？先把金融边界说清楚。", missing: "金融产品边界" };
  }

  if (/健康管理/.test(input) && !hasAny(input, ["饮食", "运动", "睡眠", "用药", "慢病", "体重", "血糖", "记录"])) {
    return { text: "管理什么？饮食、运动、睡眠、用药、慢病记录，还是别的场景？", missing: "健康管理场景" };
  }

  return null;
}

function hasSupportedScopeUsableOverride(input) {
  const text = normalizeScopeInput(input);
  const hasConcreteVerb = /(拆|判断|整理|生成|控制|打开|搜索|总结|提取|改写|转成|转换|写|检查|分类|匹配|提醒|记录|讲|教|分享|科普|处理)/.test(text);
  const hasAudience = /(独立开发者|创作者|开发者|维护者|学生|用户|自由职业者|内容创作者|开源项目|电脑重度用户)/.test(text);

  if (/(竞品分析|竞品|竞争产品|对标)/.test(text)) {
    const hasPublicObject = /(高德地图|商户通|商业产品|saas|定价页|功能页|用户评价|短视频账号|公开视频|评论区|选题|标题|账号|产品|会员规则|产品形态)/i.test(text);
    const hasGroundedAngle = /(公开|研究|分析|关于|定价|功能|评价|选题|标题|评论|会员|规则|产品形态|发展动态)/i.test(text);
    if (hasPublicObject && hasGroundedAngle) return true;
  }

  if (/ai工具/.test(text)) {
    const hasToolAction = hasConcreteVerb && (
      /(帮|给).{1,32}(拆|判断|整理|生成|控制|打开|搜索|总结|提取|改写|转成|转换|写|检查|分类|匹配|提醒|记录|处理)/.test(text)
      || /(拆成|判断.*(会不会|是否)|整理成|生成|控制|打开|搜索|总结|提取|改写|转成|转换|检查|分类|匹配|提醒|记录|处理)/.test(text)
    );
    if (hasToolAction && (hasAudience || /(产品想法|选题|第一步验证动作|验证动作|README|文件|文档|流程|软件)/.test(text))) {
      return true;
    }
  }

  if (/(短视频账号|内容账号|自媒体账号|账号)/.test(text)) {
    const hasTopic = /(讲|教|分享|记录|测评|拆解|科普|实战|excel|ai工具|python|装修|育儿|健身|英语|数学|编程|做饭|手账|小猫|带货)/i.test(text);
    if (hasTopic) return true;
  }

  if (/开源项目/.test(text) && /(readme|文档|文件|流程|issue|教程|整理|生成|转换|检查|自动整理)/i.test(text)) {
    return true;
  }

  if (/(独立开发者|创作者|开发者)/.test(text) && /(产品想法|选题|mvp|第一步|验证动作|拆|判断|整理|生成)/i.test(text)) {
    return true;
  }

  if (/(小工具|工具)/.test(text) && /(固定动作|打开软件|打开.*软件|控制电脑|执行快捷键|整理文件|文件整理|搜索|摘要|提醒|记录)/.test(text)) {
    return true;
  }

  return false;
}

function hasFunctionalShape(input) {
  const hasAction = hasAny(input, ["帮", "自动", "通过", "用来", "让", "控制", "搜索", "汇总", "提醒", "记录", "整理", "比较", "生成", "识别", "导入", "朗读", "上传", "打码"]);
  const hasObject = hasAny(input, ["小程序", "插件", "App", "网站", "账号", "课程", "模板", "工具", "品牌", "服务", "喂食器", "番茄钟", "简历", "会议录音", "房源", "背单词"]);
  return input.length >= 28 && (hasAction || hasObject);
}

function inferIdeaProfile(input) {
  if (/(AI|即梦|生成).*(小猫|猫).*(视频|短视频)|小猫.*(视频|短视频).*(带货|流量)|AI.*(视频|短视频).*(带货|流量)/i.test(input)) return "ai_content";
  if (/猫|宠物|玩具|硬件|喂食器|手机飞起来|设备|机器人/.test(input)) return "physical";
  if (/AI|语音|搜索|总结|汇总|自动|识别|录音|控制电脑|简历|陪练/i.test(input)) return "ai_tool";
  if (/短视频|自媒体|账号|课程|知识付费|Notion|模板|咖啡店打卡/.test(input)) return "content";
  if (/教育|学生|背单词|错题|Python|Excel|数学|英语/.test(input)) return "education";
  if (/公司|团队|老板|员工|客户|审批|协作/.test(input)) return "organization";
  return "general";
}

function selectLocalFrictionIds(input, profile) {
  const sets = {
    ai_tool: ["execution_dependency", "trust_permission_risk", "cost_maintenance", "evidence_replacement", "scope_creep"],
    ai_content: ["execution_dependency", "acquisition_reach", "cost_maintenance", "trust_permission_risk", "retention_cooling"],
    content: ["expression_first_step", "acquisition_reach", "real_demand_pain", "evidence_replacement", "retention_cooling"],
    physical: ["execution_dependency", "cost_maintenance", "trust_permission_risk", "evidence_replacement", "retention_cooling"],
    education: ["real_demand_pain", "acquisition_reach", "cost_maintenance", "evidence_replacement", "retention_cooling"],
    organization: ["organization_alignment", "trust_permission_risk", "execution_dependency", "cost_maintenance", "acquisition_reach"],
    general: ["expression_first_step", "execution_dependency", "cost_maintenance", "evidence_replacement", "retention_cooling"]
  };

  const selected = [...(sets[profile] || sets.general)];
  if (/权限|隐私|账号|数据|控制|老人|用药/.test(input) && !selected.includes("trust_permission_risk")) {
    selected.splice(2, 0, "trust_permission_risk");
  }

  return [...new Set(selected)].slice(0, 5);
}

function createDirectBuildPacket(input, name, task) {
  const artifact = getDirectBuildArtifact(task);
  return {
    id: `custom-direct-build-${hashIdea(input)}`,
    label: `自定义：${name}`,
    seed: `custom-${hashIdea(input)}`,
    idea: {
      name,
      input,
      pitch: input,
      scene: "直接开工"
    },
    clarityGate: {
      status: "ready",
      label: "直接开工",
      summary: "小人看了一眼：这条不用摔，直接开工。",
      reason: "这是一个明确、低风险、可以在本地或浏览器先做出来的小任务。",
      routeMode: "direct_build",
      firstRunnableArtifact: artifact,
      safetyShrink: task.safetyShrink || "",
      riskFlags: task.safetyShrink ? ["ip_safety"] : [],
      directBuildTask: task,
      doorwayLine: "这条不用摔，能直接开工。",
      doorwaySource: "local_route_mode"
    },
    path: {
      start: input,
      minimumResult: artifact,
      validation: Array.isArray(task.acceptanceCriteria) && task.acceptanceCriteria[0]
        ? task.acceptanceCriteria[0]
        : "本地打开后能直接使用。"
    },
    selectedFrictionIds: [],
    frictionBites: [],
    verdict: {
      status: "直接开工",
      biggestBlocker: "这不是要不要走的问题，而是先做一版的问题。",
      strongestBranch: artifact,
      smallestValidation: Array.isArray(task.acceptanceCriteria) ? task.acceptanceCriteria[0] : "本地打开后能直接使用。",
      survivalReason: "任务足够明确，不需要先走 5 步现实摩擦。",
      notNow: "先别做账号、后台、数据库或发布系统；只做本地第一版。"
    },
    signals: { ...FRICTION_SIGNALS, confusion: 14, techPressure: 28, branchCount: 0 },
    agents: COMMON_AGENTS.map((agent) => ({ ...agent }))
  };
}

function createStoppedPacket(input, name, boundary) {
  const isBlocked = boundary.status === "blocked";
  const isReality = boundary.status === "reality_review";
  const isScope = boundary.status === "scope_review";

  return {
    id: `custom-${boundary.status}-${hashIdea(input)}`,
    label: `自定义：${name}`,
    seed: `custom-${hashIdea(input)}`,
    idea: {
      name,
      input,
      pitch: input,
      scene: isBlocked ? "安全红线" : isReality ? "现实前提" : isScope ? "范围拆入口" : "边界判断"
    },
    clarityGate: boundary,
    path: {
      start: input,
      minimumResult: isBlocked ? "不进入产品拆解。" : isReality ? "先不拆产品版本。" : isScope ? "先拆出一个可试入口。" : "先不拆产品版本。",
      validation: isBlocked ? "不进入验证路径。" : isReality ? "先选清楚它到底是视觉效果、硬件装置，还是科幻概念。" : isScope ? "先选一条小入口，再让小人试走。" : "先过边界判断；通过前不进入现实摩擦。"
    },
    verdict: {
      status: isBlocked ? "拒绝继续。" : isReality ? "先停在现实前提层。" : isScope ? "先停在范围拆入口层。" : "先停在边界层。",
      biggestBlocker: boundary.reason || boundary.summary
    },
    signals: { ...FRICTION_SIGNALS, heat: 24, trust: 18 },
    agents: COMMON_AGENTS,
    selectedFrictionIds: [],
    frictionBites: []
  };
}

function createDefinitionPacket(input, name, clarity) {
  const question = clarity.nextQuestions?.[0] || "你具体想做什么？先说一个方向、类目或物件。";

  return {
    id: `custom-needs-${hashIdea(input)}`,
    label: `自定义：${name}`,
    seed: `custom-${hashIdea(input)}`,
    idea: {
      name,
      input,
      pitch: input,
      scene: "缺口诊断"
    },
    clarityGate: clarity,
    path: {
      start: input,
      minimumResult: "先补出一个方向、类目或物件。",
      validation: "补完以后，再进入现实摩擦。"
    },
    verdict: {
      status: "这个输入还不适合被强行分析。",
      biggestBlocker: "现在只有愿望或大类词，继续分析会变成瞎猜。",
      strongestBranch: "先把它压成一个具体对象。",
      smallestValidation: question,
      notNow: "暂时不要分析获客、成本、替代品和留存。"
    },
    signals: { ...FRICTION_SIGNALS, confusion: 50, heat: 30 },
    agents: COMMON_AGENTS,
    selectedFrictionIds: ["expression_first_step"],
    frictionBites: [
      {
        id: "definition",
        frictionId: "expression_first_step",
        title: "第 1 口：缺口诊断",
        lens: "听不懂的人",
        agentId: "pm",
        background: "产品人",
        tempRole: "听不懂的人",
        emotion: "confused",
        action: "misread_idea",
        event: "definition_gap",
        evidenceStatus: "opinion",
        bubble: question,
        plainTake: question,
        friction: "输入还停在愿望层或大类词上。",
        mutation: "先补出方向、类目或物件。",
        branch: "补完以后再进入现实摩擦。",
        target: { x: 68, y: 66 },
        signalDelta: { confusion: 12, heat: -2 }
      }
    ]
  };
}

function createRunnablePacket(input, name, clarity, profile, selectedFrictionIds) {
  const anchors = extractIdeaAnchors(input, name);
  const minimumResult = buildMinimumResult(name, profile, anchors);
  const validation = buildValidationAction(profile, anchors);
  const frictionBites = selectedFrictionIds.map((frictionId, index) => createLocalBite(frictionId, index, input, name, profile, anchors));

  return {
    id: `custom-ready-${hashIdea(input)}`,
    label: `自定义：${name}`,
    seed: `custom-${hashIdea(input)}`,
    idea: {
      name,
      input,
      pitch: input,
      scene: "替身预演"
    },
    clarityGate: clarity,
    path: {
      start: input,
      minimumResult,
      validation
    },
    verdict: {
      status: "这轮先别按完整版本开工。",
      biggestBlocker: buildBiggestBlocker(profile, anchors),
      strongestBranch: minimumResult,
      smallestValidation: validation,
      notNow: buildNotNow(profile),
      survivalReason: buildSurvivalReason(profile, anchors, minimumResult),
      abandonedRoutes: buildAbandonedRoutes(profile, anchors),
      branchOptions: buildBranchOptions(profile, anchors)
    },
    signals: buildSignalsForProfile(profile),
    agents: COMMON_AGENTS,
    selectedFrictionIds,
    frictionBites: chainSurvivingRoutes(frictionBites, `原始想法：${anchors.ideaObject || name}`)
  };
}

function createLocalBite(frictionId, index, input, name, profile, anchors = extractIdeaAnchors(input, name)) {
  const definition = FRICTION_LIBRARY[frictionId];
  const defaults = definition.defaultState;
  const draft = getLocalBiteDraft(frictionId, input, name, profile, anchors);
  const previewStep = buildSubstitutePreviewStep({ bite: draft, definition, frictionId, index, name });

  return {
    id: frictionId,
    frictionId,
    stepNumber: previewStep.stepNumber,
    stepTitle: previewStep.stepTitle,
    frictionType: previewStep.frictionType,
    currentSurvivingRoute: previewStep.currentSurvivingRoute,
    agentAttempt: previewStep.agentAttempt,
    realityFeedback: previewStep.realityFeedback,
    burden: previewStep.burden,
    routeChange: previewStep.routeChange,
    verdict: previewStep.verdict,
    nextMove: previewStep.nextMove,
    title: previewStep.stepTitle,
    lens: definition.role,
    agentId: draft.agentId || defaults.agentId,
    background: draft.background || definition.role,
    tempRole: definition.role,
    emotion: draft.emotion || defaults.emotion,
    action: draft.action || defaults.action,
    event: draft.event || defaults.event,
    evidenceStatus: draft.evidenceStatus || (definition.evidencePolicy === "needs_check_or_verified" ? "needs_check" : "opinion"),
    bubble: draft.bubble,
    plainTake: draft.plainTake,
    friction: draft.friction,
    mutation: draft.mutation,
    branch: draft.branch,
    target: draft.target,
    signalDelta: { ...defaults.signalDelta, ...draft.signalDelta }
  };
}

function buildSubstitutePreviewStep({ bite = {}, definition = {}, frictionId = "", index = 0, name = "这个想法" }) {
  const stepNumber = index + 1;
  const frictionType = definition.label || bite.frictionType || bite.frictionId || frictionId || "现实摩擦";
  const routeVerdict = getRouteVerdict(frictionId, stepNumber);

  return {
    stepNumber,
    stepTitle: bite.stepTitle || `第 ${stepNumber} 步：${getStepActionTitle(frictionId, name)}`,
    frictionType,
    currentSurvivingRoute: bite.currentSurvivingRoute || (stepNumber === 1 ? `原始想法：${name}` : `第 ${stepNumber - 1} 步后留下的路线`),
    agentAttempt: bite.agentAttempt || getAgentAttempt(frictionId, name),
    realityFeedback: bite.realityFeedback || bite.friction || bite.plainTake || bite.bubble || "现实反馈还不清楚。",
    burden: bite.burden || getBurdenForFriction(frictionId),
    routeChange: bite.routeChange || {
      from: stepNumber === 1 ? "原始想法" : `第 ${stepNumber - 1} 步后的路线`,
      to: bite.branch || bite.mutation || "更小、更可验证的路线",
      summary: bite.mutation || "路线被现实反馈压小。"
    },
    verdict: bite.verdict || routeVerdict,
    nextMove: bite.nextMove || bite.branch || bite.plainTake || "先做下一步最小动作。"
  };
}

function chainSurvivingRoutes(bites = [], initialRoute = "原始想法") {
  let currentRoute = initialRoute;

  return bites.map((bite, index) => {
    const routeTo = bite.routeChange?.to || bite.nextMove || bite.branch || "更小、更可验证的路线";
    const routeChange = {
      ...bite.routeChange,
      from: currentRoute,
      to: routeTo
    };

    const chainedBite = {
      ...bite,
      stepNumber: index + 1,
      currentSurvivingRoute: currentRoute,
      routeChange
    };

    currentRoute = routeTo;
    return chainedBite;
  });
}

function getStepActionTitle(frictionId, name) {
  const titles = {
    expression_first_step: "小人尝试让第一个人听懂",
    real_demand_pain: "小人尝试确认这件事够不够痛",
    execution_dependency: "小人尝试跑通第一段执行",
    cost_maintenance: "小人尝试算清这段路的消耗",
    evidence_replacement: "小人尝试查清替代路线",
    acquisition_reach: "小人尝试找到第一批人",
    trust_permission_risk: "小人尝试跨过信任和权限",
    retention_cooling: "小人尝试撑过新鲜感",
    scope_creep: "小人尝试砍掉膨胀范围",
    organization_alignment: "小人尝试放进真实协作流程"
  };

  return titles[frictionId] || `小人尝试推进“${name}”`;
}

function getAgentAttempt(frictionId, name) {
  const attempts = {
    expression_first_step: `小人尝试把“${name}”讲给第一个可能用户听。`,
    real_demand_pain: `小人尝试确认“${name}”是不是今天就值得解决。`,
    execution_dependency: `小人尝试把“${name}”拆成第一版能跑通的一段流程。`,
    cost_maintenance: `小人尝试估一遍这条路线会消耗多少资源。`,
    evidence_replacement: `小人尝试查清这条路线会不会撞到已有替代品。`,
    acquisition_reach: `小人尝试找到第一批愿意试“${name}”的人。`,
    trust_permission_risk: `小人尝试让用户放心交出必要权限、数据或注意力。`,
    retention_cooling: `小人尝试让用户在新鲜感过去后还愿意回来。`,
    scope_creep: `小人尝试只保留“${name}”第一版必须完成的动作。`,
    organization_alignment: `小人尝试把“${name}”放进真实团队流程。`
  };

  return attempts[frictionId] || `小人尝试带着“${name}”往前走一步。`;
}

function getBurdenForFriction(frictionId) {
  const burdens = {
    expression_first_step: { time: "低", money: "低", mental: "中", trust: "低", skill: "低" },
    real_demand_pain: { time: "中", money: "低", mental: "中", trust: "低", skill: "低" },
    execution_dependency: { time: "高", money: "中", mental: "中", trust: "低", skill: "高" },
    cost_maintenance: { time: "中", money: "高", mental: "中", trust: "低", skill: "中" },
    evidence_replacement: { time: "中", money: "低", mental: "中", trust: "中", skill: "中" },
    acquisition_reach: { time: "高", money: "低", mental: "高", trust: "中", skill: "中" },
    trust_permission_risk: { time: "中", money: "低", mental: "高", trust: "高", skill: "中" },
    retention_cooling: { time: "高", money: "低", mental: "高", trust: "中", skill: "低" },
    scope_creep: { time: "高", money: "中", mental: "中", trust: "低", skill: "中" },
    organization_alignment: { time: "高", money: "中", mental: "高", trust: "高", skill: "中" }
  };

  return burdens[frictionId] || { time: "中", money: "低", mental: "中", trust: "低", skill: "中" };
}

function getRouteVerdict(frictionId, stepNumber) {
  const verdicts = {
    expression_first_step: "mutate",
    real_demand_pain: "mutate",
    execution_dependency: "mutate",
    cost_maintenance: "mutate",
    evidence_replacement: "branch",
    acquisition_reach: "branch",
    trust_permission_risk: "mutate",
    retention_cooling: "stop",
    scope_creep: "mutate",
    organization_alignment: "stop"
  };

  return verdicts[frictionId] || (stepNumber >= 5 ? "stop" : "continue");
}

function getLocalBiteDraft(frictionId, input, name, profile, anchors = extractIdeaAnchors(input, name)) {
  const drafts = {
    expression_first_step: {
      agentId: "linran",
      background: "路过用户",
      bubble: "这个我大概听懂了，但第一步别铺太大。",
      plainTake: `这个能往下看。先把“${name}”压成用户打开后第一件事。`,
      friction: "想法能听懂，但入口动作还需要更短。",
      mutation: "从完整愿景压成第一个动作。",
      branch: "第一版只保留一个入口动作。",
      target: { x: 72, y: 56 },
      signalDelta: { confusion: 8, branchCount: 1 }
    },
    real_demand_pain: {
      agentId: "laozhou",
      background: "怀疑者",
      bubble: "我不怀疑它有用，我怀疑有没有痛到现在就要用。",
      plainTake: "看着有用不够。先找一个今天就愿意试的人，不然它只是“不错”。",
      friction: "可能有兴趣，但痛感和付费动机不够强。",
      mutation: "从泛泛有用改成抓一个强场景。",
      branch: "先找 3 个已经在用土办法解决的人。",
      target: { x: 56, y: 78 },
      signalDelta: { heat: -6, replacementPressure: 4 }
    },
    execution_dependency: {
      agentId: "ajie",
      background: "工程执行者",
      bubble: "真正麻烦的不是界面，是背后那串依赖。",
      plainTake: "先别做完整系统。把最短流程跑通一遍，哪怕后面全靠手动。",
      friction: "关键依赖、权限、数据或流程会把项目拖大。",
      mutation: "从完整系统缩成一段可跑通流程。",
      branch: "第一版只证明一个核心动作能完成。",
      target: { x: 42, y: 62 },
      signalDelta: { techPressure: 12, branchCount: 1 }
    },
    cost_maintenance: {
      agentId: "budget",
      background: "成本敏感用户",
      bubble: "这东西做出来以后，还要一直养着。",
      plainTake: "先把最贵的那块揪出来：时间、人工、数据、模型，哪个会一直烧。",
      friction: "长期维护和单次运行成本可能吃掉第一版。",
      mutation: "从全量自动化缩到低成本验证。",
      branch: "先做一次手动或半自动交付，确认用户真的要。",
      target: { x: 63, y: 76 },
      signalDelta: { techPressure: 8, heat: -2 }
    },
    evidence_replacement: {
      agentId: "searcher",
      background: "查证员",
      evidenceStatus: "needs_check",
      bubble: "这里不能凭感觉说新。要查别人已经做到哪一步。",
      plainTake: "先查替代品，不是为了否定它，是为了找到别人做得最别扭的那个点。",
      friction: "可能撞到成熟产品、替代行为或已有习惯。",
      mutation: "从“我觉得新”改成“一个明确差异点”。",
      branch: "只保留一个替代品没处理好的细节。",
      target: { x: 70, y: 42 },
      signalDelta: { replacementPressure: 12, cloneRisk: 8 }
    },
    acquisition_reach: {
      agentId: "pm",
      background: "产品人",
      bubble: "做出来以后，第一批人从哪来？",
      plainTake: "别先想大流量。先找一个你今天能碰到的入口，哪怕只有 5 个人。",
      friction: "第一批用户可能找不到，反馈也可能收不到。",
      mutation: "从产品功能转到第一批触达。",
      branch: "先用一个现成入口找 5 个真实人试。",
      target: { x: 68, y: 66 },
      signalDelta: { heat: -2, branchCount: 1 }
    },
    trust_permission_risk: {
      agentId: "xiaochen",
      background: "谨慎用户",
      bubble: "只要碰到数据、权限或个人内容，我会先犹豫。",
      plainTake: "先让用户知道它看了什么、做了什么、能不能撤回。信任没过，功能越强越吓人。",
      friction: "权限、隐私、内容安全或责任边界会挡住使用。",
      mutation: "从默认授权改成可见、可关、可撤回。",
      branch: "第一版只请求完成核心动作所需的最小权限。",
      target: { x: 51, y: 80 },
      signalDelta: { confusion: 6, techPressure: 4 }
    },
    retention_cooling: {
      agentId: "laozhou",
      background: "冷却用户",
      bubble: "第一眼喜欢不算，三天后还会不会回来？",
      plainTake: "别测“哇好酷”。测用户过两天还会不会主动打开，或者愿不愿意为它省下的麻烦付钱。",
      friction: "新鲜感过后，习惯和付费意愿可能冷掉。",
      mutation: "从首眼吸引改成持续动作。",
      branch: "让用户连续 3 天完成同一个动作。",
      target: { x: 76, y: 55 },
      signalDelta: { heat: -7, replacementPressure: 5 }
    },
    scope_creep: {
      agentId: "ajie",
      background: "独立开发者",
      bubble: "这很容易越做越大。",
      plainTake: "第一版只留一个动作。只要你开始补账号、后台、自动化，它就会膨胀。",
      friction: "第一版容易漂移成完整平台或系统。",
      mutation: "从平台化愿景砍成一个可验证动作。",
      branch: "只做一个动作的窄版本。",
      target: { x: 31, y: 60 },
      signalDelta: { techPressure: 10, branchCount: 1 }
    },
    organization_alignment: {
      agentId: "pm",
      background: "协作拦路人",
      bubble: "给团队用的话，卡点经常不是界面，是谁批准谁负责。",
      plainTake: "如果它要进公司流程，先问谁批准、谁维护、出了问题谁背锅。",
      friction: "组织里的审批、责任和交接会让想法变形。",
      mutation: "从个人工具改成明确责任边界。",
      branch: "先找一个愿意负责的内部使用者。",
      target: { x: 38, y: 64 },
      signalDelta: { confusion: 6, techPressure: 5 }
    }
  };

  if (profile === "ai_content") {
    const aiContentDrafts = {
      execution_dependency: {
        ...drafts.execution_dependency,
        bubble: "这是一条内容流水线，不是一个按钮。",
        plainTake: "先别做全集成。用即梦这类现成工具手动串一次：选题、文案、生成、剪辑、标题，看看哪一步最掉质量。",
        friction: "选题、文案、生成视频、剪辑和标题每一步都会损耗内容质量。",
        mutation: "从全自动工具缩成一条手动跑通的内容流程。",
        branch: "先做 3 条同主题小猫视频，记录每一步哪里最费劲。"
      },
      acquisition_reach: {
        ...drafts.acquisition_reach,
        bubble: "小猫视频不等于一定有流量。",
        plainTake: "它要先证明能博流量，再谈带货。先看完播、评论、收藏，不要一上来只盯成交。",
        friction: "平台分发和同质化内容会决定它有没有第一批流量。",
        mutation: "从带货工具改成先验证流量内容格式。",
        branch: "先固定一个账号、一个平台、一个小猫内容模板。"
      },
      cost_maintenance: {
        ...drafts.cost_maintenance,
        bubble: "生成视频便宜不等于反复试错便宜。",
        plainTake: "真正贵的是反复改选题、重生视频、调剪辑和标题。先算 3 条视频要花多少时间和工具额度。",
        friction: "AI 视频生成、剪辑和多轮重试会持续消耗时间与工具额度。",
        mutation: "从全集成自动化改成先算单条内容成本。",
        branch: "先记录 3 条视频从选题到发布前的总耗时。"
      },
      trust_permission_risk: {
        ...drafts.trust_permission_risk,
        bubble: "带货一挂上去，平台规则和广告表达就进来了。",
        plainTake: "它既能做流量小猫视频，也能适配带货；但带货那一层要单独过商品、素材、夸张表达和平台规则。",
        friction: "带货内容会触发平台规则、商品可信度、素材授权和虚假宣传边界。",
        mutation: "把流量内容和带货表达分成两层验证。",
        branch: "先做不挂商品的流量版，再单独测一个低风险品类。"
      },
      retention_cooling: {
        ...drafts.retention_cooling,
        bubble: "AI 小猫看多了也会腻。",
        plainTake: "别只测第一条可不可爱。测同一个模板发到第 3 条时，观众还停不停。",
        friction: "AI 小猫内容容易模板化，审美疲劳会很快来。",
        mutation: "从单条惊艳改成可持续栏目。",
        branch: "用同一模板做 3 条，看数据是不是一路掉。"
      }
    };

    return applyIdeaAnchorsToDraft(aiContentDrafts[frictionId] || drafts[frictionId] || drafts.expression_first_step, frictionId, anchors);
  }

  return applyIdeaAnchorsToDraft(drafts[frictionId] || drafts.expression_first_step, frictionId, anchors);
}

function applyIdeaAnchorsToDraft(draft, frictionId, anchors = {}) {
  const anchoredRoute = anchors.routeByFriction?.[frictionId];
  if (!anchoredRoute) return draft;

  return {
    ...draft,
    agentAttempt: getAnchoredAgentAttempt(frictionId, anchors, draft.agentAttempt),
    mutation: getAnchoredMutation(frictionId, anchors, draft.mutation),
    branch: anchoredRoute
  };
}

function getAnchoredAgentAttempt(frictionId, anchors = {}, fallback = "") {
  const object = anchors.ideaObject || "这个想法";
  const action = anchors.coreAction || anchors.concreteNarrowMove || "最小动作";
  const scene = anchors.targetScene || "第一个可能用户";

  const attempts = {
    expression_first_step: `小人尝试把“${object}”讲给${scene}听。`,
    real_demand_pain: `小人尝试确认${scene}是不是真的需要${quoteAnchor(action)}。`,
    execution_dependency: `小人尝试先跑通${quoteAnchor(action)}这一段。`,
    cost_maintenance: `小人尝试算清${quoteAnchor(action)}这段路会消耗多少资源。`,
    evidence_replacement: `小人尝试查清${quoteAnchor(action)}会不会撞到已有替代品。`,
    acquisition_reach: `小人尝试找到第一批会在这个场景里用${quoteAnchor(action)}的人。`,
    trust_permission_risk: `小人尝试让用户放心交出${quoteAnchor(action)}所需的最小权限。`,
    retention_cooling: `小人尝试验证用户会不会重复使用${quoteAnchor(action)}。`,
    scope_creep: `小人尝试砍掉完整路线，只留下${getScopedSurvivorText(anchors.concreteNarrowMove || action)}。`,
    organization_alignment: `小人尝试把${quoteAnchor(action)}放进真实协作流程。`
  };

  return attempts[frictionId] || fallback || `小人尝试带着“${object}”往前走一步。`;
}

function getAnchoredMutation(frictionId, anchors = {}, fallback = "路线被现实反馈压小。") {
  if (frictionId === "execution_dependency") {
    return `从完整愿景压成${quoteAnchor(anchors.coreAction || anchors.concreteNarrowMove || "一个具体动作")}。`;
  }

  if (frictionId === "trust_permission_risk") {
    return `从默认交出权限改成只给${quoteAnchor(anchors.coreAction || "核心动作")}所需的最小权限。`;
  }

  if (frictionId === "cost_maintenance") {
    return `从全量自动化缩到一次${quoteAnchor(anchors.coreAction || "核心动作")}的低成本验证。`;
  }

  if (frictionId === "evidence_replacement") {
    return "从泛泛差异点改成一个现有替代品没处理好的具体细节。";
  }

  if (frictionId === "scope_creep") {
    return `从完整平台砍成${quoteAnchor(anchors.concreteNarrowMove || anchors.coreAction || "一个具体动作")}。`;
  }

  if (frictionId === "retention_cooling") {
    return "从首眼吸引改成一个用户愿意重复的小动作。";
  }

  return fallback;
}

function getScopedSurvivorText(value) {
  const text = String(value || "一个具体动作")
    .replace(/^只做/, "")
    .replace(/^先做/, "")
    .trim();

  return quoteAnchor(text);
}

function quoteAnchor(value) {
  const text = String(value || "一个具体动作").trim();
  return /[“”]/.test(text) ? text : `“${text}”`;
}

function buildMinimumResult(name, profile, anchors = {}) {
  if (anchors.concreteNarrowMove) return anchors.concreteNarrowMove;

  const results = {
    ai_tool: `先做“${name}”里最窄的一条流程，只支持一个输入和一个输出。`,
    ai_content: "先用现成视频工具手动跑 3 条 AI 小猫视频：一个主题、一个模板、一个平台；带货只挂一个品类。",
    content: `先做 3 条内容或 1 个模板，别先搭完整账号矩阵。`,
    physical: `先做一个能演示核心动作的假原型，别先开模或备货。`,
    education: `先做一节课或一个练习动作，让 3 个真实学习者试。`,
    organization: `先做一个内部手动流程，确认谁会用、谁负责。`,
    general: `先做一个能让别人当场试的最小版本。`
  };

  return results[profile] || results.general;
}

function buildValidationAction(profile, anchors = {}) {
  if (anchors.validationAction) return anchors.validationAction;

  const actions = {
    ai_tool: "找 3 个目标用户现场完成同一个任务，看他们是否愿意第二天再用。",
    ai_content: "先发 3 条 AI 小猫视频，看完播、评论、收藏和商品点击；没有这些，不做全集成。",
    content: "连续发 3 条内容或卖 1 个模板，看是否有人收藏、私信或愿意付钱。",
    physical: "用假模型或视频演示给 5 个人看，观察他们是否问价格、场景或安全问题。",
    education: "让 3 个学习者完成第一节或第一题，看他们卡在哪里。",
    organization: "找一个真实流程负责人，让他按现在的土办法走一遍，再看哪里最痛。",
    general: "找 5 个真实人试一次，看他们是否能说清它解决了什么。"
  };

  return actions[profile] || actions.general;
}

function buildBiggestBlocker(profile, anchors = {}) {
  if (anchors.biggestBlocker) return anchors.biggestBlocker;

  const blockers = {
    ai_tool: "最大卡点是把功能范围、权限和成本压到第一版能承受。",
    ai_content: "最大卡点不是能不能生成小猫视频，而是平台和观众会不会把它当成值得看的内容，不是模板感噪音。",
    content: "最大卡点是内容持续性和第一批观众从哪来。",
    physical: "最大卡点是安全、成本和能不能做出可信的第一版。",
    education: "最大卡点是学习者是否真的愿意完成第一个动作。",
    organization: "最大卡点是责任边界和内部流程是否愿意接纳它。",
    general: "最大卡点是第一版太容易做散。"
  };

  return blockers[profile] || blockers.general;
}

function buildSurvivalReason(profile, anchors = {}, minimumResult = "") {
  if (anchors.survivalReason) return anchors.survivalReason;
  const move = minimumResult || anchors.concreteNarrowMove || "一个最小动作";

  const reasons = {
    ai_tool: `它避开了完整自动化、权限和长期维护的重路线，只保留${quoteAnchor(move)}来验证。`,
    ai_content: `它避开了全集成自动化和多平台矩阵，只保留${quoteAnchor(move)}来验证内容是否有人看。`,
    content: `它避开了账号矩阵和完整内容体系，只保留${quoteAnchor(move)}来验证第一批观众。`,
    physical: `它避开了开模、备货和供应链，只保留${quoteAnchor(move)}来验证真实痛点。`,
    education: `它避开了完整课程和长期学习系统，只保留${quoteAnchor(move)}来验证学习者是否愿意完成。`,
    organization: `它避开了后台和复杂审批，只保留${quoteAnchor(move)}来验证真实流程是否接得住。`,
    general: `它避开了完整平台路线，只保留${quoteAnchor(move)}来验证。`
  };

  return reasons[profile] || reasons.general;
}

function buildAbandonedRoutes(profile, anchors = {}) {
  if (Array.isArray(anchors.abandonedRoutes) && anchors.abandonedRoutes.length > 0) {
    return anchors.abandonedRoutes;
  }

  const move = anchors.concreteNarrowMove || anchors.coreAction || "最小动作";
  const routes = {
    ai_tool: [
      { title: "完整自动化路线", reason: "权限、成本和维护太重，第一版先放下。" },
      { title: "通用助手路线", reason: "范围太大，会遮住真正要验证的核心动作。" },
      { title: "长期记忆路线", reason: "隐私和保存边界太重，暂时不进入试走。" }
    ],
    ai_content: [
      { title: "全集成内容流水线路线", reason: "自动化链条太长，先放下。" },
      { title: "多平台矩阵路线", reason: "分发变量太多，会看不清内容模板是否成立。" }
    ],
    content: [
      { title: "完整账号体系路线", reason: "选题、包装和长期更新太重，第一版先放下。" },
      { title: "泛泛内容路线", reason: "观众不知道为什么停留，先压到一个具体场景。" }
    ],
    physical: [
      { title: "开模备货路线", reason: "成本和库存太重，第一版先放下。" },
      { title: "多品类路线", reason: "品类太散，会看不清哪个痛点真实存在。" }
    ],
    education: [
      { title: "完整课程路线", reason: "制作和交付太重，先放下。" },
      { title: "长期学习系统路线", reason: "维护成本太高，第一版先验证一个学习动作。" }
    ],
    organization: [
      { title: "完整后台系统路线", reason: "审批、权限和责任边界太重，第一版先放下。" },
      { title: "全团队铺开路线", reason: "协作变量太多，先找一个流程点试走。" }
    ],
    general: [
      { title: "完整产品路线", reason: "范围太重，第一版先放下。" },
      { title: "多功能路线", reason: `它会冲淡${quoteAnchor(move)}这条最小试走动作。` }
    ]
  };

  return routes[profile] || routes.general;
}

function buildBranchOptions(profile, anchors = {}) {
  if (Array.isArray(anchors.branchOptions) && anchors.branchOptions.length > 0) {
    return anchors.branchOptions;
  }

  const move = anchors.concreteNarrowMove || anchors.coreAction || "最小动作";
  const options = {
    ai_tool: [
      { title: "单动作工具", whyAlive: `只验证${quoteAnchor(move)}，不用先做完整系统。` },
      { title: "半自动交付版", whyAlive: "先用人手补齐后台，确认用户是否真的要结果。" }
    ],
    ai_content: [
      { title: "单模板内容测试", whyAlive: "先看一个模板是否有人看，不急着做工具链。" },
      { title: "手动流水线", whyAlive: "先手动跑完，知道哪一步最耗损。" }
    ],
    content: [
      { title: "单场景内容", whyAlive: "只解决一个具体场景，观众能马上判断有没有用。" },
      { title: "系列试播", whyAlive: "先连续做几条，看是否有人回来。" }
    ],
    physical: [
      { title: "假样品验证", whyAlive: "不用先生产，也能看用户是否愿意问价格。" },
      { title: "单痛点测试", whyAlive: "只看一个痛点，反馈更干净。" }
    ],
    education: [
      { title: "一题/一节试学", whyAlive: "只验证一个学习动作，成本最低。" },
      { title: "课后检查", whyAlive: "先看学习者是否真的掌握，不做完整课程。" }
    ],
    organization: [
      { title: "单流程手动版", whyAlive: "先进入一个真实流程点，不改整个组织。" },
      { title: "负责人试用版", whyAlive: "先找到一个愿意负责的人，再谈系统化。" }
    ],
    general: [
      { title: "最小试走版", whyAlive: `只保留${quoteAnchor(move)}，先看现实反馈。` },
      { title: "半手动版本", whyAlive: "先把结果交付出来，不急着搭完整产品。" }
    ]
  };

  return options[profile] || options.general;
}

function buildNotNow(profile) {
  const notNow = {
    ai_tool: "暂时不要做全自动、多账号、长期记忆和完整平台。",
    ai_content: "暂时不要做选题、文案、生成、剪辑、标题、带货全自动闭环，也不要一上来做多平台矩阵。",
    content: "暂时不要做复杂包装、矩阵账号和长期课程体系。",
    physical: "暂时不要开模、囤货或做完整供应链。",
    education: "暂时不要做完整课程、社区和证书体系。",
    organization: "暂时不要先做后台、权限系统和复杂审批流。",
    general: "暂时不要把第一版做成完整平台。"
  };

  return notNow[profile] || notNow.general;
}

function buildSignalsForProfile(profile) {
  const overlays = {
    ai_tool: { heat: 66, techPressure: 68, replacementPressure: 50 },
    ai_content: { heat: 64, techPressure: 58, replacementPressure: 62 },
    content: { heat: 58, confusion: 30, replacementPressure: 54 },
    physical: { heat: 55, techPressure: 62, replacementPressure: 42 },
    education: { heat: 54, confusion: 28, replacementPressure: 48 },
    organization: { heat: 46, techPressure: 54, replacementPressure: 38 },
    general: { heat: 50, confusion: 32, replacementPressure: 44 }
  };

  return { ...FRICTION_SIGNALS, ...(overlays[profile] || overlays.general) };
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function hashIdea(text) {
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).slice(0, 8);
}

function hydrateSubstitutePreviewCase(caseItem) {
  const status = caseItem?.clarityGate?.status;
  if (status !== "ready" && status !== "usable") return caseItem;

  const name = caseItem.idea?.name || caseItem.label || "这个想法";
  const input = caseItem.idea?.input || caseItem.idea?.pitch || name;
  const profile = inferIdeaProfile(input);
  const anchors = extractIdeaAnchors(input, name);

  if (caseItem.idea) {
    caseItem.idea.scene = "替身预演";
  }

  const hydratedBites = (caseItem.frictionBites || []).map((bite, index) => {
    const frictionId = bite.frictionId || caseItem.selectedFrictionIds?.[index] || bite.id;
    const definition = FRICTION_LIBRARY[frictionId] || { label: bite.frictionType || bite.title || "现实摩擦" };
    const anchoredBite = applyIdeaAnchorsToDraft(bite, frictionId, anchors);
    const previewStep = buildSubstitutePreviewStep({ bite: anchoredBite, definition, frictionId, index, name, profile });

    return {
      ...anchoredBite,
      ...previewStep,
      title: previewStep.stepTitle
    };
  });

  if (caseItem.verdict) {
    if (anchors.concreteNarrowMove) caseItem.verdict.strongestBranch = anchors.concreteNarrowMove;
    if (anchors.validationAction) caseItem.verdict.smallestValidation = anchors.validationAction;
    if (anchors.biggestBlocker) caseItem.verdict.biggestBlocker = anchors.biggestBlocker;
    caseItem.verdict.survivalReason = buildSurvivalReason(profile, anchors, caseItem.verdict.strongestBranch);
    caseItem.verdict.abandonedRoutes = buildAbandonedRoutes(profile, anchors);
    caseItem.verdict.branchOptions = buildBranchOptions(profile, anchors);
  }

  caseItem.frictionBites = chainSurvivingRoutes(hydratedBites, caseItem.path?.start || `原始想法：${anchors.ideaObject || name}`);

  return caseItem;
}

window.buildLocalFrictionPacketV0 = buildLocalFrictionPacketV0;
window.buildDoorwayReviewOverridePacketV0 = buildDoorwayReviewOverridePacketV0;
window.buildAiDoorwayJudgePacketV0 = buildAiDoorwayJudgePacketV0;

window.FRICTION_CASES = {
  "earth-clock": {
    id: "earth-clock",
    label: "3D 地球时钟",
    seed: "earth-clock-01",
    idea: {
      name: "3D 地球时钟",
      input: "我想做一个像游戏一样的 3D 地球时钟。转到哪里就能看到当地现在几点，以及今天发生了什么国家关联事件，国家之间会有连线。",
      pitch: "一个像游戏一样的世界时钟。转动地球，看各地现在几点，以及今天哪些国家之间发生了有关联的事件。",
      scene: "现实摩擦预演"
    },
    clarityGate: {
      status: "ready",
      label: "可以进入预演",
      summary: "已经能看出产品形态、第一版画面和最小验证方式。后面的摩擦可以直接看数据、维护、替代品和留存。"
    },
    path: {
      start: "像游戏一样的 3D 地球时钟，能看时间、国家事件和连线。",
      minimumResult: "先做一个静态互动地球，只放 5 条手写精选国际事件。",
      validation: "找 5 个目标用户现场试玩，观察他们是否会主动转地球、复述价值、愿意收藏。"
    },
    verdict: {
      status: "原 idea 不建议按“大新闻 + 世界时钟 + 自动关联”直接开工。",
      biggestBlocker: "最大卡点不是 3D 地球，而是事件数据、关联解释和用户为什么持续打开。",
      strongestBranch: "最有生命力的分叉是“互动地球事件展示 / 世界事件日历”，先当可玩的展品验证。",
      smallestValidation: "用假数据做 1 个地球、5 条事件、3 条连线，测 5 个人是否停留 60 秒并能说清它是什么。",
      notNow: "暂时不要做实时新闻抓取、自动国家关系判断、完整世界时钟账号体系。"
    },
    signals: FRICTION_SIGNALS,
    agents: COMMON_AGENTS,
    selectedFrictionIds: ["expression_first_step", "execution_dependency", "cost_maintenance", "evidence_replacement", "retention_cooling"],
    frictionBites: [
      {
        id: "expression",
        frictionId: "expression_first_step",
        title: "第 1 口：表达摩擦",
        lens: "听不懂的人",
        agentId: "linran",
        background: "路过用户",
        tempRole: "听不懂的人",
        emotion: "confused",
        action: "misread_idea",
        event: "expression_friction",
        evidenceStatus: "opinion",
        bubble: "我听完只记得“好看的地球新闻 App”。重点到底是时间、新闻，还是国家关系？",
        plainTake: "这是个能转的地球新闻吗？我没搞清楚它到底要我干嘛。先别讲那么多，先讲成“今天世界发生了什么，我转地球就能看懂”。",
        friction: "一句话里塞了世界时钟、新闻、国家关系和 3D 玩具，用户会抓错重点。",
        mutation: "先把表达收窄成“今天世界发生了什么的互动地球”。",
        branch: "删掉世界时钟主卖点，把第一版讲成互动事件展示。",
        target: { x: 72, y: 61 },
        signalDelta: { heat: -3, confusion: 18, replacementPressure: 6 }
      },
      {
        id: "execution",
        frictionId: "execution_dependency",
        title: "第 2 口：执行摩擦",
        lens: "工程执行者",
        agentId: "ajie",
        background: "独立开发者",
        tempRole: "执行拆解者",
        emotion: "skeptical",
        action: "sketch_clone",
        event: "execution_friction",
        evidenceStatus: "opinion",
        bubble: "地球壳能搭，真正重的是事件从哪来、关系怎么解释、每天谁维护。",
        plainTake: "地球我能做，连线我也能做。麻烦的是每天的事件从哪来、谁判断它们有关、错了谁负责。第一版先别自动，先手写 5 条。",
        friction: "画面可做，但数据源、事件筛选、关系解释和维护会把小工具拖成数据产品。",
        mutation: "第一版不能碰自动实时数据，只能用手写精选事件验证体验。",
        branch: "最小可做版：静态地球 + 5 条手写事件 + 3 条连线。",
        target: { x: 28, y: 58 },
        signalDelta: { techPressure: 14, cloneRisk: 5, branchCount: 1 }
      },
      {
        id: "cost",
        frictionId: "cost_maintenance",
        title: "第 3 口：成本摩擦",
        lens: "成本敏感者",
        agentId: "budget",
        background: "成本敏感用户",
        tempRole: "预算审问者",
        emotion: "anxious",
        action: "calculate_cost",
        event: "cost_friction",
        evidenceStatus: "opinion",
        bubble: "实时新闻、自动关联、3D 地球一起上，第一版就会把时间和钱烧穿。",
        plainTake: "你是想做一个漂亮 Demo，还是想每天维护一个新闻产品？如果只是第一版，别碰实时更新，先做一期假的看看有没有人愿意玩。",
        friction: "成本不是一个点，而是持续维护成本：数据、审核、解释、更新、性能。",
        mutation: "把“每天自动更新”降级成“先手动做一期能不能让人停留”。",
        branch: "验证动作从做产品改成做 1 个可玩的假数据场景。",
        target: { x: 62, y: 79 },
        signalDelta: { heat: -2, techPressure: 12, cloneRisk: -1 }
      },
      {
        id: "replacement",
        frictionId: "evidence_replacement",
        title: "第 4 口：替代品摩擦",
        lens: "查证者",
        agentId: "searcher",
        background: "竞品搜索者",
        tempRole: "替代品猎人",
        emotion: "skeptical",
        action: "check_competitor",
        event: "replacement_friction",
        evidenceStatus: "needs_check",
        evidenceNote: "未联网查证；这里只能提出替代品风险，不能断言已有大量同类产品。",
        bubble: "我得先查世界时钟、新闻地图和事件看板有没有满足这个需求，不能凭感觉说它新。",
        plainTake: "这方向容易撞到世界时钟、新闻地图、事件看板这些东西，但我现在不能下结论。要先查具体替代品，再判断你的差异点。",
        friction: "存在替代品风险，但需要查证后才能判断具体撞到谁。",
        mutation: "把差异点改成“像玩具一样理解今天的世界”，不是更完整的新闻工具。",
        branch: "和新闻 App 竞争会输，和互动展示、课堂、作品集入口竞争更清楚。",
        target: { x: 36, y: 75 },
        signalDelta: { confusion: -4, cloneRisk: 16, replacementPressure: 14 }
      },
      {
        id: "cooling",
        frictionId: "retention_cooling",
        title: "第 5 口：冷却摩擦",
        lens: "冷却/离场者",
        agentId: "laozhou",
        background: "怀疑者",
        tempRole: "冷却者",
        emotion: "indifferent",
        action: "ignore_and_leave",
        event: "retention_friction",
        evidenceStatus: "opinion",
        bubble: "我会点开一次，但如果它只是新鲜，第二天我不会回来。先证明我会停留。",
        plainTake: "我可能会点开一次，因为它好看。但如果看完就没了，我明天不会回来。你先证明我愿意停一分钟，还能说清它是什么。",
        friction: "新鲜感会让人第一次点开，但不等于持续使用、收藏或付费。",
        mutation: "第一版指标不要定日活，先定“停留、复述、收藏意愿”。",
        branch: "更小分叉：把它做成可嵌入的互动展示，而不是日常工具。",
        target: { x: 76, y: 55 },
        signalDelta: { heat: -8, replacementPressure: 8, branchCount: 1 }
      }
    ]
  },

  "ai-reading-coach": {
    id: "ai-reading-coach",
    label: "AI 读书陪练",
    seed: "reading-coach-01",
    idea: {
      name: "AI 读书陪练",
      input: "我想做一个 AI 读书陪练。用户读一本书时，它能陪用户提问、总结、做卡片，还能每天督促继续读。",
      pitch: "一个陪用户读书、提问、总结、做卡片和督促复习的 AI 工具。",
      scene: "现实摩擦预演"
    },
    clarityGate: {
      status: "usable",
      label: "可以预演，但入口要收窄",
      summary: "已经知道大方向是读书陪练，但第一步入口不清楚：是导入书、粘贴一段、还是读完一章后被追问。",
      missing: ["第一步输入来源", "是否保存用户笔记", "用户第二天为什么回来"]
    },
    path: {
      start: "AI 陪用户读书、总结、提问、做卡片、督促复习。",
      minimumResult: "先只支持一篇文章或一章书，做 3 个好问题和 1 张复习卡。",
      validation: "找 5 个正在读书的人，测试他们是否愿意把自己的笔记交给它，并在第二天回来复习。"
    },
    verdict: {
      status: "原 idea 可以继续，但第一版不能做成全能读书系统。",
      biggestBlocker: "最大卡点是用户是否愿意持续读，而不是 AI 能不能总结。",
      strongestBranch: "更有生命力的分叉是“读完一章后帮我问 3 个扎心问题”，而不是完整知识库。",
      smallestValidation: "手动选 3 篇文章，让 AI 生成问题和复习卡，测用户第二天是否回来改卡片。",
      notNow: "暂时不要做多书库、社群、全自动知识图谱、长期提醒系统。"
    },
    signals: { ...FRICTION_SIGNALS, heat: 44, techPressure: 42, replacementPressure: 52 },
    agents: COMMON_AGENTS,
    selectedFrictionIds: ["expression_first_step", "execution_dependency", "cost_maintenance", "trust_permission_risk", "retention_cooling"],
    frictionBites: [
      {
        id: "expression",
        frictionId: "expression_first_step",
        title: "第 1 口：表达摩擦",
        lens: "听不懂的人",
        agentId: "xiaochen",
        background: "普通读者",
        tempRole: "听不懂的人",
        emotion: "confused",
        action: "misread_idea",
        event: "expression_friction",
        evidenceStatus: "opinion",
        bubble: "等下，我第一步是把书发给它，还是我读完一章再问它？它到底先帮我哪一步？",
        plainTake: "我没听懂第一步要做什么。是先导入一本书，还是读完一章后让它问我？现在听起来什么都能做，但入口不清楚。",
        friction: "功能名词太多，用户不知道第一步动作是什么。",
        mutation: "把入口收窄成读完一小段后的提问陪练。",
        branch: "第一版只做“读完一章，生成 3 个追问”。",
        target: { x: 45, y: 82 },
        signalDelta: { confusion: 16, heat: -2 }
      },
      {
        id: "execution",
        frictionId: "execution_dependency",
        title: "第 2 口：执行摩擦",
        lens: "工程执行者",
        agentId: "ajie",
        background: "独立开发者",
        tempRole: "执行拆解者",
        emotion: "skeptical",
        action: "sketch_clone",
        event: "execution_friction",
        evidenceStatus: "opinion",
        bubble: "总结和提问能做，难的是不同书的格式、版权、用户上传内容和长期记忆。",
        plainTake: "如果只是对一段文字提问，很快能做。可一旦你说“读一本书”，就会碰到格式、版权、笔记同步和长期记录。第一版别碰整本书库。",
        friction: "全书处理、版权边界、上传格式和长期记忆会拖大工程范围。",
        mutation: "先用用户粘贴的一段文字验证提问质量。",
        branch: "MVP 只接收一段文本，不做书库和导入。",
        target: { x: 29, y: 60 },
        signalDelta: { techPressure: 10, branchCount: 1 }
      },
      {
        id: "cost",
        frictionId: "cost_maintenance",
        title: "第 3 口：成本摩擦",
        lens: "成本敏感者",
        agentId: "budget",
        background: "成本敏感用户",
        tempRole: "预算审问者",
        emotion: "anxious",
        action: "calculate_cost",
        event: "cost_friction",
        evidenceStatus: "opinion",
        bubble: "长文本、每天陪读、复习提醒，这很容易变成一直烧 token 的东西。",
        plainTake: "如果每章都让 AI 长篇总结，成本会涨得很快。你应该先测用户愿不愿意为 3 个好问题留下来，而不是先做全自动陪读。",
        friction: "长文本总结和连续陪读会带来 token 成本和响应等待。",
        mutation: "把 AI 输出压缩成少量高价值问题。",
        branch: "每次只生成 3 个问题和 1 张卡，控制成本。",
        target: { x: 63, y: 78 },
        signalDelta: { techPressure: 9, heat: -1 }
      },
      {
        id: "trust",
        frictionId: "trust_permission_risk",
        title: "第 4 口：信任摩擦",
        lens: "谨慎用户",
        agentId: "xiaochen",
        background: "普通读者",
        tempRole: "谨慎用户",
        emotion: "anxious",
        action: "think",
        event: "trust_friction",
        evidenceStatus: "opinion",
        bubble: "我会把自己的笔记、书摘、想法都交给它吗？这一步我会犹豫。",
        plainTake: "我不只是怕它不好用。我还会想：我的笔记、书摘、读书习惯会不会被保存？它引用书的内容会不会有麻烦？第一版要把输入范围说清楚。",
        friction: "读书陪练会碰到用户笔记隐私、书摘版权边界和数据保存信任。",
        mutation: "第一版把输入限制成用户主动粘贴的一小段，并明确不做整本书导入。",
        branch: "更小分叉：本地/一次性文本提问陪练，先不碰账号、书库和长期保存。",
        target: { x: 45, y: 80 },
        signalDelta: { confusion: 6, techPressure: 5, replacementPressure: -4 }
      },
      {
        id: "cooling",
        frictionId: "retention_cooling",
        title: "第 5 口：冷却摩擦",
        lens: "冷却/离场者",
        agentId: "laozhou",
        background: "怀疑者",
        tempRole: "冷却者",
        emotion: "indifferent",
        action: "ignore_and_leave",
        event: "retention_friction",
        evidenceStatus: "opinion",
        bubble: "我可能第一天试一下，但我不读书这件事，不是因为没人总结。",
        plainTake: "真正的问题是我本来就不一定会继续读。你先别假设我需要一个完整系统，先证明它能让我第二天愿意回来。",
        friction: "用户不持续读书，不一定是工具缺失，而是动机和习惯问题。",
        mutation: "第一版指标改成第二天回访，而不是笔记数量。",
        branch: "验证“明天回来改一张卡”这件事。",
        target: { x: 75, y: 56 },
        signalDelta: { heat: -7, replacementPressure: 5, branchCount: 1 }
      }
    ]
  },

  "indie-dev-transition": {
    id: "indie-dev-transition",
    label: "从上班到独立开发",
    seed: "indie-transition-01",
    idea: {
      name: "从上班到独立开发",
      input: "我想从现在的工作慢慢转成独立开发者，靠自己做的小产品获得收入，最后不用上班。",
      pitch: "一个人想从上班状态过渡到独立开发，用小产品逐步获得收入。",
      scene: "现实摩擦预演"
    },
    clarityGate: {
      status: "needs_definition",
      label: "先说方向/类目，别瞎猜",
      summary: "这句话还停在愿望层，不是项目。IdeaRoast 不应该生成几个按钮让观察者做题，也不应该替观察者脑补落地点。最低限度先说清：你要做哪个方向、哪个类目、哪个物件。",
      missing: ["方向/类目/物件，例如工具、内容、插件、游戏/玩具、服务；如果是短视频，也要先说类目或形式"],
      inferenceRule: "输入停在愿望层或领域层时，只反问最低限度信息；一旦观察者说出方向/类目/物件，再主动推断目标用户、痛点、成本和验证路径。",
      nextQuestions: [
        "你到底要做哪类小产品？先给一个方向/类目/物件。"
      ]
    },
    path: {
      start: "从上班慢慢转成靠小产品收入生活的独立开发者。",
      minimumResult: "先补出一个方向/类目/物件；没有这个，不进入完整现实摩擦。",
      validation: "补出方向后，再看第一批人、可能痛点和先试哪一步。"
    },
    verdict: {
      status: "目标可以继续，但这个输入还不适合被强行完整分析。",
      biggestBlocker: "最大卡点不是写代码，也不是马上算收入，而是连方向/类目/物件都没说，后面所有分析都会空转。",
      strongestBranch: "最有生命力的分叉是“先把愿望压成一个明确方向”，再进入小社会摩擦。",
      smallestValidation: "先回答一句：我要做哪类小产品。补完这个，再推断用户、痛点、获客、成本和留存。",
      notNow: "暂时不要辞职、不要做完整 SaaS、不要先搭账号/支付/后台，也不要空算未来收入。"
    },
    signals: { ...FRICTION_SIGNALS, heat: 52, techPressure: 36, replacementPressure: 44 },
    agents: COMMON_AGENTS,
    selectedFrictionIds: ["expression_first_step", "acquisition_reach", "cost_maintenance", "scope_creep", "retention_cooling"],
    frictionBites: [
      {
        id: "expression",
        frictionId: "expression_first_step",
        title: "第 1 口：表达摩擦",
        lens: "听不懂的人",
        agentId: "pm",
        background: "产品人",
        tempRole: "听不懂的人",
        emotion: "confused",
        action: "misread_idea",
        event: "expression_friction",
        evidenceStatus: "opinion",
        bubble: "你要不要听听你在说什么？“做小产品”不是项目，先说哪一类。",
        plainTake: "先别谈独立开发。你现在连要做哪个方向的小产品都没说。工具、内容、插件、游戏/玩具、服务，先给一个类目；给出来以后，再推用户和痛点。",
        friction: "输入还停在愿望层；缺的不是目标用户和痛点，而是最低限度的方向/类目/物件。",
        mutation: "先从“我要独立开发”压成“我要做某一类小产品”。",
        branch: "缺口诊断分叉：反问方向/类目，不替观察者脑补落地点。",
        target: { x: 68, y: 69 },
        signalDelta: { confusion: 14, heat: -2 }
      },
      {
        id: "acquisition",
        frictionId: "acquisition_reach",
        title: "第 2 口：获客摩擦",
        lens: "找用户的人",
        agentId: "pm",
        background: "产品人",
        tempRole: "找用户的人",
        emotion: "skeptical",
        action: "take_note",
        event: "acquisition_friction",
        evidenceStatus: "opinion",
        bubble: "现在问获客没意义。你还没说做哪类东西，我不知道该替你找哪类人。",
        plainTake: "我不会让你先回答目标用户是谁，但你得先给方向。比如短视频也得先说类目：知识、娱乐、带货、记录生活，还是别的。方向都没有，获客就是瞎说。",
        friction: "没有方向/类目时，获客对象无法成立；不能凭空生成第一批用户。",
        mutation: "先把获客问题退回到“你做哪个方向/类目”。",
        branch: "补出类目后，再推断可能用户和触达入口。",
        target: { x: 68, y: 68 },
        signalDelta: { heat: -2, branchCount: 1, replacementPressure: 4 }
      },
      {
        id: "cost",
        frictionId: "cost_maintenance",
        title: "第 3 口：成本摩擦",
        lens: "成本敏感者",
        agentId: "budget",
        background: "成本敏感用户",
        tempRole: "预算审问者",
        emotion: "anxious",
        action: "calculate_cost",
        event: "cost_friction",
        evidenceStatus: "opinion",
        bubble: "现在别先算以后每月赚多少。先算这个小产品要花多少时间、钱和人力。",
        plainTake: "成本也得等方向出来。插件、短视频账号、小游戏、模板，成本结构完全不是一回事。你不用先会算，但你得先说类目；类目出来，再估时间、钱、人力和维护。",
        friction: "没有方向/类目时，成本无法落到开发费用、时间、人力、依赖和维护项上。",
        mutation: "把成本判断退回到“先给类目，再估成本”。",
        branch: "补出类目后，再生成成本粗估：时间、现金、外部依赖、维护频率。",
        target: { x: 63, y: 78 },
        signalDelta: { techPressure: 4, heat: -3 }
      },
      {
        id: "scope",
        frictionId: "scope_creep",
        title: "第 4 口：范围蔓延摩擦",
        lens: "砍范围的人",
        agentId: "ajie",
        background: "独立开发者",
        tempRole: "砍范围的人",
        emotion: "skeptical",
        action: "suggest_branch",
        event: "scope_friction",
        evidenceStatus: "opinion",
        bubble: "你一上来就想做产品，最后很容易变成账号、支付、后台、客服全都要。",
        plainTake: "别先做完整 SaaS。第一版要能手动交付：落地页、表单、你人工处理。能收钱再补系统，不然会被后台和支付拖住。",
        friction: "独立开发目标容易从验证收入漂移成搭完整平台。",
        mutation: "把第一版从完整产品砍成落地页 + 手动交付。",
        branch: "先卖一个手动服务版或预约版，别先搭完整账号/支付/后台。",
        target: { x: 29, y: 60 },
        signalDelta: { techPressure: 10, branchCount: 1, cloneRisk: -4 }
      },
      {
        id: "cooling",
        frictionId: "retention_cooling",
        title: "第 5 口：冷却摩擦",
        lens: "冷却/离场者",
        agentId: "laozhou",
        background: "怀疑者",
        tempRole: "冷却者",
        emotion: "indifferent",
        action: "ignore_and_leave",
        event: "retention_friction",
        evidenceStatus: "opinion",
        bubble: "热血的时候都想独立，真正难的是三周后还愿不愿意每天发消息找用户。",
        plainTake: "这件事会死在兴奋退掉之后。你要验证的不是你会不会写代码，而是你能不能连续四周找用户、被拒绝、还继续。",
        friction: "冷却期会暴露获客和坚持能力。",
        mutation: "指标从做完产品改成连续触达用户。",
        branch: "4 周内每周找 10 个目标用户，比写更多功能更重要。",
        target: { x: 76, y: 55 },
        signalDelta: { heat: -7, replacementPressure: 5, branchCount: 1 }
      }
    ]
  },

  "jarvis-desktop-ai": {
    id: "jarvis-desktop-ai",
    label: "类 Jarvis 电脑 AI",
    seed: "jarvis-desktop-01",
    idea: {
      name: "类 Jarvis 电脑 AI",
      input: "我想做一个跟贾维斯一样的 AI 产品，来控制电脑，让使用者可以通过语音完成对电脑的使用，并且这个 AI 产品还可以自我学习。当我问今天国内发生了什么大事，它可以通过搜索汇总，然后用文字和声音同步回答。",
      pitch: "一个能语音控制电脑、搜索新闻、汇总并用文字和声音回答的桌面 AI 助手。",
      scene: "现实摩擦预演"
    },
    clarityGate: {
      status: "ready",
      label: "可以进入预演",
      summary: "这个想法很大，但已经有项目对象、功能逻辑和使用流程。不需要继续问“具体想做什么”，可以直接进入现实摩擦。"
    },
    path: {
      start: "类 Jarvis 桌面 AI：语音控制电脑、自我学习、搜索并用文字和声音回答。",
      minimumResult: "先做一个只支持 3 个安全指令的桌面助手：打开应用、搜索问题、朗读摘要。",
      validation: "找 3 个真实电脑重度用户，看他们是否愿意连续 3 天用语音完成一个重复动作。"
    },
    verdict: {
      status: "方向够具体，但不能按“完整 Jarvis”开工。",
      biggestBlocker: "最大卡点是电脑控制权限和误操作风险，不是能不能接一个聊天模型。",
      strongestBranch: "最有生命力的分叉是“语音命令 + 安全白名单动作”的桌面助手。",
      smallestValidation: "先做 3 个动作：打开指定软件、搜索并总结一条新闻、朗读结果。用户愿意每天用，再扩动作范围。",
      notNow: "暂时不要做自我学习、全局控制电脑、自动执行高风险操作和完整新闻系统。"
    },
    signals: { ...FRICTION_SIGNALS, heat: 70, techPressure: 64, replacementPressure: 48 },
    agents: COMMON_AGENTS,
    selectedFrictionIds: ["execution_dependency", "trust_permission_risk", "cost_maintenance", "evidence_replacement", "scope_creep"],
    frictionBites: [
      {
        id: "execution",
        frictionId: "execution_dependency",
        title: "第 1 口：执行摩擦",
        lens: "工程执行者",
        agentId: "ajie",
        background: "工程执行者",
        tempRole: "工程执行者",
        emotion: "skeptical",
        action: "prototype",
        event: "execution_friction",
        evidenceStatus: "opinion",
        bubble: "这不是一个按钮，是语音、系统权限、搜索、总结、朗读一整串东西。",
        plainTake: "这个已经具体，可以跑。最先卡的是电脑权限和动作范围：先让它稳定完成一个安全指令，别一上来做完整 Jarvis。",
        friction: "功能链条太长，第一版必须把控制电脑缩到少数白名单动作。",
        mutation: "从全能桌面 AI 缩成可验证的语音命令工具。",
        branch: "先做 3 个安全动作：打开软件、搜索问题、朗读摘要。",
        target: { x: 42, y: 62 },
        signalDelta: { techPressure: 13, branchCount: 1 }
      },
      {
        id: "trust",
        frictionId: "trust_permission_risk",
        title: "第 2 口：权限摩擦",
        lens: "风险看门人",
        agentId: "searcher",
        background: "查证员",
        tempRole: "风险看门人",
        emotion: "skeptical",
        action: "check_competitor",
        event: "trust_friction",
        evidenceStatus: "opinion",
        bubble: "让 AI 控制电脑这件事，最怕它点错、删错、发错。",
        plainTake: "用户不会随便把电脑交给它。第一版要有白名单、确认按钮和可撤销记录，不然再聪明也不敢用。",
        friction: "系统控制类产品天然触发权限、隐私和误操作风险。",
        mutation: "把自动执行改成用户确认后执行。",
        branch: "默认只读和建议，真正执行前必须让用户确认。",
        target: { x: 66, y: 54 },
        signalDelta: { trust: -9, techPressure: 8 }
      },
      {
        id: "cost",
        frictionId: "cost_maintenance",
        title: "第 3 口：成本摩擦",
        lens: "成本敏感者",
        agentId: "budget",
        background: "成本敏感用户",
        tempRole: "成本敏感者",
        emotion: "anxious",
        action: "calculate_cost",
        event: "cost_friction",
        evidenceStatus: "opinion",
        bubble: "语音识别、搜索、总结、朗读都要钱，还要一直开着。",
        plainTake: "它如果常驻电脑，成本会跟着用户时长走。先别追全能，先测一个每天真的会被用的动作。",
        friction: "常驻助手会带来模型、搜索、语音和本地权限维护成本。",
        mutation: "从全时在线改成按命令唤起。",
        branch: "先做按键或唤醒词触发，完成一个任务就结束。",
        target: { x: 62, y: 76 },
        signalDelta: { techPressure: 7, heat: -4 }
      },
      {
        id: "replacement",
        frictionId: "evidence_replacement",
        title: "第 4 口：替代品摩擦",
        lens: "查证者",
        agentId: "searcher",
        background: "查证员",
        tempRole: "查证者",
        emotion: "skeptical",
        action: "check_competitor",
        event: "evidence_needed",
        evidenceStatus: "needs_check",
        bubble: "我不能直接说没人做过。这里要查系统助手、语音控制和浏览器 AI 已经做到哪一步。",
        plainTake: "这一步不能靠感觉。要查现有桌面助手、浏览器助手、系统语音控制，看看你真正不同的是哪一个动作。",
        friction: "桌面 AI 助手容易撞到系统级助手、浏览器 AI 和语音控制工具。",
        mutation: "把差异点从“像 Jarvis”改成“比现有工具更顺的一件事”。",
        branch: "查完替代品后，只保留一个现有工具做得最别扭的动作。",
        target: { x: 70, y: 42 },
        signalDelta: { replacementPressure: 12, branchCount: 1 }
      },
      {
        id: "scope",
        frictionId: "scope_creep",
        title: "第 5 口：范围蔓延摩擦",
        lens: "砍范围的人",
        agentId: "ajie",
        background: "独立开发者",
        tempRole: "砍范围的人",
        emotion: "skeptical",
        action: "suggest_branch",
        event: "scope_friction",
        evidenceStatus: "opinion",
        bubble: "“自我学习”这四个字一加，项目会立刻膨胀到没边。",
        plainTake: "先别做自我学习。第一版只记住用户允许它记住的 3 个偏好，比如常用浏览器、常搜主题、回答用文字还是语音。",
        friction: "自我学习会把第一版拖进隐私、记忆、偏好同步和长期维护。",
        mutation: "把自我学习缩成可关闭的偏好记忆。",
        branch: "只保存 3 个显式偏好，用户随时能看见和删除。",
        target: { x: 31, y: 60 },
        signalDelta: { techPressure: 10, trust: -4, branchCount: 1 }
      }
    ]
  },

  "employee-screen-monitor": {
    id: "employee-screen-monitor",
    label: "员工屏幕监控工具",
    seed: "boundary-monitor-01",
    idea: {
      name: "员工屏幕监控工具",
      input: "我想做一个帮老板监控员工电脑屏幕的工具。",
      pitch: "一个企业内部电脑屏幕监控工具。",
      scene: "边界判断"
    },
    clarityGate: {
      status: "boundary_review",
      label: "先停边界",
      summary: "这类想法涉及监控、授权、隐私和公司合规边界。IdeaRoast 不让观察者当场裁定，也不把它当普通创意继续推演。",
      reason: "它可能合法，也可能越界；具体取决于地区、劳动关系、告知授权、数据范围和公司制度，需要安全/边界智能体或外部合规判断。"
    },
    path: {
      start: "帮老板监控员工电脑屏幕。",
      minimumResult: "先不拆产品版本。",
      validation: "先过边界判断；通过前不进入现实摩擦推演。"
    },
    verdict: {
      status: "先停在边界层。",
      biggestBlocker: "这不是观察者能随口决定的产品问题，而是监控、授权、隐私和合规边界。"
    },
    signals: { ...FRICTION_SIGNALS, trust: 28, techPressure: 52 },
    agents: COMMON_AGENTS,
    selectedFrictionIds: [],
    frictionBites: []
  },

  "minor-ai-companion": {
    id: "minor-ai-companion",
    label: "中学生 AI 情感陪伴",
    seed: "blocked-minor-companion-01",
    idea: {
      name: "中学生 AI 情感陪伴",
      input: "我想做一个 AI 情感陪伴服务，专门给中学生用。",
      pitch: "面向中学生的 AI 情感陪伴服务。",
      scene: "安全红线"
    },
    clarityGate: {
      status: "blocked",
      label: "直接拒绝",
      summary: "这个方向涉及未成年人情感服务高风险，不能继续。",
      refusal: "拒绝：这个方向涉及未成年人情感服务高风险，不能继续。",
      reason: "安全红线先于清晰度判断。这里不会继续分析。"
    },
    path: {
      start: "面向中学生的 AI 情感陪伴服务。",
      minimumResult: "不进入产品拆解。",
      validation: "不进入验证路径。"
    },
    verdict: {
      status: "拒绝继续。",
      biggestBlocker: "它触发未成年人高风险边界，不能进入现实摩擦推演。"
    },
    signals: { ...FRICTION_SIGNALS, trust: 18, heat: 24 },
    agents: COMMON_AGENTS,
    selectedFrictionIds: [],
    frictionBites: []
  }
};

Object.values(window.FRICTION_CASES).forEach(hydrateSubstitutePreviewCase);

const ENTRY_DEMO_IDEAS = [
  {
    id: "excel-short-video-account",
    label: "我想做一个教 Excel 的短视频账号",
    input: "我想做一个教 Excel 的短视频账号"
  },
  {
    id: "ai-reading-coach-demo",
    label: "我想做一个 AI 读书陪练",
    input: "我想做一个 AI 读书陪练"
  },
  {
    id: "voice-open-software-tool",
    label: "我想做一个语音控制电脑打开软件的小工具",
    input: "我想做一个语音控制电脑打开软件的小工具"
  },
  {
    id: "indie-mvp-splitter",
    label: "我想做一个帮独立开发者拆 MVP 的工具",
    input: "我想做一个帮独立开发者拆 MVP 的工具"
  },
  {
    id: "readme-to-tutorial",
    label: "我想做一个开源项目，帮人把 README 自动整理成使用教程",
    input: "我想做一个开源项目，帮人把 README 自动整理成使用教程"
  }
];

function createEntryDemoCase(demo) {
  const packet = buildLocalFrictionPacketV0(demo.input);
  packet.id = demo.id;
  packet.label = demo.label;
  packet.seed = `${demo.id}-01`;
  if (packet.idea) {
    packet.idea.input = demo.input;
    packet.idea.pitch = demo.input;
  }
  return hydrateSubstitutePreviewCase(packet);
}

window.FRICTION_CASES = Object.fromEntries(
  ENTRY_DEMO_IDEAS.map((demo) => [demo.id, createEntryDemoCase(demo)])
);

window.SAMPLE_SIMULATION = window.FRICTION_CASES[ENTRY_DEMO_IDEAS[0].id];
