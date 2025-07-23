// src/components/CategoryList.tsx
import { For, createSignal, Show } from 'solid-js';
import {
  get,
  pinnedCategories,
  setPinnedCategories,
  addCategory,
  removeCategory,
  renameCategory,
  currentCategory,
  setCurrentCategory,
} from '@/stores/categoryStore';
import { Pencil, Trash2, Pin, PinOff, Plus, UploadCloud, DownloadCloud, Bug } from 'lucide-solid';
import DuplicateCheckModal from './DuplicateCheckModal';
import { t } from '@/stores/i18nStore';

type Props = {
  selected: string | null;
  onSelect: (name: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onAddCategory: () => void;
  onShowDuplicateModal: () => void;
};

export default function CategoryList(props: Props) {
  const [editing, setEditing] = createSignal<string | null>(null);
  const [inputValue, setInputValue] = createSignal('');
  const [filter, setFilter] = createSignal('');
  const [showDuplicateModal, setShowDuplicateModal] = createSignal(false);

  const handleRename = (oldName: string) => {
    const newNameStr = inputValue().trim();
    if (newNameStr && newNameStr !== oldName) {
      renameCategory(oldName, newNameStr);
    }
    setEditing(null);
  };

  const allCategories = () => {
    const all = Object.keys(get());
    const pinned = pinnedCategories();
    const rest = all.filter((name) => !pinned.includes(name));
    return [...pinned, ...rest].filter((name) =>
      name.toLowerCase().includes(filter().toLowerCase())
    );
  };

  return (
    <div class="space-y-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded p-2">
      <div class="flex justify-end gap-2 mb-1">
        <button
          onClick={() => props.onLoad()}
          class="p-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white"
          title={t('category_list_load')}
        >
          <UploadCloud size={18} />
        </button>
        <button
          onClick={() => props.onSave()}
          class="p-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white"
          title={t('category_list_save')}
        >
          <DownloadCloud size={18} />
        </button>
        <button
          onClick={() => props.onAddCategory()}
          class="p-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white"
          title={t('category_list_add')}
        >
          <Plus size={18} />
        </button>
        <button
          onClick={() => props.onShowDuplicateModal()}
          class="p-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white"
          title={t('category_list_duplicates')}
        >
          <Bug size={18} />
        </button>
      </div>

      {/* 🔍 検索 */}
      <div class="flex gap-2 mb-2">
        <input
          type="text"
          placeholder={t('category_list_search_placeholder')}
          class="flex-1 p-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white"
          value={filter()}
          onInput={(e) => setFilter(e.currentTarget.value)}
        />
      </div>

      <For each={allCategories()}>
        {(name) => (
          <div
            class={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-all duration-150 border-2 ${props.selected === name
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                : 'border-transparent bg-white dark:bg-zinc-800 hover:border-zinc-400'
              }`}
            onClick={() => props.onSelect(name)}
          >
            {editing() === name ? (
              <input
                type="text"
                value={inputValue()}
                onInput={(e) => setInputValue(e.currentTarget.value)}
                onBlur={() => handleRename(name)}
                onKeyDown={(e) => e.key === 'Enter' && handleRename(name)}
                class="flex-1 bg-white dark:bg-zinc-700 text-black dark:text-white border-b border-gray-400 dark:border-zinc-600 outline-none text-sm"
                autofocus
              />
            ) : (
              <span class="flex-1 truncate text-black dark:text-white">
                {name}（{get()[name]?.length || 0}）
              </span>
            )}

            <div class="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const next = pinnedCategories().includes(name)
                    ? pinnedCategories().filter((n) => n !== name)
                    : [...pinnedCategories(), name];
                  setPinnedCategories(next);
                }}
                class="p-1"
              >
                {pinnedCategories().includes(name) ? (
                  <Pin size={14} class="text-red-500" />
                ) : (
                  <PinOff size={14} class="text-zinc-500" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(name);
                  setInputValue(name);
                }}
                class="p-1 hover:text-blue-500"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(t('category_list_delete_confirm', { name })))
                    removeCategory(name);
                }}
                class="p-1 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
