export const codeToRoot: Record<string, string> = {
  'g': '王', 'f': '土', 'd': '大', 's': '木', 'a': '工',
  'h': '目', 'j': '日', 'k': '口', 'l': '田', 'm': '山',
  't': '禾', 'r': '白', 'e': '月', 'w': '人', 'q': '金',
  'y': '言', 'u': '立', 'i': '水', 'o': '火', 'p': '之',
  'n': '已', 'b': '子', 'v': '女', 'c': '又', 'x': '纟'
};

export const koujueDict: Record<string, string> = {
  'g': '王旁青头（兼）五一',
  'f': '土士二干十寸雨',
  'd': '大犬三（羊）古石厂',
  's': '木丁西',
  'a': '工戈草头右框七',
  'h': '目具上止卜虎皮',
  'j': '日早两竖与虫依',
  'k': '口与川，字根稀',
  'l': '田甲方框四车力',
  'm': '山由贝，下框几',
  't': '禾竹一撇双人立，反文条头共三一',
  'r': '白手看头三二斤',
  'e': '月彡（衫）乃用家衣底',
  'w': '人和八，三四里',
  'q': '金勺缺点无尾鱼，犬旁留儿一点夕，氏无七（妻）',
  'y': '言文方广在四一，高头一捺谁人去',
  'u': '立辛两点六门疒',
  'i': '水旁兴头小倒立',
  'o': '火业头，四点米',
  'p': '之宝盖，摘礻（示）衤（衣）',
  'n': '已半巳满不出己，左框折尸心和羽',
  'b': '子耳了也框向上',
  'v': '女刀九臼山朝西',
  'c': '又巴马，丢矢矣',
  'x': '慈母无心弓和匕，幼无力'
};

export const keySymbols: Record<string, string[]> = {
  'g': ['王', '', '', '', '一', '五'],
  'f': ['土', '士', '二', '干', '十', '寸', '雨'],
  'd': ['大', '犬', '三', '羊', '古', '石', '厂'],
  's': ['木', '丁', '西'],
  'a': ['工', '戈', '艹', '廿'],
  'h': ['目', '具', '上', '止', '卜', '虎', '皮'],
  'j': ['日', '曰', '刂', '刂', '早', '虫'],
  'k': ['口', '川'],
  'l': ['田', '甲', '四', '皿', '车', '力'],
  'm': ['山', '由', '贝', '几'],
  't': ['禾', '', '竹', '彳', '夂'],
  'r': ['白', '手', '扌', '斤'],
  'e': ['月', '乃', '用', '家', '衣'],
  'w': ['人', '亻', '八'],
  'q': ['金', '钅', '勹', '爪', '夕', '鱼', '犭', '乂', '儿'],
  'y': ['言', '讠', '广', '文', '方'],
  'u': ['立', '丷', '六', '辛', '门', '疒'],
  'i': ['水', '氵', '小', '⺌'],
  'o': ['火', '业', '米'],
  'p': ['之', '宀', '辶', '廴', '礻', '衤'],
  'n': ['已', '巳', '己', '尸', '心', '羽'],
  'b': ['子', '耳', '了', '也'],
  'v': ['女', '刀', '九', '臼'],
  'c': ['又', '巴', '马'],
  'x': ['纟', '幺', '弓', '匕']
};

export interface WubiCharData {
  char: string;
  nature: string;
  codes: string[];
  decomposition: string[];
  roots: string[];
  strokes: number[][];
  annotations: string[];
}

export const charLibrary: Record<string, WubiCharData> = {
  // 1. 键名字 - 单字根
  "王": {
    char: "王", nature: "(1/7) 键名字 - 单字根",
    codes: ["g", "g", "g", "g"], decomposition: ["G", "G", "G", "G"],
    roots: ["王", "王", "王", "王"], strokes: [[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]],
    annotations: ["键位 G", "键名字", "键名字", "键名字"]
  },
  "土": {
    char: "土", nature: "(1/7) 键名字 - 单字根",
    codes: ["f", "f", "f", "f"], decomposition: ["F", "F", "F", "F"],
    roots: ["土", "土", "土", "土"], strokes: [[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]],
    annotations: ["键位 F", "键名字", "键名字", "键名字"]
  },
  "大": {
    char: "大", nature: "(1/7) 键名字 - 单字根",
    codes: ["d", "d", "d", "d"], decomposition: ["D", "D", "D", "D"],
    roots: ["大", "大", "大", "大"], strokes: [[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]],
    annotations: ["键位 D", "键名字", "键名字", "键名字"]
  },
  "木": {
    char: "木", nature: "(1/7) 键名字 - 单字根",
    codes: ["s", "s", "s", "s"], decomposition: ["S", "S", "S", "S"],
    roots: ["木", "木", "木", "木"], strokes: [[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]],
    annotations: ["键位 S", "键名字", "键名字", "键名字"]
  },
  "工": {
    char: "工", nature: "(1/7) 键名字 - 单字根",
    codes: ["a", "a", "a", "a"], decomposition: ["A", "A", "A", "A"],
    roots: ["工", "工", "工", "工"], strokes: [[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]],
    annotations: ["键位 A", "键名字", "键名字", "键名字"]
  },

  // 2. 成字字根 - 单字根单笔划
  "一": {
    char: "一", nature: "(2/7) 成字字根 - 单字根单笔划",
    codes: ["g", "g", "l", "l"], decomposition: ["G", "G", "L", "L"],
    roots: ["一", "一", "L", "L"], strokes: [[0], [0], [], []],
    annotations: ["键位 G", "首笔 一", "无意义的填充键", "无意义的填充键"]
  },
  "乙": {
    char: "乙", nature: "(2/7) 成字字根 - 单字根单笔划",
    codes: ["n", "n", "l", "l"], decomposition: ["N", "N", "L", "L"],
    roots: ["乙", "乙", "L", "L"], strokes: [[0], [0], [], []],
    annotations: ["键位 N", "首笔 乙", "无意义的填充键", "无意义的填充键"]
  },
  "丨": {
    char: "丨", nature: "(2/7) 成字字根 - 单字根单笔划",
    codes: ["h", "h", "l", "l"], decomposition: ["H", "H", "L", "L"],
    roots: ["丨", "丨", "L", "L"], strokes: [[0], [0], [], []],
    annotations: ["键位 H", "首笔 丨", "无意义的填充键", "无意义的填充键"]
  },
  "丿": {
    char: "丿", nature: "(2/7) 成字字根 - 单字根单笔划",
    codes: ["t", "t", "l", "l"], decomposition: ["T", "T", "L", "L"],
    roots: ["丿", "丿", "L", "L"], strokes: [[0], [0], [], []],
    annotations: ["键位 T", "首笔 丿", "无意义的填充键", "无意义的填充键"]
  },
  "丶": {
    char: "丶", nature: "(2/7) 成字字根 - 单字根单笔划",
    codes: ["y", "y", "l", "l"], decomposition: ["Y", "Y", "L", "L"],
    roots: ["丶", "丶", "L", "L"], strokes: [[0], [0], [], []],
    annotations: ["键位 Y", "首笔 丶", "无意义的填充键", "无意义的填充键"]
  },

  // 3. 成字字根 - 单字根两笔划
  "二": {
    char: "二", nature: "(3/7) 成字字根 - 单字根两笔划",
    codes: ["f", "g", "g", " "], decomposition: ["F", "G", "G", " "],
    roots: ["二", "一", "一", " "], strokes: [[0, 1], [0], [1], []],
    annotations: ["键位 F", "首笔 一", "次笔 一", "空格"]
  },
  "厂": {
    char: "厂", nature: "(3/7) 成字字根 - 单字根两笔划",
    codes: ["d", "g", "t", " "], decomposition: ["D", "G", "T", " "],
    roots: ["厂", "一", "丿", " "], strokes: [[0, 1], [0], [1], []],
    annotations: ["键位 D", "首笔 一", "次笔 丿", "空格"]
  },
  "几": {
    char: "几", nature: "(3/7) 成字字根 - 单字根两笔划",
    codes: ["m", "t", "n", " "], decomposition: ["M", "T", "N", " "],
    roots: ["几", "丿", "乙", " "], strokes: [[0, 1], [0], [1], []],
    annotations: ["键位 M", "首笔 丿", "次笔 乙", "空格"]
  },
  "乃": {
    char: "乃", nature: "(3/7) 成字字根 - 单字根两笔划",
    codes: ["e", "t", "v", " "], decomposition: ["E", "T", "V", " "],
    roots: ["乃", "丿", "乙", " "], strokes: [[0, 1], [0], [1], []],
    annotations: ["键位 E", "首笔 丿", "次笔 乙", "空格"]
  },
  "卜": {
    char: "卜", nature: "(3/7) 成字字根 - 单字根两笔划",
    codes: ["h", "h", "y", " "], decomposition: ["H", "H", "Y", " "],
    roots: ["卜", "丨", "丶", " "], strokes: [[0, 1], [0], [1], []],
    annotations: ["键位 H", "首笔 丨", "次笔 丶", "空格"]
  },

  // 4. 成字字根 - 单字根三笔划及以上
  "三": {
    char: "三", nature: "(4/7) 成字字根 - 单字根三笔划及以上",
    codes: ["d", "g", "g", "g"], decomposition: ["D", "G", "G", "G"],
    roots: ["三", "一", "一", "一"], strokes: [[0, 1, 2], [0], [1], [2]],
    annotations: ["键位 D", "首笔 一", "次笔 一", "末笔 一"]
  },
  "小": {
    char: "小", nature: "(4/7) 成字字根 - 单字根三笔划及以上",
    codes: ["i", "h", "t", "y"], decomposition: ["I", "H", "T", "Y"],
    roots: ["小", "亅", "丿", "丶"], strokes: [[0, 1, 2], [0], [1], [2]],
    annotations: ["键位 I", "首笔 亅", "次笔 丿", "末笔 丶"]
  },
  "石": {
    char: "石", nature: "(4/7) 成字字根 - 单字根三笔划及以上",
    codes: ["d", "g", "t", "g"], decomposition: ["D", "G", "T", "G"],
    roots: ["石", "一", "丿", "一"], strokes: [[0, 1, 2, 3, 4], [0], [1], [4]],
    annotations: ["键位 D", "首笔 一", "次笔 丿", "末笔 一"]
  },
  "文": {
    char: "文", nature: "(4/7) 成字字根 - 单字根三笔划及以上",
    codes: ["y", "y", "g", "t"], decomposition: ["Y", "Y", "G", "T"],
    roots: ["文", "丶", "一", "丿"], strokes: [[0, 1, 2, 3], [0], [1], [3]],
    annotations: ["键位 Y", "首笔 丶", "次笔 一", "末笔 乂"]
  },
  "方": {
    char: "方", nature: "(4/7) 成字字根 - 单字根三笔划及以上",
    codes: ["y", "y", "g", "n"], decomposition: ["Y", "Y", "G", "N"],
    roots: ["方", "丶", "一", "折"], strokes: [[0, 1, 2, 3], [0], [1], [2]],
    annotations: ["键位 Y", "首笔 丶", "次笔 一", "末笔 折"]
  },

  // 5. 双字根
  "明": {
    char: "明", nature: "(5/7) 双字根",
    codes: ["j", "e", "g"], decomposition: ["J", "E", "G"],
    roots: ["日", "月", "11"], strokes: [[0, 1, 2, 3], [4, 5, 6, 7], [7]],
    annotations: ["@j", "@e", "识别码 横 左右结构"]
  },
  "吕": {
    char: "吕", nature: "(5/7) 双字根",
    codes: ["k", "k", "f"], decomposition: ["K", "K", "F"],
    roots: ["口", "口", "12"], strokes: [[0, 1, 2], [3, 4, 5], [5]],
    annotations: ["@k", "@k", "识别码 横 上下结构"]
  },
  "胡": {
    char: "胡", nature: "(5/7) 双字根",
    codes: ["d", "e", "g"], decomposition: ["D", "E", "G"],
    roots: ["古", "月", "11"], strokes: [[0, 1, 2, 3, 4], [5, 6, 7, 8], [8]],
    annotations: ["@d", "@e", "识别码 横 左右结构"]
  },
  "肥": {
    char: "肥", nature: "(5/7) 双字根",
    codes: ["e", "b", "n"], decomposition: ["E", "B", "N"],
    roots: ["月", "巴", "51"], strokes: [[0, 1, 2, 3], [4, 5, 6, 7], [7]],
    annotations: ["@e", "@b", "识别码 折 左右结构"]
  },
  "义": {
    char: "义", nature: "(5/7) 双字根",
    codes: ["y", "q", "i"], decomposition: ["Y", "Q", "I"],
    roots: ["丶", "乂", "43"], strokes: [[0], [1, 2], [2]],
    annotations: ["@y", "@q", "识别码 捺 杂合结构"]
  },

  // 6. 三字根字
  "国": {
    char: "国", nature: "(6/7) 三字根字",
    codes: ["l", "g", "y", "i"], decomposition: ["L", "G", "Y", "I"],
    roots: ["囗", "王", "丶", "43"], strokes: [[0, 1, 7], [2, 3, 4, 5], [6], [6]],
    annotations: ["@l", "@g", "@y", "识别码 捺 杂合结构"]
  },
  "是": {
    char: "是", nature: "(6/7) 三字根字",
    codes: ["j", "g", "h", "u"], decomposition: ["J", "G", "H", "U"],
    roots: ["日", "一", "丨", "42"], strokes: [[0, 1, 2, 3], [4], [5, 6, 7, 8], [8]],
    annotations: ["@j", "@g", "@h", "识别码 捺 上下结构"]
  },
  "你": {
    char: "你", nature: "(6/7) 三字根字",
    codes: ["w", "q", "i", "y"], decomposition: ["W", "Q", "I", "Y"],
    roots: ["亻", "⺈", "小", "41"], strokes: [[0, 1], [2, 3], [4, 5, 6], [6]],
    annotations: ["@w", "@q", "@i", "识别码 捺 左右结构"]
  },
  "法": {
    char: "法", nature: "(6/7) 三字根字",
    codes: ["i", "f", "c", "y"], decomposition: ["I", "F", "C", "Y"],
    roots: ["氵", "土", "厶", "41"], strokes: [[0, 1, 2], [3, 4, 5], [6, 7], [7]],
    annotations: ["@i", "@f", "@c", "识别码 捺 左右结构"]
  },
  "学": { 
    char: "学", nature: "(6/7) 三字根字",
    codes: ["i", "p", "b", "f"], decomposition: ["I", "P", "B", "F"],
    roots: ["氵", "冖", "子", "12"], strokes: [[0, 1, 2], [3, 4], [5, 6, 7], [7]],
    annotations: ["@i", "@p", "@b", "识别码 横 上下结构"]
  },

  // 7. 四字根及以上
  "我": {
    char: "我", nature: "(7/7) 四字根及以上",
    codes: ["t", "r", "n", "y"], decomposition: ["T", "R", "N", "Y"],
    roots: ["丿", "扌", "㇂", "丶"], strokes: [[0], [1, 2, 3], [4], [6]],
    annotations: ["@t", "@r", "@n", "@y"]
  },
  "就": {
    char: "就", nature: "(7/7) 四字根及以上",
    codes: ["y", "k", "i", "d"], decomposition: ["Y", "K", "I", "D"],
    roots: ["亠", "口", "小", "尤"], strokes: [[0, 1], [2, 3, 4], [5, 6, 7], [8, 9, 10, 11]],
    annotations: ["@y", "@k", "@i", "@d"]
  },
  "照": {
    char: "照", nature: "(7/7) 四字根及以上",
    codes: ["j", "v", "k", "o"], decomposition: ["J", "V", "K", "O"],
    roots: ["日", "刀", "口", "灬"], strokes: [[0, 1, 2, 3], [4, 5], [6, 7, 8], [9, 10, 11, 12]],
    annotations: ["@j", "@v", "@k", "@o"]
  },
  "器": {
    char: "器", nature: "(7/7) 四字根及以上",
    codes: ["k", "k", "d", "k"], decomposition: ["K", "K", "D", "K"],
    roots: ["口", "口", "犬", "口"], strokes: [[0, 1, 2], [3, 4, 5], [6, 7, 8, 9], [13, 14, 15]],
    annotations: ["@k", "@k", "@d", "@k"]
  },
  "谢": {
    char: "谢", nature: "(7/7) 四字根及以上",
    codes: ["y", "t", "m", "f"], decomposition: ["Y", "T", "M", "F"],
    roots: ["讠", "丿", "贝", "寸"], strokes: [[0, 1], [2], [3, 4], [9, 10, 11]],
    annotations: ["@y", "@t", "@m", "@f"]
  },
  "繁": {
    char: "繁", nature: "(7/7) 四字根及以上",
    codes: ["t", "x", "g", "i"], decomposition: ["T", "X", "G", "I"],
    roots: ["𠂉", "母", "一", "小"], strokes: [[0, 1], [2, 3], [5], [14, 15, 16]],
    annotations: ["@t", "@x", "@g", "@i"]
  },
  "藏": {
    char: "藏", nature: "(7/7) 四字根及以上",
    codes: ["a", "d", "n", "t"], decomposition: ["A", "D", "N", "T"],
    roots: ["艹", "厂", "𠃊", "丿"], strokes: [[0, 1, 2], [3, 4], [5], [15]],
    annotations: ["@a", "@d", "@n", "@t"]
  },
  "舞": {
    char: "舞", nature: "(7/7) 四字根及以上",
    codes: ["r", "l", "g", "h"], decomposition: ["R", "L", "G", "H"],
    roots: ["牛", "四", "一", "丨"], strokes: [[0, 1, 2], [3, 4, 5, 6], [7], [13]],
    annotations: ["@r", "@l", "@g", "@h"]
  }
};
