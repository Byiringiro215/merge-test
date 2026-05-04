<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import DocumentViewerModal from '$lib/components/accreditation/ui/DocumentViewerModal.svelte';
    import {
        AlertTriangle,
        Building2,
        Check,
        ChevronDown,
        ChevronRight,
        Clock,
        Database,
        EllipsisVertical,
        Eye,
        Files,
        Flag,
        Globe,
        Mail,
        Map,
        MapPin,
        Navigation,
        Package,
        Phone,
        Search,
        Ungroup,
        Users,
    } from '@lucide/svelte';

    const {
        activeInternalStep,
        setActiveInternalStep,
        activeTab,
        setActiveTab,
        isEvaluating,
        setIsEvaluating,
        staffAllocationList,
        documentList,
        equipmentList,
        activeMajorStep,
        setActiveMajorStep,
        handleNext,
    } = $props<{
        activeInternalStep: number;
        setActiveInternalStep: (step: number) => void;
        activeTab: string;
        setActiveTab: (tab: string) => void;
        isEvaluating: boolean;
        setIsEvaluating: (evaluating: boolean) => void;
        staffAllocationList: any[];
        documentList: any[];
        equipmentList: any[];
        completedSteps: number[];
        setCompletedSteps: (fn: (prev: number[]) => number[]) => void;
        activeMajorStep: number;
        setActiveMajorStep: (step: number) => void;
        handleNext: () => void;
    }>();

    const tabs = ['General', 'Address', 'Personnel', 'About'];

    let selectedDocument = $state<{ name: string; size: string } | null>(null);
</script>

<div class='flex min-h-0 flex-1 flex-col items-center w-full overflow-y-auto bg-white'>
    {#if activeInternalStep === 0}
        <div class='mx-auto mb-12 mt-8 flex w-full max-w-md items-center gap-4'>
            <button
                onclick={() => {
                    if (activeMajorStep === 3) {
                        setActiveMajorStep(2);
                    }
                    else {
                        setIsEvaluating(false);
                    }
                }}
                class='flex-1 cursor-pointer rounded-sm border border-slate-200 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-50'
            >
                Back
            </button>
            <button
                onclick={handleNext}
                class='bg-primary flex-1 cursor-pointer rounded-sm py-3 text-sm text-white transition-opacity hover:opacity-90'
            >
                {isEvaluating ? 'Next' : 'Start Evaluation'}
            </button>
        </div>

        <div class='mb-4 flex w-full max-w-md justify-between gap-10'>
            {#each tabs as tab}
                <button
                    onclick={() => setActiveTab(tab)}
                    class={cn(
                        'relative py-3 text-sm cursor-pointer transition-all',
                        activeTab === tab ? 'text-[#0A77FF]' : 'text-slate-400 hover:text-slate-600',
                    )}
                >
                    {tab}
                </button>
            {/each}
        </div>

        <div class='mx-auto w-full max-w-md space-y-8 pb-20'>
            {#if activeTab === 'General'}
                <div class='grid grid-cols-1 gap-8'>
                    <div class='space-y-2'>
                        <label for='institution-name' class='text-[13px] text-slate-700'>Name of Institution</label>
                        <div class='relative mt-2'>
                            <input id='institution-name' readonly class='w-full cursor-default rounded-sm border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm text-slate-700 focus:outline-none' value='ETrainer Academy' />
                            <Building2 class='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                        </div>
                    </div>
                    <div class='grid grid-cols-2 gap-4'>
                        <div class='space-y-2 text-left'>
                            <label for='institution-type' class='text-[13px] text-slate-700'>Institution Type</label>
                            <div class='relative mt-2'>
                                <select id='institution-type' disabled class='w-full cursor-default appearance-none rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500'>
                                    <option>Private Vocational Center</option>
                                </select>
                                <ChevronDown class='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                            </div>
                        </div>
                        <div class='space-y-2'>
                            <label for='po-box' class='text-[13px] text-slate-700'>P.O Box</label>
                            <div class='relative mt-2'>
                                <input id='po-box' readonly class='w-full cursor-default rounded-sm border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm text-slate-700 focus:outline-none' value='P.O. Box 1234, Kigali' />
                                <Package class='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                            </div>
                        </div>
                    </div>
                    <div class='space-y-2'>
                        <label for='email-address' class='text-[13px] text-slate-700'>Email Address</label>
                        <div class='relative mt-2'>
                            <input id='email-address' readonly class='w-full cursor-default rounded-sm border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm text-slate-700 focus:outline-none' value='janesmith@example.com' />
                            <Mail class='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                        </div>
                    </div>
                    <div class='space-y-2'>
                        <label for='phone-number' class='text-[13px] text-slate-700'>Phone Number</label>
                        <div class='mt-2 flex'>
                            <div class='relative'>
                                <select id='phone-prefix' disabled class='cursor-default appearance-none rounded-l-sm border border-r-0 border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm text-slate-500'>
                                    <option>+250</option>
                                </select>
                                <ChevronDown class='pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                            </div>
                            <div class='relative flex-1'>
                                <input id='phone-number' readonly class='w-full cursor-default rounded-r-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none' value='791-234-567' />
                                <Phone class='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'Address'}
                <div class='grid grid-cols-1 gap-8'>
                    <div class='grid grid-cols-2 gap-4'>
                        <div class='space-y-2'>
                            <label for='province' class='text-[13px] text-slate-700'>Province</label>
                            <div class='relative mt-2'>
                                <input id='province' readonly class='w-full cursor-default rounded-sm border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm text-slate-700 focus:outline-none' value='Western' />
                                <MapPin class='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                            </div>
                        </div>
                        <div class='space-y-2'>
                            <label for='district' class='text-[13px] text-slate-700'>District</label>
                            <div class='relative mt-2'>
                                <input id='district' readonly class='w-full cursor-default rounded-sm border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm text-slate-700 focus:outline-none' value='Nyabihu' />
                                <Map class='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                            </div>
                        </div>
                    </div>
                    <div class='grid grid-cols-2 gap-4'>
                        <div class='space-y-2'>
                            <label for='sector' class='text-[13px] text-slate-700'>Sector</label>
                            <div class='relative mt-2'>
                                <input id='sector' readonly class='w-full cursor-default rounded-sm border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm text-slate-700 focus:outline-none' value='Mukamira' />
                                <Globe class='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                            </div>
                        </div>
                        <div class='space-y-2'>
                            <label for='cell' class='text-[13px] text-slate-700'>Cell</label>
                            <div class='relative mt-2'>
                                <input id='cell' readonly class='w-full cursor-default rounded-sm border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm text-slate-700 focus:outline-none' value='Mukamira' />
                                <Flag class='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                            </div>
                        </div>
                    </div>
                    <div class='space-y-2'>
                        <label for='village' class='text-[13px] text-slate-700'>Village/City</label>
                        <div class='relative mt-2'>
                            <input id='village' readonly class='w-full cursor-default rounded-sm border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm text-slate-700 focus:outline-none' value='Mukamira Urban' />
                            <MapPin class='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                        </div>
                    </div>
                    <div class='space-y-2'>
                        <label for='address-line' class='text-[13px] text-slate-700'>Address Line</label>
                        <div class='relative mt-2'>
                            <input id='address-line' readonly class='w-full cursor-default rounded-sm border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm text-slate-700 focus:outline-none' value='Mukamira Road, Avenue 4, Plot 12' />
                            <Navigation class='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300' />
                        </div>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'Personnel'}
                <div class='grid w-full grid-cols-1 gap-8'>
                    <div class='overflow-hidden rounded-sm border border-slate-100 bg-white'>
                        <table class='w-full text-left'>
                            <thead>
                                <tr class='border-b border-slate-100'>
                                    <th class='w-10 py-4 pl-6 pr-2'><div class='h-5 w-5 rounded-sm border border-slate-200 bg-white'></div></th>
                                    <th class='py-4 text-[13px] font-normal text-slate-500'>Name</th>
                                    <th class='py-4 text-[13px] font-normal text-slate-500'>Position</th>
                                    <th class='py-4 pr-6 text-[13px] font-normal text-slate-500'>Contact</th>
                                </tr>
                            </thead>
                            <tbody class='divide-y divide-slate-100'>
                                {#each [
                                    { name: 'Natali Craig', gender: 'Female', position: 'Deputy Director', email: 'natali.craig...', phone: '+250 78...' },
                                    { name: 'Drew Cano', gender: 'Male', position: 'Deputy Director', email: 'drew.cano...', phone: '+250 71...' },
                                    { name: 'Natali Craig', gender: 'Female', position: 'Deputy Director', email: 'natali.craig...', phone: '+250 78...' },
                                    { name: 'Drew Cano', gender: 'Male', position: 'Deputy Director', email: 'drew.cano...', phone: '+250 71...' },
                                    { name: 'Natali Craig', gender: 'Female', position: 'Deputy Director', email: 'natali.craig...', phone: '+250 78...' },
                                // eslint-disable-next-line unused-imports/no-unused-vars
                                ] as person, idx}
                                    <tr class='transition-colors hover:bg-slate-50/30'>
                                        <td class='w-10 py-5 pl-6 pr-2'><div class='h-5 w-5 rounded-sm border border-slate-200 bg-white'></div></td>
                                        <td class='py-5'>
                                            <div class='flex items-center gap-4'>
                                                <div class='flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50'>
                                                    <Users class='h-5 w-5 text-slate-400' strokeWidth={1.2} />
                                                </div>
                                                <div class='flex flex-col'>
                                                    <span class='text-sm font-medium leading-tight text-slate-900'>{person.name}</span>
                                                    <span class='text-[12px] text-slate-400'>{person.gender}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class='py-5'><span class='text-[13px] text-slate-500'>{person.position}</span></td>
                                        <td class='py-5 pr-6'>
                                            <div class='flex flex-col text-[13px] text-slate-500'>
                                                <span>{person.email}</span>
                                                <span>{person.phone}</span>
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'About'}
                <div class='grid w-full grid-cols-1 gap-8'>
                    <div class='space-y-4'>
                        <div class='space-y-2'>
                            <label for='institution-mission' class='text-[13px] font-medium text-slate-700'>Institution Mission</label>
                            <textarea id='institution-mission' readonly class='min-h-[100px] w-full cursor-default resize-none rounded-sm border border-slate-200 bg-white px-4 py-4 text-sm leading-relaxed text-slate-600 focus:outline-none'>To provide high-quality technical education and vocational training that meets domestic and international standards, empowering students with the skills needed for the global workforce.</textarea>
                        </div>
                        <div class='space-y-2'>
                            <label for='institution-vision' class='text-[13px] font-medium text-slate-700'>Institution Vision</label>
                            <textarea id='institution-vision' readonly class='min-h-[100px] w-full cursor-default resize-none rounded-sm border border-slate-200 bg-white px-4 py-4 text-sm leading-relaxed text-slate-600 focus:outline-none'>To be a center of excellence in technical innovation and vocational training, recognized for producing highly skilled professionals who drive economic growth and sustainability.</textarea>
                        </div>
                        <div class='space-y-2'>
                            <label for='key-objectives' class='text-[13px] font-medium text-slate-700'>Key Objectives</label>
                            <textarea id='key-objectives' readonly class='min-h-[120px] w-full cursor-default resize-none rounded-sm border border-slate-200 bg-white px-4 py-4 text-sm leading-relaxed text-slate-600 focus:outline-none'>1. Maintain 95% student placement rate within 6 months of graduation. 2. Establish 5+ international industry partnerships annually. 3. Continuously upgrade laboratory and workshop facilities to match current industry technologies.</textarea>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    {#if activeInternalStep !== 0}
        <div class='w-full max-w-4xl px-10 py-12'>
            {#if activeInternalStep === 1}
                <div class='mx-auto flex w-full max-w-4xl flex-col items-center'>
                    <div class='mb-6 flex h-12 w-12 items-center justify-center rounded-sm border border-slate-100'>
                        <Ungroup class='h-6 w-6 text-slate-400' />
                    </div>
                    <h2 class='mb-2 text-xl text-slate-900'>Trade & Module Selected</h2>
                    <p class='mb-8 text-sm text-slate-500'>Select the trade you are applying for accreditation in.</p>

                    <div class='mb-8 flex w-full items-center justify-start gap-4'>
                        <div class='flex items-center gap-2 rounded-sm border border-[#0A77FF] bg-white px-4 py-3 text-[13px] text-[#0A77FF]'>
                            <Ungroup class='h-4 w-4' />
                            Masonry
                            <div class='flex h-4 w-4 items-center justify-center rounded-full bg-green-500'>
                                <ChevronDown class='h-3 w-3 rotate-180 text-white' />
                            </div>
                        </div>
                        <ChevronRight class='h-4 w-4 text-slate-300' />
                        <div class='flex items-center gap-2 rounded-sm border border-[#0A77FF] bg-white px-4 py-3 text-[13px] text-[#0A77FF]'>
                            <Database class='h-4 w-4' />
                            Data Structures & Algorithms
                            <div class='flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white'>✓</div>
                        </div>
                    </div>

                    <div class='mb-12 flex w-full items-center gap-4'>
                        <button onclick={() => setActiveInternalStep(0)} class='flex-1 cursor-pointer rounded-sm border border-slate-200 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-50'>Back</button>
                        <button onclick={handleNext} class='bg-[#0A77FF] flex-1 cursor-pointer rounded-sm py-3 text-sm text-white transition-opacity hover:opacity-90'>Next</button>
                    </div>

                    <div class='w-full space-y-4'>
                        <h3 class='text-sm text-slate-800'>Add Comment (Optional)</h3>
                        <div class='space-y-1'>
                            <label for='comment-input' class='text-[12px] text-slate-500'>Comment Input</label>
                            <div class='relative'>
                                <textarea id='comment-input' placeholder='Text...' class='min-h-[140px] w-full resize-none rounded-sm border border-slate-200 p-4 text-sm transition-all focus:ring-1 focus:ring-[#0A77FF] focus:outline-none'></textarea>
                                <div class='absolute bottom-4 right-4 text-[11px] text-slate-400'>275 characters left</div>
                            </div>
                        </div>
                        <button class='flex cursor-pointer items-center gap-2 rounded-sm bg-[#0A77FF] px-6 py-3 text-sm text-white transition-all hover:opacity-90'>
                            Add Comment
                            <span class='flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm border border-white/50 text-[10px]'>+</span>
                        </button>
                    </div>
                </div>
            {/if}

            {#if activeInternalStep === 2}
                <div class='mx-auto flex w-full max-w-4xl flex-col items-center'>
                    <div class='mb-6 flex h-12 w-12 items-center justify-center rounded-sm border border-slate-100'>
                        <Package class='h-6 w-6 text-slate-400' />
                    </div>
                    <h2 class='mb-2 text-xl text-slate-900'>Equipment & Facilities</h2>
                    <p class='mb-8 px-4 text-center text-sm text-slate-500'>Specify the competencies offered under the selected trade.</p>

                    <div class='mb-8 flex w-full items-center justify-start gap-4'>
                        <div class='flex items-center gap-2 rounded-sm border border-[#0A77FF] bg-white px-4 py-3 text-[13px] text-[#0A77FF]'>
                            <Ungroup class='h-4 w-4' />
                            Masonry
                            <div class='ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500'>
                                <Check class='h-2.5 w-2.5 text-white' strokeWidth={3} />
                            </div>
                        </div>
                    </div>

                    <div class='mb-10 flex w-full items-center gap-4'>
                        <button onclick={() => setActiveInternalStep(1)} class='flex-1 cursor-pointer rounded-sm border border-slate-200 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-50'>Back</button>
                        <button onclick={handleNext} class='bg-[#0A77FF] flex-1 cursor-pointer rounded-sm py-3 text-sm text-white transition-opacity hover:opacity-90'>Continue</button>
                    </div>

                    <div class='w-full space-y-6'>
                        <div class='flex flex-col gap-4'>
                            <span class='text-sm text-slate-600'>{equipmentList.length} equipment</span>
                            <div class='relative'>
                                <input placeholder='Search' class='w-full rounded-sm border border-slate-200 py-3 pl-10 pr-4 text-sm transition-all focus:ring-1 focus:ring-[#0A77FF] focus:outline-none' type='text' />
                                <Search class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                            </div>
                        </div>
                        <div class='space-y-4'>
                            {#each equipmentList as item}
                                <div class='group flex items-center gap-4 rounded-sm border border-slate-100 bg-white p-4 transition-all hover:border-slate-200'>
                                    <div class='flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-slate-100'>
                                        <div class='flex flex-col items-center gap-1 opacity-20'>
                                            <Database class='h-6 w-6' />
                                            <span class='text-[8px] font-bold'>Image</span>
                                        </div>
                                    </div>
                                    <div class='flex-1'>
                                        <h4 class='text-sm text-slate-900'>{item.name}</h4>
                                        <p class='text-xs text-slate-500'>Quantity: {item.quantity}</p>
                                    </div>
                                    <button class='flex h-8 w-8 cursor-pointer items-end justify-center self-end text-slate-400 transition-colors hover:bg-slate-50'>
                                        <Eye class='h-4 w-4' />
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}

            {#if activeInternalStep === 3}
                <div class='mx-auto flex w-full max-w-4xl flex-col items-center'>
                    <div class='mb-6 flex h-12 w-12 items-center justify-center rounded-sm border border-slate-100'>
                        <Files class='h-6 w-6 text-slate-400' />
                    </div>
                    <h2 class='mb-2 text-xl text-slate-900'>Curriculum Documents</h2>
                    <p class='mb-8 px-4 text-center text-sm text-slate-500'>Upload curriculum and training materials.</p>

                    <div class='mb-10 flex w-full items-center gap-4'>
                        <button onclick={() => setActiveInternalStep(2)} class='flex-1 cursor-pointer rounded-sm border border-slate-200 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-50'>Back</button>
                        <button onclick={handleNext} class='bg-[#0A77FF] flex-1 cursor-pointer rounded-sm py-3 text-sm text-white transition-opacity hover:opacity-90'>Continue</button>
                    </div>

                    <div class='w-full overflow-hidden rounded-sm border border-slate-100 bg-white'>
                        <div class='flex items-center justify-between border-b border-slate-100 p-6'>
                            <div>
                                <h3 class='text-sm text-slate-900'>Curriculum Documents</h3>
                                <p class='text-[11px] text-slate-400'>Files and assets attached to this application.</p>
                            </div>
                            <button class='flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-slate-400 transition-colors hover:bg-slate-50'>
                                <EllipsisVertical class='h-4 w-4' />
                            </button>
                        </div>
                        <table class='w-full border-collapse'>
                            <thead>
                                <tr class='border-b border-slate-100 bg-slate-50/50'>
                                    <th class='w-10 p-4 text-center'><div class='mx-auto h-4 w-4 rounded-[3px] border border-slate-200'></div></th>
                                    <th class='px-3 py-3 text-left text-[12px] font-normal text-slate-400'>File name</th>
                                    <th class='w-[120px] px-3 py-3 text-left text-[12px] font-normal text-slate-400'>Action</th>
                                </tr>
                            </thead>
                            <tbody class='divide-y divide-slate-100'>
                                {#each documentList as file}
                                    <tr class='group transition-colors hover:bg-slate-50/30'>
                                        <td class='w-10 p-4 text-center'><div class='mx-auto h-4 w-4 rounded-[3px] border border-slate-200'></div></td>
                                        <td class='px-3 py-3'>
                                            <div class='flex items-center gap-3'>
                                                <div class='relative h-12 w-10 shrink-0'>
                                                    <svg viewBox='0 0 32 40' fill='none' xmlns='http://www.w3.org/2000/svg' class='h-full w-full'>
                                                        <path d='M0 4C0 1.79086 1.79086 0 4 0H22L32 10V36C32 38.2091 30.2091 40 28 40H4C1.79086 40 0 38.2091 0 36V4Z' fill='#E1412E' />
                                                        <path d='M22 0L32 10H26C23.7909 10 22 8.20914 22 6V0Z' fill='white' fill-opacity='0.3' />
                                                        <text x='16' y='30' fill='white' font-size='7' font-weight='900' text-anchor='middle' style='font-family: Inter, sans-serif'>PDF</text>
                                                    </svg>
                                                </div>
                                                <div class='flex flex-col'>
                                                    <span class='line-clamp-1 text-sm text-slate-900'>{file.name}</span>
                                                    <span class='text-[11px] text-slate-400'>{file.size}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class='px-3 py-3'>
                                            <div class='flex items-center gap-3'>
                                                <button class='text-[12px] text-slate-600 transition-colors hover:text-slate-900'>Download</button>
                                                <button
                                                    onclick={() => selectedDocument = file}
                                                    class='cursor-pointer text-[12px] text-[#0A77FF] transition-opacity hover:opacity-80'
                                                >
                                                    Open
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}

            {#if activeInternalStep === 4}
                <div class='mx-auto flex w-full max-w-4xl flex-col items-center'>
                    <div class='mb-6 flex h-12 w-12 items-center justify-center rounded-sm border border-slate-100'>
                        <Users class='h-6 w-6 text-slate-400' />
                    </div>
                    <h2 class='mb-2 text-xl text-slate-900'>Staff Allocation</h2>
                    <p class='mb-8 px-4 text-center text-sm text-slate-500'>Review the staff allocated for this accreditation program.</p>

                    <div class='mb-10 flex w-full items-center gap-4'>
                        <button onclick={() => setActiveInternalStep(3)} class='flex-1 cursor-pointer rounded-sm border border-slate-200 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-50'>Back</button>
                        <button onclick={handleNext} class='bg-[#0A77FF] flex-1 cursor-pointer rounded-sm py-3 text-sm text-white transition-opacity hover:opacity-90'>Finish Evaluation</button>
                    </div>

                    <div class='w-full overflow-hidden rounded-sm border border-slate-100 bg-white'>
                        <table class='w-full border-collapse'>
                            <thead>
                                <tr class='border-b border-slate-100 bg-slate-50/50'>
                                    <th class='w-10 p-4 text-center'><div class='mx-auto h-4 w-4 rounded-[3px] border border-slate-200'></div></th>
                                    <th class='px-3 py-4 text-left text-[11px] font-normal text-slate-400'>Position & Qualification</th>
                                    <th class='px-3 py-4 text-left text-[11px] font-normal text-slate-400'>Count</th>
                                    <th class='px-3 py-4 text-left text-[11px] font-normal text-slate-400'>Status</th>
                                </tr>
                            </thead>
                            <tbody class='divide-y divide-slate-100'>
                                {#each staffAllocationList as item}
                                    <tr class='group transition-colors hover:bg-slate-50/30'>
                                        <td class='w-10 p-4 text-center'><div class='mx-auto h-4 w-4 rounded-[3px] border border-slate-200'></div></td>
                                        <td class='px-3 py-4'>
                                            <div class='flex items-center gap-3'>
                                                <div class='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100'>
                                                    <Users class='h-4 w-4 text-slate-500' />
                                                </div>
                                                <div class='flex flex-col'>
                                                    <span class='text-sm text-slate-900'>{item.position}</span>
                                                    <span class='text-[11px] text-slate-400'>{item.qualification}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class='px-3 py-4 text-sm text-slate-600'>{item.count}</td>
                                        <td class='px-3 py-4'>
                                            {#if item.status === 'Approved'}
                                                <div class='inline-flex items-center gap-1.5 rounded-sm border border-green-100 px-2 py-0.5 text-[10px] text-green-600'>
                                                    Approved <Check class='h-2.5 w-2.5' />
                                                </div>
                                            {:else if item.status === 'Pending'}
                                                <div class='inline-flex items-center gap-1.5 rounded-sm border border-blue-100 px-2 py-0.5 text-[10px] text-blue-600'>
                                                    Pending <Clock class='h-2.5 w-2.5' />
                                                </div>
                                            {:else if item.status === 'Rejected'}
                                                <div class='inline-flex items-center gap-1.5 rounded-sm border border-red-100 px-2 py-0.5 text-[10px] text-red-600'>
                                                    Rejected <AlertTriangle class='h-2.5 w-2.5' />
                                                </div>
                                            {/if}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    {#if selectedDocument}
        <DocumentViewerModal
            documentName={selectedDocument.name}
            documentSize={selectedDocument.size}
            onClose={() => selectedDocument = null}
        />
    {/if}
</div>
