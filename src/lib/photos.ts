import type { ImageMetadata } from 'astro';

const all = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true });

/** Resolve a photo by file name from src/assets/photos/. Fails the build with a clear message if missing. */
export function photo(name: string): ImageMetadata {
  const found = all[`../assets/photos/${name}`];
  if (!found) {
    const available = Object.keys(all).map((k) => k.split('/').pop()).join(', ');
    throw new Error(`Photo "${name}" not found in src/assets/photos/. Available: ${available}`);
  }
  return found.default;
}
