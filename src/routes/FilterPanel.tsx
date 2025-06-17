// src/routes/FilterPanel.tsx
import { createSignal, createEffect } from 'solid-js';
import { X } from 'lucide-solid';
import { t } from '@/stores/i18nStore';

type Props = {
  onClose: () => void;
  onChange: (filter: string) => void;
};

export default function FilterPanel(props: Props) {
  const [mode, setMode] = createSignal('');
  const [brightness, setBrightness] = createSignal(100);

  createEffect(() => {
    const parts = [];
    if (mode()) parts.push(mode());
    parts.push(`brightness(${brightness()}%)`);
    props.onChange(parts.join(' '));
  });

  const stop = (e: MouseEvent) => e.stopPropagation();

  return (
    <div
      class="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 border-t border-white z-40"
      onClick={stop}
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">{t('filter_panel_title')}</h2>
        <button onClick={(e) => { e.stopPropagation(); props.onClose(); }}>
          <X size={20} />
        </button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-sm mb-1">{t('filter_panel_color_mode')}</label>
          <select
            value={mode()}
            onChange={(e) => setMode(e.currentTarget.value)}
            class="w-full px-2 py-1 rounded text-black"
          >
            <option value="">{t('filter_color_normal')}</option>
            <option value="grayscale(100%)">{t('filter_color_grayscale')}</option>
            <option value="sepia(100%)">{t('filter_color_sepia')}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm mb-1">{t('filter_panel_brightness')}: {brightness()}%</label>
          <input
            type="range"
            min="50"
            max="150"
            value={brightness()}
            onInput={(e) => setBrightness(Number(e.currentTarget.value))}
            class="w-full"
          />
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); props.onClose(); }}
          class="mt-2 px-4 py-2 bg-white text-black rounded"
        >
          {t('filter_panel_close')}
        </button>
      </div>
    </div>
  );
}

