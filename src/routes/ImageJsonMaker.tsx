// src/routes/ImageJsonMaker.tsx
import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { A } from '@solidjs/router';

export default function ImageJsonMaker() {
  const [images, setImages] = createSignal<{ base64: string; hash: string }[]>([]);
  const [successCount, setSuccessCount] = createSignal(0);
  const [errorCount, setErrorCount] = createSignal(0);
  const [category, setCategory] = createSignal('');
  const [gifThumbnail, setGifThumbnail] = createSignal('');
  const [showModal, setShowModal] = createSignal(false);
  let imageListRef: HTMLDivElement | undefined;
  let fileInputRef: HTMLInputElement | undefined;

  onMount(() => {
    const body = document.body;
    body.style.overflow = 'auto'; // ✅ スクロール許可

    extractFirstFrame('/assets/jsonmaker_demo.gif').then(setGifThumbnail);

    document.addEventListener('dragover', (e) => e.preventDefault());

    document.addEventListener('drop', async (e) => {
      e.preventDefault();
      body.classList.remove('drag-active');
      if (e.dataTransfer?.files?.length) {
        await handleFiles(e.dataTransfer.files);
      }
    });

    document.addEventListener('dragenter', () => {
      body.classList.add('drag-active');
    });

    document.addEventListener('dragleave', (e) => {
      if (
        !e.relatedTarget ||
        !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)
      ) {
        body.classList.remove('drag-active');
      }
    });
  });

  onCleanup(() => {
    document.body.style.overflow = ''; // ✅ スクロール制限を元に戻す
    document.body.classList.remove('drag-active'); // ✅ ハイライト解除
  });

  async function handleFiles(files: FileList) {
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const base64 = await resizeAndConvertToBase64(file, 1080, 1350);
        const hash = await generateHash(base64);
        setImages((prev) => [...prev, { base64, hash }]);

        const div = document.createElement('div');
        div.className = 'image-item success';
        div.textContent = `✅ ${file.name} - ${hash.slice(0, 10)}...`;
        imageListRef?.prepend(div); // ✅ 上に追加
        setSuccessCount((v) => v + 1);
      } catch (err) {
        const div = document.createElement('div');
        div.className = 'image-item error';
        div.textContent = `❌ ${file.name} - 変換失敗`;
        imageListRef?.prepend(div); // ✅ 上に追加
        console.error('変換エラー:', file.name, err);
        setErrorCount((v) => v + 1);
      }
    }
  }

  function resizeAndConvertToBase64(file: File, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width *= ratio;
        height *= ratio;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob!);
        }, 'image/webp', 0.8);
      };
      const reader = new FileReader();
      reader.onload = () => { img.src = reader.result as string; };
      reader.readAsDataURL(file);
    });
  }

  async function generateHash(base64: string): Promise<string> {
    const data = new TextEncoder().encode(base64);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function downloadJson() {
    if (!category()) {
      alert('カテゴリ名を入力してください');
      return;
    }
    if (images().length === 0) {
      alert('画像がありません');
      return;
    }
    const data = {
      version: 'v1',
      data: {
        [category()]: {
          images: images()
        }
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cat_${category()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    const toast = document.getElementById('toast');
    if (toast) {
      toast.style.display = 'block';
      setTimeout(() => toast.style.display = 'none', 3000);
    }
  }

  async function extractFirstFrame(gifUrl: string): Promise<void> {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      setGifThumbnail(canvas.toDataURL('image/png'));
    };
    img.src = gifUrl;
  }

  return (
    <main class="p-6">
      <h1 class="text-2xl font-bold mb-4">JSONメーカー</h1>
      <div class="mb-4">
        <A href="/" class="inline-block bg-zinc-200 text-black px-3 py-1 rounded border text-sm">
          ← rkgk.org に戻る
        </A>
      </div>

      <div class="bg-white p-4 border border-zinc-300 rounded mb-4 leading-relaxed text-sm">
        <p class="text-gray-700">
          💡 <strong>ブラウザで表示されている画像を、そのままこのページの任意の場所にドラッグ＆ドロップするだけで動作します。</strong><br />
          画像をダウンロードする必要はなく、閲覧中のウェブページから直接取り込めるのが特長です。<br />
          取り込んだ画像はbase64形式のテキストデータに変換され、JSONに格納します。<br />
          詳しい使い方は、以下のアニメーションgifで確認してください。JSONの公開や配布をする際は、取り込み画像の利用規約にご注意ください。<br />
        </p>
      </div>

      <div class="mb-4 text-center">
        <Show when={gifThumbnail()}>
          <img
            src={gifThumbnail()}
            alt="GIFサムネイル"
            class="w-full max-w-sm mx-auto rounded shadow border cursor-pointer"
            onClick={() => setShowModal(true)}
          />
        </Show>
      </div>

      <Show when={showModal()}>
        <div
          class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <img
            src="/assets/jsonmaker_demo.gif"
            alt="JSONメーカーGIF"
            class="max-h-[90vh] max-w-[90vw] rounded shadow"
          />
        </div>
      </Show>

      <label class="block mb-2">カテゴリ名: <input type="text" value={category()} onInput={e => setCategory(e.currentTarget.value)} placeholder="例: 猫" class="ml-2 px-2 py-1 border rounded" /></label>

      <div id="dropzone" class="border-2 border-dashed border-zinc-600 p-8 bg-white text-center cursor-pointer" onClick={() => fileInputRef?.click()}>
        このウェブページのどこにドロップしてもOKです。
        <div class="mt-2 text-red-600 font-bold text-sm" />
      </div>

      <button id="downloadBtn" class="mt-6 px-4 py-2 bg-black text-white rounded" onClick={downloadJson}>JSONをダウンロード</button>

      <div id="stats" class="mt-4 font-bold">成功: {successCount()}件 / 失敗: {errorCount()}件</div>
      <div id="imageList" ref={el => imageListRef = el!} class="mt-2 bg-white border border-zinc-300 p-2" />

      <div id="toast" class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded hidden z-50">✅ JSONをダウンロードしました</div>
    </main>
  );
}
