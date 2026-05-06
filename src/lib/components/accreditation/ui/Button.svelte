<script lang='ts'>
    import type { Snippet } from 'svelte';
    import { cn } from '$lib/accreditation/utils/cn';

    const {
        children,
        class: className,
        variant = 'default',
        type = 'button',
        onclick,
        disabled = false,
        href,
    }: {
        children: Snippet;
        class?: string;
        variant?: 'default' | 'outline';
        type?: 'button' | 'submit';
        onclick?: () => void;
        disabled?: boolean;
        href?: string;
    } = $props();

    const variants = {
        default: 'bg-[#2069C1] text-[#2069C1]-foreground hover:bg-[#2069C1]/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    };

    const baseClasses = 'inline-flex h-10 items-center justify-center whitespace-nowrap rounded-sm px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
</script>

{#if href}
    <a {href} class={cn(baseClasses, variants[variant], className)}>
        {@render children()}
    </a>
{:else}
    <button {type} {onclick} {disabled} class={cn(baseClasses, variants[variant], className)}>
        {@render children()}
    </button>
{/if}
