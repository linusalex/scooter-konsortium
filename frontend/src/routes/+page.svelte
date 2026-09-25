<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { PUBLIC_GEOAPIFY_API_KEY } from '$env/static/public';
  import { IconColors, Icons } from '$lib/interfaces/icons';
  import Icon from '$lib/components/icon.svelte';
  import ScooterCard from '$lib/components/scooterCard.svelte';
  import { addMarker } from '$lib/marker';
  import type { Scooter } from '$lib/interfaces/scooter';
  import type { RouteResponse } from '$lib/interfaces/route.js';
  import { ThinkingOrb } from 'svelte-thinking-orbs';

  let location: { longitude: number; latitude: number } = $state({ longitude: 0, latitude: 0 });

  let { data } = $props();
  let selectedScooter: Scooter | undefined = $state(undefined);
  let scooterRoute: RouteResponse | undefined = $state(undefined);
  let loading = $state(false);
  let mapElement: HTMLDivElement | undefined = $state();

  let routeApiMode: string | undefined = $state('walk');

  let map: any = null;
  let L: any = null;
  let markers: any = null;
  let routeLayer: any = null;

  let error = '';
  let searchVisibleArea = true;

  function clearMarkers() {
    if (markers) {
      markers.clearLayers();
    }
  }

  async function addExampleMarker() {
    if (!markers) {
      console.error('Cannot add marker: marker layer has not been initialized.');
      return;
    }

    if (location?.latitude == null || location?.longitude == null) {
      console.error('Cannot add marker: location is not available.');
      return;
    }

    const markerData = [
      {
        latitude: location.latitude,
        longitude: location.longitude,
        icon: Icons.LOCATION_ON,
        color: IconColors.BLUE,
      },
    ];

    data.scooters.forEach((el: Scooter) => {
      markerData.push({
        latitude: el.latidude,
        longitude: el.longitude,
        icon: Icons.ELECTRIC_SCOOTER,
        color: IconColors.ERROR,
      });
    });

    for (const data of markerData) {
      const marker = await addMarker(data);
      markers.addLayer(marker);
    }
  }

  function flyToLocation(latitude: number, longitude: number, zoom = 18) {
    if (!map) {
      console.error('Map has not been initialized.');
      return;
    }

    map.flyTo([latitude, longitude], zoom, {
      animate: true,
      duration: 1.5,
    });
  }

  async function initializeMap() {
    if (!mapElement) {
      throw new Error('Map container is not available.');
    }

    if (!L) {
      L = await import('leaflet');
    }

    if (!location) {
      throw new Error('Location is not available.');
    }

    if (map) {
      map.remove();
      map = null;
    }

    map = L.map(mapElement, {
      zoomControl: false,
    }).setView([location.latitude, location.longitude], 18);

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(map);

    L.tileLayer(
      `https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${PUBLIC_GEOAPIFY_API_KEY}`,
      {
        maxZoom: 20,
      }
    ).addTo(map);

    markers = L.layerGroup().addTo(map);

    map.on('moveend', () => {
      searchVisibleArea = true;
    });

    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 100);
  }

  onMount(() => {
    let destroyed = false;

    async function init() {
      loading = true;

      try {
        if (!PUBLIC_GEOAPIFY_API_KEY) {
          throw new Error('Missing PUBLIC_GEOAPIFY_API_KEY. Add it to your .env file.');
        }

        if (!mapElement) {
          throw new Error('Map container was not found in DOM');
        }

        const position = await new Promise<GeolocationPosition>((resolve, object) => {
          navigator.geolocation.getCurrentPosition(resolve, object);
        });
        location = {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        };

        if (destroyed) {
          return;
        }

        console.log(location);

        await initializeMap();

        if (destroyed) {
          return;
        }

        await addExampleMarker();

        if (destroyed) {
          return;
        }
      } catch (err) {
        console.error('Map initialization failed:', err);

        if (err instanceof Error) {
          error = err.message;
        } else {
          error = 'Map could not be initialized.';
        }
      } finally {
        if (!destroyed) {
          loading = false;
        }
      }
    }

    init();

    return () => {
      destroyed = true;

      if (map) {
        map.remove();
        map = null;
      }

      markers = null;
      routeLayer = null;
    };
  });

  async function showRoute(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ) {
    if (!map) {
      console.error('Map has not been initialized.');
      return;
    }

    try {
      loading = true;
      error = '';

      // Remove previous route
      if (routeLayer) {
        map.removeLayer(routeLayer);
        routeLayer = null;
      }

      if (routeApiMode === undefined) {
        return;
      }

      const url = new URL('https://api.geoapify.com/v1/routing');

      url.searchParams.set(
        'waypoints',
        `${from.latitude},${from.longitude}|${to.latitude},${to.longitude}`
      );

      url.searchParams.set('mode', routeApiMode);
      url.searchParams.set('apiKey', PUBLIC_GEOAPIFY_API_KEY);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Routing request failed: ${response.status}`);
      }

      scooterRoute = await response.json();

      routeLayer = L.geoJSON(scooterRoute, {
        style: {
          color: '#2563eb',
          weight: 5,
          opacity: 0.8,
        },
      }).addTo(map);

      map.flyToBounds(routeLayer.getBounds(), {
        padding: [50, 50],
        easeLinearity: 0.25,
        duration: 2,
      });
    } catch (err) {
      console.error(err);
      error = 'Could not calculate route.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Scooter</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<div class="content-start flex w-full px-12 gap-6">
  <div class="flex flex-col h-[80vh] w-[33vw] rounded-2xl p-6 shadow-md">
    <h2 class="mb-4 text-xl font-bold">Verfügbare E-Roller</h2>
    {#each data.scooters as scooter}
      <ScooterCard
        {scooter}
        currentLocation={{ latidude: location?.latitude, longitude: location?.longitude }}
        scooterButtonOnclick={() => {
          console.log('test');
          flyToLocation(scooter.latidude, scooter.longitude, 18);
          selectedScooter = scooter;
        }}
      />
    {/each}

    {#if selectedScooter !== undefined}
      <div class="flex items-end mt-auto p-1 rounded-b-2xl rounded-t-lg shadow-lg bg-gray-200/50">
        <div class="w-fit rounded-b-2xl p-2">
          <div class="flex">
            <div>
              <div class="flex py-4 join">
                <button
                  class={`btn btn-sm rounded-l-2xl ${routeApiMode === 'walk' ? 'bg-red-400' : ''}`}
                  onclick={() => (routeApiMode = 'walk')}
                >
                  <Icon icon={Icons.WALK} />
                </button>

                <button
                  class={`btn btn-sm ${routeApiMode === 'drive' ? 'bg-red-400' : ''}`}
                  onclick={() => (routeApiMode = 'drive')}
                >
                  <Icon icon={Icons.CAR} />
                </button>

                <button
                  class={`btn btn-sm rounded-r-2xl ${routeApiMode === 'bicycle' ? 'bg-red-400' : ''}`}
                  onclick={() => (routeApiMode = 'bicycle')}
                >
                  <Icon icon={Icons.BICYCLE} />
                </button>
                {#if scooterRoute !== undefined}
                  {scooterRoute.features[0].properties.distance / 1000} km
                  {Math.floor(scooterRoute.features[0].properties.time / 60)} min
                {/if}
              </div>

              <div>
                <button
                  class="btn rounded-2xl"
                  onclick={async () => {
                    if (!location) {
                      return;
                    }
                    if (!selectedScooter) {
                      return;
                    }

                    await showRoute(
                      {
                        latitude: location.latitude,
                        longitude: location.longitude,
                      },
                      {
                        latitude: selectedScooter.latidude,
                        longitude: selectedScooter.longitude,
                      }
                    );
                  }}>Route anzeigen</button
                >
                <button class="btn rounded-2xl">Reservieren</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
  <main class="relative w-full">
    <div
      class="h-[80vh] w-full rounded-2xl shadow-lg"
      bind:this={mapElement}
      aria-label="Interactive map"
    ></div>
    {#if loading}
      <div class="absolute inset-0 z-1000 flex items-center justify-center rounded-2xl bg-white/60">
        <div class="flex flex-col items-center gap-3">
          <ThinkingOrb state="connecting" size={78} color="#000000" />
        </div>
      </div>
    {/if}
  </main>
</div>
