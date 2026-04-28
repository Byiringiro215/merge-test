<script lang='ts'>
    import type { ServiceAccount } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { ConfirmDialog, StatusBadge } from '$lib/components/admin';
    import ServiceAccountFormDialog from '$lib/components/admin/ServiceAccountFormDialog.svelte';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
    import { Button } from '$lib/components/ui/button';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { Pagination } from '$lib/components/ui/pagination';
    import {
        Edit,
        MoreHorizontal,
        Plus,
        Trash2,
    } from '@lucide/svelte';
    import { createRawSnippet } from 'svelte';
    import {
        deleteServiceAccount,
        fetchAllServiceAccounts,
    } from './service-account.remote';

    const PAGE_SIZE = 10;

    const searchParams = $derived(page.url.searchParams);
    const currentPage = $derived(Math.max(1, Number(searchParams.get('page') ?? '1') || 1));

    const queryArgs = $derived({
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
    });

    const serviceAccountsQuery = $derived(fetchAllServiceAccounts(queryArgs));
    const serviceAccounts = $derived(
        serviceAccountsQuery.current?.serviceAccounts ?? [],
    );
    const totalServiceAccounts = $derived(serviceAccountsQuery.current?.total ?? 0);
    const totalPages = $derived(Math.max(1, Math.ceil(totalServiceAccounts / PAGE_SIZE)));

    let isInitialLoad = $state(true);
    $effect(() => {
        if (!serviceAccountsQuery.loading) {
            isInitialLoad = false;
        }
    });

    const showLoading = $derived(!isInitialLoad && serviceAccountsQuery.loading);

    let formDialogOpen = $state(false);
    let editingServiceAccount = $state<ServiceAccount | null>(null);

    let deleteDialogOpen = $state(false);
    let deletingServiceAccount = $state<ServiceAccount | null>(null);
    let isDeleting = $state(false);
    let deleteError = $state('');

    function updateSearchParamUrl(updates: Record<string, string | null>) {
        const url = new URL(page.url);
        for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === '') {
                url.searchParams.delete(key);
            }
            else {
                url.searchParams.set(key, value);
            }
        }
        goto(`${url.pathname}${url.search}`, {
            replaceState: true,
            keepFocus: true,
            noScroll: true,
        });
    }

    const handlePageChange = (next: number) => {
        updateSearchParamUrl({ page: next === 1 ? null : String(next) });
    };

    const refetchServiceAccounts = async () => {
        await serviceAccountsQuery.refresh();
    };

    const openServiceAccountDialog = (sa?: ServiceAccount) => {
        editingServiceAccount = sa ?? null;
        formDialogOpen = true;
    };

    const openDeleteDialog = (sa: ServiceAccount) => {
        deletingServiceAccount = sa;
        deleteError = '';
        deleteDialogOpen = true;
    };

    const handleDelete = async () => {
        if (!deletingServiceAccount)
            return;
        isDeleting = true;
        deleteError = '';
        try {
            await deleteServiceAccount({ id: deletingServiceAccount.id });
            await refetchServiceAccounts();
            deleteDialogOpen = false;
            deletingServiceAccount = null;
        }
        catch (err) {
            deleteError
                = err instanceof Error
                    ? err.message
                    : 'Failed to delete service account';
        }
        finally {
            isDeleting = false;
        }
    };

    function formatDate(dateStr: string | undefined): string {
        if (!dateStr)
            return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }
    // columns
    const columns: ColumnDef<ServiceAccount>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="font-mono text-sm font-medium text-gray-900">${row.original.name}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'displayName',
            header: 'Display Name',
            cell: ({ row }) => {
                const dn = row.original.displayName ?? '—';
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-gray-700">${dn}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => {
                const desc = row.original.description ?? '—';
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-muted-foreground line-clamp-1">${desc}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) =>
                renderSnippet(statusCell, { active: row.original.isActive }),
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
            id: 'actions',
            header: '',
            cell: ({ row }) =>
                renderSnippet(actionsCell, { sa: row.original }),
        },
    ];
</script>

{#snippet statusCell({ active }: { active: boolean })}
    <StatusBadge {active} />
{/snippet}

{#snippet actionsCell({ sa }: { sa: ServiceAccount })}
    <div class='text-right'>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Button
                        {...props}
                        variant='ghost'
                        size='icon'
                        class='cursor-pointer'
                    >
                        <MoreHorizontal class='h-4 w-4' />
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align='end'>
                <DropdownMenu.Item onclick={() => openServiceAccountDialog(sa)}>
                    <Edit class='mr-2 h-4 w-4' />
                    Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    class='text-destructive'
                    onclick={() => openDeleteDialog(sa)}
                >
                    <Trash2 class='mr-2 h-4 w-4' />
                    Delete
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
{/snippet}

<LoadingBar visible={showLoading} />
<div class='sm:px-6 lg:px-10 pt-16 bg-[#FAFAFA]'>
    <div class='border px-5 py-6 lg:py-8 lg:px-7'>
        <div class='mb-10'>
            <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                Service Accounts
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                non-human IAM principal. Service accounts hold roles and direct permissions just like users
            </p>
        </div>

        <div
            class='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end pb-5'
        >
            <Button
                class='gap-2 rounded'
                onclick={() => openServiceAccountDialog()}
            >
                <Plus class='h-3 w-3' />
                Create Service Account
            </Button>
        </div>

        <DataTable {columns} data={serviceAccounts} />

        <div class='py-4'>
            <Pagination
                {currentPage}
                {totalPages}
                totalItems={totalServiceAccounts}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
            />
        </div>
    </div>
</div>

<ServiceAccountFormDialog
    open={formDialogOpen}
    serviceAccount={editingServiceAccount}
    onOpenChange={v => (formDialogOpen = v)}
    onSuccess={refetchServiceAccounts}
/>

<ConfirmDialog
    open={deleteDialogOpen}
    title='Delete Service Account'
    message='This will permanently delete the service account and cascade-remove its role bindings, direct permissions, and API keys. This action cannot be undone.'
    isLoading={isDeleting}
    error={deleteError}
    onOpenChange={v => (deleteDialogOpen = v)}
    onConfirm={handleDelete}
/>
