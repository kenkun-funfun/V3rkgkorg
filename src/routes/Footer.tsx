// src/routes/Footer.tsx

import { Show } from 'solid-js';
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
} from 'lucide-solid';
import { getToggleButtonClasses, getIconColor } from '@/styles/buttonStates';
import { themeStore } from '@/stores/themeStore';
import { lang, setLang, t } from '@/stores/i18nStore';

const { theme, toggleTheme } = themeStore;
const isBlocked = () => props.countdown() !== null || props.isEnd;

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
      {/* RUNNING or PAUSED → 操作ボタン2段 */}
      <Show when={props.mode === MODE.RUNNING || props.mode === MODE.PAUSED}>
        <div class="w-full px-4 py-4 space-y-4">
          <div class="flex flex-col md:flex-row justify-center gap-4">
            <div class="flex justify-center gap-4 w-full md:w-auto">
              <button
                onClick={props.onPrev}
                disabled={false}
                class={`w-full md:w-auto flex-1 p-2 rounded border ${props.isEnd
                  ? 'border-red-500 bg-red-600 hover:bg-red-700 text-white'
                  : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'
                  }`}
              >
                <SkipBack />
              </button>
              <button
                onClick={props.onTogglePause}
                disabled={props.isEnd}
                class={`w-full md:w-auto flex-1 p-2 rounded border ${props.isEnd
                  ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600'
                  : props.mode === MODE.PAUSED
                    ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white'
                    : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'
                  }`}
              >
                {props.mode === MODE.RUNNING ? <Pause /> : <Play />}
              </button>
              <button
                onClick={props.onNext}
                disabled={props.isEnd}
                class={`w-full md:w-auto flex-1 p-2 rounded border ${props.isEnd
                  ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600'
                  : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'
                  }`}
              >
                <SkipForward />
              </button>
              <button
                onClick={props.onReset}
                disabled={false}
                class={`w-full md:w-auto flex-1 p-2 rounded border ${props.isEnd
                  ? 'border-red-500 bg-red-600 hover:bg-red-700 text-white'
                  : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'
                  }`}
              >
                <RotateCcw />
              </button>
            </div>

            <div class="flex justify-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
              <button
                onClick={props.onFlipX}
                disabled={props.isEnd}
                class={`w-full md:w-auto flex-1 p-2 rounded border ${props.isFlippedX
                  ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white'
                  : props.isEnd
                    ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600'
                    : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'
                  }`}
              >
                <FlipHorizontal />
              </button>
              <button
                onClick={props.onFlipY}
                disabled={props.isEnd}
                class={`w-full md:w-auto flex-1 p-2 rounded border ${props.isFlippedY
                  ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white'
                  : props.isEnd
                    ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600'
                    : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'
                  }`}
              >
                <FlipVertical />
              </button>
              <button
                onClick={props.onFilterToggle}
                disabled={props.isEnd}
                class={`w-full md:w-auto flex-1 p-2 rounded border ${props.isEnd
                  ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600'
                  : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'
                  }`}
              >
                <Settings />
              </button>
              <button
                onClick={props.onDelete}
                disabled={props.isEnd}
                class={`w-full md:w-auto flex-1 p-2 rounded border ${props.isEnd
                  ? 'opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-600'
                  : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'
                  }`}
              >
                <Trash />
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* START_SCREEN → 軽量なフッター */}
      <Show when={props.mode === MODE.START_SCREEN}>
        <div class="w-full px-4 py-2" />
      </Show>
    </>
  );
}
