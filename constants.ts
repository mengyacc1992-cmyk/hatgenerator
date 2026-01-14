import { PrimaryPoint, HatType } from './types';

export const FACE_TYPES = [
  "圆脸 (Round)", "方脸 (Square)", "长脸 (Long)", 
  "菱形脸 (Diamond)", "鹅蛋脸 (Oval)", "倒三角脸 (Heart)"
];

export const SCENARIOS = [
  "冬季保暖 (Winter)", "夏季遮阳 (Summer)", "都市通勤 (Commute)", 
  "户外探索 (Outdoor)", "正式场合 (Formal)", "艺术/摄影 (Artistic)"
];

export const KNOWLEDGE_BASE: PrimaryPoint[] = [
  {
    id: 'p1', name: '颅顶高度建模',
    points: [
      { id: 's1-1', name: '视觉重心上移', description: '提升面部视觉中心' },
      { id: 's1-2', name: '高颅顶伪造', description: '撑起颞部上方空间' },
      { id: 's1-3', name: '头皮面部比例', description: '缩小中庭视觉占比' }
    ]
  },
  {
    id: 'p2', name: '颞部几何填充',
    points: [
      { id: 's2-1', name: '太阳穴凹陷补偿', description: '帽檐阴影遮盖凹陷' },
      { id: 's2-2', name: '菱形脸宽度平衡', description: '平衡颧骨最宽点' },
      { id: 's2-3', name: '倒三角脸支撑', description: '增加额头两侧份量' }
    ]
  },
  {
    id: 'p3', name: '头肩比重塑造',
    points: [
      { id: 's3-1', name: '窄肩视错觉扩张', description: '利用大帽檐反向衬托肩宽' },
      { id: 's3-2', name: '溜肩线条截断', description: '通过水平线截断流动' },
      { id: 's3-3', name: '大头视觉收缩', description: '利用深色材质缩小视觉占位' }
    ]
  },
  {
    id: 'p4', name: '下颌线提升逻辑',
    points: [
      { id: 's4-1', name: '对角线切割法', description: '引导视线斜向上提升下颌' },
      { id: 's4-2', name: '方脸柔化边界', description: '中和硬朗的下颌转角' },
      { id: 's4-3', name: '面部阴影重塑', description: '利用光影掩盖下半脸冗余' }
    ]
  }
];

export const CLASSIC_HATS: HatType[] = [
  {
    id: 'h1', name: '硬顶棒球帽', enName: 'Structured Cap',
    structure: '高挺冠部，大弧度硬檐',
    logic: '通过强有力的硬质廓形强制拉高颅顶。',
    suitableFor: ['圆脸', '阔面脸'],
    avoidFor: ['极瘦削小脸'],
    aestheticTags: ['利落', '高颅顶', '骨性增强']
  },
  {
    id: 'h2', name: '软顶棒球帽', enName: 'Dad Hat',
    structure: '低平软冠，微弯檐口',
    logic: '贴合头骨自然弧度，利用檐口宽度对冲颧骨。',
    suitableFor: ['菱形脸', '鹅蛋脸'],
    avoidFor: ['颅顶极平者'],
    aestheticTags: ['随性', '颧骨修饰', '日常平衡']
  },
  {
    id: 'h3', name: '直筒渔夫帽', enName: 'Standard Bucket',
    structure: '窄檐，中等深度',
    logic: '形成垂直视觉引导，截断长脸纵向扩张。',
    suitableFor: ['长脸', '高额头'],
    avoidFor: ['短圆脸'],
    aestheticTags: ['少年感', '纵向截断', '氛围覆盖']
  },
  {
    id: 'h4', name: '大檐渔夫帽', enName: 'Wide Bucket',
    structure: '宽大下垂檐口',
    logic: '利用负空间对比，使下颌线在阴影中视觉紧致。',
    suitableFor: ['方脸', '大脸'],
    avoidFor: ['窄肩小头'],
    aestheticTags: ['显脸小', '光影重塑', '安全感']
  },
  {
    id: 'h5', name: '针织冷帽', enName: 'Beanie',
    structure: '高弹力包裹，顶部堆叠',
    logic: '创造头包脸的容积感，调节重心高度。',
    suitableFor: ['各种脸型'],
    avoidFor: ['无'],
    aestheticTags: ['颅顶补偿', '材质对冲', '街头美学']
  },
  {
    id: 'h6', name: '贝雷帽', enName: 'Beret',
    structure: '软圆冠，无边缘',
    logic: '利用对角线斜戴斜率，打破面部对称性。',
    suitableFor: ['方脸', '长脸'],
    avoidFor: ['大圆脸'],
    aestheticTags: ['优雅', '对角线切割', '柔化线条']
  },
  {
    id: 'h7', name: '平顶草帽', enName: 'Boater',
    structure: '扁平圆冠，硬挺平檐',
    logic: '强烈的水平直线条，有效对冲窄长脸的拉伸。',
    suitableFor: ['长脸', '窄脸'],
    avoidFor: ['方下颌'],
    aestheticTags: ['清爽', '水平对冲', '结构严谨']
  },
  {
    id: 'h8', name: '报童帽', enName: 'Newsboy',
    structure: '蓬松八片式，短硬檐',
    logic: '横向扩张冠部，填充颞部凹陷空间。',
    suitableFor: ['太阳穴凹陷', '窄长脸'],
    avoidFor: ['圆脸'],
    aestheticTags: ['复古', '横向填充', '骨相补完']
  },
  {
    id: 'h9', name: '鸭舌帽', enName: 'Flat Cap',
    structure: '流线型帽身，前冲檐口',
    logic: '前冲式檐口延伸额头线条，适合面部折叠度低者。',
    suitableFor: ['鹅蛋脸', '方脸'],
    avoidFor: ['阔面脸'],
    aestheticTags: ['绅士', '线条延伸', '利落']
  },
  {
    id: 'h10', name: '空顶帽', enName: 'Visor',
    structure: '仅有檐部与圈梁，顶部开口',
    logic: '释放头顶压力，利用檐口宽度建立视觉焦点。',
    suitableFor: ['心形脸', '高发量'],
    avoidFor: ['秃顶/发量稀疏'],
    aestheticTags: ['运动', '透气', '动感']
  },
  {
    id: 'h11', name: '飞行员帽', enName: 'Trapper',
    structure: '宽大耳罩，毛绒内里',
    logic: '宽大侧翼强制收紧下颌线阴影，极大收缩面部。',
    suitableFor: ['圆脸', '小脸'],
    avoidFor: ['超大头围'],
    aestheticTags: ['机能', '下颌收缩', '保暖']
  },
  {
    id: 'h12', name: '绅士礼帽', enName: 'Fedora',
    structure: '软毡材质，中宽边缘',
    logic: '增加纵向延伸感，适合建立专业秩序。',
    suitableFor: ['圆脸', '短脸'],
    avoidFor: ['长脸'],
    aestheticTags: ['比例校准', '都市感', '纵向延伸']
  },
  {
    id: 'h13', name: '钟形帽', enName: 'Cloche',
    structure: '深扣圆冠，极窄下垂檐',
    logic: '深度包裹修饰发际线，建立复古精致感。',
    suitableFor: ['鹅蛋脸', '高额头'],
    avoidFor: ['宽脸'],
    aestheticTags: ['法式', '包裹感', '精致']
  },
  {
    id: 'h14', name: '宽檐呢帽', enName: 'Floppy Hat',
    structure: '柔软阔檐，波浪起伏',
    logic: '利用波浪线条消解面部骨性转角的生硬。',
    suitableFor: ['方脸', '菱形脸'],
    avoidFor: ['个子娇小者'],
    aestheticTags: ['浪漫', '柔化骨相', '氛围感']
  },
  {
    id: 'h15', name: '西部牛仔帽', enName: 'Cowboy Hat',
    structure: '高冠、深凹、宽上翻檐',
    logic: '利用巨大的檐口落差创造戏剧性阴影，掩盖面部肉感。',
    suitableFor: ['圆脸', '大脸'],
    avoidFor: ['窄长脸'],
    aestheticTags: ['硬朗', '廓形对比', '粗犷']
  },
  {
    id: 'h16', name: '猪婆帽', enName: 'Pork Pie',
    structure: '低平圆冠，极窄上翘檐',
    logic: '紧凑的圆形结构适合作为面部重心的视觉收束点。',
    suitableFor: ['长脸', '菱形脸'],
    avoidFor: ['圆大脸'],
    aestheticTags: ['雅痞', '重心收束', '利落']
  },
  {
    id: 'h17', name: '平顶军帽', enName: 'Cadet Cap',
    structure: '平顶圆冠，短檐',
    logic: '工业化的平整顶部增加头型方正度，修饰过尖的颅顶。',
    suitableFor: ['尖头型', '鹅蛋脸'],
    avoidFor: ['方脸'],
    aestheticTags: ['干练', '颅顶修正', '中性']
  },
  {
    id: 'h18', name: '巴拉克拉法帽', enName: 'Balaclava',
    structure: '全包裹式，仅露五官',
    logic: '物理切断所有面部留白，建立全新的面部比例。',
    suitableFor: ['各种脸型'],
    avoidFor: ['面部极宽者'],
    aestheticTags: ['前卫', '面部重塑', '极致包裹']
  },
  {
    id: 'h19', name: '优雅遮阳大檐帽', enName: 'Picture Hat',
    structure: '极宽檐口，半透明材质常有',
    logic: '利用巨大的横向延展感对比，使肩颈部视觉纤细。',
    suitableFor: ['心形脸', '窄肩'],
    avoidFor: ['矮个子'],
    aestheticTags: ['高级', '空间博弈', '防晒']
  },
  {
    id: 'h20', name: '雅士冠帽', enName: 'Ascot Cap',
    structure: '硬质圆顶，檐冠一体',
    logic: '比鸭舌帽更饱满的顶部，适合修饰扁平的后脑勺。',
    suitableFor: ['扁头', '长脸'],
    avoidFor: ['圆脸'],
    aestheticTags: ['儒雅', '后脑填充', '经典']
  }
];

export const PAIN_POINTS = {
  universal: [
    "脸大显胖", "颅顶扁平", "头大身小", "脖子粗短", "颧弓外扩", 
    "面部折叠度低", "面部留白过多", "后脑勺扁平", "头围过大", "发质细软塌",
    "侧颜单薄", "三庭比例失衡", "头肩比不协调", "五官分布散漫"
  ],
  female: [
    "人中过长显老", "太阳穴凹陷", "五官量感小", "中庭比例过长", "下巴后缩",
    "额头过宽", "眉眼距离过近", "下颌线模糊", "颧骨突起", "气质过于凌厉",
    "面部脂肪感重", "脸型线条生硬", "颞部狭窄", "眉骨平坦"
  ],
  male: [
    "发际线后移", "面部骨架过宽", "气质过熟显老", "山根平坦", "下颌角过方",
    "短发修饰力不足", "五官密集度高", "窄肩显头大", "眼神缺乏深邃感", "颈部肌肉发达",
    "面部轮廓模糊", "额头较短", "咬肌发达", "颞骨发育不足"
  ]
};