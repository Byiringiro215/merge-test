<script lang='ts'>
    import { page } from '$app/stores';
    import { cn } from '$lib/accreditation/utils/cn';
    import {
        CalendarCheck2,
        FolderOpen,
        NotepadText,
        ShieldUser,
    } from '@lucide/svelte';

    const { role = 'super-admin', children } = $props<{ role?: string; children?: any }>();

    const basePath = $derived(role === 'super-admin' ? '/accreditation/super-admin/evaluations' : role === 'supervisor' ? '/accreditation/supervisor/evaluations' : '/accreditation/evaluator');

    const allNavItems = $derived([
        {
            title: 'Applications',
            href: `${basePath}/applications`,
            icon: NotepadText,
        },
        {
            title: 'Evaluators',
            href: `${basePath}/evaluators`,
            icon: ShieldUser,
        },
        {
            title: 'Evaluation Criteria Files',
            href: `${basePath}/criteria`,
            icon: FolderOpen,
        },
        {
            title: 'Due Diligence Schedule',
            href: `${basePath}/schedule`,
            icon: CalendarCheck2,
        },
    ]);

    const navItems = $derived(allNavItems.filter((item) => {
        if (role === 'evaluator' && item.title === 'Evaluators') {
            return false;
        }
        return true;
    }));
</script>

<div class='mb-6 flex w-full flex-col items-center justify-between'>
    <div class='flex w-full items-center justify-between gap-2'>
        {#each navItems as item}
            {@const isActive = $page.url.pathname === item.href}
            <a
                href={item.href}
                class={cn(
                    'group relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm px-4 py-3 transition-colors duration-200 whitespace-nowrap',
                    isActive
                        ? 'text-primary'
                        : 'text-[#353E49] hover:bg-slate-50 hover:text-primary',
                )}
            >
                {#if isActive}
                    <div
                        class='absolute inset-0 z-0 rounded-sm bg-[#F9FAFB]'
                    ></div>
                {/if}
                <item.icon
                    class={cn(
                        'relative z-10 h-4 w-4 transition-colors duration-200',
                        isActive ? 'text-primary' : 'text-[#353E49] group-hover:text-primary',
                    )}
                    strokeWidth={1}
                />
                <span
                    class={cn(
                        'relative z-10 text-sm font-medium transition-colors duration-200',
                        isActive ? 'text-primary' : 'text-[#353E49] group-hover:text-primary',
                    )}
                >
                    {item.title}
                </span>
            </a>
        {/each}
    </div>
    {#if children}
        <div class='mt-6 flex w-full justify-end'>
            {@render children()}
        </div>
    {/if}
</div>
