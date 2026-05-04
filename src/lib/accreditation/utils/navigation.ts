import { allAccreditationNavItems } from '$lib/accreditation/config/navigation';

export function getPortalNavigation(role: string, pathname: string) {
    // Filter items based on simulated roles
    const filteredItems = allAccreditationNavItems.filter(item =>
        item.roles.includes(role as any),
    );

    return filteredItems.map(item => ({
        ...item,
        isActive:
            item.match === 'exact'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`),
    }));
}
