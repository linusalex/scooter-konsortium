<script lang="ts">
	import { fade } from 'svelte/transition';

	type Props = {
		content: string;
		fadeIn?: number;
		fadeOut?: number;
	};

	let { content, fadeIn = 500, fadeOut = 500 }: Props = $props();
</script>

<div
	role="alert"
	class="alert-soft fixed right-0 bottom-0 left-0 z-100 mx-4 mb-4 alert alert-error"
	in:fade={{ duration: fadeIn }}
	out:fade={{ duration: fadeOut }}
>
	<span>{content}</span>
</div>
