// src/routes/Footer.tsx

import { Show } from 'solid-js';
import { MODE } from '@/lib/constants';
import type { ModeType } from '@/lib/constants';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  FlipVertical,
  FlipHorizontal,
  Settings,
  Trash,
} from 'lucide-solid';
import { getToggleButtonClasses, getIconColor } from '@/styles/buttonStates';
import { Sun, Moon } from 'lucide-solid';
import { themeStore } from '@/stores/themeStore';
import { Globe } from 'lucide-solid';
import { lang, setLang, t } from '@/stores/i18nStore';

const { theme, toggleTheme } = themeStore;

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
};

export default function Footer(props: Props) {
  return (
    <div class="w-full px-4 py-4 space-y-4">
      {/* RUNNING or PAUSED → 操作ボタン2段 */}
      <Show when={props.mode === MODE.RUNNING || props.mode === MODE.PAUSED}>
        <div class="flex flex-col md:flex-row justify-center gap-4">
          {/* 上段ボタン（再生制御） */}
          <div class="flex justify-center gap-4 w-full md:w-auto">
            <button
              onClick={props.onPrev}
              class="w-full md:w-auto flex-1 p-2 rounded border border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20"
            >
              <SkipBack />
            </button>
            <button
              onClick={props.onTogglePause}
              class={`w-full md:w-auto flex-1 p-2 rounded border ${props.mode === MODE.PAUSED
                ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'
                }`}
            >
              {props.mode === MODE.RUNNING ? <Pause /> : <Play />}
            </button>
            <button
              onClick={props.onNext}
              class="w-full md:w-auto flex-1 p-2 rounded border border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20"
            >
              <SkipForward />
            </button>
            <button
              onClick={props.onReset}
              class="w-full md:w-auto flex-1 p-2 rounded border border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20"
            >
              <Repeat />
            </button>
          </div>

          {/* 下段ボタン（表示制御） */}
          <div class="flex justify-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
            <button
              onClick={props.onFlipX}
              class={`w-full md:w-auto flex-1 p-2 rounded border ${props.isFlippedX
                ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'
                }`}
            >
              <FlipHorizontal />
            </button>

            <button
              onClick={props.onFlipY}
              class={`w-full md:w-auto flex-1 p-2 rounded border ${props.isFlippedY
                ? 'border-blue-500 bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20'
                }`}
            >
              <FlipVertical />
            </button>

            <button
              onClick={props.onFilterToggle}
              class="w-full md:w-auto flex-1 p-2 rounded border border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20"
            >
              <Settings />
            </button>
            <button
              onClick={props.onDelete}
              class="w-full md:w-auto flex-1 p-2 rounded border border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20"
            >
              <Trash />
            </button>
          </div>
        </div>
      </Show>

      <Show when={props.mode === MODE.START_SCREEN}>
        <div class="relative w-full flex flex-col items-center justify-center pt-2 pb-4">
          {/* 左下：テーマ＆言語 */}
          <div class="absolute left-4 bottom-4 flex items-center gap-2">
            <button
              onClick={toggleTheme}
              class="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white"
              title="テーマ切り替え"
            >
              <Show when={theme() === 'dark'} fallback={<Moon size={18} />}>
                <Sun size={18} />
              </Show>
            </button>
            <button
              class="flex items-center gap-1 px-2 py-1 rounded border border-zinc-400 dark:border-white hover:bg-white/10 dark:hover:bg-white/20 text-sm text-black dark:text-white"
              onClick={() => setLang(lang() === 'ja' ? 'en' : 'ja')}
              title={t('language')}
            >
              <Globe size={16} />
              {lang() === 'ja' ? 'ja' : 'en'}
            </button>
          </div>

          {/* 中央：Xリンク */}
          <a
            href="https://x.com/rkgk_org"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 flex items-center gap-1 text-sm underline text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M14.305 10.58 22.094 2h-2.003l-6.66 7.579L8.308 2H2l8.135 11.567L2 22h2.003l7.104-8.088L15.691 22H22l-7.695-11.42zm-2.51 2.863-.823-1.155L4.59 3.39h2.987l5.34 7.499.823 1.155 6.743 9.457h-2.987l-5.7-8.058z" />
            </svg>
            @rkgk_org
          </a>
        </div>

      </Show>

    </div>
  );
}
