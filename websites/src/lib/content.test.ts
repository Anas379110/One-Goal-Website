import { describe, it, expect } from 'vitest';
import { isPublished, sortByDateDesc, relatedArticles } from './content';
import type { CollectionEntry } from 'astro:content';

// عناصر وهمية بنفس شكل CollectionEntry<'articles'> — كافية لاختبار المنطق دون تشغيل Astro الكامل
function makeEntry(overrides: Partial<CollectionEntry<'articles'>['data']> & { slug?: string }) {
  const { slug = 'test-slug', ...data } = overrides;
  return {
    slug,
    data: {
      title: 'عنوان تجريبي',
      publishDate: new Date('2026-01-01'),
      category: 'مباريات' as const,
      sources: ['مصدر تجريبي'],
      reviewedBy: '',
      aiGenerated: false,
      excerpt: 'ملخص',
      ...data,
    },
  } as unknown as CollectionEntry<'articles'>;
}

describe('isPublished', () => {
  it('يرفض المحتوى بلا reviewedBy (قاعدة D4 الإلزامية)', () => {
    expect(isPublished(makeEntry({ reviewedBy: '' }))).toBe(false);
    expect(isPublished(makeEntry({ reviewedBy: '   ' }))).toBe(false); // مسافات فقط لا تُعتبر مراجعة
  });

  it('يقبل المحتوى عند وجود مراجع فعلي', () => {
    expect(isPublished(makeEntry({ reviewedBy: 'محرر أحمد' }))).toBe(true);
  });
});

describe('sortByDateDesc', () => {
  it('يرتب الأحدث أولًا', () => {
    const old = makeEntry({ slug: 'old', publishDate: new Date('2025-01-01'), reviewedBy: 'x' });
    const recent = makeEntry({ slug: 'recent', publishDate: new Date('2026-06-01'), reviewedBy: 'x' });
    const sorted = sortByDateDesc([old, recent]);
    expect(sorted[0].slug).toBe('recent');
  });

  it('لا يُعدّل المصفوفة الأصلية (immutability)', () => {
    const a = makeEntry({ slug: 'a', publishDate: new Date('2025-01-01'), reviewedBy: 'x' });
    const b = makeEntry({ slug: 'b', publishDate: new Date('2026-01-01'), reviewedBy: 'x' });
    const original = [a, b];
    sortByDateDesc(original);
    expect(original[0].slug).toBe('a'); // لم يتغيّر الترتيب الأصلي
  });
});

describe('relatedArticles', () => {
  it('يستبعد المقال الحالي ويطابق نفس التصنيف فقط', () => {
    const current = makeEntry({ slug: 'current', category: 'مباريات', reviewedBy: 'x' });
    const sameCategory = makeEntry({ slug: 'same-cat', category: 'مباريات', reviewedBy: 'x' });
    const otherCategory = makeEntry({ slug: 'other-cat', category: 'تحليلات', reviewedBy: 'x' });
    const unpublished = makeEntry({ slug: 'unpublished', category: 'مباريات', reviewedBy: '' });

    const result = relatedArticles([current, sameCategory, otherCategory, unpublished], current);

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('same-cat');
  });

  it('يحترم حد limit', () => {
    const current = makeEntry({ slug: 'current', reviewedBy: 'x' });
    const many = Array.from({ length: 5 }, (_, i) => makeEntry({ slug: `s${i}`, reviewedBy: 'x' }));
    expect(relatedArticles([current, ...many], current, 3)).toHaveLength(3);
  });
});
