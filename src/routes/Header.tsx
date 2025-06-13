// src/routes/Header.tsx
import type { Component } from 'solid-js';
import { MODE } from '@/lib/constants';
import type { ModeType } from '@/lib/constants'; // ✅ こっちが正しい型
import { Timer, X, Settings } from 'lucide-solid';
import { Show } from 'solid-js';

type Props = {
  mode: ModeType; // ✅ これが正しい
  timeLeft: number;
  onOpenCategoryManager: () => void;
  onReset?: () => void;
  currentIndex?: number;
  totalCount?: number;
};

const Header: Component<Props> = (props) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(1, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header class="flex justify-between items-center px-4 py-2 bg-zinc-900 text-white border-b border-white">
      {/* カテゴリ管理へ */}
      <Show when={props.mode === MODE.START_SCREEN}>
        <button
          class="flex items-center gap-1 px-2 py-1 rounded border border-white hover:bg-white hover:text-black transition text-sm"
          onClick={props.onOpenCategoryManager}
        >
          <Settings size={16} />
          カテゴリ管理
        </button>
      </Show>
      {/* 残り時間 or モード */}
      <div class="flex items-center gap-2">
        {props.mode !== 'START_SCREEN' && (
          <>
            <Timer size={16} />
            <span>残り {formatTime(props.timeLeft)}</span>
          </>
        )}
      </div>
      {/* 再生中の枚数表示 */}
      <Show when={props.mode === MODE.RUNNING && props.totalCount}>
        <span class="text-xs text-white dark:text-zinc-300 ml-2">
          {props.currentIndex! + 1} / {props.totalCount}
        </span>
      </Show>
      {/* リセットボタン */}
      {props.mode !== 'START_SCREEN' && props.onReset ? (
        <button
          class="px-2 py-1 rounded border border-white hover:bg-white hover:text-black transition"
          onClick={props.onReset}
        >
          <X size={16} />
        </button>
      ) : (
        <div class="w-[32px]" /> // placeholder
      )}
    </header>
  );
};

export default Header;
