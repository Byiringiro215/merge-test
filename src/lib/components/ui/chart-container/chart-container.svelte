<script lang='ts'>
    import type { Snippet } from 'svelte';
    import type { HTMLAttributes } from 'svelte/elements';
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from '$lib/components/ui/card';
    import { cn } from '$lib/utils';
    import { onMount } from 'svelte';

    interface Props extends HTMLAttributes<HTMLDivElement> {
        title?: string;
        description?: string;
        height?: number;
        fillHeight?: boolean;
        cardClass?: string;
        headerClass?: string;
        contentClass?: string;
        chartClass?: string;
        bare?: boolean;
        onResize?: (
            container: HTMLDivElement,
            width: number,
            height: number,
        ) => void;
        action?: Snippet;
        legend?: Snippet;
        children?: Snippet;
    }

    const {
        title,
        description,
        height,
        fillHeight = false,
        cardClass,
        headerClass,
        contentClass,
        chartClass,
        bare = false,
        onResize,
        action,
        legend,
        children,
        class: className,
        ...restProps
    }: Props = $props();

    let containerWidth = $state(0);
    let containerHeight = $state(0);
    let chartContainer = $state<HTMLDivElement>();
    let tooltipEl = $state<HTMLDivElement>();

    export function getContainer() {
        return chartContainer;
    }

    export function getTooltipElement() {
        return tooltipEl;
    }

    export function getDimensions() {
        return { width: containerWidth, height: containerHeight };
    }

    onMount(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                containerWidth = entry.contentRect.width;
                containerHeight = entry.contentRect.height;

                if (chartContainer && onResize) {
                    onResize(chartContainer, containerWidth, containerHeight);
                }
            }
        });

        if (chartContainer) {
            resizeObserver.observe(chartContainer);
        }

        return () => resizeObserver.disconnect();
    });

    $effect(() => {
        if (chartContainer && containerWidth > 0 && onResize) {
            onResize(chartContainer, containerWidth, containerHeight);
        }
    });
</script>

{#snippet Tooltip()}
    <div
        bind:this={tooltipEl}
        class='pointer-events-none absolute z-20 hidden rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg'
    ></div>
{/snippet}

{#if bare}
    <div
        class={cn('flex flex-col', fillHeight && 'h-full', className)}
        {...restProps}
    >
        {#if title || description}
            <div class='mb-4'>
                {#if title}
                    <h3 class='text-lg font-semibold text-primary-black'>
                        {title}
                    </h3>
                {/if}
                {#if description}
                    <p class='mt-1 text-sm text-gray-500'>{description}</p>
                {/if}
            </div>
        {/if}

        <div class={cn('relative', fillHeight ? 'flex-1' : '', chartClass)}>
            <div
                bind:this={chartContainer}
                class='w-full'
                style={height
                    ? `height: ${height}px;`
                    : fillHeight
                    ? 'height: 100%;'
                    : ''}
            >
                {@render children?.()}
            </div>

            {@render Tooltip()}
        </div>

        {#if legend}
            <div class='mt-4'>
                {@render legend()}
            </div>
        {/if}
    </div>
{:else}
    <Card class={cn('h-full bg-transparent shadow-none', cardClass)}>
        {#if title || description || action}
            <CardHeader class={cn('px-0 pt-0 pb-3', headerClass)}>
                <div class='flex items-start justify-between gap-4'>
                    <div class='flex-1'>
                        {#if title}
                            <CardTitle
                                class='text-base font-bold text-gray-900'
                            >
                                {title}
                            </CardTitle>
                        {/if}
                        {#if description}
                            <CardDescription class='text-sm text-gray-500'>
                                {description}
                            </CardDescription>
                        {/if}
                    </div>

                    {#if action}
                        <div class='shrink-0'>
                            {@render action()}
                        </div>
                    {/if}
                </div>
            </CardHeader>
        {/if}

        <CardContent class={cn('px-0 pt-0 pb-0', contentClass)}>
            <div class={cn('relative', fillHeight ? 'flex-1' : '', chartClass)}>
                <div
                    bind:this={chartContainer}
                    class='w-full'
                    style={height
                        ? `height: ${height}px;`
                        : fillHeight
                        ? 'height: 100%;'
                        : ''}
                >
                    {@render children?.()}
                </div>

                {@render Tooltip()}
            </div>

            {#if legend}
                <div
                    class='mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2'
                >
                    {@render legend()}
                </div>
            {/if}
        </CardContent>
    </Card>
{/if}
