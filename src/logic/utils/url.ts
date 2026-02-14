import type { MapConfig } from '../types/game.types';

export function encodeMapToUrl(config: MapConfig): string {
  const json = JSON.stringify(config);
  const encoded = btoa(json);
  const url = new URL(window.location.href);
  url.searchParams.set('map', encoded);
  return url.toString();
}

export function decodeMapFromUrl(): MapConfig | null {
  try {
    const url = new URL(window.location.href);
    const param = url.searchParams.get('map');
    if (!param) return null;
    const json = atob(param);
    return JSON.parse(json) as MapConfig;
  } catch {
    return null;
  }
}
