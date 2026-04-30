<script lang='ts'>
    import type { Resource } from '$lib/auth/index.svelte';
    import type { NavItem } from '$lib/types/nav';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import { getAuthState, hasPermission } from '$lib/auth/index.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Navigation from '$lib/components/layout/Navigation.svelte';
    import {
        BookOpen,
        GraduationCap,
        LayoutGrid,
        LoaderCircle,
        Monitor,
        Settings,
    } from '@lucide/svelte';

    const { children } = $props();

    const auth = getAuthState();

    const routeResourceMap: Record<string, Resource> = {
        '/dashboard': 'reports:overview',
        '/students': 'students',
        '/teachers': 'teachers',
        '/schools': 'schools',
        '/curricula': 'schools',
        '/admin': 'iam:roles',
        '/admin/roles': 'iam:roles',
        '/admin/groups': 'iam:groups',
        '/admin/sessions': 'auth:sessions',
        '/admin/permissions': 'iam:permissions',
        '/admin/service-accounts': 'iam:service-accounts',
    };

    const allNavItems: NavItem[] = [
        {
            id: 'dg-general',
            label: 'DG General',
            href: '/dashboard',
            icon: LayoutGrid,
            resource: 'reports:overview',
        },
        {
            id: 'curriculum',
            label: 'Curriculum',
            href: '/curricula',
            icon: BookOpen,
            resource: 'schools',
            subNav: [
                { label: 'General', href: '/curricula' },
                { label: 'Curriculum', href: '/curricula/curriculum' },
                { label: 'Schools', href: '/curricula/schools' },
            ],
        },
        {
            id: 'training',
            label: 'Training',
            href: '/training',
            icon: GraduationCap,
            resource: 'teachers',
            subNav: [
                { label: 'General', href: '/training' },
                { label: 'Schools', href: '/training/schools' },
                { label: 'Students', href: '/training/students' },
                { label: 'Trades', href: '/training/trades' },
                { label: 'Courses', href: '/training/courses' },
            ],
        },
        {
            id: 'digital-tech',
            label: 'Digital Tech',
            href: '/digitalTech',
            icon: Monitor,
            resource: 'schools',
            subNav: [
                { label: 'General', href: '/digitalTech' },
                { label: 'Schools', href: '/digitalTech/schools' },
                { label: 'Devices', href: '/digitalTech/Devices' },
                { label: 'E-learning', href: '/digitalTech/e-learning' },
            ],
        },
        {
            id: 'admin',
            label: 'Admin',
            href: '/admin',
            icon: Settings,
            resource: 'iam:roles',
            subNav: [
                { label: 'Users', href: '/admin' },
                { label: 'Roles', href: '/admin/roles' },
                { label: 'Groups', href: '/admin/groups' },
                { label: 'Sessions', href: '/admin/sessions' },
                { label: 'Permissions', href: '/admin/permissions' },
                { label: 'Service Accounts', href: '/admin/service-accounts' },
            ],
        },
    ];

    const navItems = $derived(
        auth.permissionsLoaded
            ? allNavItems.filter(item => !item.resource || hasPermission(item.resource, 'read'))
            : [...allNavItems],
    );

    $effect(() => {
        if (!auth.isLoading && !auth.isAuthenticated) {
            goto(resolve(`/signin?redirect=${encodeURIComponent(page.url.pathname)}` as any));
        }
    });

    $effect(() => {
        if (!auth.isLoading && auth.isAuthenticated && auth.permissionsLoaded) {
            const base = `/${page.url.pathname.split('/').filter(Boolean)[0]}`;
            const resource = routeResourceMap[base];
            if (resource && !hasPermission(resource, 'read')) {
                goto(resolve('/dashboard'));
            }
        }
    });
</script>

{#if auth.isLoading}
    <div class='flex min-h-screen items-center justify-center bg-white'>
        <LoaderCircle class='h-8 w-8 animate-spin text-primary' />
    </div>
{:else if auth.isAuthenticated}
    <div class='flex min-h-screen flex-col bg-white'>
        <Navigation {navItems} />
        <main class='flex-1'>
            {@render children()}
        </main>
        <Footer />
    </div>
{/if}
