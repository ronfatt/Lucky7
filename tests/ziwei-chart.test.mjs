import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ZiWeiEngine, FOUR_TRANSFORMATIONS_BY_STEM } from '../lib/engines/ziwei/ziwei-engine.ts';

describe('ZWTSP Zi Wei Dou Shu Engine Verification', () => {
  const sampleProfile = {
    name: '测试甲男',
    gender: 'male',
    birthDate: '1990-05-18',
    birthTime: '09:30:00', // 巳时
    birthTimePrecision: 'EXACT',
    timezone: 'Asia/Shanghai',
    calendarType: 'gregorian',
  };

  test('Generates 12 standard Palaces with Life and Body palaces designated', () => {
    const chart = ZiWeiEngine.generateChart(sampleProfile);
    assert.equal(chart.isComplete, true);
    assert.equal(chart.palaces.length, 12);

    const lifePalace = chart.palaces.find(p => p.isLifePalace);
    assert.ok(lifePalace, 'Must have a designated 命宫');
    assert.equal(lifePalace.palaceName, '命宫');

    const bodyPalace = chart.palaces.find(p => p.isBodyPalace);
    assert.ok(bodyPalace, 'Must have a designated 身宫');
  });

  test('Places 14 Main Stars across the Palaces without duplication', () => {
    const chart = ZiWeiEngine.generateChart(sampleProfile);
    const allStars = chart.palaces.flatMap(p => p.stars);
    assert.equal(allStars.length, 14, 'Must place exactly 14 Main Stars');

    const starNames = allStars.map(s => s.starName);
    const uniqueStarNames = new Set(starNames);
    assert.equal(uniqueStarNames.size, 14, 'All 14 stars must be unique');
    assert.ok(uniqueStarNames.has('紫微'));
    assert.ok(uniqueStarNames.has('天府'));
    assert.ok(uniqueStarNames.has('太阳'));
    assert.ok(uniqueStarNames.has('武曲'));
  });

  test('Birth-Year Four Transformations correspond to Heavenly Stem (庚年: 阳武阴同)', () => {
    const chart = ZiWeiEngine.generateChart(sampleProfile);
    // 1990 is 庚年: 太阳化禄、武曲化权、太阴化科、天同化忌
    const stemRules = FOUR_TRANSFORMATIONS_BY_STEM['庚'];
    assert.equal(stemRules.Lu, '太阳');
    assert.equal(stemRules.Quan, '武曲');
    assert.equal(stemRules.Ke, '太阴');
    assert.equal(stemRules.Ji, '天同');

    const allTransforms = chart.palaces.flatMap(p => p.transformations);
    assert.equal(allTransforms.length, 4, 'Must place 4 transformations');
    const lu = allTransforms.find(t => t.transformation === 'Lu');
    assert.equal(lu.starName, '太阳');
  });

  test('Incomplete chart gracefully handles UNKNOWN birth hour without fabricating defaults', () => {
    const incompleteProfile = {
      ...sampleProfile,
      birthTimePrecision: 'UNKNOWN',
      birthTime: undefined,
    };

    const chart = ZiWeiEngine.generateChart(incompleteProfile);
    assert.equal(chart.isComplete, false);
    assert.equal(chart.palaces.length, 0);
    assert.ok(chart.missingDataReason.includes('出生时间未知'));
  });

  test('Canonical NaYin Bureau derivation (六十甲子纳音定五行局)', () => {
    // Test 1: 甲年 命在寅 -> 丙寅 -> 炉中火 -> 火六局
    assert.equal(ZiWeiEngine.calculateBureau('甲', '寅'), '火六局');

    // Test 2: 甲年 命在午 -> 庚午 -> 路旁土 -> 土五局
    assert.equal(ZiWeiEngine.calculateBureau('甲', '午'), '土五局');

    // Test 3: 乙年 命在午 -> 壬午 -> 杨柳木 -> 木三局
    assert.equal(ZiWeiEngine.calculateBureau('乙', '午'), '木三局');

    // Test 4: 乙年 命在巳 -> 辛巳 -> 白蜡金 -> 金四局
    assert.equal(ZiWeiEngine.calculateBureau('乙', '巳'), '金四局');

    // Test 5: 丙年 命在子 -> 庚子 -> 壁上土 -> 土五局
    assert.equal(ZiWeiEngine.calculateBureau('丙', '子'), '土五局');

    // Test 6: 丁年 命在亥 -> 辛亥 -> 钗钏金 -> 金四局
    assert.equal(ZiWeiEngine.calculateBureau('丁', '亥'), '金四局');

    // Test 7: 戊年 命在辰 -> 丙辰 -> 沙中土 -> 土五局
    assert.equal(ZiWeiEngine.calculateBureau('戊', '辰'), '土五局');

    // Test 8: 己年 命在申 -> 壬申 -> 剑锋金 -> 金四局
    assert.equal(ZiWeiEngine.calculateBureau('己', '申'), '金四局');

    // Test 9: 庚年 命在子 -> 戊子 -> 霹雳火 -> 火六局
    assert.equal(ZiWeiEngine.calculateBureau('庚', '子'), '火六局');

    // Test 10: 辛年 命在寅 -> 庚寅 -> 松柏木 -> 木三局
    assert.equal(ZiWeiEngine.calculateBureau('辛', '寅'), '木三局');

    // Test 11: 壬年 命在辰 -> 甲辰 -> 覆灯火 -> 火六局
    assert.equal(ZiWeiEngine.calculateBureau('壬', '辰'), '火六局');

    // Test 12: 癸年 命在卯 -> 乙卯 -> 大溪水 -> 水二局
    assert.equal(ZiWeiEngine.calculateBureau('癸', '卯'), '水二局');
  });

  test('Palace Heavenly Stems conform to Five Tigers Dun (五虎遁元十二宫干)', () => {
    const chart = ZiWeiEngine.generateChart(sampleProfile);
    // 1990 is 庚年 -> Five Tigers starts with 戊 at 寅
    // Expected: 寅:戊, 卯:己, 辰:庚, 巳:辛, 午:壬, 未:癸, 申:甲, 酉:乙, 戌:丙, 亥:丁, 子:戊, 丑:己
    const expectedStemByBranch = {
      寅: '戊', 卯: '己', 辰: '庚', 巳: '辛',
      午: '壬', 未: '癸', 申: '甲', 酉: '乙',
      戌: '丙', 亥: '丁', 子: '戊', 丑: '己',
    };

    assert.equal(chart.palaces.length, 12);
    for (const palace of chart.palaces) {
      assert.ok(palace.stem, `Palace ${palace.palaceName} (${palace.branch}) must have stem`);
      assert.equal(palace.stem, expectedStemByBranch[palace.branch]);
      assert.equal(palace.stemBranch, `${expectedStemByBranch[palace.branch]}${palace.branch}`);
    }

    // Life Palace is 子 -> 戊子 -> 火六局
    const lifePalace = chart.palaces.find(p => p.isLifePalace);
    assert.equal(lifePalace.branch, '子');
    assert.equal(lifePalace.stem, '戊');
    assert.equal(lifePalace.stemBranch, '戊子');
    assert.equal(chart.bureau, '火六局');
    assert.equal(chart.lifePalaceStemBranch, '戊子');
  });

  test('Zi Wei & Tian Fu stars are placed at correct palaces according to canonical formulas', () => {
    // 1. Check sampleProfile (1990-05-18 09:30:00 -> 庚午年 农历四月24 巳时, 命在子, 戊子火六局)
    // 24 / 6 = 4 rem 0 -> Zi Wei at 巳, Tian Fu at 亥
    const chart1 = ZiWeiEngine.generateChart(sampleProfile);
    const siPalace = chart1.palaces.find(p => p.branch === '巳');
    assert.ok(siPalace.stars.some(s => s.starName === '紫微'), 'Zi Wei must be placed at 巳 for Day 24 in 火六局');

    const haiPalace = chart1.palaces.find(p => p.branch === '亥');
    assert.ok(haiPalace.stars.some(s => s.starName === '天府'), 'Tian Fu must be placed at 亥 (symmetrical to 巳)');

    // 2. Check Ron Fatt (1985-11-20 12:00:00 -> 乙丑年 农历十月9日 午时, 命在巳, 辛巳金四局)
    // 9 / 4 = 2 rem 1 -> added 3 (odd) -> (9+3)/4 = 3 -> quotient 3 (辰) 逆3 -> 丑!
    // Tian Fu symmetrical to 丑 is 卯!
    const ronFattProfile = {
      name: 'Ron Fatt',
      gender: 'male',
      birthDate: '1985-11-20',
      birthTime: '12:00:00',
      birthTimePrecision: 'EXACT',
      timezone: 'Asia/Kuala_Lumpur',
      calendarType: 'gregorian',
    };
    const chart2 = ZiWeiEngine.generateChart(ronFattProfile);
    assert.equal(chart2.bureau, '金四局');
    assert.equal(chart2.lifePalaceBranch, '巳');
    assert.equal(chart2.lifePalaceStemBranch, '辛巳');

    const chouPalace = chart2.palaces.find(p => p.branch === '丑');
    assert.ok(chouPalace.stars.some(s => s.starName === '紫微'), 'Zi Wei must be placed at 丑 for Ron Fatt (金四局 初九)');

    const maoPalace = chart2.palaces.find(p => p.branch === '卯');
    assert.ok(maoPalace.stars.some(s => s.starName === '天府'), 'Tian Fu must be placed at 卯 for Ron Fatt');
  });
});
