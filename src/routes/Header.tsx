// src/routes/Header.tsx
import type { Component } from 'solid-js';
import { MODE } from '@/lib/constants';
import type { ModeType } from '@/lib/constants'; // ✅ こっちが正しい型
import { Timer, X, Settings, FileClock } from 'lucide-solid';
import { Show } from 'solid-js';

type Props = {
  mode: ModeType; // ✅ これが正しい
  timeLeft: number;
  onOpenCategoryManager: () => void;
  onReset?: () => void;
  currentIndex?: number;
  totalCount?: number;
  onShowHistory?: () => void;
};

const Header: Component<Props> = (props) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(1, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header class="flex justify-between items-center px-4 py-2 bg-zinc-900 text-white border-b border-white">

      {/* === 左：操作ボタン === */}
      <div class="flex gap-2">
        <Show when={props.mode === MODE.START_SCREEN}>
          <button
            class="flex items-center gap-1 px-2 py-1 rounded border border-white hover:bg-white hover:text-black text-sm"
            onClick={props.onOpenCategoryManager}
          >
            <Settings size={16} />
            カテゴリ管理
          </button>
        </Show>

        <button
          class="flex items-center gap-1 px-2 py-1 rounded border border-white hover:bg-white hover:text-black text-sm select-none"
          onClick={props.onShowHistory}
        >
          <FileClock size={16} />
          再生履歴
        </button>
      </div>

      {/* === 中央：タイマー・再生枚数 === */}
      <div class="flex flex-col items-center text-xs select-none">
        <Show when={props.mode !== MODE.START_SCREEN}>
          <div class="flex items-center gap-1">
            <Timer size={14} />
            <span>残り {formatTime(props.timeLeft)}</span>
          </div>
        </Show>
        <Show when={props.mode === MODE.RUNNING && props.totalCount}>
          <div>{props.currentIndex! + 1} / {props.totalCount}</div>
        </Show>
      </div>

      {/* === 右：リセットボタン（またはプレースホルダ）=== */}
      <div class="w-[100px] flex justify-end">
        <Show when={props.mode !== MODE.START_SCREEN && props.onReset}>
          <button
            class="px-2 py-1 rounded border border-white hover:bg-white hover:text-black"
            onClick={props.onReset}
          >
            <X size={16} />
          </button>
        </Show>
      </div>
    </header>
  );
};

export default Header;
