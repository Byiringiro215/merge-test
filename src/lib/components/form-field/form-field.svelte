<script lang='ts'>
    import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
    import type { FormPath, SuperForm } from 'sveltekit-superforms';

    type InputProps = {
        type?: Exclude<HTMLInputTypeAttribute, 'file'>;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        autocomplete?: HTMLInputAttributes['autocomplete'];
        min?: string | number;
        max?: string | number;
        step?: string | number;
    };

    import * as Command from '$lib/components/ui/command';
    import * as Form from '$lib/components/ui/form/index.js';
    import Input from '$lib/components/ui/input/input.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import * as Popover from '$lib/components/ui/popover/index.js';
    import * as Select from '$lib/components/ui/select/index.js';
    import Textarea from '$lib/components/ui/textarea/textarea.svelte';
    import { cn } from '$lib/utils';
    import CheckIcon from '@lucide/svelte/icons/check';
    import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
    import { useId } from 'bits-ui';
    import { tick } from 'svelte';
    import { buttonVariants } from '../ui/button';

    type T = $$Generic<Record<string, unknown>>;
    // type K = FormPath<T>;

    type BaseProps<T extends Record<string, unknown>> = InputProps & {
        formStore: SuperForm<T>;
        name: FormPath<T>;
        label: string;
        value?: string | number | undefined;
        containerClass?: string;
        labelClass?: string;
        inputClass?: string | undefined;
        errorClass?: string;
        textareaInput?: boolean;
    };
    type InputModeProps<T extends Record<string, unknown>> = BaseProps<T> & {
        selectInput?: false;
        options?: never;
        searchSelectInput?: false;
        onSearch?: never;
    };
    type SelectModeProps<T extends Record<string, unknown>> = BaseProps<T> & {
        selectInput: true;
        options: { label: string; value: string | number }[];
        searchSelectInput?: false;
        onSearch?: never;
    };
    type SearchInputModeProps<T extends Record<string, unknown>>
        = BaseProps<T> & {
            searchSelectInput: true;
            options: { label: string; value: string | number }[];
            selectInput?: never;
            onSearch?: (searchTerm: string) => void;
        };

    type Props<T extends Record<string, unknown>>
        = | InputModeProps<T>
            | SelectModeProps<T>
            | SearchInputModeProps<T>;

    let {
        formStore,
        name,
        label,
        selectInput,
        options,
        containerClass = 'relative my-[5px] flex flex-col gap-[15px]',
        labelClass = '',
        inputClass = undefined,
        errorClass = '',
        searchSelectInput,
        onSearch = undefined,
        textareaInput,
        value = $bindable(),
        ...inputProps
    }: Props<T> = $props();

    const { form: formData } = formStore;

    const triggerId = useId();
    let open = $state<boolean>(false);

    function closeAndFocusTrigger(triggerId: string) {
        open = false;
        tick().then(() => {
            document.getElementById(triggerId)?.focus();
        });
    }
</script>

<div class='relative my-1.25 h-fit'>
    {#if searchSelectInput}
        <Form.Field form={formStore} {name} class='flex flex-col'>
            <Form.Control>
                {#snippet children({ props })}
                    <Popover.Root bind:open>
                        <Label class={labelClass}>{label}</Label>
                        <Popover.Trigger
                            class={cn(
                                buttonVariants({ variant: 'outline' }),
                                'focus-within:ring-primary w-full justify-between rounded text-[13px]  focus-within:ring-2 hover:bg-transparent ',
                                !$formData[name] && 'text-muted-foreground',
                            )}
                            role='combobox'
                            {...props}
                        >
                            {options?.find(
                                (f: {
                                    value: string | number;
                                    label: string;
                                }) =>
                                    String(f.value) === String($formData[name]),
                            )?.label ?? inputProps.placeholder}
                            <ChevronsUpDownIcon class='opacity-50' />
                        </Popover.Trigger>
                        <input
                            hidden
                            value={$formData[name]}
                            {...props}
                            {name}
                        />

                        <Popover.Content class='min-w-[320px] p-0'>
                            <Command.Root>
                                <Command.Input
                                    oninput={(e) => {
                                        if (onSearch) {
                                            onSearch(e.currentTarget.value);
                                        }
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
                                                    $formData[name]
                                                        = option.value as T[FormPath<T>];
                                                    closeAndFocusTrigger(
                                                        triggerId,
                                                    );
                                                }}
                                            >
                                                {option.label}
                                                <CheckIcon
                                                    class={cn(
                                                        'ml-auto',
                                                        option.value
                                                            !== $formData[name]
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
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    {:else if selectInput}
        <Form.Field form={formStore} {name}>
            <Form.Control>
                {#snippet children({ props })}
                    <Label class={labelClass}>{label}</Label>
                    <Select.Root
                        type='single'
                        bind:value={$formData[name] as string}
                    >
                        <Select.Trigger
                            {...props}
                            class="w-full {$formData[name]
                                ? 'font-normal text-black'
                                : 'font-light text-[#737373]'} focus-within:ring-primary rounded px-2 py-5 text-[13px] focus-within:ring-2 "
                        >
                            {$formData[name]
                                ? $formData[name]
                                : inputProps.placeholder}
                        </Select.Trigger>
                        <Select.Content
                            class='shadow-primary w-full   rounded-none border-none bg-white'
                        >
                            {#if options?.length}
                                {#each options as option, index (index)}
                                    <Select.Item
                                        value={option.value.toString()}
                                        label={option.label}
                                    />
                                {/each}
                            {:else}
                                <p
                                    class='px-2.5 py-3 text-center text-[14px] font-medium text-gray-500'
                                >
                                    No options available
                                </p>
                            {/if}
                        </Select.Content>
                    </Select.Root>
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    {:else if inputProps.type === 'file'}
        <Form.Field form={formStore} {name}>
            <Form.Control>
                {#snippet children({ props })}
                    <div class={cn(containerClass, 'mt-4')}>
                        <div class='mx-auto max-w-xs'>
                            <Label class={labelClass}>{label}</Label>
                            <input
                                {...inputProps}
                                {...props}
                                class='file:bg-primary hover:file:shadow-primary mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-60'
                            />
                        </div>
                    </div>
                {/snippet}
            </Form.Control>
            <Form.FieldErrors
                class={cn(errorClass, 'mt-1 text-center text-red-600')}
            />
        </Form.Field>
    {:else if textareaInput}
        <Form.Field form={formStore} {name}>
            <Form.Control>
                {#snippet children({ props })}
                    <Label class={labelClass}>{label}</Label>
                    <Textarea
                        {...props}
                        placeholder={inputProps.placeholder}
                        class={cn(inputClass, 'h-18 resize-none rounded')}
                        bind:value={$formData[name] as string}
                    />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    {:else}
        <Form.Field form={formStore} {name}>
            <Form.Control>
                {#snippet children({ props })}
                    <div class={containerClass}>
                        <Label class={labelClass}>{label}</Label>
                        <Input
                            bind:value={$formData[name]}
                            {...props}
                            {...inputProps}
                            class={inputClass}
                        />
                    </div>
                {/snippet}
            </Form.Control>

            <Form.FieldErrors class={errorClass} />
        </Form.Field>
    {/if}
</div>
