<script lang='ts'>
    import type { Snippet } from 'svelte';
    import * as Sheet from '$lib/components/ui/sheet';
    import { cn } from '$lib/utils';
    import FilterIcon from '@lucide/svelte/icons/filter';

    type BaseProps = {
        children: Snippet;
        sidebarWidth?: number;
        sidebarTitle?: string;
        sidebarClass?: string;
        containerClass?: string;
        onReset?: () => void;
    };

    type WithSidebar = BaseProps & {
        isRightSidebar: true;
        rightSidebarContent: Snippet;
    };

    type WithoutSidebar = BaseProps & {
        isRightSidebar?: false;
        rightSidebarContent?: never;
    };

    type Props = WithSidebar | WithoutSidebar;

    const {
        children,
        isRightSidebar = false,
        rightSidebarContent,
        sidebarWidth = 288,
        sidebarTitle = 'Filters',
        sidebarClass,
        containerClass: containerBgColor = 'bg-white px-4',
        onReset,
    }: Props = $props();

    let isSheetOpen = $state(false);

    export function openSheet() {
        isSheetOpen = true;
    }

    export function closeSheet() {
        isSheetOpen = false;
    }
</script>

<div
    class={cn(
        'flex min-h-screen bg-red-500 {containerBgColor}',
        containerBgColor,
    )}
>
    <!-- Main Content Area -->
    <div
        class={`${isRightSidebar ? `w-[calc(100%-${sidebarWidth}px)]` : 'w-full'} flex-1 flex flex-col overflow-auto`}
    >
        <div class='flex-1 py-6 lg:py-8 lg:px-7'>
            {@render children()}
        </div>
    </div>

    <!-- Desktop Fixed Sidebar -->
    {#if isRightSidebar && rightSidebarContent}
        <aside
            class={cn(
                'hidden lg:flex lg:flex-col border-l bg-[#FAFAFB] border-gray-200 shrink-0',
                sidebarClass,
            )}
            style='width: {sidebarWidth}px'
        >
            <!-- Sidebar Header -->
            <div
                class='flex items-center justify-between px-5 py-4 border-b border-[#DEE1E6]'
            >
                <div class='flex items-center gap-2'>
                    <FilterIcon class='h-4 w-4 text-gray-700' />
                    <span class='text-sm font-semibold text-gray-900'
                    >{sidebarTitle}</span
                    >
                </div>
                {#if onReset}
                    <button
                        type='button'
                        class='text-sm font-medium text-primary hover:text-blue-700 transition-colors'
                        onclick={onReset}
                    >
                        Reset
                    </button>
                {/if}
            </div>

            <!-- Sidebar Content -->
            <div class='flex-1 overflow-auto px-5 py-5'>
                {@render rightSidebarContent()}
            </div>
        </aside>
    {/if}
</div>

<!-- Mobile Sheet/Drawer for Sidebar -->
{#if isRightSidebar && rightSidebarContent}
    <Sheet.Root bind:open={isSheetOpen}>
        <Sheet.Content side='right' class='w-full sm:max-w-[320px] p-0'>
            <Sheet.Header class='px-5 py-4 border-b border-gray-200'>
                <div class='flex items-center justify-between'>
                    <button class='flex items-center gap-2'>
                        <FilterIcon class='h-4 w-4 text-gray-700' />
                        <Sheet.Title class='text-sm font-semibold text-gray-900'
                        >{sidebarTitle}</Sheet.Title
                        >
                    </button>
                    {#if onReset}
                        <button
                            type='button'
                            class='text-sm font-medium text-primary hover:text-blue-700 transition-colors'
                            onclick={onReset}
                        >
                            Reset
                        </button>
                    {/if}
                </div>
            </Sheet.Header>
            <div class='flex-1 overflow-auto px-5 py-5'>
                {@render rightSidebarContent()}
            </div>
        </Sheet.Content>
    </Sheet.Root>
{/if}
