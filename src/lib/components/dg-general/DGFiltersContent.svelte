<script lang='ts'>
    import type { DGFiltersState } from './types.js';
    import { SelectInputField } from '$lib/components/select-input-field';
    import { Button } from '$lib/components/ui/button';
    import CalendarIcon from '@lucide/svelte/icons/calendar';
    import DownloadIcon from '@lucide/svelte/icons/download';
    import MapPinIcon from '@lucide/svelte/icons/map-pin';

    interface SelectOption {
        value: string;
        label: string;
    }

    interface Props {
        filters: DGFiltersState;
        onFiltersChange: (filters: DGFiltersState) => void;
        onExport?: () => void;
        provinceOptions?: SelectOption[];
        districtOptions?: SelectOption[];
    }

    const defaultProvinceOptions: SelectOption[] = [
        { value: 'all', label: 'All Provinces' },
        { value: 'kigali', label: 'Kigali City' },
        { value: 'southern', label: 'Southern Province' },
        { value: 'western', label: 'Western Province' },
        { value: 'northern', label: 'Northern Province' },
        { value: 'eastern', label: 'Eastern Province' },
    ];

    const defaultDistrictOptions: SelectOption[] = [
        { value: 'gasabo', label: 'Gasabo' },
        { value: 'kicukiro', label: 'Kicukiro' },
        { value: 'nyarugenge', label: 'Nyarugenge' },
        { value: 'bugesera', label: 'Bugesera' },
        { value: 'gatsibo', label: 'Gatsibo' },
        { value: 'kayonza', label: 'Kayonza' },
        { value: 'kirehe', label: 'Kirehe' },
        { value: 'ngoma', label: 'Ngoma' },
        { value: 'nyagatare', label: 'Nyagatare' },
        { value: 'rwamagana', label: 'Rwamagana' },
    ];

    const {
        filters,
        onFiltersChange,
        onExport,
        provinceOptions = defaultProvinceOptions,
        districtOptions = defaultDistrictOptions,
    }: Props = $props();

    const dateRangeOptions = [
        { value: 'last_year', label: 'Last Year' },
        { value: 'this_quarter', label: 'This Quarter' },
        { value: 'last_quarter', label: 'Last Quarter' },
        { value: 'this_month', label: 'This Month' },
        { value: 'last_month', label: 'Last Month' },
    ];

    const schoolTypeOptions = [
        { value: 'all', label: 'All Types (Pub/Priv)' },
        { value: 'public', label: 'Public Schools' },
        { value: 'private', label: 'Private Schools' },
    ];

    const facultyOptions = [
        { value: 'all', label: 'All Faculties...' },
        { value: 'software', label: 'Software Development' },
        { value: 'mechanics', label: 'Mechanics' },
        { value: 'automobile', label: 'Automobile' },
        { value: 'tourism', label: 'Tourism' },
        { value: 'electrical', label: 'Electrical Engineering' },
        { value: 'construction', label: 'Road Construction' },
    ];

    function updateFilter<K extends keyof DGFiltersState>(
        key: K,
        value: DGFiltersState[K],
    ) {
        onFiltersChange({ ...filters, [key]: value });
    }
</script>

<div class='flex flex-col gap-5'>
    <SelectInputField
        label='Date Range'
        value={filters.dateRange}
        options={dateRangeOptions}
        onValueChange={(v: string | undefined) =>
            v && updateFilter('dateRange', v)}
        icon={CalendarIcon}
        triggerClass='h-9.5 rounded-[6px]'
        placeholder='Select Date Range...'
    />

    <SelectInputField
        label='Province'
        value={filters.province}
        options={provinceOptions}
        onValueChange={(v: string | undefined) =>
            v && updateFilter('province', v)}
        icon={MapPinIcon}
        placeholder='Select Province...'
    />

    <SelectInputField
        label='District'
        value={filters.district}
        options={districtOptions}
        onValueChange={(v: string | undefined) =>
            updateFilter('district', v ?? '')}
        placeholder='Select District...'
    />

    <SelectInputField
        label='School Type'
        value={filters.schoolType}
        options={schoolTypeOptions}
        onValueChange={(v: string | undefined) =>
            v && updateFilter('schoolType', v)}
        placeholder='Select School Type...'
    />

    <SelectInputField
        label='Faculty'
        value={filters.faculty}
        options={facultyOptions}
        onValueChange={(v: string | undefined) =>
            v && updateFilter('faculty', v)}
        placeholder='Select Faculty...'
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
