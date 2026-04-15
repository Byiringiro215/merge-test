<script lang='ts'>
    import type { Role, User } from '$lib/datamodel/admin';
    import { api } from '$lib/api';
    import { Button } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import { Input } from '$lib/components/ui/input';
    import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
    } from '$lib/components/ui/table';
    import { userListResponseSchema } from '$lib/types/zod-schemas-api';
    import { LoaderCircle, Plus, Search } from '@lucide/svelte';

    interface Props {
        open: boolean;
        role: Role | null;
        onOpenChange: (open: boolean) => void;
    }

    const { open, role, onOpenChange }: Props = $props();

    let allUsers = $state<User[]>([]);
    let searchQuery = $state('');
    let isLoadingUsers = $state(false);
    let isBinding = $state(false);

    const filteredUsers = $derived(
        searchQuery
            ? allUsers.filter(
                u =>
                    u.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                        || u.email
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
            )
            : allUsers,
    );

    async function loadUsers() {
        isLoadingUsers = true;
        try {
            const result = await api.get('/auth/users', {
                responseSchema: userListResponseSchema,
            }).result();
            if (result.ok) {
                allUsers = result.data.users;
            }
        }
        finally {
            isLoadingUsers = false;
        }
    }

    async function bindUser(userId: number) {
        if (!role)
            return;
        isBinding = true;
        try {
            await api.post('/iam/roles/{id}/bind/user', {
                params: { id: role.id },
                body: { userId },
            }).result();
        }
        finally {
            isBinding = false;
        }
    }

    $effect(() => {
        if (open) {
            loadUsers();
        }
    });
</script>

<Dialog.Root {open} onOpenChange={v => onOpenChange(v)}>
    <Dialog.Content class='sm:max-w-lg max-h-[80vh] flex flex-col'>
        <Dialog.Header>
            <Dialog.Title>Role Bindings: {role?.name ?? ''}</Dialog.Title>
            <Dialog.Description>Assign this role to users.</Dialog.Description>
        </Dialog.Header>

        <div class='flex flex-col gap-4 overflow-y-auto'>
            <div class='relative'>
                <Search
                    class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                />
                <Input
                    type='text'
                    placeholder='Search users...'
                    bind:value={searchQuery}
                    class='pl-10'
                />
            </div>

            {#if isLoadingUsers}
                <div class='flex items-center justify-center py-8'>
                    <LoaderCircle class='h-6 w-6 animate-spin text-primary' />
                </div>
            {:else if filteredUsers.length === 0}
                <p class='py-8 text-center text-sm text-muted-foreground'>
                    No users found.
                </p>
            {:else}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead class='text-right'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {#each filteredUsers as user (user.id)}
                            <TableRow>
                                <TableCell class='font-medium'
                                >{user.name}</TableCell
                                >
                                <TableCell class='text-sm'
                                >{user.email}</TableCell
                                >
                                <TableCell class='text-right'>
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        disabled={isBinding}
                                        onclick={() => bindUser(user.id)}
                                    >
                                        <Plus class='mr-1 h-3 w-3' />
                                        Assign
                                    </Button>
                                </TableCell>
                            </TableRow>
                        {/each}
                    </TableBody>
                </Table>
            {/if}
        </div>
    </Dialog.Content>
</Dialog.Root>
