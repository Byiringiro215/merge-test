<script lang='ts'>
    import type { Session } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { api } from '$lib/api';
    import { ConfirmDialog } from '$lib/components/admin';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import AppLayout from '$lib/components/layout/AppLayout.svelte';
    import { Badge } from '$lib/components/ui/badge';
    import { Button } from '$lib/components/ui/button';
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from '$lib/components/ui/card';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import { sessionListResponseSchema } from '$lib/types/api-schemas';
    import { LoaderCircle, ShieldOff, Trash2 } from '@lucide/svelte';
    import { createRawSnippet, onMount } from 'svelte';

    let sessions = $state<Session[]>([]);
    let isLoading = $state(false);

    // Revoke single dialog
    let revokeDialogOpen = $state(false);
    let revokingSession = $state<Session | null>(null);
    let isRevoking = $state(false);

    // Revoke all dialog
    let revokeAllDialogOpen = $state(false);
    let isRevokingAll = $state(false);

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

    const fetchSessions = async () => {
        isLoading = true;
        try {
            const result = await api.get('/auth/sessions', {
                responseSchema: sessionListResponseSchema,
            }).result();
            if (result.ok) {
                sessions = result.data;
            }
        }
        finally {
            isLoading = false;
        }
    };

    const openRevokeDialog = (session: Session) => {
        revokingSession = session;
        revokeDialogOpen = true;
    };

    const handleRevoke = async () => {
        if (!revokingSession)
            return;
        isRevoking = true;
        try {
            await api.delete('/auth/sessions/{id}', {
                params: { id: revokingSession.id },
            }).result();
            revokeDialogOpen = false;
            revokingSession = null;
            await fetchSessions();
        }
        finally {
            isRevoking = false;
        }
    };

    const handleRevokeAll = async () => {
        isRevokingAll = true;
        try {
            await api.delete('/auth/sessions', {
                body: { currentTokenId: sessions[0]?.id },
            }).result();
            revokeAllDialogOpen = false;
            await fetchSessions();
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

    onMount(() => {
        fetchSessions();
    });
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

<AppLayout containerClass='lg:pl-10 px-6'>
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
                onclick={() => (revokeAllDialogOpen = true)}
            >
                <ShieldOff class='mr-2 h-4 w-4' />
                Revoke All Other Sessions
            </Button>
        {/if}
    </div>

    <Card class='py-10'>
        <CardHeader>
            <CardTitle>Active Sessions ({sessions.length})</CardTitle>
            <CardDescription>
                Sessions currently active for your account.
            </CardDescription>
        </CardHeader>
        <CardContent class='py-5'>
            {#if isLoading}
                <div class='flex items-center justify-center py-12'>
                    <LoaderCircle class='h-8 w-8 animate-spin text-primary' />
                </div>
            {:else}
                <DataTable {columns} data={sessions} />
            {/if}
        </CardContent>
    </Card>
</AppLayout>

<ConfirmDialog
    open={revokeDialogOpen}
    title='Revoke Session'
    message='This will terminate the selected session. The user will need to log in again on that device.'
    confirmLabel='Revoke'
    isLoading={isRevoking}
    onOpenChange={v => (revokeDialogOpen = v)}
    onConfirm={handleRevoke}
/>

<ConfirmDialog
    open={revokeAllDialogOpen}
    title='Revoke All Other Sessions'
    message='This will terminate all sessions except your current one. Other logged-in devices will need to log in again.'
    confirmLabel='Revoke All'
    isLoading={isRevokingAll}
    onOpenChange={v => (revokeAllDialogOpen = v)}
    onConfirm={handleRevokeAll}
/>
