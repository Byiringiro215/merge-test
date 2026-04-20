<script lang='ts'>
    import type { Snippet } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import { LoaderCircle } from '@lucide/svelte';

    interface Props {
        open: boolean;
        title: string;
        description?: string;
        isSubmitting?: boolean;
        submitLabel?: string;
        children: Snippet;
        onOpenChange: (open: boolean) => void;
        onSubmit: () => void;
    }

    const {
        open,
        title,
        description,
        isSubmitting = false,
        submitLabel = 'Save',
        children,
        onOpenChange,
        onSubmit,
    }: Props = $props();
</script>

<Dialog.Root
    {open}
    onOpenChange={(v) => {
        if (!isSubmitting)
            onOpenChange(v);
    }}

>
    <Dialog.Content class='sm:max-w-2xl p-10'>
        <Dialog.Header class='py-2'>
            <Dialog.Title>{title}</Dialog.Title>
            {#if description}
                <Dialog.Description>{description}</Dialog.Description>
            {/if}
        </Dialog.Header>

        <form
            class='flex flex-col gap-4'
            onsubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            {@render children()}

            <Dialog.Footer class='mt-2'>
                <Button
                    type='button'
                    variant='outline'
                    disabled={isSubmitting}
                    onclick={() => onOpenChange(false)}
                >
                    Cancel
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                    {#if isSubmitting}
                        <LoaderCircle class='mr-2 h-4 w-4 animate-spin' />
                    {/if}
                    {submitLabel}
                </Button>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>
