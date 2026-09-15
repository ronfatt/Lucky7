# 紫微时空数字预测系统 (ZWTSP V1.0)
## System Architecture & Product Specification
**Project Code**: `ZWTSP`  
**Core Methodology**: 时 · 位 · 象 · 数 · 行 · 验 (Time · Position · Sign · Number · Action · Validation)

---

## 1. Product Philosophy & Compliance Mandate

### 1.1 Non-Gambling & Responsible Participation
- **Explicit Principle**: The ZWTSP platform is a personal traditional-metaphysics, numerology, historical-statistics, and walk-forward backtesting decision-support system.
- **Strict Compliance**: The system **never claims or implies** that it can guarantee winning, calculate supernatural certainties, or mathematically alter the true independent probability of any random lottery draw.
- **Model vs. Probability**: All internal metrics (e.g., "Opportunity Score", "Model Consistency", "Fusion Score") represent multi-variable metaphysical & statistical model alignments on a scale of 0–100, **never** true winning probabilities.
- **Loss Chasing & Budget Protection**: If a user hits their self-configured daily or monthly limit, or if the daily opportunity score is below 40, the system displays prominent guidance:
  > *“今日不建议因本系统增加投注。”*
  Under no circumstances will the system say "再买一次" or "下一期一定回本".

### 1.2 The "时 · 位 · 象 · 数 · 行 · 验" Operational Loop
1. **时 (Time)**: Solar/lunar calendar, four pillars (BaZi), solar terms, hourly branches, element cycles.
2. **位 (Position)**: 8 directions (N, NE, E, SE, S, SW, W, NW), 360-degree compass azimuth, spatial Qi flow.
3. **象 (Sign)**: Zi Wei 12 Palaces, 14 Main Stars, Four Transformations (禄/权/科/忌), observed reality signals (license plates, receipts, timestamps).
4. **数 (Number)**: 0–9 fundamental elements, Yin/Yang polarity, He Tu pairs, Luo Shu 9-palace coordinate matrix.
5. **行 (Action)**: Cultural rituals, attire colors, mindset stabilization, timing discipline, voluntary 13% sharing pledge.
6. **验 (Validation)**: Immutable locked predictions, walk-forward out-of-sample backtesting, benchmarked against a true random baseline.

---

## 2. Core Functional Modules

```
                    ┌────────────────────────────┐
                    │      Personal Profile      │
                    │ (Birth Time/Place/Gender)  │
                    └─────────────┬──────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │   Personal Number DNA      │
                    │ (12 Palaces, Stars, BaZi)  │
                    └─────────────┬──────────────┘
                                  │
    ┌─────────────────────────────┼─────────────────────────────┐
    │                             │                             │
┌───▼────────────┐        ┌───────▼───────┐             ┌───────▼───────┐
│ Daily Time     │        │ Reality Sign  │             │ Historical    │
│ Engine (时/气) │        │ Engine (观象) │             │ Data Engine   │
└───┬────────────┘        └───────┬───────┘             └───────┬───────┘
    │                             │                             │
    └─────────────────────────────┼─────────────────────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │   Fusion Scoring Engine    │
                    │  (9 Weighted Components)   │
                    └─────────────┬──────────────┘
                                  │
    ┌─────────────────────────────┼─────────────────────────────┐
    │                             │                             │
┌───▼────────────┐        ┌───────▼───────┐             ┌───────▼───────┐
│ Number Pool    │        │ Mother/Branch │             │ Walk-Forward  │
│ Top 20/10/5    │        │ Codes Engine  │             │ Backtest Hub  │
└───┬────────────┘        └───────┬───────┘             └───────┬───────┘
    │                             │                             │
    └─────────────────────────────┴─────────────────────────────┘
```

### 2.1 User Profile & Personal Number DNA
- Input: Name, gender, Gregorian/Lunar birth date, birth hour/minute, birth place, timezone.
- Sensitive storage: Encrypted birth information, never exposed publicly.
- Number DNA Extraction:
  - Core Numbers (命宫主星与五行归藏)
  - Support Numbers (三方四正与化禄/化权)
  - Weak Numbers (化忌与相克宫位)
  - Five Element Ratio (木、火、土、金、水占比)

### 2.2 Digital Foundation (0–9)
- **Default Element Mapping**:
  - `0`: Earth (土)
  - `1`: Water (水)
  - `2`: Fire (火)
  - `3`: Wood (木)
  - `4`: Metal (金)
  - `5`: Earth (土)
  - `6`: Water (水)
  - `7`: Fire (火)
  - `8`: Wood (木)
  - `9`: Metal (金)
  - *Note*: Fully database-configured and versioned via `numerology_rules`.
- **Yin/Yang Polarity**:
  - Odd (`1, 3, 5, 7, 9`): Yang (阳)
  - Even (`0, 2, 4, 6, 8`): Yin (阴)
- **He Tu (河图) Generation**:
  - `1/6` 共宗水, `2/7` 同道火, `3/8` 为朋木, `4/9` 为友金, `5/0` (10->0) 同途土.
- **Luo Shu (洛书) 9-Palace Matrix**:
  ```
  4 (SE / 巽)   9 (S / 离)    2 (SW / 坤)
  3 (E / 震)    5 (Center)    7 (W / 兑)
  8 (NE / 艮)   1 (N / 坎)    6 (NW / 乾)
  ```

### 2.3 Reality Signal Engine (今日观象取数)
- Captures spontaneously observed numbers (license plates, invoice numbers, prices, timestamps).
- Decomposes inputs into digital roots, element occurrences, Luo Shu resonance, and frequency bursts.
- Produces an internal model feature: `reality_score` (0–100).

### 2.4 Retailer & Map Module (Provider Abstraction)
- Implements `RetailerProvider` interface:
  - `searchNearby(lat, lng, radius)`
  - `searchByDirection(bearing, radius)`
  - `calculateBearing(origin, destination)`
- Zero vendor lock-in (supports OpenStreetMap, Mapbox, Google Maps, or offline mocks).
- User privacy: GPS coordinates are never permanently persisted.

### 2.5 Fusion Scoring & Opportunity Window
- 9 Independent Feature Dimensions (Total 100%):
  1. Personal Destiny (15%)
  2. Time / BaZi (15%)
  3. Zi Wei Stars (10%)
  4. Four Transformations (5%)
  5. Five Elements (10%)
  6. He Tu / Luo Shu (10%)
  7. Reality Signal (5%)
  8. Historical Statistics (20%)
  9. Number Structure (10%)
- Normalized Score: 0–100 (non-negative).
- Opportunity Levels:
  - `0–29`: LOW (极低)
  - `30–49`: WEAK (微弱) -> **Warning triggers if < 40**
  - `50–69`: NORMAL (平稳)
  - `70–84`: STRONG (活跃)
  - `85–100`: VERY STRONG (极强)

### 2.6 Backtesting Engine & Anti-Bias Verification
- Strict **Walk-Forward Validation**: Model evaluates draw $N$ using only data strictly strictly prior to $N$ ($t < t_N$).
- **Prediction Locking**: Immutable snapshot timestamped at `locked_at`.
- **Benchmark Against Random Baseline**: If historical hit rate $\le$ random benchmark, alert:
  > *“当前模型未显示稳定的超随机优势。”*
- Anti-bias monitors: Look-ahead bias, data leakage, sample size warning ($N < 100$).

---

## 3. Tech Stack & Infrastructure

- **Framework**: Next.js 14+ (App Router, Server Components & Actions)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, Lucide React, Custom Obsidian & Champagne Gold Glass Theme
- **Database**: Supabase PostgreSQL + Row Level Security (RLS)
- **Data Visualization**: Recharts (Responsive charts, radar distribution)
- **Validation**: Zod schema validation on all inputs
