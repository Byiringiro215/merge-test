<script lang='ts'>
    import { Button } from '$lib/components/ui/button';
    import ChevronLeft from '@lucide/svelte/icons/chevron-left';
    import ChevronRight from '@lucide/svelte/icons/chevron-right';

    interface Props {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        totalItems?: number;
        pageSize?: number;
    }

    // eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
    const { currentPage = 1, totalPages = 1, onPageChange, totalItems, pageSize }: Props = $props();

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        // Handle edge case: no pages
        if (totalPages === 0) {
            return [1];
        }

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
            else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            }
            else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = $derived(getPageNumbers());
    const effectiveTotalPages = $derived(totalPages || 1);
</script>

<div class='flex items-center justify-end gap-4 px-2'>
    <div class='flex items-center gap-2'>
        <Button
            variant='outline'
            size='sm'
            onclick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            class='h-8 w-8 p-0'
        >
            <ChevronLeft class='h-4 w-4' />
        </Button>

        <div class='flex items-center gap-1'>
            {#each pageNumbers as page, i (i)}
                {#if typeof page === 'number'}
                    <Button
                        variant={currentPage === page ? 'default' : 'outline'}
                        size='sm'
                        onclick={() => onPageChange(page)}
                        class='h-8 w-8 p-0'
                    >
                        {page}
                    </Button>
                {:else}
                    <span class='px-2 text-muted-foreground'>...</span>
                {/if}
            {/each}
        </div>

        <Button
            variant='outline'
            size='sm'
            onclick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === effectiveTotalPages}
            class='h-8 w-8 p-0'
        >
            <ChevronRight class='h-4 w-4' />
        </Button>
    </div>
</div>
