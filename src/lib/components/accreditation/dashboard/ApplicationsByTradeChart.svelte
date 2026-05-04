<script lang='ts'>
    import Card from '$lib/components/accreditation/ui/Card.svelte';
    import CardContent from '$lib/components/accreditation/ui/CardContent.svelte';
    import { MoveUpRight } from '@lucide/svelte';

    const trades = [
        { name: 'Software Engineering & Embe...', value: 45, color: '#2069C1' },
        { name: 'Masonry', value: 25, color: '#59A8FF' },
        { name: 'Welding', value: 15, color: '#84C3FF' },
        { name: 'Music & Arts', value: 10, color: '#D1E9FF' },
        { name: 'Tailoring', value: 5, color: '#EFF8FF' },
    ];
</script>

<Card class='h-full animate-slide-up overflow-hidden rounded-sm border border-slate-200 bg-white shadow-none'>
    <CardContent class='flex h-full flex-col p-4'>
        <div class='flex items-center justify-between'>
            <div class='relative h-60 w-60'>
                <!-- Simple CSS-based Pie Chart -->
                <div
                    class='h-full w-full rounded-full'
                    style='background: conic-gradient(
                        #2069C1 0.0% 45.0%,
                        #59A8FF 45.0% 70.0%,
                        #84C3FF 70.0% 85.0%,
                        #D1E9FF 85.0% 95.0%,
                        #EFF8FF 95.0% 100.0%
                        )'
                ></div>
            </div>

            <div class='flex flex-col gap-3'>
                {#each trades as trade}
                    <div class='flex items-center gap-2'>
                        <div class='h-2 w-2 rounded-full' style='background-color: {trade.color}'></div>
                        <span class='max-w-[140px] truncate text-[11px] text-slate-500'>
                            {trade.name}
                        </span>
                        <span class='text-[11px] font-bold text-slate-900'>{trade.value}%</span>
                    </div>
                {/each}
            </div>
        </div>

        <div class='mt-auto flex items-center justify-between border-t border-slate-50 pt-3'>
            <div>
                <p class='text-[10px] uppercase tracking-wider text-slate-400'>Total Applications</p>
                <p class='text-lg font-bold text-slate-900'>1,284</p>
            </div>
            <div class='flex items-center gap-1 rounded-sm bg-green-50 px-2 py-0.5 text-green-600'>
                <MoveUpRight size={12} strokeWidth={2.5} />
                <span class='text-[10px] font-bold'>12%</span>
            </div>
        </div>
    </CardContent>
</Card>
