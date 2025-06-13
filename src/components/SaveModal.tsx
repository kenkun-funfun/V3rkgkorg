// src/components/SaveModal.tsx
import { X, Download } from 'lucide-solid';
import { downloadJson } from '@/lib/jsonUtil';
import type { ImageItem } from '@/stores/categoryStore';

type Props = {
  categoryData: Record<string, ImageItem[]>;
  onClose: () => void;
};

export default function SaveModal(props: Props) {
  const handleSave = () => {
    const json = {
      version: 'v1',
      data: Object.fromEntries(
        Object.entries(props.categoryData).map(([key, value]) => [key, { images: value }])
      ),
    };
    downloadJson(json, 'category_data.json');
    props.onClose();
  };

  return (
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-zinc-800 p-6 rounded shadow-lg w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-black dark:text-white">📂 カテゴリデータ保存</h2>
          <button onClick={props.onClose}>
            <X class="text-black dark:text-white" size={20} />
          </button>
        </div>
        <p class="text-sm text-black dark:text-white mb-4">
          現在のカテゴリデータを JSON ファイルとして保存します。
        </p>
        <div class="flex justify-end">
          <button
            onClick={handleSave}
            class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Download size={16} />
            保存する
          </button>
        </div>
      </div>
    </div>
  );
}
