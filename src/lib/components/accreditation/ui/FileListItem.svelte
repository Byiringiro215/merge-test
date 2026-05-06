<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import { Check, Loader2 } from '@lucide/svelte';
    import FileIcon from './FileIcon.svelte';

    const { name, size, progress, type } = $props<{ name: string; size: string; progress: number; type: any }>();
    const isCompleted = $derived(progress === 100);
</script>

<div class={cn(
    'group relative flex items-center justify-between overflow-hidden rounded-sm border border-[#EAECF0] bg-white p-4 transition-all duration-200',
    isCompleted ? '' : 'bg-[#EAECF0]',
)}>
    <div class='flex flex-1 items-center gap-4'>
        <FileIcon {type} class='relative h-12 w-10 shrink-0' />

        <div class='flex min-w-0 flex-1 flex-col'>
            <div class='mb-1 flex flex-col items-start justify-between text-left'>
                <span class='truncate pr-4 text-sm font-medium text-slate-900'>{name}</span>
                <span class='shrink-0 text-xs text-slate-500'>{size} – {progress}% uploaded</span>
            </div>
        </div>
    </div>

    <div class='relative z-10 ml-4 -mt-6 flex items-start gap-3'>
        {#if isCompleted}
            <div class='flex h-5 w-5 items-center justify-center bg-[#2069C1] text-white rounded-sm'>
                <Check class='h-3 w-3 stroke-3' />
            </div>
        {:else}
            <div class='flex h-5 w-5 items-center justify-center'>
                <Loader2 class='h-4 w-4 animate-spin text-[#2069C1]' />
            </div>
        {/if}
    </div>
</div>
