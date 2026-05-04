<script lang='ts'>
    import type { LegalRep } from '../types_internal';
    import { BookOpen, Building2, CheckCircle } from '@lucide/svelte';

    interface Props {
        providerType: string;
        formData: Record<string, string>;
        legalReps: LegalRep[];
        aboutText: Record<string, string>;
    }

    const { providerType, formData, legalReps, aboutText }: Props = $props();

    const idFieldLabel = $derived(providerType === 'School' ? 'SDMS Code' : 'TIN Number');

    function val(key: string, fallback = '') {
        return formData[key] || fallback;
    }

    function maybe(v: string) {
        return v || null;
    }

    const locationParts = $derived([
        formData.Province,
        formData.District,
        formData.Sector,
        formData.Cell,
        formData.Village,
    ].filter(Boolean));
</script>

<div class='space-y-4'>
    <!-- Ready banner -->
    <div class='rounded-sm border border-slate-200 bg-slate-50 p-5 text-center'>
        <div class='mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#336cb2]/15 mb-2.5'>
            <CheckCircle class='h-5 w-5 text-[#336cb2]' />
        </div>
        <h3 class='text-[15px] font-semibold text-slate-800'>Ready to Submit!</h3>
        <p class='mt-1 text-[12.5px] text-slate-500 max-w-sm mx-auto'>
            Please review your application details below. Once confirmed, your application will be successfully routed.
        </p>
    </div>

    <!-- Institution Type -->
    <div class='rounded-sm border border-slate-200 bg-white overflow-hidden'>
        <div class='border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between'>
            <h4 class='text-[13px] font-semibold text-slate-700'>Institution Type</h4>
            <a href='/register/institution/institution-type' class='text-[12px] font-medium text-[#336cb2] hover:text-[#2a5a96] transition'>Edit</a>
        </div>
        <div class='px-5 py-4 flex items-center gap-3'>
            {#if providerType === 'School'}
                <BookOpen class='h-4 w-4 text-slate-500' />
            {:else}
                <Building2 class='h-4 w-4 text-slate-500' />
            {/if}
            <span class='text-[13.5px] font-medium text-slate-800'>
                {providerType || 'Not selected'}
            </span>
        </div>
    </div>

    <!-- Owner Verification -->
    {#if providerType !== 'School'}
        <div class='rounded-sm border border-slate-200 bg-white overflow-hidden'>
            <div class='border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between'>
                <h4 class='text-[13px] font-semibold text-slate-700'>Owner Verification</h4>
                <a href='/register/institution/institution-details' class='text-[12px] font-medium text-[#336cb2] hover:text-[#2a5a96] transition'>Edit</a>
            </div>
            <div class='p-5 space-y-4'>
                <div>
                    <span class='text-[11px] text-slate-400 uppercase tracking-wide block mb-1'>Verified Owner ID</span>
                    <p class='text-[13.5px] font-medium text-slate-800'>
                        {formData.representativeId || 'Not provided'}
                    </p>
                </div>
                <div>
                    <span class='text-[11px] text-slate-400 uppercase tracking-wide block mb-1'>Verified Owner Email</span>
                    <p class='text-[13.5px] font-medium text-slate-800'>
                        {formData.lookupEmail || 'Not provided'}
                    </p>
                </div>
            </div>
        </div>
    {/if}

    <!-- Institution Details -->
    <div class='rounded-sm border border-slate-200 bg-white overflow-hidden'>
        <div class='border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between'>
            <h4 class='text-[13px] font-semibold text-slate-700'>Institution Details</h4>
            <a href='/register/institution/institution-details' class='text-[12px] font-medium text-[#336cb2] hover:text-[#2a5a96] transition'>Edit</a>
        </div>
        <div class='p-5 grid grid-cols-2 gap-y-4 gap-x-6'>
            <div class='col-span-2'>
                <span class='text-[11px] text-slate-400 uppercase tracking-wide block mb-1'>{idFieldLabel}</span>
                <p class='text-[13.5px] font-medium text-slate-800'>
                    {#if maybe(val(idFieldLabel))}{val(idFieldLabel)}{:else}<span class='italic text-slate-400'>Not provided</span>{/if}
                </p>
            </div>
            <div class='col-span-2'>
                <span class='text-[11px] text-slate-400 uppercase tracking-wide block mb-1'>Name of Institution</span>
                <p class='text-[13.5px] font-medium text-slate-800'>
                    {#if maybe(val('Name of Institution'))}{val('Name of Institution')}{:else}<span class='italic text-slate-400'>Not provided</span>{/if}
                </p>
            </div>
            <div>
                <span class='text-[11px] text-slate-400 uppercase tracking-wide block mb-1'>P.O Box</span>
                <p class='text-[13.5px] font-medium text-slate-800'>
                    {#if maybe(val('P.O Box'))}{val('P.O Box')}{:else}<span class='italic text-slate-400'>—</span>{/if}
                </p>
            </div>
            <div>
                <span class='text-[11px] text-slate-400 uppercase tracking-wide block mb-1'>Phone</span>
                <p class='text-[13.5px] font-medium text-slate-800'>
                    {#if maybe(val('Phone Number'))}+250 {val('Phone Number')}{:else}<span class='italic text-slate-400'>—</span>{/if}
                </p>
            </div>
            <div class='col-span-2'>
                <span class='text-[11px] text-slate-400 uppercase tracking-wide block mb-1'>Email</span>
                <p class='text-[13.5px] font-medium text-slate-800'>
                    {#if maybe(val('Email'))}{val('Email')}{:else}<span class='italic text-slate-400'>Not provided</span>{/if}
                </p>
            </div>
        </div>
    </div>

    <!-- Address Information -->
    <div class='rounded-sm border border-slate-200 bg-white overflow-hidden'>
        <div class='border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between'>
            <h4 class='text-[13px] font-semibold text-slate-700'>Address Information</h4>
            <a href='/register/institution/address-information' class='text-[12px] font-medium text-[#336cb2] hover:text-[#2a5a96] transition'>Edit</a>
        </div>
        <div class='p-5 space-y-3'>
            <div>
                <span class='text-[11px] text-slate-400 uppercase tracking-wide block mb-1'>Location</span>
                <p class='text-[13.5px] font-medium text-slate-800'>
                    {#if locationParts.length > 0}{locationParts.join(' › ')}{:else}<span class='italic text-slate-400'>Not provided</span>{/if}
                </p>
            </div>
            <div>
                <span class='text-[11px] text-slate-400 uppercase tracking-wide block mb-1'>Address Line</span>
                <p class='text-[13.5px] font-medium text-slate-800'>
                    {#if maybe(val('Address Line'))}{val('Address Line')}{:else}<span class='italic text-slate-400'>Not provided</span>{/if}
                </p>
            </div>
        </div>
    </div>

    <!-- About the Institution -->
    <div class='rounded-sm border border-slate-200 bg-white overflow-hidden'>
        <div class='border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between'>
            <h4 class='text-[13px] font-semibold text-slate-700'>About the Institution</h4>
            <a href='/register/institution/about-the-institution' class='text-[12px] font-medium text-[#336cb2] hover:text-[#2a5a96] transition'>Edit</a>
        </div>
        <div class='p-5 space-y-4'>
            {#each ['Institution Summary', 'Mission or Mandate', 'Programs Offered'] as field (field)}
                <div>
                    <span class='text-[11px] text-slate-400 uppercase tracking-wide block mb-1'>{field}</span>
                    <p class='text-[13.5px] text-slate-800 leading-relaxed'>
                        {#if maybe(aboutText[field])}{aboutText[field]}{:else}<span class='italic text-slate-400'>Not provided</span>{/if}
                    </p>
                </div>
            {/each}
        </div>
    </div>

    <!-- Legal Representatives -->
    <div class='rounded-sm border border-slate-200 bg-white overflow-hidden'>
        <div class='border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between'>
            <h4 class='text-[13px] font-semibold text-slate-700'>Legal Representatives</h4>
            <a href='/register/institution/legal-representatives' class='text-[12px] font-medium text-[#336cb2] hover:text-[#2a5a96] transition'>Edit</a>
        </div>
        <div class='p-5'>
            {#if legalReps.length > 0}
                <div class='space-y-2.5'>
                    {#each legalReps as rep, idx (idx)}
                        <div class='flex items-start gap-3 bg-slate-50 rounded-sm p-3 border border-slate-100'>
                            <div class='h-8 w-8 shrink-0 rounded-full bg-[#336cb2]/15 text-[#336cb2] flex items-center justify-center text-[11px] font-semibold uppercase'>
                                {rep.firstName?.[0] ?? ''}{rep.lastName?.[0] ?? ''}
                            </div>
                            <div class='min-w-0'>
                                <p class='text-[13px] font-semibold text-slate-800'>{rep.firstName} {rep.lastName}</p>
                                <p class='text-[12px] text-slate-500'>{rep.position} · {rep.gender}</p>
                                <p class='text-[12px] text-slate-500'>{rep.email}</p>
                                {#if rep.phone}<p class='text-[12px] text-slate-400'>+250 {rep.phone}</p>{/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <p class='text-[13px] italic text-slate-400'>No legal representatives added</p>
            {/if}
        </div>
    </div>
</div>
