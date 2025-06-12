// src/routes/ManageScreen.tsx
import { Show, createSignal, onMount } from 'solid-js';
import { categoryData, addImage, removeImage } from '@/stores/categoryStore';
import CategoryList from '@/components/CategoryList';
import ImageManager from '@/components/ImageManager';

export default function ManageScreen() {
  const [selected, setSelected] = createSignal<string | null>(null);

  // 初期カテゴリを自動選択
  onMount(() => {
    const keys = Object.keys(categoryData);
    if (keys.length > 0) setSelected(keys[0]);
  });

  const images = () => (selected() ? categoryData[selected()] || [] : []);

  return (
    <section class="h-screen flex flex-col">
      {/* トップバー：戻るボタン */}
      <div class="p-3 bg-zinc-800 text-white flex justify-between items-center">
        <button
          class="text-sm font-medium px-3 py-1 bg-zinc-600 hover:bg-zinc-500 rounded"
          onClick={() => (window.location.href = '/')}
        >
          ← 戻る
        </button>
        <h2 class="text-base font-semibold">カテゴリ管理</h2>
        <div class="w-[64px]" /> {/* 中央寄せバランサー */}
      </div>

      {/* メインパネル */}
      <div class="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* 左カラム：カテゴリ一覧 */}
        <div class="w-full md:w-1/3 border-r border-zinc-700 overflow-y-auto">
          <div class="p-4">
            <CategoryList
              selected={selected()}
              onSelect={setSelected}
            />
          </div>
        </div>

        {/* 右カラム：画像管理 */}
        <div class="flex-1 overflow-y-auto">
          <div class="p-4">
            <Show when={selected()}>
              <ImageManager
                categoryName={selected()!}
                images={images()}
                onAdd={(files) => {
                  if (!selected()) return;
                  files.forEach((file) => addImage(selected()!, file));
                }}
                onDelete={(index) => {
                  if (!selected()) return;
                  removeImage(selected()!, index);
                }}
              />
            </Show>
          </div>
        </div>
      </div>
    </section>
  );
}
