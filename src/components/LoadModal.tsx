// src/components/LoadModal.tsx
import { X, UploadCloud } from 'lucide-solid';
import type { ImageItem } from '@/stores/categoryStore';
import { loadFromJsonWithMode, type MergeMode } from '@/stores/categoryStore';
import { createSignal, Show } from 'solid-js';
import { t } from '@/stores/i18nStore';

type Props = {
  onClose: () => void;
};

const modeDescriptionKeys: Record<MergeMode, keyof i18n['ja']> = {
  overwrite: 'mode_overwrite',
  'delete-add': 'mode_overwrite',
  append: 'mode_append',
  'rename-add': 'mode_rename_add',
  'reset-and-load': 'mode_reset',
};

export default function LoadModal(props: Props) {
  let fileInputRef: HTMLInputElement | undefined;
  const [mode, setMode] = createSignal<MergeMode>('overwrite');
  const [progressText, setProgressText] = createSignal('');

  const handleFile = async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      loadFromJsonWithMode(raw, mode(), (i, total) => {
        setProgressText(`${i} / ${total} ${t('load_progress_working')}`);
      });
      setProgressText(`✅ ${t('load_progress_done')}`);
      props.onClose();
    } catch (err) {
      alert(t('load_error_invalid'));
      console.error(t('load_error_log'), err);
    }
  };

  return (
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-zinc-800 p-6 rounded shadow-lg w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-black dark:text-white">📂 {t('load_title')}</h2>
          <button onClick={props.onClose}>
            <X class="text-black dark:text-white" size={20} />
          </button>
        </div>
        <div class="space-y-4 text-sm text-black dark:text-white mb-4">
          <p>{t('load_description')}</p>
          <div>
            <label class="block mb-1 font-semibold">{t('load_mode_label')}</label>
            <select
              value={mode()}
              onChange={(e) => setMode(e.currentTarget.value as MergeMode)}
              class="w-full px-2 py-1 rounded border bg-white dark:bg-zinc-700 text-black dark:text-white"
            >
              <option value="overwrite">{t('load_mode_delete_add')}</option>
              <option value="append">{t('load_mode_append')}</option>
              <option value="rename-add">{t('load_mode_rename_add')}</option>
              <option value="reset-and-load">{t('load_mode_reset')}</option>
            </select>
            <p class="mt-2 text-sm text-zinc-800 dark:text-zinc-200">
{t(modeDescriptionKeys[mode()])}
            </p>
          </div>
          <p class="text-xs opacity-80">{progressText()}</p>
        </div>
        {/* ファイル選択 */}
        <div class="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFile}
            class="block w-full text-sm text-black dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>
      </div>
    </div>
  );
}
