import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sliders, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DatabaseManagerView } from '@/components/admin/DatabaseManagerView';

export default function AdminPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 rounded-2xl glass-panel border border-gold-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-gold-500/20 text-gold-champagne">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-100">算法调优与管理中台 · Admin Panel</h2>
              <p className="text-xs text-slate-400">9 维权重配置调优、Supabase 云端数据库治理与系统审计</p>
            </div>
          </div>
          <Badge variant="gold">Phase 8 管理员专区</Badge>
        </div>
      </div>

      {/* Supabase Cloud Database Manager */}
      <DatabaseManagerView />

      <Card className="border-gold-500/20">
        <CardHeader>
          <CardTitle>
            <ShieldAlert className="w-4 h-4 text-gold-champagne" />
            权限与安全性隔离 (RBAC Policy)
          </CardTitle>
          <CardDescription>
            普通用户仅能查看推演结果，严禁修改底层算法与核心玄学规则映射。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            管理中台支持管理员在数据库层直接调整：个人本命（15%）、时空八字（15%）、紫微星曜（10%）、四化飞星（5%）、五行生克（10%）、河洛九宫（10%）、现实观象（5%）、历史统计（20%）、数理结构（10%）等权重，每次调整均必须生成新的版本号并记录于系统日志。
          </p>
          <Link href="/rules">
            <Button variant="outline" size="sm">
              查看当前生效规则库 (Rules Repository)
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
