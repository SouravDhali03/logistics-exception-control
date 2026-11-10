import type { IconSvgElement } from "@hugeicons/react";
import {
  Airplane01Icon,
  ShipIcon,
  TruckIcon,
} from "@hugeicons/core-free-icons";

export type RouteMode = "air" | "ocean" | "road";
export type MapCoordinate = { latitude: number; longitude: number };
export type RouteMapData = {
  mode: RouteMode;
  from: { label: string; country: string; coordinate: MapCoordinate };
  to: { label: string; country: string; coordinate: MapCoordinate };
  waypoints?: MapCoordinate[];
};

export const routeModeById: Record<string, RouteMode> = {
  "EXC-2481": "ocean",
  "EXC-2457": "ocean",
  "EXC-2479": "air",
  "EXC-2476": "air",
  "EXC-2471": "ocean",
  "EXC-2468": "road",
  "EXC-2464": "road",
  "EXC-2461": "ocean",
  "EXC-2459": "road",
  "EXC-2458": "road",
  "EXC-2456": "air",
};

export const routeModeIcon: Record<RouteMode, IconSvgElement> = {
  air: Airplane01Icon,
  ocean: ShipIcon,
  road: TruckIcon,
};

export const routeModeLabel: Record<RouteMode, string> = {
  air: "Air freight",
  ocean: "Ocean vessel",
  road: "Road freight",
};

const cityCoordinates: Record<string, MapCoordinate> = {
  Delhi: { latitude: 28.61, longitude: 77.21 },
  Mumbai: { latitude: 19.08, longitude: 72.88 },
  Bengaluru: { latitude: 12.97, longitude: 77.59 },
  Chennai: { latitude: 13.08, longitude: 80.27 },
  Kolkata: { latitude: 22.57, longitude: 88.36 },
  Tokyo: { latitude: 35.68, longitude: 139.69 },
  Seoul: { latitude: 37.57, longitude: 126.98 },
  Shanghai: { latitude: 31.23, longitude: 121.47 },
  "Hong Kong": { latitude: 22.32, longitude: 114.17 },
  Beijing: { latitude: 39.9, longitude: 116.4 },
  Vancouver: { latitude: 49.28, longitude: -123.12 },
  Seattle: { latitude: 47.61, longitude: -122.33 },
  "Long Beach": { latitude: 33.77, longitude: -118.19 },
  "Los Angeles": { latitude: 34.05, longitude: -118.24 },
  Dallas: { latitude: 32.78, longitude: -96.8 },
  Chicago: { latitude: 41.88, longitude: -87.63 },
  Toronto: { latitude: 43.65, longitude: -79.38 },
  Dubai: { latitude: 25.2, longitude: 55.27 },
  Riyadh: { latitude: 24.71, longitude: 46.67 },
  Jeddah: { latitude: 21.49, longitude: 39.19 },
  London: { latitude: 51.51, longitude: -0.13 },
  "New York": { latitude: 40.71, longitude: -74.01 },
  "Mexico City": { latitude: 19.43, longitude: -99.13 },
  "São Paulo": { latitude: -23.55, longitude: -46.63 },
  Rotterdam: { latitude: 51.92, longitude: 4.48 },
  "Rotterdam Port": { latitude: 51.95, longitude: 4.13 },
  "Port of Chicago": { latitude: 41.89, longitude: -87.59 },
  Hamburg: { latitude: 53.55, longitude: 9.99 },
  "Port of Kobe": { latitude: 34.67, longitude: 135.2 },
  Antwerp: { latitude: 51.22, longitude: 4.4 },
  "Port of Long Beach": { latitude: 33.75, longitude: -118.22 },
  "Port of Seattle": { latitude: 47.6, longitude: -122.34 },
  Paris: { latitude: 48.86, longitude: 2.35 },
  Madrid: { latitude: 40.42, longitude: -3.7 },
  Lyon: { latitude: 45.76, longitude: 4.84 },
  Frankfurt: { latitude: 50.11, longitude: 8.68 },
  Prague: { latitude: 50.08, longitude: 14.44 },
  Milan: { latitude: 45.46, longitude: 9.19 },
  Vienna: { latitude: 48.21, longitude: 16.37 },
  Warsaw: { latitude: 52.23, longitude: 21.01 },
  "Yantian Port": { latitude: 22.58, longitude: 114.27 },
  "Busan New Port": { latitude: 35.08, longitude: 129.08 },
  Kobe: { latitude: 34.69, longitude: 135.2 },
  Osaka: { latitude: 34.69, longitude: 135.5 },
  Bangkok: { latitude: 13.76, longitude: 100.5 },
  "Kuala Lumpur": { latitude: 3.14, longitude: 101.69 },
  Jakarta: { latitude: -6.21, longitude: 106.85 },
  Busan: { latitude: 35.18, longitude: 129.08 },
  Shenzhen: { latitude: 22.54, longitude: 114.06 },
  Singapore: { latitude: 1.35, longitude: 103.82 },
  Dhaka: { latitude: 23.81, longitude: 90.41 },
};

export const routeLocationOptions = Object.keys(cityCoordinates);

export const routeMapDataById: Record<string, RouteMapData> = {
  "EXC-2481": {
    mode: "ocean",
    from: { label: "Rotterdam Port", country: "Netherlands", coordinate: { latitude: 51.95, longitude: 4.13 } },
    to: { label: "Port of Chicago", country: "United States", coordinate: { latitude: 41.89, longitude: -87.59 } },
    waypoints: [
      { latitude: 51.2, longitude: -10 },
      { latitude: 44.9, longitude: -30 },
      { latitude: 41.2, longitude: -52 },
      { latitude: 40.4, longitude: -69 },
    ],
  },
  "EXC-2457": {
    mode: "ocean",
    from: { label: "Port of Kobe", country: "Japan", coordinate: { latitude: 34.67, longitude: 135.2 } },
    to: { label: "Rotterdam Port", country: "Netherlands", coordinate: { latitude: 51.95, longitude: 4.13 } },
    waypoints: [
      { latitude: 31, longitude: 128 },
      { latitude: 18, longitude: 112 },
      { latitude: 8, longitude: 94 },
      { latitude: 8, longitude: 67 },
      { latitude: 18, longitude: 42 },
      { latitude: 35, longitude: 18 },
    ],
  },
  "EXC-2471": {
    mode: "ocean",
    from: { label: "Yantian Port", country: "China", coordinate: { latitude: 22.58, longitude: 114.27 } },
    to: { label: "Port of Long Beach", country: "United States", coordinate: { latitude: 33.75, longitude: -118.22 } },
    waypoints: [
      { latitude: 28, longitude: 140 },
      { latitude: 31, longitude: 160 },
      { latitude: 32, longitude: 179 },
      { latitude: 32, longitude: -179 },
      { latitude: 33, longitude: -155 },
      { latitude: 34, longitude: -135 },
    ],
  },
  "EXC-2461": {
    mode: "ocean",
    from: { label: "Busan New Port", country: "South Korea", coordinate: { latitude: 35.08, longitude: 129.08 } },
    to: { label: "Port of Seattle", country: "United States", coordinate: { latitude: 47.6, longitude: -122.34 } },
    waypoints: [
      { latitude: 37, longitude: 150 },
      { latitude: 39, longitude: 171 },
      { latitude: 40, longitude: 179 },
      { latitude: 40, longitude: -179 },
      { latitude: 42, longitude: -155 },
      { latitude: 45, longitude: -135 },
    ],
  },
  "EXC-2479": {
    mode: "air",
    from: { label: "Singapore Changi Airport", country: "Singapore", coordinate: { latitude: 1.3644, longitude: 103.9915 } },
    to: { label: "Frankfurt Airport", country: "Germany", coordinate: { latitude: 50.0379, longitude: 8.5622 } },
  },
  "EXC-2476": {
    mode: "air",
    from: { label: "Hazrat Shahjalal Airport", country: "Bangladesh", coordinate: { latitude: 23.8433, longitude: 90.3978 } },
    to: { label: "Toronto Pearson Airport", country: "Canada", coordinate: { latitude: 43.6777, longitude: -79.6248 } },
  },
  "EXC-2468": {
    mode: "road",
    from: { label: "Hamburg", country: "Germany", coordinate: { latitude: 53.55, longitude: 9.99 } },
    to: { label: "Prague", country: "Czechia", coordinate: { latitude: 50.08, longitude: 14.44 } },
  },
  "EXC-2464": {
    mode: "road",
    from: { label: "Antwerp", country: "Belgium", coordinate: { latitude: 51.22, longitude: 4.4 } },
    to: { label: "Lyon", country: "France", coordinate: { latitude: 45.76, longitude: 4.84 } },
  },
  "EXC-2459": {
    mode: "road",
    from: { label: "Paris", country: "France", coordinate: { latitude: 48.86, longitude: 2.35 } },
    to: { label: "Madrid", country: "Spain", coordinate: { latitude: 40.42, longitude: -3.7 } },
  },
  "EXC-2458": {
    mode: "road",
    from: { label: "Los Angeles", country: "United States", coordinate: { latitude: 34.05, longitude: -118.24 } },
    to: { label: "Dallas", country: "United States", coordinate: { latitude: 32.78, longitude: -96.8 } },
  },
  "EXC-2456": {
    mode: "air",
    from: { label: "Kansai International Airport", country: "Japan", coordinate: { latitude: 34.4347, longitude: 135.244 } },
    to: { label: "Vancouver International Airport", country: "Canada", coordinate: { latitude: 49.1967, longitude: -123.1815 } },
  },
};

export function fallbackRouteMapData(from: string, to: string, mode: RouteMode): RouteMapData {
  return {
    mode,
    from: { label: from, country: "Origin", coordinate: cityCoordinates[from] ?? { latitude: 0, longitude: 0 } },
    to: { label: to, country: "Destination", coordinate: cityCoordinates[to] ?? { latitude: 0, longitude: 0 } },
  };
}

/**
 * Adapts the current fixture shape to the canonical route model used by the UI.
 * An API response that already includes `route` can skip this adapter entirely.
 */
export function resolveRouteData(
  id: string,
  route: string,
  fallbackMode: RouteMode = "road",
): RouteMapData {
  const [from, to] = route.split(" → ");
  return routeMapDataById[id] ?? fallbackRouteMapData(from, to, fallbackMode);
}
