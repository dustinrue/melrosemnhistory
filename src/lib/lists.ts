// Research lists: plain text files, one entry per line (src/data/lists/*.txt).
const raw = import.meta.glob<string>('../data/lists/*.txt', { query: '?raw', import: 'default', eager: true });

export function list(name: string): string[] {
  const text = raw[`../data/lists/${name}.txt`];
  if (text === undefined) throw new Error(`Missing list src/data/lists/${name}.txt`);
  const items = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const dupes = items.filter((v, i) => items.indexOf(v) !== i);
  if (dupes.length) throw new Error(`Duplicate entries in ${name}.txt: ${dupes.join('; ')}`);
  return items;
}
