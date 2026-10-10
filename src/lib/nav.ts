// Main navigation. Changing this changes the site's structure, so treat it as a design change.
export const nav = [
  { key: 'visit', label: 'Visit', path: 'visit/' },
  { key: 'collections', label: 'Collections', path: 'collections/' },
  { key: 'research', label: 'Research', path: 'research/' },
  { key: 'involved', label: 'Get Involved', path: 'get-involved/' },
  { key: 'about', label: 'About', path: 'about/' },
] as const;

export type NavKey = (typeof nav)[number]['key'];
export const joinPath = 'get-involved/#membership';
