import type { UserRole } from '$lib/accreditation/types/auth';
import {
    BadgeCheck,
    Bell,
    CalendarCheck,
    ClipboardCheck,
    FileSpreadsheet,
    House,
    User,
    Users,
} from '@lucide/svelte';

export interface AccreditationNavItem {
    title: string;
    href: string;
    icon: any;
    match?: 'exact';
    roles: UserRole[];
}

export const allAccreditationNavItems: AccreditationNavItem[] = [
    {
        title: 'Dashboard',
        href: '/accreditation/dashboard',
        icon: House,
        match: 'exact',
        roles: ['applicant', 'evaluator', 'curriculum-evaluator', 'super-admin', 'supervisor', 'merged'],
    },
    {
        title: 'Applications',
        href: '/accreditation/applications',
        icon: FileSpreadsheet,
        roles: ['applicant', 'curriculum-evaluator', 'super-admin', 'merged'],
    },
    {
        title: 'Evaluations',
        href: '/accreditation/my-evaluations',
        icon: BadgeCheck,
        roles: ['evaluator', 'super-admin', 'supervisor', 'merged'],
    },
    {
        title: 'My Applications',
        href: '/accreditation/my-applications',
        icon: CalendarCheck,
        roles: ['applicant', 'merged'],
    },
    {
        title: 'Certificates',
        href: '/accreditation/certificates',
        icon: ClipboardCheck,
        roles: ['supervisor', 'super-admin', 'merged'],
    },
    {
        title: 'Users',
        href: '/accreditation/users',
        icon: Users,
        roles: ['super-admin', 'merged'],
    },
    {
        title: 'Profile',
        href: '/accreditation/profile',
        icon: User,
        roles: ['applicant', 'evaluator', 'curriculum-evaluator', 'super-admin', 'supervisor', 'merged'],
    },
    {
        title: 'Notifications',
        href: '/accreditation/notifications',
        icon: Bell,
        roles: ['applicant', 'evaluator', 'curriculum-evaluator', 'super-admin', 'supervisor', 'merged'],
    },
];

export const portalNavigationConfig: Record<UserRole, { label: string; shortLabel: string }> = {
    'applicant': { label: 'Applicant Portal', shortLabel: 'Applicant' },
    'evaluator': { label: 'Evaluator Portal', shortLabel: 'Evaluator' },
    'super-admin': { label: 'Super Admin Portal', shortLabel: 'Super Admin' },
    'curriculum-evaluator': { label: 'Curriculum Evaluator Portal', shortLabel: 'Curriculum' },
    'supervisor': { label: 'Supervisor Portal', shortLabel: 'Supervisor' },
    'merged': { label: 'Accreditation Portal', shortLabel: 'Accreditation' },
};
