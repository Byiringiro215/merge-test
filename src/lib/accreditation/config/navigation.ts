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

export const allAccreditationNavItems = [
    {
        title: 'Dashboard',
        href: '/accreditation/dashboard',
        icon: House,
        match: 'exact' as const,
        roles: ['applicant', 'evaluator', 'curriculum-evaluator', 'super-admin', 'supervisor', 'merged'],
    },
    {
        title: 'Applications',
        href: '/accreditation/applicant/applications',
        icon: FileSpreadsheet,
        roles: ['applicant', 'curriculum-evaluator', 'super-admin', 'merged'],
    },
    {
        title: 'Evaluations',
        href: '/accreditation/evaluator/applications',
        icon: BadgeCheck,
        roles: ['evaluator', 'super-admin', 'supervisor', 'merged'],
    },
    {
        title: 'My Evaluations',
        href: '/accreditation/applicant/evaluations',
        icon: CalendarCheck,
        roles: ['applicant', 'merged'],
    },
    {
        title: 'Certificates',
        href: '/accreditation/supervisor/certificates',
        icon: ClipboardCheck,
        roles: ['supervisor', 'super-admin', 'merged'],
    },
    {
        title: 'Users',
        href: '/accreditation/super-admin/users',
        icon: Users,
        roles: ['super-admin', 'merged'],
    },
    {
        title: 'Profile',
        href: '/accreditation/applicant/profile',
        icon: User,
        roles: ['applicant', 'evaluator', 'curriculum-evaluator', 'super-admin', 'supervisor', 'merged'],
    },
    {
        title: 'Notifications',
        href: '/accreditation/applicant/notifications',
        icon: Bell,
        roles: ['applicant', 'evaluator', 'curriculum-evaluator', 'super-admin', 'supervisor', 'merged'],
    },
];

export const portalNavigationConfig = {
    'applicant': { label: 'Applicant Portal', shortLabel: 'Applicant' },
    'evaluator': { label: 'Evaluator Portal', shortLabel: 'Evaluator' },
    'super-admin': { label: 'Super Admin Portal', shortLabel: 'Super Admin' },
    'curriculum-evaluator': { label: 'Curriculum Evaluator Portal', shortLabel: 'Curriculum' },
    'supervisor': { label: 'Supervisor Portal', shortLabel: 'Supervisor' },
    'merged': { label: 'Accreditation Portal', shortLabel: 'Accreditation' },
};
