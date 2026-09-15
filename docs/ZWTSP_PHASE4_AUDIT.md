# 紫微时空数字预测系统 (ZWTSP)
## Phase 4 Architectural & Technical Audit
**Document**: `ZWTSP_PHASE4_AUDIT.md`  
**Focus**: 「位」 Spatial Direction Layer & Personal Luck Compass

---

## 1. Existing System State (Phases 1-3)

- **Phase 1**: Rule Engine (`lib/rules/rule-engine.ts`), 0-9 Digit Foundation (`lib/numerology/digit-foundation.ts`), Number Feature Engine (`lib/numerology/number-features.ts`), and Number Laboratory (`components/laboratory/NumberLaboratory.tsx`).
- **Phase 2**: Calendar Conversion (`lib/engines/calendar/calendar-engine.ts`), Four Pillars (`lib/engines/four-pillars/four-pillars-engine.ts`), Zi Wei Chart (`lib/engines/ziwei/ziwei-engine.ts`), and Personal Number DNA (`lib/engines/personal-dna/personal-dna-engine.ts`).
- **Phase 3**: 24 Solar Terms (`lib/engines/calendar/solar-terms.ts`), Daily Time Signature, Daily Palace/Star Activation, and Daily Number Activation (`lib/engines/daily/daily-engine.ts`).

---

## 2. Phase 4 Spatial Layer Principles

```
┌────────────────────────────────────────────────────────┐
│                   Personal Destiny                     │
│  Birth Profile, Four Pillars, Zi Wei Chart, Number DNA │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              Personal Direction Profile                │
│  8 Directions: Compatibility Scores (0-100)            │
│  Weights: Element(30%), Number(20%), Life Palace(15%), │
│           Body(10%), LuoShu(10%), Bagua(10%), Struct(5%)│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│            Dynamic Daily Time Signature                │
│  Daily Element Qi, Activated Numbers, Active Palaces   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│               Daily Direction Engine                   │
│  Personal Compatibility (35%) + Daily Element (20%) +  │
│  Daily Number (15%) + Daily Palace (15%) +             │
│  Daily Time (10%) + Daily Stars (5%)                   │
│  = Final Direction Score (0-100)                       │
│  → Primary, Secondary, Support, Caution Directions    │
│  → Direction Consistency & Confidence (LOW/MED/HIGH)   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Strict Boundary Checklist
- [x] NO external Google Maps, Baidu Maps, or GPS location tracking.
- [x] NO retailer or point-of-sale recommendations.
- [x] NO lottery number predictions or combinations based on directions.
- [x] Static North-up compass orientation (North at 0°).
- [x] Pure deterministic calculations with zero randomness.
