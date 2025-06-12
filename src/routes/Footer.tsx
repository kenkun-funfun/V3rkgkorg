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
        <div class="flex justify-center gap-4">
          <button onClick={props.onPrev} class="p-2 rounded border border-white hover:bg-white/10">
            <SkipBack />
          </button>
          <button onClick={props.onTogglePause} class="p-2 rounded border border-white hover:bg-white/10">
            {props.mode === MODE.RUNNING ? <Pause /> : <Play />}
          </button>
          <button onClick={props.onNext} class="p-2 rounded border border-white hover:bg-white/10">
            <SkipForward />
          </button>
          <button onClick={props.onReset} class="p-2 rounded border border-white hover:bg-white/10">
            <Repeat />
          </button>
        </div>

        <div class="flex justify-center gap-4">
          <button
            onClick={props.onFlipX}
            class={getToggleButtonClasses(props.isFlippedX)}
          >
            <FlipHorizontal class={getIconColor(props.isFlippedX)} />
          </button>
          <button
            onClick={props.onFlipY}
            class={getToggleButtonClasses(props.isFlippedY)}
          >
            <FlipVertical class={getIconColor(props.isFlippedY)} />
          </button>
          <button onClick={props.onFilterToggle} class="p-2 rounded border border-white hover:bg-white/10">
            <Settings />
          </button>
          <button onClick={props.onDelete} class="p-2 rounded border border-white hover:bg-white/10">
            <Trash />
          </button>
        </div>
      </Show>

      <Show when={props.mode === MODE.START_SCREEN}>
        <div class="flex justify-center">
          <a
            href="https://x.com/rkgk_org"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1 text-sm underline text-zinc-400 hover:text-white transition"
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
