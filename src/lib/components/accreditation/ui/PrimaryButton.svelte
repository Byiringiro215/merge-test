<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import { Plus } from '@lucide/svelte';
    import Button from './Button.svelte';

    const {
        label,
        href,
        class: className,
        onclick,
        type = 'button',
        hideIcon = false,
        icon: customIcon,
        iconPosition = 'left',
        disabled = false,
        variant = 'primary',
    }: {
        label: string;
        href?: string;
        class?: string;
        onclick?: () => void;
        type?: 'button' | 'submit';
        hideIcon?: boolean;
        icon?: any;
        iconPosition?: 'left' | 'right';
        disabled?: boolean;
        variant?: 'primary' | 'outline';
    } = $props();

    const ButtonIcon = $derived(customIcon || Plus);
    // svelte-ignore state_referenced_locally
    const buttonVariant = variant === 'primary' ? 'default' : 'outline';
</script>

<Button
    variant={buttonVariant}
    {type}
    {onclick}
    {href}
    {disabled}
    class={cn(
        'rounded-sm cursor-pointer',
        variant === 'primary' && 'bg-[#0A77FF] text-white!',
        className,
    )}
>
    <span class={cn('inline-flex items-center', variant === 'primary' && 'text-white')}>
        {#if !hideIcon && iconPosition === 'left'}
            <ButtonIcon class={cn('h-4 w-4 text-white', label && 'mr-2')} aria-hidden='true' />
        {/if}

        {#if label}
            <span class={cn(variant === 'primary' && 'font-medium text-white')}>{label}</span>
        {/if}

        {#if !hideIcon && iconPosition === 'right'}
            <ButtonIcon class={cn('h-4 w-4 text-white', label && 'ml-2')} aria-hidden='true' />
        {/if}
    </span>
</Button>
