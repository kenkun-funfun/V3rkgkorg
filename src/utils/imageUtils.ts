// src/utils/imageUtils.ts

import type { ImageItem } from '@/stores/categoryStore';

// ✅ 画像をリサイズし、WebP形式に変換 → base64で返す
export async function resizeAndConvertToBase64(file: File, maxWidth: number, maxHeight: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 比率を維持してリサイズ
        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context is null'));

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Conversion to blob failed'));
            const reader2 = new FileReader();
            reader2.onloadend = () => resolve(reader2.result as string);
            reader2.readAsDataURL(blob);
          },
          'image/webp',
          0.92
        );
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ✅ base64文字列からSHA-256ハッシュを生成
export async function generateHash(base64: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(base64);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ✅ 複数ファイルを一括で処理して ImageItem[] を返す（重複排除つき）
export async function convertAndHashImages(files: File[]): Promise<ImageItem[]> {
  const results: ImageItem[] = [];

  for (const file of files) {
    const base64 = await resizeAndConvertToBase64(file, 1080, 1350);
    const hash = await generateHash(base64);

    // 重複チェック（すでに同じハッシュがある場合は追加しない）
    if (!results.some((item) => item.hash === hash)) {
      results.push({ base64, hash });
    }
  }

  return results;
}
