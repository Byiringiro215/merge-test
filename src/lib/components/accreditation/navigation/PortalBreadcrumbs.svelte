<script lang='ts'>
    import type { UserRole } from '$lib/accreditation/types/auth';
    import { page } from '$app/stores';
    import { portalNavigation } from '$lib/accreditation/config/navigation';
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

    const getSegmentTitle = (segment: string, fullPath: string, roleConfig: any) => {
        if (SEGMENT_TITLE_MAP[segment])
            return SEGMENT_TITLE_MAP[segment];
        if (!roleConfig)
            return formatSegment(segment);
        const navItem = roleConfig.items.find((item: any) => item.href === fullPath);
        return navItem ? navItem.title : formatSegment(segment);
    };

    const SEGMENT_HREF_MAP: Record<string, (role: string) => string> = {
        evaluations: (role: string) => role === 'applicant' ? '/accreditation/applicant/evaluations' : `/accreditation/${role}/evaluations/applications`,
    };

    const getSegmentHref = (segment: string, defaultPath: string, role: string) => {
        return SEGMENT_HREF_MAP[segment] ? SEGMENT_HREF_MAP[segment](role) : defaultPath;
    };

    const breadcrumbs = $derived.by(() => {
        if (pageHeader.breadcrumbs && pageHeader.breadcrumbs.length > 0) {
            return pageHeader.breadcrumbs;
        }

        const pathname = $page.url.pathname;
        const allSegments = pathname.split('/').filter(s => s && !s.startsWith('('));
        // Since routes are now under /accreditation, index 0 is 'accreditation'
        const role = allSegments[1] || '';
        const roleConfig = portalNavigation[role as UserRole];
        const portalSegments = allSegments.slice(2);

        return portalSegments.map((segment, index) => {
            const rawPath = `/accreditation/${role}/${portalSegments.slice(0, index + 1).join('/')}`;
            return {
                label: getSegmentTitle(segment, rawPath, roleConfig),
                href: getSegmentHref(segment, rawPath, role),
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
