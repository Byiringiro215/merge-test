<script lang='ts'>
    import type { ApiKey, User } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { page } from '$app/state';
    import { ConfirmDialog } from '$lib/components/admin';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import FormField from '$lib/components/form-field/form-field.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
    import { Button } from '$lib/components/ui/button';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as Dialog from '$lib/components/ui/dialog';
    import {
        Check,
        Copy,
        LoaderCircle,
        Plus,
        ShieldAlert,
        Trash2,
    } from '@lucide/svelte';
    import { createRawSnippet } from 'svelte';
    import {
        fetchUserApiKeys,
        fetchUserById,
        mintUserApiKey,
        revokeUserApiKey,
    } from '../../../page.remote';

    const userId = $derived(Number(page.params.userId));

    const userQuery = $derived(fetchUserById(userId));
    const user = $derived<User | undefined>(userQuery.current);

    const apiKeysQuery = $derived(fetchUserApiKeys({ userId }));
    const apiKeys = $derived<ApiKey[]>(
        (apiKeysQuery.current?.keys ?? []) as ApiKey[],
    );

    let isInitialLoad = $state(true);
    $effect(() => {
        if (!apiKeysQuery.loading && !userQuery.loading) {
            isInitialLoad = false;
        }
    });
    const showLoading = $derived(
        !isInitialLoad && (apiKeysQuery.loading || userQuery.loading),
    );

    // Mint dialog state
    let mintDialogOpen = $state(false);
    let mintName = $state('');
    let mintExpiresAt = $state('');
    let isMinting = $state(false);
    let mintError = $state('');

    // One-time key reveal state
    let revealedKey = $state<string | null>(null);
    let revealedKeyLabel = $state('');
    let copied = $state(false);
    let copyTimeout: ReturnType<typeof setTimeout> | undefined;

    $effect(() => {
        if (!mintDialogOpen) {
            mintName = '';
            mintExpiresAt = '';
            mintError = '';
        }
    });

    async function handleMint() {
        mintError = '';
        if (!mintName.trim()) {
            mintError = 'Key label is required';
            return;
        }
        isMinting = true;
        try {
            const result = await mintUserApiKey({
                userId,
                name: mintName.trim(),
                ...(mintExpiresAt
                    ? { expiresAt: new Date(mintExpiresAt).toISOString() }
                    : {}),
            });
            mintDialogOpen = false;
            revealedKey = result.key;
            revealedKeyLabel = mintName.trim();
            copied = false;
            await apiKeysQuery.refresh();
        }
        catch (err) {
            mintError
                = err instanceof Error ? err.message : 'Failed to mint API key';
        }
        finally {
            isMinting = false;
        }
    }

    async function copyKey() {
        if (!revealedKey)
            return;
        try {
            await navigator.clipboard.writeText(revealedKey);
            copied = true;
            clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => (copied = false), 2000);
        }
        catch {
        // Clipboard write can be blocked by the browser; user can still
            // select-and-copy from the displayed input.
        }
    }

    function dismissRevealedKey() {
        revealedKey = null;
        revealedKeyLabel = '';
        copied = false;
    }

    // Revoke dialog state
    let revokeDialogOpen = $state(false);
    let revokingKey = $state<ApiKey | null>(null);
    let isRevoking = $state(false);
    let revokeError = $state('');

    const openRevokeDialog = (key: ApiKey) => {
        revokingKey = key;
        revokeError = '';
        revokeDialogOpen = true;
    };

    const handleRevoke = async () => {
        if (!revokingKey)
            return;
        isRevoking = true;
        revokeError = '';
        try {
            await revokeUserApiKey({ userId, id: revokingKey.id });
            await apiKeysQuery.refresh();
            revokeDialogOpen = false;
            revokingKey = null;
        }
        catch (err) {
            revokeError
                = err instanceof Error ? err.message : 'Failed to revoke API key';
        }
        finally {
            isRevoking = false;
        }
    };

    function formatDate(value: string | null | undefined): string {
        if (!value)
            return '—';
        const d = new Date(value);
        return d.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    const columns: ColumnDef<ApiKey>[] = [
        {
            accessorKey: 'name',
            header: 'Label',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm font-medium text-gray-900">${row.original.name}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'keyPrefix',
            header: 'Prefix',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="font-mono text-xs text-gray-700">${row.original.keyPrefix}…</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Created',
            cell: ({ row }) => {
                const date = formatDate(row.original.createdAt);
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-gray-500">${date}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'lastUsedAt',
            header: 'Last used',
            cell: ({ row }) => {
                const date = formatDate(row.original.lastUsedAt);
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-gray-500">${date}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'expiresAt',
            header: 'Expires',
            cell: ({ row }) => {
                const date = formatDate(row.original.expiresAt);
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-gray-500">${date}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) =>
                renderSnippet(actionsCell, { key: row.original }),
        },
    ];
</script>

{#snippet actionsCell({ key }: { key: ApiKey })}
    <div class='text-right'>
        <Button
            variant='ghost'
            size='icon'
            class='text-destructive hover:text-destructive cursor-pointer'
            title='Revoke API key'
            onclick={() => openRevokeDialog(key)}
        >
            <Trash2 class='h-4 w-4' />
        </Button>
    </div>
{/snippet}

<LoadingBar visible={showLoading} />
<div class='sm:px-6 lg:px-10 pt-16 bg-[#FAFAFA]'>
    <div class='border px-5 py-6 lg:py-8 lg:px-7'>
        <div class='mb-10'>
            <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                API keys: {user?.name ?? user?.email ?? '...'}
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Manage API keys belonging to this user. Raw keys are shown only
                once at creation and cannot be retrieved later.
            </p>
        </div>

        <div
            class='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5'
        >
            <h2 class='text-sm font-medium text-gray-700'>
                {apiKeys.length} active key{apiKeys.length === 1 ? '' : 's'}
            </h2>
            <Button class='gap-2 rounded' onclick={() => (mintDialogOpen = true)}>
                <Plus class='h-3 w-3' />
                Generate API key
            </Button>
        </div>

        <DataTable {columns} data={apiKeys} />
    </div>
</div>

<!-- Mint dialog -->
<Dialog.Root
    open={mintDialogOpen}
    onOpenChange={(v: boolean) => {
        if (!isMinting)
            mintDialogOpen = v;
    }}
>
    <Dialog.Content class='sm:max-w-md'>
        <Dialog.Header>
            <Dialog.Title>Mint API key</Dialog.Title>
            <Dialog.Description>
                The raw key will be shown exactly once. Store it immediately —
                it cannot be retrieved later.
            </Dialog.Description>
        </Dialog.Header>

        <form
            class='flex flex-col gap-4'
            onsubmit={(e) => {
                e.preventDefault();
                handleMint();
            }}
        >
            {#if mintError}
                <div
                    class='rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700'
                >
                    {mintError}
                </div>
            {/if}

            <FormField
                name='mintName'
                label='Key label'
                placeholder='e.g. mobile-client'
                value={mintName}
                onInput={v => (mintName = v)}
                disabled={isMinting}
            />

            <FormField
                name='mintExpiresAt'
                label='Expires at (optional)'
                type='datetime-local'
                value={mintExpiresAt}
                onInput={v => (mintExpiresAt = v)}
                disabled={isMinting}
            />

            <Dialog.Footer class='mt-2'>
                <Button
                    type='button'
                    variant='outline'
                    disabled={isMinting}
                    onclick={() => (mintDialogOpen = false)}
                >
                    Cancel
                </Button>
                <Button type='submit' disabled={isMinting}>
                    {#if isMinting}
                        <LoaderCircle class='mr-2 h-4 w-4 animate-spin' />
                    {/if}
                    Mint key
                </Button>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>

<!-- Reveal-once dialog -->
<Dialog.Root
    open={revealedKey !== null}
    onOpenChange={(v: boolean) => {
        if (!v)
            dismissRevealedKey();
    }}
>
    <Dialog.Content class='sm:max-w-lg'>
        <Dialog.Header>
            <Dialog.Title class='flex items-center gap-2'>
                <ShieldAlert class='h-5 w-5 text-yellow-600' />
                Save this API key now
            </Dialog.Title>
            <Dialog.Description>
                <span class='font-medium'>{revealedKeyLabel}</span> — this is
                the only time the raw key will be shown. Copy and store it in a
                secret manager before closing this dialog.
            </Dialog.Description>
        </Dialog.Header>

        <div class='flex items-center gap-2'>
            <input
                type='text'
                readonly
                value={revealedKey ?? ''}
                class='flex-1 rounded border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-900'
                onfocus={e => e.currentTarget.select()}
            />
            <Button
                type='button'
                variant='outline'
                size='icon'
                class='shrink-0'
                onclick={copyKey}
            >
                {#if copied}
                    <Check class='h-4 w-4 text-green-600' />
                {:else}
                    <Copy class='h-4 w-4' />
                {/if}
            </Button>
        </div>

        <Dialog.Footer class='mt-2'>
            <Button onclick={dismissRevealedKey}>I've stored the key</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

<ConfirmDialog
    open={revokeDialogOpen}
    title='Revoke API key'
    message='This permanently revokes the key. Any client using it will lose access immediately.'
    confirmLabel='Revoke'
    isLoading={isRevoking}
    error={revokeError}
    onOpenChange={v => (revokeDialogOpen = v)}
    onConfirm={handleRevoke}
/>
