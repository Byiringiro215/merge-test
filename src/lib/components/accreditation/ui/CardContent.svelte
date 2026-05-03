<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';

    const { children, class: className } = $props();
</script>

<div class={cn('p-6 pt-0', className)}>
    {@render children()}
</div>
