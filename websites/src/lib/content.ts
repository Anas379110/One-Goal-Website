import type { CollectionEntry } from 'astro:content';

/**
 * محتوى "منشور" فعليًا = reviewedBy مملوء (D4 — لا نشر بلا مراجعة بشرية).
 * منطق مركزي واحد بدل تكراره بكل صفحة (وقاية من نسيان الشرط بصفحة جديدة لاحقًا).
 */
export function isPublished(entry: CollectionEntry<'articles'>): boolean {
  return entry.data.reviewedBy.trim() !== '';
}

export function sortByDateDesc(entries: CollectionEntry<'articles'>[]): CollectionEntry<'articles'>[] {
  return [...entries].sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export function relatedArticles(
  all: CollectionEntry<'articles'>[],
  current: CollectionEntry<'articles'>,
  limit = 3
): CollectionEntry<'articles'>[] {
  return all
    .filter((e) => isPublished(e) && e.data.category === current.data.category && e.slug !== current.slug)
    .slice(0, limit);
}
