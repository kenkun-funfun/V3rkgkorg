// src/components/UploadProgressModal.tsx
import { Show } from 'solid-js';
import { X, PauseCircle } from 'lucide-solid';

interface Props {
  visible: boolean;
  progressText: string;
  onClose: () => void;
  onAbort: () => void;
}

export default function UploadProgressModal(props: Props) {
  return (
    <Show when={props.visible}>
      <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-sm text-center relative">
          {/* Close button */}
          <button
            onClick={props.onClose}
            class="absolute top-2 right-2 text-black dark:text-white hover:text-red-500"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <h2 class="text-lg font-bold text-black dark:text-white mb-4">
            📤 アップロード中...
          </h2>

          {/* Progress text */}
          <p class="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap min-h-[2em]">
            {props.progressText}
          </p>

          {/* Controls */}
          <div class="mt-6 flex justify-center gap-4">
            <button
              onClick={props.onAbort}
              class="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              <PauseCircle size={18} /> 停止する
            </button>
            <button
              onClick={props.onClose}
              class="px-4 py-2 rounded bg-zinc-500 hover:bg-zinc-600 text-white font-semibold"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
