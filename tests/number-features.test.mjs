import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDigitalRoot,
  extractNumberFeatures,
} from '../lib/numerology/number-features.ts';

describe('ZWTSP Number Feature Engine Tests', () => {
  test('Digital root calculation conforms to canonical reduction (1-9 root)', () => {
    assert.equal(calculateDigitalRoot(0), 0);
    assert.equal(calculateDigitalRoot(9), 9);
    assert.equal(calculateDigitalRoot(18), 9);
    assert.equal(calculateDigitalRoot(27), 9);
    assert.equal(calculateDigitalRoot(23), 5); // 23 -> 2+3 = 5
    assert.equal(calculateDigitalRoot(21), 3); // 21 -> 2+1 = 3
    assert.equal(calculateDigitalRoot(14), 5); // 14 -> 1+4 = 5
  });

  test('Number feature extraction for canonical 4-digit code "5729"', () => {
    const feat = extractNumberFeatures('5729');

    // Digits: 5, 7, 2, 9
    assert.deepEqual(feat.rawDigits, [5, 7, 2, 9]);
    assert.equal(feat.length, 4);
    assert.equal(feat.digitSum, 23); // 5+7+2+9 = 23
    assert.equal(feat.digitalRoot, 5); // 2+3 = 5

    // Odd / Even: 5(O), 7(O), 2(E), 9(O) -> 3 odd, 1 even
    assert.equal(feat.oddCount, 3);
    assert.equal(feat.evenCount, 1);
    assert.equal(feat.oddEvenRatio, 0.75);

    // High / Low: 5(H), 7(H), 2(L), 9(H) -> 3 high, 1 low
    assert.equal(feat.highCount, 3);
    assert.equal(feat.lowCount, 1);

    // Elements: 5(Earth), 7(Fire), 2(Fire), 9(Metal)
    assert.equal(feat.elementDistribution.Fire, 2);
    assert.equal(feat.elementDistribution.Earth, 1);
    assert.equal(feat.elementDistribution.Metal, 1);
    assert.equal(feat.elementDistribution.Wood, 0);
    assert.equal(feat.elementDistribution.Water, 0);
    assert.equal(feat.dominantElement, 'Fire');

    // Tail pattern & Range
    assert.equal(feat.tailPattern, 9);
    assert.equal(feat.range, 7); // 9 - 2 = 7

    // He Tu pairs: 2 and 7 are in [5, 7, 2, 9] (2/7 为朋火)
    assert.ok(feat.heTuPairsFound.length > 0);
    const found27 = feat.heTuPairsFound.some(p => p.pair[0] === 2 && p.pair[1] === 7);
    assert.ok(found27, 'Must detect 2/7 He Tu pair in 5729');
  });

  test('Number feature extraction for repeated-digit code "7752"', () => {
    const feat = extractNumberFeatures('7752');
    assert.equal(feat.digitSum, 21); // 7+7+5+2 = 21
    assert.equal(feat.digitalRoot, 3); // 2+1 = 3
    assert.equal(feat.repeatedDigits[7], 2);
    assert.equal(feat.maxRepeatCount, 2);
  });

  test('Single digit input "7" handles gracefully', () => {
    const feat = extractNumberFeatures('7');
    assert.deepEqual(feat.rawDigits, [7]);
    assert.equal(feat.length, 1);
    assert.equal(feat.digitSum, 7);
    assert.equal(feat.digitalRoot, 7);
    assert.equal(feat.oddCount, 1);
    assert.equal(feat.evenCount, 0);
    assert.equal(feat.dominantElement, 'Fire');
  });
});
