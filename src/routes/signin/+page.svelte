<script lang='ts'>
    import { goto, invalidateAll } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import { Button } from '$lib/components/ui/button';
    import { Card } from '$lib/components/ui/card';
    import {
        ArrowRight,
        LifeBuoy,
        LoaderCircle,
        Lock,
        Mail,
    } from '@lucide/svelte';
    import { loginForm } from './login.remote';

    let isSubmitting = $state(false);
    let errorMessage = $state('');

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
            <!-- Gateway Access Label -->
            <div class='flex items-center gap-2 mb-10'>
                <div class='w-7 h-[1.5px] bg-[#0D28774D]'></div>
                <span
                    class='text-xs tracking-[0.35px] font-medium text-[#0D287799] leading-5 font-inter'
                >GATEWAY ACCESS</span
                >
            </div>

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

            <!-- Illustration -->
            <div
                class='flex-1 flex items-start justify-center lg:justify-start'
            >
                <img
                    src='/signin-image.png'
                    alt='Data platform illustration'
                    class='w-full max-w-125 lg:max-w-135 h-auto object-contain'
                />
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
                class='w-full max-w-85 sm:max-w-105 h-128.5 px-7 py-8 sm:px-9 sm:py-10 border border-[#DEE1E6]  shadow-sm rounded-2xl '
            >
                <!-- Card Header -->
                <div class='text-center mb-7'>
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

                <!-- Form -->
                <form
                    {...loginForm.enhance(async ({ submit }) => {
                        errorMessage = '';
                        isSubmitting = true;

                        try {
                            await submit();
                            await invalidateAll();
                            const redirect
                                = page.url.searchParams.get('redirect') || '/';
                            goto(resolve(redirect as any));
                        }
                        catch (e) {
                            errorMessage = e instanceof Error ? e.message : 'Sign in failed. Please try again.';
                            isSubmitting = false;
                        }
                    })}
                >
                    <!-- Error Message -->
                    {#if errorMessage}
                        <div
                            class='mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-inter'
                        >
                            {errorMessage}
                        </div>
                    {/if}

                    <!-- Identifier Field -->
                    <div class='mb-4'>
                        <label
                            for='identifier'
                            class='block text-sm font-inter font-medium text-[#181B20] leading-6 tracking-normal mb-2'
                        >
                            Email
                        </label>
                        <div
                            class='relative sm:w-84.25'
                        >
                            <Mail
                                class='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]'
                            />
                            <input
                                {...loginForm.fields.identifier.as('text')}
                                id='identifier'
                                placeholder='jane@rtb.rw'
                                disabled={isSubmitting}
                                class='pl-10 h-11 w-full border border-[#DEE1E6] bg-[#F9FAFB] rounded-lg text-sm placeholder:text-[#171A1F] font-inter focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring outline-none px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50'
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
                                class='text-sm text-[#4770EB] hover:text-[#2563EB] font-medium font-inter leading-6 tracking-normal'
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div class='relative'>
                            <Lock
                                class='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]'
                            />
                            <input
                                {...loginForm.fields._password.as('password')}
                                id='password'
                                placeholder='••••••••'
                                disabled={isSubmitting}
                                class='pl-10 h-11 w-full border border-[#DEE1E6] bg-[#F9FAFB] rounded-xl text-sm placeholder:text-black placeholder:tracking-normal font-inter focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring outline-none px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50'
                            />
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
                    disabled
                    class='w-full h-11 border-[#DEE1E6] hover:bg-gray-50 bg-[#F3F4F6] text-[#323843] font-medium font-inter rounded-lg flex items-center justify-center  gap-2.5 disabled:opacity-50'
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
