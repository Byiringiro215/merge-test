<script lang='ts'>
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import { api } from '$lib/api';
    import { getAuthState } from '$lib/auth/index.svelte';
    import { Button } from '$lib/components/ui/button';
    import * as fetcher from '@bajustone/fetcher';
    import {
        ArrowLeftRight,
        Check,
        IdCard,
        Info,
        LoaderCircle,
        LockKeyhole,
        User,
    } from '@lucide/svelte';

    interface FlowMetadata {
        flowId: number;
        client: {
            clientId: string;
            name: string;
        };
        redirectUri: string;
        scopes: string[];
        state: string;
    }

    interface PermissionItem {
        key: string;
        title: string;
        description: string;
    }

    const FLOW_ID_PATTERN = /^\d+$/;

    const auth = getAuthState();

    const flowId = $derived(page.url.searchParams.get('flow') ?? '');
    const currentUrl = $derived(page.url.pathname + page.url.search);

    let flow = $state<FlowMetadata | null>(null);
    let loadedFlowId = $state<string | null>(null);
    let errorMessage = $state<string | null>(null);
    let isLoadingFlow = $state(false);
    let submittingAction = $state<'approve' | 'deny' | null>(null);

    const clientName = $derived(flow?.client.name ?? 'Application');
    const clientLogoSrc = $derived(resolveClientLogo(flow?.client.clientId, flow?.client.name));
    const permissions = $derived(buildPermissions(flow?.scopes ?? []));

    $effect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            goto(resolve(`/signin?redirect=${encodeURIComponent(currentUrl)}` as any));
        }
    });

    $effect(() => {
        if (auth.isLoading || !auth.isAuthenticated)
            return;

        if (!flowId) {
            errorMessage = 'Missing OAuth flow. Please restart the connection from the requesting application.';
            return;
        }

        if (!FLOW_ID_PATTERN.test(flowId)) {
            errorMessage = 'Invalid OAuth flow. Please restart the connection from the requesting application.';
            return;
        }

        if (loadedFlowId === flowId)
            return;

        loadedFlowId = flowId;
        void loadFlow(flowId);
    });

    function errorFromResult(error: Parameters<typeof fetcher.extractErrorMessage>[0], fallback: string): string {
        return fetcher.extractErrorMessage(error) || fallback;
    }

    async function loadFlow(id: string) {
        isLoadingFlow = true;
        errorMessage = null;

        try {
            const result = await api.get('/oauth/flows/{flowId}', {
                params: { flowId: id },
            }).result();

            if (!result.ok)
                throw new Error(errorFromResult(result.error, 'Unable to load this OAuth consent request.'));

            const data = result.data as any;
            flow = {
                flowId: data.flowId ?? Number(id),
                client: {
                    clientId: data.client?.clientId ?? '',
                    name: data.client?.name ?? 'Application',
                },
                redirectUri: data.redirectUri ?? '',
                scopes: data.scopes ?? [],
                state: data.state ?? '',
            } satisfies FlowMetadata;
        }
        catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Unable to load this OAuth consent request.';
        }
        finally {
            isLoadingFlow = false;
        }
    }

    async function handleAllow() {
        if (!flow || submittingAction)
            return;

        submittingAction = 'approve';
        errorMessage = null;

        try {
            const result = await api.post('/oauth/flows/{flowId}/approve', {
                params: { flowId: String(flow.flowId) },
            }).result();

            if (!result.ok)
                throw new Error(errorFromResult(result.error, 'Unable to approve this OAuth request.'));

            const data = result.data as any;
            if (!data.redirectUrl)
                throw new Error('OAuth server did not return a redirect URL.');

            window.location.href = data.redirectUrl;
        }
        catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Unable to approve this OAuth request.';
            submittingAction = null;
        }
    }

    async function handleDeny() {
        if (!flow || submittingAction)
            return;

        submittingAction = 'deny';
        errorMessage = null;

        try {
            const result = await api.post('/oauth/flows/{flowId}/deny', {
                params: { flowId: String(flow.flowId) },
            }).result();

            if (!result.ok)
                throw new Error(errorFromResult(result.error, 'Unable to deny this OAuth request.'));

            const data = result.data as any;
            if (!data.redirectUrl)
                throw new Error('OAuth server did not return a redirect URL.');

            window.location.href = data.redirectUrl;
        }
        catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Unable to deny this OAuth request.';
            submittingAction = null;
        }
    }

    function resolveClientLogo(clientId?: string, name?: string): string {
        const value = `${clientId ?? ''} ${name ?? ''}`.toLowerCase();

        if (value.includes('learning') || value.includes('lms') || value.includes('rp'))
            return '/RP-logo.png';

        if (value.includes('tdmp') || value.includes('data'))
            return '/DT-LOGO.svg';

        return '/rtb-logo.png';
    }

    function titleCaseScope(scope: string): string {
        return scope
            .replace(/[.:_-]/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    function buildPermissions(scopes: string[]): PermissionItem[] {
        const uniqueScopes = Array.from(new Set(scopes.filter(Boolean)));
        const permissionsList: PermissionItem[] = [];
        const hasProfileScope = uniqueScopes.some(scope => ['openid', 'profile', 'email'].includes(scope));

        if (hasProfileScope) {
            permissionsList.push({
                key: 'basic-profile',
                title: 'Read your basic profile information',
                description: 'Includes your name, email address, and corporate division.',
            });
        }

        const scopeCopy: Record<string, Omit<PermissionItem, 'key'>> = {
            'offline_access': {
                title: 'Maintain access when you are away',
                description: 'Allows refresh-token based access until you revoke this connection.',
            },
            'history:read': {
                title: 'View daily history',
                description: 'Access to last 12 months of activity data across linked accounts.',
            },
            'ledger:read': {
                title: 'View daily history',
                description: 'Access to last 12 months of ledger data across linked accounts.',
            },
            'schools:read': {
                title: 'View school registry data',
                description: 'Read institution records available to your RTB account.',
            },
            'students:read': {
                title: 'View student records',
                description: 'Read student records available to your RTB account.',
            },
            'teachers:read': {
                title: 'View teacher records',
                description: 'Read teacher records available to your RTB account.',
            },
        };

        for (const scope of uniqueScopes) {
            if (['openid', 'profile', 'email'].includes(scope))
                continue;

            const mapped = scopeCopy[scope] ?? {
                title: titleCaseScope(scope),
                description: 'Access this permission according to your RTB account privileges.',
            };

            permissionsList.push({ key: scope, ...mapped });
        }

        return permissionsList.length > 0
            ? permissionsList
            : [{
                key: 'standard-access',
                title: 'Use standard account access',
                description: 'Continue with the permissions requested by the connected application.',
            }];
    }
</script>

{#if auth.isLoading}
    <div class='flex min-h-screen items-center justify-center bg-white'>
        <LoaderCircle class='h-8 w-8 animate-spin text-primary' />
    </div>
{:else if auth.isAuthenticated}
    <div class='flex min-h-screen flex-col overflow-hidden lg:flex-row'>
        <aside class='flex min-h-[48vh] w-full flex-col bg-[#EDF1F5] lg:min-h-screen lg:w-[45%] xl:w-[45.5%]'>
            <div class='flex flex-1 flex-col px-8 pt-10 sm:px-12 lg:px-16 lg:pt-14 xl:px-20'>
                <div class='mb-16 flex items-center gap-3'>
                    <div class='h-px w-10 bg-[#0D28774D]'></div>
                    <span class='font-inter text-sm font-medium tracking-[0.35px] text-[#0D287799]'>GATEWAY ACCESS</span>
                </div>

                <h1 class='font-manrope mb-12 max-w-140 text-[40px] font-extrabold leading-[1.18] tracking-[-1.2px] text-[#0D2877] sm:text-[54px] lg:text-[56px] xl:text-[60px]'>
                    RTB — Unified Data<br />Platform .
                </h1>

                <p class='font-inter max-w-140 text-xl leading-8 text-[#0D2877CC]'>
                    Securely connect and streamline information from different
                    services in one place
                </p>

                <div class='flex flex-1 items-center justify-center py-8 lg:items-end'>
                    <img
                        src='/signin-image.png'
                        alt='Data platform illustration'
                        class='h-auto w-full max-w-155 object-contain'
                    />
                </div>
            </div>

            <div class='px-8 pb-10 sm:px-12 lg:px-16 xl:px-20'>
                <p class='font-inter text-base text-[#0D287780]'>
                    © 2026 RTB Systems. All rights reserved.
                </p>
            </div>
        </aside>

        <main class='flex min-h-screen flex-1 flex-col bg-white'>
            <header class='flex items-center px-8 pt-9 sm:px-12 lg:px-16 xl:px-20'>
                <img
                    src='/rtb-logo.png'
                    alt='RTB Rwanda'
                    class='h-12 w-13 object-contain'
                />
                <span class='font-inter -ml-0.5 mt-2 text-2xl font-bold leading-6 text-[#205FAD]'>RTB Rwanda</span>
            </header>

            <section class='flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-14'>
                <div class='w-full max-w-[688px] rounded-lg border border-[#DEE1E6] bg-white px-8 py-12 shadow-[0_1px_4px_rgba(23,26,31,0.12)] sm:px-10 lg:px-12'>
                    {#if isLoadingFlow}
                        <div class='flex min-h-[420px] flex-col items-center justify-center gap-4 text-center'>
                            <LoaderCircle class='h-8 w-8 animate-spin text-[#205FAD]' />
                            <p class='font-inter text-sm text-[#565D6D]'>Loading consent request…</p>
                        </div>
                    {:else if errorMessage && !flow}
                        <div class='flex min-h-[420px] flex-col items-center justify-center gap-4 text-center'>
                            <div class='flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600'>
                                <Info class='h-6 w-6' />
                            </div>
                            <div>
                                <h2 class='font-manrope text-xl font-semibold text-[#171A1F]'>Unable to continue</h2>
                                <p class='font-inter mt-2 max-w-110 text-sm leading-6 text-[#565D6D]'>{errorMessage}</p>
                            </div>
                        </div>
                    {:else}
                        <div class='mb-10 text-center'>
                            <div class='mb-7 flex items-center justify-center gap-5'>
                                <div class='flex h-20 w-20 items-center justify-center rounded-md border border-[#DEE1E6] bg-white shadow-sm'>
                                    <User class='h-10 w-10 text-[#565D6D]' strokeWidth={1.8} />
                                </div>
                                <div class='flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F6FF] text-[#205FAD]'>
                                    <ArrowLeftRight class='h-5 w-5' />
                                </div>
                                <div class='flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border border-[#D5E9DD] bg-[#F1FAF4] shadow-sm'>
                                    <img src={clientLogoSrc} alt='{clientName} logo' class='max-h-12 max-w-15 object-contain' />
                                </div>
                            </div>

                            <h2 class='font-manrope mb-2 text-2xl font-semibold tracking-[-0.4px] text-[#171A1F]'>
                                Connect {clientName} to RTB
                            </h2>
                            <p class='font-inter mx-auto max-w-115 text-base leading-6 text-[#565D6D]'>
                                RTB wants to access your {clientName} account to provide full
                                experience integration services.
                            </p>
                        </div>

                        <div class='mb-7 rounded-lg border border-[#D8DDE6] bg-white px-7 py-7'>
                            <div class='mb-8 flex items-center gap-3'>
                                <span class='font-inter flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF2FC] text-sm font-semibold text-[#205FAD]'>1</span>
                                <h3 class='font-inter text-lg font-semibold text-[#171A1F]'>Confirm your identity</h3>
                            </div>

                            <label for='consent-name' class='font-inter mb-3 block text-base font-medium text-[#171A1F]'>Names</label>
                            <div class='flex h-12 items-center gap-2 rounded-md border border-[#D8DDE6] bg-white px-4 text-[#171A1F]'>
                                <IdCard class='h-5 w-5 shrink-0 text-[#565D6D]' />
                                <input
                                    id='consent-name'
                                    value={auth.user?.name ?? ''}
                                    readonly
                                    class='font-inter h-full w-full bg-transparent text-base outline-none'
                                />
                            </div>
                        </div>

                        <div class='mb-7'>
                            <div class='mb-5 flex items-center justify-between gap-4'>
                                <div class='flex items-center gap-3'>
                                    <span class='font-inter flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF2FC] text-sm font-semibold text-[#205FAD]'>2</span>
                                    <h3 class='font-inter text-lg font-semibold text-[#171A1F]'>Review requested permissions</h3>
                                </div>
                                <span class='font-inter rounded-full border border-[#D8DDE6] px-4 py-1 text-sm font-semibold tracking-[1.4px] text-[#565D6D]'>STANDARD ACCESS</span>
                            </div>

                            <div class='space-y-5'>
                                {#each permissions as permission (permission.key)}
                                    <div class='flex items-start gap-4'>
                                        <Check class='mt-1 h-5 w-5 shrink-0 text-[#205FAD]' strokeWidth={2} />
                                        <div>
                                            <p class='font-inter text-base font-medium leading-6 text-[#171A1F]'>{permission.title}</p>
                                            <p class='font-inter text-sm leading-6 text-[#565D6D]'>{permission.description}</p>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <div class='font-inter mb-10 flex items-start gap-3 rounded-md bg-[#F0F6FF] px-4 py-4 text-sm leading-5 text-[#171A1F]'>
                            <Info class='mt-0.5 h-5 w-5 shrink-0 text-[#205FAD]' />
                            <p>You can revoke these permissions at any time from your RTB security settings dashboard.</p>
                        </div>

                        {#if errorMessage}
                            <div class='font-inter mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                                {errorMessage}
                            </div>
                        {/if}

                        <div class='mb-8 flex justify-end gap-4'>
                            <Button
                                type='button'
                                variant='outline'
                                onclick={handleDeny}
                                disabled={submittingAction !== null}
                                class='font-inter h-13 min-w-22 rounded-md border-[#D8DDE6] bg-white px-5 text-base font-medium text-[#171A1F] shadow-sm hover:bg-gray-50'
                            >
                                {#if submittingAction === 'deny'}
                                    <LoaderCircle class='mr-2 h-4 w-4 animate-spin' />
                                {/if}
                                Deny
                            </Button>
                            <Button
                                type='button'
                                onclick={handleAllow}
                                disabled={submittingAction !== null}
                                class='font-inter h-13 min-w-37 rounded-md bg-[#205FAD] px-5 text-base font-medium text-white shadow-sm hover:bg-[#1D559B] disabled:opacity-70'
                            >
                                {#if submittingAction === 'approve'}
                                    <LoaderCircle class='mr-2 h-4 w-4 animate-spin' />
                                    Allowing…
                                {:else}
                                    Allow Access
                                {/if}
                            </Button>
                        </div>

                        <div class='border-t border-[#D8DDE6] pt-8 text-center'>
                            <p class='font-inter mb-3 text-sm leading-6 text-[#565D6D]'>
                                By clicking "Allow Access", you agree to {clientName}'s request.
                            </p>
                            <div class='font-inter flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[#565D6D]'>
                                <a href={resolve('/privacy' as any)} class='hover:text-[#205FAD] hover:underline'>Privacy Policy</a>
                                <span class='text-[#D8DDE6]'>•</span>
                                <a href={resolve('/terms' as any)} class='hover:text-[#205FAD] hover:underline'>Terms of Service</a>
                                <span class='text-[#D8DDE6]'>•</span>
                                <a href={resolve('/security' as any)} class='inline-flex items-center gap-1.5 hover:text-[#205FAD] hover:underline'>
                                    <LockKeyhole class='h-4 w-4' />
                                    Security Details
                                </a>
                            </div>
                        </div>
                    {/if}
                </div>
            </section>
        </main>
    </div>
{/if}
