// src/lib/data.ts
import exampleData from '@/data/example.json';

export type NormalizedImageData = Record<string, { images: string[] }>;

// JSON形式の差異を吸収して統一形式に変換する
export function normalizeImageData(input: any): NormalizedImageData {
  // case: ネスト構造（v1）
  if (input?.version === 'v1' && typeof input.data === 'object') {
    return Object.fromEntries(
      Object.entries(input.data).map(([key, value]) => [key, { images: value.images || [] }])
    );
  }

  // case: フラット形式
  if (typeof input === 'object' && !input.version) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, { images: Array.isArray(value) ? value : [] }])
    );
  }

  // fallback: 空データ
  return {};
}

// JSONファイル読み込み後に変換して export
export const normalizedData: NormalizedImageData = normalizeImageData(exampleData);
