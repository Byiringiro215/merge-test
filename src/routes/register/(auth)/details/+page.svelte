<script lang='ts'>
    import { goto } from '$app/navigation';
    import {
        ChevronDown,
        Mail,
        Phone,
        User,
    } from '@lucide/svelte';
    import { fade, fly } from 'svelte/transition';

    // Form State (Previously Step 3, now Step 4 in the new flow, but let's just keep the UI for now)
    // Form State with Mock Data
    let firstName = $state('Jean');
    let lastName = $state('Ntaganda');
    let position = $state('Director General');
    let gender = $state('Male');
    let email = $state('j.ntaganda@sdms.gov.rw');
    let phoneNumber = $state('0788123456');

    const nextStep = () => {
        goto('/signin');
    };

    const prevStep = () => {
        goto('/register/user');
    };
</script>

<div in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 200 }} class='space-y-8 font-inter'>
    <!-- Step Header -->
    <div class='space-y-3 text-center'>
        <div class='mx-auto flex h-14 w-14 items-center justify-center rounded-md border border-slate-200 text-[#0D2877] font-bold text-xl bg-white '>
            2
        </div>
        <div>
            <h1 class='text-2xl font-semibold text-slate-900'>Institution Details</h1>
            <p class='mt-2 text-sm text-slate-500'>
                Enter the basic identification details of your institution.
            </p>
        </div>
    </div>

    <!-- Form Content -->
    <div class='pt-2'>
        <div class='grid gap-x-4 gap-y-4 md:grid-cols-2'>
            <label class='space-y-2.5 flex flex-col'>
                <span class='text-xs font-medium text-slate-700'>
                    First Name <span class='text-red-500'>*</span>
                </span>
                <div class='relative'>
                    <input
                        bind:value={firstName}
                        class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 placeholder:text-slate-400'
                        placeholder='e.g. John'
                        type='text'
                    />
                    <User class='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none' size={16} />
                </div>
            </label>

            <label class='space-y-2.5 flex flex-col'>
                <span class='text-xs font-medium text-slate-700'>
                    Last Name <span class='text-red-500'>*</span>
                </span>
                <div class='relative'>
                    <input
                        bind:value={lastName}
                        class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 placeholder:text-slate-400'
                        placeholder='e.g. Doe'
                        type='text'
                    />
                    <User class='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none' size={16} />
                </div>
            </label>

            <label class='space-y-2.5 flex flex-col'>
                <span class='text-xs font-medium text-slate-700'>
                    Position in Institution <span class='text-red-500'>*</span>
                </span>
                <div class='relative'>
                    <select
                        bind:value={position}
                        class='w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-400'
                    >
                        <option value='' disabled>Select ...</option>
                        <option value='Director General'>Director General</option>
                        <option value='Principal'>Principal</option>
                        <option value='Legal Advisor'>Legal Advisor</option>
                        <option value='Manager'>Manager</option>
                    </select>
                    <ChevronDown class='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none' size={16} />
                </div>
            </label>

            <label class='space-y-2.5 flex flex-col'>
                <span class='text-xs font-medium text-slate-700'>
                    Gender <span class='text-red-500'>*</span>
                </span>
                <div class='relative'>
                    <select
                        bind:value={gender}
                        class='w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-600'
                    >
                        <option value='' disabled>Select ...</option>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                    </select>
                    <ChevronDown class='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none' size={16} />
                </div>
            </label>

            <label class='space-y-2.5 flex flex-col md:col-span-2'>
                <span class='text-xs font-medium text-slate-700'>
                    Email <span class='text-red-500'>*</span>
                </span>
                <div class='relative'>
                    <input
                        bind:value={email}
                        class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 placeholder:text-slate-400'
                        placeholder='e.g: company@example.com'
                        type='email'
                    />
                    <Mail class='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none' size={16} />
                </div>
            </label>

            <label class='space-y-2.5 flex flex-col md:col-span-2'>
                <span class='text-xs font-medium text-slate-700'>
                    Phone Number <span class='text-red-500'>*</span>
                </span>
                <div class='relative flex rounded-lg border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20'>
                    <div class='flex items-center justify-center border-r border-slate-200 px-3 text-sm text-slate-600 gap-1 cursor-pointer hover:bg-slate-50 transition-colors rounded-l-lg'>
                        +250 <ChevronDown size={14} class='h-3.5 w-3.5 text-slate-400 ml-0.5' />
                    </div>
                    <input
                        bind:value={phoneNumber}
                        class='flex-1 w-full bg-transparent px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400'
                        placeholder='XXX-XXX-XXX'
                    />
                    <div class='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                        <Phone class='h-4 w-4 text-slate-400' size={16} />
                    </div>
                </div>
            </label>
        </div>
    </div>

    <div class='flex items-center gap-4 pt-4'>
        <button
            onclick={prevStep}
            class='flex w-1/3 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600  transition hover:bg-slate-50 h-11 cursor-pointer'
        >
            Back
        </button>
        <button
            onclick={nextStep}
            type='button'
            class='focus-visible:border-ring focus-visible:ring-ring/50 cursor-pointer aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shrink-0 text-sm whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4  px-4 py-2 has-[>svg]:px-3 w-2/3 h-11 bg-[#205FAD] hover:bg-[#1A4B8A] text-white font-medium rounded-lg flex items-center justify-center gap-2 font-inter disabled:opacity-70'
        >
            Continue
        </button>
    </div>

    <div class='flex items-center justify-center pt-2'>
        <button
            type='button'
            class='text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors py-2 px-4 cursor-pointer'
        >
            Save as Draft
        </button>
    </div>
</div>
