// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Edit Profile Modal
// File: components/destiny/EditProfileModal.tsx
// ==========================================================

import React, { useState } from 'react';
import type { BirthProfile } from '../../types/zwtsp';
import { Button } from '@/components/ui/Button';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  X,
  Check,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: BirthProfile;
  onSave: (updated: BirthProfile) => void;
}

const CHINESE_HOURS = [
  { branch: '子', label: '子时 (23:00 - 00:59)', time: '23:30:00' },
  { branch: '丑', label: '丑时 (01:00 - 02:59)', time: '02:00:00' },
  { branch: '寅', label: '寅时 (03:00 - 04:59)', time: '04:00:00' },
  { branch: '卯', label: '卯时 (05:00 - 06:59)', time: '06:00:00' },
  { branch: '辰', label: '辰时 (07:00 - 08:59)', time: '08:00:00' },
  { branch: '巳', label: '巳时 (09:00 - 10:59)', time: '10:00:00' },
  { branch: '午', label: '午时 (11:00 - 12:59)', time: '12:00:00' },
  { branch: '未', label: '未时 (13:00 - 14:59)', time: '14:00:00' },
  { branch: '申', label: '申时 (15:00 - 16:59)', time: '16:00:00' },
  { branch: '酉', label: '酉时 (17:00 - 18:59)', time: '18:00:00' },
  { branch: '戌', label: '戌时 (19:00 - 20:59)', time: '20:00:00' },
  { branch: '亥', label: '亥时 (21:00 - 22:59)', time: '22:00:00' },
];

export function EditProfileModal({
  isOpen,
  onClose,
  currentProfile,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(currentProfile.name || '命主');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(currentProfile.gender || 'male');
  const [birthDate, setBirthDate] = useState(currentProfile.birthDate || '1990-05-18');
  const [isUnknownHour, setIsUnknownHour] = useState(
    currentProfile.birthTimePrecision === 'UNKNOWN' || !currentProfile.birthTime
  );
  const [birthTime, setBirthTime] = useState(currentProfile.birthTime || '09:30:00');
  const [birthPlace, setBirthPlace] = useState(currentProfile.birthPlace || '马来西亚吉隆坡');
  const [timezone, setTimezone] = useState(currentProfile.timezone || 'Asia/Kuala_Lumpur');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BirthProfile = {
      ...currentProfile,
      name: name.trim() || '命主',
      gender,
      birthDate,
      birthTimePrecision: isUnknownHour ? 'UNKNOWN' : 'EXACT',
      birthTime: isUnknownHour ? undefined : birthTime,
      birthPlace: birthPlace.trim() || '未设置',
      timezone,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#0E1322] to-[#070A12] border border-gold-500/40 p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              修改我的本命档案资料
            </h3>
            <p className="text-xs text-slate-400">
              更新您的生辰八字与紫微命盘基石，实时驱动全站推演
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Name & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gold-400" />
                姓名 / 昵称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：李知命"
                className="w-full bg-[#070A12] border border-slate-800 focus:border-gold-500/60 rounded-xl px-3 py-2 text-white outline-none transition"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1.5">
                性别（影响阴阳大运顺逆）
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 px-3 rounded-xl border text-center font-medium transition ${
                    gender === 'male'
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 font-bold'
                      : 'bg-[#070A12] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  乾造 (男)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 px-3 rounded-xl border text-center font-medium transition ${
                    gender === 'female'
                      ? 'bg-rose-600/20 border-rose-500/50 text-rose-300 font-bold'
                      : 'bg-[#070A12] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  坤造 (女)
                </button>
              </div>
            </div>
          </div>

          {/* 2. Birth Date (Solar / Gregorian) */}
          <div>
            <label className="text-slate-300 font-medium block mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              阳历公历出生日期 (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 focus:border-gold-500/60 rounded-xl px-3 py-2 text-white outline-none transition font-mono"
              required
            />
          </div>

          {/* 3. Birth Hour & Unknown Hour Toggle */}
          <div className="p-3.5 rounded-xl bg-[#070A12]/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                出生时辰 (Birth Hour)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white">
                <input
                  type="checkbox"
                  checked={isUnknownHour}
                  onChange={(e) => setIsUnknownHour(e.target.checked)}
                  className="rounded border-slate-700 text-gold-500 focus:ring-gold-500/30"
                />
                <span>时辰未知（传统三柱）</span>
              </label>
            </div>

            {!isUnknownHour ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {CHINESE_HOURS.map((h) => {
                    const isSelected = birthTime.startsWith(h.time.slice(0, 2));
                    return (
                      <button
                        key={h.branch}
                        type="button"
                        onClick={() => setBirthTime(h.time)}
                        className={`px-2 py-1.5 rounded-lg border text-[11px] text-left transition truncate ${
                          isSelected
                            ? 'bg-gold-500/20 border-gold-500/60 text-gold-300 font-semibold'
                            : 'bg-[#0B0F19] border-slate-800/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {h.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-slate-500">具体钟点时间:</span>
                  <input
                    type="time"
                    step="1"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="bg-[#0B0F19] border border-slate-800 text-gold-300 px-2 py-1 rounded-lg font-mono focus:border-gold-500/50 outline-none text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>时辰未知时，系统不虚构时柱，采用年柱、月柱、日柱三柱推演。</span>
              </div>
            )}
          </div>

          {/* 4. Birth Place & Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                出生地点 / 所在城市
              </label>
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="例如：吉隆坡、槟城、新加坡、杭州"
                className="w-full bg-[#070A12] border border-slate-800 focus:border-gold-500/60 rounded-xl px-3 py-2 text-white outline-none transition"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1.5">
                时区设置
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-[#070A12] border border-slate-800 focus:border-gold-500/60 rounded-xl px-3 py-2 text-white outline-none transition"
              >
                <option value="Asia/Kuala_Lumpur">吉隆坡 / 新加坡 (GMT+8)</option>
                <option value="Asia/Shanghai">北京 / 上海 (GMT+8)</option>
                <option value="Asia/Taipei">台北 (GMT+8)</option>
                <option value="Asia/Hong_Kong">香港 (GMT+8)</option>
                <option value="Asia/Bangkok">曼谷 (GMT+7)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              取消
            </button>
            <Button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow-lg shadow-gold-500/20"
            >
              <Check className="w-4 h-4" />
              保存命盘并重新推演
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
