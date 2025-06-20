// src/components/LanguageModal.tsx
import { Show } from 'solid-js';
import { X } from 'lucide-solid';
import { lang, setLang, t } from '@/stores/i18nStore';

const LANGUAGES = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ru', label: 'Русский' },
  { code: 'ko', label: '한국어' },
  { code: 'th', label: 'ภาษาไทย' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
];

type Props = {
  onClose: () => void;
};

export default function LanguageModal(props: Props) {
  let isClickOnBackdrop = false;

  return (
    <div
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onMouseDown={(e) => {
        isClickOnBackdrop = e.target === e.currentTarget;
      }}
      onMouseUp={(e) => {
        if (isClickOnBackdrop && e.target === e.currentTarget) {
          props.onClose();
        }
      }}
    >
      <div class="bg-white dark:bg-zinc-800 text-black dark:text-white p-6 rounded shadow-lg w-full max-w-xs max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">{t('language')}</h2>
          <button onClick={props.onClose}>
            <X class="text-black dark:text-white" size={20} />
          </button>
        </div>

        <div class="space-y-2">
          {LANGUAGES.map((l) => (
            <button
              class={`w-full px-4 py-2 rounded border text-left
                ${lang() === l.code
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-zinc-700 text-black dark:text-white border-black/20 dark:border-white/20'}`}
              onClick={() => {
                setLang(l.code);
                props.onClose();
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
