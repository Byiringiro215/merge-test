<script lang='ts'>
    import type { ColumnDef } from '@tanstack/table-core';
    import type { Course } from './types.js';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import { Button } from '$lib/components/ui/button/index.js';
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from '$lib/components/ui/card';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import { Input } from '$lib/components/ui/input';
    import Pagination from '$lib/components/ui/pagination/pagination.svelte';
    import { EyeIcon, PencilIcon, Search, Trash } from '@lucide/svelte';
    import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
    import { createRawSnippet } from 'svelte';

    interface Props {
        courses: Course[];
    }

    const { courses }: Props = $props();

    let searchQuery = $state('');
    let currentPage = $state(1);
    const pageSize = 6;

    const filteredCourses = $derived(
        searchQuery
            ? courses.filter(
                c =>
                    c.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                        || c.school
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        || c.district
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        || c.instructor
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
            )
            : courses,
    );

    const totalPages = $derived(Math.ceil(filteredCourses.length / pageSize));
    const totalResults = $derived(filteredCourses.length);

    const paginatedCourses = $derived(
        filteredCourses.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize,
        ),
    );

    // Reset to page 1 when search changes
    $effect(() => {
        if (searchQuery !== undefined) {
            currentPage = 1;
        }
    });

    function handlePageChange(page: number) {
        currentPage = page;
    }

    function getSuccessRateColor(rate: number): {
        bg: string;
        text: string;
        borderColor: string;
    } {
        if (rate >= 90)
            return { bg: '#DCFCE7', text: '#166534', borderColor: '#BBF7D0' };
        if (rate >= 80)
            return { bg: '#DBEAFE', text: '#1E40AF', borderColor: '#BFDBFE' };
        if (rate >= 70)
            return { bg: '#FFEDD5', text: '#9A3412', borderColor: '#FED7AA' };
        return { bg: '#FEE2E2', text: '#DC2626', borderColor: '#FECACA' };
    }

    function getAvatarColor(name: string): string {
        const colors = [
            '#3B82F6',
            '#22C55E',
            '#F97316',
            '#A855F7',
            '#EC4899',
            '#06B6D4',
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    const columns: ColumnDef<Course>[] = [
        {
            id: 'name',
            accessorKey: 'name',
            header: () => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<div class="text-sm font-inter leading-7 h-[40px] font-medium text-[#565D6D]">Course Name</div>`,
                }));
                return renderSnippet(snippet);
            },
            cell: ({ row }) => {
                const course = row.original;
                const snippet = createRawSnippet(() => ({
                    render: () => `
            <div class="flex items-center gap-3">
              <div class="h-9 w-9 rounded-lg bg-[#205FAD0D] flex items-center justify-center flex-shrink-0">
                <svg class="h-5 w-5 text-primary-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <span class="font-normal font-sans leading-5 text-sm text-primary-black">${course.name}</span>
            </div>
          `,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            id: 'schoolDistrict',
            accessorKey: 'school',
            header: () => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<div class="text-sm leading-7 h-[48px] font-inter font-medium text-[#565D6D]">High School & District</div>`,
                }));
                return renderSnippet(snippet);
            },
            cell: ({ row }) => {
                const course = row.original;
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<div class="flex flex-col">
              <span class="text-sm text-[#171A1F]">${course.school}</span>
              <div class="flex items-center gap-1 mt-0.5">
                <svg class="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span class="text-xs text-[#565D6D]">${course.district}</span>
              </div>
            </div>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'faculty',
            header: () => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<div class="text-sm leading-7 font-inter h-[48px] font-medium text-[#565D6D]">Faculty</div>`,
                }));
                return renderSnippet(snippet);
            },
            cell: ({ row }) => {
                const faculty = row.original.faculty;
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<div>
            <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-normal bg-[#F3F4F666]">${faculty}</span>
            </div>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'instructor',
            header: () => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<div class="text-sm leading-7 font-inter h-[48px] font-medium text-[#565D6D]">Instructor</div>`,
                }));
                return renderSnippet(snippet);
            },
            cell: ({ row }) => {
                const course = row.original;
                const initials = course.instructor
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                const avatarColor = getAvatarColor(course.instructor);
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<div class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0" style="background-color: ${avatarColor};">
                ${course.instructorAvatar ? `<img src="${course.instructorAvatar}" alt="${course.instructor}" class="h-full w-full rounded-full object-cover" />` : initials}
              </div>
              <span class="text-sm text-[#171A1F]">${course.instructor}</span>
            </div>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'enrollment',
            header: () => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<div class="text-sm leading-7 font-inter h-[48px] font-medium text-[#565D6D]">Enrollment</div>`,
                }));
                return renderSnippet(snippet);
            },
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-[#171A1F]">${row.original.enrollment}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'successRate',
            header: () => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<div class="text-sm leading-7 font-inter h-[48px] font-medium text-[#565D6D]">Success Rate</div>`,
                }));
                return renderSnippet(snippet);
            },
            cell: ({ row }) => {
                const rate = row.original.successRate;
                const colors = getSuccessRateColor(rate);
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-normal" style="background-color: ${colors.bg}; color: ${colors.text}; border: 1px solid ${colors.borderColor};">${rate}%</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            id: 'actions',
            header: () => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<div class="text-sm leading-7 font-inter h-[48px] font-medium text-[#565D6D]">Actions</div>`,
                }));
                return renderSnippet(snippet);
            },
            cell: ({ row }) =>
                renderSnippet(rowAction, { courses: row.original }),
        },
    ];

    function handleRowClick(_course: Course) {
    // TODO: implement row click navigation
    }
</script>

<Card class='border border-gray-200 rounded-xl shadow-sm'>
    <CardHeader class='px-6 py-5'>
        <div
            class='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'
        >
            <div>
                <CardTitle
                    class='text-xl leading-7 text-[#171A1F] font-bold tracking-[-0.5px]'
                >Course Catalog</CardTitle
                >
                <p class='text-sm text-gray-500 mt-1'>
                    Inventory of technical courses across all High Schools.
                </p>
            </div>
            <div class='flex items-center gap-2'>
                <div class='relative w-full sm:w-72'>
                    <Search
                        class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                    />
                    <Input
                        type='text'
                        placeholder='Filter by course or school...'
                        bind:value={searchQuery}
                        class='pl-9 h-10 rounded-lg border border-[#DEE1E6] bg-white placeholder:text-[#9095A1]'
                    />
                </div>
                <Button
                    variant='outline'
                    size='icon'
                    class='shrink-0 rounded-lg h-10 w-10'
                >
                    <EllipsisIcon class='h-4 w-4 text-[#565D6D]' />
                </Button>
            </div>
        </div>
    </CardHeader>
    <CardContent class='p-0'>
        <div class='overflow-x-auto'>
            <DataTable
                {columns}
                data={paginatedCourses}
                tableRowClick={handleRowClick}
            />
        </div>
        <!-- Pagination -->
        <div
            class='flex items-center justify-between border-t border-gray-200 px-6 py-4'
        >
            <p class='text-sm text-gray-500'>
                Showing {(currentPage - 1) * pageSize + 1}-{Math.min(
                    currentPage * pageSize,
                    totalResults,
                )} of {totalResults} results
            </p>
            {#if totalPages > 1}
                <Pagination
                    {currentPage}
                    {totalPages}
                    onPageChange={handlePageChange}
                />
            {:else}
                <div class='flex items-center gap-2'>
                    <Button variant='outline' size='sm' disabled class='gap-1'>
                        <svg
                            class='h-4 w-4'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            stroke-width='2'
                        >
                            <polyline points='15 18 9 12 15 6' />
                        </svg>
                        Previous
                    </Button>
                    <Button variant='outline' size='sm' disabled class='gap-1'>
                        Next
                        <svg
                            class='h-4 w-4'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            stroke-width='2'
                        >
                            <polyline points='9 18 15 12 9 6' />
                        </svg>
                    </Button>
                </div>
            {/if}
        </div>
    </CardContent>
</Card>

<!-- eslint-disable-next-line unused-imports/no-unused-vars -->
{#snippet rowAction({ courses }: { courses: Course })}
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            {#snippet child({ props })}
                <Button
                    {...props}
                    variant='ghost'
                    size='icon'
                    class='relative size-8 p-0'
                >
                    <span class='sr-only'>Open menu</span>
                    <EllipsisIcon />
                </Button>
            {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Group>
                <DropdownMenu.Label>Actions</DropdownMenu.Label>
                <DropdownMenu.Item>
                    <EyeIcon class='mr-2 h-4 w-4' />
                    View details
                </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Item>
                <PencilIcon class='mr-2 h-4 w-4' />
                Edit details
            </DropdownMenu.Item>
            <DropdownMenu.Item class='text-red-600 group cursor-pointer'>
                <Trash
                    class='mr-2 h-4 w-4 text-red-600 group-hover:text-black!'
                />
                Delete
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
{/snippet}
