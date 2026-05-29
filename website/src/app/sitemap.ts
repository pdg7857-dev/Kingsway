import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site/config";
import { PLATFORMS } from "@/lib/site/platforms";
import { INDUSTRIES } from "@/lib/site/industries";
import { PROVINCES, STATES } from "@/lib/site/locations";
import { BLOG_TOPICS } from "@/lib/site/blog";
import { RESOURCES } from "@/lib/site/resources";

/**
 * Full XML sitemap for the site. Static cornerstone routes are enumerated by
 * hand with intent-based priorities; dynamic platform/industry/geo/blog/resource
 * routes are generated from the same data files the pages render from, so the
 * sitemap can never drift out of sync with what is actually published.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.domain;
  const now = new Date();

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly",
  ): MetadataRoute.Sitemap[number] => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  // Home + cornerstone pages.
  const cornerstone: MetadataRoute.Sitemap = [
    entry("", 1.0, "weekly"),
    entry("/how-it-works", 0.9, "monthly"),
    entry("/government-opportunity-intelligence", 0.9, "monthly"),
    entry("/pricing", 0.9, "monthly"),
    entry("/platforms", 0.8, "weekly"),
    entry("/industries", 0.8, "weekly"),
    entry("/coverage", 0.7, "weekly"),
    entry("/coverage/canada", 0.7, "weekly"),
    entry("/coverage/usa", 0.7, "weekly"),
  ];

  // Conversion + supporting pages.
  const supporting: MetadataRoute.Sitemap = [
    entry("/book", 0.8, "monthly"),
    entry("/sample-opportunity", 0.8, "monthly"),
    entry("/contact", 0.6, "monthly"),
    entry("/faq", 0.6, "monthly"),
    entry("/about", 0.6, "monthly"),
    entry("/statistics", 0.6, "monthly"),
    entry("/tools/opportunity-cost-calculator", 0.7, "monthly"),
    entry("/resources", 0.7, "weekly"),
    entry("/blog", 0.7, "daily"),
  ];

  // Legal.
  const legal: MetadataRoute.Sitemap = [
    entry("/privacy", 0.3, "yearly"),
    entry("/terms", 0.3, "yearly"),
  ];

  // Dynamic: platforms (0.8) and industries (0.8).
  const platforms: MetadataRoute.Sitemap = PLATFORMS.map((p) =>
    entry(`/platforms/${p.slug}`, 0.8, "monthly"),
  );
  const industries: MetadataRoute.Sitemap = INDUSTRIES.map((i) =>
    entry(`/industries/${i.slug}`, 0.8, "monthly"),
  );

  // Dynamic: geography (0.6).
  const provinces: MetadataRoute.Sitemap = PROVINCES.map((p) =>
    entry(`/coverage/canada/${p.slug}`, 0.6, "monthly"),
  );
  const states: MetadataRoute.Sitemap = STATES.map((s) =>
    entry(`/coverage/usa/${s.slug}`, 0.6, "monthly"),
  );

  // Dynamic: blog (0.6) and resources (0.7).
  const blog: MetadataRoute.Sitemap = BLOG_TOPICS.map((b) =>
    entry(`/blog/${b.slug}`, 0.6, "weekly"),
  );
  const resources: MetadataRoute.Sitemap = RESOURCES.map((r) =>
    entry(`/resources/${r.slug}`, 0.7, "monthly"),
  );

  return [
    ...cornerstone,
    ...supporting,
    ...legal,
    ...platforms,
    ...industries,
    ...provinces,
    ...states,
    ...blog,
    ...resources,
  ];
}
