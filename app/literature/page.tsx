'use client';

import React from 'react';
import { LiteratureBrowserView } from '@/components/literature/LiteratureBrowserView';

export default function LiteraturePage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100">
      <LiteratureBrowserView />
    </div>
  );
}
