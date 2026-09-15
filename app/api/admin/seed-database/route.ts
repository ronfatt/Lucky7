// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Cloud Database Seeder API
// File: app/api/admin/seed-database/route.ts
// Uses supabaseAdmin to populate Supabase with classical canons & draws
// ==========================================================

import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { CLASSICAL_CANON_LIST } from '@/lib/literature/literature-provider';
import { FlyingStarSiHuaEngine } from '@/lib/literature/flying-star-sihua-engine';
import { MalaysiaLotteryProvider } from '@/lib/lottery/malaysia-provider';

export async function POST() {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { success: false, error: 'Supabase is not configured' },
      { status: 500 }
    );
  }

  const report: Record<string, any> = {
    startedAt: new Date().toISOString(),
    literatureCount: 0,
    chaptersCount: 0,
    sihuaCount: 0,
    drawsCount: 0,
    errors: [] as string[],
  };

  try {
    // 1. Seed Classical Literature & Chapters
    for (const lit of CLASSICAL_CANON_LIST) {
      const { error: litErr } = await supabaseAdmin.from('classical_literature').upsert(
        {
          id: lit.id,
          title: lit.title,
          author: lit.author,
          lineage: lit.lineage,
          lineage_name: lit.lineageName,
          page_count: lit.pageCount,
          file_name: lit.fileName,
          summary: lit.summary,
          core_theories: lit.coreTheories,
          tags: lit.tags,
        },
        { onConflict: 'id' }
      );

      if (litErr) {
        report.errors.push(`literature (${lit.title}): ${litErr.message}`);
      } else {
        report.literatureCount++;
      }

      if (lit.chapters && lit.chapters.length > 0) {
        for (const ch of lit.chapters) {
          const { error: chErr } = await supabaseAdmin.from('literature_chapters').upsert(
            {
              id: ch.id,
              literature_id: lit.id,
              chapter_number: ch.chapterNumber,
              title: ch.title,
              summary: ch.summary,
              key_quotes: ch.keyQuotes,
              keywords: ch.keywords,
            },
            { onConflict: 'id' }
          );

          if (chErr) {
            report.errors.push(`chapter (${ch.title}): ${chErr.message}`);
          } else {
            report.chaptersCount++;
          }
        }
      }
    }

    // 2. Seed Flying Star Si Hua Patterns
    const sihuaPatterns = FlyingStarSiHuaEngine.getAllPatterns();
    for (const p of sihuaPatterns) {
      const { error: sihuaErr } = await supabaseAdmin.from('flying_star_sihua_patterns').upsert(
        {
          id: p.id,
          from_palace: p.fromPalace,
          sihua_type: p.siHuaType,
          sihua_name: p.siHuaName,
          to_palace: p.toPalace,
          canonical_meaning: p.canonicalMeaning,
          number_implication: p.numberImplication,
          source_literature: p.sourceLiterature,
        },
        { onConflict: 'id' }
      );

      if (sihuaErr) {
        report.errors.push(`sihua (${p.id}): ${sihuaErr.message}`);
      } else {
        report.sihuaCount++;
      }
    }

    // 3. Seed Lottery Draws (West & East Malaysia + Singapore)
    const draws = MalaysiaLotteryProvider.getDraws('ALL');
    for (const d of draws) {
      const { error: drawErr } = await supabaseAdmin.from('lottery_draws').upsert(
        {
          operator: d.operator,
          draw_date: d.drawDate,
          draw_no: d.drawNo,
          prize_1st: d.firstPrize,
          prize_2nd: d.secondPrize,
          prize_3rd: d.thirdPrize,
          special_prizes: d.specialPrizes,
          consolation_prizes: d.consolationPrizes,
          all_numbers: d.allWinningNumbers,
          day_stem_branch: '',
          dominant_element: '',
        },
        { onConflict: 'operator,draw_date' }
      );

      if (drawErr) {
        report.errors.push(`draw (${d.operator} ${d.drawDate}): ${drawErr.message}`);
      } else {
        report.drawsCount++;
      }
    }

    report.finishedAt = new Date().toISOString();
    report.success = report.errors.length === 0;

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || String(error), report },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
