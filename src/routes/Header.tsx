// src/routes/Header.tsx
import type { Component } from 'solid-js';
import { createSignal, Show } from 'solid-js';
import { MODE } from '@/lib/constants';
import type { ModeType } from '@/lib/constants';
import { Timer, X, Languages, Sun, Moon, Menu } from 'lucide-solid';
import { themeStore } from '@/stores/themeStore';
import { lang, setLang, t } from '@/stores/i18nStore';

const { theme, toggleTheme } = themeStore;
const [menuOpen, setMenuOpen] = createSignal(false);

type Props = {
  mode: ModeType;
  timeLeft: number;
  onOpenCategoryManager: () => void;
  onReset?: () => void;
  currentIndex?: number;
  totalCount?: number;
  onBackToPlay: () => void;
  viewMode: 'play' | 'manage' | 'doc';
  onOpenDoc: () => void;
};

const Header: Component<Props> = (props) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(1, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleTitleClick = () => {
    if (props.mode === MODE.RUNNING || props.mode === MODE.PAUSED) {
      props.onReset?.();
    }
    props.onBackToPlay();
  };

  return (
    <header class="relative flex justify-between items-center px-4 py-2 bg-zinc-900 text-white border-b border-white">
      {/* 左：ハンバーガー or PCボタン + タイトル */}
      <div class="flex items-center gap-3">
        {/* モバイル：ハンバーガー */}
        <Show when={props.mode === MODE.START_SCREEN}>
          <div class="sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen())}>
              <Show when={menuOpen()} fallback={<Menu size={20} />}>
                <X size={20} />
              </Show>
            </button>
          </div>
        </Show>

        {/* モバイル：タイトル */}
        <button
          class="text-lg font-bold tracking-wide sm:hidden hover:text-zinc-300 transition"
          onClick={handleTitleClick}
        >
          RKGK.ORG
        </button>

        {/* PC：タイトル & 管理ボタン */}
        <div class="hidden sm:flex items-center gap-3">
          <button
            class="text-lg font-bold tracking-wide text-white hover:text-zinc-300 transition"
            onClick={handleTitleClick}
          >
            RKGK.ORG
          </button>

          <Show when={props.mode === MODE.START_SCREEN}>
            <button
              class={`flex items-center gap-1 px-2 py-1 rounded border text-sm font-semibold
              ${props.viewMode === 'manage'
                  ? 'bg-white text-black border-white'
                  : 'border-white hover:bg-white hover:text-black text-white'}`}
              onClick={props.onOpenCategoryManager}
            >
              {t('header_category_manage')}
            </button>
            <button
              class={`flex items-center gap-1 px-2 py-1 rounded border text-sm font-semibold
  ${props.viewMode === 'doc'
                  ? 'bg-white text-black border-white'
                  : 'border-white hover:bg-white hover:text-black text-white'}`}
              onClick={props.onOpenDoc}
            >
              {t('header_document')}
            </button>
            <a
              href="https://plus.rkgk.org/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-blue-400 hover:underline hidden sm:inline"
            >
              {t('header_old_version')}
            </a>
            <a
              href="https://x.com/rkgk_org"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-blue-400 hover:underline hidden sm:inline"
            >
              X / @rkgk_org
            </a>
            <a
              href="https://marshmallow-qa.com/rkgk_org" // ← フォームURLをここに
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-blue-400 hover:underline hidden sm:inline"
            >
              {t('feedback_label')}
            </a>

          </Show>
        </div>
      </div>

      {/* 中央：タイマー表示 */}
      <Show when={props.mode !== MODE.START_SCREEN}>
        <div class="flex items-center gap-3 text-sm">
          <div class="flex items-center gap-1">
            <Timer size={14} />
            <span>{formatTime(props.timeLeft)}</span>
          </div>
          <Show when={props.mode === MODE.RUNNING && props.totalCount}>
            <div>
              {Math.min(props.currentIndex! + 1, props.totalCount - 1)} / {props.totalCount - 1}
            </div>
          </Show>
        </div>
      </Show>

      {/* 右：テーマ・言語切替 */}
      <div class="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          class="flex items-center justify-center px-2 py-1 rounded border border-white text-sm text-white hover:bg-white hover:text-black"
          title="テーマ切り替え"
        >
          <Show when={theme() === 'dark'} fallback={<Moon size={16} />}>
            <Sun size={16} />
          </Show>
        </button>
        <button
          class="flex items-center gap-1 px-2 py-1 rounded border border-white text-sm text-white hover:bg-white hover:text-black"
          onClick={() => setLang(lang() === 'ja' ? 'en' : 'ja')}
          title={t('language')}
        >
          <Languages size={14} />
          {lang() === 'ja' ? 'ja' : 'en'}
        </button>
      </div>

      {/* モバイルメニュー（ハンバーガー展開） */}
      <Show when={menuOpen()}>
        <div class="absolute top-full left-0 w-full bg-zinc-800 border-t-2 border-zinc-500 sm:hidden z-50 p-4 space-y-2 text-sm shadow-lg">
          <button class="w-full text-left" onClick={() => { props.onOpenCategoryManager(); setMenuOpen(false); }}>
            {t('header_category_manage')}
          </button>
          <button class="w-full text-left" onClick={() => { props.onOpenDoc(); setMenuOpen(false); }}>
            {t('header_document')}
          </button>
          <a
            href="https://plus.rkgk.org/"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full block text-left text-blue-400 hover:underline"
          >
            {t('header_old_version')}
          </a>
          <a
            href="https://x.com/rkgk_org"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full block text-left text-blue-400 hover:underline"
          >
            X / @rkgk_org
          </a>
          <a
            href="https://marshmallow-qa.com/rkgk_org" // ← フォームURLをここに
            target="_blank"
            rel="noopener noreferrer"
            class="w-full block text-left text-blue-400 hover:underline"
          >
            {t('feedback_label')}
          </a>
        </div>
      </Show>
    </header>
  );
};

export default Header;
