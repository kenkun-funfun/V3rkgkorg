// src/lib/utils.ts

/**
 * 画像ファイルを Base64 文字列に変換します
 * @param file Fileオブジェクト
 * @returns Base64文字列
 */
export const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Base64文字列からSHA-256ハッシュを生成します
 * @param base64 Base64文字列
 * @returns SHA-256ハッシュ（16進文字列）
 */
export const generateHash = async (base64: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(base64);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};
/**
 * 画像をリサイズしてBase64に変換（JPEG/WebP形式）
 * @param file Fileオブジェクト
 * @param maxWidth 最大幅（例：1080）
 * @param maxHeight 最大高さ（例：1350）
 * @param format 出力形式（'image/jpeg' または 'image/webp'）
 * @param quality 圧縮品質（0.0〜1.0、例：0.8）
 * @returns base64文字列
 */
export const resizeAndConvertToBase64 = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  format: 'image/jpeg' | 'image/webp' = 'image/jpeg',
  quality: number = 0.8
): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        const { width, height } = img;
        const scale = Math.min(maxWidth / width, maxHeight / height, 1);

        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error("Canvas context not available"));

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const base64 = canvas.toDataURL(format, quality);
        if (!base64 || !base64.startsWith('data:image/')) {
          return reject(new Error("Failed to convert image to base64"));
        }
        resolve(base64);
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  
// ✅ URL からファイル名（ハッシュ）を抽出するユーティリティ
export function extractHash(url: string): string {
  return url.split('/').pop()?.split('.')[0] || '';
}
