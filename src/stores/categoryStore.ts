// src/stores/categoryStore.ts
import { createStore } from 'solid-js/store';
import { createSignal, createRoot } from 'solid-js';
import rawExample from '@/data/example.json';

export type ImageItem = {
  base64?: string;
  url?: string;
  hash: string;
};

export type CategoryData = {
  [category: string]: ImageItem[];
};

function extractHash(url: string): string {
  return url.split('/').pop()?.split('.')[0] || url;
}

export function normalizeRawData(raw: any): CategoryData {
  if (raw.version === 'v1' && typeof raw.data === 'object') {
    const result: CategoryData = {};
    for (const [category, value] of Object.entries(raw.data)) {
      result[category] = value.images.map((img: any) => ({
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
      result[category] = (urls as string[]).map((url) => {
        if (typeof url !== 'string') return { url: '', hash: '' };
        return {
          url,
          hash: extractHash(url),
        };
      });
    }
    return result;
  }

  throw new Error("不明なJSON形式");
}


let categoryDataCache: CategoryData | null = null;

function createCategoryStore() {
  const [categoryData, setCategoryData] = createStore<CategoryData>(
    categoryDataCache ?? normalizeRawData(rawExample)
  );

  if (!categoryDataCache) {
    categoryDataCache = categoryData;
  }

  const storedPins = localStorage.getItem('pinnedCategories');
  const [pinnedCategories, setPinnedCategories] = createSignal<string[]>(
    storedPins ? JSON.parse(storedPins) : []
  );

  const savePins = (pins: string[]) => {
    localStorage.setItem('pinnedCategories', JSON.stringify(pins));
    setPinnedCategories(pins);
  };

  const togglePin = (name: string) => {
    const current = pinnedCategories();
    if (current.includes(name)) {
      savePins(current.filter((n) => n !== name));
    } else {
      savePins([...current, name]);
    }
  };

  const addCategory = (name: string) => {
    if (!name.trim() || categoryData[name]) return false;
    setCategoryData(name, []);
    return true;
  };

  const deleteCategory = (name: string) => {
    setCategoryData(name, undefined);
    savePins(pinnedCategories().filter((n) => n !== name));

    // ✅ ローカルストレージからも削除
    const selected = JSON.parse(localStorage.getItem('selectedCategories') || '[]');
    localStorage.setItem('selectedCategories', JSON.stringify(selected.filter((n: string) => n !== name)));

    const pinned = JSON.parse(localStorage.getItem('pinnedCategories') || '[]');
    localStorage.setItem('pinnedCategories', JSON.stringify(pinned.filter((n: string) => n !== name)));
  };

  const renameCategory = (oldName: string, newName: string) => {
    if (!newName.trim() || categoryData[newName]) return false;
    const data = categoryData[oldName];
    deleteCategory(oldName);
    setCategoryData(newName, data);
    if (pinnedCategories().includes(oldName)) {
      savePins([...pinnedCategories().filter((n) => n !== oldName), newName]);
    }
    return true;
  };

  const addImage = (category: string, image: ImageItem) => {
    if (!categoryData[category]) return;
    setCategoryData(category, [...categoryData[category], image]);
  };

  const removeImage = (category: string, index: number) => {
    if (!categoryData[category]) return;
    const updated = [...categoryData[category]];
    updated.splice(index, 1);
    setCategoryData(category, updated);
  };

  return {
    categoryData,
    setCategoryData,
    pinnedCategories,
    togglePin,
    addCategory,
    deleteCategory,
    renameCategory,
    addImage,
    removeImage
  };
}

export const {
  categoryData,
  setCategoryData,
  pinnedCategories,
  togglePin,
  addCategory,
  deleteCategory,
  renameCategory,
  addImage,
  removeImage
} = createRoot(createCategoryStore);
