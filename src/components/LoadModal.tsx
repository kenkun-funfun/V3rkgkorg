// src/components/LoadModal.tsx
import { X, UploadCloud } from 'lucide-solid';
import type { ImageItem } from '@/stores/categoryStore';
import { loadFromJsonWithMode, type MergeMode } from '@/stores/categoryStore';
import { createSignal, Show } from 'solid-js';

type Props = {
  onClose: () => void;
};

const modeDescriptions: Record<MergeMode, string> = {
  overwrite: '同名カテゴリを上書きします',
  'delete-add': '同名カテゴリを削除してから追加します',
  append: '同名カテゴリがあればその中に画像を追加します（重複は考慮しません）',
  'rename-add': '同名カテゴリがあれば名前を変更して追加します（_2などを付加）',
  'reset-and-load': 'すべてのカテゴリを削除してから、JSONの内容を反映します',
};

export default function LoadModal(props: Props) {
  let fileInputRef: HTMLInputElement | undefined;
  const [mode, setMode] = createSignal<MergeMode>('overwrite');
  const [progressText, setProgressText] = createSignal('');
  const modeDescription = () => modeDescriptions[mode()];

  const handleFile = async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      loadFromJsonWithMode(raw, mode(), (i, total) => {
        setProgressText(`${i} / ${total} 処理中...`);
      });
      setProgressText('✅ 完了しました！');
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
        <div class="space-y-4 text-sm text-black dark:text-white mb-4">
          <p>保存された JSON ファイルを読み込んでカテゴリデータを更新します。</p>
          <div>
            <label class="block mb-1 font-semibold">読み込みモード：</label>
            <select
              value={mode()}
              onChange={(e) => setMode(e.currentTarget.value as MergeMode)}
              class="w-full px-2 py-1 rounded border bg-white dark:bg-zinc-700 text-black dark:text-white"
            >
              <option value="overwrite">上書き</option>
              <option value="delete-add">削除追加</option>
              <option value="append">追記</option>
              <option value="rename-add">リネーム追加</option>
              <option value="reset-and-load">初期化して読込</option>
            </select>
            <p class="mt-2 text-sm text-zinc-800 dark:text-zinc-200">
              {modeDescription()}
            </p>
          </div>
          <p class="text-xs opacity-80">{progressText()}</p>
        </div>
        {/* ファイル選択 */}
        <div class="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFile}
            class="block w-full text-sm text-black dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>
      </div>
    </div>
  );
}
