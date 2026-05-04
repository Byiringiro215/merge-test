<script lang='ts'>
    import { page } from '$app/stores';
    import { portalNavigationConfig } from '$lib/accreditation/config/navigation';
    import { cn } from '$lib/accreditation/utils/cn';
    import { getPortalNavigation } from '$lib/accreditation/utils/navigation';
    import { LifeBuoy, LogOut, Settings } from '@lucide/svelte';

    const { role, onCloseMobile }: { role: string; onCloseMobile?: () => void } = $props();

    const items = $derived(getPortalNavigation(role, $page.url.pathname));
    const config = $derived(portalNavigationConfig[role as keyof typeof portalNavigationConfig]);
</script>

<div class='flex h-full flex-col'>
    <div class='mb-8 flex items-center gap-3 px-2'>
        <img
            src='/rtb-logo.png'
            alt='RTB Logo'
            width='36'
            height='36'
            class='rounded-sm'
        />
        <div>
            <p class='text-sm font-bold text-[#353E49]'>
                RTB Accreditation
            </p>
            <p class='text-xs text-[#2069C1]'>
                {config.shortLabel} Portal
            </p>
        </div>
    </div>

    <nav class='flex flex-col gap-0.5'>
        {#each items as item}
            <a
                href={item.href}
                onclick={onCloseMobile}
                class={cn(
                    'flex items-center gap-3 rounded-sm px-3 py-3 text-sm transition-colors',
                    item.isActive
                        ? 'bg-[#F9FAFB] text-[#2069C1] font-medium'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
                )}
            >
                <item.icon
                    class={cn(item.isActive ? 'text-[#2069C1]' : 'text-[#84888C]')}
                    strokeWidth={1.5}
                    size={20}
                />
                <span class={cn(item.isActive ? 'text-[#2069C1]' : 'text-[#353E49]')}>
                    {item.title}
                </span>
            </a>
        {/each}
    </nav>

    <div class='mt-auto space-y-1 pt-4'>
        <button
            type='button'
            onclick={onCloseMobile}
            class='flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-3 text-left text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        >
            <LifeBuoy class='text-[#667085]' strokeWidth={1.5} size={20} />
            <span class='text-[#344054]'>Support</span>
        </button>
        <button
            type='button'
            onclick={onCloseMobile}
            class='flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-3 text-left text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        >
            <Settings class='text-[#667085]' strokeWidth={1.5} size={20} />
            <span class='text-[#344054]'>Settings</span>
        </button>

        <div class='sticky bottom-0 mt-4 flex items-center gap-3 border-t border-[#EAECF0] bg-white px-1 py-4'>
            <div class='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100'>
                <span class='text-xs font-semibold text-slate-600'>OR</span>
            </div>
            <div class='min-w-0 flex-1'>
                <p class='truncate text-sm font-medium text-slate-800'>
                    Olivia Rhye
                </p>
                <p class='truncate text-xs text-[#475467]'>olivia@company.com</p>
            </div>
            <button
                type='button'
                class='text-[#475467] cursor-pointer hover:text-slate-900 transition-colors'
                aria-label='Log out'
            >
                <LogOut class='h-4 w-4' strokeWidth={1.5} />
            </button>
        </div>
    </div>
</div>
