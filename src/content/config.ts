import { defineCollection, z } from 'astro:content';

// حسب SRS.md — سبق الاتفاق عليه، لا تُضف حقولًا خارج هذا النطاق بلا تحديث SRS.md أولًا
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // ملاحظة: لا حقل slug هنا — Astro يولّده تلقائيًا من اسم الملف (article.slug)
    publishDate: z.date(),
    category: z.enum(['مباريات', 'أخبار_أندية', 'تحليلات']),
    tags: z.array(z.string()).optional(),
    sources: z.array(z.string()).min(1), // إلزامي — D4/arabic-seo-editorial-policy
    reviewedBy: z.string(), // فارغ = غير جاهز للنشر (يُفحص بـ Hook)
    reviewedAt: z.date().optional(),
    aiGenerated: z.boolean().default(false),
    coverImage: z.string().optional(),
    excerpt: z.string().max(160),
  }),
});

export const collections = { articles };
