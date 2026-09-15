# 紫微时空数字预测系统 (ZWTSP)
## Personal Number DNA Technical Specification
**Document**: `ZWTSP_PERSONAL_DNA.md`  
**Core Model**: 多维本命数理基因 (Personal Number DNA)

---

## 1. Concept & Formulation

The **Personal Number DNA (本命数字 DNA)** is the immutable metaphysical fingerprint derived from the user's birth data. It does not merely pick digits from the birth date string; instead, it synthesizes:
1. **Four Pillars (八字四柱)**: Year, month, day, and hour stems/branches.
2. **Five Elements Distribution (五行配比)**: Day Master affinity, dominant and weak elements.
3. **Life Palace (命宫) & Body Palace (身宫)**: Core astrological pillars and their earthly branches.
4. **14 Main Stars (十四主星)**: Elemental attributes and palace allocations.
5. **Birth-Year Four Transformations (生年四化)**: 禄, 权, 科, 忌 resonances.

---

## 2. Personal Relevance Score (0–9)

For every digit $d \in \{0, 1, 2, 3, 4, 5, 6, 7, 8, 9\}$, the **Personal Relevance Score** $R(d) \in [0, 100]$ is computed as:

$$
R(d) = \min\left(100, \max\left(0, B(d) + E(d) + P(d) + S(d) + T(d)\right)\right)
$$

Where:
- $B(d)$: Four Pillars Stem/Branch numerical resonance ($0-25$ points)
- $E(d)$: Five Elements compatibility with Day Master and birth chart ($0-25$ points)
- $P(d)$: Life Palace (命宫) and Body Palace (身宫) resonance ($0-20$ points)
- $S(d)$: 14 Main Stars placement affinity ($0-15$ points)
- $T(d)$: Four Transformations modifier (+15 for 化禄, +10 for 化权, +8 for 化科, -10 for 化忌)

---

## 3. Digit Hierarchy: Core, Support & Weak Numbers

1. **Core Numbers (核心母数)**:
   - The Top 3–5 digits ranked by Personal Relevance Score $R(d)$.
   - Represent the strongest resonance with the individual's natal chart.
2. **Support Numbers (辅助吉数)**:
   - The middle 3–4 ranked digits.
   - Represent secondary harmonious Qi flow.
3. **Weak Numbers (待润/避让数)**:
   - The lowest 2–3 ranked digits.
   - Often associated with clashes, 化忌, or deficient elements.
   - **Crucial Rule**: Weak numbers are never deleted; their complete score is preserved in the database.

---

## 4. Calculation Trace Example

For digit `7`:
- **Base Element**: Fire (火)
- **Day Master Resonance**: +18 (Supports natal wood/fire pattern)
- **Life Palace Resonance**: +14 (命宫居午，离火同气)
- **Star Resonance**: +15 (太阳星坐守官禄宫)
- **Four Transformations**: +10 (太阳化权推动)
- **Final Personal Relevance Score**: **87 / 100**
- **Classification**: Core Number (Rank 1)
