<script lang='ts'>
    import type { Group, Role, User } from '$lib/datamodel/admin';
    import FormField from '$lib/components/form-field/form-field.svelte';
    import { Button } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import { LoaderCircle } from '@lucide/svelte';
    import {
        bindRoleToGroup,
        bindRoleToUser,
        searchGroups,
        searchUsers,
        unbindRole,
    } from '../../../../routes/(app)/admin/roles/role.remote';

    interface Props {
        open: boolean;
        role: Role | null;
        onOpenChange: (open: boolean) => void;
    }

    const { open, role, onOpenChange }: Props = $props();

    let userSubjectId = $state('');
    let groupSubjectId = $state('');

    let userSearchTerm = $state('');
    let groupFilterTerm = $state('');

    const usersQuery = $derived(
        searchUsers({ search: userSearchTerm, limit: 10 }),
    );
    const userOptions = $derived(
        (usersQuery.current?.users ?? []).map((u: User) => ({
            label: `${u.name} (${u.email})`,
            value: u.id,
        })),
    );

    const groupsQuery = $derived(searchGroups({ limit: 50 }));
    const groupOptions = $derived(
        (groupsQuery.current?.groups ?? [])
            .filter((g: Group) =>
                groupFilterTerm
                    ? g.name
                        .toLowerCase()
                        .includes(groupFilterTerm.toLowerCase())
                    : true,
            )
            .map((g: Group) => ({ label: g.name, value: g.id })),
    );

    let isUserAssigning = $state(false);
    let userError = $state('');
    let userSuccess = $state('');

    let isGroupAssigning = $state(false);
    let groupError = $state('');
    let groupSuccess = $state('');

    let userSearchDebounce: ReturnType<typeof setTimeout> | undefined;
    let groupFilterDebounce: ReturnType<typeof setTimeout> | undefined;

    function debouncedUserSearch(term: string) {
        clearTimeout(userSearchDebounce);
        userSearchDebounce = setTimeout(() => {
            userSearchTerm = term;
        }, 300);
    }

    function debouncedGroupSearch(term: string) {
        clearTimeout(groupFilterDebounce);
        groupFilterDebounce = setTimeout(() => {
            groupFilterTerm = term;
        }, 300);
    }
    // reset state
    $effect(() => {
        if (!open) {
            userSubjectId = '';
            groupSubjectId = '';
            userSearchTerm = '';
            groupFilterTerm = '';
            userError = '';
            userSuccess = '';
            groupError = '';
            groupSuccess = '';
        }
    });
    // Assign and Unassign user to a role
    const handleUserAssignRoleAction = async (action: 'assign' | 'unassign') => {
        if (!role)
            return;

        const userId = Number(userSubjectId);
        if (!userId) {
            userError = 'Please select a user first';
            userSuccess = '';
            return;
        }

        userError = '';
        userSuccess = '';
        isUserAssigning = true;
        try {
            if (action === 'assign') {
                await bindRoleToUser({ id: role.id, userId });
                userSuccess = 'User assigned to role.';
            }
            else {
                await unbindRole({
                    id: role.id,
                    subjectType: 'USER',
                    subjectId: userId,
                });
                userSuccess = 'User unassigned from role.';
            }
        }
        catch (err) {
            userError
                = err instanceof Error
                    ? err.message
                    : `Failed to ${action} user`;
        }
        finally {
            isUserAssigning = false;
        }
    };
    // Add and romove a  Role to a group
    const handleRoleGroupAssignAction = async (action: 'assign' | 'unassign') => {
        if (!role) {
            return;
        }

        const groupId = Number(groupSubjectId);
        if (!groupId) {
            groupError = 'Please select a group first';
            groupSuccess = '';
            return;
        }

        groupError = '';
        groupSuccess = '';
        isGroupAssigning = true;
        try {
            if (action === 'assign') {
                await bindRoleToGroup({ id: role.id, groupId });
                groupSuccess = 'Group assigned to role.';
            }
            else {
                await unbindRole({
                    id: role.id,
                    subjectType: 'GROUP',
                    subjectId: groupId,
                });
                groupSuccess = 'Group unassigned from role.';
            }
        }
        catch (err) {
            groupError
                = err instanceof Error
                    ? err.message
                    : `Failed to ${action} group`;
        }
        finally {
            isGroupAssigning = false;
        }
    };
</script>

<Dialog.Root {open} onOpenChange={(v: boolean) => onOpenChange(v)}>
    <Dialog.Content
        class='sm:max-w-2xl max-h-[85vh] flex flex-col overflow-y-auto'
    >
        <Dialog.Header>
            <Dialog.Title>Role Assignments: {role?.name ?? ''}</Dialog.Title>
            <Dialog.Description>
                Assign or unassign this role for users and groups.
            </Dialog.Description>
        </Dialog.Header>

        <div class='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <!-- User binding section -->
            <section
                class='flex flex-col gap-3 rounded-lg border border-gray-200 p-4'
            >
                <h3 class='text-sm font-semibold text-gray-900'>Users</h3>

                {#if userError}
                    <div
                        class='rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700'
                    >
                        {userError}
                    </div>
                {/if}
                {#if userSuccess}
                    <div
                        class='rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700'
                    >
                        {userSuccess}
                    </div>
                {/if}

                <FormField
                    name='userSubjectId'
                    label='Select user'
                    searchSelectInput={true}
                    options={userOptions}
                    value={userSubjectId}
                    onSelect={option => (userSubjectId = String(option.value))}
                    onSearch={debouncedUserSearch}
                    placeholder='Search users by email...'
                    disabled={isUserAssigning}
                />

                <div class='flex items-center gap-2'>
                    <Button
                        size='sm'
                        class='flex-1'
                        disabled={isUserAssigning}
                        onclick={() => handleUserAssignRoleAction('assign')}
                    >
                        {#if isUserAssigning}
                            <LoaderCircle class='mr-2 h-4 w-4 animate-spin' />
                        {/if}
                        Assign
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        class='flex-1'
                        disabled={isUserAssigning}
                        onclick={() => handleUserAssignRoleAction('unassign')}
                    >
                        Unassign
                    </Button>
                </div>
            </section>

            <!-- Group Assign section -->
            <section
                class='flex flex-col gap-3 rounded-lg border border-gray-200 p-4'
            >
                <h3 class='text-sm font-semibold text-gray-900'>Groups</h3>

                {#if groupError}
                    <div
                        class='rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700'
                    >
                        {groupError}
                    </div>
                {/if}
                {#if groupSuccess}
                    <div
                        class='rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700'
                    >
                        {groupSuccess}
                    </div>
                {/if}

                <FormField
                    name='groupSubjectId'
                    label='Select group'
                    searchSelectInput={true}
                    options={groupOptions}
                    value={groupSubjectId}
                    onSelect={option => (groupSubjectId = String(option.value))}
                    onSearch={debouncedGroupSearch}
                    placeholder='Search groups by name...'
                    disabled={isGroupAssigning}
                />

                <div class='flex items-center gap-2'>
                    <Button
                        size='sm'
                        class='flex-1'
                        disabled={isGroupAssigning}
                        onclick={() => handleRoleGroupAssignAction('assign')}
                    >
                        {#if isGroupAssigning}
                            <LoaderCircle class='mr-2 h-4 w-4 animate-spin' />
                        {/if}
                        Assign
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        class='flex-1'
                        disabled={isGroupAssigning}
                        onclick={() => handleRoleGroupAssignAction('unassign')}
                    >
                        Unassign
                    </Button>
                </div>
            </section>
        </div>
    </Dialog.Content>
</Dialog.Root>
