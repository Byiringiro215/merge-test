<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import Card from '../ui/Card.svelte';
    import CardContent from '../ui/CardContent.svelte';

    export interface StatItem {
        label: string;
        value: string | number;
        icon: any;
        iconColor?: string;
        href?: string;
    }

    const { items, class: className, gridCols = 4 }: {
        items: StatItem[];
        class?: string;
        gridCols?: 2 | 3 | 4 | 5;
    } = $props();

    const gridColsClass = $derived(({
        2: 'xl:grid-cols-2',
        3: 'xl:grid-cols-3',
        4: 'xl:grid-cols-4',
        5: 'xl:grid-cols-5',
    } as const)[gridCols]);
</script>

<div class={cn('relative z-10 mb-6 grid gap-4 bg-white shadow-[0_-20px_40px_white,0_20px_40px_white] md:grid-cols-2', gridColsClass, className)}>
    {#each items as item}
        {#if item.href}
            <a href={item.href} class='block'>
                <Card class='overflow-hidden rounded-md border border-slate-200 bg-white shadow-none transition-colors hover:border-[#0A77FF] hover:bg-blue-50/30'>
                    <CardContent class='flex flex-col gap-4 p-5'>
                        <div class='w-fit rounded-sm border border-[#EAECF0] bg-white p-2.5 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]'>
                            <item.icon class='h-5 w-5' style='color: {item.iconColor || '#64748B'}' strokeWidth={1} />
                        </div>
                        <div class='space-y-1'>
                            <p class='text-sm font-medium text-slate-500'>{item.label}</p>
                            <p class='text-2xl font-bold text-slate-900'>{item.value}</p>
                        </div>
                    </CardContent>
                </Card>
            </a>
        {:else}
            <Card class='overflow-hidden rounded-md border border-slate-200 bg-white shadow-none'>
                <CardContent class='flex flex-col gap-4 p-5'>
                    <div class='w-fit rounded-sm border border-[#EAECF0] bg-white p-2.5 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]'>
                        <item.icon class='h-5 w-5' style='color: {item.iconColor || '#64748B'}' strokeWidth={1} />
                    </div>
                    <div class='space-y-1'>
                        <p class='text-sm font-medium text-slate-500'>{item.label}</p>
                        <p class='text-2xl font-bold text-slate-900'>{item.value}</p>
                    </div>
                </CardContent>
            </Card>
        {/if}
    {/each}
</div>
