<script lang='ts'>
    import type { UserRole } from '$lib/accreditation/types/auth';
    import { getPageHeader } from '$lib/accreditation/context/page-header.svelte';
    import { Bell, LogOut, Menu, User } from '@lucide/svelte';
    import PortalBreadcrumbs from './PortalBreadcrumbs.svelte';

    const { role, onOpenMobile }: { role: UserRole; onOpenMobile?: () => void } = $props();
    const pageHeader = getPageHeader();

    let open = $state(false);
    let closeTimeout: any;

    function handleOpen() {
        if (closeTimeout)
            clearTimeout(closeTimeout);
        open = true;
    }

    function handleClose() {
        closeTimeout = setTimeout(() => {
            open = false;
        }, 200);
    }

    function toggleOpen() {
        open = !open;
    }
</script>

<header class='bg-white'>
    <div class='flex items-center justify-between px-6 py-2'>
        <div class='flex items-center gap-3'>
            {#if onOpenMobile}
                <button
                    type='button'
                    onclick={onOpenMobile}
                    class='-ml-1 rounded-sm cursor-pointer p-1.5 text-slate-500 transition-colors hover:bg-slate-100 md:hidden'
                    aria-label='Open sidebar'
                >
                    <Menu class='h-5 w-5' />
                </button>
            {/if}
            <PortalBreadcrumbs />
        </div>

        <div class='flex items-center gap-3'>
            <button type='button' class='cursor-pointer p-2 text-[#667085] transition-colors hover:text-slate-700'>
                <Bell class='h-4.5 w-4.5' />
            </button>

            <div
                class='relative ml-1'
                onmouseenter={handleOpen}
                onmouseleave={handleClose}
                role='button'
                tabindex='0'
            >
                <button
                    class='flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-200 outline-none transition-opacity hover:opacity-90'
                    onclick={toggleOpen}
                >
                    <img
                        src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
                        alt='User profile'
                        class='h-full w-full object-cover'
                    />
                </button>

                {#if open}
                    <div
                        class='absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden -sm bg-white p-1 shadow-lg ring-1 ring-slate-200'
                        onmouseenter={handleOpen}
                        onmouseleave={handleClose}
                        role='menu'
                        tabindex='0'
                    >
                        <a
                            href={`/accreditation/${role}/profile`}
                            class='flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-slate-700 hover:bg-slate-50'
                            onclick={() => (open = false)}
                        >
                            <User class='h-4 w-4' />
                            <span>Profile</span>
                        </a>
                        <div class='my-1 h-px bg-slate-100'></div>
                        <a
                            href='/signin'
                            class='flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-red-600 hover:bg-red-50'
                            onclick={() => (open = false)}
                        >
                            <LogOut class='h-4 w-4' />
                            <span>Logout</span>
                        </a>
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <div class='px-6'>
        <div class='flex w-full border-b border-[#EAECF0] pb-2'>
            {#if pageHeader.title}
                <div class='flex w-full items-center justify-between gap-10'>
                    <div>
                        <h1 class='text-[18px] font-semibold leading-tight text-[#101828]'>{pageHeader.title}</h1>
                        {#if pageHeader.description}
                            <p class='mt-1 text-[13px] text-[#64748B]'>{pageHeader.description}</p>
                        {/if}
                    </div>
                    {#if pageHeader.action}
                        {@render pageHeader.action()}
                    {/if}
                </div>
            {:else}
                <div class='flex w-full items-center justify-between gap-10'>
                    <div class='space-y-2 py-2'>
                        <div class='h-5 w-[240px] animate-pulse -sm bg-slate-100'></div>
                        <div class='h-3 w-[320px] animate-pulse -sm bg-slate-50'></div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</header>
