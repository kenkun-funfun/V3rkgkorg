// src/components/DuplicateCheckModal.tsx
import { Show, createSignal, onMount } from 'solid-js';
import { getDuplicateReport, removeDuplicateImages, type DuplicateReport } from '@/stores/categoryStore';
import { X } from 'lucide-solid';

type Props = {
    onClose: () => void;
};

export default function DuplicateCheckModal(props: Props) {
    const [reports, setReports] = createSignal<DuplicateReport[]>([]);
    const [removed, setRemoved] = createSignal<number | null>(null);

    onMount(() => {
        setReports(getDuplicateReport());
    });

    const handleRemove = () => {
        const count = removeDuplicateImages();
        setRemoved(count);
        setReports([]);
    };

    return (
        <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-zinc-800 text-black dark:text-white p-6 rounded shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold"> 重複画像の削除</h2>
                    <button onClick={props.onClose}>
                        <X class="text-black dark:text-white" size={20} />
                    </button>
                </div>

                <Show when={reports().length > 0} fallback={
                    <p class="text-sm text-black dark:text-white">✅ 重複は見つかりませんでした。</p>
                }>
                    <div class="max-h-[50vh] overflow-y-auto space-y-3 pr-1">
                        {reports().map((r) => (
                            <div class="flex justify-between items-center text-sm border-b border-black/10 dark:border-white/20 py-1">
                                <span class="truncate">📁 {r.category}</span>
                                <span>{r.before} → {r.after}（{r.removed} 枚削除）</span>
                            </div>
                        ))}
                    </div>

                    <div class="mt-6 flex justify-end sticky bottom-0 pt-3">
                        <button
                            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            onClick={handleRemove}
                        >
                            ✅ 重複を削除する
                        </button>
                    </div>
                </Show>

                <Show when={removed() !== null}>
                    <p class="mt-4 text-sm text-green-600 dark:text-green-400">
                        {removed()} 件の画像を削除しました。
                    </p>
                </Show>
            </div>
        </div>
    );
}
