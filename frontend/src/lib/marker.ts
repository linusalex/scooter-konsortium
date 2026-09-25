import { mount, unmount } from "svelte";
import Icon from "./components/icon.svelte";

import type { IconColorType, IconType } from "./interfaces/icons";

type AddMarkerOptions = {
  latitude: number;
  longitude: number;
  icon: IconType;
  color?: IconColorType;
  tooltipText?: string;
  popupText?: string;
};

export async function addMarker({
  latitude,
  longitude,
  icon,
  color,
  tooltipText,
  popupText,
}: AddMarkerOptions) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    console.error("Invalid coordinates:", {
      latitude,
      longitude,
    });
    return null;
  }

  const L = await import("leaflet");

  const markerIcon = L.divIcon({
    className: "custom-map-marker",
    html: '<div class="marker-icon"></div>',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  const marker = L.marker([latitude, longitude], {
    icon: markerIcon,
  });

  marker.on("add", () => {
    const element = marker.getElement();

    if (!element) {
      console.error("Could not find Leaflet marker element.");
      return;
    }

    const target = element.querySelector(".marker-icon");

    if (!target) {
      console.error("Could not find .marker-icon element.");
      return;
    }

    const iconInstance = mount(Icon, {
      target,
      props: {
        icon,
        color,
        tooltipText,
      },
    });

    (marker as any).__svelteIcon = iconInstance;
  });

  marker.on("remove", () => {
    const iconInstance = (marker as any).__svelteIcon;

    if (iconInstance) {
      unmount(iconInstance);
      (marker as any).__svelteIcon = undefined;
    }
  });

  if (popupText) {
    marker.bindPopup(popupText);
  }

  return marker;
}
