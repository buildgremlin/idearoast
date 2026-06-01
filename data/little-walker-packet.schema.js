const LITTLE_WALKER_PACKET_SCHEMA = {
  version: "0.1.4",
  doorwayStatuses: [
    "can_run",
    "ask_one_question",
    "scope_too_large",
    "reality_broken",
    "boundary_stop"
  ],
  stopDoorwayStatuses: [
    "ask_one_question",
    "scope_too_large",
    "reality_broken",
    "boundary_stop"
  ],
  stepDecisions: [
    "continue",
    "mutate",
    "branch",
    "stop"
  ],
  burdenKeys: [
    "time",
    "money",
    "mental",
    "trust",
    "skill",
    "human"
  ],
  requiredTopLevelFields: [
    "originalInput",
    "doorway",
    "walk",
    "result"
  ],
  requiredDoorwayFields: [
    "status",
    "speakerLine",
    "reason"
  ],
  requiredStepFields: [
    "stepNumber",
    "sceneLine",
    "currentSurvivingRoute",
    "tinyAction",
    "realityHit",
    "burden",
    "routeChange",
    "decision",
    "nextCarry"
  ],
  requiredRouteChangeFields: [
    "from",
    "to",
    "why"
  ],
  requiredResultFields: [
    "survivor",
    "whySurvived",
    "nextTinyAction",
    "droppedHeavyRoute",
    "sideBranch",
    "routeTrace"
  ],
  reportTonePatterns: [
    "综合分析",
    "建议你",
    "可行性较强",
    "可行性较高",
    "风险较高",
    "根据以上分析",
    "你需要进一步明确",
    "市场前景",
    "商业模式完整分析"
  ],
  doorwayToneProtocol: {
    can_run: "接住用户，轻松但明确。",
    ask_one_question: "温和，不嘲讽。",
    scope_too_large: "可以吐槽，但不要羞辱用户。",
    reality_broken: "可以更毒舌一点，但要解释为什么脚下没路。",
    boundary_stop: "严肃、清楚，不开玩笑。"
  },
  doorwayHarshJokePatterns: [
    "你想屁吃",
    "做梦呢",
    "科幻片开机"
  ],
  doorwayBoundaryJokePatterns: [
    "你想屁吃",
    "做梦呢",
    "科幻片开机",
    "压扁",
    "吐槽"
  ],
  sceneCausalBridgePatterns: [
    "因为",
    "所以",
    "于是",
    "发现",
    "撞到",
    "只先",
    "改成",
    "缩成",
    "留下"
  ],
  sceneAssumptionPatterns: [
    "以为",
    "原本以为",
    "本来以为",
    "默认以为",
    "想着只要",
    "觉得只要"
  ],
  sceneActionPatterns: [
    "试了",
    "试一下",
    "拿",
    "录了",
    "录",
    "拍了",
    "拍",
    "输入",
    "粘贴",
    "做了",
    "发布",
    "发",
    "发给",
    "写了",
    "生成",
    "手动",
    "讲",
    "剪",
    "打开",
    "尝试",
    "试",
    "跑",
    "丢给",
    "放到",
    "点",
    "给",
    "摊开",
    "铺开"
  ],
  sceneBreakPatterns: [
    "结果",
    "现实",
    "发现",
    "觉得",
    "说",
    "反馈",
    "回复",
    "评论",
    "问",
    "第一反应",
    "看完",
    "划走",
    "不知道",
    "凭什么",
    "自己重看",
    "还是不会",
    "废话",
    "不成立",
    "没钩子",
    "没有钩子",
    "不会等",
    "不会复制",
    "不信",
    "太通用",
    "懵"
  ],
  sceneTransformPatterns: [
    "于是",
    "改成",
    "缩成",
    "不再",
    "换成",
    "变成",
    "只输出",
    "只拍",
    "只支持",
    "先做",
    "留下",
    "放下"
  ],
  abstractBreakPatterns: [
    "太泛",
    "太重",
    "不稳定",
    "用户不信",
    "成本高",
    "需求不明确",
    "痛点不强",
    "反馈不清楚"
  ],
  concreteBreakPatterns: [
    "看完",
    "划走",
    "不知道",
    "凭什么",
    "自己重看",
    "不会复制",
    "不信",
    "正确废话",
    "打开哪个工具",
    "前 3 秒",
    "前3秒",
    "没钩子",
    "没有钩子",
    "标题",
    "封面",
    "评论",
    "播放",
    "完播",
    "留存",
    "录屏",
    "剪辑",
    "字幕",
    "复制到哪里",
    "用在哪",
    "手动能用",
    "数据来源",
    "解释成本"
  ],
  contentFrictionPatterns: [
    "选题",
    "标题",
    "开头",
    "3 秒",
    "3秒",
    "观众",
    "留存",
    "完播",
    "录屏",
    "剪辑",
    "字幕",
    "封面",
    "评论",
    "播放",
    "划走",
    "钩子",
    "痛点"
  ],
  toolUseFrictionPatterns: [
    "看不懂",
    "不知道下一步",
    "不会复制",
    "不知道用在哪",
    "不知道",
    "凭什么",
    "不信",
    "输出太泛",
    "正确废话",
    "仍然不知道今晚做什么",
    "不知道今晚",
    "打开哪个工具",
    "手动能用",
    "自动化太早",
    "复制到哪里",
    "固定输入",
    "固定输出",
    "假按钮",
    "假页面",
    "延迟",
    "误识别",
    "双击",
    "更慢",
    "网络",
    "噪音",
    "数据来源",
    "解释成本",
    "指标",
    "具体指标",
    "留下邮箱",
    "领域不同",
    "参考价值",
    "上传",
    "泄露",
    "普通总结工具",
    "花了",
    "反复跳转",
    "新手仍然看不懂",
    "命令",
    "配置项",
    "代码块"
  ],
  earlyHeavyBuildPatterns: [
    "写函数",
    "写 API",
    "写API",
    "搭数据库",
    "完整后端",
    "用户登录",
    "权限系统",
    "复杂脚本"
  ],
  earlyHeavyBuildAllowPatterns: [
    "先不",
    "不用",
    "不写",
    "不搭",
    "不接",
    "不做完整",
    "只写死",
    "写死",
    "固定输入",
    "固定输出",
    "本地假",
    "假 demo",
    "假demo",
    "假按钮",
    "假页面",
    "手动",
    "ChatGPT",
    "Codex"
  ],
  markdownPatterns: [
    "```",
    "^#{1,6}\\s+",
    "^\\s*[-*]\\s+"
  ],
  genericResultPatterns: [
    "做一个简单\\s*MVP",
    "做一个\\s*MVP",
    "做一个最小版本",
    "验证核心需求",
    "做一个小工具",
    "先做\\s*MVP\\s*找用户验证",
    "找\\s*几个目标用户聊聊",
    "找\\s*\\d+\\s*个目标用户聊聊"
  ],
  unsafePlatformAutomationPatterns: [
    "(小红书|抖音|B\\s*站|哔哩哔哩|知乎).{0,4}(爬虫|爬取|抓取|采集)",
    "(爬虫|爬取|抓取|采集).{0,4}(小红书|抖音|B\\s*站|哔哩哔哩|知乎)",
    "自动抓取平台数据",
    "自动采集平台数据",
    "绕过平台限制",
    "绕过.*限制",
    "未授权采集用户内容",
    "未授权.*采集",
    "批量抓取公开内容"
  ],
  platformAutomationAllowPatterns: [
    "用户自己提供",
    "用户提供",
    "用户自有数据",
    "自有数据",
    "官方 API",
    "官方API",
    "公开合规 API",
    "公开合规API",
    "合规 API",
    "合规API",
    "手动观察",
    "手动记录",
    "不做自动抓取",
    "不爬取",
    "不写爬虫"
  ],
  entryDemoInputs: [
    "我想做一个教 Excel 的短视频账号",
    "我想做一个 AI 读书陪练",
    "我想做一个语音控制电脑打开软件的小工具",
    "我想做一个帮独立开发者拆 MVP 的工具",
    "我想做一个开源项目，帮人把 README 自动整理成使用教程"
  ],
  anchorRules: [
    {
      when: ["Excel", "短视频"],
      resultMustInclude: ["Excel", "视频"]
    },
    {
      when: ["AI", "读书", "陪练"],
      resultMustInclude: ["书", "问"]
    },
    {
      when: ["语音", "控制电脑", "打开软件"],
      resultMustInclude: ["语音", "软件"]
    },
    {
      when: ["独立开发者", "MVP"],
      resultMustInclude: ["独立开发者", "第一版"]
    },
    {
      when: ["开源项目", "README", "使用教程"],
      resultMustInclude: ["README", "教程"]
    }
  ]
};

if (typeof window !== "undefined") {
  window.LITTLE_WALKER_PACKET_SCHEMA = LITTLE_WALKER_PACKET_SCHEMA;
}

if (typeof module !== "undefined") {
  module.exports = { LITTLE_WALKER_PACKET_SCHEMA };
}
