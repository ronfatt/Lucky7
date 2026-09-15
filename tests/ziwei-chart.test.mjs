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
});
