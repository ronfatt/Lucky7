# 紫微时空数字预测系统 (ZWTSP)
## Comprehensive System Architecture (Phases 1-3)
**Document**: `ZWTSP_ARCHITECTURE.md`  
**Current Milestone**: Phase 3 Completed (Personal Destiny & Daily Activation Engine)

---

## 1. System Layering

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  - App Router: /, /destiny, /today, /laboratory, /rules     │
│  - Admin: /admin/daily-debugger                             │
│  - Design: Obsidian & Champagne Gold, Glass Panels          │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│             Dynamic Daily Activation Layer (Phase 3)        │
│  - DailyDateEngine (Gregorian ↔ Lunar, 24 Solar Terms)      │
│  - DailyFiveElementEngine (Daily Qi Signature: Wood..Water) │
│  - DailyPalaceActivationEngine (12 Palaces status)          │
│  - DailyActivationEngine (0-9 Digits dynamic activation)    │
│  - OpportunityEngine (Model Opportunity Score 0-100)        │
│  - TimeWindowEngine (Primary, Secondary, Avoid windows)     │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│              Static Personal Destiny Layer (Phase 2)        │
│  - CalendarConversionEngine (1900-2100 astronomical tables) │
│  - FourPillarsEngine (Year, Month, Day, Hour Stems/Branches)│
│  - ZiWeiEngine (Life/Body Palaces, 14 Stars, Transformations)│
│  - PersonalNumberDNAEngine (Core Top 4, Support, Weak)      │
│  - Calculation Trace Generator (100% auditable derivation)  │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│              Foundational Metaphysics Layer (Phase 1)       │
│  - RuleEngine (Versioned dynamic rules, DB mappings)        │
│  - DigitFoundation (0-9 Elements, Yin/Yang, Luo Shu, He Tu)│
│  - NumberFeatureEngine (Digital root, sum, parity, repeats) │
│  - RetailerProvider abstraction                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Dynamic Activation Core Concept

$$
\text{Personal Number DNA (Static)} \times \text{Daily Time Signature (Dynamic)} = \text{Daily Personal Activation}
$$

1. **Natal Chart & DNA Immutability**: The user's birth chart and personal number DNA remain permanently unchanged.
2. **Dynamic Day Signature**: The current solar term, day/hour stem and branch, and monthly Qi dynamically shift the activation weights of the 12 Palaces, Stars, and digits 0–9.
3. **Auditability**: Every activated digit exposes a full, deterministic Calculation Trace.
