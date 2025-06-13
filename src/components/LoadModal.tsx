// src/components/LoadModal.tsx
import { X, UploadCloud } from 'lucide-solid';
import type { ImageItem } from '@/stores/categoryStore';
import { loadFromJson } from '@/stores/categoryStore';

type Props = {
  onClose: () => void;
};

export default function LoadModal(props: Props) {
  let fileInputRef: HTMLInputElement | undefined;
  const handleFile = async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      loadFromJson(raw)
      props.onClose();
    } catch (err) {
      alert('JSONの読み込みに失敗しました。形式をご確認ください。');
      console.error('JSON読み込みエラー:', err);
    }
  };

  return (
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-zinc-800 p-6 rounded shadow-lg w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-black dark:text-white">📂 カテゴリデータ読み込み</h2>
          <button onClick={props.onClose}>
            <X class="text-black dark:text-white" size={20} />
          </button>
        </div>
        <p class="text-sm text-black dark:text-white mb-4">
          保存された JSON ファイルを読み込んでカテゴリデータを置き換えます。
        </p>
        <div class="flex justify-end">
          <input
            type="file"
            accept=".json"
            ref={(el) => (fileInputRef = el)}
            class="hidden"
            onChange={handleFile}
          />
          <button
            onClick={() => fileInputRef?.click()}
            class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <UploadCloud size={16} />
            読み込む
          </button>
        </div>
      </div>
    </div>
  );
}
