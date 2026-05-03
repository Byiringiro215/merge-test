<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';

    const { children, class: className, ...props } = $props();
</script>

<span
    class={cn(
        'inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent-foreground',
        className,
    )}
    {...props}
>
    {@render children()}
</span>
