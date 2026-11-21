import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.zhibeimao.com';
  // Include only public, canonical, standalone pages.
  return [
    { url: base + '/', changeFrequency: 'daily', priority: 1 },
    { url: base + '/api', changeFrequency: 'daily', priority: 0.9 },
    { url: base + '/api/docs', changeFrequency: 'monthly', priority: 0.75 },
    { url: base + '/about', changeFrequency: 'monthly', priority: 0.5 }
  ];
}
