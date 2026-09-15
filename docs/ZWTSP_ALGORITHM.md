# 紫微时空数字预测系统 (ZWTSP)
## Algorithmic & Metaphysical Formulation Specification
**Document**: `ZWTSP_ALGORITHM.md`  
**Core Framework**: 象数合一 · 多维赋权 · 模型融合

---

## 1. Foundational Numerology Formulas

### 1.1 Digital Element Mapping (五行归藏)
For any digit $d \in \{0, 1, 2, 3, 4, 5, 6, 7, 8, 9\}$:
$$
\text{Element}(d) = 
\begin{cases}
\text{Earth (土)}, & d \in \{0, 5\} \\
\text{Water (水)}, & d \in \{1, 6\} \\
\text{Fire (火)},  & d \in \{2, 7\} \\
\text{Wood (木)},  & d \in \{3, 8\} \\
\text{Metal (金)}, & d \in \{4, 9\}
\end{cases}
$$
*Rule Store*: `numerology_rules` table where `rule_type = 'digit_element'`.

### 1.2 Yin / Yang Polarity
$$
\text{Polarity}(d) = 
\begin{cases}
\text{Yang (阳)}, & d \pmod 2 = 1 \quad (1, 3, 5, 7, 9) \\
\text{Yin (阴)},  & d \pmod 2 = 0 \quad (0, 2, 4, 6, 8)
\end{cases}
$$

### 1.3 Luo Shu (洛书) 9-Palace Coordinate System
The 3x3 Magic Square where every row, column, and diagonal sums to 15:
$$
\begin{pmatrix}
4 & 9 & 2 \\
3 & 5 & 7 \\
8 & 1 & 6
\end{pmatrix}
$$
Spatial Coordinate Mapping:
- Digit `4`: Row 0, Col 0, Southeast (巽宫), Wood
- Digit `9`: Row 0, Col 1, South (离宫), Fire
- Digit `2`: Row 0, Col 2, Southwest (坤宫), Earth
- Digit `3`: Row 1, Col 0, East (震宫), Wood
- Digit `5`: Row 1, Col 1, Center (中宫), Earth
- Digit `7`: Row 1, Col 2, West (兑宫), Metal
- Digit `8`: Row 2, Col 0, Northeast (艮宫), Earth
- Digit `1`: Row 2, Col 1, North (坎宫), Water
- Digit `6`: Row 2, Col 2, Northwest (乾宫), Metal
- Digit `0`: Resides at Center (Earth / Void), pairing with 5.

### 1.4 He Tu (河图) Generator Pairs
- Water pair: $(1, 6)$ - "天一生水，地六成之"
- Fire pair: $(2, 7)$ - "地二生火，天七成之"
- Wood pair: $(3, 8)$ - "天三生木，地八成之"
- Metal pair: $(4, 9)$ - "地四生金，天九成之"
- Earth pair: $(5, 0)$ - Configurable $10 \to 0$: "天五生土，地十成之"

### 1.5 Digital Root & Digit Sum
For any integer sequence $S = (d_1, d_2, \dots, d_k)$:
$$
\text{DigitSum}(S) = \sum_{i=1}^k d_i
$$
$$
\text{DigitalRoot}(S) = 
\begin{cases}
0, & \text{if } \text{DigitSum}(S) = 0 \\
9, & \text{if } \text{DigitSum}(S) \pmod 9 = 0 \land \text{DigitSum}(S) > 0 \\
\text{DigitSum}(S) \pmod 9, & \text{otherwise}
\end{cases}
$$

---

## 2. Five Element Compatibility Function

Let Elements be denoted by $\mathcal{E} = \{\text{Wood}, \text{Fire}, \text{Earth}, \text{Metal}, \text{Water}\}$.
Generating cycle: Wood $\to$ Fire $\to$ Earth $\to$ Metal $\to$ Water $\to$ Wood.
Overcoming cycle: Wood $\to$ Earth $\to$ Water $\to$ Fire $\to$ Metal $\to$ Wood.

Let compatibility score $C(E_a, E_b) \in [0, 100]$:
- Same Element ($E_a = E_b$): $85$ (比和)
- $E_a$ generates $E_b$ or $E_b$ generates $E_a$: $100$ (相生)
- $E_a$ overcomes $E_b$: $40$ (我克)
- $E_b$ overcomes $E_a$: $25$ (克我 / 受克)

---

## 3. Fusion Scoring Engine

For each candidate digit $d \in \{0, \dots, 9\}$, the Final Composite Score $F(d)$ is computed as a weighted sum of 9 distinct, non-negative feature scores:

$$
F(d) = \sum_{m=1}^{9} w_m \cdot S_m(d)
$$

Where weights $w_m \ge 0$ and $\sum_{m=1}^{9} w_m = 1.0$:

| Index $m$ | Dimension | Config Key | Default Weight $w_m$ | Feature Scope |
|:---|:---|:---|:---|:---|
| 1 | Personal Destiny | `weight_destiny` | 0.15 (15%) | Ming/Shen palace resonance with digit $d$ |
| 2 | Time / BaZi | `weight_bazi` | 0.15 (15%) | Daily Ganzhi & Shichen element affinity |
| 3 | Zi Wei Stars | `weight_stars` | 0.10 (10%) | Active main star element and number rules |
| 4 | Four Transformations | `weight_transformations` | 0.05 (5%) | 禄 (+15), 权 (+10), 科 (+8), 忌 (-10) modifiers |
| 5 | Five Elements | `weight_elements` | 0.10 (10%) | Harmony with dominant daily solar term Qi |
| 6 | He Tu / Luo Shu | `weight_luoshu` | 0.10 (10%) | Central / directional alignment in 9-palace matrix |
| 7 | Reality Signal | `weight_reality` | 0.05 (5%) | Frequency & resonance in user-observed inputs |
| 8 | Historical Statistics | `weight_historical` | 0.20 (20%) | Gap, cold/hot variance, frequency over window $W$ |
| 9 | Number Structure | `weight_structure` | 0.10 (10%) | Balance of parity (odd/even) and digital root |

### Score Normalization & Constraints:
- Every sub-score $S_m(d) \in [0, 100]$.
- Total score is bounded strictly: $F(d) = \min(100, \max(0, F(d)))$.
- Negative scores are strictly disallowed.

---

## 4. Model Consistency Score (模型一致性)

**Principle**: Model Consistency measures the degree of mathematical agreement among independent sub-models. It is strictly **NOT** a probability of winning.

Let $V = (S_1(d), S_2(d), \dots, S_9(d))$ be the vector of component scores.
Let standard deviation across components be $\sigma_d$.
$$
\text{Consistency}(d) = \max\left(0, 100 - 2 \cdot \sigma_d\right)
$$
Overall system consistency for top candidates:
$$
\text{SystemConsistency} = \frac{1}{|K|} \sum_{d \in K} \text{Consistency}(d)
$$

---

## 5. Mother Code & Variation Code Engine

### 5.1 Mother Code Selection
The **Mother Code** (核心母码) is synthesized from the top-ranked individual digits $\{d_{(1)}, d_{(2)}, \dots\}$ arranged according to:
1. Spatial Luo Shu flow (from Center/Sun to auxiliary palaces).
2. Five Element generating sequence (e.g. Water $\to$ Wood $\to$ Fire $\to$ Earth).

### 5.2 Variation Code Generator
Variations are derived deterministically using:
- **He Tu Inversion**: Substitute digit $d$ with its complementary partner $d' = (d + 5) \pmod{10}$.
- **Polarity Flip**: Pair with adjacent Yin/Yang mirror.
- **Permutation Filter**: Only output top 4 structurally sound variations (e.g., 4 variations for a 4-digit code).
- Combinations exceeding configured thresholds are safely pruned to avoid permutation explosion.
