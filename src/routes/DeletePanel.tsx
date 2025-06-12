// src/routes/DeletePanel.tsx
import { X, Trash2 } from 'lucide-solid';

export default function DeletePanel(props: { onCancel: () => void; onConfirm: () => void }) {
  const handleClick = (e: MouseEvent) => e.stopPropagation(); // 伝播防止

  return (
    <div
      class="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 border-t border-white z-50"
      onClick={handleClick}
    >
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-2">
          <Trash2 size={20} />
          <h2 class="text-lg font-bold">画像の削除</h2>
        </div>
        <button onClick={(e) => { e.stopPropagation(); props.onCancel(); }}>
          <X size={20} />
        </button>
      </div>

      <div class="space-y-4">
        <p class="text-sm">この画像を削除しますか？削除すると元に戻せません。</p>

        <div class="flex justify-end gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); props.onCancel(); }}
            class="px-4 py-2 bg-white text-black rounded hover:bg-zinc-200 transition"
          >
            キャンセル
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); props.onConfirm(); }}
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}

