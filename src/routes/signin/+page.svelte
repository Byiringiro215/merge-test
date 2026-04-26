<script lang='ts'>
    import type { LoginInput } from '$lib/types/form-schemas';
    import type { StandardSchemaV1 } from '@bajustone/fetcher';
    import type { Component } from 'svelte';
    import { goto, invalidateAll } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import { Button } from '$lib/components/ui/button';
    import { Card } from '$lib/components/ui/card';
    import { loginSchema } from '$lib/types/form-schemas';
    import {
        ArrowRight,
        BarChart3,
        ChartPie,
        Check,
        Eye,
        EyeOff,
        LifeBuoy,
        LoaderCircle,
        Lock,
        Mail,
    } from '@lucide/svelte';
    import { loginForm } from './login.remote';

    type IconComponent = Component<{ class?: string }>;

    interface SystemApp {
        id: string;
        name: string;
        description: string;
        icon: IconComponent | null;
        iconType: 'component' | 'image';
        iconSrc?: string;
        accent: string;
        soft: string;
        tag: string;
    }

    const systems: SystemApp[] = [
        {
            id: 'tdmp',
            name: 'T D M P',
            description: 'TVET Data Management Platform — central data hub',
            icon: null,
            iconType: 'image',
            iconSrc: '/DT-LOGO.svg',
            accent: '#205FAD',
            soft: '#E8EFFE',
            tag: 'Core',
        },
        {
            id: 'TMIS',
            name: 'TMIS',
            description: 'manage all teachers data',
            icon: BarChart3,
            iconType: 'component',
            accent: '#0EA5E9',
            soft: '#E0F2FE',
            tag: 'Academics',
        },
        {
            id: 'elearning',
            name: 'E-Learning',
            description: 'RP digital learning, courses and content delivery',
            icon: null,
            iconType: 'image',
            iconSrc: '/RP-logo.png',
            accent: '#16A34A',
            soft: '#E7F6EC',
            tag: 'Training',
        },
        {
            id: 'core',
            name: 'Core',
            description: 'Identity, organisation and shared platform services',
            icon: ChartPie,
            iconType: 'component',
            accent: '#9333EA',
            soft: '#F2E8FB',
            tag: 'Platform',
        },
    ];

    let isSubmitting = $state(false);
    let identifierValue = $state('');
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

<div class='min-h-screen flex flex-col lg:flex-row overflow-hidden'>
    <!-- Left Side - Light Blue/Gray Background -->
    <div
        class='w-full lg:w-1/2 bg-[#EDF1F5] flex flex-col min-h-[50vh] lg:min-h-screen'
    >
        <div
            class='flex-1 flex flex-col px-8 sm:px-12 lg:px-16 xl:px-20 pt-8 lg:pt-12'
        >

            <!-- Main Heading -->
            <h1
                class='text-[28px] sm:text-[48px] font-extrabold lg:text-[42px] text-[#0D2877] font-manrope leading-13.75 -tracking-[1.2px] mb-6'
            >
                RTB — Unified Data<br />Platform .
            </h1>

            <!-- Subtitle -->
            <p
                class='text-[15px] sm:text-sm font-inter font-normal text-[#0D2877CC] max-w-105 mb-8'
            >
                Securely connect and streamline information from
                different services in one place
            </p>

            <!-- Systems Selector -->
            <div class='flex-1 flex flex-col min-h-0'>
                <div class='flex items-center justify-between mb-3'>
                    <span
                        class='text-[11px] tracking-[0.3px] font-semibold text-[#0D2877CC] uppercase font-inter'
                    >
                        Choose a system to access
                    </span>
                    <span
                        class='text-[11px] tracking-[0.2px] font-medium text-[#0D287799] font-inter'
                    >
                        {systems.length} systems
                    </span>
                </div>

                <div
                    class='flex-1 min-h-0 overflow-y-auto pr-1 -mr-1 space-y-2.5 max-w-150'
                >
                    {#each systems as system (system.id)}
                        {@const Icon = system.icon}
                        {@const isSelected = selectedSystemId === system.id}
                        <button
                            type='button'
                            onclick={() => selectedSystemId = system.id}
                            class='group w-full text-left rounded-xl border bg-white px-4 py-3.5 flex items-center gap-3.5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 {isSelected
                                ? 'border-transparent shadow-md ring-2'
                                : 'border-[#DEE3EC] hover:border-[#C8D2E0]'}'
                            style={isSelected
                                ? `--tw-ring-color: ${system.accent}; box-shadow: 0 0 0 1px ${system.accent}, 0 8px 20px -10px ${system.accent}66;`
                                : ''}
                            aria-pressed={isSelected}
                        >
                            <!-- Logo / Icon -->
                            <div
                                class='shrink-0 w-11 h-11 rounded-lg flex items-center justify-center overflow-hidden border border-black/5'
                                style='background-color: {system.soft};'
                            >
                                {#if system.iconType === 'image' && system.iconSrc}
                                    <img
                                        src={system.iconSrc}
                                        alt='{system.name} logo'
                                        class='w-7 h-7 object-contain'
                                    />
                                {:else if Icon}
                                    <span
                                        class='inline-flex'
                                        style='color: {system.accent};'
                                    >
                                        <Icon class='w-5 h-5' />
                                    </span>
                                {/if}
                            </div>

                            <!-- Name + Description -->
                            <div class='flex-1 min-w-0'>
                                <div class='flex items-center gap-2 mb-0.5'>
                                    <span
                                        class='text-sm font-semibold font-manrope text-[#0D2877] truncate'
                                    >
                                        {system.name}
                                    </span>
                                    <span
                                        class='text-[10px] font-medium font-inter px-1.5 py-0.5 rounded-md tracking-wide uppercase'
                                        style='background-color: {system.soft}; color: {system.accent};'
                                    >
                                        {system.tag}
                                    </span>
                                </div>
                                <p
                                    class='text-xs font-inter text-[#0D287799] leading-snug truncate'
                                >
                                    {system.description}
                                </p>
                            </div>

                            <!-- Checkbox -->
                            <div
                                class='shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 {isSelected
                                    ? 'border-transparent'
                                    : 'border-[#C8D2E0] group-hover:border-[#9CA8BD] bg-white'}'
                                style={isSelected
                                    ? `background-color: ${system.accent}; border-color: ${system.accent};`
                                    : ''}
                                aria-hidden='true'
                            >
                                {#if isSelected}
                                    <Check
                                        class='w-3.5 h-3.5 text-white'
                                        strokeWidth={3}
                                    />
                                {/if}
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class='px-8 sm:px-12 lg:px-16 xl:px-20 pb-8'>
            <p class='text-sm text-[#0D287780]'>
                © 2026 RTB Systems. All rights reserved.
            </p>
        </div>
    </div>

    <!-- Right Side - White Background -->
    <div class='w-full lg:w-1/2 bg-white flex flex-col'>
        <!-- Logo at Top -->

        <div
            class='flex items-center px-8 sm:px-12 lg:px-16 pt-8 lg:pt-12'
        >
            <img
                src='/rtb-logo.png'
                alt='RTB Rwanda'
                class='h-9 w-11 object-contain'
            />
            <span
                class='text-lg font-inter leading-5 -ml-0.5 mt-2 font-bold text-[#1E40AF]'
            >RTB Rwanda</span
            >
        </div>

        <div
            class='flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-8'
        >
            <!-- Sign In Card -->
            <Card
                class='w-fit sm:max-w-105 px-7 py-8 sm:px-9 sm:py-10 border border-[#DEE1E6] shadow-sm rounded-2xl'
            >
                <!-- Card Header -->
                <div class='text-center mb-6'>
                    <h2
                        class='text-xl sm:text-[24px] font-manrope leading-8 -tracking-[0.6px] font-semibold text-[#171A1F] mb-2'
                    >
                        Welcome back
                    </h2>
                    <p
                        class='text-sm text-[#8F96A3] font-inter font-normal'
                    >
                        Enter your credentials to access
                        your account.
                    </p>
                </div>

                <!-- Selected System Banner -->
                {#key selectedSystem.id}
                    {@const SelectedIcon = selectedSystem.icon}
                    <div
                        class='mb-6 rounded-xl border p-3.5 flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200'
                        style='border-color: {selectedSystem.accent}33; background-color: {selectedSystem.soft};'
                    >
                        <div
                            class='shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden border'
                            style='border-color: {selectedSystem.accent}33;'
                        >
                            {#if selectedSystem.iconType === 'image' && selectedSystem.iconSrc}
                                <img
                                    src={selectedSystem.iconSrc}
                                    alt='{selectedSystem.name} logo'
                                    class='w-6 h-6 object-contain'
                                />
                            {:else if SelectedIcon}
                                <span
                                    class='inline-flex'
                                    style='color: {selectedSystem.accent};'
                                >
                                    <SelectedIcon class='w-5 h-5' />
                                </span>
                            {/if}
                        </div>
                        <div class='flex-1 min-w-0'>
                            <p
                                class='text-[10px] font-inter font-semibold tracking-[0.4px] uppercase mb-0.5'
                                style='color: {selectedSystem.accent};'
                            >
                                Signing in to
                            </p>
                            <p
                                class='text-sm font-manrope font-semibold text-[#0D2877] truncate'
                            >
                                {selectedSystem.name}
                            </p>
                        </div>
                        <div
                            class='shrink-0 w-7 h-7 rounded-full flex items-center justify-center'
                            style='background-color: {selectedSystem.accent};'
                            aria-hidden='true'
                        >
                            <Check
                                class='w-4 h-4 text-white'
                                strokeWidth={3}
                            />
                        </div>
                    </div>
                {/key}

                <!-- Form -->
                <form
                    {...loginForm
                        .preflight(loginSchema as unknown as StandardSchemaV1<LoginInput, LoginInput>)
                        .enhance(async ({ submit }) => {
                            isSubmitting = true;
                            // Capture before submit/invalidateAll — once the user is authenticated
                            const redirect = page.url.searchParams.get('redirect') || '/dashboard';
                            try {
                                await submit();
                                // If `invalid()` was called server-side or preflight
                                // rejected, issues will be present on the form.
                                if ((loginForm.fields.allIssues()?.length ?? 0) > 0)
                                    return;
                                await invalidateAll();
                                await goto(resolve(redirect as any));
                            }
                            finally {
                                isSubmitting = false;
                            }
                        })}
                >
                    <!-- Error Message (form-level issues from invalid() or schema failures) -->
                    {#if (loginForm.fields.allIssues()?.length ?? 0) > 0}
                        <div
                            class='mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-inter'
                        >
                            {#each loginForm.fields.allIssues() ?? [] as issue, i (i)}
                                <div>{issue.message}</div>
                            {/each}
                        </div>
                    {/if}

                    <!-- Identifier Field -->
                    <div class='mb-4'>
                        <label
                            for='identifier'
                            class='block text-sm font-inter font-medium text-[#181B20] leading-6 tracking-normal mb-2'
                        >
                            Username or Email
                        </label>
                        <div
                            class='relative sm:w-84.25'
                        >
                            {#if !identifierValue}
                                <Mail
                                    class='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none'
                                />
                            {/if}
                            <input
                                {...loginForm.fields.identifier.as('text')}
                                id='identifier'
                                placeholder='jane@rtb.rw'
                                disabled={isSubmitting}
                                oninput={e => identifierValue = e.currentTarget.value}
                                class="{identifierValue ? 'pl-3' : 'pl-10'} h-11 w-full border border-[#DEE1E6] bg-[#F9FAFB] rounded-[6px] text-sm font-inter focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring outline-none pr-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <!-- Password Field -->
                    <div class='mb-6'>
                        <div
                            class='flex items-center justify-between mb-2'
                        >
                            <label
                                for='password'
                                class='block text-sm font-inter font-medium text-[#181B20]'
                            >
                                Password
                            </label>
                            <button
                                type='button'
                                class='text-sm text-[#4770EB] cursor-pointer hover:underline hover:text-[#2563EB] font-medium font-inter leading-6 tracking-normal'
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div class='relative'>
                            {#if !passwordValue}
                                <Lock
                                    class='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] pointer-events-none'
                                />
                            {/if}
                            <input
                                {...loginForm.fields._password.as('password')}
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                placeholder='••••••••'
                                disabled={isSubmitting}
                                oninput={e => passwordValue = e.currentTarget.value}
                                class="{passwordValue ? 'pl-3' : 'pl-10'} pr-10 h-11 w-full border border-[#DEE1E6] bg-[#F9FAFB] rounded-[6px] text-sm placeholder:tracking-normal font-inter focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring outline-none py-1 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {#if passwordValue}
                                <button
                                    type='button'
                                    onclick={() => showPassword = !showPassword}
                                    class='absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4770EB] cursor-pointer'
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                        class='w-full h-11 bg-[#205FAD] hover:bg-[#2563EB] text-white font-medium rounded-lg flex items-center justify-center gap-2 font-inter disabled:opacity-70'
                    >
                        {#if isSubmitting}
                            <LoaderCircle
                                class='h-4 w-4 animate-spin'
                            />
                            Signing in...
                        {:else}
                            Sign In
                            <ArrowRight
                                class='h-4 w-4'
                            />
                        {/if}
                    </Button>
                </form>

                <!-- Divider -->
                <div class='flex items-center gap-3 my-6'>
                    <div
                        class='flex-1 h-px bg-[#DEE1E6]'
                    ></div>
                    <span
                        class='text-[10px] text-[#8F96A3] font-medium tracking-widest'
                    >OR CONTINUE WITH</span
                    >
                    <div
                        class='flex-1 h-px bg-[#DEE1E6]'
                    ></div>
                </div>

                <!-- Microsoft Sign In -->
                <Button
                    type='button'
                    variant='outline'
                    onclick={handleMicrosoftSignIn}
                    class='w-full h-11 border-[#DEE1E6] hover:bg-gray-50 bg-[#F3F4F6] text-[#323843] font-medium font-inter rounded-lg flex items-center justify-center  gap-2.5 disabled:opacity-50 cursor-pointer'
                >
                    <!-- Microsoft Logo -->
                    <svg
                        class='h-4 w-4'
                        viewBox='0 0 21 21'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <rect
                            x='1'
                            y='1'
                            width='9'
                            height='9'
                            fill='#F25022'
                        />
                        <rect
                            x='11'
                            y='1'
                            width='9'
                            height='9'
                            fill='#7FBA00'
                        />
                        <rect
                            x='1'
                            y='11'
                            width='9'
                            height='9'
                            fill='#00A4EF'
                        />
                        <rect
                            x='11'
                            y='11'
                            width='9'
                            height='9'
                            fill='#FFB900'
                        />
                    </svg>
                    Sign in with Microsoft
                </Button>
            </Card>
        </div>

        <!-- Contact Support - Bottom -->
        <div
            class='px-8 sm:px-12 lg:px-16 pb-8 flex items-center justify-center gap-1.5 text-[#8F96A3] font-inter text-sm'
        >
            <LifeBuoy class='h-4 w-4' />
            <span class='text-sm'>Need help? Contact support</span>
        </div>
    </div>
</div>
