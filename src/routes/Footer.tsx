// src/routes/Footer.tsx

import { Show, createSignal } from 'solid-js';
import { MODE } from '@/lib/constants';
import type { ModeType } from '@/lib/constants';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  FlipVertical,
  FlipHorizontal,
  Settings,
  Trash,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
} from 'lucide-solid';
import { getToggleButtonClasses, getIconColor } from '@/styles/buttonStates';
import { themeStore } from '@/stores/themeStore';
import { lang, setLang, t } from '@/stores/i18nStore';

const { theme, toggleTheme } = themeStore;
const isBlocked = () => props.countdown() !== null || props.isEnd;
const [expanded, setExpanded] = createSignal(false);

type Props = {
  mode: ModeType;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
  onReset: () => void;
  onFlipX: () => void;
  onFlipY: () => void;
  onFilterToggle: () => void;
  onDelete: () => void;
  onOpenCategoryManager: () => void;
  isFlippedX: boolean;
  isFlippedY: boolean;
  countdown: () => number | null;
  isEnd: boolean; // ✅ 新規追加：終了画像かどうか
};

export default function Footer(props: Props) {
  return (
    <>
      {/* RUNNING or PAUSED → 操作ボタン表示 */}
      <Show when={props.mode === MODE.RUNNING || props.mode === MODE.PAUSED}>
        <>
          {/* ✅ モバイル向け：トグル式 */}
          <div class="w-full px-4 py-4 space-y-4 lg:hidden">
            <div class="flex justify-center gap-4">
              <button onClick={props.onPrev} disabled={false} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'border-red-500 bg-red-600 hover:bg-red-700 text-white' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><SkipBack /></button>
              <button onClick={props.onTogglePause} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : props.mode === MODE.PAUSED ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}>
                {props.mode === MODE.RUNNING ? <Pause /> : <Play />}
              </button>
              <button onClick={props.onNext} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><SkipForward /></button>
              <button onClick={props.onReset} disabled={false} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'border-red-500 bg-red-600 hover:bg-red-700 text-white' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><RotateCcw /></button>
              <button onClick={() => setExpanded(!expanded())} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${expanded() ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`} aria-label="詳細操作を表示・非表示">
                {expanded() ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            <Show when={expanded()}>
              <div class="flex justify-center gap-4">
                <button onClick={props.onFlipX} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isFlippedX ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white' : props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><FlipHorizontal /></button>
                <button onClick={props.onFlipY} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isFlippedY ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white' : props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><FlipVertical /></button>
                <button onClick={props.onFilterToggle} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><Settings /></button>
                <button onClick={props.onDelete} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><Trash /></button>
              </div>
            </Show>
          </div>

          {/* ✅ デスクトップ向け：常時表示 */}
          <div class="hidden lg:flex justify-center gap-4 px-4 py-4">
            <button onClick={props.onPrev} disabled={false} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'border-red-500 bg-red-600 hover:bg-red-700 text-white' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><SkipBack /></button>
            <button onClick={props.onTogglePause} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : props.mode === MODE.PAUSED ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}>
              {props.mode === MODE.RUNNING ? <Pause /> : <Play />}
            </button>
            <button onClick={props.onNext} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><SkipForward /></button>
            <button onClick={props.onReset} disabled={false} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'border-red-500 bg-red-600 hover:bg-red-700 text-white' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><RotateCcw /></button>
            <button onClick={props.onFlipX} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isFlippedX ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white' : props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><FlipHorizontal /></button>
            <button onClick={props.onFlipY} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isFlippedY ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white' : props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><FlipVertical /></button>
            <button onClick={props.onFilterToggle} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><Settings /></button>
            <button onClick={props.onDelete} disabled={props.isEnd} class={`w-full flex-1 p-2 rounded border flex items-center justify-center ${props.isEnd ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600' : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'}`}><Trash /></button>
          </div>
        </>
      </Show>

      {/* START_SCREEN → 軽量なフッター */}
      <Show when={props.mode === MODE.START_SCREEN}>
        <div class="w-full px-4 py-2" />
      </Show>
    </>
  );
}
