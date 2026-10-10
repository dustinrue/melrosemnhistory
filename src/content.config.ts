import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per collection story (src/content/stories/*.md).
const stories = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string().min(1),
    order: z.number().int().positive(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageCaption: z.string().optional(),
    image2: z.string().optional(),
    image2Alt: z.string().optional(),
  }).refine((s) => !s.image || s.imageAlt, { message: 'imageAlt is required when image is set (accessibility)', path: ['imageAlt'] })
    .refine((s) => !s.image2 || s.image2Alt, { message: 'image2Alt is required when image2 is set', path: ['image2Alt'] }),
});

// Prose blocks used by individual pages (src/content/sections/*.md).
const sections = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/sections' }),
  schema: z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageCaption: z.string().optional(),
  }).refine((s) => !s.image || s.imageAlt, { message: 'imageAlt is required when image is set (accessibility)', path: ['imageAlt'] }),
});

export const collections = { stories, sections };
