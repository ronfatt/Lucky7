# 紫微时空数字预测系统 (ZWTSP)
## Daily Dynamic Rules & Weight Formulations
**Document**: `ZWTSP_DAILY_RULES.md`  
**Version**: `DAILY-RULES-V1.0`

---

## 1. Daily Activation Scoring Formula

For any digit $d \in \{0, \dots, 9\}$:

$$
A(d) = 0.35 \cdot \text{BasePersonal}(d) + 0.20 \cdot \text{DailyElement}(d) + 0.15 \cdot \text{DailyTime}(d) + 0.15 \cdot \text{PalaceResonance}(d) + 0.15 \cdot \text{StarTransformation}(d)
$$

Where:
- $\text{BasePersonal}(d)$: From static `personal_number_dna`.
- $\text{DailyElement}(d)$: Score of digit $d$'s element in today's Five Element Signature.
- $\text{DailyTime}(d)$: Harmony with the day's Earthly Branch and Heavenly Stem.
- $\text{PalaceResonance}(d)$: Boost if digit $d$ belongs to an active palace (e.g. 财帛 +10, 迁移 +8, 福德 +6).
- $\text{StarTransformation}(d)$: Boost if digit $d$ is mapped to a star with active daily/natal transformation (化禄 +12, 化权 +8, 化科 +6, 化忌 -10).

---

## 2. Dynamic Palace Status Thresholds

For each of the 12 Palaces:
- `Score >= 85`: **VERY STRONG**
- `70 <= Score < 85`: **STRONG**
- `50 <= Score < 70`: **NORMAL**
- `30 <= Score < 50`: **WEAK**
- `Score < 30`: **LOW**

Top 3 active palaces are prioritized for the daily summary.
