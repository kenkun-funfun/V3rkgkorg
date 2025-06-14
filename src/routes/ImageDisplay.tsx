// src/routes/ImageDisplay.tsx
import { Show } from 'solid-js';

type Props = {
  imageUrl: string | null;
  preloadUrl?: string | null; // ✅ 追加
  isFlippedX: boolean;
  isFlippedY: boolean;
  filter: string; // CSSフィルター（例:"grayscale(100%)"）
  onTap?: () => void; // タップ操作を受け取るコールバック
};

export default function ImageDisplay(props: Props) {
  const transform = () => {
    const flipX = props.isFlippedX ? 'scaleX(-1)' : '';
    const flipY = props.isFlippedY ? 'scaleY(-1)' : '';
    return [flipX, flipY].filter(Boolean).join(' ');
  };

  return (
    <div
      class="w-screen h-full flex justify-center items-center overflow-hidden bg-black cursor-default select-none"
      onClick={props.onTap}
    >
      {/* ✅ プリロード用の透明img */}
      {props.preloadUrl && (
        <img src={props.preloadUrl} alt="" style={{ display: 'none' }} loading="eager" />
      )}
      
      <Show when={props.imageUrl} fallback={<div class="text-gray-400">画像がありません</div>}>
        <img
          src={props.imageUrl!}
          alt="pose"
          class="block max-w-full max-h-full object-contain transition-transform duration-300"
          style={{
            transform: transform(),
            filter: props.filter,
          }}
        />
      </Show>
    </div>
  );
}

