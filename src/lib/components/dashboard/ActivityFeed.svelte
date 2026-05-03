<script lang='ts'>

    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from '$lib/components/ui/card';
    import {
        CircleCheck,
        Clock,
        FileText,
        TriangleAlert,
    } from '@lucide/svelte';

    interface Activity {
        id: number;
        type: 'success' | 'info' | 'warning' | 'document';
        message: string;
        time: string;
    }

    const activities: Activity[] = [
        {
            id: 1,
            type: 'success',
            message: 'Q2 Scores uploaded for Software Development (Gasabo)',
            time: '12 minutes ago',
        },
        {
            id: 2,
            type: 'info',
            message: 'New curriculum added for Road Construction trade',
            time: '2 hours ago',
        },
        {
            id: 3,
            type: 'warning',
            message: 'Low attendance alert: Mechanics in Nyamagabe district',
            time: '5 hours ago',
        },
        {
            id: 4,
            type: 'success',
            message: '58 students certified in Tourism trade (Rubavu)',
            time: '1 day ago',
        },
        {
            id: 5,
            type: 'document',
            message: 'District report generated for Kicukiro School Board',
            time: '1 day ago',
        },
    ];

    const iconMap = {
        success: CircleCheck,
        info: Clock,
        warning: TriangleAlert,
        document: FileText,
    };

    const iconColorMap = {
        success: 'text-green-500 bg-green-50',
        info: 'text-blue-500 bg-blue-50',
        warning: 'text-yellow-500 bg-yellow-50',
        document: 'text-gray-500 bg-gray-100',
    };
</script>

<Card class='h-full py-6'>
    <CardHeader class='flex-row w-full! items-center justify-between space-y-0'>
        <CardTitle
            class='text-[18px] font-semibold leading-7 text-primary-black -tracking-[0.45px]'
        >Live System Activity</CardTitle
        >
    </CardHeader>
    <CardContent class='space-y-4'>
        <div class='flex items-center justify-between'>
            <CardDescription
            >Recent data synchronization and trade updates.</CardDescription
            >

            <a
                href='/logs'
                class='text-sm sm:pr-10 font-normal text-secondary hover:text-blue-700'
            >View Log</a
            >
        </div>
        {#each activities as activity, i (i)}
            {@const Icon = iconMap[activity.type]}
            {@const isLast = i === activities.length - 1}
            <div class='flex flex-col items-start gap-3'>
                <div class='flex items-start gap-3'>
                    <div
                        class='flex h-8 w-8 shrink-0 items-center justify-center rounded-full {iconColorMap[
                            activity.type
                        ]}'
                    >
                        <Icon class='h-4 w-4' />
                    </div>
                    <div class='min-w-0 flex-1'>
                        <p class='text-sm text-gray-900 leading-5'>
                            {activity.message}
                        </p>
                        <p class='text-xs text-gray-500 mt-0.5'>
                            {activity.time}
                        </p>
                    </div>
                </div>
                {#if !isLast}
                    <div
                        class='w-full mt-3 sm:mt-4 bg-[#DEE1E6] h-px mr-10'
                    ></div>
                {/if}
            </div>
        {/each}
    </CardContent>
</Card>
