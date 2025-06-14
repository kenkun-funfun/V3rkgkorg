// src/stores/categoryStore.ts
import { createStore } from 'solid-js/store';
import { createSignal, createRoot } from 'solid-js';
import rawExample from '@/data/example.json';
import { extractHash } from '@/lib/utils';
import { set, get, deleteCategory } from '@/stores/categoryStore';

export type ImageItem = {
  base64?: string;
  url?: string;
  hash: string;
};

export type CategoryData = Record<string, ImageItem[]>;

function normalizeRawData(raw: any): CategoryData {
  if (raw.version === 'v1' && typeof raw.data === 'object') {
    const result: CategoryData = {};
    for (const [category, value] of Object.entries(raw.data)) {
      const { images } = value as any;
      result[category] = images.map((img: any) => ({
        base64: img.base64,
        url: img.url,
        hash: img.hash || (img.url ? extractHash(img.url) : ''),
      }));
    }
    return result;
  }

  if (typeof raw === 'object' && Object.values(raw).every(v => Array.isArray(v))) {
    const result: CategoryData = {};
    for (const [category, urls] of Object.entries(raw)) {
      result[category] = (urls as string[]).map((url) => ({
        url,
        hash: extractHash(url),
      }));
    }
    return result;
  }

  throw new Error("不明なJSON形式");
}

function createCategoryStore() {
  const [categoryData, setCategoryData] = createStore<CategoryData>(normalizeRawData(rawExample));
  const [pinnedCategories, setPinnedCategories] = createSignal<string[]>([]);

  const get = () => categoryData;

  const addCategory = (name: string): boolean => {
    if (!name.trim() || categoryData[name]) return false;
    setCategoryData(name, []);
    return true;
  };

  const removeCategory = (name: string): void => {
    (setCategoryData as any)(name, undefined);
    setPinnedCategories(pinnedCategories().filter((n) => n !== name));
    const selected = JSON.parse(localStorage.getItem('selectedCategories') || '[]');
    localStorage.setItem('selectedCategories', JSON.stringify(selected.filter((n: string) => n !== name)));
    const pinned = JSON.parse(localStorage.getItem('pinnedCategories') || '[]');
    localStorage.setItem('pinnedCategories', JSON.stringify(pinned.filter((n: string) => n !== name)));
  };


  const renameCategory = (oldName: string, newName: string): boolean => {
    if (!newName.trim() || categoryData[newName]) return false;
    const data = categoryData[oldName];
    setCategoryData(newName, data);
    (setCategoryData as any)(oldName, undefined);
    if (pinnedCategories().includes(oldName)) {
      setPinnedCategories([...pinnedCategories().filter((n) => n !== oldName), newName]);
    }
    return true;
  };

  const addImage = (category: string, image: ImageItem) => {
    if (!categoryData[category]) return;
    const prev = categoryData[category];
    setCategoryData(category, [...prev, image]);
  };

  const removeImage = (category: string, index: number) => {
    if (!categoryData[category]) return;
    const updated = [...categoryData[category]];
    updated.splice(index, 1);
    setCategoryData(category, updated);
  };

  const clearAll = () => {
    setCategoryData({});
  };

  const loadFromJson = (raw: any) => {
    const normalized = normalizeRawData(raw);
    setCategoryData(normalized);
  };

  const toJson = () => {
    return {
      version: 'v1',
      data: Object.fromEntries(
        Object.entries(categoryData).map(([key, value]) => [key, { images: value }])
      ),
    };
  };

  return {
    get,
    set: setCategoryData,
    deleteCategory: removeCategory,
    addCategory,
    removeCategory,
    renameCategory,
    addImage,
    removeImage,
    clearAll,
    loadFromJson,
    toJson,
    pinnedCategories,
    setPinnedCategories,
  };
}

export const {
  get,
  set,
  deleteCategory,
  addCategory,
  removeCategory,
  renameCategory,
  addImage,
  removeImage,
  clearAll,
  loadFromJson,
  toJson,
  pinnedCategories,
  setPinnedCategories,
} = createRoot(createCategoryStore);

export type { CategoryData };
export { normalizeRawData };

// 差分: 末尾あたりに以下を追加

export type MergeMode =
  | 'overwrite'
  | 'delete-add'
  | 'append'
  | 'rename-add'
  | 'reset-and-load';

export function loadFromJsonWithMode(
  raw: any,
  mode: MergeMode = 'overwrite',
  onProgress?: (index: number, total: number) => void
) {
  const normalized = normalizeRawData(raw);
  const current = get();
  const entries = Object.entries(normalized);

  switch (mode) {
    case 'overwrite':
      for (let i = 0; i < entries.length; i++) {
        const [name, images] = entries[i];
        set(name, images);
        onProgress?.(i + 1, entries.length);
      }
      break;

    case 'delete-add':
      for (let i = 0; i < entries.length; i++) {
        const [name, images] = entries[i];
        if (current[name]) deleteCategory(name);
        set(name, images);
        onProgress?.(i + 1, entries.length);
      }
      break;

    case 'append':
      for (let i = 0; i < entries.length; i++) {
        const [name, images] = entries[i];
        const existing = current[name] || [];
        set(name, [...existing, ...images]);
        onProgress?.(i + 1, entries.length);
      }
      break;

    case 'rename-add':
      for (let i = 0; i < entries.length; i++) {
        const [originalName, images] = entries[i];
        let name = originalName;
        let suffix = 2;
        while (current[name]) {
          name = `${originalName}_${suffix++}`;
        }
        set(name, images);
        onProgress?.(i + 1, entries.length);
      }
      break;

    case 'reset-and-load':
      Object.keys(current).forEach(deleteCategory);
      for (let i = 0; i < entries.length; i++) {
        const [name, images] = entries[i];
        set(name, images);
        onProgress?.(i + 1, entries.length);
      }
      break;

    default:
      console.warn(`Unknown load mode: ${mode}`);
  }
}

export type DuplicateReport = {
  category: string;
  before: number;
  after: number;
  removed: number;
};

export function getDuplicateReport(): DuplicateReport[] {
  const current = get();
  const reports: DuplicateReport[] = [];

  for (const [name, images] of Object.entries(current)) {
    const seen = new Set<string>();
    const filtered = images.filter((img) => {
      if (!img.hash) return true;
      if (seen.has(img.hash)) return false;
      seen.add(img.hash);
      return true;
    });
    const removed = images.length - filtered.length;
    if (removed > 0) {
      reports.push({ category: name, before: images.length, after: filtered.length, removed });
    }
  }

  return reports;
}

export function removeDuplicateImages(): number {
  const current = get();
  let totalRemoved = 0;

  for (const [name, images] of Object.entries(current)) {
    const seen = new Set<string>();
    const filtered = images.filter((img) => {
      if (!img.hash) return true;
      if (seen.has(img.hash)) return false;
      seen.add(img.hash);
      return true;
    });
    if (filtered.length !== images.length) {
      set(name, filtered);
      totalRemoved += images.length - filtered.length;
    }
  }

  return totalRemoved;
}

export function toJsonForCategory(name: string) {
  const all = get();
  const images = all[name];
  if (!images) throw new Error(`カテゴリ「${name}」が存在しません`);
  return {
    version: 'v1',
    data: {
      [name]: { images }
    }
  };
}
