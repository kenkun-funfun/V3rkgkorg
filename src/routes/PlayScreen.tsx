/// <reference types="node" />
// src/components/PlayScreen.tsx
import { Show, createSignal, onCleanup, onMount } from 'solid-js';
import Header from './Header';
import Footer from './Footer';
import ImageDisplay from './ImageDisplay';
import WaitPanel from './WaitPanel';
import { MODE } from '@/lib/constants';
import type { ModeType } from '@/lib/constants';
import CategoryPanel from './CategoryPanel';
import FilterPanel from './FilterPanel';
import DeletePanel from './DeletePanel';
import CategoryList from '@/components/CategoryList';
import ImageManager from '@/components/ImageManager';
import SaveModal from '@/components/SaveModal';
import LoadModal from '@/components/LoadModal';
import CategoryAddModal from '@/components/CategoryAddModal';
import DuplicateCheckModal from '@/components/DuplicateCheckModal';
import {
  get,
  loadFromJson,
  addImage,
  removeImage,
  addCategory,
  panelSelectedCategories,
  setPanelSelectedCategories,
  currentCategory,
  setCurrentCategory,
} from '@/stores/categoryStore';
import { resizeAndConvertToBase64, generateHash } from '@/lib/utils';
import { addToast } from '@/components/Toast';
import { t } from '@/stores/i18nStore';
import { chimeEnabled, setChimeEnabled } from '@/stores/playSettings';
import DocumentPage from '@/routes/DocumentPage'; // ✅ 追加

export default function PlayScreen() {
  const [viewMode, setViewMode] = createSignal<'play' | 'manage' | 'doc'>('play');

  const [mode, setMode] = createSignal<ModeType>(MODE.START_SCREEN);
  const [playList, setPlayList] = createSignal<string[]>([]);
  const [imageIndex, setImageIndex] = createSignal<number>(0);
  const [isFlippedX, setIsFlippedX] = createSignal(false);
  const [isFlippedY, setIsFlippedY] = createSignal(false);
  const [filter, setFilter] = createSignal('');
  const [timeLeft, setTimeLeft] = createSignal(0);
  const [showPausedOverlay, setShowPausedOverlay] = createSignal(false);
  const [showCategoryPanel, setShowCategoryPanel] = createSignal(false);
  const [showFilterPanel, setShowFilterPanel] = createSignal(false);
  const [showDeletePanel, setShowDeletePanel] = createSignal(false);
  const [showSaveModal, setShowSaveModal] = createSignal(false);
  const [showLoadModal, setShowLoadModal] = createSignal(false);
  const [showAddModal, setShowAddModal] = createSignal(false);
  const [showDuplicateModal, setShowDuplicateModal] = createSignal(false);
  const [isCountingDown, setIsCountingDown] = createSignal(false);
  const [countdownDisplay, setCountdownDisplay] = createSignal<number | null>(null);

  const END_MARKER = '__END__';
  const isEndImage = () => {
    const idx = imageIndex();
    if (idx < 0 || idx >= playList().length) return false;
    return playList()[idx] === END_MARKER;
  };

  const currentImage = () => {
    const img = playList()[imageIndex()];
    return img === END_MARKER ? null : img;
  };

  const currentIndex = () => imageIndex();
  const totalCount = () => playList().length;

  let timer: NodeJS.Timeout | null = null;
  let lastActionTime = 0;

  const parseDuration = (str: string): number => {
    const parts = str.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parseInt(str);
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  let tenSecondChimePlayed = false; // ✅ グローバルに一度だけ再生フラグ

  const handleTick = () => {
    setTimeLeft((prev) => {
      const next = prev - 1;

      // ✅ 10秒前に一度だけ音を鳴らす
      if (next === 10 && !tenSecondChimePlayed && chimeEnabled()) {
        const audio = new Audio('/sounds/ding-small-bell-sfx-233008.mp3');
        audio.play().catch(console.warn);
      }

      if (next <= 0) {
        stopTimer();
        tenSecondChimePlayed = false; // ✅ リセット

        const nextIndex = imageIndex() + 1;
        const list = playList();
        if (list[nextIndex] === END_MARKER) {
          setImageIndex(nextIndex);
          setMode(MODE.PAUSED);
          return 0;
        }

        const countdownEnabled = localStorage.getItem('countdownEnabled') !== 'false';
        const countdownSec = parseInt(localStorage.getItem('countdownSeconds') || '3');

        const nextImage = () => {
          setImageIndex(nextIndex);
          setTimeLeft(parseDuration(localStorage.getItem('duration') || '60'));
          startTimer();
        };

        if (countdownEnabled) {
          startCountdown(countdownSec, nextImage);
        } else {
          setTimeout(() => {
            nextImage(); // ✅ ワンクッション置いて呼び出す
          }, 0);
        }

        return 0;
      }

      return next;
    });
  };

  const startTimer = () => {
    stopTimer();
    timer = setInterval(handleTick, 1000);
  };

  const startPlayback = (selected: string[]) => {
    const shuffle = localStorage.getItem('shuffle') === 'true';
    const allImages = selected.flatMap((name) => {
      const images = get()[name];
      if (!images || !Array.isArray(images)) return [];
      return images.map((img) => img.base64 || img.url).filter(Boolean);
    });

    const shuffled = shuffle ? [...allImages].sort(() => Math.random() - 0.5) : allImages;
    const max = parseInt(localStorage.getItem('maxPlays') || '100');
    const finalList = shuffled.slice(0, max).filter(Boolean);

    setPanelSelectedCategories(selected);
    const safeList = finalList.filter((v): v is string => typeof v === 'string');
    safeList.push(END_MARKER);
    setPlayList(safeList);
    setImageIndex(-1); // ✅ 最初のカウントダウンのために -1 にしておく
    setShowCategoryPanel(false);
    setMode(MODE.RUNNING);

    const duration = parseDuration(localStorage.getItem('duration') || '60');
    const countdownEnabled = localStorage.getItem('countdownEnabled') !== 'false';
    const countdownSeconds = parseInt(localStorage.getItem('countdownSeconds') || '3');

    const begin = () => {
      setImageIndex(0);
      setTimeLeft(duration);
      startTimer();
    };

    if (countdownEnabled && countdownSeconds > 0) {
      startCountdown(countdownSeconds, begin);
    } else {
      begin();
    }
  };


  const handlePause = () => {
    cancelCountdown();
    stopTimer();
    setMode(MODE.PAUSED);
    setShowPausedOverlay(true);
    setTimeout(() => setShowPausedOverlay(false), 2000);
  };

  const handleResume = () => {
    setMode(MODE.RUNNING);
    startTimer();
  };

  const handleTogglePause = () => {
    if (mode() === MODE.RUNNING) handlePause();
    else if (mode() === MODE.PAUSED) handleResume();
  };

  const handleReset = () => {
    cancelCountdown();
    stopTimer();
    setImageIndex(0);
    setIsFlippedX(false);
    setIsFlippedY(false);
    setFilter('');
    setTimeLeft(0);
    setShowFilterPanel(false);
    setShowDeletePanel(false);
    setMode(MODE.START_SCREEN);
  };

  const debounceCheck = () => {
    const now = Date.now();
    if (now - lastActionTime < 100) return false;
    lastActionTime = now;
    return true;
  };

  const handleNext = () => {
    if (!debounceCheck() || showDeletePanel()) return;

    cancelCountdown();

    const next = imageIndex() + 1;
    const list = playList();
    if (next >= list.length) return;

    const nextItem = list[next];
    setImageIndex(next);

    if (nextItem === END_MARKER) {
      stopTimer();
      setMode(MODE.PAUSED);
    } else {
      setTimeLeft(parseDuration(localStorage.getItem('duration') || '60'));
      if (mode() === MODE.RUNNING) {
        startTimer(); // ✅ 一時停止中は再始動しないように条件付き
      }
    }
  };

  const handlePrev = () => {
    if (!debounceCheck() || showDeletePanel()) return;

    cancelCountdown();

    const prev = Math.max(imageIndex() - 1, 0);
    setImageIndex(prev);
    setTimeLeft(parseDuration(localStorage.getItem('duration') || '60'));

    if (mode() === MODE.RUNNING) {
      startTimer(); // ✅ 再生中のみタイマー再開
    }
  };

  const handleFlipX = () => setIsFlippedX((prev) => !prev);
  const handleFlipY = () => setIsFlippedY((prev) => !prev);
  const handleDelete = () => {
    setShowDeletePanel((prev) => {
      if (!prev) setShowFilterPanel(false);
      return !prev;
    });
  };

  const handleToggleCategoryPanel = () => {
    setShowCategoryPanel((prev) => !prev);
  };

  const handleToggleFilterPanel = () => {
    setShowFilterPanel((prev) => {
      const newState = !prev;
      if (newState) setShowDeletePanel(false);
      return newState;
    });
  };

  const handleDeleteCurrentImage = () => {
    const current = currentImage();
    if (!current) return;

    for (const [cat, entry] of Object.entries(get())) {
      const idx = entry.findIndex((img) => (img.base64 || img.url) === current);
      if (idx !== -1) {
        removeImage(cat, idx);
        break;
      }
    }

    const updated = [...playList()];
    updated.splice(imageIndex(), 1);
    setPlayList(updated);

    if (imageIndex() >= updated.length) {
      setImageIndex(Math.max(0, updated.length - 1));
    }

    setShowDeletePanel(false);
    addToast(t('play_deleted'), 'success');
  };

  //Countdown
  let countdownTimeoutId: number | null = null;     // ✅ タイムアウト用
  let countdownIntervalId: number | null = null;    // ✅ インターバル用（追加）

  const startCountdown = (seconds: number, callback: () => void) => {
    cancelCountdown(); // ✅ すでに実行中ならキャンセル

    if (seconds <= 0) {
      callback();
      return;
    }

    setIsCountingDown(true);
    setCountdownDisplay(seconds); // ✅ 初期値セット

    // ✅ カウント表示だけ減らす
    countdownIntervalId = window.setInterval(() => {
      setCountdownDisplay((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownIntervalId !== null) {
            clearInterval(countdownIntervalId);
            countdownIntervalId = null;
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    countdownTimeoutId = window.setTimeout(() => {
      setIsCountingDown(false);
      setCountdownDisplay(null);
      countdownTimeoutId = null;
      if (countdownIntervalId !== null) {
        clearInterval(countdownIntervalId);
        countdownIntervalId = null;
      }
      callback();
    }, seconds * 1000);
  };

  const cancelCountdown = () => {
    if (countdownTimeoutId !== null) {
      clearTimeout(countdownTimeoutId);
      countdownTimeoutId = null;
    }
    if (countdownIntervalId !== null) {
      clearInterval(countdownIntervalId);
      countdownIntervalId = null;
    }
    setIsCountingDown(false);
    setCountdownDisplay(null);
  };

  onMount(() => {
    const chime = localStorage.getItem('chimeEnabled');
    setChimeEnabled(chime !== 'false'); // ✅ 初期値：ON

    const keyHandler = (e: KeyboardEvent) => {
      const enabled = localStorage.getItem('keyboardEnabled') === 'true';
      const tag = document.activeElement?.tagName;
      if (!enabled || tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (showDeletePanel()) return;

      const end = isEndImage(); // ✅ 安全なEND判定

      if (end) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrev();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleReset();
        }
        return; // ✅ END画像では他キーは無視
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleTogglePause();
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') {
        if (showFilterPanel()) setShowFilterPanel(false);
        else if (showDeletePanel()) setShowDeletePanel(false);
        else handleReset();
      }
    };

    // ✅ キーボードイベント登録
    window.addEventListener('keydown', keyHandler);

    // ✅ 画像ドラッグ＆ドロップ対応（管理画面モード）
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
        f.type.startsWith('image/')
      );
      const name = currentCategory();
      if (!name || !files.length) return;

      let successCount = 0;
      let failCount = 0;

      for (const file of files) {
        try {
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

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    // ✅ 後片付け
    onCleanup(() => {
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    });
  });


  return (
    <section
      class="w-screen overflow-hidden"
      style={{ height: '100dvh' }}
    >      <Show when={viewMode() === 'play'}>
        <div class="h-full w-full flex flex-col overflow-hidden bg-white text-black dark:bg-black dark:text-white relative">
          <Header
            mode={mode()}
            timeLeft={timeLeft()}
            onOpenCategoryManager={() => setViewMode('manage')}
            onOpenDoc={() => setViewMode('doc')}
            onBackToPlay={() => setViewMode('play')}
            onReset={handleReset}
            currentIndex={currentIndex()}
            totalCount={totalCount()}
            viewMode={viewMode()}
          />
          <main
            class="flex-1 flex justify-center items-center overflow-hidden px-4 py-2 relative"
            onClick={(e) => {
              if (showFilterPanel() || showDeletePanel()) return;
              if (localStorage.getItem('tapEnabled') !== 'true') return;
              if (mode() !== MODE.RUNNING && mode() !== MODE.PAUSED) return;
              if (isEndImage()) return;

              const tag = (e.target as HTMLElement).tagName;
              if (["INPUT", "TEXTAREA", "BUTTON"].includes(tag)) return;

              const x = e.clientX;
              const width = window.innerWidth;
              if (x < width * 0.3) handlePrev();
              else if (x > width * 0.7) handleNext();
              else handleTogglePause();
            }}
          >
            <Show when={mode() === MODE.START_SCREEN} fallback={
              <ImageDisplay
                imageUrl={playList()[imageIndex()] || null}
                preloadUrl={playList()[imageIndex() + 1] || null} // ✅ 追加
                isFlippedX={isFlippedX()}
                isFlippedY={isFlippedY()}
                filter={filter()}
                isCountingDown={isCountingDown()} // ✅ 新規追加
                countdownValue={countdownDisplay}
              />
            }>
              <WaitPanel
                setMode={setMode}
                onStart={startPlayback}
                onToggleCategoryPanel={handleToggleCategoryPanel}
              />
            </Show>

            <Show when={showPausedOverlay()}>
              <div class="absolute text-4xl font-bold text-white bg-black/60 px-6 py-2 rounded">
                {t('play_paused')}
              </div>
            </Show>

            <CategoryPanel
              isOpen={showCategoryPanel()}
              onClose={() => setShowCategoryPanel(false)}
            />

            <Show when={showFilterPanel()}>
              <FilterPanel
                onClose={() => setShowFilterPanel(false)}
                onChange={(val) => setFilter(val)}
              />
            </Show>

            <Show when={showDeletePanel()}>
              <DeletePanel
                onCancel={() => setShowDeletePanel(false)}
                onConfirm={handleDeleteCurrentImage} // ← さっき提示したやつ
              />
            </Show>

          </main>

          <Footer
            mode={mode()}
            onPrev={handlePrev}
            onNext={handleNext}
            onTogglePause={handleTogglePause}
            onReset={handleReset}
            onFlipX={handleFlipX}
            onFlipY={handleFlipY}
            onFilterToggle={handleToggleFilterPanel}
            onDelete={handleDelete}
            onOpenCategoryManager={() => setViewMode('manage')}
            isFlippedX={isFlippedX()}
            isFlippedY={isFlippedY()}
            countdown={() => isCountingDown()}
            isEnd={isEndImage()}
          />
        </div>
      </Show>

      {/* 管理画面（カテゴリ管理） */}
      <Show when={viewMode() === 'manage'}>
        <div class="h-full w-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
          <Header
            mode={MODE.START_SCREEN}
            timeLeft={0}
            onOpenCategoryManager={() => { }}
            onOpenDoc={() => setViewMode('doc')}
            onReset={() => setViewMode('play')}
            onBackToPlay={() => setViewMode('play')}
            viewMode={viewMode()}
          />

          <div class="flex flex-col md:flex-row flex-1 overflow-hidden">

            <div class="w-full md:w-1/3 h-[45vh] md:h-auto border-r border-zinc-700 overflow-y-auto p-4">
              <CategoryList
                selected={currentCategory()}
                onSelect={(name) => setCurrentCategory(name)}
                onSave={() => setShowSaveModal(true)}
                onLoad={() => setShowLoadModal(true)}
                onAddCategory={() => setShowAddModal(true)} // ✅ 追加
                onShowDuplicateModal={() => setShowDuplicateModal(true)}
              />
            </div>
            <div class="flex-1 h-[55vh] md:h-auto overflow-y-auto p-4">

              <Show
                when={currentCategory()}
                fallback={
                  <div class="text-center text-sm text-red-500 dark:text-red-400 py-8">
                    {t('play_select_category')}
                  </div>
                }
              >
                <ImageManager
                  categoryName={currentCategory()}
                  images={get()[currentCategory()] || []}
                  onAdd={async (files) => {
                    const name = currentCategory();
                    if (!name) return;
                    for (const file of files) {
                      const base64 = await resizeAndConvertToBase64(file, 1080, 1350, 'image/webp', 0.8);
                      const hash = await generateHash(base64);
                      addImage(name, { base64, hash });
                    }
                  }}
                  onDelete={(index) => {
                    const name = currentCategory();
                    if (!name) return;
                    removeImage(name, index);
                  }}
                />
              </Show>

            </div>
          </div>
        </div>
      </Show>

      {/* ✅ ドキュメントページ */}
      <Show when={viewMode() === 'doc'}>
        <div class="h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white">
          {/* ヘッダー */}
          <Header
            mode={MODE.START_SCREEN}
            timeLeft={0}
            onOpenCategoryManager={() => setViewMode('manage')}
            onOpenDoc={() => setViewMode('doc')}
            onReset={() => setViewMode('play')}
            onBackToPlay={() => setViewMode('play')}
            viewMode={viewMode()}
          />

          {/* コンテンツ（スクロール可能） */}
          <main class="flex-1 overflow-y-auto">
            <DocumentPage />
          </main>
        </div>
      </Show>


      {/* ✅ モーダル表示 */}
      <Show when={showSaveModal()}>
        <SaveModal categoryData={get()} onClose={() => setShowSaveModal(false)} />
      </Show>

      <Show when={showLoadModal()}>
        <LoadModal onLoad={(data) => loadFromJson(data)} onClose={() => setShowLoadModal(false)} />
      </Show>

      <Show when={showAddModal()}>
        <CategoryAddModal onAdd={addCategory} onClose={() => setShowAddModal(false)} />
      </Show>

      <Show when={showDuplicateModal()}>
        <DuplicateCheckModal onClose={() => setShowDuplicateModal(false)} />
      </Show>
    </section>
  );
}