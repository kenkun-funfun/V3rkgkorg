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
import { t } from '@/stores/i18nStore';

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
      <div class="fixed inset-0 bg-black/50 z-40">
        <aside class="absolute right-0 top-0 max-h-[100dvh] pb-[100px] w-full sm:w-[480px] z-50 bg-white dark:bg-zinc-900 text-black dark:text-white shadow-lg border-l border-zinc-700 flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-4 py-2 border-b border-zinc-700">
            <h2 class="font-bold">{t('category_panel_title')}</h2>
            <button onClick={props.onClose}><X size={18} /></button>
          </div>

          <div class="p-3 relative">
            <input
              type="text"
              placeholder={t('category_panel_search_placeholder')}
              value={search()}
              onInput={(e) => setSearch(e.currentTarget.value)}
              class="w-full px-3 py-2 pr-8 rounded border bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
            />

            <Show when={search()}>
              <button
                onClick={() => setSearch('')}
                class="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                aria-label={t('category_panel_clear_search')}
              >
                <X size={16} />
              </button>
            </Show>
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
                  <span class="truncate">{name}（{get()[name]?.length || 0}）</span>
                </label>

                {/* 右側：ピン */}
                <button
                  onClick={() => togglePin(name)}
                  class={`ml-2 p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${pinnedCategories().includes(name) ? 'text-red-500' : 'text-gray-400'}`}
                  title={t('category_panel_pin')}
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
              {t('category_panel_close')}
            </button>
          </div>
        </aside>
      </div>
    </Show>
  );
}
