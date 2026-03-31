<script lang='ts'>
    import type { Component } from 'svelte';
    import { Label } from '$lib/components/ui/label';
    import * as Select from '$lib/components/ui/select';
    import { cn } from '$lib/utils';

    interface SelectOption {
        value: string;
        label: string;
    }

    type BaseProps = {
        label?: string;
        options: SelectOption[];
        placeholder?: string;
        icon?: Component;
        triggerClass?: string;
        labelClass?: string;
        contentClass?: string;
        disabled?: boolean;
        required?: boolean;
    };

    type SingleSelectProps = BaseProps & {
        type?: 'single';
        value: string;
        onValueChange: (value: string | undefined) => void;
    };

    type MultipleSelectProps = BaseProps & {
        type: 'multiple';
        value: string[];
        onValueChange: (value: string[] | undefined) => void;
    };

    type Props = SingleSelectProps | MultipleSelectProps;

    let {
        label,
        value = $bindable(),
        options,
        onValueChange,
        placeholder = 'Select...',
        icon: Icon,
        triggerClass,
        labelClass,
        contentClass,
        disabled = false,
        required = false,
        type = 'single',
    }: Props = $props();

    // Get label for a single value
    function getLabel(val: string): string {
        return options.find(o => o.value === val)?.label || val;
    }

    // Check if value is empty
    const isEmpty = $derived.by(() => {
        if (type === 'multiple') {
            const values = value as string[];
            return !values || values.length === 0;
        }
        else {
            const singleValue = value as string;
            return (
                singleValue === undefined
                || singleValue === null
                || singleValue === ''
            );
        }
    });

    // Computed display label based on type
    const displayLabel = $derived.by(() => {
        if (isEmpty) {
            return placeholder;
        }

        if (type === 'multiple') {
            const values = value as string[];
            // Get all labels for selected values
            const labels = values.map(v => getLabel(v));
            // Join with comma and let CSS handle truncation
            return labels.join(', ');
        }
        else {
            return getLabel(value as string);
        }
    });
</script>

<div class='flex flex-col gap-2'>
    {#if label}
        <Label
            class={cn(
                'text-xs font-medium uppercase tracking-wide text-gray-500 block',
                labelClass,
            )}
        >
            {label}
            {#if required}
                <span class='text-red-500'>*</span>
            {/if}
        </Label>
    {/if}

    <Select.Root
        {type}
        {value}
        onValueChange={(v) => {
            if (disabled)
                return;
            if (type === 'multiple') {
                value = v ?? [];
                (onValueChange as (value: string[] | undefined) => void)(
                    v as string[] | undefined,
                );
            }
            else {
                value = v ?? '';
                (onValueChange as (value: string | undefined) => void)(
                    v as string | undefined,
                );
            }
        }}
    >
        <Select.Trigger
            class={cn(
                'w-full',
                disabled && 'cursor-not-allowed h-9.5 rounded-[6px] opacity-50',
                triggerClass,
            )}
        >
            <div
                class='flex items-center gap-2 flex-1 text-left overflow-hidden'
            >
                {#if Icon}
                    <Icon class='h-4 w-4 text-gray-400 shrink-0' />
                {/if}
                <span
                    class={cn(
                        'truncate',
                        isEmpty ? 'text-gray-500' : 'text-gray-900',
                    )}
                >
                    {displayLabel}
                </span>
            </div>
        </Select.Trigger>
        <Select.Content class={contentClass}>
            {#each options as option (option.value)}
                <Select.Item value={option.value} label={option.label} />
            {/each}
        </Select.Content>
    </Select.Root>
</div>
