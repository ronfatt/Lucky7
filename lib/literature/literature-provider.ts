// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Classical Literature Knowledge Provider
// File: lib/literature/literature-provider.ts
// Canon repository for local classical literature in /资料
// ==========================================================

import type { ClassicalLiterature, LiteratureLineage } from '../../types/zwtsp.ts';

export const CLASSICAL_CANON_LIST: ClassicalLiterature[] = [
  {
    id: 'LIT_XIANGSHU',
    title: '劉金府象数心学紫微斗数',
    author: '刘金府',
    lineage: 'XIANG_SHU',
    lineageName: '象数心学派',
    pageCount: 512,
    fileName: '劉金府象数心学紫微斗数.pdf',
    summary:
      '系统阐发紫微斗数「象数心学」核心秘旨。确立“星辰之用在类象，宫位之用在内外，四化之用在动静”。将斗数本源归结为河图洛书「十五数」之天机，指明天干气化与生年四化的数理变易，强调不离象数、象数合一。',
    coreTheories: [
      '河图洛书十五数理体系（星辰取数源于河图，取象源于洛书）',
      '十天干授气与四化流行（天干之气有十，四化即四象之动静）',
      '宫位内外体用与一四四局常变法则',
      '生数成数与干支气化之数理映射',
    ],
    tags: ['象数心学', '河洛数理', '四化气化', '十五数', '宫位体用'],
    chapters: [
      {
        id: 'ch-xs-1',
        chapterNumber: 1,
        title: '什么是紫微斗数：紫微垣天象与河洛数理渊源',
        summary: '论述紫微垣十五星与河图中心十五数的同构映射，奠定象数推演基础。',
        keyQuotes: [
          '星辰行化曜之功只于十五，河图是数，他的象在天。斗数，它只是一个河洛「十五数」的计算方法而己。',
          '星辰取数，是源于河图；取象，则是源于洛书。凡象数皆有其常与变。',
        ],
        keywords: ['河图', '洛书', '十五数', '紫微垣', '取象取数'],
      },
      {
        id: 'ch-xs-2',
        chapterNumber: 2,
        title: '十干气化与四化大义：天干十数化生四象',
        summary: '剖析十天干流行于运、化形于四化的机理，禄权为秉赋之高低，科忌为人事之成败。',
        keyQuotes: [
          '化气就是四化，四化源于十天干。五行就是星辰，阴阳相合而合为十。',
          '以字去看四化，禄权就是秉赋的高低，科忌就是人命运之中的成败。',
        ],
        keywords: ['十干化气', '四化大义', '阴阳合十', '禄权科忌'],
      },
      {
        id: 'ch-xs-3',
        chapterNumber: 3,
        title: '宫位内外与体用转化：一四四局动态运化',
        summary: '详细展开命财官迁与田疾福之内外互动，建立时空推演的体用架构。',
        keyQuotes: [
          '宫位、星辰，是命局之本象，曰一四四局。而四化，则是命运之化象。',
          '宫位之用在内外，星辰之用在类象，四化之用在动静。',
        ],
        keywords: ['宫位内外', '一四四局', '动静体用', '化象'],
      },
    ],
  },
  {
    id: 'LIT_QINTIAN',
    title: '楚皇-紫微斗数高级理论大全-蔡明宏視頻讲义',
    author: '蔡明宏 (华山钦天门第27代传人)',
    lineage: 'QIN_TIAN',
    lineageName: '钦天门华山派',
    pageCount: 140,
    fileName: '楚皇-紫微斗数高级理论大全-蔡明宏視頻 (2).pdf',
    summary:
      '华山钦天门代代嫡传高级理论大成，完整记录蔡明宏大师百小时讲座真诠。深入阐述生年四化、十四主星与左右昌曲阴阳数理，破译“自化理论”（自化禄权科忌与视同自化），揭示576象背后深奥的河图洛书卦气与佛易哲思。',
    coreTheories: [
      '钦天四化生年天干法则（禄权科忌天地人三才位格）',
      '自化大义（自化禄出、自化忌回、视同自化与离心向心四化）',
      '左右昌曲阴阳洛书卦气数理',
      '576 象飞星理气与易经卦象应期法则',
    ],
    tags: ['钦天四化', '蔡明宏', '自化理论', '左右昌曲', '576象', '易经卦象'],
    chapters: [
      {
        id: 'ch-qt-1',
        chapterNumber: 1,
        title: '左右昌曲与阴阳数理真诠',
        summary: '探究左辅、右弼、文昌、文曲作为时空骨架的阴阳五行与河洛数理分配。',
        keyQuotes: [
          '左辅右弼为阳数之维，文昌文曲为阴数之纲；天地流行之理，皆在阴阳奇偶交泰之中。',
        ],
        keywords: ['左辅右弼', '文昌文曲', '阴阳数理', '奇偶交泰'],
      },
      {
        id: 'ch-qt-2',
        chapterNumber: 2,
        title: '地理加自化理论：向心自化与离心自化',
        summary: '系统拆解自化禄、自化权、自化科、自化忌在空间方位与流日盘口上的能量变异。',
        keyQuotes: [
          '自化者，出乎自然生机，动静有常；自化禄是出，向心自化为归，数之流布由此分明。',
        ],
        keywords: ['自化理论', '向心四化', '离心自化', '空间气场'],
      },
      {
        id: 'ch-qt-3',
        chapterNumber: 3,
        title: '实战与易经卦象：576 象理气合一',
        summary: '将五百七十六象化繁为简，归入河图洛书九星卦象，直断时空吉凶应期。',
        keyQuotes: [
          '知其然而不知其所以然者，迷于576象；通其易理河洛者，万化归一，执一应万。',
        ],
        keywords: ['576象', '理气合一', '卦象应期', '万化归一'],
      },
    ],
  },
  {
    id: 'LIT_FEIXING_672',
    title: '飞星紫微斗数十二宫六七二象',
    author: '飞星派历代先贤整理',
    lineage: 'FEI_XING',
    lineageName: '飞星四化派',
    pageCount: 464,
    fileName: '飞星紫微斗数十二宫六七二象.pdf',
    summary:
      '飞星紫微斗数最具代表性的典范断诀全书。穷尽十二宫（命宫、兄弟、夫妻、子女、财帛、疾厄、迁移、交友、官禄、田宅、福德、父母）各自化禄、化权、化科、化忌飞入十二宫的完整 576 象及变格 672 象，为宫位飞化提供完备查表辞典。',
    coreTheories: [
      '十二宫干飞化矩阵（12 宫 x 4 化 x 12 宫 = 576 基础象）',
      '三合方与六合方飞化引动法则',
      '财帛宫与田宅宫四化飞星数理聚散断法',
      '禄随忌走、忌转禄生之动态循环',
    ],
    tags: ['飞星派', '六七二象', '576象', '宫位飞化', '财官飞星'],
    chapters: [
      {
        id: 'ch-fx-1',
        chapterNumber: 1,
        title: '命宫十二飞化详解：主宰命造气机之源',
        summary: '详述命宫化禄、权、科、忌入命、兄、夫、子、财、疾、迁、友、官、田、福、父之象数。',
        keyQuotes: [
          '命宫化禄入财帛，求财顺遂而数有源；命宫化忌入田宅，藏富于家而气不散。',
        ],
        keywords: ['命宫飞化', '化禄入财', '化忌入田', '数理源头'],
      },
      {
        id: 'ch-fx-2',
        chapterNumber: 2,
        title: '财帛与田宅宫飞星：数字资产之生生不息',
        summary: '专注探讨财气聚集、投资进出、库位盈虚的飞星数理指引。',
        keyQuotes: [
          '财为用，田为体；财帛化权照官禄者利拓，化忌入疾厄者防损耗。体用相资，数自坚实。',
        ],
        keywords: ['财帛飞星', '田宅藏库', '体用相资', '资产数理'],
      },
    ],
  },
  {
    id: 'LIT_MEIHUA',
    title: '梅花易数体用大全',
    author: '李科儒 著 (邵康节易数正传)',
    lineage: 'MEI_HUA',
    lineageName: '梅花易数体用学',
    pageCount: 392,
    fileName: '梅花易数体用大全。李科儒著。392页！.pdf',
    summary:
      '宋代易学大师邵康节所创梅花易数之集大成注本。全书以“体用生克”为主轴，详细阐释先天八卦数（乾一、兑二、离三、震四、巽五、坎六、艮七、坤八）与后天八卦方位，建立声音、方位、时空、物象起数定卦断事的完整数理模型。',
    coreTheories: [
      '先天八卦数理体系（乾1、兑2、离3、震4、巽5、坎6、艮7、坤8）',
      '体用生克断法（体克用、用克体、体生用、用生体、体用比和）',
      '动爻定数与应期数理法则',
      '物象与数字通变（数由心生，象由数显）',
    ],
    tags: ['梅花易数', '李科儒', '体用生克', '先天八卦数', '起数断卦'],
    chapters: [
      {
        id: 'ch-mh-1',
        chapterNumber: 1,
        title: '先天八卦数与天地生成之象',
        summary: '解析乾一至坤八的数理源起，如何将任意数字转化为八卦卦象与五行能量。',
        keyQuotes: [
          '天地定位，乾一坤八；雷风相薄，震四巽五；水火不相射，坎六离三；山泽通气，艮七兑二。数之所存，吉凶所倚。',
        ],
        keywords: ['先天八卦数', '乾一兑二', '坎六离三', '数之所存'],
      },
      {
        id: 'ch-mh-2',
        chapterNumber: 2,
        title: '体用生克之妙：五大关系定局法则',
        summary: '论断体用生克五种状态对决策与行动的影响，指导数字选择与取舍。',
        keyQuotes: [
          '体生用为泄气之兆，用生体为进益之功；体克用谋求可得，用克体祸起仓卒；体用比和百事通泰。',
        ],
        keywords: ['体生用', '用生体', '体克用', '用克体', '比和'],
      },
      {
        id: 'ch-mh-3',
        chapterNumber: 3,
        title: '物数通变与万物类象指归',
        summary: '将日常生活中的颜色、方向、数字、声音与八卦精准对应，实现真实信号提取。',
        keyQuotes: [
          '数以象成，象以数立；触机发契，神而明之，存乎其人。',
        ],
        keywords: ['物象类比', '真实信号', '触机起数', '神而明之'],
      },
    ],
  },
  {
    id: 'LIT_LIQI',
    title: '由理气原则学习飞宫紫微斗数',
    author: '飞宫理气诸学者 编著',
    lineage: 'LI_QI',
    lineageName: '飞宫理气派',
    pageCount: 392,
    fileName: '由理气原则学习飞宫紫微斗数  392P.pdf',
    summary:
      '从传统易理理气高度解剖飞宫紫微斗数的大成之作。提出“理在数先，气依形著”的原则，深入解析宫位天干如何引动四化、如何以“追忌”、“追禄”、“转忌”追查因果链条与流日流时应期。',
    coreTheories: [
      '理气合一原则（理以运数，气以成象）',
      '禄转忌追禄（探寻机缘萌动之因）',
      '忌转忌追忌（排查风险连带之果）',
      '时空流日流时气机传变法则',
    ],
    tags: ['理气原则', '飞宫紫微', '禄转忌', '追禄追忌', '因果应期'],
    chapters: [
      {
        id: 'ch-lq-1',
        chapterNumber: 1,
        title: '理气总纲：天干气化与十二宫场能',
        summary: '剖析十天干在十二地支宫位所形成的气场差异与数理分布。',
        keyQuotes: [
          '理在数先，气依形著。天干施气，地支受化，十二宫如天地大炉，数出其中矣。',
        ],
        keywords: ['理气总纲', '天干施气', '地支受化', '场能数理'],
      },
      {
        id: 'ch-lq-2',
        chapterNumber: 2,
        title: '追禄追忌法则：四化能量的动态传导链',
        summary: '建立事件发展与数字能量从初起、发展到归藏的闭环分析模型。',
        keyQuotes: [
          '发于禄者显其端，归于忌者定其宿；追其流转，知数之所聚，明势之所趋。',
        ],
        keywords: ['追禄', '追忌', '传导链', '气势所趋'],
      },
    ],
  },
  {
    id: 'LIT_DAGENG',
    title: '大耕老师【紫微斗数课程讲义：初阶班】',
    author: '大耕老师',
    lineage: 'PRACTICAL',
    lineageName: '现代实战派',
    pageCount: 156,
    fileName: '大耕老师【紫微斗数课程讲义：初阶班】繁体横版黑白扫描.pdf',
    summary:
      '台湾现代紫微斗数实战名师大耕老师系统整理的教学讲义。以严谨现代逻辑剖析十四主星性格特质、十二宫位人生面向与生年四化基础，非常适合快速构建宫星化结构化索引。',
    coreTheories: [
      '十四主星星曜五行特质与心理类象',
      '十二宫位现代社会属性与财务决策映射',
      '化禄、化权、化科、化忌实战入门要领',
    ],
    tags: ['大耕老师', '初阶讲义', '十四主星', '十二宫位', '现代实战'],
    chapters: [
      {
        id: 'ch-dg-1',
        chapterNumber: 1,
        title: '十四主星本质与五行数理映射',
        summary: '系统归纳紫微、天机、太阳、武曲、天同等星曜的五行归属与特质。',
        keyQuotes: [
          '星曜无绝对吉凶，全在五行配置与运势激发；知星性则知名分，明化曜则达时机。',
        ],
        keywords: ['十四主星', '星曜特质', '知星知名', '五行配置'],
      },
    ],
  },
];

export class LiteratureProvider {
  private static canonList: ClassicalLiterature[] = [...CLASSICAL_CANON_LIST];

  /**
   * Retrieves all classical literature in the system
   */
  public static getAllLiterature(): ClassicalLiterature[] {
    return [...this.canonList];
  }

  /**
   * Filters literature by school/lineage
   */
  public static getLiteratureByLineage(lineage: LiteratureLineage): ClassicalLiterature[] {
    return this.canonList.filter((lit) => lit.lineage === lineage);
  }

  /**
   * Finds a literature by unique ID
   */
  public static getLiteratureById(id: string): ClassicalLiterature | undefined {
    return this.canonList.find((lit) => lit.id === id);
  }

  /**
   * Searches literature by keyword (matches title, author, summary, coreTheories, or tags)
   */
  public static searchLiterature(query: string): ClassicalLiterature[] {
    if (!query || query.trim() === '') return this.getAllLiterature();
    const q = query.trim().toLowerCase();
    return this.canonList.filter((lit) => {
      return (
        lit.title.toLowerCase().includes(q) ||
        lit.author.toLowerCase().includes(q) ||
        lit.summary.toLowerCase().includes(q) ||
        lit.lineageName.toLowerCase().includes(q) ||
        lit.coreTheories.some((t) => t.toLowerCase().includes(q)) ||
        lit.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        lit.chapters.some((ch) => ch.title.toLowerCase().includes(q) || ch.summary.toLowerCase().includes(q))
      );
    });
  }
}
