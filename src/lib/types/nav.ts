import type { Resource } from '$lib/auth/index.svelte';
import type { Component } from 'svelte';

export interface SubNavItem {
    label: string;
    href: string;
}

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: Component;
    resource?: Resource;
    subNav?: SubNavItem[];
}
