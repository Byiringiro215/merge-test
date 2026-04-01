<script lang='ts'>
    import type { DigitalTechFiltersState } from './types.js';
    import { SelectInputField } from '$lib/components/select-input-field';
    import { Button } from '$lib/components/ui/button';
    import CalendarIcon from '@lucide/svelte/icons/calendar';
    import DownloadIcon from '@lucide/svelte/icons/download';
    import GlobeIcon from '@lucide/svelte/icons/globe';
    import MapPinIcon from '@lucide/svelte/icons/map-pin';

    interface Props {
        filters: DigitalTechFiltersState;
        onFiltersChange: (filters: DigitalTechFiltersState) => void;
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

    const connectionOptions = [
        { value: 'all', label: 'All Connections' },
        { value: 'fiber', label: 'Fiber Optic' },
        { value: 'cellular', label: 'Cellular Data' },
        { value: 'wireless', label: 'Fixed Wireless' },
        { value: 'satellite', label: 'Satellite' },
    ];

    function updateFilter<K extends keyof DigitalTechFiltersState>(
        key: K,
        value: DigitalTechFiltersState[K],
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
        label='CONNECTION'
        value={filters.connection}
        options={connectionOptions}
        onValueChange={(v: string | undefined) =>
            v && updateFilter('connection', v)}
        icon={GlobeIcon}
        placeholder='All Connections'
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
