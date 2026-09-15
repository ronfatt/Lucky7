-- ==========================================================
-- 紫微时空数字预测系统 (ZWTSP) Deterministic Seed Data
-- File: supabase/seed.sql
-- ==========================================================

-- 1. NUMEROLOGY RULES (0-9 Digits, Yin/Yang, He Tu, Luo Shu)
INSERT INTO numerology_rules (rule_name, rule_type, input_value, output_value, weight, version, source, notes)
VALUES
  -- 0-9 Element Mappings
  ('0_element', 'digit_element', '0', 'Earth', 1.0, '1.0', 'ZWTSP Core V1.0', '0归藏中央土 (成数十亦化为0)'),
  ('1_element', 'digit_element', '1', 'Water', 1.0, '1.0', 'ZWTSP Core V1.0', '1天一生水 (北方坎位)'),
  ('2_element', 'digit_element', '2', 'Fire',  1.0, '1.0', 'ZWTSP Core V1.0', '2地二生火 (西南坤位/火数)'),
  ('3_element', 'digit_element', '3', 'Wood',  1.0, '1.0', 'ZWTSP Core V1.0', '3天三生木 (东方震位)'),
  ('4_element', 'digit_element', '4', 'Metal', 1.0, '1.0', 'ZWTSP Core V1.0', '4地四生金 (东南巽位/四九合金)'),
  ('5_element', 'digit_element', '5', 'Earth', 1.0, '1.0', 'ZWTSP Core V1.0', '5天五生土 (中央中宫位)'),
  ('6_element', 'digit_element', '6', 'Water', 1.0, '1.0', 'ZWTSP Core V1.0', '6地六成水 (西北乾位/一六合水)'),
  ('7_element', 'digit_element', '7', 'Fire',  1.0, '1.0', 'ZWTSP Core V1.0', '7天七成火 (西方兑位/二七合火)'),
  ('8_element', 'digit_element', '8', 'Wood',  1.0, '1.0', 'ZWTSP Core V1.0', '8地八成木 (东北艮位/三八合木)'),
  ('9_element', 'digit_element', '9', 'Metal', 1.0, '1.0', 'ZWTSP Core V1.0', '9天九成金 (南方离位/四九合金)'),

  -- Yin / Yang Polarity
  ('0_polarity', 'yin_yang', '0', 'Yin',  1.0, '1.0', 'Zhouyi Rule V1', '偶数为阴，太阴蓄势'),
  ('1_polarity', 'yin_yang', '1', 'Yang', 1.0, '1.0', 'Zhouyi Rule V1', '奇数为阳，太阳初萌'),
  ('2_polarity', 'yin_yang', '2', 'Yin',  1.0, '1.0', 'Zhouyi Rule V1', '偶数为阴，柔顺静谧'),
  ('3_polarity', 'yin_yang', '3', 'Yang', 1.0, '1.0', 'Zhouyi Rule V1', '奇数为阳，生长开张'),
  ('4_polarity', 'yin_yang', '4', 'Yin',  1.0, '1.0', 'Zhouyi Rule V1', '偶数为阴，收敛成形'),
  ('5_polarity', 'yin_yang', '5', 'Yang', 1.0, '1.0', 'Zhouyi Rule V1', '奇数为阳，中正斡旋'),
  ('6_polarity', 'yin_yang', '6', 'Yin',  1.0, '1.0', 'Zhouyi Rule V1', '偶数为阴，至阴润下'),
  ('7_polarity', 'yin_yang', '7', 'Yang', 1.0, '1.0', 'Zhouyi Rule V1', '奇数为阳，光热外显'),
  ('8_polarity', 'yin_yang', '8', 'Yin',  1.0, '1.0', 'Zhouyi Rule V1', '偶数为阴，厚重安止'),
  ('9_polarity', 'yin_yang', '9', 'Yang', 1.0, '1.0', 'Zhouyi Rule V1', '奇数为阳，乾刚极数'),

  -- He Tu Generation Pairs (河图)
  ('hetu_water', 'hetu_pair', '1', '6', 1.2, '1.0', 'He Tu Tradition', '天一生水，地六成之 (1/6 共宗水)'),
  ('hetu_fire',  'hetu_pair', '2', '7', 1.2, '1.0', 'He Tu Tradition', '地二生火，天七成之 (2/7 为朋火)'),
  ('hetu_wood',  'hetu_pair', '3', '8', 1.2, '1.0', 'He Tu Tradition', '天三生木，地八成之 (3/8 同道木)'),
  ('hetu_metal', 'hetu_pair', '4', '9', 1.2, '1.0', 'He Tu Tradition', '地四生金，天九成之 (4/9 为友金)'),
  ('hetu_earth', 'hetu_pair', '5', '0', 1.2, '1.0', 'He Tu Tradition', '天五生土，地十成之 (5/0 同途土，10映射为0)'),

  -- Luo Shu 9-Palace Matrix (洛书 492 / 357 / 816)
  ('luoshu_4', 'luoshu_coord', '4', '{"row": 0, "col": 0, "palace": "xun", "dir": "SE", "element": "Wood"}', 1.0, '1.0', 'Luo Shu Matrix', '戴九履一，左三右七，二四为肩，六八为足'),
  ('luoshu_9', 'luoshu_coord', '9', '{"row": 0, "col": 1, "palace": "li", "dir": "S", "element": "Fire"}', 1.0, '1.0', 'Luo Shu Matrix', '九宫离火，正南方'),
  ('luoshu_2', 'luoshu_coord', '2', '{"row": 0, "col": 2, "palace": "kun", "dir": "SW", "element": "Earth"}', 1.0, '1.0', 'Luo Shu Matrix', '二宫坤土，西南方'),
  ('luoshu_3', 'luoshu_coord', '3', '{"row": 1, "col": 0, "palace": "zhen", "dir": "E", "element": "Wood"}', 1.0, '1.0', 'Luo Shu Matrix', '三宫震木，正东方'),
  ('luoshu_5', 'luoshu_coord', '5', '{"row": 1, "col": 1, "palace": "center", "dir": "Center", "element": "Earth"}', 1.0, '1.0', 'Luo Shu Matrix', '五宫中土，统御中央'),
  ('luoshu_7', 'luoshu_coord', '7', '{"row": 1, "col": 2, "palace": "dui", "dir": "W", "element": "Metal"}', 1.0, '1.0', 'Luo Shu Matrix', '七宫兑金，正西方'),
  ('luoshu_8', 'luoshu_coord', '8', '{"row": 2, "col": 0, "palace": "gen", "dir": "NE", "element": "Earth"}', 1.0, '1.0', 'Luo Shu Matrix', '八宫艮土，东北方'),
  ('luoshu_1', 'luoshu_coord', '1', '{"row": 2, "col": 1, "palace": "kan", "dir": "N", "element": "Water"}', 1.0, '1.0', 'Luo Shu Matrix', '一宫坎水，正北方'),
  ('luoshu_6', 'luoshu_coord', '6', '{"row": 2, "col": 2, "palace": "qian", "dir": "NW", "element": "Metal"}', 1.0, '1.0', 'Luo Shu Matrix', '六宫乾金，西北方'),
  ('luoshu_0', 'luoshu_coord', '0', '{"row": 1, "col": 1, "palace": "center", "dir": "Center", "element": "Earth"}', 1.0, '1.0', 'Luo Shu Matrix', '零为玄牝归中，寄宫中央坤艮')
ON CONFLICT DO NOTHING;

-- 2. TWELVE PALACES (十二宫)
INSERT INTO palaces (name, meaning, keywords, default_weight, number_sources, reality_keywords, active, version)
VALUES
  ('命宫', 'self, identity, personal core', ARRAY['自我', '本体', '核心能量', '主导数'], 1.5, ARRAY[1, 5], ARRAY['身心状态', '第一直觉'], true, '1.0'),
  ('兄弟宫', 'siblings, cooperation, peer relations', ARRAY['同行', '协力', '搭档', '平行数'], 1.0, ARRAY[2, 3], ARRAY['朋友提示', '偶遇同伴'], true, '1.0'),
  ('夫妻宫', 'relationship, partnership', ARRAY['契合', '配对', '互补', '合偶数'], 1.0, ARRAY[6, 7], ARRAY['感情互动', '双数共鸣'], true, '1.0'),
  ('子女宫', 'children, creativity, output', ARRAY['产出', '新发', '流动', '萌芽数'], 1.0, ARRAY[3, 8], ARRAY['新生事物', '奇思妙想'], true, '1.0'),
  ('财帛宫', 'money, resources, income, transactions', ARRAY['流通', '交易', '资源', '汇聚数'], 1.5, ARRAY[4, 9, 8], ARRAY['账单金额', '商品标价'], true, '1.0'),
  ('疾厄宫', 'health, weakness, maintenance', ARRAY['隐微', '休整', '过滤', '调整数'], 0.8, ARRAY[0, 5], ARRAY['身体信号', '疲惫警示'], true, '1.0'),
  ('迁移宫', 'movement, travel, external environment, transportation', ARRAY['出行', '远方', '动势', '变易数'], 1.2, ARRAY[1, 9], ARRAY['车牌号码', '路标指示', '交通工具'], true, '1.0'),
  ('交友/仆役宫', 'network, social relations, collaborators', ARRAY['群体', '受众', '众意', '离散数'], 0.9, ARRAY[2, 6], ARRAY['群消息', '社交动态'], true, '1.0'),
  ('官禄宫', 'career, achievement, status', ARRAY['立身', '结构', '秩序', '权能数'], 1.2, ARRAY[4, 7], ARRAY['工号代码', '合同编号'], true, '1.0'),
  ('田宅宫', 'home, property, physical assets', ARRAY['守藏', '地气', '基石', '归聚数'], 1.1, ARRAY[0, 8], ARRAY['门牌门栋', '房间号码'], true, '1.0'),
  ('福德宫', 'inner state, enjoyment, mental state', ARRAY['灵感', '宁静', '福泽', '顿悟数'], 1.3, ARRAY[5, 7], ARRAY['精神喜悦', '偶遇吉兆'], true, '1.0'),
  ('父母宫', 'elders, support, authority, inheritance context', ARRAY['根基', '庇护', '源头', '始源数'], 0.9, ARRAY[1, 6], ARRAY['长辈赠言', '老物件编号'], true, '1.0')
ON CONFLICT (name) DO NOTHING;

-- 3. FOURTEEN MAIN STARS (十四主星)
INSERT INTO stars (name, base_element, yin_yang, meaning, active)
VALUES
  ('紫微', 'Earth', 'Yang', '北斗帝王星，尊贵统御，归藏万象', true),
  ('天机', 'Wood',  'Yin',  '南斗智多星，运转机谋，智慧应变', true),
  ('太阳', 'Fire',  'Yang', '中天光明星，博爱照耀，刚健发散', true),
  ('武曲', 'Metal', 'Yin',  '北斗财帛星，果决刚毅，重诺执行', true),
  ('天同', 'Water', 'Yang', '南斗福德星，温良宽和，善解纷争', true),
  ('廉贞', 'Fire',  'Yin',  '北斗次桃花/权星，敏锐精明，气魄纵横', true),
  ('天府', 'Earth', 'Yang', '南斗主星令，厚重库藏，稳健包容', true),
  ('太阴', 'Water', 'Yin',  '中天柔洁星，细腻内敛，润物滋长', true),
  ('贪狼', 'Wood',  'Dual', '北斗第一星，变化莫测，欲望与创造', true),
  ('巨门', 'Water', 'Yin',  '北斗暗曜星，明辨细微，言辞洞察', true),
  ('天相', 'Water', 'Yang', '南斗司印星，端方公正，协同辅佐', true),
  ('天梁', 'Earth', 'Yang', '南斗寿德星，荫庇护持，排难解纷', true),
  ('七杀', 'Metal', 'Yang', '南斗大将星，凌厉骁勇，独立决断', true),
  ('破军', 'Water', 'Yin',  '北斗耗变星，先破后立，革新开辟', true)
ON CONFLICT (name) DO NOTHING;

-- 4. FOUR TRANSFORMATIONS (四化)
INSERT INTO four_transformations (star_name, transformation, meaning, number_effect, weight, version, active)
VALUES
  ('武曲', 'Lu',   'gain, attraction, increase', '化禄增益：增强相关五行与数理的正面共振 (+15分)', 1.5, '1.0', true),
  ('太阳', 'Quan', 'action, influence, control', '化权推动：激发行动力与主导数活跃度 (+10分)', 1.3, '1.0', true),
  ('天机', 'Ke',   'visibility, recognition, expression', '化科照亮：提升灵感捕捉与辨识度 (+8分)', 1.1, '1.0', true),
  ('巨门', 'Ji',   'friction, blockage, consumption', '化忌阻滞：提示潜在冲突与波折，避让或化解 (-10分)', 1.2, '1.0', true)
ON CONFLICT DO NOTHING;

-- 5. ALGORITHM VERSIONS & DEFAULT WEIGHT CONFIG
INSERT INTO algorithm_versions (version, name, description, weights_snapshot, status)
VALUES
  ('V1.0', 'ZWTSP 经典时空数理融合版', '结合时空八字、紫微星系、河洛九宫与现实观象的多维融合算法', 
   '{"weight_destiny": 15, "weight_bazi": 15, "weight_stars": 10, "weight_transformations": 5, "weight_elements": 10, "weight_luoshu": 10, "weight_reality": 5, "weight_historical": 20, "weight_structure": 10}'::jsonb, 
   'active')
ON CONFLICT (version) DO NOTHING;

INSERT INTO weight_configs (config_name, weight_destiny, weight_bazi, weight_stars, weight_transformations, weight_elements, weight_luoshu, weight_reality, weight_historical, weight_structure, version, active)
VALUES
  ('default_standard', 15.00, 15.00, 10.00, 5.00, 10.00, 10.00, 5.00, 20.00, 10.00, '1.0', true)
ON CONFLICT (config_name) DO NOTHING;

-- 6. RITUAL TEMPLATES (衣·净·位·行·观·取)
INSERT INTO ritual_templates (category, title, description, notes)
VALUES
  ('yi',   '今日吉色衣饰', '根据当日五行生旺，建议佩戴或身着与日运互生相合的色系，平衡身心磁场。', '传统文化/个人仪式建议，不代表能够提高实际中奖概率。'),
  ('jing', '身心净定仪式', '静心调息三分钟，摒弃焦虑与侥幸之心，保持清明理性。', '传统文化/个人仪式建议，不代表能够提高实际中奖概率。'),
  ('wei',  '吉位方位感知', '面向当日吉方深呼吸，观察周围环境的气流与采光状态。', '传统文化/个人仪式建议，不代表能够提高实际中奖概率。'),
  ('xing', '从容择机而行', '选定主时段或次时段行动，不急不躁，顺应天时节律。', '传统文化/个人仪式建议，不代表能够提高实际中奖概率。'),
  ('guan', '观象应数捕捉', '出行或生活所见门牌、车牌、时间等偶发数字，记录于今日观象。', '传统文化/个人仪式建议，不代表能够提高实际中奖概率。'),
  ('qu',   '克制取数立愿', '适度自律，严格遵守自设额度；若有所得，自愿将13%回馈社会。', '传统文化/个人仪式建议，不代表能够提高实际中奖概率。')
ON CONFLICT DO NOTHING;
