<script lang='ts'>
    import { cn } from '$lib/utils';
    import CheckIcon from '@lucide/svelte/icons/check';
    import { Select as SelectPrimitive } from 'bits-ui';

    type Props = SelectPrimitive.ItemProps & {
        class?: string;
    };

    const { class: className, value, label, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Item
    class={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-gray-100',
        className,
    )}
    {value}
    {label}
    {...restProps}
>
    {#snippet children(snippetProps)}
        <span
            class='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'
        >
            {#if snippetProps.selected}
                <CheckIcon class='h-4 w-4' />
            {/if}
        </span>
        {label}
    {/snippet}
</SelectPrimitive.Item>
