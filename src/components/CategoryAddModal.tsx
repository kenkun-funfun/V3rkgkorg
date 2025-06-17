// src/components/CategoryAddModal.tsx
import { createSignal } from 'solid-js';
import { X, Plus } from 'lucide-solid';
import { t } from '@/stores/i18nStore';

type Props = {
  onAdd: (name: string) => void;
  onClose: () => void;
};

export default function CategoryAddModal(props: Props) {
  const [name, setName] = createSignal('');

  const handleAdd = () => {
    const trimmed = name().trim();
    if (trimmed) props.onAdd(trimmed);
    props.onClose();
  };

  return (
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-zinc-800 p-6 rounded shadow-lg w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-black dark:text-white">➕ {t('category_add_title')}</h2>
          <button onClick={props.onClose}>
            <X size={20} class="text-black dark:text-white" />
          </button>
        </div>
        <input
          type="text"
          placeholder={t('category_add_placeholder')}
          class="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-500 text-black dark:text-white mb-4"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
        />
        <div class="flex justify-end">
          <button
            onClick={handleAdd}
            class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            {t('category_add_button')}
          </button>
        </div>
      </div>
    </div>
  );
}
