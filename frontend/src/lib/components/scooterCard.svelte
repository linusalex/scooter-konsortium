<script lang="ts">
  import type { Scooter } from '$lib/interfaces/scooter';
  import { IconColors, Icons } from '$lib/interfaces/icons';
  import Icon from '$lib/components/icon.svelte';
  import type { RouteResponse } from '$lib/interfaces/route';
  import { PUBLIC_GEOAPIFY_API_KEY } from '$env/static/public';

  type Props = {
    scooter: Scooter;
    currentLocation: { latidude: number; longitude: number };
    scooterButtonOnclick?: () => void;
  };

  let { scooter, currentLocation, scooterButtonOnclick }: Props = $props();

  let routeInfo: { distance: string; time: number } | undefined = $state(undefined);
  let routeLoading = $state(false);
  let routeError = $state<string | undefined>(undefined);

  let loading: boolean = $state(false);

  async function getRouteInfo(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ): Promise<{ distance: string; time: number }> {
    const url = new URL('https://api.geoapify.com/v1/routing');

    url.searchParams.set(
      'waypoints',
      `${from.latitude},${from.longitude}|${to.latitude},${to.longitude}`
    );
    url.searchParams.set('mode', 'walk');
    url.searchParams.set('apiKey', PUBLIC_GEOAPIFY_API_KEY);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Routing request failed: ${response.status}`);
    }

    const route: RouteResponse = await response.json();

    const properties = route.features[0].properties;

    const distanceString: string =
      properties.distance < 1000
        ? `${Math.round(properties.distance)} m`
        : `${(properties.distance / 1000).toFixed(1)} km`;

    loading = true;

    return {
      distance: distanceString,
      time: properties.time / 60,
    };
  }

  $effect(() => {
    const latitude = currentLocation?.latidude;
    const longitude = currentLocation?.longitude;
    const scooterLatitude = scooter?.latitude;
    const scooterLongitude = scooter?.longitude;

    if (
      latitude == null ||
      longitude == null ||
      scooterLatitude == null ||
      scooterLongitude == null
    ) {
      return;
    }

    let cancelled = false;

    async function loadRoute() {
      routeLoading = true;
      routeError = undefined;

      try {
        const result = await getRouteInfo(
          {
            latitude,
            longitude,
          },
          {
            latitude: scooterLatitude,
            longitude: scooterLongitude,
          }
        );

        if (!cancelled) {
          routeInfo = result;
        }
      } catch (error) {
        console.error('Could not calculate route:', error);

        if (!cancelled) {
          routeInfo = undefined;
          routeError = 'Route konnte nicht berechnet werden.';
        }
      } finally {
        if (!cancelled) {
          routeLoading = false;
        }
      }
    }

    loadRoute();

    return () => {
      cancelled = true;
    };
  });
</script>

{#if loading}
  <div class="mt-4 shadow-xl p-1 pt-4 px-4 rounded-2xl bg-gray-200/50">
    <div class="flex">
      {#if scooter.soc >= 33}
        <div class="bg-green-600/30 w-fit pt-1 px-1.5 rounded-full">
          <Icon icon={Icons.BOLT} color={IconColors.SUCCESS} />
        </div>
      {:else}
        <div class="bg-red-600/30 w-fit pt-1 px-1.5 rounded-full">
          <Icon icon={Icons.BOLT} color={IconColors.ERROR} />
        </div>
      {/if}

      <div class="pt-1 px-2 font font-bold">Roller #{scooter.id}</div>
      <div class=" ml-auto font-semibold text-sm px-4 pt-2">
        {routeInfo?.distance} •
        {Math.round(routeInfo?.time ?? 0).toFixed(0)} min
      </div>
    </div>
    <div class="flex items-center gap-2 pt-3 pl-1">
      {#if scooter.soc >= 33}
        <progress class="progress progress-success w-full" value={scooter.soc} max="100"></progress>
      {:else}
        <progress class="progress progress-error w-full" value={scooter.soc} max="100"></progress>
      {/if}
      <span class="shrink-0 whitespace-nowrap px-4 font-bold">
        {scooter.soc} %
      </span>
    </div>
    <div class="px-2">
      {#if scooter.soc >= 33}
        <div class="flex items-center gap-2">
          <Icon icon={Icons.ROUTE} />
          <div class="font font-semibold">
            {scooter.distance} km Reichweite
          </div>
          <div class="ml-auto py-2 flex">
            {#if scooterButtonOnclick !== undefined}
              <p class="text-sm py-2.5 font-semibold pr-2">0.12€ / min</p>
              <button
                class="btn"
                onclick={() => {
                  scooterButtonOnclick();
                }}
              >
                Reservieren</button
              >
            {:else}
              <button class="btn"> Reservieren</button>{/if}
          </div>
        </div>
      {:else}
        <div class="flex items-center gap-2">
          <Icon icon={Icons.BATTERY_ALERT} color={IconColors.ERROR} />
          <div class="font font-semibold">
            {scooter.distance} km Reichweite
          </div>
          <div class="ml-auto py-2 flex">
            {#if scooterButtonOnclick !== undefined}
              <p class="text-sm py-2.5 font-semibold pr-2">0.12€ / min</p>
              <button
                class="btn"
                onclick={() => {
                  scooterButtonOnclick();
                }}
              >
                Reservieren</button
              >
            {:else}
              <button class="btn"> Reservieren</button>{/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="p-1 pt-4 px-4">
    <div class="skeleton h-32 w-full rounded-2xl bg-gray-200/50"></div>
  </div>
{/if}
