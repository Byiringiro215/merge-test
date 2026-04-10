<script lang='ts'>
    import type { Component } from 'svelte';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { getAuthState, logout } from '$lib/auth/index.svelte';
    import { Card } from '$lib/components/ui/card';
    import { Input } from '$lib/components/ui/input';
    import {
        ChartPie,
        LoaderCircle,
        LogOut,
        Search,
        SquareKanban,
    } from '@lucide/svelte';
    import BarChart3Icon from '@lucide/svelte/icons/bar-chart-3';
    import CloudIcon from '@lucide/svelte/icons/cloud';
    import MessageSquareIcon from '@lucide/svelte/icons/message-square';
    import SettingsIcon from '@lucide/svelte/icons/settings';
    import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';

    let searchQuery = $state('');

    const auth = getAuthState();

    $effect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            goto(resolve('/signin'));
        }
    });

    const userInitials = $derived(
        auth.user?.name
            ?.split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) ?? '',
    );

    interface App {
        id: string;
        name: string;
        icon: Component | null;
        iconType: 'component' | 'image' | 'text';
        iconSrc?: string;
        iconText?: string;
        href: string;
        isAuthenticated: boolean;
    }

    const apps: App[] = [
        {
            id: 'tdmp',
            name: 'T D M P',
            icon: null,
            iconType: 'image',
            iconSrc: '/rtb-logo.png',
            href: '/dashboard',
            isAuthenticated: true,
        },
        {
            id: 'curriculum',
            name: 'Curriculum',
            icon: BarChart3Icon,
            iconType: 'component',
            href: '/#',
            isAuthenticated: true,
        },
        {
            id: 'elearning',
            name: 'E-Learning',
            icon: null,
            iconType: 'image',
            iconSrc: '/RP-logo.png',
            href: '#',
            isAuthenticated: true,
        },
        {
            id: 'core',
            name: 'Core',
            icon: ChartPie,
            iconType: 'component',
            href: '#',
            isAuthenticated: false,
        },
        {
            id: 'security',
            name: 'Security',
            icon: ShieldCheckIcon,
            iconType: 'component',
            href: '#',
            isAuthenticated: false,
        },
        {
            id: 'cloud',
            name: 'Cloud',
            icon: CloudIcon,
            iconType: 'component',
            href: '#',
            isAuthenticated: false,
        },
        {
            id: 'team',
            name: 'Team',
            icon: MessageSquareIcon,
            iconType: 'component',
            href: '#',
            isAuthenticated: false,
        },
        {
            id: 'project',
            name: 'Project',
            icon: SquareKanban,
            iconType: 'component',
            href: '#',
            isAuthenticated: false,
        },
        {
            id: 'settings',
            name: 'Settings',
            icon: SettingsIcon,
            iconType: 'component',
            href: '#',
            isAuthenticated: false,
        },
    ];

    const authenticatedApps = $derived(apps.filter(app => app.isAuthenticated));

    const moreApps = $derived(apps.filter(app => !app.isAuthenticated));

    const filteredAuthenticatedApps = $derived(
        searchQuery
            ? authenticatedApps.filter(app =>
                app.name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            : authenticatedApps,
    );

    const filteredMoreApps = $derived(
        searchQuery
            ? moreApps.filter(app =>
                app.name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            : moreApps,
    );
</script>

{#if auth.isLoading}
    <div class='flex min-h-screen items-center justify-center bg-[#F9FAFB]'>
        <LoaderCircle class='h-8 w-8 animate-spin text-primary' />
    </div>
{:else if auth.isAuthenticated}
    <div class='min-h-screen bg-[#F9FAFB] font-manrope overflow-x-hidden'>
        <!-- Header -->
        <header class='bg-white border-b border-gray-200'>
            <div class='w-full max-w-375 mx-auto px-4 sm:px-6 lg:px-5'>
                <div class='flex items-center justify-between h-16'>
                    <!-- Logo -->
                    <div class='flex items-center'>
                        <img
                            src='/rtb-logo.png'
                            alt='RTB Rwanda'
                            class='h-10.75 w-13.25 object-cover'
                        />
                        <span
                            class='text-xl leading-5 -mx-0.5 tracking-normal text-primary font-bold mt-2 font-inter'
                        >RTB Rwanda</span
                        >
                    </div>

                    <!-- User info -->
                    <div class='flex items-center gap-4'>
                        <span
                            class='text-sm font-medium text-[#181B20] hidden sm:block tracking-normal'
                        >{auth.user?.name ?? ''}</span
                        >
                        <div class='flex items-center gap-3'>
                            <div
                                class='h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium overflow-hidden'
                            >
                                <span>{userInitials}</span>
                            </div>
                            <div class='h-8 w-px bg-gray-200'></div>
                            <button
                                onclick={() => logout()}
                                class='p-2 text-gray-500 hover:text-[#8F96A3] hover:bg-gray-100 rounded-lg transition-colors'
                            >
                                <LogOut class='h-5 w-5' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main
            class='w-full max-w-375 mx-auto px-4 sm:px-6 lg:px-5 py-8 sm:py-12'
        >
            <!-- Page Header -->
            <div
                class='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12'
            >
                <div>
                    <h1
                        class='text-2xl sm:text-3xl font-semibold -tracking-[0.75px] leading-7.5 text-primary-black'
                    >
                        Applications
                    </h1>
                    <p class='text-sm sm:text-base text-[#8F96A3] mt-1'>
                        Select an application to launch your workspace.
                    </p>
                </div>

                <!-- Search -->
                <div class='relative w-full sm:w-101.5'>
                    <Search
                        class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                    />
                    <Input
                        type='text'
                        placeholder='Filter apps...'
                        bind:value={searchQuery}
                        class='pl-10 h-11 bg-white border-gray-200 rounded-lg placeholder:text-[#8F96A3]'
                    />
                </div>
            </div>

            <!-- Authenticated Apps Section -->
            {#if filteredAuthenticatedApps.length > 0}
                <section class='mb-10 sm:mb-14'>
                    <h2 class='text-sm font-medium text-[#8F96A3] mb-4 sm:mb-6'>
                        Authenticated Apps
                    </h2>
                    <div
                        class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5'
                    >
                        {#each filteredAuthenticatedApps as app (app.id)}
                            {@render AppCard(app)}
                        {/each}
                    </div>
                </section>
            {/if}

            <!-- More Apps Section -->
            {#if filteredMoreApps.length > 0}
                <section>
                    <h2 class='text-sm font-medium text-[#8F96A3] mb-4 sm:mb-6'>
                        More Apps
                    </h2>
                    <div
                        class='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5'
                    >
                        {#each filteredMoreApps as app (app.id)}
                            {@render AppCard(app)}
                        {/each}
                    </div>
                </section>
            {/if}

            <!-- No results -->
            {#if filteredAuthenticatedApps.length === 0 && filteredMoreApps.length === 0}
                <div class='text-center py-12'>
                    <p class='text-gray-500'>
                        No apps found matching "{searchQuery}"
                    </p>
                </div>
            {/if}
        </main>
    </div>
{/if}

<!-- App Card  -->
{#snippet AppCard(app: App)}
    <a href={resolve(app.href as any)} class='block'>
        <Card
            class='group h-35  sm:h-51 bg-white hover:bg-gray-50 border-[#F3F4F6] hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:gap-6 items-center justify-center '
        >
            <div
                class='size-16 rounded-xl border border-[#F3F4F6] flex items-center justify-center group-hover:scale-105 transition-transform'
            >
                {#if app.iconType === 'image' && app.iconSrc}
                    <img
                        src={app.iconSrc}
                        alt={app.name}
                        class='w-14 h-7 object-cover'
                    />
                {:else if app.iconType === 'text' && app.iconText}
                    <div class='text-secondary font-bold text-xs sm:text-sm'>
                        {app.iconText}
                    </div>
                {:else if app.iconType === 'component' && app.icon}
                    <app.icon class='h-6 w-6 sm:h-7 sm:w-7 text-secondary' />
                {/if}
            </div>
            <span
                class='text-sm sm:text-base leading-5 font-medium text-[#181B20] tracking-[3px]'
            >{app.name}</span
            >
        </Card>
    </a>
{/snippet}
