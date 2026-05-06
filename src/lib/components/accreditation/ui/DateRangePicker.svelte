<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import { ChevronLeft, ChevronRight } from '@lucide/svelte';
    import { fade } from 'svelte/transition';

    const {
        onApply,
        onCancel,
    } = $props<{
        onApply?: (range: { start: Date; end: Date }) => void;
        onCancel?: () => void;
    }>();

    // State for selection
    let startDate: Date | null = $state(new Date(2024, 0, 6)); // Jan 6, 2024
    let endDate: Date | null = $state(new Date(2024, 0, 13)); // Jan 13, 2024

    // Current view months
    let viewDate = $state(new Date(2026, 4, 1)); // May 2026

    const presets = [
        { label: 'Today', getValue: () => ({ start: new Date(), end: new Date() }) },
        { label: 'Yesterday', getValue: () => {
            const d = new Date();
            d.setDate(d.getDate() - 1);
            return { start: d, end: d };
        } },
        { label: 'This week', getValue: () => {
            const now = new Date();
            const start = new Date(now.setDate(now.getDate() - now.getDay()));
            const end = new Date(now.setDate(now.getDate() - now.getDay() + 6));
            return { start, end };
        } },
        { label: 'Last week', getValue: () => {
            const now = new Date();
            const start = new Date(now.setDate(now.getDate() - now.getDay() - 7));
            const end = new Date(now.setDate(now.getDate() - now.getDay() + 6));
            return { start, end };
        } },
        { label: 'This month', getValue: () => {
            const now = new Date();
            return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 0) };
        } },
        { label: 'Last month', getValue: () => {
            const now = new Date();
            return { start: new Date(now.getFullYear(), now.getMonth() - 1, 1), end: new Date(now.getFullYear(), now.getMonth(), 0) };
        } },
        { label: 'This year', getValue: () => {
            const now = new Date();
            return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear(), 11, 31) };
        } },
        { label: 'Last year', getValue: () => {
            const now = new Date();
            return { start: new Date(now.getFullYear() - 1, 0, 1), end: new Date(now.getFullYear() - 1, 11, 31) };
        } },
        { label: 'All time', getValue: () => ({ start: new Date(2020, 0, 1), end: new Date() }) },
    ];

    let selectedPreset = $state('All time');

    function isSameDay(d1: Date, d2: Date) {
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    }

    function isBetween(date: Date, start: Date, end: Date) {
        return date > start && date < end;
    }

    function handleDateClick(date: Date) {
        if (!startDate || (startDate && endDate)) {
            startDate = date;
            endDate = null;
        }
        else {
            if (date < startDate) {
                endDate = startDate;
                startDate = date;
            }
            else {
                endDate = date;
            }
        }
        selectedPreset = '';
    }

    function getDaysInMonth(year: number, month: number) {
        const date = new Date(year, month, 1);
        const days = [];
        const firstDayOfWeek = (date.getDay() + 6) % 7; // Adjust to start Monday

        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const leftMonthDays = $derived(getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth()));
    const rightMonth = $derived(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    const rightMonthDays = $derived(getDaysInMonth(rightMonth.getFullYear(), rightMonth.getMonth()));

    function formatDate(date: Date | null) {
        if (!date)
            return 'Select date';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
</script>

<div
    class='fixed inset-0 z-1000 flex items-center justify-center bg-slate-900/80 transition-all'
    transition:fade={{ duration: 200 }}
>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class='absolute inset-0' onclick={() => onCancel?.()}></div>

    <div
        class='relative flex max-w-[840px] animate-in fade-in zoom-in-95 overflow-hidden rounded-sm border border-slate-200 bg-white duration-200 shadow-2xl'
    >
        <!-- Sidebar Presets -->
        <div class='flex w-[180px] flex-col gap-0.5 border-r border-slate-100 p-2'>
            {#each presets as preset}
                <button
                    type='button'
                    onclick={() => {
                        const val = preset.getValue();
                        startDate = val.start;
                        endDate = val.end;
                        selectedPreset = preset.label;
                    }}
                    class={cn(
                        'w-full cursor-pointer rounded-sm px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50',
                        selectedPreset === preset.label ? 'bg-slate-50 font-medium text-[#2069C1]' : 'text-slate-600',
                    )}
                >
                    {preset.label}
                </button>
            {/each}
        </div>

        <!-- Main Content -->
        <div class='flex flex-col'>
            <div class='flex gap-8 p-6'>
                <!-- Left Calendar -->
                <div class='w-[280px]'>
                    <div class='mb-4 flex items-center justify-between px-2'>
                        <div class='flex items-center gap-2'>
                            <button
                                type='button'
                                class='cursor-pointer rounded-sm p-1 hover:bg-slate-100'
                                onclick={() => viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)}
                            >
                                <ChevronLeft class='h-4 w-4 text-slate-500' />
                            </button>
                        </div>
                        <h4 class='text-sm font-medium text-slate-900'>{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</h4>
                        <div class='flex items-center gap-2'></div>
                    </div>
                    <div class='mb-2 grid grid-cols-7 gap-y-1 text-center'>
                        {#each ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as day}
                            <span class='text-[11px] font-medium uppercase text-slate-400'>{day}</span>
                        {/each}
                    </div>
                    <div class='grid grid-cols-7 gap-y-0.5'>
                        {#each leftMonthDays as day}
                            {#if day === null}
                                <div class='h-9 w-9'></div>
                            {:else}
                                {@const isSelected = (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate))}
                                {@const isInRange = startDate && endDate && isBetween(day, startDate, endDate)}
                                <button
                                    type='button'
                                    onclick={() => handleDateClick(day)}
                                    class={cn(
                                        'group relative flex h-9 w-9 cursor-pointer items-center justify-center text-xs transition-all',
                                        isSelected ? 'bg-[#2069C1] text-white rounded-full z-10' : 'hover:bg-slate-100 hover:rounded-full',
                                        isInRange && 'bg-[#2069C1]/10 text-[#2069C1] rounded-none',
                                        isInRange && isSameDay(day, new Date(day.getFullYear(), day.getMonth(), day.getDate())) && 'first-of-range:rounded-l-full last-of-range:rounded-r-full',
                                    )}
                                >
                                    {day.getDate()}
                                </button>
                            {/if}
                        {/each}
                    </div>
                </div>

                <!-- Right Calendar -->
                <div class='w-[280px]'>
                    <div class='mb-4 flex items-center justify-between px-2'>
                        <div class='flex items-center gap-2'></div>
                        <h4 class='text-sm font-medium text-slate-900'>{monthNames[rightMonth.getMonth()]} {rightMonth.getFullYear()}</h4>
                        <div class='flex items-center gap-2'>
                            <button
                                type='button'
                                class='cursor-pointer rounded-sm p-1 hover:bg-slate-100'
                                onclick={() => viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)}
                            >
                                <ChevronRight class='h-4 w-4 text-slate-500' />
                            </button>
                        </div>
                    </div>
                    <div class='mb-2 grid grid-cols-7 gap-y-1 text-center'>
                        {#each ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as day}
                            <span class='text-[11px] font-medium uppercase text-slate-400'>{day}</span>
                        {/each}
                    </div>
                    <div class='grid grid-cols-7 gap-y-0.5'>
                        {#each rightMonthDays as day}
                            {#if day === null}
                                <div class='h-9 w-9'></div>
                            {:else}
                                {@const isSelected = (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate))}
                                {@const isInRange = startDate && endDate && isBetween(day, startDate, endDate)}
                                <button
                                    type='button'
                                    onclick={() => handleDateClick(day)}
                                    class={cn(
                                        'group relative flex h-9 w-9 cursor-pointer items-center justify-center text-xs transition-all',
                                        isSelected ? 'bg-[#2069C1] text-white rounded-full z-10' : 'hover:bg-slate-100 hover:rounded-full',
                                        isInRange && 'bg-[#2069C1]/10 text-[#2069C1] rounded-none',
                                    )}
                                >
                                    {day.getDate()}
                                </button>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class='mt-auto flex items-center justify-between gap-4 border-t border-slate-100 p-4'>
                <div class='flex items-center gap-2'>
                    <div class='min-w-[120px] rounded-sm border border-slate-200 px-3 py-3 text-sm text-slate-600'>
                        {formatDate(startDate)}
                    </div>
                    <span class='text-slate-400'>–</span>
                    <div class='min-w-[120px] rounded-sm border border-slate-200 px-3 py-3 text-sm text-slate-600'>
                        {formatDate(endDate)}
                    </div>
                </div>
                <div class='flex items-center gap-2'>
                    <button
                        type='button'
                        onclick={() => onCancel?.()}
                        class='cursor-pointer rounded-sm border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50'
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        disabled={!startDate || !endDate}
                        onclick={() => startDate && endDate && onApply?.({ start: startDate, end: endDate })}
                        class='cursor-pointer rounded-sm bg-[#2069C1] px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
