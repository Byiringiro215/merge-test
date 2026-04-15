<script lang='ts'>
    import type { Group, User } from '$lib/datamodel/admin';
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
    import { userListResponseSchema, userSchema } from '$lib/types/zod-schemas-api';
    import { LoaderCircle, Plus, Search, Trash2 } from '@lucide/svelte';
    import { z } from 'zod/v4';

    interface Props {
        open: boolean;
        group: Group | null;
        onOpenChange: (open: boolean) => void;
    }

    const { open, group, onOpenChange }: Props = $props();

    let members = $state<User[]>([]);
    let allUsers = $state<User[]>([]);
    let searchQuery = $state('');
    let isLoadingMembers = $state(false);
    let isLoadingUsers = $state(false);
    let isActing = $state(false);
    let showAddPanel = $state(false);

    const nonMemberUsers = $derived(() => {
        const memberIds = new Set(members.map(m => m.id));
        const filtered = allUsers.filter(u => !memberIds.has(u.id));
        if (!searchQuery)
            return filtered;
        return filtered.filter(
            u =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase())
                    || u.email.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    });

    async function loadMembers() {
        if (!group)
            return;
        isLoadingMembers = true;
        try {
            const result = await api.get('/iam/groups/{id}/users', {
                params: { id: group.id },
                responseSchema: z.array(userSchema),
            }).result();
            if (result.ok) {
                members = result.data;
            }
        }
        finally {
            isLoadingMembers = false;
        }
    }

    async function loadAllUsers() {
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

    async function addMember(userId: number) {
        if (!group)
            return;
        isActing = true;
        try {
            await api.post('/iam/groups/{id}/users', {
                params: { id: group.id },
                body: { userId },
            }).result();
            await loadMembers();
        }
        finally {
            isActing = false;
        }
    }

    async function removeMember(userId: number) {
        if (!group)
            return;
        isActing = true;
        try {
            await api.delete('/iam/groups/{id}/users/{userId}', {
                params: { id: group.id, userId },
            }).result();
            await loadMembers();
        }
        finally {
            isActing = false;
        }
    }

    $effect(() => {
        if (open && group) {
            showAddPanel = false;
            searchQuery = '';
            loadMembers();
        }
    });
</script>

<Dialog.Root {open} onOpenChange={v => onOpenChange(v)}>
    <Dialog.Content class='sm:max-w-lg max-h-[80vh] flex flex-col'>
        <Dialog.Header>
            <Dialog.Title>Members: {group?.name ?? ''}</Dialog.Title>
            <Dialog.Description>Manage group membership.</Dialog.Description>
        </Dialog.Header>

        <div class='flex flex-col gap-4 overflow-y-auto'>
            {#if !showAddPanel}
                <div class='flex items-center justify-between'>
                    <h3 class='text-sm font-medium text-gray-700'>
                        Current Members ({members.length})
                    </h3>
                    <Button
                        size='sm'
                        onclick={() => {
                            showAddPanel = true;
                            loadAllUsers();
                        }}
                    >
                        <Plus class='mr-1 h-3 w-3' />
                        Add Member
                    </Button>
                </div>

                {#if isLoadingMembers}
                    <div class='flex items-center justify-center py-8'>
                        <LoaderCircle
                            class='h-6 w-6 animate-spin text-primary'
                        />
                    </div>
                {:else if members.length === 0}
                    <p class='py-8 text-center text-sm text-muted-foreground'>
                        No members in this group.
                    </p>
                {:else}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead class='text-right'>Remove</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {#each members as member (member.id)}
                                <TableRow>
                                    <TableCell class='font-medium'>
                                        {member.name}
                                    </TableCell>
                                    <TableCell class='text-sm'
                                    >{member.email}</TableCell
                                    >
                                    <TableCell class='text-right'>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            class='text-destructive hover:text-destructive'
                                            disabled={isActing}
                                            onclick={() =>
                                                removeMember(member.id)}
                                        >
                                            <Trash2 class='h-4 w-4' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            {/each}
                        </TableBody>
                    </Table>
                {/if}
            {:else}
                <div class='flex items-center justify-between'>
                    <h3 class='text-sm font-medium text-gray-700'>
                        Add Member
                    </h3>
                    <Button
                        size='sm'
                        variant='outline'
                        onclick={() => (showAddPanel = false)}
                    >
                        Back to members
                    </Button>
                </div>

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
                        <LoaderCircle
                            class='h-6 w-6 animate-spin text-primary'
                        />
                    </div>
                {:else}
                    {@const available = nonMemberUsers()}
                    {#if available.length === 0}
                        <p
                            class='py-8 text-center text-sm text-muted-foreground'
                        >
                            No available users to add.
                        </p>
                    {:else}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead class='text-right'>Add</TableHead
                                    >
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {#each available as user (user.id)}
                                    <TableRow>
                                        <TableCell class='font-medium'>
                                            {user.name}
                                        </TableCell>
                                        <TableCell class='text-sm'>
                                            {user.email}
                                        </TableCell>
                                        <TableCell class='text-right'>
                                            <Button
                                                size='sm'
                                                variant='outline'
                                                disabled={isActing}
                                                onclick={() =>
                                                    addMember(user.id)}
                                            >
                                                <Plus class='mr-1 h-3 w-3' />
                                                Add
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                {/each}
                            </TableBody>
                        </Table>
                    {/if}
                {/if}
            {/if}
        </div>
    </Dialog.Content>
</Dialog.Root>
