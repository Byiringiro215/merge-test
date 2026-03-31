<script lang='ts'>
    import type { SchoolsFiltersState } from './types.js';
    import { Button } from '$lib/components/ui/button';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
    import {
        DISTRICTS_BY_PROVINCE,
        INSTITUTION_TYPES,
        PROVINCES,

    } from './types.js';

    interface Props {
        filters: SchoolsFiltersState;
        onFiltersChange: (filters: SchoolsFiltersState) => void;
        onApplyFilters?: () => void;
    }

    const { filters, onFiltersChange, onApplyFilters }: Props = $props();

    let districtExpanded = $state(false);

    // Get available districts based on selected provinces
    const availableDistricts = $derived(() => {
        if (filters.provinces.length === 0)
            return [];
        return filters.provinces.flatMap(
            province => DISTRICTS_BY_PROVINCE[province] || [],
        );
    });

    function toggleInstitutionType(value: string) {
        const current = filters.institutionTypes;
        const updated = current.includes(value)
            ? current.filter(t => t !== value)
            : [...current, value];
        onFiltersChange({ ...filters, institutionTypes: updated });
    }

    function toggleProvince(value: string) {
        const current = filters.provinces;
        const updated = current.includes(value)
            ? current.filter(p => p !== value)
            : [...current, value];
        // Reset district if province selection changes
        onFiltersChange({ ...filters, provinces: updated, district: '' });
    }

    function setDistrict(value: string) {
        onFiltersChange({ ...filters, district: value });
    }
</script>

<div class='flex flex-col gap-6'>
    <!-- Institution Type -->
    <div>
        <h4 class='text-sm font-medium text-gray-900 mb-3'>Institution Type</h4>
        <div class='flex flex-col gap-3'>
            {#each INSTITUTION_TYPES as type (type.value)}
                <label class='flex items-center gap-3 cursor-pointer'>
                    <Checkbox
                        checked={filters.institutionTypes.includes(type.value)}
                        onCheckedChange={() => toggleInstitutionType(type.value)}
                        class='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                    />
                    <span class='text-sm text-gray-700'>{type.label}</span>
                </label>
            {/each}
        </div>
    </div>

    <!-- Province -->
    <div>
        <h4 class='text-sm font-medium text-gray-900 mb-3'>Province</h4>
        <div class='flex flex-col gap-3'>
            {#each PROVINCES as province (province.value)}
                <label class='flex items-center gap-3 cursor-pointer'>
                    <Checkbox
                        checked={filters.provinces.includes(province.value)}
                        onCheckedChange={() => toggleProvince(province.value)}
                        class='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                    />
                    <span class='text-sm text-gray-700'>{province.label}</span>
                </label>
            {/each}
        </div>
    </div>

    <!-- District -->
    <div>
        <button
            type='button'
            class='flex items-center justify-between w-full text-left'
            onclick={() => (districtExpanded = !districtExpanded)}
        >
            <h4 class='text-sm font-medium text-gray-900'>District</h4>
            <ChevronRightIcon
                class="h-4 w-4 text-gray-400 transition-transform {districtExpanded
                    ? 'rotate-90'
                    : ''}"
            />
        </button>
        {#if filters.provinces.length === 0}
            <p class='text-sm text-gray-400 mt-2'>Select a province first</p>
        {:else if districtExpanded}
            <div class='flex flex-col gap-3 mt-3'>
                {#each availableDistricts() as district (district.value)}
                    <label class='flex items-center gap-3 cursor-pointer'>
                        <Checkbox
                            checked={filters.district === district.value}
                            onCheckedChange={() => setDistrict(district.value)}
                            class='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                        />
                        <span class='text-sm text-gray-700'>{district.label}</span>
                    </label>
                {/each}
            </div>
        {/if}
    </div>
</div>

<!-- Apply Filters Button -->
<div class='mt-auto pt-6'>
    <Button
        class='w-full bg-primary hover:bg-blue-700'
        onclick={onApplyFilters}
    >
        Apply Filters
    </Button>
</div>
