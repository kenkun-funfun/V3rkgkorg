// src/components/ResetModal.tsx
import { X, Trash2 } from 'lucide-solid';

type Props = {
  onClose: () => void;
  onReset: () => void; // ✅ 追加
};

export default function ResetModal(props: Props) {
  const handleReset = () => {
    props.onReset(); // ✅ ここでカテゴリ削除処理
    props.onClose();
  };

  return (
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-zinc-800 p-6 rounded shadow-lg w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-black dark:text-white">🧹 カテゴリ初期化</h2>
          <button onClick={props.onClose}>
            <X class="text-black dark:text-white" size={20} />
          </button>
        </div>

        <p class="text-sm text-black dark:text-white mb-6">
          この操作は元に戻せません。
          すべてのカテゴリと画像を削除してもよろしいですか？
        </p>

        <div class="flex justify-end gap-2">
          <button
            onClick={props.onClose}
            class="px-4 py-2 bg-zinc-500 hover:bg-zinc-600 text-white rounded"
          >
            キャンセル
          </button>
          <button
            onClick={handleReset}
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            すべて削除する
          </button>
        </div>
      </div>
    </div>
  );
}
