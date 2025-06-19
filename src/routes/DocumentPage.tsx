import { JSX } from 'solid-js/jsx-runtime';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FlipHorizontal, FlipVertical, Settings, Trash } from 'lucide-solid';
import { t } from '@/stores/i18nStore';

export default function DocumentPage(): JSX.Element {
  return (
    <div class="p-6 max-w-3xl mx-auto text-black dark:text-white">
      <h1 class="text-2xl font-bold mb-4">{t('doc_title')}</h1>

      <p class="mb-6">{t('doc_intro')}</p>

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-2 border-b border-gray-400 pb-1">{t('doc_drop_browser_title')}</h2>
        <p class="mb-4">{t('doc_drop_browser_desc')}</p>
        <video controls class="rounded w-full max-h-[400px]">
          <source src="/videos/drop-from-browser.mp4" type="video/mp4" />
          {t('doc_video_fallback')}
        </video>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-2 border-b border-gray-400 pb-1">{t('doc_drop_local_title')}</h2>
        <p class="mb-4">{t('doc_drop_local_desc')}</p>
        <video controls class="rounded w-full max-h-[400px]">
          <source src="/videos/drop-from-file.mp4" type="video/mp4" />
          {t('doc_video_fallback')}
        </video>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-2 border-b border-gray-400 pb-1">{t('doc_drop_zone_title')}</h2>
        <p>{t('doc_drop_zone_desc')}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-bold mb-4 border-b border-gray-400 pb-1">{t('doc_play_controls_title')}</h2>
        <ul class="space-y-4">
          <li><strong class="inline-flex items-center gap-2"><SkipBack size={16} /> {t('doc_play_prev')}</strong></li>
          <li><strong class="inline-flex items-center gap-2"><SkipForward size={16} /> {t('doc_play_next')}</strong></li>
          <li><strong class="inline-flex items-center gap-2"><Play size={16} /> / <Pause size={16} /> {t('doc_play_pause')}</strong></li>
          <li><strong class="inline-flex items-center gap-2"><RotateCcw size={16} /> {t('doc_play_reset')}</strong></li>
          <li><strong class="inline-flex items-center gap-2"><FlipHorizontal size={16} /> {t('doc_play_flip_x')}</strong></li>
          <li><strong class="inline-flex items-center gap-2"><FlipVertical size={16} /> {t('doc_play_flip_y')}</strong></li>
          <li><strong class="inline-flex items-center gap-2"><Settings size={16} /> {t('doc_play_filter')}</strong></li>
          <li><strong class="inline-flex items-center gap-2"><Trash size={16} /> {t('doc_play_delete')}</strong></li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-bold mb-4 border-b border-gray-400 pb-1">{t('doc_wait_title')}</h2>
        <ul class="space-y-4">
          <li><strong>{t('doc_wait_timer')}</strong></li>
          <li><strong>{t('doc_wait_count')}</strong></li>
          <li><strong>{t('doc_wait_countdown')}</strong></li>
          <li><strong>{t('doc_wait_shuffle')}</strong></li>
          <li><strong>{t('doc_wait_keyboard')}</strong></li>
          <li><strong>{t('doc_wait_tap')}</strong></li>
          <li><strong>{t('doc_wait_bell')}</strong></li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-xl font-bold mb-4 border-b border-gray-400 pb-1">{t('doc_features_title')}</h2>
        <ul class="space-y-4">
          <li><strong>{t('doc_features_pin')}</strong></li>
          <li><strong>{t('doc_features_export')}</strong></li>
          <li><strong>{t('doc_features_import')}</strong></li>
          <li><strong>{t('doc_features_add')}</strong></li>
          <li><strong>{t('doc_features_dedup')}</strong></li>
        </ul>
      </section>
    </div>
  );
}
