<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';

    const { children, class: className } = $props();
</script>

<div class={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
    {@render children()}
</div>
