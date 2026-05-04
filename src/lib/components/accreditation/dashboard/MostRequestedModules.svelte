<script lang='ts'>
    import Card from '$lib/components/accreditation/ui/Card.svelte';
    import CardContent from '$lib/components/accreditation/ui/CardContent.svelte';
    import { MoreVertical } from '@lucide/svelte';

    const modules = [
        { id: '#1', name: 'JavaScript', percentage: 10.3, color: '#0A77FF' },
        { id: '#2', name: 'Fundamentals Of Programming', percentage: 8.30, color: '#0A77FF' },
        { id: '#3', name: 'Embedded Systems', percentage: 8.00, color: '#0A77FF' },
        { id: '#4', name: 'Cyber Security', percentage: 4.02, color: '#0A77FF' },
        { id: '#5', name: 'Machine Learing', percentage: 3.40, color: '#0A77FF' },
    ];
</script>

<Card class='h-full animate-slide-up overflow-hidden -sm border border-slate-200 bg-white shadow-none'>
    <CardContent class='flex h-full flex-col p-4'>
        <div class='flex items-start justify-between'>
            <div class='w-full space-y-1'>
                <h3 class='text-sm text-slate-900'>Most Requested Modules</h3>
                <p class='min-w-[240px] text-[11px] font-medium leading-snug text-slate-400'>
                    Manage your team members and their account permissions here.
                </p>
            </div>
            <MoreVertical class='h-4 w-4 cursor-pointer text-slate-400' />
        </div>

        <div class='mt-4 flex items-baseline gap-2 border-t pt-2'>
            <span class='text-2xl font-bold text-slate-900'>230</span>
            <span class='text-[11px] font-medium text-slate-400'>Modules</span>
        </div>

        <div class='mt-4 space-y-4'>
            {#each modules as mod}
                <div class='flex items-center gap-4'>
                    <span class='w-4 text-xs text-slate-400'>{mod.id}</span>
                    <div class='flex-1 space-y-2'>
                        <div class='flex items-center justify-between'>
                            <span class='text-[11px] text-slate-700'>{mod.name}</span>
                            <span class='text-[11px] font-bold text-slate-900'>{mod.percentage.toFixed(2)}%</span>
                        </div>
                        <div class='h-2 w-full overflow-hidden rounded-full border border-slate-100 bg-slate-50'>
                            <div
                                class='h-full rounded-full bg-[#0A77FF] transition-all duration-1000'
                                style='width: {(mod.percentage / 12) * 100}%'
                            ></div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <div class='mt-auto flex justify-end border-t border-slate-100 pt-6'>
            <button class='cursor-pointer -sm border border-slate-200 px-4 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-50'>
                View full report
            </button>
        </div>
    </CardContent>
</Card>
