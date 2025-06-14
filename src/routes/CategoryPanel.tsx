// src/routes/CategoryPanel.tsx

import { createSignal, For, Show } from 'solid-js';
import { X, Pin, PinOff } from 'lucide-solid';
import {
  get,
  panelSelectedCategories,
  setPanelSelectedCategories,
  pinnedCategories,
  setPinnedCategories
} from '@/stores/categoryStore';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CategoryPanel(props: Props) {
  const [search, setSearch] = createSignal('');

  const togglePin = (name: string) => {
    const next = pinnedCategories().includes(name)
      ? pinnedCategories().filter((n) => n !== name)
      : [...pinnedCategories(), name];
    setPinnedCategories(next);
  };

  const toggleSelect = (name: string) => {
    const current = panelSelectedCategories();
    const updated = current.includes(name)
      ? current.filter((n) => n !== name)
      : [...current, name];
    setPanelSelectedCategories(updated);
  };

  const filteredNames = () => {
    const all = Object.keys(get());
    const query = search().toLowerCase();
    return [
      ...pinnedCategories().filter((n) => all.includes(n) && n.toLowerCase().includes(query)),
      ...all
        .filter((n) => !pinnedCategories().includes(n) && n.toLowerCase().includes(query))
        .sort(),
    ];
  };

  return (
    <Show when={props.isOpen}>
      <aside class="absolute right-0 top-0 max-h-[100dvh] pb-[100px] w-full z-50 bg-white dark:bg-zinc-900 text-black dark:text-white shadow-lg border-l border-zinc-700 flex flex-col overflow-hidden">
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
            <div class="flex items-center justify-between px-2 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm">
              {/* 左側：チェックと名前 */}
              <label class="flex items-center gap-2 overflow-hidden flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={panelSelectedCategories().includes(name)}
                  onChange={() => toggleSelect(name)}
                />
                <span class="truncate">{name}</span>
              </label>

              {/* 右側：ピン */}
              <button
                onClick={() => togglePin(name)}
                class={`ml-2 p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${pinnedCategories().includes(name) ? 'text-red-500' : 'text-gray-400'}`}
                title="ピン"
              >
                {pinnedCategories().includes(name) ? <Pin size={16} /> : <PinOff size={16} />}
              </button>
            </div>
          )}</For>
        </div>

        {/* 閉じるボタン */}
        <div class="border-t border-zinc-700 p-4">
          <button
            class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={props.onClose}
          >
            閉じる
          </button>
        </div>
      </aside>
    </Show>
  );
}
