// src/routes/WaitPanel.tsx
import { createSignal, onMount, For } from 'solid-js';
import { Menu } from 'lucide-solid';
import { normalizedData } from '@/lib/data';

type Props = {
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
  onStart: (selected: string[]) => void;
  onToggleCategoryPanel: () => void;
};

export default function WaitPanel(props: Props) {
  const [minute, setMinute] = createSignal(5);
  const [second, setSecond] = createSignal(0);
  const [shuffle, setShuffle] = createSignal(false);
  const [keyboardEnabled, setKeyboardEnabled] = createSignal(true);
  const [tapEnabled, setTapEnabled] = createSignal(false);
  const [maxPlays, setMaxPlays] = createSignal(10);

  const updateDuration = (m: number, s: number) => {
    const str = `${m}:${s.toString().padStart(2, '0')}`;
    localStorage.setItem('duration', str);
  };

  onMount(() => {
    const d = localStorage.getItem('duration');
    if (d) {
      const [m, s] = d.split(':').map(Number);
      setMinute(m || 0);
      setSecond(s || 0);
    }
    const s = localStorage.getItem('shuffle');
    if (s) setShuffle(s === 'true');
    const k = localStorage.getItem('keyboardEnabled');
    if (k) setKeyboardEnabled(k === 'true');
    const t = localStorage.getItem('tapEnabled');
    if (t) setTapEnabled(t === 'true');
    const m = localStorage.getItem('maxPlays');
    if (m) setMaxPlays(parseInt(m));
    const c = localStorage.getItem('selectedCategories');
    if (c) props.setSelectedCategories(JSON.parse(c));
  });

  const handleStart = () => {
    if (props.selectedCategories.length === 0) {
      alert('カテゴリを選択してください');
      return;
    }
    props.onStart(props.selectedCategories);
  };

  return (
    <div class="flex flex-col items-center justify-center px-4 py-6 w-full h-full overflow-hidden">
      <div class="w-full max-w-md space-y-6 bg-zinc-800 dark:bg-zinc-900 p-6 rounded-lg shadow border border-zinc-700 relative">

        {/* カテゴリ選択ボタン */}
        <div class="pt-4">
          <button
            class="bg-green-600 text-white px-6 py-2 rounded-lg font-bold w-full hover:bg-green-700 transition"
            onClick={props.onToggleCategoryPanel}
          >
            カテゴリを選択する
          </button>
        </div>


        {/* タイマー設定 */}
        <div>
          <label class="block text-sm font-semibold text-white mb-1">タイマー（分:秒）</label>
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
              <For each={[...Array(61).keys()]}>{(v) => (
                <option value={v}>{v} 分</option>
              )}</For>
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
              <For each={[...Array(61).keys()]}>{(v) => (
                <option value={v}>{v} 秒</option>
              )}</For>
            </select>
          </div>
        </div>

        {/* 最大再生枚数 */}
        <div>
          <label class="block text-sm font-semibold text-white mb-1">最大再生枚数</label>
          <select
            value={maxPlays()}
            onChange={(e) => {
              const value = parseInt(e.currentTarget.value, 10);
              setMaxPlays(value);
              localStorage.setItem('maxPlays', String(value));
            }}
            class="w-full px-3 py-2 rounded border bg-white dark:bg-zinc-800 text-black dark:text-white"
          >
            <For each={Array.from({ length: 100 }, (_, i) => i + 1)}>
              {(n) => <option value={n}>{n}</option>}
            </For>
          </select>
        </div>

        {/* チェックボックス設定 */}
        <div class="space-y-2 pt-2">
          <label class="inline-flex items-center gap-2 text-sm text-white w-full">
            <input
              type="checkbox"
              checked={shuffle()}
              onChange={(e) => {
                setShuffle(e.currentTarget.checked);
                localStorage.setItem('shuffle', String(e.currentTarget.checked));
              }}
            />
            シャッフル再生を有効にする
          </label>

          <label class="inline-flex items-center gap-2 text-sm text-white w-full">
            <input
              type="checkbox"
              checked={keyboardEnabled()}
              onChange={(e) => {
                setKeyboardEnabled(e.currentTarget.checked);
                localStorage.setItem('keyboardEnabled', String(e.currentTarget.checked));
              }}
            />
            キーボード操作を有効にする
          </label>

          <label class="inline-flex items-center gap-2 text-sm text-white w-full">
            <input
              type="checkbox"
              checked={tapEnabled()}
              onChange={(e) => {
                setTapEnabled(e.currentTarget.checked);
                localStorage.setItem('tapEnabled', String(e.currentTarget.checked));
              }}
            />
            タップ操作を有効にする
          </label>
        </div>

        {/* 再生ボタン */}
        <div class="pt-4">
          <button
            class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold w-full hover:bg-blue-700 transition"
            onClick={handleStart}
          >
            ▶ 再生を開始する
          </button>

        </div>
      </div>
    </div>
  );
}
