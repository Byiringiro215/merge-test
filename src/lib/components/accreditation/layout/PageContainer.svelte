<script lang='ts'>
    import type { Snippet } from 'svelte';
    import { getPageHeader } from '$lib/accreditation/context/page-header.svelte';
    import { cn } from '$lib/accreditation/utils/cn';
    import { untrack } from 'svelte';

    const {
        title,
        description,
        action,
        breadcrumbs,
        hideSidebar,
        noPadding,
        noScroll,
        children,
    }: {
        title: string;
        description: string;
        action?: Snippet;
        breadcrumbs?: { label: string; href: string }[];
        hideSidebar?: boolean;
        noPadding?: boolean;
        noScroll?: boolean;
        role?: string;
        children: Snippet;
    } = $props();

    const pageHeader = getPageHeader();

    $effect(() => {
        untrack(() => {
            pageHeader.setHeader({
                title,
                description,
                action: action || null,
                breadcrumbs,
                hideSidebar,
                noPadding,
                noScroll,
            });
        });
    });
</script>

<div class={cn('space-y-6', noScroll && 'flex h-full flex-col space-y-0')}>
    <div class={cn(
        noPadding ? 'p-0' : 'pb-6 pt-2 text-left',
        noScroll && 'flex flex-1 flex-col overflow-hidden',
    )}>
        {@render children()}
    </div>
</div>
