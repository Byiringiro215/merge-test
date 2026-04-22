<script lang='ts'>
    import type { Staff, StaffSpeciality } from '$lib/datamodel/staff';
    import type { ColumnDef } from '@tanstack/table-core';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import { api } from '$lib/api';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import { Button } from '$lib/components/ui/button';
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from '$lib/components/ui/card';
    import { staffDetailResponse } from '$lib/types/api-schemas';
    import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
    import BookOpenIcon from '@lucide/svelte/icons/book-open';
    import BriefcaseIcon from '@lucide/svelte/icons/briefcase';
    import MailIcon from '@lucide/svelte/icons/mail';
    import SchoolIcon from '@lucide/svelte/icons/school';
    import UserIcon from '@lucide/svelte/icons/user';
    import { onMount } from 'svelte';

    let staffMember = $state<Staff | null>(null);
    let isLoading = $state(true);
    let error = $state<string | null>(null);

    const staffNumber = $derived(page.params.staffNumber);

    const fetchStaff = async () => {
        if (!staffNumber)
            return;
        try {
            isLoading = true;
            error = null;
            const result = await api.get('/sdms/staff/{staffNumber}', {
                params: { staffNumber },
                responseSchema: staffDetailResponse,
            }).result();
            if (!result.ok) {
                error = 'Failed to fetch staff details';
                return;
            }
            staffMember = result.data.data;
        }
        catch (err) {
            console.error('Fetch error:', err);
            error = 'An error occurred while fetching staff details';
        }
        finally {
            isLoading = false;
        }
    };
    // staff specialities table
    const columns: ColumnDef<StaffSpeciality>[] = [
        {
            id: 'select',
            header: '#',
            cell: row => row.row.index + 1,
        },
        {
            id: 'subject',
            header: 'Subject',
            accessorKey: 'subject',
        },
        {
            id: 'combination',
            header: 'Combination',
            accessorKey: 'combination',
        },
        {
            id: 'subjectCode',
            header: 'SUbject Code',
            accessorKey: 'subjectCode',
        },
    ];

    onMount(() => {
        fetchStaff();
    });

    const formatDate = (dateString: string | null) => {
        if (!dateString)
            return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        }
        catch {
            return dateString;
        }
    };

    const getStatusColor = (status: string | null) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-700';
            case 'EMPLOYED':
                return 'bg-green-100 text-green-700';
            case 'INACTIVE':
                return 'bg-gray-100 text-gray-700';
            case 'TERMINATED':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-blue-100 text-blue-700';
        }
    };

    const getGenderColor = (gender: string | null) => {
        switch (gender?.toUpperCase()) {
            case 'MALE':
                return 'bg-sky-100 text-sky-700';
            case 'FEMALE':
                return 'bg-pink-100 text-pink-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };
</script>

<svelte:head>
    <title>{staffMember?.names ?? 'Staff Details'} | TDMP</title>
</svelte:head>

<div class='min-h-screen bg-[#f1f7fe] pb-20'>
    <div class='w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
        <!-- Back Button -->
        <Button
            variant='ghost'
            class='mb-4 gap-2 text-gray-600 hover:text-gray-900'
            onclick={() => goto(resolve('/teachers'))}
        >
            <ArrowLeftIcon class='h-4 w-4' />
            Back to Teachers
        </Button>

        {#if isLoading}
            <div class='flex items-center justify-center py-20'>
                <div
                    class='h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary'
                ></div>
            </div>
        {:else if error}
            <Card>
                <CardContent class='py-12'>
                    <div class='text-center'>
                        <p class='text-red-500 mb-4'>{error}</p>
                        <Button onclick={fetchStaff}>Try Again</Button>
                    </div>
                </CardContent>
            </Card>
        {:else if staffMember}
            <!-- Header Card -->
            <Card class='mb-6 overflow-hidden'>
                <div class=' px-6 py-8 sm:px-8'>
                    <div
                        class='flex flex-col sm:flex-row sm:items-center gap-4'
                    >
                        <div
                            class='h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-black flex items-center justify-center text-white text-2xl font-bold shrink-0'
                        >
                            {getInitials(staffMember.names)}
                        </div>
                        <div class='flex-1 min-w-0 ml-5'>
                            <h1
                                class='text-2xl sm:text-3xl font-bold text-black truncate'
                            >
                                {staffMember.names}
                            </h1>
                            <p class='text-gray-500 mt-1 font-mono'>
                                {staffMember.staffNumber}
                            </p>
                            <div class='flex flex-wrap gap-2 mt-3'>
                                {#if staffMember.position}
                                    <span
                                        class='inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-primary-black'
                                    >
                                        {staffMember.position}
                                    </span>
                                {/if}
                                <span
                                    class='inline-flex items-center rounded-full px-3 py-1 text-xs font-medium {getStatusColor(
                                        staffMember.employmentStatus,
                                    )}'
                                >
                                    {staffMember.employmentStatus ?? 'Unknown'}
                                </span>
                                <span
                                    class='inline-flex items-center rounded-full px-3 py-1 text-xs font-medium {getGenderColor(
                                        staffMember.gender,
                                    )}'
                                >
                                    {staffMember.gender ?? 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <!-- Info Cards Grid -->
            <div class='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <!-- School Information -->
                <Card class='p-4 sm:p-6'>
                    <CardHeader class='pb-3'>
                        <CardTitle class='flex items-center gap-2 text-lg'>
                            <SchoolIcon class='h-5 w-5 text-emerald-600' />
                            School Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent class='space-y-4'>
                        <div class='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <p
                                    class='text-xs text-gray-500 uppercase tracking-wide'
                                >
                                    School Name
                                </p>
                                <p class='font-medium text-gray-900 mt-1'>
                                    {staffMember.schoolName}
                                </p>
                            </div>
                            <div>
                                <p
                                    class='text-xs text-gray-500 uppercase tracking-wide'
                                >
                                    School Code
                                </p>
                                <p class='font-mono text-gray-900 mt-1'>
                                    {staffMember.schoolCode}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Employment Information -->
                <Card class='p-4 sm:p-6'>
                    <CardHeader class='pb-3'>
                        <CardTitle class='flex items-center gap-2 text-lg'>
                            <BriefcaseIcon class='h-5 w-5 text-emerald-600' />
                            Employment Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent class='space-y-4'>
                        <div class='grid grid-cols-2 gap-4'>
                            <div>
                                <p
                                    class='text-xs text-gray-500 uppercase tracking-wide'
                                >
                                    Position
                                </p>
                                <p class='font-medium text-gray-900 mt-1'>
                                    {staffMember.position ?? '-'}
                                </p>
                            </div>
                            <div>
                                <p
                                    class='text-xs text-gray-500 uppercase tracking-wide'
                                >
                                    Status
                                </p>
                                <p class='font-medium text-gray-900 mt-1'>
                                    {staffMember.employmentStatus ?? '-'}
                                </p>
                            </div>
                            <div>
                                <p
                                    class='text-xs text-gray-500 uppercase tracking-wide'
                                >
                                    Start Date
                                </p>
                                <p class='font-medium text-gray-900 mt-1'>
                                    {formatDate(
                                        staffMember.employmentStartDate,
                                    )}
                                </p>
                            </div>
                            <div>
                                <p
                                    class='text-xs text-gray-500 uppercase tracking-wide'
                                >
                                    End Date
                                </p>
                                <p class='font-medium text-gray-900 mt-1'>
                                    {formatDate(staffMember.employmentEndDate)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Contact Information -->
                <Card class='p-4 sm:p-6'>
                    <CardHeader class='pb-3'>
                        <CardTitle class='flex items-center gap-2 text-lg'>
                            <MailIcon class='h-5 w-5 text-emerald-600' />
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent class='space-y-4'>
                        <div class='grid grid-cols-1 gap-4'>
                            <div>
                                <p
                                    class='text-xs text-gray-500 uppercase tracking-wide'
                                >
                                    Email
                                </p>
                                <p class='font-medium text-gray-900 mt-1'>
                                    {#if staffMember.companyEmail}
                                        <a
                                            href='mailto:{staffMember.companyEmail}'
                                            class='text-emerald-600 hover:underline'
                                        >
                                            {staffMember.companyEmail}
                                        </a>
                                    {:else}
                                        -
                                    {/if}
                                </p>
                            </div>
                            <div>
                                <p
                                    class='text-xs text-gray-500 uppercase tracking-wide'
                                >
                                    Phone Number
                                </p>
                                <p class='font-mono text-gray-900 mt-1'>
                                    {staffMember.mobilePhoneNumber ?? '-'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Personal Information -->
                <Card class='p-4 sm:p-6'>
                    <CardHeader class='pb-3'>
                        <CardTitle class='flex items-center gap-2 text-lg'>
                            <UserIcon class='h-5 w-5 text-emerald-600' />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent class='space-y-4'>
                        <div class='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <p
                                    class='text-xs text-gray-500 uppercase tracking-wide'
                                >
                                    Official Document ID
                                </p>
                                <p class='font-mono text-gray-900 mt-1'>
                                    {staffMember.officialDocumentId ?? '-'}
                                </p>
                            </div>
                            <div>
                                <p
                                    class='text-xs text-gray-500 uppercase tracking-wide'
                                >
                                    Academic Year
                                </p>
                                <p class='font-medium text-gray-900 mt-1'>
                                    {staffMember.currentAcademicYear ?? '-'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Specialities Section -->
            {#if staffMember.specialities}
                <Card class='mt-6 p-4 sm:p-6'>
                    <CardHeader class='pb-4'>
                        <CardTitle class='flex items-center gap-2 text-lg'>
                            <BookOpenIcon class='h-5 w-5 text-emerald-600' />
                            Teaching Specialities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable {columns} data={staffMember.specialities} />
                    </CardContent>
                </Card>
            {/if}
        {/if}
    </div>
</div>
