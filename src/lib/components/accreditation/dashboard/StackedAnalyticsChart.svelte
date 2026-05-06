<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import Card from '$lib/components/accreditation/ui/Card.svelte';
    import CardContent from '$lib/components/accreditation/ui/CardContent.svelte';
    import { ExternalLink, MoreHorizontal } from '@lucide/svelte';
    import { onMount } from 'svelte';

    export interface ChartDataItem {
        label: string;
        rejected: number;
        approved: number;
        pending: number;
    }

    const { data }: { data: Record<string, ChartDataItem[]> } = $props();

    let activeTab = $state('12 Months');
    let hoveredIndex = $state<number | null>(null);
    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });

    const currentData = $derived.by(() => {
        const d = data[activeTab] || [];
        if (activeTab === '30 Days' || activeTab === '24 Hours') {
            return d.filter((_, index) => index % 2 === 0);
        }
        return d;
    });

    const actualMax = $derived.by(() => {
        if (currentData.length === 0) {
            return 20;
        }
        return Math.max(...currentData.map(d => d.rejected + d.approved + d.pending), 1);
    });

    const maxValue = $derived(Math.ceil(actualMax / 4) * 4);
    const dynamicYAxis = $derived(Array.from({ length: 6 }, (_, i) => Math.round(maxValue * (1 - i / 5))));
</script>

{#if !mounted}
    <Card class='flex h-[400px] items-center justify-center rounded-sm border border-slate-200 bg-white shadow-none'>
        <div class='flex animate-pulse flex-col items-center gap-2'>
            <div class='h-4 w-32 rounded-sm bg-slate-100'></div>
            <div class='h-48 w-full rounded-sm bg-slate-50'></div>
        </div>
    </Card>
{:else}
    <Card class='animate-slide-up overflow-hidden rounded-sm border border-slate-200 bg-white text-[#101828] shadow-none'>
        <div class='flex items-center justify-between px-6 py-4'>
            <h3 class='text-base '>Applications Trend</h3>
            <MoreHorizontal class='h-5 w-5 cursor-pointer text-slate-400' />
        </div>

        <!-- Header with Filters and Legend -->
        <div class='flex flex-col gap-4 p-6 pb-2 pt-0 sm:flex-row sm:items-center sm:justify-between'>
            <div class='flex w-fit items-center gap-1 rounded-sm p-1'>
                {#each ['12 Months', '30 Days', '7 Days', '24 Hours'] as tab}
                    <button
                        onclick={() => {
                            activeTab = tab;
                            hoveredIndex = null;
                        }}
                        class={cn(
                            'cursor-pointer rounded-sm px-3 py-1.5 text-xs font-medium transition-all',
                            activeTab === tab
                                ? 'border border-[#E5E5E7] bg-[#F8F9FB] text-[#323539]'
                                : 'text-slate-500 hover:text-slate-800',
                        )}
                    >
                        {tab}
                    </button>
                {/each}
            </div>

            <div class='flex items-center gap-4 text-xs font-medium text-slate-500'>
                <div class='flex items-center gap-1.5'>
                    <div class='h-2 w-2 rounded-full bg-[#E0EFFF]'></div>
                    <span>Pending</span>
                </div>
                <div class='flex items-center gap-1.5'>
                    <div class='h-2 w-2 rounded-full bg-[#59A8FF]'></div>
                    <span>Approved</span>
                </div>
                <div class='flex items-center gap-1.5'>
                    <div class='h-2 w-2 rounded-full bg-[#2069C1]'></div>
                    <span>Rejected</span>
                </div>
            </div>
        </div>

        <CardContent class='no-scrollbar overflow-x-auto pt-2'>
            <div class='relative flex h-56 min-w-[600px] flex-col'>
                <!-- Y-Axis and Grid Lines -->
                <div class='absolute inset-x-0 inset-y-0 flex flex-col justify-between'>
                    {#each dynamicYAxis as val}
                        <div class='flex h-[18%] w-full items-center gap-4'>
                            <span class='w-4 text-right text-[10px] font-medium text-slate-400'>{val}</span>
                            <div class='flex-1 border-t border-slate-100'></div>
                        </div>
                    {/each}
                </div>

                <!-- X-Axis and Bars Area -->
                <div
                    role='presentation'
                    class='relative ml-10 flex h-full flex-1 items-end justify-between pr-4'
                    onmouseleave={() => hoveredIndex = null}
                >
                    {#each currentData as d, index}
                        {@const rejectedHeightPct = (d.rejected / maxValue) * 100}
                        {@const totalVal = d.rejected + d.approved + d.pending}

                        <div
                            role='button'
                            tabindex='0'
                            class='group relative mb-1 flex h-full flex-1 cursor-pointer flex-col items-center justify-end outline-none'
                            onmouseenter={() => hoveredIndex = index}
                            onfocus={() => hoveredIndex = index}
                            onkeydown={e => e.key === 'Enter' && (hoveredIndex = index)}
                        >
                            <!-- Tooltip -->
                            {#if hoveredIndex === index}
                                <div
                                    class='fade-in zoom-in absolute z-50 min-w-[120px] animate-in rounded-sm bg-[#101828] p-3 text-[10px] text-white shadow-xl duration-200 pointer-events-none'
                                    style='bottom: {rejectedHeightPct}%; transform: translateY(-12px); margin-bottom: 8px;'
                                >
                                    <p class='mb-2 flex justify-between border-b border-white/10 pb-1.5 font-bold'>
                                        <span>{d.label} {activeTab === '30 Days' ? 'Day' : ''}</span>
                                        <span class='font-normal text-slate-500 underline decoration-slate-600'>{activeTab}</span>
                                    </p>
                                    <div class='space-y-1.5'>
                                        <div class='flex items-center justify-between gap-4'>
                                            <div class='flex items-center gap-1.5'>
                                                <div class='h-1.5 w-1.5 rounded-full bg-[#2069C1]'></div>
                                                <span class='text-slate-400'>Rejected</span>
                                            </div>
                                            <span class=' text-white'>{d.rejected}</span>
                                        </div>
                                        <div class='flex items-center justify-between gap-4'>
                                            <div class='flex items-center gap-1.5'>
                                                <div class='h-1.5 w-1.5 rounded-full bg-[#59A8FF]'></div>
                                                <span class='text-slate-400'>Approved</span>
                                            </div>
                                            <span class=' text-white'>{d.approved}</span>
                                        </div>
                                        <div class='flex items-center justify-between gap-4'>
                                            <div class='flex items-center gap-1.5'>
                                                <div class='h-1.5 w-1.5 rounded-full bg-[#E0EFFF]'></div>
                                                <span class='text-slate-400'>Pending</span>
                                            </div>
                                            <span class=' text-white'>{d.pending}</span>
                                        </div>
                                    </div>
                                    <!-- Tooltip Arrow -->
                                    <div class='absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#101828]'></div>
                                </div>
                            {/if}

                            <!-- Stacked Bar Container -->
                            <div class={cn(
                                'relative h-36 w-8 overflow-hidden rounded-t-sm bg-transparent transition-all duration-300',
                                hoveredIndex === index ? 'scale-x-105 opacity-100' : hoveredIndex !== null ? 'opacity-40' : 'opacity-100',
                            )}>
                                <!-- Pending (Lightest) -->
                                <div
                                    class='absolute inset-x-0 bottom-0 rounded-t-sm bg-[#E0EFFF] transition-all duration-500'
                                    style='height: {(totalVal / maxValue) * 100}%'
                                ></div>
                                <!-- Approved (Medium) -->
                                <div
                                    class='absolute inset-x-0 bottom-0 rounded-t-sm bg-[#59A8FF] transition-all duration-500'
                                    style='height: {((d.rejected + d.approved) / maxValue) * 100}%'
                                ></div>
                                <!-- Rejected (Darkest) -->
                                <div
                                    class='absolute inset-x-0 bottom-0 rounded-t-sm bg-[#2069C1] transition-all duration-500'
                                    style='height: {(d.rejected / maxValue) * 100}%'
                                ></div>
                            </div>
                            <!-- X-Axis Label -->
                            <div class='flex h-4 items-center justify-center'>
                                <span class='text-[10px] font-medium text-slate-400'>{d.label}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </CardContent>

        <!-- Footer -->
        <div class='mt-8 flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4'>
            <span class='text-xs font-medium text-slate-400'>Data graph</span>
            <button class='flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#2069C1] hover:underline'>
                Open
                <ExternalLink class='h-3.5 w-3.5' strokeWidth={2} />
            </button>
        </div>
    </Card>
{/if}
