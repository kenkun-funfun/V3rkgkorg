// src/routes/Header.tsx
import type { Component } from 'solid-js';
import { MODE } from '@/lib/constants';
import type { ModeType } from '@/lib/constants'; // ✅ こっちが正しい型
import { Timer, X, Languages, Sun, Moon } from 'lucide-solid';
import { Show } from 'solid-js';
import { A } from '@solidjs/router'; // ← 上部に追加されていなければこれも忘れずに
import { themeStore } from '@/stores/themeStore';
import { lang, setLang, t } from '@/stores/i18nStore';

const { theme, toggleTheme } = themeStore;

type Props = {
  mode: ModeType; // ✅ これが正しい
  timeLeft: number;
  onOpenCategoryManager: () => void;
  onReset?: () => void;
  currentIndex?: number;
  totalCount?: number;
  onBackToPlay: () => void;
  viewMode: 'play' | 'manage';
};

const Header: Component<Props> = (props) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(1, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header class="flex justify-center items-center px-4 py-2 bg-zinc-900 text-white border-b border-white">
      <div class="flex flex-wrap justify-center items-center gap-3 text-xs select-none">
        {/* 左：操作ボタン（START_SCREEN時のみ） */}
        <Show when={props.mode === MODE.START_SCREEN}>
          {/* 戻るボタン */}
          <button
            class={`flex items-center gap-1 px-2 py-1 rounded border text-sm font-semibold select-none
  ${props.viewMode === 'play'
                ? 'bg-white text-black border-white'
                : 'border-white hover:bg-white hover:text-black text-white'}`}
            onClick={props.onBackToPlay}
          >
            {t('play_back_to_play')}
          </button>

          {/* カテゴリ管理ボタン */}
          <button
            class={`flex items-center gap-1 px-2 py-1 rounded border text-sm font-semibold select-none
  ${props.viewMode === 'manage'
                ? 'bg-white text-black border-white'
                : 'border-white hover:bg-white hover:text-black text-white'}`}
            onClick={props.onOpenCategoryManager}
          >
            {t('header_category_manage')}
          </button>

          {/* テーマ切り替え */}
          <button
            onClick={toggleTheme}
            class="flex items-center justify-center px-2 py-1 rounded border border-white text-sm text-white hover:bg-white hover:text-black"
            title="テーマ切り替え"
          >
            <Show when={theme() === 'dark'} fallback={<Moon size={16} />}>
              <Sun size={16} />
            </Show>
          </button>

          {/* 言語切替 */}
          <button
            class="flex items-center gap-1 px-2 py-1 rounded border border-white text-sm text-white hover:bg-white hover:text-black"
            onClick={() => setLang(lang() === 'ja' ? 'en' : 'ja')}
            title={t('language')}
          >
            <Languages size={14} />
            {lang() === 'ja' ? 'ja' : 'en'}
          </button>

        </Show>

        {/* 中央：タイマーとカウント */}
        <Show when={props.mode !== MODE.START_SCREEN}>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1">
              <Timer size={14} />
              <span>{t('header_remaining')} {formatTime(props.timeLeft)}</span>
            </div>
            <Show when={props.mode === MODE.RUNNING && props.totalCount}>
              <div>
                {Math.min(props.currentIndex! + 1, props.totalCount - 1)} / {props.totalCount - 1}
              </div>
            </Show>
          </div>
        </Show>

        {/* 右：リセットボタン */}
        <Show when={props.mode !== MODE.START_SCREEN && props.onReset}>
          <button
            class="px-2 py-1 rounded border border-white hover:bg-white hover:text-black"
            onClick={props.onReset}
          >
            <X size={16} />
          </button>
        </Show>
      </div>
    </header>
  );
};

export default Header;
