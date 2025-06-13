// src/stores/categoryStore.ts
import { createStore } from 'solid-js/store';
import { createSignal, createRoot } from 'solid-js';
import rawExample from '@/data/example.json';
import { extractHash } from '@/lib/utils';

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
