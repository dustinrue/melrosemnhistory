import { getEntry, render } from 'astro:content';

/** Load one Markdown block from src/content/sections/<id>.md and render it. */
export async function section(id: string) {
  const entry = await getEntry('sections', id);
  if (!entry) throw new Error(`Missing content block src/content/sections/${id}.md`);
  const { Content } = await render(entry);
  return { data: entry.data, Content };
}
