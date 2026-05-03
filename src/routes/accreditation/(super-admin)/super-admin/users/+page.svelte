<script lang='ts'>
    import InviteUserModal from '$lib/accreditation/features/users/components/InviteUserModal.svelte';
    import { cn } from '$lib/accreditation/utils/cn';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import DataTable from '$lib/components/accreditation/ui/DataTable.svelte';
    import PrimaryButton from '$lib/components/accreditation/ui/PrimaryButton.svelte';
    import StatusBadge from '$lib/components/accreditation/ui/StatusBadge.svelte';
    import {
        CheckCheck,
        ClipboardClock,
        Pencil,
        Plus,
        Trash2,
        TriangleAlert,
        User,
        UserCheck,
        Users,
        UserX,
    } from '@lucide/svelte';

    interface UserRecord {
        id: string;
        name: string;
        email: string;
        avatar: string;
        role: string;
        status: any;
        dateAdded: string;
        lastActive: string;
    }

    const mockUsers: UserRecord[] = [
        {
            id: '1',
            name: 'Natali Craig',
            email: 'natali@gmail.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natali Craig',
            role: 'Curriculum evaluator',
            status: 'Active',
            dateAdded: 'Feb 22, 2022',
            lastActive: 'Mar 14, 2022',
        },
        {
            id: '2',
            name: 'Drew Cano',
            email: 'drew@untitledui.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Drew Cano',
            role: 'Supervisor',
            status: 'Pending',
            dateAdded: 'Feb 22, 2022',
            lastActive: 'Mar 12, 2022',
        },
        {
            id: '3',
            name: 'Orlando Diggs',
            email: 'orlando@gmail.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Orlando Diggs',
            role: 'Curriculum evaluator',
            status: 'Deactivated',
            dateAdded: 'Feb 22, 2022',
            lastActive: 'Mar 12, 2022',
        },
        {
            id: '4',
            name: 'Andi Lane',
            email: 'andi@gmail.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi Lane',
            role: 'Supervisor',
            status: 'Active',
            dateAdded: 'Feb 22, 2022',
            lastActive: 'Mar 14, 2022',
        },
        {
            id: '5',
            name: 'Kate Morrison',
            email: 'kate@gmail.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kate Morrison',
            role: 'Curriculum evaluator',
            status: 'Pending',
            dateAdded: 'Feb 22, 2022',
            lastActive: 'Mar 13, 2022',
        },
    ];

    let isInviteModalOpen = $state(false);
    let activeTab = $state<'curriculum-evaluator' | 'supervisor' | 'evaluator'>('curriculum-evaluator');

    function handleInvite(_data: any) {
    // Invite user
    }

    const filteredUsers = $derived(
        mockUsers.filter(user =>
            user.role.toLowerCase() === activeTab.replace('-', ' '),
        ),
    );

    const stats = $derived.by(() => {
        switch (activeTab) {
            case 'evaluator':
                return [
                    { label: 'Total Evaluators', value: '18', icon: Users, color: 'rgb(10, 119, 255)' },
                    { label: 'Active', value: '12', icon: User, color: 'rgb(52, 199, 89)' },
                    { label: 'Available', value: '4', icon: CheckCheck, color: 'rgb(203, 48, 224)' },
                    { label: 'Pending', value: '2', icon: ClipboardClock, color: 'rgb(97, 85, 245)' },
                    { label: 'Deactivated', value: '0', icon: TriangleAlert, color: 'rgb(255, 56, 60)' },
                ];
            case 'supervisor':
                return [
                    { label: 'Total Supervisors', value: '24', icon: Users, color: 'rgb(10, 119, 255)' },
                    { label: 'Active', value: '18', icon: User, color: 'rgb(52, 199, 89)' },
                    { label: 'Available', value: '4', icon: CheckCheck, color: 'rgb(203, 48, 224)' },
                    { label: 'Pending', value: '2', icon: ClipboardClock, color: 'rgb(97, 85, 245)' },
                    { label: 'Deactivated', value: '0', icon: TriangleAlert, color: 'rgb(255, 56, 60)' },
                ];
            default:
                return [
                    { label: 'Total Curriculum Evaluators', value: '48', icon: Users, color: 'rgb(10, 119, 255)' },
                    { label: 'Active', value: '32', icon: User, color: 'rgb(52, 199, 89)' },
                    { label: 'Available', value: '12', icon: CheckCheck, color: 'rgb(203, 48, 224)' },
                    { label: 'Pending', value: '4', icon: ClipboardClock, color: 'rgb(97, 85, 245)' },
                    { label: 'Deactivated', value: '2', icon: TriangleAlert, color: 'rgb(255, 56, 60)' },
                ];
        }
    });
</script>

{#snippet nameCell(user: UserRecord)}
    <div class='flex items-center gap-3'>
        <div class='flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100'>
            <img alt={user.name} class='h-full w-full object-cover' src={user.avatar} />
        </div>
        <div class='flex flex-col'>
            <span class='text-sm font-medium text-[#101828]'>{user.name}</span>
            <span class='text-xs text-[#475467]'>{user.email}</span>
        </div>
    </div>
{/snippet}

{#snippet statusCell(user: UserRecord)}
    <StatusBadge status={user.status} />
{/snippet}

{#snippet actionsCell(_user: UserRecord)}
    <div class='flex items-center justify-start gap-3'>
        {#if activeTab === 'curriculum-evaluator'}
            <button class='flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-50'>
                <UserCheck class='h-3.5 w-3.5' />
                Activate
            </button>
            <button class='flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50'>
                <UserX class='h-3.5 w-3.5' />
                Deactivate
            </button>
        {:else}
            <Trash2 class='h-4 w-4 cursor-pointer text-[#475467] transition-colors hover:text-red-500' />
            <Pencil class='h-4 w-4 cursor-pointer text-[#475467] transition-colors hover:text-[#7F56D9]' />
        {/if}
    </div>
{/snippet}

{#snippet inviteButton()}
    {#if activeTab !== 'supervisor'}
        <PrimaryButton
            label='Invite'
            icon={Plus}
            onclick={() => isInviteModalOpen = true}
        />
    {/if}
{/snippet}

<PageContainer
    role='super-admin'
    title='User Management'
    description='Manage roles and access for evaluators and supervisors.'
>
    <div class='space-y-6'>
        <!-- Custom Tabs -->
        <div class='no-scrollbar mb-8 flex w-full items-center justify-start gap-2 overflow-x-auto pb-2'>
            {#each ['curriculum-evaluator', 'evaluator', 'supervisor'] as tab}
                <button
                    onclick={() => activeTab = tab as any}
                    class={cn(
                        'relative group flex cursor-pointer items-center justify-center gap-2 rounded-sm px-6 py-3 transition-all duration-200 whitespace-nowrap',
                        activeTab === tab ? 'text-primary' : 'text-[#353E49] hover:bg-slate-50 hover:text-primary',
                    )}
                >
                    {#if activeTab === tab}
                        <div class='absolute inset-0 z-0 rounded-sm bg-[#F9FAFB]'></div>
                    {/if}
                    {#if tab === 'supervisor'}
                        <Users class={cn('relative z-10 h-4 w-4 transition-colors duration-200', activeTab === tab ? 'text-primary' : 'text-[#353E49] group-hover:text-primary')} strokeWidth={1.5} />
                    {:else}
                        <User class={cn('relative z-10 h-4 w-4 transition-colors duration-200', activeTab === tab ? 'text-primary' : 'text-[#353E49] group-hover:text-primary')} strokeWidth={1.5} />
                    {/if}
                    <span class='relative z-10 text-sm font-medium transition-colors duration-200'>
                        {tab === 'curriculum-evaluator' ? 'Curriculum Evaluator' : tab === 'evaluator' ? 'Evaluators' : 'Supervisors'}
                    </span>
                </button>
            {/each}
        </div>

        <!-- Stat Cards -->
        <div class='xl:grid-cols-5 relative z-10 mb-6 grid gap-4 bg-white shadow-[0_-20px_40px_white,0_20px_40px_white] md:grid-cols-2'>
            {#each stats as stat}
                <div class='animate-slide-up overflow-hidden rounded-md border border-slate-200 bg-white shadow-none'>
                    <div class='flex flex-col gap-4 p-5'>
                        <div class='w-fit rounded-sm border border-[#EAECF0] bg-white p-2.5 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]'>
                            <stat.icon class='h-5 w-5' style='color: {stat.color}' strokeWidth={1.5} />
                        </div>
                        <div class='space-y-1'>
                            <p class='text-sm font-medium text-slate-500'>{stat.label}</p>
                            <p class='text-2xl font-bold text-slate-900'>{stat.value}</p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- User Table -->
        <DataTable
            data={filteredUsers}
            columns={[
                { header: 'Name', accessor: nameCell },
                { header: 'Status', accessor: statusCell },
                { header: 'Date added', accessor: 'dateAdded', className: 'text-[#475467] text-sm' },
                { header: 'Last active', accessor: 'lastActive', className: 'text-[#475467] text-sm' },
                { header: 'Actions', accessor: actionsCell },
            ]}
            title={activeTab === 'curriculum-evaluator' ? 'All Curriculum Evaluators' : activeTab === 'evaluator' ? 'All Evaluators' : 'All Supervisors'}
            description={activeTab === 'curriculum-evaluator' ? 'Manage curriculum evaluators right here' : activeTab === 'evaluator' ? 'Manage evaluators right here' : 'Manage supervisors right here'}
            headerAction={inviteButton}
            showPagination
            currentPage={1}
            totalPages={10}
        />
    </div>

    <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => isInviteModalOpen = false}
        onInvite={handleInvite}
        variant='simple'
        defaultRole='Curriculum evaluator'
    />
</PageContainer>
