import { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves a root-relative public asset path (e.g. "/properties/x.png")
 * against Vite's configured `base`. Needed because GitHub Pages serves
 * the site from a sub-path (e.g. "/kankoon/"), so a hardcoded leading
 * slash would otherwise point at the domain root and 404.
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}
