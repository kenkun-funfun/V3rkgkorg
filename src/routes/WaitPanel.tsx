// src/routes/WaitPanel.tsx
import { createSignal, onMount, For, Show } from 'solid-js';
import type { Setter } from 'solid-js';
import type { ModeType } from '@/lib/constants';
import { panelSelectedCategories } from '@/stores/categoryStore';
import { t } from '@/stores/i18nStore';
import { chimeEnabled, setChimeEnabled } from '@/stores/playSettings';

type Props = {
  setMode: Setter<ModeType>;
  onStart: (selected: string[]) => void;
  onToggleCategoryPanel: () => void;
  onOpenLoadModal: () => void;
};

export default function WaitPanel(props: Props) {
  const [minute, setMinute] = createSignal(5);
  const [second, setSecond] = createSignal(0);
  const [shuffle, setShuffle] = createSignal(true);
  const [keyboardEnabled, setKeyboardEnabled] = createSignal(true);
  const [tapEnabled, setTapEnabled] = createSignal(true);
  const [maxPlays, setMaxPlays] = createSignal(10);
  const [countdownEnabled, setCountdownEnabled] = createSignal(true); // ✅ 初期値オン
  const [countdownSeconds, setCountdownSeconds] = createSignal(3);    // ✅ 初期値3秒
  const updateDuration = (m: number, s: number) => {
    const str = `${m}:${s.toString().padStart(2, '0')}`;
    localStorage.setItem('duration', str);
  };

  onMount(() => {
    const d = localStorage.getItem('duration');
    if (d) {
      const [m, s] = d.split(':').map(Number);
      setMinute(Number.isFinite(m) ? m : 5);
      setSecond(Number.isFinite(s) ? s : 0);
    }

    const s = localStorage.getItem('shuffle');
    if (s !== null) setShuffle(s === 'true');

    const k = localStorage.getItem('keyboardEnabled');
    if (k !== null) setKeyboardEnabled(k === 'true');

    const t = localStorage.getItem('tapEnabled');
    if (t !== null) setTapEnabled(t === 'true');

    const m = localStorage.getItem('maxPlays');
    if (m !== null && !isNaN(parseInt(m))) setMaxPlays(parseInt(m));

    const ce = localStorage.getItem('countdownEnabled');
    if (ce !== null) setCountdownEnabled(ce === 'true');

    const cd = localStorage.getItem('countdownSeconds');
    if (cd !== null) setCountdownSeconds(parseInt(cd));

    const ch = localStorage.getItem('chimeEnabled');
    if (ch !== null) setChimeEnabled(ch === 'true');

  });


  const handleStart = () => {
    const selected = panelSelectedCategories();
    if (selected.length === 0) {
      alert(t('wait_select_category'));
      return;
    }
    updateDuration(minute(), second());
    localStorage.setItem('shuffle', String(shuffle()));
    localStorage.setItem('keyboardEnabled', String(keyboardEnabled()));
    localStorage.setItem('tapEnabled', String(tapEnabled()));
    localStorage.setItem('maxPlays', String(maxPlays()));
    localStorage.setItem('countdownEnabled', String(countdownEnabled()));
    localStorage.setItem('countdownSeconds', String(countdownSeconds()));
    localStorage.setItem('chimeEnabled', String(chimeEnabled()));
    props.onStart(selected);
  };

  return (
    <div class="flex flex-col items-center justify-center px-4 py-6 w-full h-full overflow-hidden">
<div class="w-full max-w-md h-full overflow-y-auto space-y-6 bg-zinc-800 dark:bg-zinc-900 p-6 rounded-lg shadow border border-zinc-700 relative">
        <div class="space-y-4 w-full">
          {/* Timer (min/sec) */}
          <div>
            <label class="block text-sm font-semibold text-white mb-1">
              {t('wait_timer_label')}
            </label>
            <div class="flex gap-2">
              <select
                value={minute()}
                onChange={(e) => {
                  const m = parseInt(e.currentTarget.value);
                  setMinute(m);
                  updateDuration(m, second());
                }}
                class="w-1/2 px-2 py-1 rounded border bg-white dark:bg-zinc-800 text-black dark:text-white"
              >
                <For each={[...Array(61).keys()]}>
                  {(v) => <option value={v}>{v} {t('minutes')}</option>}
                </For>
              </select>
              <select
                value={second()}
                onChange={(e) => {
                  const s = parseInt(e.currentTarget.value);
                  setSecond(s);
                  updateDuration(minute(), s);
                }}
                class="w-1/2 px-2 py-1 rounded border bg-white dark:bg-zinc-800 text-black dark:text-white"
              >
                <For each={[...Array(61).keys()]}>
                  {(v) => (
                    <option
                      value={v}
                      disabled={minute() === 0 && v === 0} // ✅ 0:00 を禁止
                    >
                      {v} {t('seconds')}
                    </option>
                  )}
                </For>
              </select>
            </div>
          </div>

          {/* Number of images + Countdown Settings (responsive grid) */}
          <div class="grid grid-cols-2 sm:grid-cols-1 gap-4">
            {/* Number of images */}
            <div>
              <label class="block text-sm font-semibold text-white mb-1">
                {t('wait_max_plays')}
              </label>
              <select
                value={maxPlays()}
                onChange={(e) => {
                  const value = parseInt(e.currentTarget.value, 10);
                  setMaxPlays(value);
                  localStorage.setItem('maxPlays', String(value));
                }}
                class="w-full px-2 py-1 rounded border bg-white dark:bg-zinc-800 text-black dark:text-white"
              >
                <For each={Array.from({ length: 100 }, (_, i) => i + 1)}>
                  {(n) => <option value={n}>{n}</option>}
                </For>
              </select>
            </div>

            {/* Countdown toggle + seconds */}
            <div>
              <label class="inline-flex items-center gap-2 mb-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={countdownEnabled()}
                  onChange={(e) => {
                    const value = e.currentTarget.checked;
                    setCountdownEnabled(value);
                    localStorage.setItem('countdownEnabled', String(value));
                  }}
                />
                {t('wait_countdown_label')}
              </label>
              <select
                value={countdownSeconds()}
                onChange={(e) => {
                  const value = parseInt(e.currentTarget.value, 10);
                  setCountdownSeconds(value);
                  localStorage.setItem('countdownSeconds', String(value));
                }}
                class="w-full px-2 py-1 rounded border bg-white dark:bg-zinc-800 text-black dark:text-white"
              >
                <For each={Array.from({ length: 8 }, (_, i) => i + 3)}>
                  {(n) => <option value={n}>{n} {t('seconds')}</option>}
                </For>
              </select>
            </div>
          </div>

          {/* チェックボックス設定 */}
          <div class="grid grid-cols-2 gap-2 pt-2 text-sm text-white">

            {/* シャッフル */}
            <label class="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={shuffle()}
                onChange={(e) => {
                  setShuffle(e.currentTarget.checked);
                  localStorage.setItem('shuffle', String(e.currentTarget.checked));
                }}
              />
              {t('wait_enable_shuffle')}
            </label>

            {/* キーボード操作 */}
            <label class="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={keyboardEnabled()}
                onChange={(e) => {
                  setKeyboardEnabled(e.currentTarget.checked);
                  localStorage.setItem('keyboardEnabled', String(e.currentTarget.checked));
                }}
              />
              {t('wait_enable_keyboard')}
            </label>

            {/* タップ操作 */}
            <label class="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={tapEnabled()}
                onChange={(e) => {
                  setTapEnabled(e.currentTarget.checked);
                  localStorage.setItem('tapEnabled', String(e.currentTarget.checked));
                }}
              />
              {t('wait_enable_tap')}
            </label>


            {/* チャイム音 */}
            <label class="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={chimeEnabled()}
                onChange={(e) => {
                  const value = e.currentTarget.checked;
                  setChimeEnabled(value);
                  localStorage.setItem('chimeEnabled', String(value));
                }}
              />
              {t('wait_chime_label')}
            </label>

          </div>


          {/* カテゴリ選択ボタン＋再生ボタン：スマホでは縦、PCでは横並び */}
          <div class="pt-4">
            <div class="flex flex-col sm:flex-row gap-y-2 sm:gap-4">
              <button
                class="bg-zinc-600 text-white px-4 py-2 rounded-lg font-bold w-full hover:bg-zinc-700 transition"
                onClick={props.onOpenLoadModal}
              >
                {t('load_title')}
              </button>

              <button
                class="bg-green-600 text-white px-4 py-2 rounded-lg font-bold w-full hover:bg-green-700 transition"
                onClick={props.onToggleCategoryPanel}
              >
                {t('wait_select_category_button')}
              </button>

              <button
                class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold w-full hover:bg-blue-700 transition"
                onClick={handleStart}
              >
                ▶ {t('play')}
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>

  );
}
