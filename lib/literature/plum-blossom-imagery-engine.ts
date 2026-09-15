// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Plum Blossom Imagery & Dream Divination Engine
// File: lib/literature/plum-blossom-imagery-engine.ts
// Based on: 邵康节《梅花易数》卷二·万物类象 & 象数起卦法
// ==========================================================

import type { FiveElement } from '../../types/zwtsp.ts';

export interface TrigramMeta {
  index: number; // 1 to 8 (先天八卦数)
  name: string; // 乾, 兑, 离, 震, 巽, 坎, 艮, 坤
  nature: string; // 天, 泽, 火, 雷, 风, 水, 山, 地
  element: FiveElement;
  elementZh: string;
  keywords: string[];
}

export const EIGHT_TRIGRAMS: Record<string, TrigramMeta> = {
  乾: {
    index: 1,
    name: '乾',
    nature: '天',
    element: 'Metal',
    elementZh: '金',
    keywords: [
      '天', '龙', '巨龙', '飞龙', '黄金', '首长', '领导', '父亲', '老人', '圆形', '钟表',
      '汽车', '飞机', '宝剑', '高贵', '官府', '刚健', '威严', '太阳', '狮子', '高山顶'
    ],
  },
  兑: {
    index: 2,
    name: '兑',
    nature: '泽',
    element: 'Metal',
    elementZh: '金',
    keywords: [
      '泽', '少女', '喜悦', '笑', '聚会', '宴请', '结婚', '喜事', '音乐', '歌唱', '口舌',
      '珠宝', '首饰', '咖啡', '羊', '刀剪', '破损', '废墟', '残缺', '争论', '口红'
    ],
  },
  离: {
    index: 3,
    name: '离',
    nature: '火',
    element: 'Fire',
    elementZh: '火',
    keywords: [
      '火', '大火', '火灾', '烈火', '光明', '太阳', '凤', '鸟', '孔雀', '红色', '眼睛',
      '电', '闪电', '手机', '电脑', '电视', '炉灶', '烹饪', '证书', '文章', '热烈'
    ],
  },
  震: {
    index: 4,
    name: '震',
    nature: '雷',
    element: 'Wood',
    elementZh: '木',
    keywords: [
      '雷', '雷鸣', '打雷', '震惊', '车祸', '撞车', '爆炸', '警笛', '声音', '奔马', '马',
      '树木', '竹林', '长子', '运动', '冲突', '争吵', '震动', '地震', '起跑', '警车'
    ],
  },
  巽: {
    index: 5,
    name: '巽',
    nature: '风',
    element: 'Wood',
    elementZh: '木',
    keywords: [
      '风', '大风', '狂风', '蛇', '蟒蛇', '青蛇', '绳索', '绳子', '长带', '进退', '犹豫',
      '长女', '花草', '植物', '绿色', '香气', '香水', '扇子', '气流', '长途', '消息'
    ],
  },
  坎: {
    index: 6,
    name: '坎',
    nature: '水',
    element: 'Water',
    elementZh: '水',
    keywords: [
      '水', '大水', '洪水', '江河', '暴雨', '下雨', '海', '湖泊', '猪', '盗贼', '小偷',
      '陷阱', '危险', '黑色', '隐匿', '深坑', '船只', '饮料', '酒', '眼泪', '哭泣', '险阻'
    ],
  },
  艮: {
    index: 7,
    name: '艮',
    nature: '山',
    element: 'Earth',
    elementZh: '土',
    keywords: [
      '山', '高山', '石头', '岩石', '狗', '门', '大门', '房屋', '房子', '盖房', '建筑',
      '寺庙', '堤坝', '屏障', '停滞', '静止', '休息', '少男', '关隘', '假山', '背部'
    ],
  },
  坤: {
    index: 8,
    name: '坤',
    nature: '地',
    element: 'Earth',
    elementZh: '土',
    keywords: [
      '地', '大地', '泥土', '田野', '农田', '母亲', '老妇', '牛', '黄牛', '布帛', '衣服',
      '方形', '群众', '人群', '包容', '柔顺', '黄色', '粮食', '仓库', '平地', '包袱'
    ],
  },
};

export interface DreamDivinationResult {
  keyword: string;
  matchedTrigrams: {
    upper: TrigramMeta;
    lower: TrigramMeta;
    movingLine: number;
  };
  hexagramName: string; // e.g. "火水未济" 或 "天火同人"
  guaSummary: string;
  recommended4DNumbers: {
    number: string;
    derivationMethod: string;
    score: number;
  }[];
  classicalQuote: string;
}

export class PlumBlossomImageryEngine {
  /**
   * Derives hexagram and 4D numbers from dream description or real-world imagery text
   */
  public static divinateFromImagery(
    text: string,
    currentHourBranch: number = 8 // Default Shen hour (15-17)
  ): DreamDivinationResult {
    const cleanText = text.trim();
    const trigramKeys = Object.keys(EIGHT_TRIGRAMS);

    // 1. Keyword search across 8 trigrams (ordered by occurrence in text)
    const matches: { pos: number; keyword: string; meta: TrigramMeta }[] = [];
    for (const key of trigramKeys) {
      const meta = EIGHT_TRIGRAMS[key];
      for (const kw of meta.keywords) {
        const pos = cleanText.indexOf(kw);
        if (pos !== -1) {
          matches.push({ pos, keyword: kw, meta });
        }
      }
    }

    // Sort by appearance in text ascending: 先见者为上卦，后见者为下卦
    matches.sort((a, b) => a.pos - b.pos);

    let upperTrigram: TrigramMeta | null = null;
    let lowerTrigram: TrigramMeta | null = null;
    const foundMatches: string[] = [];

    for (const m of matches) {
      if (!foundMatches.includes(m.keyword)) {
        foundMatches.push(m.keyword);
      }
      if (!upperTrigram) {
        upperTrigram = m.meta;
      } else if (!lowerTrigram && m.meta.name !== upperTrigram.name) {
        lowerTrigram = m.meta;
      }
    }

    if (!upperTrigram) upperTrigram = EIGHT_TRIGRAMS['离'];
    if (!lowerTrigram) lowerTrigram = EIGHT_TRIGRAMS['坎'];

    // If no keyword hit, fall back to character count起卦法 (梅花字数起卦)
    if (foundMatches.length === 0) {
      const charCount = Math.max(1, cleanText.length);
      const upperIdx = (charCount % 8) || 8;
      const lowerIdx = ((charCount + currentHourBranch) % 8) || 8;

      upperTrigram = Object.values(EIGHT_TRIGRAMS).find((t) => t.index === upperIdx) || EIGHT_TRIGRAMS['乾'];
      lowerTrigram = Object.values(EIGHT_TRIGRAMS).find((t) => t.index === lowerIdx) || EIGHT_TRIGRAMS['坤'];
    }

    // Moving line: (Upper + Lower + Hour) % 6 (1 to 6)
    const movingLine = ((upperTrigram.index + lowerTrigram.index + currentHourBranch) % 6) || 6;

    // Hexagram name
    const hexagramName = `${upperTrigram.nature}${lowerTrigram.nature}卦 · 【${upperTrigram.name}上${lowerTrigram.name}下】`;
    const guaSummary = `物象显现【${upperTrigram.name}为${upperTrigram.nature}】与【${lowerTrigram.name}为${lowerTrigram.nature}】互感，五行呈${upperTrigram.elementZh}与${lowerTrigram.elementZh}交汇，动在第${movingLine}爻。`;

    // 2. Generate deterministic 4D candidate numbers
    // Base digits from Trigram numbers
    const u = upperTrigram.index;
    const l = lowerTrigram.index;
    const m = movingLine;
    const mutual = ((u * 3 + l * 2) % 9) || 9;

    const num1 = `${u}${l}${m}${mutual}`;
    const num2 = `${mutual}${u}${l}${m}`;
    const num3 = `${l}${m}${mutual}${u}`;
    const num4 = `${u}${mutual}${l}${m}`;

    const recommended4DNumbers = [
      {
        number: num1,
        derivationMethod: `本卦序象数推导 (${upperTrigram.name}${u} + ${lowerTrigram.name}${l} + 动爻${m} + 互卦${mutual})`,
        score: 88,
      },
      {
        number: num2,
        derivationMethod: `互体生发顺位 (${mutual}首位引气 + 先天八卦序)`,
        score: 84,
      },
      {
        number: num3,
        derivationMethod: `变卦客用向心重构 (${lowerTrigram.name}客卦承转)`,
        score: 81,
      },
      {
        number: num4,
        derivationMethod: `主客体用互交排列`,
        score: 79,
      },
    ];

    return {
      keyword: foundMatches.join('、') || (cleanText.slice(0, 10) + '...'),
      matchedTrigrams: {
        upper: upperTrigram,
        lower: lowerTrigram,
        movingLine,
      },
      hexagramName,
      guaSummary,
      recommended4DNumbers,
      classicalQuote: '《梅花易数·万物类象》：“天下之事，皆有象数。见其象，则知其数；得其数，则决其吉凶。”',
    };
  }

  /**
   * Cleans and extracts a 4D number from a vehicle license plate or receipt string
   */
  public static parsePlateOrReceipt(text: string): {
    extracted4D: string | null;
    rawMatches: string[];
  } {
    // Look for 4 consecutive digits first
    const fourDigitRegex = /\b\d{4}\b/g;
    const directMatches = text.match(fourDigitRegex);
    if (directMatches && directMatches.length > 0) {
      // Pick the last 4-digit block (tail numbers / sequence)
      const chosen = directMatches[directMatches.length - 1];
      return {
        extracted4D: chosen,
        rawMatches: directMatches,
      };
    }

    // Strip non-alphanumeric and take last 4 digits
    const digitsOnly = text.replace(/\D/g, '');
    if (digitsOnly.length >= 4) {
      const lastFour = digitsOnly.slice(-4);
      return {
        extracted4D: lastFour,
        rawMatches: [lastFour],
      };
    }

    return {
      extracted4D: null,
      rawMatches: [],
    };
  }
}
