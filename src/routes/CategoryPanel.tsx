// src/routes/CategoryPanel.tsx

import { createSignal, For, Show } from 'solid-js';
import { X, Pin, PinOff } from 'lucide-solid';
import { categoryData } from '@/stores/categoryStore';

type Props = {
  selected: string[];
  setSelected: (value: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
};

const pinnedKey = 'pinnedCategories';

export default function CategoryPanel(props: Props) {
  const [pinned, setPinned] = createSignal<string[]>(
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem(pinnedKey) || '[]')
      : []
  );
  const [search, setSearch] = createSignal('');

  const togglePin = (name: string) => {
    const next = pinned().includes(name)
      ? pinned().filter((n) => n !== name)
      : [...pinned(), name];
    setPinned(next);
    // ✅ categoryData に存在するものだけ保存
    const valid = next.filter((n) => categoryData[n]);
    localStorage.setItem(pinnedKey, JSON.stringify(valid));
  };

  const toggleSelect = (name: string) => {
    const current = props.selected ?? [];
    const updated = current.includes(name)
      ? current.filter((n) => n !== name)
      : [...current, name];
    props.setSelected(updated);
    // ✅ categoryData に存在するものだけ保存
    const valid = updated.filter((n) => categoryData[n]);
    localStorage.setItem('selectedCategories', JSON.stringify(valid));
  };


  const filteredNames = () => {
    const all = Object.keys(categoryData);
    const query = search().toLowerCase();
    return [
      ...pinned().filter((n) => all.includes(n) && n.toLowerCase().includes(query)),
      ...all
        .filter((n) => !pinned().includes(n) && n.toLowerCase().includes(query))
        .sort(),
    ];
  };

  return (
    <Show when={props.isOpen}>
      <aside class="absolute right-0 top-0 h-screen max-w-xs w-full z-50 bg-white dark:bg-zinc-900 text-black dark:text-white shadow-lg border-l border-zinc-700 flex flex-col">
        <div class="flex items-center justify-between px-4 py-2 border-b border-zinc-700">
          <h2 class="font-bold">カテゴリ</h2>
          <button onClick={props.onClose}><X size={18} /></button>
        </div>

        <div class="p-3">
          <input
            type="text"
            placeholder="カテゴリ検索..."
            value={search()}
            onInput={(e) => setSearch(e.currentTarget.value)}
            class="w-full px-3 py-2 rounded border bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
          />
        </div>

        <div class="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
          <For each={filteredNames()}>{(name) => (
            <label class="flex justify-between items-center gap-2 text-sm">
              <span>
                <input
                  type="checkbox"
                  checked={props.selected?.includes(name) ?? false}
                  onChange={() => toggleSelect(name)}
                  class="mr-2"
                />
                {name}
              </span>
              <button onClick={() => togglePin(name)}>
                {pinned().includes(name) ? <Pin size={16} /> : <PinOff size={16} />}
              </button>
            </label>
          )}</For>
        </div>
      </aside>
    </Show>
  );
}
