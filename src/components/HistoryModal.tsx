// src/components/HistoryModal.tsx
import { For } from 'solid-js';
import { X } from 'lucide-solid';

type Props = {
  images: string[];
  onClose: () => void;
};

export default function HistoryModal(props: Props) {
  return (
    <>
      {/* 🔳 背景を覆うオーバーレイ */}
      <div class="fixed inset-0 bg-black/50 z-40"/>

      {/* 📚 モーダル本体 */}
      <div class="fixed top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-black border border-zinc-600 rounded-lg shadow-lg z-50 max-w-3xl w-full max-h-[80vh] overflow-y-auto p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-black dark:text-white">📚 再生履歴</h2>
          <button onClick={props.onClose}>
            <X class="text-black dark:text-white" size={20} />
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <For each={props.images}>
            {(src) => (
              <a href={src} target="_blank" rel="noopener noreferrer">
                <img
                  src={src}
                  alt="履歴画像"
                  loading="lazy"
                  class="w-full h-auto object-contain rounded shadow hover:shadow-lg transition cursor-pointer"
                />
              </a>
            )}
          </For>
        </div>

        <button
          onClick={props.onClose}
          class="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          閉じる
        </button>
      </div>
    </>
  );
}

