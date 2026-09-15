# 紫微时空数字预测系统 (ZWTSP)
## Daily Time-Space Activation Engine Specification
**Document**: `ZWTSP_DAILY_ENGINE.md`  
**Standard**: Dynamic Daily Time Architecture (`DAILY-V1`)

---

## 1. Daily Temporal Decomposition

Every daily calculation resolves:
1. **Gregorian Date & Timezone**: Explicitly set from user profile or request, with system fallback.
2. **Lunar Date**: Year, Month, Day, and Leap Month status.
3. **Four Pillars (干支四柱)**: Year stem/branch, month stem/branch, day stem/branch, hour stem/branch.
4. **24 Solar Terms (二十四节气)**:
   - Astronomical determination of current solar term, start date, and end date.
   - Monthly stem/branch boundaries strictly adhere to the solar terms (e.g. 立春 sets the start of 寅月).
5. **Seasonal State & Monthly Qi**:
   - Spring (Wood), Summer (Fire), Autumn (Metal), Winter (Water), Four Seasons Month-End (Earth).

---

## 2. Daily Five Element Signature

Combining year, month, day, and solar term weights:
$$
S_{\text{element}} = (W_{\text{wood}}, W_{\text{fire}}, W_{\text{earth}}, W_{\text{metal}}, W_{\text{water}})
$$
Normalized to $0-100$. Identifies:
- Dominant Element (主导行)
- Secondary Element (相生行)
- Weak Element (休囚行)

---

## 3. Daily Opportunity Score & Levels

$$
\text{Opportunity Score} = 0.25 \cdot S_{\text{PersonalDNA}} + 0.20 \cdot S_{\text{TimeSignature}} + 0.20 \cdot S_{\text{FinancialPalace}} + 0.10 \cdot S_{\text{FortunePalace}} + 0.10 \cdot S_{\text{LifePalace}} + 0.05 \cdot S_{\text{MovementPalace}} + 0.10 \cdot S_{\text{Transformations}}
$$

### Level Classifications:
- `0–29`: **LOW** (低谷)
- `30–49`: **WEAK** (微弱) -> **Triggers warning if < 40**: *“今日不建议因本系统增加投注。”*
- `50–69`: **NORMAL** (平稳)
- `70–84`: **STRONG** (活跃)
- `85–100`: **VERY STRONG** (强盛)

---

## 4. Daily Time Windows

Calculated from the daily and hourly earthly branches:
1. **Primary Window (吉时)**: Hour whose branch element generates or supports the day's dominant element.
2. **Secondary Window (次选)**: Compatible partnership branch (六合 / 三合).
3. **Avoid Window (冲克)**: Opposite clash branch (六冲).
