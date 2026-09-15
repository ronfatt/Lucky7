# 紫微时空数字预测系统 (ZWTSP)
## Direction Rules & Scoring Weights
**Document**: `ZWTSP_DIRECTION_RULES.md`  
**Version**: `DIRECTION-RULES-V1.0`

---

## 1. Rule Tables Definitions

### 1.1 `direction_bagua_rules`
- `N` $\to$ 坎 (☵), 水, 险陷归藏
- `NE` $\to$ 艮 (☶), 土, 止息蓄力
- `E` $\to$ 震 (☳), 木, 雷动生发
- `SE` $\to$ 巽 (☴), 木, 风行顺达
- `S` $\to$ 离 (☲), 火, 日月光华
- `SW` $\to$ 坤 (☷), 土, 厚德载物
- `W` $\to$ 兑 (☱), 金, 和悦喜庆
- `NW` $\to$ 乾 (☰), 金, 刚健首领

### 1.2 `direction_element_rules`
- North: Water
- Northeast: Earth
- East: Wood
- Southeast: Wood
- South: Fire
- Southwest: Earth
- West: Metal
- Northwest: Metal
- Center: Earth

---

## 2. Model Confidence Metric
Direction Confidence is derived from model separation:
- $\text{Separation} = \text{Top}_1 - \text{Average}(\text{Other 7})$:
  - If $\text{Separation} \ge 18$: **HIGH** (*“多个模型特征方向高度一致”*)
  - If $10 \le \text{Separation} < 18$: **MEDIUM**
  - If $\text{Separation} < 10$: **LOW**
*Strict Note*: Confidence is internal model agreement, never probability of winning.
