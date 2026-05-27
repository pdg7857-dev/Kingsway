import type { BusinessSlug } from "@prisma/client";

export const BUSINESSES: Array<{
  slug: BusinessSlug;
  name: string;
  short: string;
  emoji: string;
  href: string;
  dot: string;
}> = [
  { slug: "lexus",        name: "Lexus Sales",        short: "Lexus",       emoji: "🚗", href: "/business/lexus",        dot: "bg-biz-lexus" },
  { slug: "fitness",      name: "Fitness Coaching",   short: "Fitness",     emoji: "🏋️", href: "/business/fitness",      dot: "bg-biz-fitness" },
  { slug: "content",      name: "Social Content",     short: "Content",     emoji: "🎬", href: "/business/content",      dot: "bg-biz-content" },
  { slug: "phone_repair", name: "Phone Repair",       short: "Repair",      emoji: "📱", href: "/business/phone-repair", dot: "bg-biz-phone" },
  { slug: "supplements",  name: "Supplements",        short: "Supplements", emoji: "💊", href: "/business/supplements",  dot: "bg-biz-supplements" },
  { slug: "personal",     name: "Personal",           short: "Personal",    emoji: "👤", href: "/business/personal",     dot: "bg-biz-personal" },
];

export const BUSINESS_BY_SLUG = Object.fromEntries(BUSINESSES.map((b) => [b.slug, b]));
