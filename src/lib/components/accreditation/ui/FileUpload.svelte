<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import { UploadCloud } from '@lucide/svelte';

    const { onFileSelect, class: className } = $props<{ onFileSelect?: (files: FileList | null) => void; class?: string }>();

    let isDragging = $state(false);
    let fileInput: HTMLInputElement | undefined = $state();

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        isDragging = true;
    }

    function handleDragLeave() {
        isDragging = false;
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
        if (e.dataTransfer) {
            onFileSelect?.(e.dataTransfer.files);
        }
    }
</script>

<div
    onmouseleave={handleDragLeave}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    onclick={() => fileInput?.click()}
    onkeydown={e => e.key === 'Enter' && fileInput?.click()}
    class={cn(
        'group relative flex w-full cursor-pointer flex-col items-center justify-center border-2 border-[#0A77FF] p-8 transition-all duration-200 rounded-sm',
        isDragging
            ? 'border-dashed bg-[#0A77FF]/5'
            : 'border-solid hover:bg-slate-50',
        className,
    )}
    role='button'
    tabindex='0'
>
    <input
        bind:this={fileInput}
        type='file'
        multiple
        class='hidden'
        onchange={e => onFileSelect?.(e.currentTarget.files)}
    />

    <div class='mb-4 rounded-sm border border-[#EAECF0] bg-white p-3 transition-transform duration-200 group-hover:scale-110'>
        <UploadCloud class='h-6 w-6 text-slate-500' />
    </div>

    <div class='text-center'>
        <p class='text-sm font-medium text-slate-700'>
            <span class='text-[#0A77FF]'>Click to upload</span> or drag and drop
        </p>
        <p class='mt-1 text-xs text-slate-500'>
            SVG, PNG, JPG or GIF (max. 800x400px)
        </p>
    </div>

    <div class='absolute bottom-6 right-6 opacity-40 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0'>
        <div class='relative'>
            <svg width='32' height='40' viewBox='0 0 32 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M0 4C0 1.79086 1.79086 0 4 0H20L32 12V36C32 38.2091 30.2091 40 28 40H4C1.79086 40 0 38.2091 0 36V4Z' fill='#F2F4F7' />
                <rect x='4' y='24' width='24' height='8' rx='1' fill='#6155F5' />
                <text x='16' y='30' font-size='6' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'>JPG</text>
            </svg>
        </div>
    </div>
</div>
