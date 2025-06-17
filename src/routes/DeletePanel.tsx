// src/routes/DeletePanel.tsx
import { X, Trash2, Info } from 'lucide-solid';
import { t } from '@/stores/i18nStore';

export default function DeletePanel(props: { onCancel: () => void; onConfirm: () => void }) {
  const handleClick = (e: MouseEvent) => e.stopPropagation(); // 伝播防止

  return (
    <div
      class="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 border-t border-white z-50"
      onClick={handleClick}
    >
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-2">
          <Trash2 size={20} />
          <h2 class="text-lg font-bold">{t('delete_title')}</h2>
        </div>
        <button onClick={(e) => { e.stopPropagation(); props.onCancel(); }}>
          <X size={20} />
        </button>
      </div>

      <div class="space-y-4">
        <div class="text-sm space-y-2">
          <p>{t('delete_confirm_message')}</p>
          <p class="flex items-start gap-1 text-zinc-200 text-xs">
            <Info size={16} class="mt-0.5 shrink-0" />
            {t('delete_notice')}
          </p>
        </div>
        <div class="flex justify-end gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); props.onCancel(); }}
            class="px-4 py-2 bg-white text-black rounded hover:bg-zinc-200 transition"
          >
            {t('delete_cancel')}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); props.onConfirm(); }}
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            {t('delete_confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

