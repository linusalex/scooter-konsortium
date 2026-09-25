<script lang="ts">
	import { Icons } from '$lib/interfaces/icons';
	import { slide } from 'svelte/transition';

	type Props = {
		title: string;
		children: any;
	};

	let { title, children }: Props = $props();

	let isOpen = $state(true);

	function toggleAccordion() {
		isOpen = !isOpen;
	}
</script>

<div>
	<button onclick={toggleAccordion} class="flex w-full items-center justify-between pb-3">
		<div class="flex items-center gap-4">
			<!-- <span class="text-xl font-bold">{title}</span> -->

			<div class="transition-transform duration-500" class:rotate-180={isOpen}>
				<i class="material-icons">{Icons.CHEVRON_DOWN}</i>
			</div>
		</div>
	</button>

	{#if isOpen}
		<div transition:slide class="overflow-hidden pt-3">
			{#if children}
				{@render children()}
			{:else}
				<span>No content found</span>
			{/if}
		</div>
	{/if}
</div>
