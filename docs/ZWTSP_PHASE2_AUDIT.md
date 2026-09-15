# 紫微时空数字预测系统 (ZWTSP)
## Phase 2 Architectural & Technical Audit
**Document**: `ZWTSP_PHASE2_AUDIT.md`  
**Focus**: Personal Destiny Foundation, Zi Wei Data Architecture & Personal Number DNA

---

## 1. Existing Architecture Inspection

### 1.1 Phase 1 Deliverables State
- **Rule Layer**: `lib/rules/rule-engine.ts` implements a dynamic versioned rule manager (`RuleEngine`). Fallback canonical mappings for 0–9 element, Yin/Yang polarity, He Tu pairs, and Luo Shu matrix are active.
- **Feature Layer**: `lib/numerology/digit-foundation.ts` and `lib/numerology/number-features.ts` extract comprehensive digit properties (digital root, sum, odd/even, high/low, elements, repeated digits, range).
- **Presentation Layer**: Obsidian and gold theme defined in `tailwind.config.ts` and `app/globals.css`. Navigation sidebar, header, Number Laboratory, and initial dashboard shell are fully operational.
- **Database Schema**: `supabase/migrations/20260913_zwtsp_core_schema.sql` defines core tables including `birth_profiles`, `destiny_charts`, `palaces`, `stars`, and `star_rules`.

### 1.2 Reusable Components
- `components/ui/Card.tsx`, `Badge.tsx`, `Button.tsx`: Ready for 12-palace cards and personal DNA visualizations.
- `lib/numerology/digit-foundation.ts`: Provides `ELEMENT_LABELS`, `DIRECTION_LABELS`, and `evaluateElementRelationship()`.

---

## 2. Phase 2 Scope & Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                      Birth Profile                          │
│  Date, Time, Timezone, Gender, Precision (EXACT/UNKNOWN)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Calendar Conversion Engine                 │
│  Gregorian ↔ Lunar, 1900-2100 astronomical tables           │
│  Four Pillars Ganzhi: Year, Month, Day, Hour                │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Zi Wei Dou Shu Engine                    │
│  1. Life Palace (命宫) & Body Palace (身宫)                 │
│  2. Five Elements Bureau (五行局: 水二局/木三局/金四局/土五局/火六局)│
│  3. 14 Main Stars placement (紫微星系 & 天府星系)            │
│  4. Birth-Year Four Transformations (甲廉破武阳...癸破巨阴贪) │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Personal Number DNA Engine                 │
│  Combine Four Pillars, 12 Palaces, Stars, Transformations    │
│  Output: 0-9 Personal Relevance Scores [0, 100]             │
│  Extract: Core Numbers (Top 3-5), Support Numbers, Weak     │
│  Audit: Full deterministic Calculation Trace                │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Boundary & Non-Functional Mandates
1. **Zero Randomness**: Given the same birth profile, the system must produce the exact same destiny chart, stars, and DNA scores.
2. **Missing Birth Hour Handling**: If birth time precision is `UNKNOWN`, the system will not invent a default hour (e.g. 12:00 or 00:00). Affected calculations will be flagged as `UNKNOWN / INCOMPLETE`.
3. **No Overlap with Later Phases**: Phase 2 deliberately excludes lottery number prediction, combinations, retailer maps, reality signals, and backtesting.
