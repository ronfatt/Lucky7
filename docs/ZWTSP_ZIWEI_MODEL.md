# 紫微时空数字预测系统 (ZWTSP)
## Zi Wei Dou Shu & Astrological Model Specification
**Document**: `ZWTSP_ZIWEI_MODEL.md`  
**Standard**: Classical Zi Wei Dou Shu Calculation Engine (`ZW-TRADITIONAL-V1`)

---

## 1. 12 Palaces Coordinate Architecture

The traditional 12 Palaces are mapped onto the 12 Earthly Branches on a standard rectangular grid:
- **Top Row (Row 0)**: 巳 (Si, Col 0), 午 (Wu, Col 1), 未 (Wei, Col 2), 申 (Shen, Col 3)
- **Right Edge**: 酉 (You, Row 1, Col 3), 戌 (Xu, Row 2, Col 3)
- **Bottom Row (Row 3)**: 亥 (Hai, Col 3), 子 (Zi, Col 2), 丑 (Chou, Col 1), 寅 (Yin, Col 0)
- **Left Edge**: 卯 (Mao, Row 2, Col 0), 辰 (Chen, Row 1, Col 0)

### Palace Order Counter-Clockwise:
1. 命宫 (Life)
2. 兄弟宫 (Siblings)
3. 夫妻宫 (Spouse)
4. 子女宫 (Children)
5. 财帛宫 (Wealth)
6. 疾厄宫 (Health)
7. 迁移宫 (Travel)
8. 仆役宫 / 交友宫 (Friends)
9. 官禄宫 (Career)
10. 田宅宫 (Property)
11. 福德宫 (Karma / Fortune)
12. 父母宫 (Parents)

---

## 2. Life Palace & Body Palace Calculation

Starting from the 寅 (Yin) palace index (0):
1. **Lunar Month Offset**: Count clockwise by (Lunar Month - 1).
2. **Life Palace (命宫)**: From the month palace, count counter-clockwise by (Birth Hour Branch Index - 1).
3. **Body Palace (身宫)**: From the month palace, count clockwise by (Birth Hour Branch Index - 1).

*Note*: If birth hour is `UNKNOWN`, Life Palace and Body Palace cannot be calculated and are marked as `UNKNOWN / INCOMPLETE`.

---

## 3. Five Elements Bureau (五行局)

Determined by the Heavenly Stem of the Birth Year and the Earthly Branch of the 命宫, using the 60 Jiazi NaYin (六十甲子纳音):
- 水二局 (Water 2)
- 木三局 (Wood 3)
- 金四局 (Metal 4)
- 土五局 (Earth 5)
- 火六局 (Fire 6)

---

## 4. Fourteen Main Stars Placement

1. **Northern Stars (紫微星系)**:
   - Position of 紫微 calculated via Lunar Day / Bureau formula.
   - Placed counter-clockwise: 紫微 $\to$ 天机 $\to$ (skip 1) $\to$ 太阳 $\to$ 武曲 $\to$ 天同 $\to$ (skip 2) $\to$ 廉贞.
2. **Southern Stars (天府星系)**:
   - 天府 placed in the symmetry axis of 寅-申.
   - Placed clockwise: 天府 $\to$ 太阴 $\to$ 贪狼 $\to$ 巨门 $\to$ 天相 $\to$ 天梁 $\to$ 七杀 $\to$ (skip 3) $\to$ 破军.

---

## 5. Birth-Year Four Transformations (生年四化)

Determined strictly by the Heavenly Stem of the Birth Year:

| Year Stem | 化禄 (Lu) | 化权 (Quan) | 化科 (Ke) | 化忌 (Ji) | Mnemonic |
|:---|:---|:---|:---|:---|:---|
| 甲 (Jia) | 廉贞 | 破军 | 武曲 | 太阳 | 甲廉破武阳 |
| 乙 (Yi) | 天机 | 天梁 | 紫微 | 太阴 | 乙机梁紫阴 |
| 丙 (Bing) | 天同 | 天机 | 文昌 | 廉贞 | 丙同机昌廉 |
| 丁 (Ding) | 太阴 | 天同 | 天机 | 巨门 | 丁阴同机巨 |
| 戊 (Wu) | 贪狼 | 太阴 | 右弼 | 天机 | 戊贪阴右机 |
| 己 (Ji) | 武曲 | 贪狼 | 天梁 | 文曲 | 己武贪梁曲 |
| 庚 (Geng) | 太阳 | 武曲 | 太阴 | 天同 | 庚阳武阴同 |
| 辛 (Xin) | 巨门 | 太阳 | 文曲 | 文昌 | 辛巨阳曲昌 |
| 壬 (Ren) | 天梁 | 紫微 | 左辅 | 武曲 | 壬梁紫府武 |
| 癸 (Gui) | 破军 | 巨门 | 太阴 | 贪狼 | 癸破巨阴贪 |
