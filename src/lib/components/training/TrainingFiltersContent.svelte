<script lang='ts'>
    import type { TrainingFiltersState } from './types.js';
    import { SelectInputField } from '$lib/components/select-input-field';
    import { Button } from '$lib/components/ui/button';
    import CalendarIcon from '@lucide/svelte/icons/calendar';
    import DownloadIcon from '@lucide/svelte/icons/download';
    import MapPinIcon from '@lucide/svelte/icons/map-pin';

    interface Props {
        filters: TrainingFiltersState;
        onFiltersChange: (filters: TrainingFiltersState) => void;
        onExport?: () => void;
    }

    const { filters, onFiltersChange, onExport }: Props = $props();

    const dateRangeOptions = [
        { value: 'this_year', label: 'This Year' },
        { value: 'last_year', label: 'Last Year' },
        { value: 'this_quarter', label: 'This Quarter' },
        { value: 'last_quarter', label: 'Last Quarter' },
        { value: 'this_month', label: 'This Month' },
    ];

    const provinceOptions = [
        { value: 'all', label: 'All Provinces' },
        { value: 'kigali', label: 'Kigali City' },
        { value: 'southern', label: 'Southern Province' },
        { value: 'western', label: 'Western Province' },
        { value: 'northern', label: 'Northern Province' },
        { value: 'eastern', label: 'Eastern Province' },
    ];

    const districtOptions = [
        { value: '', label: 'Select District...' },
        { value: 'gasabo', label: 'Gasabo' },
        { value: 'kicukiro', label: 'Kicukiro' },
        { value: 'nyarugenge', label: 'Nyarugenge' },
        { value: 'bugesera', label: 'Bugesera' },
        { value: 'gatsibo', label: 'Gatsibo' },
        { value: 'kayonza', label: 'Kayonza' },
    ];

    const schoolTypeOptions = [
        { value: 'all', label: 'All Types (Pub/Priv)' },
        { value: 'public', label: 'Public Schools' },
        { value: 'private', label: 'Private Schools' },
    ];

    const tradeAreaOptions = [
        { value: '', label: 'Select Trade...' },
        { value: 'masonry', label: 'Masonry' },
        { value: 'carpentry', label: 'Carpentry' },
        { value: 'it_software', label: 'IT & Software' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'culinary', label: 'Culinary Arts' },
        { value: 'welding', label: 'Welding' },
    ];

    function updateFilter<K extends keyof TrainingFiltersState>(
        key: K,
        value: TrainingFiltersState[K],
    ) {
        onFiltersChange({ ...filters, [key]: value });
    }
</script>

<div class='flex flex-col gap-5'>
    <SelectInputField
        label='DATE RANGE'
        value={filters.dateRange}
        options={dateRangeOptions}
        onValueChange={(v: string | undefined) =>
            v && updateFilter('dateRange', v)}
        icon={CalendarIcon}
        triggerClass='h-9.5 rounded-[6px]'
        placeholder='Select Date Range...'
    />

    <SelectInputField
        label='PROVINCE'
        value={filters.province}
        options={provinceOptions}
        onValueChange={(v: string | undefined) =>
            v && updateFilter('province', v)}
        icon={MapPinIcon}
        placeholder='All Provinces'
    />

    <SelectInputField
        label='DISTRICT'
        value={filters.district}
        options={districtOptions}
        onValueChange={(v: string | undefined) =>
            updateFilter('district', v ?? '')}
        placeholder='Select District...'
    />

    <SelectInputField
        label='SCHOOL TYPE'
        value={filters.schoolType}
        options={schoolTypeOptions}
        onValueChange={(v: string | undefined) =>
            v && updateFilter('schoolType', v)}
        placeholder='All Types (Pub/Priv)'
    />

    <SelectInputField
        label='TRADE AREA'
        value={filters.tradeArea}
        options={tradeAreaOptions}
        onValueChange={(v: string | undefined) =>
            updateFilter('tradeArea', v ?? '')}
        placeholder='Select Trade...'
    />
</div>

<!-- Export Button -->
<div class='mt-auto pt-6'>
    <Button
        class='w-full bg-primary hover:bg-blue-700 gap-2'
        onclick={onExport}
    >
        <DownloadIcon class='h-4 w-4' />
        Export Data
    </Button>
</div>
