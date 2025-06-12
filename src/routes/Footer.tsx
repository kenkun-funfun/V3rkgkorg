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

      {/* START_SCREEN → カテゴリ管理遷移ボタン */}
      <Show when={props.mode === MODE.START_SCREEN}>
        <div class="flex justify-center">
          <button
            class="text-sm underline"
            onClick={() => (window.location.href = "/manage")}
          >
            カテゴリ管理へ
          </button>
        </div>
      </Show>

    </div>
  );
}
