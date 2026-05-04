<script lang='ts'>
    import type { LoginInput } from '$lib/types/form-schemas';
    import type { StandardSchemaV1 } from '@bajustone/fetcher';
    import type { Component } from 'svelte';
    import { goto, invalidateAll } from '$app/navigation';

    import { page } from '$app/state';
    import { Button } from '$lib/components/ui/button';
    import { Card } from '$lib/components/ui/card';
    import { loginSchema } from '$lib/types/form-schemas';
    import {
        ArrowRight,
        BarChart3,
        Check,
        Eye,
        EyeOff,
        LifeBuoy,
        LoaderCircle,
        Lock,
        Mail,
    } from '@lucide/svelte';
    import { loginForm } from './login.remote';

    type IconComponent = Component<{ class?: string; size?: number }>;

    interface SystemApp {
        id: string;
        name: string;
        description: string;
        icon: IconComponent | null;
        iconType: 'component' | 'image';
        iconSrc?: string;
        accent: string;
        soft: string;
        category: 'authenticated' | 'unauthenticated';
        image?: string;
    }

    const systems: SystemApp[] = [
        {
            id: 'tdmp',
            name: 'TDMP',
            description: 'TVET Data Management Platform — central data hub',
            icon: null,
            iconType: 'image',
            iconSrc: '/rtb-logo.png',
            accent: '#205FAD',
            soft: '#E8EFFE',
            category: 'authenticated',
            image: '/signin-image.png',
        },
        {
            id: 'elearning',
            name: 'E-LEARNING',
            description: 'RP digital learning, courses and content delivery',
            icon: null,
            iconType: 'image',
            iconSrc: '/RP-logo.png',
            accent: '#16A34A',
            soft: '#E7F6EC',
            category: 'authenticated',
            image: '/signin-image.png',
        },
        {
            id: 'accreditation',
            name: 'ACREDITATION',
            description: 'School and program quality accreditation',
            icon: BarChart3,
            iconType: 'component',
            accent: '#205FAD',
            soft: '#FFF7ED',
            category: 'authenticated',
            image: '/signin-image.png',
        },
        {
            id: 'sdms',
            name: 'SDMS',
            description: 'School Data Management System',
            icon: null,
            iconType: 'image',
            iconSrc: '/Sdms.png',
            accent: '#0D2877',
            soft: '#EDF1F5',
            category: 'unauthenticated',
        },
        {
            id: 'camis',
            name: 'CAMIS',
            description: 'Competence Assessment Management Information System',
            icon: null,
            iconType: 'image',
            iconSrc: '/Camis.png',
            accent: '#0D2877',
            soft: '#EDF1F5',
            category: 'unauthenticated',
        },
        {
            id: 'tmis',
            name: 'TMIS',
            description: 'Teacher Management Information System',
            icon: null,
            iconType: 'component',
            accent: '#171A1F',
            soft: '#EDF1F5',
            category: 'unauthenticated',
        },
    ];

    let isSubmitting = $state(false);
    let passwordValue = $state('');
    let showPassword = $state(false);
    let selectedSystemId = $state<string>(systems[0].id);
    const selectedSystem = $derived(
        systems.find(s => s.id === selectedSystemId) ?? systems[0],
    );

    function handleMicrosoftSignIn() {
    // Microsoft SSO — coming soon
    }
</script>

<div class='h-screen flex flex-col lg:flex-row overflow-hidden'>
    <!-- Left Side - Light Blue/Gray Background -->
    <div
        class='w-full lg:w-1/2 bg-linear-to-b from-[#F3F7FA] to-white flex flex-col h-[50vh] lg:h-screen relative'
    >
        <!-- Decorative Gradient -->
        <div class='absolute top-0 left-10 w-[3cm] h-[5cm] bg-linear-to-br from-[#4770EB1A] to-transparent pointer-events-none'></div>

        <div
            class='flex-1 flex flex-col px-8 sm:px-12 lg:px-16 xl:px-20 pt-10 lg:pt-14 min-h-0 overflow-y-auto no-scrollbar'
        >
            <!-- Gateway Access Header -->
            <div class='mb-12 flex items-center gap-3'>
                <div class='h-px w-10 bg-[#0D28774D]'></div>
                <span class='font-inter text-xs font-semibold tracking-[0.05em] text-[#0D287780] uppercase'>GATEWAY ACCESS</span>
            </div>

            <!-- Main Heading -->
            <h1
                class='text-[32px] sm:text-[44px] font-extrabold lg:text-[48px] text-[#0D2877] font-manrope leading-[1.1] -tracking-[1px] mb-6'
            >
                TDMP — Unified Data<br />Platform .
            </h1>

            <!-- Subtitle -->
            <p
                class='text-[16px] sm:text-[17px] font-inter font-normal text-[#0D287799] max-w-115 mb-14 leading-relaxed'
            >
                Securely connect and streamline information from
                different services in one place
            </p>

            <!-- Systems Selector -->
            <div class='flex flex-col gap-12 pb-12'>
                <!-- Authenticated Systems -->
                <div>
                    <h2 class='text-[13px] font-bold text-[#0D28774D] uppercase tracking-wider mb-8 font-inter'>
                        Authenticated Systems
                    </h2>
                    <div class='grid grid-cols-3 gap-6 sm:gap-8'>
                        {#each systems.filter(s => s.category === 'authenticated') as system (system.id)}
                            {@const Icon = system.icon}
                            {@const isSelected = selectedSystemId === system.id}
                            <button
                                type='button'
                                onclick={() => selectedSystemId = system.id}
                                class='group flex flex-col items-center gap-3 cursor-pointer focus:outline-none'
                                aria-pressed={isSelected}
                            >
                                <div class='relative w-full aspect-square bg-white rounded-lg shadow-md border border-black/3 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] {isSelected ? 'ring-2 ring-offset-4 ring-offset-[#F3F7FA] ring-[#205FAD]' : ''}'>
                                    {#if isSelected && system.id === 'tdmp'}
                                        <div class='absolute top-1.5 right-1.5 bg-[#205FAD] text-white rounded-full p-1 shadow-sm z-20'>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                    {/if}

                                    <div class='p-5 sm:p-7 w-full h-full flex items-center justify-center'>
                                        {#if system.iconType === 'image' && system.iconSrc}
                                            <img
                                                src={system.iconSrc}
                                                alt='{system.name} logo'
                                                class='w-full h-full object-contain'
                                            />
                                        {:else if Icon}
                                            <Icon size={48} class='text-[#205FAD]' />
                                        {/if}
                                    </div>
                                </div>
                                <span class='text-[11px] sm:text-xs font-bold text-[#171A1F] tracking-wide font-inter'>
                                    {system.name}
                                </span>
                            </button>
                        {/each}
                    </div>
                </div>

                <!-- Unauthenticated Systems -->
                <div>
                    <h2 class='text-[13px] font-bold text-[#0D28774D] uppercase tracking-wider mb-8 font-inter'>
                        Unauthenticated Systems
                    </h2>
                    <div class='grid grid-cols-3 gap-6 sm:gap-8'>
                        {#each systems.filter(s => s.category === 'unauthenticated') as system (system.id)}
                            {@const isSelected = selectedSystemId === system.id}
                            <button
                                type='button'
                                onclick={() => selectedSystemId = system.id}
                                class='group flex flex-col items-center gap-3 cursor-pointer focus:outline-none'
                                aria-pressed={isSelected}
                            >
                                <div class='relative w-full aspect-square bg-white rounded-lg shadow-sm border border-black/3 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] group-hover:-translate-y-1 {isSelected ? 'ring-2 ring-offset-4 ring-offset-[#F3F7FA] ring-[#205FAD]' : ''}'>
                                    <div class='p-5 sm:p-7 w-full h-full flex items-center justify-center'>
                                        {#if system.iconType === 'image' && system.iconSrc}
                                            <img
                                                src={system.iconSrc}
                                                alt='{system.name} logo'
                                                class='w-full h-full object-contain'
                                            />
                                        {:else}
                                            <span class='text-xl sm:text-2xl font-black text-[#171A1F] font-manrope tracking-tight'>
                                                {system.name}
                                            </span>
                                        {/if}
                                    </div>
                                </div>
                                <span class='text-[11px] sm:text-xs font-bold text-[#171A1F] tracking-wide font-inter'>
                                    {system.name}
                                </span>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class='pb-10 mt-auto pt-12'>
                <p class='text-[12px] sm:text-sm text-[#0D287766] font-inter'>
                    © 2026 RTB Systems. All rights reserved.
                </p>
            </div>
        </div>
    </div>

    <!-- Right Side - White Background -->
    <div class='w-full lg:w-1/2 bg-[#F9FBFC] flex flex-col h-[50vh] lg:h-screen overflow-y-auto no-scrollbar'>
        <div
            class='flex-1 flex flex-col px-6 sm:px-12 lg:px-16 py-8'
        >
            <!-- Logo at Top -->
            <div
                class='flex items-center pt-4 lg:pt-8 mb-8 gap-3'
            >
                <img
                    src='/rtb-logo.png'
                    alt='RTB Rwanda'
                    class='h-10 w-12 object-contain'
                />
                <span
                    class='text-xl font-inter font-bold text-[#205FAD]'
                >RTB Rwanda</span>
            </div>

            <div class='flex-1 flex items-center justify-center'>
                <!-- Sign In Card -->
                <Card
                    class='w-full sm:max-w-115 px-8 py-10 sm:px-12 sm:py-14 bg-white border border-[#F0F2F5] rounded-lg'
                >
                    <!-- System Logo Overlay -->
                    <div class='flex justify-center mb-6'>
                        <div class='w-20 h-20 flex items-center justify-center'>
                            {#if selectedSystem.iconType === 'image' && selectedSystem.iconSrc}
                                <img
                                    src={selectedSystem.iconSrc}
                                    alt='{selectedSystem.name} logo'
                                    class='w-full h-full object-contain'
                                />
                            {:else if selectedSystem.icon}
                                {@const SystemIcon = selectedSystem.icon}
                                <SystemIcon size={64} class='text-[#205FAD]' />
                            {:else}
                                <span class='text-3xl font-black text-[#171A1F] font-manrope'>
                                    {selectedSystem.name}
                                </span>
                            {/if}
                        </div>
                    </div>

                    <!-- Card Header -->
                    <div class='text-center mb-10'>
                        <h2
                            class='text-2xl sm:text-[28px] font-manrope leading-tight font-bold text-[#171A1F] mb-3'
                        >
                            Welcome To {selectedSystem.name}
                        </h2>
                    </div>

                    <!-- Form -->
                    <form
                        {...loginForm
                            .preflight(loginSchema as unknown as StandardSchemaV1<LoginInput, LoginInput>)
                            .enhance(async ({ submit }) => {
                                isSubmitting = true;
                                const flow = page.url.searchParams.get('flow');
                                const redirect = page.url.searchParams.get('redirect') || (flow ? `/oauth/consent?flow=${flow}` : '/dashboard');
                                try {
                                    await submit();
                                    if ((loginForm.fields.allIssues()?.length ?? 0) > 0)
                                        return;
                                    await invalidateAll();
                                    await goto(redirect);
                                }
                                finally {
                                    isSubmitting = false;
                                }
                            })}
                        class='space-y-6'
                    >
                        <!-- Error Message -->
                        {#if (loginForm.fields.allIssues()?.length ?? 0) > 0}
                            <div
                                class='rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-inter'
                            >
                                {#each loginForm.fields.allIssues() ?? [] as issue, i (i)}
                                    <div>{issue.message}</div>
                                {/each}
                            </div>
                        {/if}

                        <!-- Identifier Field -->
                        <div class='space-y-2'>
                            <label
                                for='identifier'
                                class='block text-sm font-inter font-semibold text-[#171A1F]'
                            >
                                Email
                            </label>
                            <div class='relative'>
                                <Mail
                                    class='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none'
                                />
                                <input
                                    {...loginForm.fields.identifier.as('text')}
                                    id='identifier'
                                    placeholder='name@rtb.rw'
                                    disabled={isSubmitting}
                                    class='h-12 w-full pl-11 pr-4 border border-[#F0F2F5] bg-[#F8FAFC] rounded-lg text-sm font-inter focus:ring-2 focus:ring-[#205FAD]/10 focus:border-[#205FAD] outline-none transition-all disabled:opacity-50'
                                />
                            </div>
                        </div>

                        <!-- Password Field -->
                        <div class='space-y-2'>
                            <div class='flex items-center justify-between'>
                                <label
                                    for='password'
                                    class='block text-sm font-inter font-semibold text-[#171A1F]'
                                >
                                    Password
                                </label>
                                <button
                                    type='button'
                                    class='text-xs text-[#205FAD] hover:underline font-medium font-inter'
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div class='relative'>
                                <Lock
                                    class='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none'
                                />
                                <input
                                    {...loginForm.fields._password.as('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    placeholder='•••••••••'
                                    disabled={isSubmitting}
                                    oninput={e => passwordValue = e.currentTarget.value}
                                    class='h-12 w-full pl-11 pr-12 border border-[#F0F2F5] bg-[#F8FAFC] rounded-lg text-sm font-inter focus:ring-2 focus:ring-[#205FAD]/10 focus:border-[#205FAD] outline-none transition-all disabled:opacity-50'
                                />
                                {#if passwordValue}
                                    <button
                                        type='button'
                                        onclick={() => showPassword = !showPassword}
                                        class='absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#205FAD]'
                                    >
                                        {#if showPassword}
                                            <EyeOff class='h-4 w-4' />
                                        {:else}
                                            <Eye class='h-4 w-4' />
                                        {/if}
                                    </button>
                                {/if}
                            </div>
                        </div>

                        <!-- Sign In Button -->
                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            class='w-full h-12 bg-[#205FAD] hover:bg-[#1D559B] text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]'
                        >
                            {#if isSubmitting}
                                <LoaderCircle class='h-4 w-4 animate-spin' />
                                Signing in...
                            {:else}
                                Sign In
                                <ArrowRight class='h-4 w-4' />
                            {/if}
                        </Button>
                    </form>

                    <!-- Divider -->
                    <div class='relative my-8'>
                        <div class='absolute inset-0 flex items-center'>
                            <div class='w-full border-t border-[#F0F2F5]'></div>
                        </div>
                        <div class='relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#94A3B8] bg-white px-4'>
                            OR CONTINUE WITH
                        </div>
                    </div>

                    <!-- Microsoft Sign In -->
                    <Button
                        type='button'
                        variant='outline'
                        onclick={handleMicrosoftSignIn}
                        class='w-full h-12 border-[#F0F2F5] hover:bg-gray-50 bg-[#F8FAFC] text-[#1E293B] font-bold rounded-lg flex items-center justify-center gap-3 transition-all'
                    >
                        <svg class='h-4 w-4' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <rect x='1' y='1' width='9' height='9' fill='#F25022' />
                            <rect x='11' y='1' width='9' height='9' fill='#7FBA00' />
                            <rect x='1' y='11' width='9' height='9' fill='#00A4EF' />
                            <rect x='11' y='11' width='9' height='9' fill='#FFB900' />
                        </svg>
                        Sign in with Microsoft
                    </Button>

                    <!-- Register Divider -->
                    <div class='relative my-8'>
                        <div class='absolute inset-0 flex items-center'>
                            <div class='w-full border-t border-[#F0F2F5]'></div>
                        </div>
                        <div class='relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#94A3B8] bg-white px-4'>
                            YOU DON'T HAVE ACCOUNT
                        </div>
                    </div>

                    <!-- Register Now Button -->
                    <a
                        href='/accreditation/register'
                        class='w-full h-12 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-lg flex items-center justify-center transition-all active:scale-[0.98]'
                    >
                        Register Now
                    </a>
                </Card>
            </div>

            <!-- Contact Support - Bottom -->
            <div
                class='mt-auto pt-8 flex items-center justify-center gap-2 text-[#94A3B8] font-inter text-sm'
            >
                <div class='flex items-center justify-center w-6 h-6 rounded-full border border-[#E2E8F0]'>
                    <LifeBuoy class='h-3.5 w-3.5' />
                </div>
                <span class='text-xs font-medium'>Need help? Contact support</span>
            </div>
        </div>
    </div>
</div>
