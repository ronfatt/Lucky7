# 紫微时空数字预测系统 (ZWTSP)
## Database Architecture & Schema Specification
**Document**: `ZWTSP_DATABASE.md`  
**Database**: Supabase PostgreSQL 15+

---

## 1. Architectural Principles

1. **UUID Primary Keys**: Every table uses `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
2. **Deterministic Auditability**: Every table has `created_at TIMESTAMPTZ DEFAULT now()` and `updated_at TIMESTAMPTZ DEFAULT now()`.
3. **Immutability of Predictions & Backtests**: Rows in `predictions` and `backtest_results` are sealed after calculation. An update to a locked row triggers an error or requires an explicit version bump.
4. **Row Level Security (RLS)**:
   - Users have access **only** to their own rows (`auth.uid() = user_id`).
   - Admins (`app_metadata ->> 'role' = 'admin'`) can inspect and mutate rules, versions, and system logs.
5. **No Hard-Coded Metaphysics**: All element correlations, star properties, palace weights, and Luo Shu mappings reside in tables (`numerology_rules`, `palaces`, `stars`, `star_rules`).

---

## 2. Entity-Relationship Model Overview

```
                      ┌──────────────────────┐
                      │        users         │
                      └──────────┬───────────┘
                                 │ 1:1
                      ┌──────────▼───────────┐
                      │    birth_profiles    │
                      └──────────┬───────────┘
                                 │ 1:1
                      ┌──────────▼───────────┐
                      │    destiny_charts    │
                      └──────────┬───────────┘
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     │ 1:N                       │ 1:N                       │ 1:N
┌────▼──────────────┐   ┌────────▼──────────┐   ┌────────────▼────────────┐
│  reality_signals  │   │    predictions    │   │  user_budget_settings   │
└───────────────────┘   └────────┬──────────┘   └─────────────────────────┘
                                 │ 1:N
                        ┌────────▼──────────┐
                        │ prediction_numbers│
                        └───────────────────┘

Global Engine & System Tables:
- numerology_rules       - palaces              - stars
- star_rules             - four_transformations - algorithm_versions
- weight_configs         - daily_signatures     - time_signatures
- direction_scores       - historical_draws     - number_features
- backtests              - backtest_results     - ritual_templates
- system_logs
```

---

## 3. Detailed Table Definitions

### 3.1 User & Identity Domain
- `users`: Extends `auth.users`, records user status and role (`user`, `admin`).
- `birth_profiles`: Sensitive user birth records. Fields:
  - `id UUID PRIMARY KEY`, `user_id UUID REFERENCES users(id) ON DELETE CASCADE`
  - `name TEXT`, `gender TEXT CHECK (gender IN ('male', 'female', 'other'))`
  - `birth_date DATE NOT NULL`, `birth_time TIME`, `birth_place TEXT`, `timezone TEXT DEFAULT 'Asia/Shanghai'`
  - `calendar_type TEXT CHECK (calendar_type IN ('gregorian', 'lunar'))`
  - `is_birth_time_known BOOLEAN DEFAULT true`
  - `created_at`, `updated_at`
- `destiny_charts`: Pre-calculated astrological snapshot.
  - `id UUID PRIMARY KEY`, `user_id UUID REFERENCES users(id)`
  - `ming_palace TEXT`, `shen_palace TEXT`, `wuxing_ju TEXT` (e.g. 水二局, 木三局)
  - `bazi_year TEXT`, `bazi_month TEXT`, `bazi_day TEXT`, `bazi_hour TEXT`
  - `dna_core_numbers INT[]`, `dna_support_numbers INT[]`, `dna_weak_numbers INT[]`
  - `created_at`, `updated_at`

### 3.2 Metaphysical & Rule Engine Domain
- `numerology_rules`: Versioned mappings (0–9 digits, Yin/Yang, He Tu pairs, Luo Shu coords).
  - `id UUID PRIMARY KEY`, `rule_name TEXT`, `rule_type TEXT` (`digit_element`, `yin_yang`, `hetu_pair`, `luoshu_coord`)
  - `input_value TEXT NOT NULL`, `output_value TEXT NOT NULL`
  - `weight NUMERIC(5,2) DEFAULT 1.0`, `version TEXT DEFAULT '1.0'`, `source TEXT`, `active BOOLEAN DEFAULT true`
- `palaces`: 12 Zi Wei Palaces.
  - `id UUID PRIMARY KEY`, `name TEXT UNIQUE` (命宫, 财帛宫, etc.)
  - `meaning TEXT`, `keywords TEXT[]`, `default_weight NUMERIC(5,2)`, `number_sources INT[]`, `active BOOLEAN`
- `stars`: 14 Main Stars (紫微, 天机, 太阳, 武曲, etc.).
  - `id UUID PRIMARY KEY`, `name TEXT UNIQUE`, `base_element TEXT`, `yin_yang TEXT`, `active BOOLEAN`
- `star_rules`: Dynamic star mapping rule sets.
  - `id UUID PRIMARY KEY`, `star_id UUID REFERENCES stars(id)`
  - `source TEXT`, `version TEXT`, `mapped_numbers INT[]`, `confidence NUMERIC(3,2)`, `notes TEXT`, `active BOOLEAN`
- `four_transformations`: 禄, 权, 科, 忌.
  - `id UUID PRIMARY KEY`, `star_name TEXT`, `transformation TEXT` (`lu`, `quan`, `ke`, `ji`)
  - `meaning TEXT`, `number_effect TEXT`, `weight NUMERIC(5,2)`, `version TEXT`

### 3.3 Daily Time & Direction Domain
- `daily_signatures`: Daily macro Qi signatures.
  - `id UUID PRIMARY KEY`, `target_date DATE NOT NULL UNIQUE`
  - `lunar_date_str TEXT`, `solar_term TEXT`, `ganzhi_day TEXT`
  - `wood_score NUMERIC(5,2)`, `fire_score NUMERIC(5,2)`, `earth_score NUMERIC(5,2)`
  - `metal_score NUMERIC(5,2)`, `water_score NUMERIC(5,2)`
  - `opportunity_score NUMERIC(5,2)`, `opportunity_level TEXT`
- `time_signatures`: Hourly windows (12 Shichen: 子, 丑, 寅...).
  - `id UUID PRIMARY KEY`, `daily_signature_id UUID REFERENCES daily_signatures(id)`
  - `shichen_branch TEXT`, `time_range TEXT`, `window_type TEXT` (`primary`, `secondary`, `avoid`)
- `direction_scores`: Daily 8-direction scores.
  - `id UUID PRIMARY KEY`, `daily_signature_id UUID REFERENCES daily_signatures(id)`
  - `direction TEXT` (`N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`), `azimuth_start INT`, `azimuth_end INT`
  - `status TEXT` (`primary`, `secondary`, `avoid`), `score NUMERIC(5,2)`

### 3.4 Reality Signal Domain (今日观象取数)
- `reality_signals`:
  - `id UUID PRIMARY KEY`, `user_id UUID REFERENCES users(id)`
  - `raw_input TEXT NOT NULL` (e.g., '5729, 7752'), `signal_type TEXT` (license_plate, receipt, time, price)
  - `extracted_digits INT[]`, `digit_frequencies JSONB`, `reality_score NUMERIC(5,2)`
  - `created_at`

### 3.5 Historical Draw & Feature Domain
- `historical_draws`:
  - `id UUID PRIMARY KEY`, `lottery_type TEXT NOT NULL`, `issue_number TEXT NOT NULL`
  - `draw_date DATE NOT NULL`, `draw_time TIME`, `winning_numbers INT[] NOT NULL`
  - `source TEXT NOT NULL`, `import_version TEXT`
  - `UNIQUE(lottery_type, issue_number)`
- `number_features`: Extracted statistical & structural properties of draws.
  - `id UUID PRIMARY KEY`, `historical_draw_id UUID REFERENCES historical_draws(id)`
  - `digit_sum INT`, `digital_root INT`, `odd_even_ratio NUMERIC(3,2)`, `high_low_ratio NUMERIC(3,2)`
  - `consecutive_count INT`, `repeated_count INT`, `luoshu_coords JSONB`, `element_counts JSONB`

### 3.6 Prediction & Lock Domain
- `algorithm_versions`:
  - `id UUID PRIMARY KEY`, `version TEXT UNIQUE NOT NULL`, `name TEXT`, `description TEXT`
  - `weights_snapshot JSONB NOT NULL`, `rules_snapshot JSONB`, `status TEXT` (`active`, `deprecated`)
- `predictions`:
  - `id UUID PRIMARY KEY`, `user_id UUID REFERENCES users(id)`
  - `draw_date DATE NOT NULL`, `algorithm_version TEXT REFERENCES algorithm_versions(version)`
  - `input_snapshot JSONB NOT NULL`, `weights_snapshot JSONB NOT NULL`
  - `top20 INT[]`, `top10 INT[]`, `top5 INT[]`, `mother_code TEXT`, `variation_codes TEXT[]`
  - `model_consistency NUMERIC(5,2)`, `locked_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `prediction_numbers`:
  - `id UUID PRIMARY KEY`, `prediction_id UUID REFERENCES predictions(id)`
  - `digit INT CHECK (digit BETWEEN 0 AND 9)`
  - `personal_score NUMERIC(5,2)`, `time_score NUMERIC(5,2)`, `element_score NUMERIC(5,2)`
  - `palace_score NUMERIC(5,2)`, `star_score NUMERIC(5,2)`, `transformation_score NUMERIC(5,2)`
  - `luoshu_score NUMERIC(5,2)`, `historical_score NUMERIC(5,2)`, `reality_score NUMERIC(5,2)`
  - `final_score NUMERIC(5,2) CHECK (final_score BETWEEN 0 AND 100)`

### 3.7 Backtest Domain
- `backtests`:
  - `id UUID PRIMARY KEY`, `algorithm_version TEXT REFERENCES algorithm_versions(version)`
  - `start_date DATE NOT NULL`, `end_date DATE NOT NULL`, `total_draws INT NOT NULL`
  - `hit_count_top5 INT`, `hit_rate_top5 NUMERIC(5,4)`
  - `hit_count_top10 INT`, `hit_rate_top10 NUMERIC(5,4)`
  - `hit_count_top20 INT`, `hit_rate_top20 NUMERIC(5,4)`
  - `random_baseline_rate NUMERIC(5,4)`, `outperformance_delta NUMERIC(5,4)`
  - `has_lookahead_bias BOOLEAN DEFAULT false`, `bias_warning TEXT`
- `backtest_results`: Detailed row-by-row prediction comparison.
  - `id UUID PRIMARY KEY`, `backtest_id UUID REFERENCES backtests(id)`
  - `draw_id UUID REFERENCES historical_draws(id)`, `predicted_numbers INT[]`, `actual_numbers INT[]`
  - `matches INT`, `is_top5_hit BOOLEAN`, `is_top10_hit BOOLEAN`, `is_top20_hit BOOLEAN`

### 3.8 Governance, Rituals & Logs
- `user_budget_settings`:
  - `id UUID PRIMARY KEY`, `user_id UUID REFERENCES users(id) UNIQUE`
  - `daily_budget NUMERIC(10,2)`, `monthly_budget NUMERIC(10,2)`
  - `pledge_13_percent BOOLEAN DEFAULT false` (Voluntary Sharing Pledge)
- `ritual_templates`: Cultural actions (衣, 净, 位, 行, 观, 取).
- `system_logs`: Audit log for administrative changes and rule updates.
