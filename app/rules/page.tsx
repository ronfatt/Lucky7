'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Layers, Sparkles, Compass, ShieldAlert } from 'lucide-react';
import { globalRuleEngine } from '@/lib/rules/rule-engine';
import { ELEMENT_LABELS } from '@/lib/numerology/digit-foundation';
import { WuXingElement } from '@/types/zwtsp';

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState<'digits' | 'luoshu' | 'palaces' | 'stars'>('digits');
  const activeRules = globalRuleEngine.getAllActiveRules();

  const digitElementRules = activeRules.filter(r => r.ruleType === 'digit_element');
  const yinYangRules = activeRules.filter(r => r.ruleType === 'yin_yang');
  const hetuRules = activeRules.filter(r => r.ruleType === 'hetu_pair');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-gold-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-champagne">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-serif font-bold text-slate-100">
              规则中枢 · Rule Engine Repository
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            底层术数规则与映射逻辑均通过数据库及版本化配置统一调度，杜绝在前端组件硬编码任何玄学规则。
          </p>
        </div>
        <Badge variant="gold">算法规则版本 V1.0 (Active)</Badge>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
        <button
          onClick={() => setActiveTab('digits')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'digits'
              ? 'bg-gold-500/20 text-gold-champagne border border-gold-500/40 shadow-gold-glow'
              : 'bg-obsidian-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          0-9 数理与河图 (Digits & He Tu)
        </button>
        <button
          onClick={() => setActiveTab('luoshu')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'luoshu'
              ? 'bg-gold-500/20 text-gold-champagne border border-gold-500/40 shadow-gold-glow'
              : 'bg-obsidian-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          洛书九宫阵列 (Luo Shu Matrix)
        </button>
        <button
          onClick={() => setActiveTab('palaces')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'palaces'
              ? 'bg-gold-500/20 text-gold-champagne border border-gold-500/40 shadow-gold-glow'
              : 'bg-obsidian-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          紫微十二宫 (12 Palaces)
        </button>
        <button
          onClick={() => setActiveTab('stars')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'stars'
              ? 'bg-gold-500/20 text-gold-champagne border border-gold-500/40 shadow-gold-glow'
              : 'bg-obsidian-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          十四主星与四化 (Stars & Transformations)
        </button>
      </div>

      {/* Tab Content: Digits & He Tu */}
      {activeTab === 'digits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Layers className="w-4 h-4 text-gold-champagne" />
                0-9 数字与五行阴阳映射表
              </CardTitle>
              <CardDescription>配置表: numerology_rules (rule_type: digit_element, yin_yang)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-400 border-b border-white/5">
                    <tr>
                      <th className="py-2.5 px-3">数字</th>
                      <th className="py-2.5 px-3">五行归藏</th>
                      <th className="py-2.5 px-3">阴阳极性</th>
                      <th className="py-2.5 px-3">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {digitElementRules.map((rule) => {
                      const d = parseInt(rule.inputValue, 10);
                      const yinYangRule = yinYangRules.find(y => y.inputValue === rule.inputValue);
                      const el = rule.outputValue as WuXingElement;
                      const meta = ELEMENT_LABELS[el];
                      return (
                        <tr key={rule.inputValue} className="hover:bg-white/5">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-200">{d}</td>
                          <td className="py-2.5 px-3">
                            <Badge variant={el.toLowerCase() as any}>
                              {meta.zh} ({el})
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">
                            {yinYangRule?.outputValue === 'Yang' ? '阳 (Yang)' : '阴 (Yin)'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[10px] text-emerald-400">已激活</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Sparkles className="w-4 h-4 text-gold-champagne" />
                河图生成对偶规则 (He Tu Pairs)
              </CardTitle>
              <CardDescription>配置表: numerology_rules (rule_type: hetu_pair)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hetuRules.map((rule) => (
                <div
                  key={rule.ruleName}
                  className="p-3.5 rounded-xl bg-obsidian-900 border border-gold-500/20 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-sm font-bold text-gold-champagne">
                      {rule.inputValue} / {rule.outputValue}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{rule.notes}</p>
                  </div>
                  <Badge variant="gold">权重: {rule.weight}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Content: Luo Shu */}
      {activeTab === 'luoshu' && (
        <Card>
          <CardHeader>
            <CardTitle>
              <Compass className="w-4 h-4 text-gold-champagne" />
              洛书九宫立体时空坐标体系
            </CardTitle>
            <CardDescription>
              三阶幻方阵列，各行、各列及对角线和皆为15，统摄八方与中央。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
                <span className="text-gold-champagne font-bold font-mono">4 · 巽宫 (SE)</span>
                <p className="text-xs text-slate-300">五行属木，为风为顺，居东南肩位。</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
                <span className="text-gold-champagne font-bold font-mono">9 · 离宫 (S)</span>
                <p className="text-xs text-slate-300">五行属火，为日为丽，居正南首位。</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
                <span className="text-gold-champagne font-bold font-mono">2 · 坤宫 (SW)</span>
                <p className="text-xs text-slate-300">五行属土，为地为柔，居西南肩位。</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
                <span className="text-gold-champagne font-bold font-mono">3 · 震宫 (E)</span>
                <p className="text-xs text-slate-300">五行属木，为雷为动，居正东左位。</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-gold-500/30 space-y-1">
                <span className="text-gold-champagne font-bold font-mono">5 / 0 · 中宫 (Center)</span>
                <p className="text-xs text-slate-300">五行属土，中正斡旋，皇极总领万方。</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
                <span className="text-gold-champagne font-bold font-mono">7 · 兑宫 (W)</span>
                <p className="text-xs text-slate-300">五行属金，为泽为说，居正西右位。</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
                <span className="text-gold-champagne font-bold font-mono">8 · 艮宫 (NE)</span>
                <p className="text-xs text-slate-300">五行属土，为山为止，居东北足位。</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
                <span className="text-gold-champagne font-bold font-mono">1 · 坎宫 (N)</span>
                <p className="text-xs text-slate-300">五行属水，为水为渊，居正北履位。</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 space-y-1">
                <span className="text-gold-champagne font-bold font-mono">6 · 乾宫 (NW)</span>
                <p className="text-xs text-slate-300">五行属金，为天为刚，居西北足位。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Content: Palaces */}
      {activeTab === 'palaces' && (
        <Card>
          <CardHeader>
            <CardTitle>紫微斗数十二宫语义与能量权重</CardTitle>
            <CardDescription>配置表: palaces (十二宫代表生命各维度的时空投射，非确定性财务预言)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: '命宫', meaning: '自我、核心意志、本体能量', weight: '1.5' },
                { name: '财帛宫', meaning: '资金流通、资源交易、获利方式', weight: '1.5' },
                { name: '官禄宫', meaning: '事业地位、结构秩序、权柄发展', weight: '1.2' },
                { name: '迁移宫', meaning: '远行出动、外部环境、车辆交通', weight: '1.2' },
                { name: '田宅宫', meaning: '房产不动产、守藏居所、家庭聚落', weight: '1.1' },
                { name: '福德宫', meaning: '精神状态、灵感福泽、内心宁静', weight: '1.3' },
                { name: '夫妻宫', meaning: '契约配对、同伴互补、亲密关系', weight: '1.0' },
                { name: '子女宫', meaning: '创作产出、新生事物、延展动能', weight: '1.0' },
                { name: '兄弟宫', meaning: '同行协作、平辈关系、共谋伙伴', weight: '1.0' },
                { name: '疾厄宫', meaning: '身心弱点、健康保养、休整过滤', weight: '0.8' },
                { name: '交友宫', meaning: '受众群体、社交人脉、团队协力', weight: '0.9' },
                { name: '父母宫', meaning: '传承源头、长辈贵人、权威环境', weight: '0.9' },
              ].map(p => (
                <div key={p.name} className="p-3 rounded-lg bg-obsidian-900 border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-bold text-slate-100">{p.name}</span>
                    <Badge variant="gold">权重: {p.weight}</Badge>
                  </div>
                  <p className="text-xs text-slate-400">{p.meaning}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Content: Stars */}
      {activeTab === 'stars' && (
        <Card>
          <CardHeader>
            <CardTitle>十四主星体系与四化飞星 (Stars & Transformations)</CardTitle>
            <CardDescription>配置表: stars, star_rules, four_transformations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-gold-champagne uppercase tracking-wider mb-3">
                四化飞星动量机制
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-obsidian-900 border border-emerald-500/30">
                  <span className="font-serif font-bold text-emerald-400">化禄 (Lu)</span>
                  <p className="text-xs text-slate-300 mt-1">生发、增益、吸引磁场 (+15分)</p>
                </div>
                <div className="p-3 rounded-lg bg-obsidian-900 border border-sky-500/30">
                  <span className="font-serif font-bold text-sky-400">化权 (Quan)</span>
                  <p className="text-xs text-slate-300 mt-1">主导、行动、掌控拓展 (+10分)</p>
                </div>
                <div className="p-3 rounded-lg bg-obsidian-900 border border-gold-500/30">
                  <span className="font-serif font-bold text-gold-champagne">化科 (Ke)</span>
                  <p className="text-xs text-slate-300 mt-1">灵感、显现、条理通畅 (+8分)</p>
                </div>
                <div className="p-3 rounded-lg bg-obsidian-900 border border-red-500/30">
                  <span className="font-serif font-bold text-red-400">化忌 (Ji)</span>
                  <p className="text-xs text-slate-300 mt-1">阻滞、警示、波折提醒 (-10分)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
