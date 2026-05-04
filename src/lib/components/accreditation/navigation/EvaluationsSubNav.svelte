<script lang='ts'>
    import { page } from '$app/stores';
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import { cn } from '$lib/accreditation/utils/cn';
    import {
        CalendarCheck2,
        FolderOpen,
        NotepadText,
        ShieldUser,
    } from '@lucide/svelte';

    const { role: propRole = null, children } = $props<{ role?: string | null; children?: any }>();

    const simulation = getSimulationState();
    const activeRole = $derived(simulation?.role || propRole);

    const allNavItems = [
        {
            title: 'Applications',
            href: '/accreditation/applications',
            icon: NotepadText,
        },
        {
            title: 'Evaluators',
            href: '/accreditation/evaluators',
            icon: ShieldUser,
        },
        {
            title: 'Evaluation Criteria Files',
            href: '/accreditation/criteria',
            icon: FolderOpen,
        },
        {
            title: 'Due Diligence Schedule',
            href: '/accreditation/schedule',
            icon: CalendarCheck2,
        },
    ];

    const navItems = $derived(allNavItems.filter((item) => {
        if (activeRole === 'evaluator' && item.title === 'Evaluators') {
            return false;
        }
        return true;
    }));

    let scrollContainer: HTMLElement | undefined = $state();

    $effect(() => {
        // Dependencies
        const path = $page.url.pathname;
        if (scrollContainer && path) {
            // Wait for DOM update
            setTimeout(() => {
                const activeLink = scrollContainer?.querySelector('.text-[#2069C1]') as HTMLElement;
                if (activeLink) {
                    activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }, 50);
        }
    });
</script>

<div class='mb-6 flex w-full flex-col gap-4'>
    {#if activeRole === 'super-admin' || activeRole === 'supervisor' || activeRole === 'evaluator' || activeRole === 'merged'}
        <div
            bind:this={scrollContainer}
            class='no-scrollbar flex w-full items-center justify-between gap-2 overflow-x-auto pb-1'
            style='mask-image: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent);'
        >
            {#each navItems as item}
                {@const isActive = ($page.url.pathname as string) === item.href.split('?')[0] || (($page.url.pathname as string) === '/accreditation/applications' && item.title === 'Applications')}
                <a
                    href={item.href}
                    class={cn(
                        'group relative flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm px-6 py-3 transition-colors duration-200',
                        isActive ? 'text-[#2069C1]' : 'text-[#353E49] hover:bg-slate-50 hover:text-[#2069C1]',
                    )}
                >
                    {#if isActive}
                        <div class='absolute inset-0 z-0 rounded-sm bg-[#F9FAFB]'></div>
                    {/if}
                    <item.icon
                        class={cn(
                            'relative z-10 h-4 w-4 transition-colors duration-200',
                            isActive ? 'text-[#2069C1]' : 'text-[#353E49] group-hover:text-[#2069C1]',
                        )}
                        strokeWidth={1}
                    />
                    <span
                        class={cn(
                            'relative z-10 text-sm font-medium transition-colors duration-200',
                            isActive ? 'text-[#2069C1]' : 'text-[#353E49] group-hover:text-[#2069C1]',
                        )}
                    >
                        {item.title}
                    </span>
                </a>
            {/each}
        </div>
    {/if}
    {#if children}
        <div class='mt-2 flex w-full items-center justify-end'>
            {@render children()}
        </div>
    {/if}
</div>
