<script lang='ts'>
    import { BookOpen, Building2, CheckCircle2 } from '@lucide/svelte';

    interface ProviderOption {
        key: string;
        label: string;
        description: string;
        icon: typeof BookOpen;
        badge: string;
    }

    interface Props {
        selected: string;
        onSelect: (key: string) => void;
    }

    const { selected, onSelect }: Props = $props();

    const options: ProviderOption[] = [
        {
            key: 'School',
            label: 'School',
            description: 'Includes Technical Secondary Schools (TSS) and Vocational Training Centres (VTC) that deliver Short Courses/Recognition of Prior Learning recognised by RTB.',
            icon: BookOpen,
            badge: 'TSS / VTC',
        },
        {
            key: 'Other Institution',
            label: 'Other Institution',
            description: 'Includes companies, trade unions, cooperatives, syndicates and NGOs providing short courses.',
            icon: Building2,
            badge: 'Company / NGO',
        },
    ];
</script>

<div class='flex flex-col gap-3'>
    {#each options as opt (opt.key)}
        {@const isSelected = selected === opt.key}
        {@const Icon = opt.icon}
        <button
            type='button'
            onclick={() => onSelect(opt.key)}
            class={`group relative flex items-start gap-4 rounded-sm border px-5 py-4 text-left transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#336cb2]/30 active:scale-[0.99] ${
                isSelected
                    ? 'border-[#336cb2] bg-[#336cb2]/10 ring-1 ring-[#336cb2]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
            }`}
        >
            <!-- Icon -->
            <span
                class={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                    isSelected
                        ? 'border-[#336cb2]/30 bg-[#336cb2]/15 text-[#336cb2]'
                        : 'border-slate-200 bg-slate-50 text-slate-500 group-hover:border-slate-300 group-hover:text-slate-600'
                }`}
            >
                <Icon class='h-5 w-5 stroke-[1.5]' />
            </span>

            <!-- Text -->
            <div class='flex-1 min-w-0'>
                <div class='flex items-center gap-2 mb-0.5'>
                    <span
                        class={`text-[14.5px] font-semibold leading-tight transition-colors ${isSelected ? 'text-[#2a5a96]' : 'text-slate-800'}`}
                    >
                        {opt.label}
                    </span>
                    <span
                        class={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full transition-colors ${
                            isSelected
                                ? 'bg-[#336cb2]/15 text-[#336cb2]'
                                : 'bg-slate-100 text-slate-400'
                        }`}
                    >
                        {opt.badge}
                    </span>
                </div>
                <p class={`text-[12.5px] leading-relaxed transition-colors ${isSelected ? 'text-[#336cb2]/80' : 'text-slate-500'}`}>
                    {opt.description}
                </p>
            </div>

            <!-- Check indicator -->
            <span class='mt-0.5 shrink-0 transition-opacity {isSelected ? 'opacity-100' : 'opacity-0'}'>
                <CheckCircle2 class='h-5 w-5 text-[#336cb2]' />
            </span>
        </button>
    {/each}
</div>
