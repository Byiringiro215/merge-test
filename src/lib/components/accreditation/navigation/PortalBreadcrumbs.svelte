<script lang='ts'>
    import { page } from '$app/stores';
    import { allAccreditationNavItems } from '$lib/accreditation/config/navigation';
    import { getPageHeader } from '$lib/accreditation/context/page-header.svelte';
    import { ChevronRight } from '@lucide/svelte';

    const pageHeader = getPageHeader();

    const SEGMENT_TITLE_MAP: Record<string, string> = {
        evaluations: 'Evaluations',
        applications: 'Applications',
        evaluators: 'Evaluators',
        criteria: 'Criteria',
        schedule: 'Schedule',
        dashboard: 'Dashboard',
    };

    const formatSegment = (segment: string) => {
        return segment
            .replace(/-/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getSegmentTitle = (segment: string, fullPath: string) => {
        if (SEGMENT_TITLE_MAP[segment])
            return SEGMENT_TITLE_MAP[segment];

        // Try to find in nav items
        const navItem = allAccreditationNavItems.find((item: any) => item.href === fullPath);
        return navItem ? navItem.title : formatSegment(segment);
    };

    const breadcrumbs = $derived.by(() => {
        if (pageHeader.breadcrumbs && pageHeader.breadcrumbs.length > 0) {
            return pageHeader.breadcrumbs;
        }

        const pathname = $page.url.pathname;
        const allSegments = pathname.split('/').filter(s => s && !s.startsWith('('));

        // Remove 'accreditation' from segments for breadcrumb calculation
        const portalSegments = allSegments.filter(s => s !== 'accreditation');

        return portalSegments.map((segment, index) => {
            const currentSegments = portalSegments.slice(0, index + 1);
            const rawPath = `/accreditation/${currentSegments.join('/')}`;

            return {
                label: getSegmentTitle(segment, rawPath),
                href: rawPath,
            };
        });
    });
</script>

<nav class='flex items-center text-sm' aria-label='Breadcrumb'>
    <ol class='flex items-center gap-2'>
        {#each breadcrumbs as crumb, index}
            {@const isLast = index === breadcrumbs.length - 1}
            <li class='flex items-center gap-2'>
                {#if index > 0}
                    <ChevronRight class='h-4 w-4 text-[#D0D5DD]' />
                {/if}
                {#if isLast}
                    <span class='font-medium text-[#0A77FF]'>{crumb.label}</span>
                {:else}
                    <a href={crumb.href} class='text-primary transition-colors hover:text-primary'>
                        {crumb.label}
                    </a>
                {/if}
            </li>
        {/each}
    </ol>
</nav>
