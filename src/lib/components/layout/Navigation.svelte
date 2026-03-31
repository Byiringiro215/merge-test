<script lang='ts'>
    import type { Resource } from '$lib/auth/index.svelte';
    import type { Component } from 'svelte';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import { getAuthState, hasPermission, logout } from '$lib/auth/index.svelte';
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
    } from '$lib/components/ui/dropdown-menu';
    import {
        BookOpen,
        GraduationCap,
        LayoutGrid,
        LogOut,
        Menu,
        Monitor,
        Search,
        Settings,
        X,
    } from '@lucide/svelte';
    import { cubicOut } from 'svelte/easing';
    import { slide } from 'svelte/transition';

    interface SubNavItem {
        label: string;
        href: string;
    }

    interface NavItem {
        id: string;
        label: string;
        href: string;
        icon: Component;
        resource: Resource;
        subNav?: SubNavItem[];
    }

    const auth = getAuthState();

    const allNavItems: NavItem[] = [
        {
            id: 'dg-general',
            label: 'DG General',
            href: '/dashboard',
            icon: LayoutGrid,
            resource: 'sdms:schools',
        },
        {
            id: 'curriculum',
            label: 'Curriculum',
            href: '/curricula',
            icon: BookOpen,
            resource: 'sdms:schools',
            subNav: [
                { label: 'General', href: '/curricula' },
                { label: 'Students', href: '/students' },
                { label: 'Schools', href: '/schools' },
            ],
        },
        {
            id: 'training',
            label: 'Training',
            href: '/teachers',
            icon: GraduationCap,
            resource: 'sdms:staff',
            subNav: [{ label: 'Overview', href: '/teachers' }],
        },
        {
            id: 'digital-tech',
            label: 'Digital Tech',
            href: '/digital-tech',
            icon: Monitor,
            resource: 'sdms:schools',
            subNav: [{ label: 'Overview', href: '/digital-tech' }],
        },
    ];

    const navItems = $derived(
        auth.permissionsLoaded
            ? allNavItems.filter(item => hasPermission(item.resource, 'read'))
            : [...allNavItems],
    );

    let searchQuery = $state('');
    let mobileMenuOpen = $state(false);
    let expandedMobileNav = $state<string | null>(null);

    const activeDepartment = $derived.by(() => {
        const path = page.url.pathname;
        for (const item of navItems) {
            if (
                item?.subNav
                && item.subNav.some(
                    sub =>
                        path === sub.href || path.startsWith(`${sub.href}/`),
                )
            ) {
                return item;
            }
        }
        return navItems[0];
    });

    const userInitials = $derived(
        auth.user?.name
            ?.split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) ?? '',
    );

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
        if (!mobileMenuOpen) {
            expandedMobileNav = null;
        }
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
        expandedMobileNav = null;
    }

    function toggleMobileNavExpand(itemId: string) {
        expandedMobileNav = expandedMobileNav === itemId ? null : itemId;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && mobileMenuOpen) {
            closeMobileMenu();
        }
    }

    function isSubNavActive(subHref: string): boolean {
        const path = page.url.pathname;
        return path === subHref || path.startsWith(`${subHref}/`);
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<nav class='sticky top-0 z-10 w-full bg-white'>
    <!-- Main Navigation Bar -->
    <div
        class='flex h-16 items-center justify-between border-b border-gray-200 px-6 lg:px-10'
    >
        <!-- Logo -->
        <a href={resolve('/')} class='flex items-center gap-1'>
            <div class='h-10 w-10 flex items-center'>
                <img
                    src='/rtb-logo.png'
                    alt='RTB Logo'
                    class='w-full object-cover'
                />
            </div>
            <span class='text-lg font-semibold text-primary'>RTB</span>
        </a>

        <!-- Navigation Links - Hidden on mobile -->
        <div class='hidden items-center gap-1 md:flex'>
            {#each navItems as item (item.id)}
                {@const isActive = activeDepartment?.id === item.id}
                <a
                    href={resolve(item.href as any)}
                    class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-normal transition-colors {isActive
                        ? 'bg-[#205FAD1A] text-[#205FAD]'
                        : 'text-[#565D6D] hover:bg-gray-50 hover:text-gray-900'}"
                >
                    <item.icon class='h-4 w-4' />
                    {item.label}
                </a>
            {/each}
        </div>

        <!-- Right Section -->
        <div class='flex items-center gap-3'>
            <!-- Search Bar - Hidden on mobile -->
            <div class='relative hidden lg:block'>
                <Search
                    class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                />
                <input
                    type='text'
                    placeholder='Search across dashboards...'
                    bind:value={searchQuery}
                    class='h-9 w-64 rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                />
            </div>

            <button
                type='button'
                class='rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700'
                aria-label='Settings'
            >
                <Settings class='h-5 w-5' />
            </button>

            <!-- User Avatar Dropdown -->
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <button
                        type='button'
                        class='h-9 w-9 overflow-hidden rounded-full bg-linear-to-br from-blue-500 to-blue-600 cursor-pointer'
                    >
                        <span
                            class='flex h-full w-full items-center justify-center text-sm font-medium text-white'
                        >{userInitials}</span
                        >
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' class='w-56'>
                    <DropdownMenuLabel>
                        <div class='flex flex-col gap-0.5'>
                            <span class='text-sm font-medium'
                            >{auth.user?.name ?? ''}</span
                            >
                            <span
                                class='text-xs font-normal text-muted-foreground'
                            >{auth.user?.email ?? ''}</span
                            >
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onclick={() => logout()}
                        class='text-red-600 cursor-pointer'
                    >
                        <LogOut class='mr-2 h-4 w-4' />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <!-- Mobile Menu Button -->
            <button
                type='button'
                onclick={toggleMobileMenu}
                class='rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 md:hidden'
                aria-label='Menu'
            >
                {#if mobileMenuOpen}
                    <X class='h-5 w-5' />
                {:else}
                    <Menu class='h-5 w-5' />
                {/if}
            </button>
        </div>
    </div>

    <!-- Sub Navigation - Desktop -->
    {#if activeDepartment?.subNav && activeDepartment.subNav.length > 1}
        <div class='hidden border-b border-gray-200 px-6 md:block lg:px-10'>
            <div class='flex items-center gap-6'>
                {#each activeDepartment.subNav as subItem (subItem.href)}
                    {@const isActive = isSubNavActive(subItem.href)}
                    <a
                        href={resolve(subItem.href as any)}
                        class="relative py-3 text-sm font-medium transition-colors {isActive
                            ? 'text-primary'
                            : 'text-gray-500 hover:text-gray-900'}"
                    >
                        {subItem.label}
                        {#if isActive}
                            <span
                                class='absolute bottom-0 left-0 right-0 h-0.5 bg-primary'
                            ></span>
                        {/if}
                    </a>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Mobile Navigation Menu -->
    {#if mobileMenuOpen}
        <div
            transition:slide={{ duration: 300, easing: cubicOut }}
            class='absolute inset-x-0 top-full z-60 border-t border-gray-200 bg-white md:hidden overflow-hidden shadow-lg'
        >
            <!-- Mobile Search -->
            <div class='px-4 py-3'>
                <div class='relative'>
                    <Search
                        class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                    />
                    <input
                        type='text'
                        placeholder='Search across dashboards...'
                        bind:value={searchQuery}
                        class='h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    />
                </div>
            </div>

            <!-- Mobile Nav Links with Sub-nav -->
            <div class='px-4 pb-4'>
                {#each navItems as item (item.id)}
                    {@const isActive = activeDepartment?.id === item.id}
                    {@const hasSubNav = item.subNav && item.subNav.length > 1}
                    {@const isExpanded = expandedMobileNav === item.id}
                    <div class='mb-1'>
                        {#if hasSubNav}
                            <!-- Department with sub-nav: toggle on click -->
                            <button
                                type='button'
                                onclick={() => toggleMobileNavExpand(item.id)}
                                class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors {isActive
                                    ? 'bg-[#205FAD1A] text-primary'
                                    : 'text-[#565D6D] hover:bg-gray-100 hover:text-gray-900'}"
                            >
                                <span class='flex items-center gap-3'>
                                    <item.icon class='h-5 w-5' />
                                    {item.label}
                                </span>
                                <svg
                                    class="h-4 w-4 transition-transform {isExpanded
                                        ? 'rotate-180'
                                        : ''}"
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        stroke-width='2'
                                        d='M19 9l-7 7-7-7'
                                    />
                                </svg>
                            </button>
                            <!-- Collapsible sub-nav items -->
                            {#if isExpanded}
                                <div
                                    class='mt-1 space-y-1 pl-11'
                                    transition:slide={{
                                        duration: 200,
                                        easing: cubicOut,
                                    }}
                                >
                                    {#each item.subNav as subItem (subItem.href)}
                                        {@const isSubActive = isSubNavActive(
                                            subItem.href,
                                        )}
                                        <a
                                            href={resolve(subItem.href as any)}
                                            onclick={closeMobileMenu}
                                            class="block rounded-lg px-3 py-2 text-sm transition-colors {isSubActive
                                                ? 'text-[#205FAD] font-normal bg-[#205FAD1A]'
                                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}"
                                        >
                                            {subItem.label}
                                        </a>
                                    {/each}
                                </div>
                            {/if}
                        {:else}
                            <!-- Department without sub-nav: navigate directly -->
                            <a
                                href={resolve(item.href as any)}
                                onclick={closeMobileMenu}
                                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal transition-colors {isActive
                                    ? 'bg-[#205FAD1A] text-[#205FAD]'
                                    : 'text-[#565D6D] hover:bg-gray-100 hover:text-gray-900'}"
                            >
                                <item.icon class='h-5 w-5' />
                                {item.label}
                            </a>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</nav>
