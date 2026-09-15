# 紫微时空数字预测系统 (ZWTSP)
## Direction & Spatial Calculation Engine Specification
**Document**: `ZWTSP_DIRECTION_ENGINE.md`  
**Version**: `DIRECTION-V1.0`

---

## 1. Canonical Eight Directions & Azimuth Boundaries

Every direction is mapped onto a continuous 360° circle, centered on North ($0^\circ$). The sectors are defined as:

| Direction ID | Chinese Name | Bagua | Element | Azimuth Center | Sector Range | Luo Shu Number |
|:---|:---|:---|:---|:---|:---|:---|
| `N` | 正北 | 坎 | Water | $0^\circ$ | $337.5^\circ - 22.5^\circ$ | 1 |
| `NE` | 东北 | 艮 | Earth | $45^\circ$ | $22.5^\circ - 67.5^\circ$ | 8 |
| `E` | 正东 | 震 | Wood | $90^\circ$ | $67.5^\circ - 112.5^\circ$ | 3 |
| `SE` | 东南 | 巽 | Wood | $135^\circ$ | $112.5^\circ - 157.5^\circ$ | 4 |
| `S` | 正南 | 离 | Fire | $180^\circ$ | $157.5^\circ - 202.5^\circ$ | 9 |
| `SW` | 西南 | 坤 | Earth | $225^\circ$ | $202.5^\circ - 247.5^\circ$ | 2 |
| `W` | 正西 | 兑 | Metal | $270^\circ$ | $247.5^\circ - 292.5^\circ$ | 7 |
| `NW` | 西北 | 乾 | Metal | $315^\circ$ | $292.5^\circ - 337.5^\circ$ | 6 |
| `Center` | 中宫 | 中 | Earth | N/A | Center | 5 |

---

## 2. Personal Direction Engine Formula

For each direction $k \in \{\text{N, NE, E, SE, S, SW, W, NW}\}$:

$$
S_{\text{personal}}(k) = 0.30 \cdot F_{\text{element}}(k) + 0.20 \cdot F_{\text{number}}(k) + 0.15 \cdot F_{\text{life}}(k) + 0.10 \cdot F_{\text{body}}(k) + 0.10 \cdot F_{\text{luoshu}}(k) + 0.10 \cdot F_{\text{bagua}}(k) + 0.05 \cdot F_{\text{struct}}(k)
$$

Where all sub-features $F(k) \in [0, 100]$.

---

## 3. Daily Direction Engine Formula

$$
S_{\text{daily}}(k) = 0.35 \cdot S_{\text{personal}}(k) + 0.20 \cdot D_{\text{element}}(k) + 0.15 \cdot D_{\text{number}}(k) + 0.15 \cdot D_{\text{palace}}(k) + 0.10 \cdot D_{\text{time}}(k) + 0.05 \cdot D_{\text{stars}}(k)
$$

Normalized to $[0, 100]$.
- **Contested Direction Condition**: If $|\text{Top}_1 - \text{Top}_2| \le 2.0$, mark as `DIRECTION_CONTESTED` (*“今日方向信号接近”*).
- **Direction Status Levels**:
  - `0–29`: **LOW**
  - `30–49`: **WEAK**
  - `50–69`: **NORMAL**
  - `70–84`: **STRONG**
  - `85–100`: **VERY STRONG**
