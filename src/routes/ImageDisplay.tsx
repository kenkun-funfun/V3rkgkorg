// src/routes/ImageDisplay.tsx
import { Show, Match, Switch } from 'solid-js';
import { t } from '@/stores/i18nStore';
import { Sticker } from 'lucide-solid';

type Props = {
  imageUrl: string | null;
  preloadUrl?: string | null;
  isFlippedX: boolean;
  isFlippedY: boolean;
  filter: string;
  onTap?: () => void;
};

export default function ImageDisplay(props: Props) {
  const transform = () => {
    const flipX = props.isFlippedX ? 'scaleX(-1)' : '';
    const flipY = props.isFlippedY ? 'scaleY(-1)' : '';
    return [flipX, flipY].filter(Boolean).join(' ');
  };

  return (
    <div
      class="w-screen h-full flex justify-center items-center overflow-hidden bg-white text-black dark:bg-black dark:text-white cursor-default select-none"
      onClick={props.onTap}
    >
      {/* ✅ プリロード用の透明img */}
      {props.preloadUrl && (
        <img src={props.preloadUrl} alt="" style={{ display: 'none' }} loading="eager" />
      )}

      <Switch>
        {/* ✅ 終了マーカー表示 */}
        <Match when={props.imageUrl === '__END__'}>
          <div
            class="w-[1080px] h-[1350px] flex flex-col items-center justify-center px-6 py-8 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-sm"
          >
            <Sticker class="mb-2 text-zinc-400 dark:text-zinc-500" size={48} />
            <div class="text-2xl font-bold text-zinc-600 dark:text-zinc-300">
              {t('image_display_finished')}
            </div>
          </div>

        </Match>

        {/* ✅ 通常画像表示 */}
        <Match when={props.imageUrl}>
          <img
            src={props.imageUrl!}
            alt="pose"
            class="block max-w-full max-h-full object-contain transition-transform duration-300"
            style={{
              transform: transform(),
              filter: props.filter,
            }}
          />
        </Match>

        {/* ✅ エラー表示 */}
        <Match when={!props.imageUrl}>
          <div class="text-gray-400">{t('image_display_unavailable')}</div>
        </Match>
      </Switch>
    </div>
  );
}
