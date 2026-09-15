import Link from 'next/link';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-gold-glow">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-mono font-bold text-white tracking-wider">404</h1>
        <h2 className="text-lg font-bold text-gold-300">时空路径未寻获</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          您访问的页面在当前时空九宫中暂未定位，可能已被迁移或路径输入有误。
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-gold-500/20 transition"
        >
          <Home className="w-4 h-4" />
          <span>返回主页</span>
        </Link>
      </div>
    </div>
  );
}
