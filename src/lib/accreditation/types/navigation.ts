import type { UserRole } from './auth';

export interface NavigationItem {
    title: string;
    href: string;
    description: string;
    icon: any;
    match?: 'exact' | 'prefix';
}

export interface PortalNavigation {
    role: UserRole;
    label: string;
    shortLabel: string;
    basePath: string;
    items: NavigationItem[];
}
