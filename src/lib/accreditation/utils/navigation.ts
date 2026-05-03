import type { UserRole } from '$lib/accreditation/types/auth';
import { portalNavigation } from '$lib/accreditation/config/navigation';

export function getPortalNavigation(role: UserRole, pathname: string) {
    const config = portalNavigation[role];

    return config.items.map(item => ({
        ...item,
        isActive:
      item.match === 'exact'
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`),
    }));
}
