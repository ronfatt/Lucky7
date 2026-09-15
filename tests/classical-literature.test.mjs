// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Classical Literature & Knowledge Base Tests
// File: tests/classical-literature.test.mjs
// ==========================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import { LiteratureProvider, CLASSICAL_CANON_LIST } from '../lib/literature/literature-provider.ts';
import { PlumBlossomEngine, EARLY_HEAVEN_TRIGRAMS } from '../lib/literature/plum-blossom-engine.ts';
import { FlyingStarSiHuaEngine } from '../lib/literature/flying-star-sihua-engine.ts';
import { CitationEngine, CORE_CANONICAL_CITATIONS } from '../lib/literature/citation-engine.ts';

test('LiteratureProvider - Contains all 6 classical books from local 资料', () => {
  const allLit = LiteratureProvider.getAllLiterature();
  assert.equal(allLit.length, 6, 'Should have exactly 6 classical books registered');

  const titles = allLit.map((l) => l.title);
  assert.ok(titles.some((t) => t.includes('劉金府象数心学')));
  assert.ok(titles.some((t) => t.includes('蔡明宏')));
  assert.ok(titles.some((t) => t.includes('六七二象')));
  assert.ok(titles.some((t) => t.includes('梅花易数')));
  assert.ok(titles.some((t) => t.includes('理气原则')));
  assert.ok(titles.some((t) => t.includes('大耕老师')));

  // Verify all have chapters and non-empty summaries
  allLit.forEach((lit) => {
    assert.ok(lit.summary.length > 30, `Summary too short for ${lit.title}`);
    assert.ok(lit.chapters.length > 0, `Chapters missing for ${lit.title}`);
    assert.ok(lit.coreTheories.length > 0, `Core theories missing for ${lit.title}`);
  });
});

test('LiteratureProvider - Filters by lineage and searches keywords', () => {
  const qinTian = LiteratureProvider.getLiteratureByLineage('QIN_TIAN');
  assert.equal(qinTian.length, 1);
  assert.equal(qinTian[0].author, '蔡明宏 (华山钦天门第27代传人)');

  const meiHua = LiteratureProvider.getLiteratureByLineage('MEI_HUA');
  assert.equal(meiHua.length, 1);
  assert.equal(meiHua[0].author, '李科儒 著 (邵康节易数正传)');

  // Search keyword "十五数"
  const searchResult1 = LiteratureProvider.searchLiterature('十五数');
  assert.ok(searchResult1.length > 0);
  assert.equal(searchResult1[0].id, 'LIT_XIANGSHU');

  // Search keyword "自化"
  const searchResult2 = LiteratureProvider.searchLiterature('自化');
  assert.ok(searchResult2.length > 0);
  assert.ok(searchResult2.some((l) => l.id === 'LIT_QINTIAN'));
});

test('PlumBlossomEngine - Early Heaven Trigram numbers and Body/Use evaluation', () => {
  // 1-8 Trigram mapping
  assert.equal(PlumBlossomEngine.getTrigramByDigit(1).trigramZh, '乾');
  assert.equal(PlumBlossomEngine.getTrigramByDigit(1).element, 'Metal');
  assert.equal(PlumBlossomEngine.getTrigramByDigit(2).trigramZh, '兑');
  assert.equal(PlumBlossomEngine.getTrigramByDigit(3).trigramZh, '离');
  assert.equal(PlumBlossomEngine.getTrigramByDigit(3).element, 'Fire');
  assert.equal(PlumBlossomEngine.getTrigramByDigit(4).trigramZh, '震');
  assert.equal(PlumBlossomEngine.getTrigramByDigit(4).element, 'Wood');
  assert.equal(PlumBlossomEngine.getTrigramByDigit(6).trigramZh, '坎');
  assert.equal(PlumBlossomEngine.getTrigramByDigit(6).element, 'Water');
  assert.equal(PlumBlossomEngine.getTrigramByDigit(8).trigramZh, '坤');
  assert.equal(PlumBlossomEngine.getTrigramByDigit(8).element, 'Earth');

  // Body/Use relations
  // Case A: Wood (Ti) and Water (Yong) -> Water generates Wood -> 用生体 (YONG_SHENG_TI)
  const rel1 = PlumBlossomEngine.evaluateRelation('Wood', 'Water');
  assert.equal(rel1.relation, 'YONG_SHENG_TI');
  assert.equal(rel1.relationZh, '用生体');

  // Case B: Metal (Ti) and Metal (Yong) -> 比和 (BI_HE)
  const rel2 = PlumBlossomEngine.evaluateRelation('Metal', 'Metal');
  assert.equal(rel2.relation, 'BI_HE');

  // Case C: Fire (Ti) and Metal (Yong) -> Fire overcomes Metal -> 体克用 (TI_KE_YONG)
  const rel3 = PlumBlossomEngine.evaluateRelation('Fire', 'Metal');
  assert.equal(rel3.relation, 'TI_KE_YONG');

  // 4-digit number analysis
  const analysis = PlumBlossomEngine.analyzeNumber('5729');
  assert.equal(analysis.numberStr, '5729');
  assert.ok(analysis.tiTrigram);
  assert.ok(analysis.yongTrigram);
  assert.ok(analysis.canonicalCitation.includes('李科儒《梅花易数体用大全》'));
});

test('FlyingStarSiHuaEngine - Retrieves canonical 576/672 patterns and queries by palace', () => {
  const allPatterns = FlyingStarSiHuaEngine.getAllPatterns();
  assert.ok(allPatterns.length >= 8);

  const mingLuCai = FlyingStarSiHuaEngine.findPattern('命宫', 'LU', '财帛宫');
  assert.ok(mingLuCai);
  assert.ok(mingLuCai.canonicalMeaning.includes('求财顺遂'));

  const caiPalacePatterns = FlyingStarSiHuaEngine.queryPatternsByPalace('财帛宫');
  assert.ok(caiPalacePatterns.length > 0);
});

test('CitationEngine - Matches canonical citations for synthesized numbers', () => {
  const citations = CitationEngine.matchCitationsForNumber('5729', 'Water');
  assert.ok(citations.plumBlossomCitation);
  assert.ok(citations.primaryMetaphysicalCitation);
  assert.ok(citations.primaryMetaphysicalCitation.originalQuote.length > 10);
  assert.ok(citations.secondaryCitations.length > 0);

  const numberCitations = CitationEngine.getCitationsByAspect('NUMBER');
  assert.ok(numberCitations.length > 0);
});
