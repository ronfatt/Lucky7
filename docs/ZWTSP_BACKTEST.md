# 紫微时空数字预测系统 (ZWTSP)
## Walk-Forward Backtesting & Anti-Bias Verification Protocol
**Document**: `ZWTSP_BACKTEST.md`  
**Standard**: Strict Out-of-Sample Walk-Forward Validation & Independent Random Baseline

---

## 1. Backtesting Philosophy: Absolute Scientific Rigor

1. **Zero Information Leakage**: For any draw occurring at time $T_{\text{draw}}$, the calculation engine is strictly forbidden from accessing any draw record, statistical summary, or parameter updated at or after $T_{\text{draw}}$.
2. **Deterministic Locking**: Once a prediction snapshot is calculated, its `locked_at` timestamp is permanently committed. An update to locked rows in production triggers an immutability violation.
3. **Random Baseline Benchmark**: A mathematical model is only meaningful if it can be demonstrated against a simulated uniform random selection over the identical sample window.
4. **Decoupling from Financial ROI**: Backtest metrics track purely mathematical hit rate, rank, precision, and coverage. They must never be portrayed as guaranteed financial investment returns.

---

## 2. Walk-Forward Testing Protocol

Let historical draws be indexed chronologically: $D = \{d_1, d_2, \dots, d_N\}$ where $t(d_1) < t(d_2) < \dots < t(d_N)$.

```
Step 1: Train/Calibrate on [d_1 ... d_k] (Window W)
Step 2: Predict d_{k+1} using strictly {d_1 ... d_k}
Step 3: Lock prediction P_{k+1}
Step 4: Reveal actual draw d_{k+1} and evaluate matches
Step 5: Slide window to [d_2 ... d_{k+1}] and repeat for d_{k+2}
```

### 2.1 Evaluation Windows
- Micro Window: Last 10, 30, 50 draws
- Standard Window: Last 100, 300 draws
- Long-Horizon Window: Last 500, 1000 draws

---

## 3. Mandatory Anti-Bias Monitors

The system features real-time automated detection of statistical artifacts:

### 3.1 Look-Ahead Bias (未来数据泄露)
- **Check**: $\max(\{t_{\text{historical\_used}}\}) < t_{\text{prediction\_target}}$.
- If violated: The backtest is marked as **INVALID** (`has_lookahead_bias = true`), and results are rejected from the analytics dashboard.

### 3.2 Small Sample Size Warning
- If sample size $N < 100$:
  > **警告**: *“样本量不足（N < 100），当前统计结论不稳定，请勿作为主要参考。”*

### 3.3 Random Baseline & Outperformance Threshold
For a lottery format with digit domain $\mathcal{D} = \{0,\dots,9\}$ and $k$ selections:
- Uniform Random Expected Hit Rate:
  $$
  P_{\text{random}} = \frac{k}{|\mathcal{D}|}
  $$
- Example for Top 5 digits: $P_{\text{random}}(\text{Top 5}) = \frac{5}{10} = 50\%$.
- Example for Top 2 digits: $P_{\text{random}}(\text{Top 2}) = \frac{2}{10} = 20\%$.

**Mandatory System Guard**:
If $\text{HitRate}_{\text{model}} \le P_{\text{random}} + \epsilon$ (where $\epsilon$ is the 95% confidence interval margin):
The interface **must** display:
> ⚠️ **“当前模型未显示稳定的超随机优势。”**

---

## 4. Backtest Metrics Specification

1. **Top-K Hit Rate ($H_k$)**:
   $$
   H_k = \frac{\sum_{i=1}^N \mathbf{1}(\text{actual}_i \cap \text{TopK}_i \ne \emptyset)}{N}
   $$
2. **Mean Reciprocal Rank (MRR)**:
   $$
   \text{MRR} = \frac{1}{N} \sum_{i=1}^N \frac{1}{\text{rank}(\text{actual}_i)}
   $$
3. **Coverage Ratio**: Proportion of unique digits in actual draws covered by the predicted pool.
4. **Model Consistency vs. Accuracy Correlation**: Pearson correlation between daily `model_consistency` score and actual hit incidence.
