// src/components/ImageManager.tsx
import { createSignal, For, Show } from 'solid-js';
import { Trash2, UploadCloud } from 'lucide-solid';
import { addImage, removeImage } from '@/stores/categoryStore';
import { resizeAndConvertToBase64, generateHash } from '@/lib/utils';
import UploadProgressModal from './UploadProgressModal';

const [isDragOver, setIsDragOver] = createSignal(false);

type Props = {
  categoryName: string;
  images: { url?: string; base64?: string; hash: string }[];
};

export default function ImageManager(props: Props) {
  const [perPage, setPerPage] = createSignal(12);
  const [currentPage, setCurrentPage] = createSignal(1);

  const [showProgress, setShowProgress] = createSignal(false);
  const [progressText, setProgressText] = createSignal('');
  const [aborted, setAborted] = createSignal(false);

  const totalPages = () => Math.ceil(props.images.length / perPage());

  const paginatedImages = () => {
    const start = (currentPage() - 1) * perPage();
    return props.images.slice(start, start + perPage());
  };

  const handleFiles = async (name: string, files: File[]) => {
    setShowProgress(true);
    setAborted(false);
    setProgressText('');

    for (let i = 0; i < files.length; i++) {
      if (aborted()) {
        setProgressText(`⏹ 停止しました (${i} / ${files.length})`);
        break;
      }
      const file = files[i];
      const base64 = await resizeAndConvertToBase64(file, 1080, 1350);
      const hash = await generateHash(base64);
      addImage(name, { base64, hash });
      setProgressText(`${i + 1} / ${files.length} 処理中…`);
    }
    if (!aborted()) setProgressText('✅ 完了しました！');
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
      f.type.startsWith('image/')
    );
    handleFiles(props.categoryName, files);
  };

  const handleBrowse = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files) {
        handleFiles(props.categoryName, Array.from(input.files));
      }
    };
    input.click();
  };

  return (
    <div class="space-y-4">
      <UploadProgressModal
        visible={showProgress()}
        progressText={progressText()}
        onAbort={() => setAborted(true)}
        onClose={() => setShowProgress(false)}
      />

      {/* ドロップゾーン */}
      <div
        class={`rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-all
          ${isDragOver()
            ? 'border-blue-500 bg-blue-100 dark:bg-zinc-800'
            : 'border-gray-400 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-zinc-900'}
        `}
        onClick={handleBrowse}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleDrop(e);
        }}
      >
        <div class="flex flex-col items-center space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <UploadCloud size={32} />
          <span>ここに画像をドロップ、またはクリックして追加</span>
        </div>
      </div>

      {/* 表示数切替 */}
      <div class="flex justify-end items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span>表示件数:</span>
        <select
          value={perPage()}
          onChange={(e) => { setPerPage(Number(e.currentTarget.value)); setCurrentPage(1); }}
          class="border rounded px-2 py-1 bg-white dark:bg-zinc-800"
        >
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
        </select>
      </div>

      {/* 画像グリッド */}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <For each={paginatedImages()}>
          {(img, index) => {
            const globalIndex = (currentPage() - 1) * perPage() + index();
            return (
              <div class="relative group border rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={img.base64 || img.url}
                  alt="preview"
                  class="w-full h-auto object-contain"
                  loading="lazy"
                />
                <button
                  class="absolute top-1 right-1 bg-red-600 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition"
                  onClick={() => removeImage(props.categoryName, globalIndex)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          }}
        </For>
      </div>

      {/* ページネーション */}
      <Show when={totalPages() > 1}>
        <div class="flex justify-center items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <button
            disabled={currentPage() === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            class="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 disabled:opacity-50"
          >
            前へ
          </button>
          <span>
            {currentPage()} / {totalPages()}
          </span>
          <button
            disabled={currentPage() === totalPages()}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages(), prev + 1))}
            class="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 disabled:opacity-50"
          >
            次へ
          </button>
        </div>
      </Show>
    </div>
  );
}
