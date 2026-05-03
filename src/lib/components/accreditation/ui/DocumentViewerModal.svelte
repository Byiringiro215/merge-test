<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import { ChevronLeft, ChevronRight, Download, FileText, Maximize2, Minimize2, X } from '@lucide/svelte';

    const {
        onClose,
        documentName = 'Document Viewer',
        documentUrl = '#',
        documentSize = '',
    } = $props<{
        onClose: () => void;
        documentName?: string;
        documentUrl?: string;
        documentSize?: string;
    }>();

    let isMaximized = $state(false);
</script>

<div class='fixed inset-0 z-100 flex animate-in items-center justify-center bg-slate-900/90 p-4 transition-all fade-in duration-200'>
    <div class={cn(
        'flex flex-col overflow-hidden -sm bg-white shadow-2xl transition-all duration-300',
        isMaximized ? 'h-full w-full' : 'h-[85vh] w-full max-w-5xl',
    )}>
        <!-- Header -->
        <div class='flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6 py-4'>
            <div class='flex items-center gap-4'>
                <div class='flex h-10 w-10 items-center justify-center border border-red-100 bg-red-50 rounded-sm'>
                    <FileText class='h-5 w-5 text-red-500' />
                </div>
                <div class='flex flex-col'>
                    <h3 class='text-[15px] font-bold leading-tight text-[#101828]'>{documentName}</h3>
                    {#if documentSize}
                        <span class='text-[12px] text-slate-500'>{documentSize}</span>
                    {/if}
                </div>
            </div>

            <div class='flex items-center gap-2'>
                <a
                    href={documentUrl}
                    download={documentName}
                    class='rounded-sm p-2 text-slate-500 transition-colors hover:bg-slate-50'
                    title='Download'
                >
                    <Download class='h-5 w-5' />
                </a>
                <button
                    onclick={() => isMaximized = !isMaximized}
                    class='rounded-sm p-2 text-slate-500 transition-colors hover:bg-slate-50'
                    title={isMaximized ? 'Restore' : 'Maximize'}
                >
                    {#if isMaximized}
                        <Minimize2 class='h-5 w-5' />
                    {:else}
                        <Maximize2 class='h-5 w-5' />
                    {/if}
                </button>
                <div class='mx-1 h-6 w-px bg-slate-100'></div>
                <button
                    onclick={onClose}
                    class='rounded-sm p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500'
                >
                    <X class='h-5 w-5' />
                </button>
            </div>
        </div>

        <!-- Content / Preview Area -->
        <div class='group relative flex-1 overflow-hidden bg-slate-100'>
            <!-- Placeholder for PDF/Doc Viewer -->
            <div class='flex h-full w-full flex-col items-center justify-center p-8'>
                <div class='flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-sm bg-white shadow-lg'>
                    <div class='flex flex-1 flex-col items-center justify-center gap-6 p-12 text-center'>
                        <div class='flex h-20 w-20 items-center justify-center border border-slate-100 bg-slate-50 rounded-full'>
                            <FileText class='h-10 w-10 text-slate-300' />
                        </div>
                        <div class='space-y-2'>
                            <h4 class='text-lg font-medium text-slate-900'>Document Preview</h4>
                            <p class='max-w-sm text-sm text-slate-500'>
                                In a real application, this would render a PDF viewer or a document preview.
                                For this demonstration, we've simulated the interface.
                            </p>
                        </div>
                        <a
                            href={documentUrl}
                            download={documentName}
                            class='rounded-sm bg-[#0A77FF] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0864d6]'
                        >
                            Download to view full content
                        </a>
                    </div>

                    <!-- Simulated Content Skeleton -->
                    <div class='pointer-events-none px-12 pb-12 space-y-4 opacity-20'>
                        <div class='h-4 w-3/4 -sm bg-slate-200'></div>
                        <div class='h-4 w-full -sm bg-slate-200'></div>
                        <div class='h-4 w-5/6 -sm bg-slate-200'></div>
                        <div class='h-32 w-full -sm bg-slate-100'></div>
                        <div class='h-4 w-2/3 -sm bg-slate-200'></div>
                        <div class='h-4 w-full -sm bg-slate-200'></div>
                    </div>
                </div>
            </div>

            <!-- Navigation Arrows (if multiple documents) -->
            <button class='absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 shadow-md transition-all opacity-0 hover:bg-white group-hover:opacity-100'>
                <ChevronLeft class='h-6 w-6' />
            </button>
            <button class='absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 shadow-md transition-all opacity-0 hover:bg-white group-hover:opacity-100'>
                <ChevronRight class='h-6 w-6' />
            </button>
        </div>

        <!-- Footer / Zoom Controls -->
        <div class='flex shrink-0 items-center justify-between border-t border-slate-100 bg-white px-6 py-3'>
            <div class='flex items-center gap-4'>
                <span class='text-[12px] font-medium text-slate-600'>Page 1 of 12</span>
            </div>
            <div class='flex items-center gap-4 rounded-sm border border-slate-100 bg-slate-50 px-3 py-1'>
                <button class='px-2 font-bold text-slate-500 hover:text-slate-900'>-</button>
                <span class='min-w-[40px] text-center text-[12px] font-bold text-slate-700'>100%</span>
                <button class='px-2 font-bold text-slate-500 hover:text-slate-900'>+</button>
            </div>
            <div class='flex items-center gap-2'>
                <span class='text-[11px] text-slate-400'>Press Esc to close</span>
            </div>
        </div>
    </div>
</div>
