<script lang="ts">
  import RentedScooter from '$lib/components/rentedScooter.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Scooter | Account</title>
</svelte:head>

<div class="px-12">
  <div class="flex flex-col h-[80vh] w-[28vw] rounded-2xl p-6 shadow-md">
    {#each data.rentedScooter as scooter}
      <RentedScooter {scooter} />
    {/each}
  </div>
</div>
