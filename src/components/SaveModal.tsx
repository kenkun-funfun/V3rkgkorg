
import { createSignal } from 'solid-js';
import { downloadJson } from '@/lib/jsonUtil';

type Props = {
  categoryData: Record<string, { images: { base64?: string; url?: string; hash: string }[] }>;
  onClose: () => void;
};

export default function SaveModal(props: Props) {
  const fileName = () => {
    const now = new Date();
    return `category_data_${now.toISOString().slice(0, 10)}.json`;
  };

  const handleSave = () => {
    const json = {
      version: 'v1',
      data: props.categoryData,
    };
    downloadJson(json, fileName());
    props.onClose();
  };

  return (
    <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button class="absolute top-2 right-2 text-zinc-500 hover:text-zinc-800" onClick={props.onClose}>×</button>
        <h2 class="text-lg font-bold mb-4">カテゴリデータの保存</h2>
        <p class="text-sm mb-4">現在のカテゴリデータをJSON形式で保存します。</p>
        <div class="flex justify-end gap-2 mt-6">
          <button class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100" onClick={props.onClose}>閉じる</button>
          <button class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
}
