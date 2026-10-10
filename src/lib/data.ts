// Loads and validates the structured data files in src/data/.
// A malformed edit fails the build with a readable message instead of publishing a broken page.
import { z } from 'astro/zod';
import timelineRaw from '../data/timeline.json';
import membershipRaw from '../data/membership.json';
import boardRaw from '../data/board.json';
import booksRaw from '../data/books.json';
import homeRaw from '../data/home.json';
import pagesRaw from '../data/pages.json';
import galleryRaw from '../data/gallery.json';
import siteRaw from '../data/site.json';

const nonEmpty = z.string().min(1);

export const siteSchema = z.object({
  name: nonEmpty, shortName: nonEmpty, tagline: nonEmpty, affiliation: nonEmpty,
  address1: nonEmpty, city: nonEmpty, phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, 'phone must look like 320-256-3933'),
  email: z.string().email(), facebook: z.string().url(),
  hours: nonEmpty, hoursSeason: nonEmpty, hoursDetail: nonEmpty, hoursNote: nonEmpty,
  mapsUrl: z.string().url(), mapEmbedUrl: z.string().url(),
  admission: z.array(z.object({ label: nonEmpty, price: nonEmpty })).min(1),
  locationNote: nonEmpty, followNote: nonEmpty,
  admissionSummary: z.object({ primary: nonEmpty, secondary: nonEmpty }),
});
siteSchema.parse(siteRaw);

export const timeline = z.array(z.object({ year: nonEmpty, title: nonEmpty, text: nonEmpty })).min(3).parse(timelineRaw);

export const membership = z.object({
  benefits: z.array(nonEmpty).min(1),
  levels: z.array(z.object({
    name: nonEmpty, price: nonEmpty, period: nonEmpty,
    kind: z.enum(['annual', 'giving']), perks: z.array(nonEmpty), featured: z.boolean().default(false),
  })).min(1),
}).parse(membershipRaw);

export const board = z.object({
  officers: z.array(z.object({ role: nonEmpty, name: nonEmpty })),
  directors: z.array(nonEmpty),
}).parse(boardRaw);

export const books = z.array(z.object({ title: nonEmpty, subtitle: z.string() })).parse(booksRaw);

export const home = z.object({
  hero: z.object({ eyebrow: nonEmpty, headline: nonEmpty, lede: nonEmpty, primaryCta: nonEmpty, secondaryCta: nonEmpty }),
  visitCard: z.object({
    hoursSub: nonEmpty, findSub: nonEmpty, callSub: nonEmpty, followText: nonEmpty,
  }),
  intro: z.object({ eyebrow: nonEmpty, heading: nonEmpty, lede: nonEmpty, body: nonEmpty, towns: z.array(nonEmpty).min(1),
    photos: z.array(z.object({ image: nonEmpty, alt: nonEmpty })).length(2) }),
  tiles: z.object({
    heading: nonEmpty, subheading: nonEmpty,
    items: z.array(z.object({ title: nonEmpty, text: nonEmpty, linkLabel: nonEmpty, path: nonEmpty, image: nonEmpty, alt: nonEmpty })).length(3),
  }),
  stories: z.object({
    heading: nonEmpty, subheading: nonEmpty,
    items: z.array(z.object({ title: nonEmpty, text: nonEmpty, path: nonEmpty, image: nonEmpty })).length(3),
  }),
  timeline: z.object({ heading: nonEmpty, subheading: nonEmpty, years: z.array(nonEmpty).min(1), cta: nonEmpty }),
  band: z.object({ heading: nonEmpty, text: nonEmpty, cta: nonEmpty,
    prices: z.array(z.object({ amount: nonEmpty, label: nonEmpty })).min(1) }),
}).parse(homeRaw);

const pageMeta = z.object({ title: nonEmpty, description: nonEmpty, h1: nonEmpty.optional(), lede: z.string().optional() });
export const pages = z.record(pageMeta).parse(pagesRaw);

export const gallery = z.object({
  visit: z.array(z.object({ image: nonEmpty, alt: nonEmpty, caption: nonEmpty })).min(1),
}).parse(galleryRaw);
