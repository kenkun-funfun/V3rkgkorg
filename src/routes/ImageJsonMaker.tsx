// src/routes/ImageJsonMaker.tsx
import { createSignal, onMount } from 'solid-js';
import { A } from '@solidjs/router';

export default function ImageJsonMaker() {
    const [images, setImages] = createSignal<{ base64: string; hash: string }[]>([]);
    const [successCount, setSuccessCount] = createSignal(0);
    const [errorCount, setErrorCount] = createSignal(0);
    const [category, setCategory] = createSignal('');
    let imageListRef: HTMLDivElement | undefined;
    let fileInputRef: HTMLInputElement | undefined;

    onMount(() => {
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', async (e) => {
            e.preventDefault();
            document.body.classList.remove('drag-active');
            if (e.dataTransfer?.files?.length) {
                await handleFiles(e.dataTransfer.files);
            }
        });

        document.addEventListener('dragenter', () => {
            document.body.classList.add('drag-active');
        });
        document.addEventListener('dragleave', (e) => {
            if (!e.relatedTarget || e.relatedTarget === document.body) {
                document.body.classList.remove('drag-active');
            }
        });
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
                imageListRef?.appendChild(div);
                setSuccessCount((v) => v + 1);
            } catch (err) {
                const div = document.createElement('div');
                div.className = 'image-item error';
                div.textContent = `❌ ${file.name} - 変換失敗`;
                imageListRef?.appendChild(div);
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

    return (
        <main class="p-6">
            <h1 class="text-2xl font-bold mb-4">カテゴリ画像 JSON メーカー</h1>
            <div class="mb-4">
                <A href="/" class="inline-block bg-zinc-200 text-black px-3 py-1 rounded border text-sm">
                    ← rkgk.org に戻る
                </A>
            </div>

            <div class="bg-white p-4 border border-zinc-300 rounded mb-4 leading-relaxed text-sm">
                <p><strong>このツールは、インターネット上の画像をBase64に変換し、rkgk.org形式のJSONファイルを生成するためのアプリです。</strong></p>
                <p class="mt-3 text-zinc-600">💡 ブラウザで表示されている画像を、このページにドラッグ＆ドロップするだけで変換されます。画像をダウンロードする必要はありません。</p>
                <p class="mt-3 text-red-700 font-bold bg-red-50 p-2 border-l-4 border-red-300">
                    📝 たとえば <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" class="underline text-blue-700">Unsplash</a> のような画像サイトでは、一覧に表示されている画像はうまく変換できないことがあります。<br />
                    このような場合は、画像の詳細ページを開いて、該当画像をドラッグしてください。
                </p>
                <p class="mt-3 text-zinc-600">📎 このツールで作成したJSONファイルは、個人利用の範囲でご使用ください。公開・配布については、元画像の利用規約にご注意ください。</p>
                <p class="mt-3 text-zinc-600">🔎 <strong>Base64変換とは？</strong> 画像をテキスト形式に変換する方法です。これにより、画像をJSONファイル内にそのまま埋め込めます。</p>
            </div>

            <label class="block mb-2">カテゴリ名: <input type="text" value={category()} onInput={e => setCategory(e.currentTarget.value)} placeholder="例: 猫" class="ml-2 px-2 py-1 border rounded" /></label>

            <div id="dropzone" class="border-2 border-dashed border-zinc-600 p-8 bg-white text-center cursor-pointer" onClick={() => fileInputRef?.click()}>
                ここに画像をドロップ または クリックして選択
                <div class="mt-2 text-red-600 font-bold text-sm">
                    ※このページのどこにドロップしても画像は追加されます
                </div>
            </div>

            <div id="stats" class="mt-4 font-bold">成功: {successCount()}件 / 失敗: {errorCount()}件</div>
            <div id="imageList" ref={el => imageListRef = el!} class="mt-2 max-h-[500px] overflow-y-auto bg-white border border-zinc-300 p-2" />

            <button id="downloadBtn" class="mt-4 px-4 py-2 bg-black text-white rounded sticky bottom-4" onClick={downloadJson}>JSONをダウンロード</button>
            <div id="toast" class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded hidden z-50">✅ JSONをダウンロードしました</div>
        </main>
    );
}
