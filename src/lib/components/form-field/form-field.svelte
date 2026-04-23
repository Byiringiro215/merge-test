<script lang='ts' module>
    export type SelectOption = { label: string; value: string | number };
</script>

<script lang='ts'>
    import type { HTMLInputTypeAttribute } from 'svelte/elements';
    import * as Command from '$lib/components/ui/command';
    import Input from '$lib/components/ui/input/input.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import * as Popover from '$lib/components/ui/popover/index.js';
    import Textarea from '$lib/components/ui/textarea/textarea.svelte';
    import { cn } from '$lib/utils';
    import CheckIcon from '@lucide/svelte/icons/check';
    import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
    import { useId } from 'bits-ui';
    import { tick } from 'svelte';
    import { buttonVariants } from '../ui/button';

    type BaseProps = {
        name: string;
        label: string;
        error?: string | undefined;
        disabled?: boolean;
        placeholder?: string;
        containerClass?: string;
        labelClass?: string;
        inputClass?: string | undefined;
        errorClass?: string;
    };

    type InputModeProps = BaseProps & {
        value: string | number | null | undefined;
        onInput: (v: string) => void;
        type?: Exclude<HTMLInputTypeAttribute, 'file'>;
        textareaInput?: false;
        searchSelectInput?: false;
        options?: never;
        onSearch?: never;
        onSelect?: never;
    };

    type TextareaModeProps = BaseProps & {
        value: string | null | undefined;
        onInput: (v: string) => void;
        textareaInput: true;
        type?: never;
        searchSelectInput?: false;
        options?: never;
        onSearch?: never;
        onSelect?: never;
    };

    type SearchSelectModeProps = BaseProps & {
        value: string | number | null | undefined;
        searchSelectInput: true;
        options: SelectOption[];
        onSelect: (option: SelectOption) => void;
        onSearch?: (searchTerm: string) => void;
        onInput?: never;
        type?: never;
        textareaInput?: false;
    };

    type Props = InputModeProps | TextareaModeProps | SearchSelectModeProps;

    const {
        name,
        label,
        error,
        disabled = false,
        placeholder,
        containerClass = 'relative my-[5px] flex flex-col gap-[15px]',
        labelClass = '',
        inputClass = undefined,
        errorClass = '',
        value,
        type = 'text',
        textareaInput,
        searchSelectInput,
        options,
        onInput,
        onSearch,
        onSelect,
    }: Props = $props();

    const triggerId = useId();
    let open = $state<boolean>(false);

    function closeAndFocusTrigger() {
        open = false;
        tick().then(() => {
            document.getElementById(triggerId)?.focus();
        });
    }
</script>

<div class='relative my-1.25 h-fit'>
    {#if searchSelectInput}
        <!-- autocomplete select input -->
        <div class='flex flex-col my-4'>
            <Popover.Root bind:open>
                <Label class={labelClass} for={triggerId}>{label}</Label>
                <Popover.Trigger
                    id={triggerId}
                    {disabled}
                    class={cn(
                        buttonVariants({ variant: 'outline' }),
                        'focus-within:ring-primary w-full justify-between rounded text-[13px] focus-within:ring-2 hover:bg-transparent',
                        !value && 'text-muted-foreground',
                    )}
                    role='combobox'
                >
                    {options?.find(o => String(o.value) === String(value))?.label
                        ?? placeholder}
                    <ChevronsUpDownIcon class='opacity-50' />
                </Popover.Trigger>
                <input type='hidden' {name} value={value ?? ''} />

                <Popover.Content
                    class='min-w-[320px] p-0'
                    side='bottom'
                    align='start'
                    sideOffset={4}
                    avoidCollisions={false}
                >
                    <Command.Root>
                        <Command.Input
                            oninput={(e) => {
                                if (onSearch)
                                    onSearch(e.currentTarget.value);
                            }}
                            autofocus
                            placeholder='Search.....'
                            class='h-9'
                        />
                        <Command.Empty>No options found.</Command.Empty>
                        <Command.Group value='options'>
                            {#if options?.length}
                                {#each options as option, index (index)}
                                    <Command.Item
                                        value={option.label}
                                        onSelect={() => {
                                            onSelect?.(option);
                                            closeAndFocusTrigger();
                                        }}
                                    >
                                        {option.label}
                                        <CheckIcon
                                            class={cn(
                                                'ml-auto',
                                                String(option.value) !== String(value)
                                                    && 'text-transparent',
                                            )}
                                        />
                                    </Command.Item>
                                {/each}
                            {/if}
                        </Command.Group>
                    </Command.Root>
                </Popover.Content>
            </Popover.Root>
            {#if error}
                <div class={cn('text-destructive text-sm font-medium mt-1', errorClass)}>
                    {error}
                </div>
            {/if}
        </div>
    {:else if textareaInput}
        <div class='my-4'>
            <Label class={labelClass} for={name}>{label}</Label>
            <Textarea
                id={name}
                {name}
                {placeholder}
                {disabled}
                class={cn(inputClass, 'h-18 resize-none rounded')}
                value={value as string ?? ''}
                oninput={e => onInput?.(e.currentTarget.value)}
            />
            {#if error}
                <div class={cn('text-destructive text-sm font-medium mt-1', errorClass)}>
                    {error}
                </div>
            {/if}
        </div>
    {:else}
        <div class={containerClass}>
            <Label class={labelClass} for={name}>{label}</Label>
            <Input
                id={name}
                {name}
                {type}
                {placeholder}
                {disabled}
                class={inputClass}
                value={value ?? ''}
                oninput={e => onInput?.(e.currentTarget.value)}
            />
            {#if error}
                <div class={cn('text-destructive text-sm font-medium mt-1', errorClass)}>
                    {error}
                </div>
            {/if}
        </div>
    {/if}
</div>
