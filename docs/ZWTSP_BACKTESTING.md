# ZWTSP Phase 6 Backtesting & Scientific Validation Specification (回测与科学检验规范)

## 1. 核心回测哲学：零前瞻偏差 (Zero Look-ahead Bias)

在回测历史任一开奖期次 $T$ 时：
1. **时间戳严格隔离**：系统模拟在 $T$ 开奖之前站在当前时点，仅允许使用在 $T$ 之前记录的历史开奖数据、现实信号与先天气象。
2. **严禁未来数据泄露**：任何在 $T$ 之后发生的事情（包括下一期开奖号码、未来的统计频率、未来的现实信号）均被 `AntiLookaheadGuard` 硬性拦截。

---

## 2. 命中评价指标分级 (Hit Definitions)

对于真实开奖号码 $A$ 与模型候选号码 $C$：
1. **完全精确命中 (EXACT_MATCH)**：4 位数字完全一致且顺序完全相同（$C_i = A_i, \forall i \in \{1,2,3,4\}$）。
2. **位置匹配 (POSITION_MATCH)**：统计在相同位置上数字相等的位数个数（$0 \sim 4$）。
3. **数字集合匹配 (DIGIT_SET_MATCH)**：不考虑位置顺序，两者的无序数字多重集合完全相同（如 `5729` 与 `5279` 为集合匹配）。
4. **部分数字命中 (PARTIAL_DIGIT_MATCH)**：命中数字个数（如中 1 字、中 2 字、中 3 字）。

---

## 3. 对照基准与消融实验 (Baselines & Ablation)

### 3.1 均匀随机基准 (Uniform Random Baseline)
- 采用固定种子的伪随机发生器（LCG），在 $0000 \sim 9999$ 空间中抽取对照候选。
- 作为检验模型是否优于盲猜的科学基线。若模型表现不及随机基准，系统界面必须明确展示提示：
  > *“当前复杂模型未显示稳定的历史增益。”*

### 3.2 消融实验矩阵 (Ablation Matrix)
系统支持隔离各维度的贡献度检验：
- **Model A**: 仅个人数字 DNA
- **Model B**: 仅流日激活
- **Model C**: 仅空间方位
- **Model D**: 仅现实信号
- **Model E**: DNA + 流日
- **Model Full**: 完整综合模型
