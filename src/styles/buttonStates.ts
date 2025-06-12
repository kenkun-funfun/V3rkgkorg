// src/styles/buttonStates.ts

// 状態に応じたボタンのクラスを返す関数
export function getToggleButtonClasses(active: boolean): string {
  return [
    'p-2 rounded border transition-colors',
    active
      ? 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700'
      : 'bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700'
  ].join(' ');
}

// アイコンカラー用クラス（lucide）
export function getIconColor(active: boolean): string {
  return active ? 'text-white' : 'text-zinc-400';
}
