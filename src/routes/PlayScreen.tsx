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

export default function PlayScreen() {
  const [viewMode, setViewMode] = createSignal<'play' | 'manage'>('play');

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

  const currentImage = () => playList()[imageIndex()];
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

  const handleTick = () => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        handleNext();
        return parseDuration(localStorage.getItem('duration') || '60');
      }
      return prev - 1;
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
    const finalList = (shuffled.slice(0, max)).filter(Boolean);

    setPanelSelectedCategories(selected);
    setPlayList(finalList.filter((v): v is string => typeof v === 'string'));
    setImageIndex(0);
    setTimeLeft(parseDuration(localStorage.getItem('duration') || '60'));
    setShowCategoryPanel(false);
    setMode(MODE.RUNNING);
    startTimer();
  };

  const handlePause = () => {
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
    const next = imageIndex() + 1;
    if (next >= playList().length) {
      handleReset();
    } else {
      setImageIndex(next);
      setTimeLeft(parseDuration(localStorage.getItem('duration') || '60'));
    }
  };

  const handlePrev = () => {
    if (!debounceCheck() || showDeletePanel()) return;
    const prev = Math.max(imageIndex() - 1, 0);
    setImageIndex(prev);
    setTimeLeft(parseDuration(localStorage.getItem('duration') || '60'));
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
    addToast('画像を削除しました', 'success');
  };

  onMount(() => {
    const keyHandler = (e: KeyboardEvent) => {
      const enabled = localStorage.getItem('keyboardEnabled') === 'true';
      const tag = document.activeElement?.tagName;
      if (!enabled || tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (showDeletePanel()) return;

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

    window.addEventListener('keydown', keyHandler);
    onCleanup(() => window.removeEventListener('keydown', keyHandler));
  });

  onCleanup(() => stopTimer());

  return (
    <section
      class="w-screen overflow-hidden"
      style={{ height: '100dvh' }}
    >      <Show when={viewMode() === 'play'}>
        <div class="h-full w-full flex flex-col overflow-hidden bg-white text-black dark:bg-black dark:text-white relative">          <Header
          mode={mode()}
          timeLeft={timeLeft()}
          onOpenCategoryManager={() => setViewMode('manage')}
          onReset={handleReset}
          currentIndex={currentIndex()}
          totalCount={totalCount()}
        />
          <main
            class="flex-1 flex justify-center items-center overflow-hidden px-4 py-2 relative"
            onClick={(e) => {
              if (showFilterPanel() || showDeletePanel()) return;
              if (localStorage.getItem('tapEnabled') !== 'true') return;
              if (mode() !== MODE.RUNNING && mode() !== MODE.PAUSED) return;

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
                PAUSED
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
          />
        </div>
      </Show>

      {/* 管理画面（カテゴリ管理） */}
      <Show when={viewMode() === 'manage'}>
        <div class="h-full w-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
          <div class="p-3 bg-zinc-800 text-white flex justify-between items-center">
            <button
              class="text-sm font-medium px-3 py-1 bg-zinc-600 hover:bg-zinc-500 rounded"
              onClick={() => setViewMode('play')}
            >
              ← 再生画面に戻る
            </button>
            <h2 class="text-base font-semibold">カテゴリ管理</h2>
            <div class="w-[64px]" />
          </div>

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

              <Show when={currentCategory()}>
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