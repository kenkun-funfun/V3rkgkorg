// src/components/Toast.tsx
import { createSignal, For } from 'solid-js';

export type ToastType = 'success' | 'error';
export type Toast = { id: number; message: string; type: ToastType };

const [toasts, setToasts] = createSignal<Toast[]>([]);

let idCounter = 0;

export function addToast(message: string, type: ToastType = 'success') {
  const id = idCounter++;
  setToasts([...toasts(), { id, message, type }]);

  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 3000);
}

export default function Toast() {
  return (
    <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2 w-full max-w-xs">
      <For each={toasts()}>
        {(toast) => (
          <div
            class={`px-4 py-2 rounded shadow text-white ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {toast.message}
          </div>
        )}
      </For>
    </div>
  );
}
