
import { createSignal } from 'solid-js';
import { normalizeRawData } from '@/stores/categoryStore'; // ← 追加

type Props = {
  onLoad: (data: Record<string, { images: { base64?: string; url?: string; hash: string }[] }>) => void;
  onClose: () => void;
};

export default function LoadModal(props: Props) {
  const [error, setError] = createSignal<string | null>(null);

  const handleFile = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    try {
      const text = await file.text();
      const raw = JSON.parse(text);

      const normalized: { version: 'v1'; data: Record<string, { images: { url?: string; base64?: string; hash: string }[] }> } = {
        version: 'v1',
        data: {}
      };

      if (raw.version === 'v1' && typeof raw.data === 'object') {
        Object.assign(normalized.data, raw.data);
      } else {
        for (const key in raw) {
          const value = raw[key];
          if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
            normalized.data[key] = {
              images: value.map((url: string) => ({ url, hash: url }))
            };
          }
        }
      }

      props.onLoad(normalized.data);
      props.onClose();
    } catch (err) {
      console.error("JSON読み込みエラー:", err);
      setError('JSONの読み込みに失敗しました。形式をご確認ください。');
    }
  };

  return (
    <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button class="absolute top-2 right-2 text-zinc-500 hover:text-zinc-800" onClick={props.onClose}>×</button>
        <h2 class="text-lg font-bold mb-4">カテゴリデータの読み込み</h2>
        <p class="text-sm mb-4">保存済みのJSONファイルを読み込んで、カテゴリデータを置き換えます。</p>
        <input type="file" accept=".json" onChange={handleFile} class="mb-4" />
        {error() && <p class="text-red-600 text-sm">{error()}</p>}
        <div class="flex justify-end mt-6">
          <button class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100" onClick={props.onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
}
