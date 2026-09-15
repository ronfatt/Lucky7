# ZWTSP Phase 6 Number Synthesis Engine Specification (数理综合生成模型规范)

## 1. 0-9 单数字特征向量 (Digit Feature Vector)

每个数字 $d \in \{0, 1, \dots, 9\}$ 均对应一个多维气场特征向量：

$$\mathbf{v}(d) = [s_{\text{dna}}(d), s_{\text{daily}}(d), s_{\text{reality}}(d), s_{\text{dir}}(d), s_{\text{freq}}(d), s_{\text{pat}}(d), s_{\text{el}}(d)]$$

### 基础权重分配 (V1 Default)
- **Personal DNA ($w_1 = 0.20$)**：该数字在用户先天本命 DNA 中的综合得分。
- **Daily Activation ($w_2 = 0.20$)**：该数字在流日节气干支中的动态激活得分。
- **Reality Resonance ($w_3 = 0.20$)**：用户记录的有效现实信号对该数字的映射与共振分。
- **Direction Affinity ($w_4 = 0.10$)**：今日吉利方位在 $8 \times 10$ 空间共振矩阵中对该数字的加成。
- **Observation Frequency ($w_5 = 0.10$)**：统计周期内该数字出现的相对频次归一化得分。
- **Pattern Affinity ($w_6 = 0.10$)**：该数字在连号、重叠、对称等形态结构中的适配分。
- **Element Harmony ($w_7 = 0.10$)**：该数字五行与当日主导五行的生克契合度。

### 缺失特征自适应重归一化 (Missing Feature Re-normalization)
若某项数据未提供（如用户未记录现实信号，则 $s_{\text{reality}} = \text{NOT\_AVAILABLE}$）：
严禁将未录入项置为 0 分，必须使用剩余有效特征的权重之和进行重新归一化：

$$w_i' = \frac{w_i}{\sum_{j \in \text{Available}} w_j}, \quad S_{\text{digit}}(d) = \sum_{i \in \text{Available}} w_i' \cdot s_i(d)$$

---

## 2. 候选号码生成算法 (Candidate Generation)

以 4 位组合（`0000`–`9999`）为核心目标：
1. **数字分层**：
   - 根据 $S_{\text{digit}}(d)$ 从高到低将 10 个数字划分为：
     - **主干优势数 (Primary Digits)**：排名前 4 的数字（如 `[5, 7, 2, 9]`）。
     - **辅助协同数 (Secondary Digits)**：排名 5–7 的数字。
     - **次要弱势数 (Support/Weak Digits)**：排名 8–10 的数字。
2. **多模态候选池构建**：
   - **完全排列型 (Full Permutations)**：由主干数字构成的不同顺序排列（如 `5729`, `5279`, `7259`, `9275` 等）。
   - **重字型 (Repeated Combos)**：由主干数字中最高分与次高分组装的双重字（如 `5772`, `5572`, `5722` 等）。
   - **次选替换型 (Secondary Substituted)**：将主干中第四位替换为次选优势数字生成的补充候选。
3. **确定性与无随机性**：候选号码生成基于确定性排序与字典序排列规则，过程透明可完全复现。

---

## 3. 母码提取引擎 (Mother Code Engine)

**母码 (Mother Code)** 定义为当前模型特征在所有候选组合中取得最高综合分数的代表性序列。
- 母码是系统气场推演的“主干参照”，并非中奖承诺。
- 提取规则：
  $$\text{MotherCode} = \arg\max_{C \in \text{Candidates}} S_{\text{combo}}(C)$$
- 若第一名与第二名组合得分完全相同，按字典序较小者或与当日吉时地支数理更近者确定。

---

## 4. 变体衍生码引擎 (Variation Code Engine)

围绕母码生成具有特定拓扑结构的衍生组合，最多不超过 50 组：
1. **全排列衍生 (PERMUTATION)**：母码 4 位数字的各位置排列。
2. **逆序变体 (REVERSE)**：母码的首尾完全倒置（如 `5729` $\rightarrow$ `9275`）。
3. **镜像对称变体 (MIRROR)**：如 `1221` 等轴对称形式。
4. **循环轮转变体 (ROTATION)**：如 `5729` $\rightarrow$ `7295` $\rightarrow$ `2957` $\rightarrow$ `9572`。
5. **对位互换变体 (PAIR_SWAP)**：邻位或首尾互换（如 `5729` $\rightarrow$ `7529`）。
6. **生克五行替换变体 (DIGIT_SUBSTITUTION)**：将母码中最弱的一位替换为其河图同气伙伴数（如 5 替换为 0）。
