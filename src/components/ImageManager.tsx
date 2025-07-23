// src/components/ImageManager.tsx
import { createSignal, For, Show } from 'solid-js';
import { Trash2, UploadCloud, CircleAlert } from 'lucide-solid';
import { addImage, removeImage, currentCategory } from '@/stores/categoryStore';
import { resizeAndConvertToBase64, generateHash } from '@/lib/utils';
import { get } from '@/stores/categoryStore';
import { t } from '@/stores/i18nStore';
import { addToast } from './Toast';

const [isDragOver, setIsDragOver] = createSignal(false);
const [sortOrder, setSortOrder] = createSignal<'asc' | 'desc'>('desc');

export default function ImageManager() {
  const [perPage, setPerPage] = createSignal(12);
  const [currentPage, setCurrentPage] = createSignal(1);



  const images = () => {
    const category = currentCategory();
    if (!category) return [];
    const data = get();
    return data[category] || [];
  };

  const totalPages = () => Math.ceil(images().length / perPage());

  const paginatedImages = () => {
    const start = (currentPage() - 1) * perPage();
    const sorted = [...images()];
    if (sortOrder() === 'desc') sorted.reverse();
    return sorted.slice(start, start + perPage());
  };

  const handleFiles = async (files: File[]) => {
    const name = currentCategory();
    if (!name) {
      alert(t('image_upload_no_category'));
      return;
    }
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        const base64 = await resizeAndConvertToBase64(file, 1080, 1350, 'image/webp', 0.8);
        const hash = await generateHash(base64);
        addImage(name, { base64, hash });
        successCount++;
      } catch (err) {
        console.error('画像の追加に失敗:', err);
        failCount++;
      }
    }

    if (successCount > 0) {
      addToast(`${successCount} ${t('upload_success_suffix')}`, 'success');
    }
    if (failCount > 0) {
      addToast(`${failCount} ${t('upload_error_suffix')}`, 'error');
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
      f.type.startsWith('image/')
    );
    handleFiles(files);
  };

  const handleBrowse = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files) {
        handleFiles(Array.from(input.files));
      }
    };
    input.click();
  };

return (
  <div class="space-y-4 w-full">
    <div
      class={`rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-all
        ${isDragOver()
          ? 'border-blue-500 bg-blue-100 dark:bg-zinc-800'
          : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-zinc-800'}
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
        // handleDrop(e);
      }}
    >
      <div class="flex flex-col items-center space-y-2 text-sm text-gray-600 dark:text-gray-300 text-center">
        <UploadCloud size={32} />
        <span>{t('image_upload_hint')}</span>

        <div class="flex flex-col items-start gap-1 text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-start gap-2">
            <CircleAlert size={14} class="mt-0.5 shrink-0" />
            <span>{t('image_upload_drag_info1')}</span>
          </div>
          <div class="flex items-start gap-2">
            <CircleAlert size={14} class="mt-0.5 shrink-0" />
            <span>{t('image_upload_drag_info2')}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
      <div class="flex items-center gap-2">
        <span>{t('image_display_count')}</span>
        <select
          value={perPage()}
          onChange={(e) => {
            setPerPage(Number(e.currentTarget.value));
            setCurrentPage(1);
          }}
          class="border border-zinc-300 dark:border-zinc-600 rounded px-2 py-1 bg-white dark:bg-zinc-800"
        >
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <span>{t('image_sort_order')}</span>
        <button
          onClick={() => {
            setSortOrder(sortOrder() === 'asc' ? 'desc' : 'asc');
            setCurrentPage(1);
          }}
          class="px-3 py-1 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
        >
          {sortOrder() === 'asc' ? t('sort_asc') : t('sort_desc')}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <For each={paginatedImages()}>
        {(img, index) => {
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
                onClick={() => {
                  const name = currentCategory();
                  if (!name) return;

                  const original = [...images()];
                  const sorted = [...original];
                  if (sortOrder() === 'desc') sorted.reverse();

                  const start = (currentPage() - 1) * perPage();
                  const pageItem = sorted[start + index()];

                  const realIndex = original.indexOf(pageItem);
                  if (realIndex >= 0) removeImage(name, realIndex);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        }}
      </For>
    </div>

    <Show when={totalPages() > 1}>
      <div class="flex justify-center items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <button
          disabled={currentPage() === 1}
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          class="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 disabled:opacity-50"
        >
          {t('prev_page')}
        </button>
        <span>
          {currentPage()} / {totalPages()}
        </span>
        <button
          disabled={currentPage() === totalPages()}
          onClick={() => setCurrentPage((prev) => Math.min(totalPages(), prev + 1))}
          class="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 disabled:opacity-50"
        >
          {t('next_page')}
        </button>
      </div>
    </Show>
  </div>
);

}
