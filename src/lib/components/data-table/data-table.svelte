<script lang="ts" generics="TData, TValue ">
	import {
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type RowSelectionState,
		type SortingState,
		type VisibilityState,
	} from "@tanstack/table-core";
	import { type Snippet } from "svelte";

	import {
		createSvelteTable,
		FlexRender,
	} from "$lib/components/ui/data-table/index.js";
	import * as Table from "$lib/components/ui/table/index.js";

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		footerRow?: Snippet;
		tableRowClick?: (row: TData) => void;
	};

	let {
		data,
		columns,
		footerRow,
		tableRowClick,
	}: DataTableProps<TData, TValue> = $props();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let rowSelection = $state<RowSelectionState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			},
		},
		get columns() {
			return columns;
		},
		getCoreRowModel: getCoreRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: (updater) => {
			if (typeof updater === "function") {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === "function") {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === "function") {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === "function") {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
	});
</script>

<Table.Root>
	<Table.Header class="h-12 border border-[#0000000a] ">
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<Table.Row class=" bg-gray-50  ">
				{#each headerGroup.headers as header (header.id)}
					<Table.Head
						class="text-[#565D6D] font-normal py-2 text-sm  leading-snug wrap-break-word whitespace-normal [&:has([role=checkbox])]:pl-3"
						style={(
							header.column.columnDef.meta as { width: string }
						)?.width
							? `width: ${(header.column.columnDef.meta as { width: string }).width};`
							: undefined}
					>
						{#if !header.isPlaceholder}
							<FlexRender
								content={header.column.columnDef.header}
								context={header.getContext()}
							/>
						{/if}
					</Table.Head>
				{/each}
			</Table.Row>
		{/each}
	</Table.Header>
	<Table.Body
		class="border-collapse border border-[#DEE1E6] text-xs font-medium wrap-break-word"
	>
		{#each table.getRowModel().rows as row (row.id)}
			<Table.Row
				class="h-16 leading-5 border border-[#DEE1E6] text-primary-black font-normal"
				data-state={row.getIsSelected() && "selected"}
				onclick={() => {
					if (
						["INPUT", "BUTTON", "A", "LABEL"].includes(
							document.activeElement?.tagName || "",
						)
					)
						return;
					if (tableRowClick) tableRowClick(row.original);
				}}
			>
				{#each row.getVisibleCells() as cell (cell.id)}
					<Table.Cell class="[&:has([role=checkbox])]:pl-3">
						<FlexRender
							content={cell.column.columnDef.cell}
							context={cell.getContext()}
						/>
					</Table.Cell>
				{/each}
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={columns.length} class="h-24 text-center"
					>No results.</Table.Cell
				>
			</Table.Row>
		{/each}
		{#if footerRow}
			{@render footerRow()}
		{/if}
	</Table.Body>
</Table.Root>
