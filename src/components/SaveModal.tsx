// src/components/SaveModal.tsx
import { X, Download } from 'lucide-solid';
import { downloadJson } from '@/lib/jsonUtil';
import { toJson, toJsonForCategory } from '@/stores/categoryStore';

type Props = {
  onClose: () => void;
};

export default function SaveModal(props: Props) {
  const data = toJson();
  const categoryNames = Object.keys(data.data);

  const handleSaveAll = () => {
    downloadJson(data, 'category_data.json');
    props.onClose();
  };

  const handleSaveOne = (name: string) => {
    const json = toJsonForCategory(name);
    downloadJson(json, `${name}.json`);
  };

  return (
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-zinc-800 p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-black dark:text-white">📂 カテゴリデータ保存</h2>
          <button onClick={props.onClose}>
            <X class="text-black dark:text-white" size={20} />
          </button>
        </div>

        <p class="text-sm text-black dark:text-white mb-4">
          現在のカテゴリデータを JSON ファイルとして保存します。
        </p>

        {/* ✅ 一括保存ボタン */}
        <div class="mb-4">
          <button
            onClick={handleSaveAll}
            class="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Download size={16} />
            すべてを保存する
          </button>
        </div>

        {/* ✅ カテゴリ別保存リスト */}
        <div class="text-sm font-semibold text-black dark:text-white mb-2">カテゴリごとに保存：</div>
        <div class="overflow-y-auto max-h-[40vh] space-y-2 pr-1">
          {categoryNames.map((name) => (
            <div class="flex justify-between items-center text-sm bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white px-3 py-2 rounded">
              <span class="truncate">{name}</span>
              <button
                onClick={() => handleSaveOne(name)}
                class="text-blue-500 hover:text-blue-400 font-semibold"
              >
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
