# 紫微时空数字预测系统 (ZWTSP)
## Phase 3 Architectural & Technical Audit
**Document**: `ZWTSP_PHASE3_AUDIT.md`  
**Focus**: Daily Time-Space Activation Engine & Dynamic Scoring Layer

---

## 1. Static vs. Dynamic Separation Mandate

The fundamental design principle of Phase 3 is the strict architectural decoupling between:
1. **Static Personal Data (Natal / Innate)**:
   - Birth Profile, Natal Four Pillars, Natal Zi Wei 12-palace Chart, Personal Number DNA.
   - **Rule**: Never modified or mutated during daily computations.
2. **Dynamic Daily Data (Temporal / Flowing)**:
   - Current Date, Daily Four Pillars, Solar Term, Seasonal Qi, Daily Palace Activation, Daily Star Activation, Daily Number Activation, Opportunity Score.
   - **Rule**: Recalculated dynamically based on the current time signature and cached deterministically per day.

---

## 2. Dynamic Activation Equation

$$
\text{Daily Personal Activation} = \text{Personal Number DNA (Static)} \times \text{Daily Time Signature (Dynamic)}
$$

For each digit $d \in \{0, \dots, 9\}$:
$$
S_{\text{activation}}(d) = w_{\text{base}} \cdot S_{\text{personal}}(d) + w_{\text{element}} \cdot S_{\text{element}}(d) + w_{\text{time}} \cdot S_{\text{time}}(d) + w_{\text{palace}} \cdot S_{\text{palace}}(d) + w_{\text{star}} \cdot S_{\text{star}}(d) + w_{\text{trans}} \cdot S_{\text{trans}}(d)
$$
All normalized strictly to $[0, 100]$.

---

## 3. Scope Boundaries & Anti-Gambling Guards
- **Strictly Prohibited in Phase 3**: Lottery predictions, Top 20/10/5 combinations, Mother/Variation codes, Retailer search, Maps, Reality Signal input, Backtesting.
- **Model Opportunity Score Guard**: Explicitly classified as a traditional metaphysical and statistical model index, **never** a winning probability. If below 40, displays:
  > *“今日模型状态偏低，建议保持观察，不因系统增加投注。”*
- **Audit Trace**: Every activated digit $0-9$ must expose a transparent calculation trace (`Personal Base -> Element -> Palace -> Star -> Transform -> Final Activation`).
