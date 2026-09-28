<script lang="ts">
  import { Icons } from '$lib/interfaces/icons';
  import type { RentedScooter } from '$lib/interfaces/scooter';
  import Icon from './icon.svelte';

  type Props = {
    scooter: RentedScooter;
  };

  let { scooter }: Props = $props();
  let establishedTime = $state();

  function formatTime(timeStamp: number): string {
    const date = new Date(timeStamp);
    const now = new Date();

    const isYesterday =
      date.getDate() === now.getDate() - 1 &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const time = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return isYesterday
      ? `Gestern, ${time}`
      : `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${time}`;
  }

  $effect(() => {
    establishedTime = ((scooter.toTime as number) - (scooter.fromTime as number)) / 60000;
  });
</script>

{#if Number(scooter.fromTime) <= Date.now() && Date.now() <= Number(scooter.toTime)}
  <div
    class="mt-4 w-full max-w-full overflow-hidden rounded-2xl border border-blue-600 bg-gray-200/50 p-4 shadow-xl"
  >
    <div class="flex min-w-0 items-center">
      <div class="shrink-0 rounded-full bg-blue-300/30 px-1.5 pt-1">
        <Icon icon={Icons.BOLT} color="text-blue-700" />
      </div>
      <div class="min-w-0 truncate px-2 font-bold">Roller #1</div>
      <div
        class="ml-auto shrink-0 rounded-2xl bg-blue-300/30 px-3 py-1 text-sm font-semibold text-blue-700"
      >
        Läuft
      </div>
    </div>
    <div class="mt-4 flex flex-wrap items-end gap-4">
      <!-- Stats -->
      <div class="grid min-w-0 flex-1 grid-cols-3 gap-2 sm:gap-4">
        <div class="min-w-0 font-semibold text-gray-700">
          <div class="truncate text-xs text-gray-500 sm:text-sm">Dauer</div>
          <div class="truncate text-base sm:text-xl">
            {establishedTime} min
          </div>
        </div>
        <div class="min-w-0 font-semibold text-gray-700">
          <div class="truncate text-xs text-gray-500 sm:text-sm">Strecke</div>
          <div class="truncate text-base sm:text-xl">21 km</div>
        </div>

        <div class="min-w-0 font-semibold text-gray-700">
          <div class="truncate text-xs text-gray-500 sm:text-sm">Preis</div>
          <div class="truncate text-base sm:text-xl">
            {scooter.price.toFixed(2)} €
          </div>
        </div>
      </div>
      <button class="btn w-full shrink-0 sm:w-auto"> Fahrt Beenden </button>
    </div>
  </div>
{:else}
  <div
    class="mt-4 w-full max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-200/50 p-4 shadow-xl"
  >
    <div class="flex min-w-0 items-center">
      <div class="shrink-0 rounded-full bg-green-300/30 px-1.5 pt-1">
        <Icon icon={Icons.CHECK} color="text-green-700" />
      </div>
      <div class="min-w-0 truncate px-2 font-bold">Roller #1</div>
      <div
        class="ml-auto max-w-[60%] shrink-0 truncate rounded-2xl bg-green-300/30 px-3 py-1 text-xs font-semibold text-green-700 sm:text-sm"
      >
        {formatTime(Number(scooter.toTime))}
      </div>
    </div>
    <div class="mt-4 flex flex-wrap items-end gap-4">
      <div class="grid min-w-0 flex-1 grid-cols-3 gap-2 sm:gap-4">
        <div class="min-w-0 font-semibold text-gray-700">
          <div class="truncate text-xs text-gray-500 sm:text-sm">Dauer</div>
          <div class="truncate text-base sm:text-xl">
            {establishedTime} min
          </div>
        </div>
        <div class="min-w-0 font-semibold text-gray-700">
          <div class="truncate text-xs text-gray-500 sm:text-sm">Strecke</div>
          <div class="truncate text-base sm:text-xl">8 km</div>
        </div>

        <div class="min-w-0 font-semibold text-gray-700">
          <div class="truncate text-xs text-gray-500 sm:text-sm">Preis</div>
          <div class="truncate text-base sm:text-xl">
            {scooter.price.toFixed(2)} €
          </div>
        </div>
      </div>
      <button class="btn w-full shrink-0 sm:w-auto"> Bezahlt </button>
    </div>
  </div>
{/if}
