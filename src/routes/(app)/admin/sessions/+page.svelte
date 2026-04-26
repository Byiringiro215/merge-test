<script lang='ts'>
    import type { Session } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { ConfirmDialog } from '$lib/components/admin';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
    import { Badge } from '$lib/components/ui/badge';
    import { Button } from '$lib/components/ui/button';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import { ShieldOff, Trash2 } from '@lucide/svelte';
    import { createRawSnippet } from 'svelte';
    import {
        fetchAllSessions,
        revokeAllOtherSessions,
        revokeSession,
    } from './session.remote';

    const sessionsQuery = $derived(fetchAllSessions());
    const sessions = $derived(sessionsQuery.current ?? []);

    // loading state
    let isInitialLoad = $state(true);
    $effect(() => {
        if (!sessionsQuery.loading) {
            isInitialLoad = false;
        }
    });

    const showLoading = $derived(!isInitialLoad && sessionsQuery.loading);

    // Revoke single dialog
    let revokeDialogOpen = $state(false);
    let revokingSession = $state<Session | null>(null);
    let isRevoking = $state(false);
    let revokeError = $state('');

    // Revoke all dialog
    let revokeAllDialogOpen = $state(false);
    let isRevokingAll = $state(false);
    let revokeAllError = $state('');

    const parseUserAgent = (ua: string | null | undefined): string => {
        if (!ua)
            return 'Unknown';
        if (ua.includes('Chrome'))
            return 'Chrome';
        if (ua.includes('Firefox'))
            return 'Firefox';
        if (ua.includes('Safari'))
            return 'Safari';
        if (ua.includes('Edge'))
            return 'Edge';
        return ua.length > 40 ? `${ua.slice(0, 40)}...` : ua;
    };

    const refetchSessions = async () => {
        await sessionsQuery.refresh();
    };

    const openRevokeDialog = (session: Session) => {
        revokingSession = session;
        revokeError = '';
        revokeDialogOpen = true;
    };

    const handleRevoke = async () => {
        if (!revokingSession)
            return;
        isRevoking = true;
        revokeError = '';
        try {
            await revokeSession({ id: revokingSession.id });
            await refetchSessions();
            revokeDialogOpen = false;
            revokingSession = null;
        }
        catch (err) {
            revokeError
                = err instanceof Error ? err.message : 'Failed to revoke session';
        }
        finally {
            isRevoking = false;
        }
    };

    const handleRevokeAll = async () => {
        const currentTokenId = sessions[0]?.id;
        if (currentTokenId === undefined)
            return;
        isRevokingAll = true;
        revokeAllError = '';
        try {
            await revokeAllOtherSessions({ currentTokenId });
            await refetchSessions();
            revokeAllDialogOpen = false;
        }
        catch (err) {
            revokeAllError
                = err instanceof Error ? err.message : 'Failed to revoke sessions';
        }
        finally {
            isRevokingAll = false;
        }
    };

    const columns: ColumnDef<Session>[] = [
        {
            accessorKey: 'ipAddress',
            header: 'IP Address',
            cell: ({ row }) => {
                const ip = row.original.ipAddress ?? '—';
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="font-mono text-sm">${ip}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'userAgent',
            header: 'Browser',
            cell: ({ row }) => {
                const browser = parseUserAgent(row.original.userAgent);
                const snippet = createRawSnippet(() => ({
                    render: () => `<span class="text-sm">${browser}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'deviceName',
            header: 'Device',
            cell: ({ row }) => {
                const device = row.original.deviceName ?? '—';
                const snippet = createRawSnippet(() => ({
                    render: () => `<span class="text-sm">${device}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Created',
            cell: ({ row }) => {
                const date = new Date(row.original.createdAt).toLocaleString();
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-muted-foreground">${date}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'lastActiveAt',
            header: 'Last Active',
            cell: ({ row }) => {
                const date = row.original.lastActiveAt
                    ? new Date(row.original.lastActiveAt).toLocaleString()
                    : '—';
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-muted-foreground">${date}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) =>
                renderSnippet(actionsCell, {
                    session: row.original,
                    index: row.index,
                }),
        },
    ];
</script>

{#snippet actionsCell({ session, index }: { session: Session; index: number })}
    <div class='text-right'>
        {#if index === 0}
            <Badge variant='secondary'>Current</Badge>
        {:else}
            <Button
                variant='ghost'
                size='icon'
                class='text-destructive hover:text-destructive cursor-pointer'
                onclick={() => openRevokeDialog(session)}
            >
                <Trash2 class='h-4 w-4' />
            </Button>
        {/if}
    </div>
{/snippet}

<LoadingBar visible={showLoading} />
<div class='sm:px-6 lg:px-10 pt-16   bg-[#FAFAFA] '>

    <div class='border px-5 py-6 lg:py-8 lg:px-7'>
        <div
            class='mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'
        >
            <div>
                <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                    Sessions Management
                </h1>
                <p class='mt-1 text-sm text-gray-500'>
                    View and manage active sessions
                </p>
            </div>
            {#if sessions.length > 1}
                <Button
                    variant='destructive'
                    class='rounded'
                    onclick={() => (revokeAllDialogOpen = true)}
                >
                    <ShieldOff class='mr-2 h-4 w-4' />
                    Revoke All Other Sessions
                </Button>
            {/if}
        </div>

        <DataTable {columns} data={sessions} />
    </div>
</div>

<ConfirmDialog
    open={revokeDialogOpen}
    title='Revoke Session'
    message='This will terminate the selected session. The user will need to log in again on that device.'
    confirmLabel='Revoke'
    isLoading={isRevoking}
    error={revokeError}
    onOpenChange={v => (revokeDialogOpen = v)}
    onConfirm={handleRevoke}
/>

<ConfirmDialog
    open={revokeAllDialogOpen}
    title='Revoke All Other Sessions'
    message='This will terminate all sessions except your current one. Other logged-in devices will need to log in again.'
    confirmLabel='Revoke All'
    isLoading={isRevokingAll}
    error={revokeAllError}
    onOpenChange={v => (revokeAllDialogOpen = v)}
    onConfirm={handleRevokeAll}
/>
