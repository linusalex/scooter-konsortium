<script lang="ts">
	import type { IconColorType, IconType } from '$lib/interfaces/icons';

	type Props = {
		icon: IconType;
		tooltipText?: string;
		color?: IconColorType;
	};

	let { icon, tooltipText, color }: Props = $props();
</script>

{#if tooltipText === undefined}
	<i class="material-icons {color}">{icon}</i>
{:else}
	<div class="tooltip tooltip-bottom" data-tip={tooltipText}>
		<i class="material-icons {color}">{icon}</i>
	</div>
{/if}
