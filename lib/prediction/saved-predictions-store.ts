// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Saved Predictions Store
// File: lib/prediction/saved-predictions-store.ts
// Persists user favorite predicted numbers in localStorage
// ==========================================================

export interface SavedPredictionItem {
  id: string;
  number: string;
  sourceType: 'MOTHER_CODE' | 'CANDIDATE' | 'VARIATION' | 'DREAM_IMAGERY';
  sourceTitleZh: string;
  date: string;
  score: number;
  notes?: string;
  savedAt: string;
}

const STORAGE_KEY = 'zwtsp_saved_favorite_predictions_v1';

const DEFAULT_INITIAL_SAVED: SavedPredictionItem[] = [
  {
    id: 'fav-seed-5729',
    number: '5729',
    sourceType: 'MOTHER_CODE',
    sourceTitleZh: '本期综合母码 (首位序列)',
    date: '2026-09-13',
    score: 86.4,
    notes: '日柱戊子流日合局，四化天机化忌冲起贪狼化禄',
    savedAt: new Date('2026-09-13T10:30:00Z').toISOString(),
  },
  {
    id: 'fav-seed-7295',
    number: '7295',
    sourceType: 'VARIATION',
    sourceTitleZh: '变异码 (离九向心变位)',
    date: '2026-09-13',
    score: 83.2,
    notes: '火木相生形态，同干支日高频契合',
    savedAt: new Date('2026-09-13T11:15:00Z').toISOString(),
  },
];

let memoryStore: SavedPredictionItem[] = [...DEFAULT_INITIAL_SAVED];

export class SavedPredictionsStore {
  /**
   * Retrieves all saved favorite prediction items
   */
  public static getAll(): SavedPredictionItem[] {
    if (typeof window === 'undefined') {
      return memoryStore;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_SAVED));
        return DEFAULT_INITIAL_SAVED;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_INITIAL_SAVED;
    }
  }

  /**
   * Saves a new prediction number to favorites
   */
  public static save(
    item: Omit<SavedPredictionItem, 'id' | 'savedAt'>
  ): { success: boolean; isNew: boolean; item: SavedPredictionItem } {
    const list = this.getAll();
    const cleanNum = item.number.trim();

    // Check if already exists for the same number and date
    const existing = list.find((p) => p.number === cleanNum && p.date === item.date);
    if (existing) {
      return { success: true, isNew: false, item: existing };
    }

    const newItem: SavedPredictionItem = {
      ...item,
      id: `fav-${Date.now()}-${cleanNum}`,
      number: cleanNum,
      savedAt: new Date().toISOString(),
    };

    const updated = [newItem, ...list];
    this.persist(updated);
    return { success: true, isNew: true, item: newItem };
  }

  /**
   * Removes a saved item by ID
   */
  public static remove(id: string): void {
    const list = this.getAll();
    const updated = list.filter((p) => p.id !== id);
    this.persist(updated);
  }

  /**
   * Checks if a number is already saved
   */
  public static isSaved(targetNum: string, date?: string): boolean {
    const list = this.getAll();
    const cleanNum = targetNum.trim();
    if (date) {
      return list.some((p) => p.number === cleanNum && p.date === date);
    }
    return list.some((p) => p.number === cleanNum);
  }

  private static persist(list: SavedPredictionItem[]): void {
    memoryStore = list;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('zwtsp_favorites_updated'));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
}
