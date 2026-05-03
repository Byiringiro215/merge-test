<script lang='ts'>
    import type { Snippet } from 'svelte';
    import { cn } from '$lib/accreditation/utils/cn';
    import { ArrowDown, ListFilter, Search, X } from '@lucide/svelte';

    export interface Column<T> {
        header: string;
        accessor: keyof T | ((item: T) => Snippet | any);
        className?: string;
        headerClassName?: string;
        sortable?: boolean;
    }

    const {
        data,
        columns,
        onRowClick,
        class: className,
        title,
        description,
        searchPlaceholder = 'Search',
        searchValue,
        onSearchChange,
        filters,
        headerAction,
        showPagination = false,
        currentPage = 1,
        totalPages = 10,
        onPageChange,
    }: {
        data: any[];
        columns: Column<any>[];
        onRowClick?: (item: any) => void;
        class?: string;
        title?: string;
        description?: string;
        searchPlaceholder?: string;
        searchValue?: string;
        onSearchChange?: (value: string) => void;
        filters?: Snippet;
        headerAction?: Snippet;
        showPagination?: boolean;
        currentPage?: number;
        totalPages?: number;
        onPageChange?: (page: number) => void;
    } = $props();
</script>

<div class={cn('flex flex-col', className)}>
    {#if title || description}
        <div class='mb-6'>
            <div class='mb-6 flex items-center justify-between gap-4'>
                <div>
                    <h2 class='text-md font-semibold text-[#101828]'>{title}</h2>
                    <p class='text-xs text-[#64748B]'>{description}</p>
                </div>
                {#if headerAction}
                    <div class='shrink-0'>
                        {@render headerAction()}
                    </div>
                {/if}
            </div>

            <div class='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div class='relative flex-1 max-w-md'>
                    <Search class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <input
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        oninput={e => onSearchChange?.(e.currentTarget.value)}
                        class='w-full rounded-sm border border-slate-100 bg-white py-3 pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary'
                        type='text'
                    />
                </div>

                <div class='flex flex-wrap items-center gap-2'>
                    {#if filters}
                        {@render filters()}
                    {:else}
                        <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-white px-3 py-2 text-xs text-[#344054]'>
                            <span>All time</span>
                            <X class='h-3 w-3 cursor-pointer text-slate-400 transition-colors hover:text-slate-600' />
                        </div>
                        <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-white px-3 py-2 text-xs text-[#344054]'>
                            <span>US, AU, +4</span>
                            <X class='h-3 w-3 cursor-pointer text-slate-400 transition-colors hover:text-slate-600' />
                        </div>
                        <button class='flex cursor-pointer items-center gap-2 rounded-sm border border-slate-100 bg-white px-3 py-2.5 text-xs text-[#344054] transition-colors hover:bg-slate-100'>
                            <ListFilter class='h-4 w-4 text-slate-500' />
                            <span>More filters</span>
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    {/if}

    <div class='overflow-hidden rounded-md border border-slate-200 bg-white shadow-none'>
        <div class='no-scrollbar overflow-x-auto'>
            <table class='w-full min-w-[1000px] border-collapse text-left'>
                <thead>
                    <tr class='border-b border-[#EAECF0]'>
                        <th class='w-10 py-4 pl-6 pr-2 text-right'>
                            <input
                                type='checkbox'
                                class='h-4 w-4 cursor-pointer rounded-sm border-[#D0D5DD] text-primary focus:ring-primary'
                            />
                        </th>
                        {#each columns as col}
                            <th class={cn('px-2 py-4 text-[13px] font-normal text-[#475467]', col.headerClassName)}>
                                <div class={cn('group flex items-start gap-1 select-none', col.sortable && 'cursor-pointer')}>
                                    <span>{col.header}</span>
                                    {#if col.sortable}
                                        <ArrowDown class='h-4 w-4 text-[#667085] opacity-0 transition-opacity group-hover:opacity-100' />
                                    {/if}
                                </div>
                            </th>
                        {/each}
                    </tr>
                </thead>
                <tbody class='divide-y divide-slate-100'>
                    {#each data as item (item.id)}
                        <tr
                            onclick={() => onRowClick?.(item)}
                            class={cn(
                                'group transition-all duration-200 hover:bg-slate-50/80',
                                'odd:bg-[#FAFDFF]',
                                onRowClick && 'cursor-pointer',
                            )}
                        >
                            <td class='py-4 pl-6 pr-2 text-right'>
                                <input
                                    type='checkbox'
                                    class='h-4 w-4 cursor-pointer rounded-sm border-[#D0D5DD] text-primary focus:ring-primary'
                                />
                            </td>
                            {#each columns as col}
                                <td class={cn('px-2 py-4 align-middle', col.className)}>
                                    {#if typeof col.accessor === 'function'}
                                        {@render col.accessor(item)}
                                    {:else}
                                        {item[col.accessor]}
                                    {/if}
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        {#if showPagination}
            <div class='flex items-center justify-between border-t border-slate-100 bg-white p-6'>
                <div class='flex items-center gap-2'>
                    <button
                        onclick={() => onPageChange?.(currentPage - 1)}
                        disabled={currentPage <= 1}
                        class='cursor-pointer rounded-sm border border-[#D0D5DD] bg-slate-50 px-4 py-3 text-xs text-[#344054] transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        Previous
                    </button>
                    <button
                        onclick={() => onPageChange?.(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        class='cursor-pointer rounded-sm border border-[#D0D5DD] bg-slate-50 px-4 py-3 text-xs text-[#344054] transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        Next
                    </button>
                </div>
                <span class='text-xs text-slate-500'>
                    Page {currentPage} of {totalPages}
                </span>
            </div>
        {/if}
    </div>
</div>
