<script lang='ts'>
    import { Button } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import { LoaderCircle, TriangleAlert } from '@lucide/svelte';

    interface Props {
        open: boolean;
        title?: string;
        message: string;
        confirmLabel?: string;
        isLoading?: boolean;
        error?: string;
        onOpenChange: (open: boolean) => void;
        onConfirm: () => void;
    }

    const {
        open,
        title = 'Are you sure?',
        message,
        confirmLabel = 'Delete',
        isLoading = false,
        error = '',
        onOpenChange,
        onConfirm,
    }: Props = $props();
</script>

<Dialog.Root
    {open}
    onOpenChange={(v) => {
        if (!isLoading)
            onOpenChange(v);
    }}
>
    <Dialog.Content class='sm:max-w-sm'>
        <Dialog.Header>
            <Dialog.Title class='flex items-center gap-2'>
                <TriangleAlert class='h-5 w-5 text-destructive' />
                {title}
            </Dialog.Title>
        </Dialog.Header>

        <p class='text-sm text-muted-foreground'>{message}</p>

        {#if error}
            <div
                class='rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700'
            >
                {error}
            </div>
        {/if}

        <Dialog.Footer>
            <Button
                variant='outline'
                disabled={isLoading}
                onclick={() => onOpenChange(false)}
            >
                Cancel
            </Button>
            <Button
                variant='destructive'
                disabled={isLoading}
                onclick={onConfirm}
            >
                {#if isLoading}
                    <LoaderCircle class='mr-2 h-4 w-4 animate-spin' />
                {/if}
                {confirmLabel}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
