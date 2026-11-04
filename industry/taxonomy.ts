// 汽车行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（评测、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * tagColor 是飞书推送卡片里跟在标题后面的这一类小标签的颜色（飞书 text_tag 的颜色名）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "new-car", tagColor: "indigo", label: "新车", feedLabel: "新车发布", section: "新车发布", guide: "新车型、换代与改款、上市时间、定价与配置、预售与交付节奏。单纯的车主提车作业和经销商促销归评测/观点。" },
  { key: "policy", tagColor: "orange", label: "政策", feedLabel: "政策法规", section: "政策与法规", guide: "国家与地方的产业政策、补贴与购置税、双积分、排放与安全法规、自动驾驶准入与路测规则、进出口关税。企业自己发布的合规声明不算政策。" },
  { key: "market", tagColor: "turquoise", label: "市场", feedLabel: "市场销量", section: "市场与销量", guide: "销量与交付数据、市场份额、价格战与终端优惠、库存与渠道、出口与海外市场表现、二手车与租赁。单个车型的交付数字属于新车，不重复归到这里。" },
  { key: "tech", tagColor: "violet", label: "技术", feedLabel: "技术与智驾", section: "技术与智驾", guide: "三电与动力总成、平台架构、智能驾驶方案与算法、智能座舱、芯片与域控、OTA 更新、补能与换电技术。技术发布会里以车型为主体的仍归新车。" },
  { key: "supply", tagColor: "green", label: "供应链", feedLabel: "供应链", section: "供应链与产能", guide: "动力电池与材料、零部件与 Tier1、芯片与传感器、产能与工厂、采购与定点、涨价与短缺。整车厂的合资建厂归企业与资本。" },
  { key: "company", tagColor: "red", label: "企业", feedLabel: "企业与资本", section: "企业与资本", guide: "车企与供应商的经营动作：财报与业绩预告、融资与 IPO、并购与合资、人事变动、组织调整、出海建厂、诉讼与监管处罚。产品和技术本身归各自类别。" },
  { key: "recall", tagColor: "volcano", label: "召回", feedLabel: "召回与安全", section: "召回与安全", guide: "官方召回、缺陷调查、事故与起火调查、辅助驾驶事故的责任认定、安全测试与碰撞成绩。常规的碰撞测试宣传归评测/观点。" },
  { key: "review", tagColor: "purple", label: "评测", section: "评测与观点", guide: "试驾与评测、行业分析与预测、从业者访谈、车主长测、购车建议。重点在作者的评价与判断；单纯转述厂商参数归新车。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; tagColor: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（汽车行业是新车型）：日报报头的“N 款新车”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = { category: "new-car", tag: "新车发布", unit: "款新车" };

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["suv", "mpv", "ev", "phev", "ota", "adas", "l2", "l3", "4s", "ceo", "ipo", "robotaxi"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["new_model", "policy_change", "market_data", "tech_update", "supply_chain", "company_event", "recall_safety", "review_opinion"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "新车发布", "政策法规", "市场销量", "技术/智驾", "供应链", "企业动态", "召回/安全", "评测/观点", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "纯电", "插混", "增程", "智能驾驶", "智能座舱", "动力电池", "充电补能", "出海", "价格战", "芯片", "固态电池", "换电", "商用车", "二手车", "自动驾驶", "Robotaxi",
] as const;

/** 可选的实体标签（公司、机构、品牌）。 */
export const ENTITY_TAGS = ["比亚迪", "特斯拉", "吉利", "奇瑞", "长安", "上汽", "广汽", "蔚来", "小鹏", "理想", "小米汽车", "华为", "宁德时代", "大众", "丰田", "宝马", "奔驰", "Stellantis"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  "新车上市": "新车发布", "车型发布": "新车发布", "上市": "新车发布", "改款": "新车发布", "预售": "新车发布",
  政策: "政策法规", 监管: "政策法规", 法规: "政策法规", 补贴: "政策法规", 双积分: "政策法规", 购置税: "政策法规",
  销量: "市场销量", 交付: "市场销量", 市场份额: "市场销量", 价格战: "市场销量", 出口: "市场销量",
  技术: "技术/智驾", 智驾: "技术/智驾", 智能驾驶: "技术/智驾", 自动驾驶: "技术/智驾", 智能座舱: "技术/智驾", 电池: "技术/智驾", 三电: "技术/智驾", ota: "技术/智驾",
  供应链: "供应链", 零部件: "供应链", 芯片: "供应链", 产能: "供应链", 工厂: "供应链",
  企业: "企业动态", 财报: "企业动态", 融资: "企业动态", 并购: "企业动态", 人事: "企业动态", 合作: "企业动态",
  召回: "召回/安全", 安全: "召回/安全", 事故: "召回/安全", 碰撞: "召回/安全",
  评测: "评测/观点", 试驾: "评测/观点", 观点: "评测/观点", 分析: "评测/观点", 访谈: "评测/观点",
  "model launch": "新车发布", "market share": "市场销量", subsidy: "政策法规", recall: "召回/安全",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；orgNames 是这家公司发消息时开头用的组织名（公司、实验室、团队），
 * 在它自己的主题页上读者知道说的是谁，可以省去；otherNames 是公司的其他称呼（官方账号名、子品牌）。
 * 所有这些名字都用来认出说的是哪家公司，比如把事实的主体对到发布方。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; orgNames?: string[]; otherNames?: string[] }> = {
  byd: { name: "比亚迪", displayTag: "比亚迪", aliases: ["BYD", "比亚迪", "仰望", "方程豹", "腾势"], orgNames: ["比亚迪", "BYD"], otherNames: ["比亚迪汽车", "BYD Auto"] },
  tesla: { name: "特斯拉", displayTag: "特斯拉", aliases: ["Tesla", "特斯拉", "Model 3", "Model Y", "Cybertruck"], orgNames: ["Tesla", "特斯拉"], otherNames: ["Tesla China", "特斯拉中国"] },
  geely: { name: "吉利", displayTag: "吉利", aliases: ["Geely", "吉利", "领克", "极氪", "银河"], orgNames: ["吉利控股集团", "吉利汽车", "Geely", "浙江吉利"], otherNames: ["LYNK & CO", "ZEEKR"] },
  chery: { name: "奇瑞", displayTag: null, aliases: ["Chery", "奇瑞", "星途", "捷途", "iCAR"], orgNames: ["奇瑞控股", "奇瑞汽车", "Chery"] },
  changan: { name: "长安", displayTag: null, aliases: ["Changan", "长安", "深蓝", "阿维塔", "启源"], orgNames: ["长安汽车", "Changan"] },
  saic: { name: "上汽", displayTag: null, aliases: ["SAIC", "上汽", "荣威", "名爵", "MG", "智己"], orgNames: ["上汽集团", "SAIC Motor", "上汽"] },
  gac: { name: "广汽", displayTag: null, aliases: ["GAC", "广汽", "埃安", "传祺", "AION"], orgNames: ["广汽集团", "GAC"] },
  nio: { name: "蔚来", displayTag: "蔚来", aliases: ["NIO", "蔚来", "乐道", "萤火虫"], orgNames: ["蔚来", "NIO"], otherNames: ["ONVO", "Firefly"] },
  xpeng: { name: "小鹏", displayTag: "小鹏", aliases: ["XPeng", "小鹏", "MONA"], orgNames: ["小鹏汽车", "XPeng"] },
  li: { name: "理想", displayTag: "理想", aliases: ["Li Auto", "理想汽车", "理想", "L系列"], orgNames: ["理想汽车", "Li Auto"] },
  xiaomi: { name: "小米汽车", displayTag: "小米汽车", aliases: ["Xiaomi", "小米", "SU7", "YU7"], orgNames: ["小米汽车", "小米集团", "Xiaomi"] },
  huawei: { name: "华为", displayTag: "华为", aliases: ["Huawei", "华为", "鸿蒙智行", "问界", "智界", "享界", "尊界"], orgNames: ["华为", "华为终端", "Huawei"], otherNames: ["AITO", "HarmonyOS"] },
  leapmotor: { name: "零跑", displayTag: null, aliases: ["Leapmotor", "零跑"], orgNames: ["零跑汽车", "Leapmotor"] },
  catl: { name: "宁德时代", displayTag: "宁德时代", aliases: ["CATL", "宁德时代"], orgNames: ["宁德时代", "CATL"] },
  vw: { name: "大众", displayTag: "大众", aliases: ["Volkswagen", "VW", "大众", "奥迪", "Audi", "保时捷", "Porsche"], orgNames: ["Volkswagen", "Volkswagen Group", "大众汽车", "大众集团"] },
  toyota: { name: "丰田", displayTag: "丰田", aliases: ["Toyota", "丰田", "雷克萨斯", "Lexus"], orgNames: ["Toyota", "Toyota Motor", "丰田汽车"] },
  gm: { name: "通用", displayTag: null, aliases: ["GM", "General Motors", "通用汽车", "别克", "凯迪拉克", "雪佛兰"], orgNames: ["General Motors", "GM", "通用汽车"] },
  ford: { name: "福特", displayTag: null, aliases: ["Ford", "福特", "林肯"], orgNames: ["Ford", "Ford Motor"] },
  stellantis: { name: "Stellantis", displayTag: null, aliases: ["Stellantis", "标致", "雪铁龙", "菲亚特", "Jeep"], orgNames: ["Stellantis"] },
  bmw: { name: "宝马", displayTag: "宝马", aliases: ["BMW", "宝马", "MINI"], orgNames: ["BMW", "BMW Group", "宝马集团"] },
  mercedes: { name: "奔驰", displayTag: null, aliases: ["Mercedes-Benz", "Mercedes", "奔驰"], orgNames: ["Mercedes-Benz", "Mercedes-Benz Group", "梅赛德斯-奔驰"] },
  hyundai: { name: "现代", displayTag: null, aliases: ["Hyundai", "现代", "起亚", "Kia"], orgNames: ["Hyundai", "Hyundai Motor", "Kia"] },
  nissan: { name: "日产", displayTag: null, aliases: ["Nissan", "日产", "英菲尼迪"], orgNames: ["Nissan", "Nissan Motor"] },
  honda: { name: "本田", displayTag: null, aliases: ["Honda", "本田", "讴歌"], orgNames: ["Honda", "Honda Motor"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 汽车行业品牌和母公司经常混称，这里保留主要集团的写法。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "byd", name: "比亚迪", patterns: [/\bBYD\b/i, /比亚迪|仰望|方程豹|腾势/] },
  { id: "tesla", name: "特斯拉", patterns: [/tesla|特斯拉/i, /model\s?[3sy]\b|cybertruck/i] },
  { id: "geely", name: "吉利", patterns: [/geely|吉利|领克|极氪|zeekr|lynk/i] },
  { id: "chery", name: "奇瑞", patterns: [/chery|奇瑞|星途|捷途|icar/i] },
  { id: "changan", name: "长安", patterns: [/changan|长安|深蓝|阿维塔|avatr/i] },
  { id: "saic", name: "上汽", patterns: [/saic|上汽|荣威|名爵|\bMG\b|智己|im\s?motors/i] },
  { id: "gac", name: "广汽", patterns: [/\bGAC\b|广汽|埃安|\bAION\b|传祺/i] },
  { id: "nio", name: "蔚来", patterns: [/\bNIO\b|蔚来|乐道|onvo/i] },
  { id: "xpeng", name: "小鹏", patterns: [/xpeng|小鹏|\bMONA\b/i] },
  { id: "li", name: "理想", patterns: [/li\s?auto|理想汽车|理想\b/i] },
  { id: "xiaomi", name: "小米汽车", patterns: [/xiaomi|小米|\bSU7\b|\bYU7\b/i] },
  { id: "huawei", name: "华为", patterns: [/huawei|华为|鸿蒙智行|问界|\bAITO\b|智界|享界|尊界/i] },
  { id: "leapmotor", name: "零跑", patterns: [/leapmotor|零跑/i] },
  { id: "catl", name: "宁德时代", patterns: [/\bCATL\b|宁德时代/i] },
  { id: "vw", name: "大众", patterns: [/volkswagen|\bVW\b|大众汽车|大众集团|audi|奥迪|porsche|保时捷/i] },
  { id: "toyota", name: "丰田", patterns: [/toyota|丰田|lexus|雷克萨斯/i] },
  { id: "gm", name: "通用", patterns: [/general\s?motors|\bGM\b|通用汽车|别克|buick|cadillac|凯迪拉克|chevrolet|雪佛兰/i] },
  { id: "ford", name: "福特", patterns: [/\bFord\b|福特|lincoln|林肯/i] },
  { id: "stellantis", name: "Stellantis", patterns: [/stellantis|标致|peugeot|雪铁龙|citroen|菲亚特|fiat|\bJeep\b/i] },
  { id: "bmw", name: "宝马", patterns: [/\bBMW\b|宝马|\bMINI\b/i] },
  { id: "mercedes", name: "奔驰", patterns: [/mercedes|奔驰/i] },
  { id: "hyundai", name: "现代", patterns: [/hyundai|现代汽车|\bKia\b|起亚/i] },
  { id: "nissan", name: "日产", patterns: [/nissan|日产|英菲尼迪|infiniti/i] },
  { id: "honda", name: "本田", patterns: [/honda|本田|讴歌|acura/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "byd", domains: ["byd.com", "bydglobal.com"] },
  { entityId: "tesla", domains: ["tesla.com", "tesla.cn"] },
  { entityId: "geely", domains: ["geely.com", "zgh.com", "zeekrlife.com"] },
  { entityId: "nio", domains: ["nio.com", "nio.cn"] },
  { entityId: "xpeng", domains: ["xiaopeng.com", "heyxpeng.com"] },
  { entityId: "li", domains: ["lixiang.com"] },
  { entityId: "xiaomi", domains: ["xiaomiev.com", "mi.com"] },
  { entityId: "catl", domains: ["catl.com"] },
  { entityId: "vw", domains: ["volkswagen-newsroom.com", "vw.com"] },
  { entityId: "toyota", domains: ["pressroom.toyota.com", "toyota.com"] },
  { entityId: "bmw", domains: ["press.bmwgroup.com", "bmw.com"] },
  { entityId: "mercedes", domains: ["group.mercedes-benz.com", "mercedes-benz.com"] },
  { entityId: "gm", domains: ["media.gm.com", "gm.com"] },
  { entityId: "ford", domains: ["media.ford.com", "ford.com"] },
  { entityId: "hyundai", domains: ["hyundai.com", "hyundainews.com"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "huawei", pattern: /@HarmonyOS\b/i },
  { entityId: "xiaomi", pattern: /@Xiaomi(?:EV|Auto)?\b/i },
];
