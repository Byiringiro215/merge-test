<script lang='ts'>
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import { PUBLIC_API_URL } from '$env/static/public';
    import {
        getAccessToken,
        getAuthState,
    } from '$lib/auth/index.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Card } from '$lib/components/ui/card';
    import { Input } from '$lib/components/ui/input';
    import {
        Check,
        Info,
        LifeBuoy,
        LoaderCircle,
        Shield,
        User,
    } from '@lucide/svelte';

    const auth = getAuthState();

    // Inline auth guard (this page is outside (app) layout)
    $effect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            goto(resolve(`/signin?redirect=${encodeURIComponent(page.url.pathname + page.url.search)}` as any));
        }
    });

    // Read OAuth query params
    const clientId = $derived(page.url.searchParams.get('client_id') ?? '');
    const redirectUri = $derived(
        page.url.searchParams.get('redirect_uri') ?? '',
    );
    const scope = $derived(page.url.searchParams.get('scope') ?? '');
    const stateParam = $derived(page.url.searchParams.get('state') ?? '');
    const codeChallenge = $derived(
        page.url.searchParams.get('code_challenge') ?? '',
    );
    const codeChallengeMethod = $derived(
        page.url.searchParams.get('code_challenge_method') ?? 'S256',
    );
    const responseType = $derived(
        page.url.searchParams.get('response_type') ?? 'code',
    );

    // Derive a human-readable app name from client_id
    const appName = $derived(
        clientId
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase()) || 'Application',
    );

    // Parse scopes into permission descriptions
    const scopeLabels: Record<string, string> = {
        openid: 'Read your basic profile information',
        profile: 'Read your daily activities, address, and corporate division',
        email: 'Access your email address',
        offline_access:
            'Maintain access when you are not actively using the app',
    };

    const permissions = $derived(
        scope
            .split(' ')
            .filter(Boolean)
            .map(s => scopeLabels[s] ?? s),
    );

    let isSubmitting = $state(false);

    async function handleAllow() {
        isSubmitting = true;

        const token = getAccessToken();
        const authorizeUrl = new URL(`${PUBLIC_API_URL}/v1/oauth/authorize`);
        authorizeUrl.searchParams.set('response_type', responseType);
        authorizeUrl.searchParams.set('client_id', clientId);
        authorizeUrl.searchParams.set('redirect_uri', redirectUri);
        if (scope)
            authorizeUrl.searchParams.set('scope', scope);
        if (stateParam)
            authorizeUrl.searchParams.set('state', stateParam);
        authorizeUrl.searchParams.set('code_challenge', codeChallenge);
        authorizeUrl.searchParams.set(
            'code_challenge_method',
            codeChallengeMethod,
        );

        // The backend returns a 302 redirect — we follow it via the browser
        window.location.href = `${authorizeUrl.toString()}&access_token=${token}`;
    }

    function handleDeny() {
        if (!redirectUri)
            return;
        const denyUrl = new URL(redirectUri);
        denyUrl.searchParams.set('error', 'access_denied');
        if (stateParam)
            denyUrl.searchParams.set('state', stateParam);
        window.location.href = denyUrl.toString();
    }
</script>

{#if auth.isLoading}
    <div class='flex min-h-screen items-center justify-center bg-white'>
        <LoaderCircle class='h-8 w-8 animate-spin text-primary' />
    </div>
{:else if auth.isAuthenticated}
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
                    Securely connect and streamline information from different
                    services in one place
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
                <!-- Consent Card -->
                <Card
                    class='w-full max-w-85 sm:max-w-115 px-7 py-8 sm:px-9 sm:py-10 border border-[#DEE1E6] shadow-sm rounded-2xl'
                >
                    <!-- Card Header -->
                    <div class='mb-6'>
                        <h2
                            class='text-xl sm:text-[24px] font-manrope leading-8 -tracking-[0.6px] font-semibold text-[#171A1F] mb-2'
                        >
                            Connect {appName} to RTB
                        </h2>
                        <p
                            class='text-sm text-[#8F96A3] font-inter font-normal'
                        >
                            {appName} wants to access your {auth.user?.name
                                ?? ''} account to provide full analytics integration
                        </p>
                    </div>

                    <!-- Step 1: Confirm Identity -->
                    <div class='mb-6'>
                        <div class='flex items-center gap-2 mb-4'>
                            <User class='h-4 w-4 text-[#205FAD]' />
                            <span
                                class='text-sm font-inter font-semibold text-[#171A1F]'
                            >Confirm your identity</span
                            >
                        </div>
                        <div class='space-y-3 pl-6'>
                            <div>
                                <label
                                    for='consent-name'
                                    class='block text-xs font-inter font-medium text-[#8F96A3] mb-1'
                                >Name</label
                                >
                                <Input
                                    id='consent-name'
                                    type='text'
                                    value={auth.user?.name ?? ''}
                                    disabled
                                    class='h-10 w-full border-[#DEE1E6]! bg-[#F9FAFB] rounded-lg text-sm font-inter'
                                />
                            </div>
                            <div>
                                <label
                                    for='consent-id'
                                    class='block text-xs font-inter font-medium text-[#8F96A3] mb-1'
                                >ID</label
                                >
                                <Input
                                    id='consent-id'
                                    type='text'
                                    value={auth.user?.email ?? ''}
                                    disabled
                                    class='h-10 w-full border-[#DEE1E6]! bg-[#F9FAFB] rounded-lg text-sm font-inter'
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Review Permissions -->
                    <div class='mb-6'>
                        <div
                            class='flex items-center justify-between mb-4'
                        >
                            <div class='flex items-center gap-2'>
                                <Shield class='h-4 w-4 text-[#205FAD]' />
                                <span
                                    class='text-sm font-inter font-semibold text-[#171A1F]'
                                >Review requested permissions</span
                                >
                            </div>
                            <span
                                class='text-[10px] font-inter font-medium tracking-wider text-[#205FAD] bg-blue-50 px-2 py-0.5 rounded'
                            >STANDARD ACCESS</span
                            >
                        </div>
                        <div class='space-y-3 pl-6'>
                            {#each permissions as permission (permission)}
                                <div class='flex items-start gap-2.5'>
                                    <Check
                                        class='h-4 w-4 text-green-500 mt-0.5 shrink-0'
                                    />
                                    <span
                                        class='text-sm font-inter text-[#565D6D]'
                                    >{permission}</span
                                    >
                                </div>
                            {/each}
                        </div>
                    </div>

                    <!-- Info -->
                    <div
                        class='flex items-start gap-2.5 mb-6 bg-blue-50 rounded-lg px-4 py-3'
                    >
                        <Info
                            class='h-4 w-4 text-[#205FAD] mt-0.5 shrink-0'
                        />
                        <span class='text-xs font-inter text-[#565D6D]'>
                            You can revoke/change permissions at any time from
                            your account dashboard
                        </span>
                    </div>

                    <!-- Action Buttons -->
                    <div class='flex gap-3'>
                        <Button
                            type='button'
                            variant='outline'
                            onclick={handleDeny}
                            disabled={isSubmitting}
                            class='flex-1 h-11 border-[#DEE1E6] text-[#565D6D] font-medium font-inter rounded-lg'
                        >
                            Deny
                        </Button>
                        <Button
                            type='button'
                            onclick={handleAllow}
                            disabled={isSubmitting}
                            class='flex-1 h-11 bg-[#205FAD] hover:bg-[#2563EB] text-white font-medium font-inter rounded-lg disabled:opacity-70'
                        >
                            {#if isSubmitting}
                                <LoaderCircle
                                    class='h-4 w-4 animate-spin mr-2'
                                />
                                Allowing...
                            {:else}
                                Allow Access
                            {/if}
                        </Button>
                    </div>

                    <!-- Terms Footer -->
                    <p
                        class='text-[10px] text-[#8F96A3] font-inter text-center mt-4'
                    >
                        By clicking Allow Access, you agree to the <a
                            href={resolve('/terms' as any)}
                            class='text-[#4770EB] hover:underline'
                        >Terms of Use</a
                        >,
                        <a href={resolve('/privacy' as any)} class='text-[#4770EB] hover:underline'
                        >Privacy Policy</a
                        >,
                        <a
                            href={resolve('/security' as any)}
                            class='text-[#4770EB] hover:underline'
                        >Security Policy</a
                        >
                    </p>
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
{/if}
