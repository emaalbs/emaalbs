import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo/site-config";
import { listBlogs } from "@/lib/db/blogs";
import { listEditions } from "@/lib/db/ibs";
import { locales } from "@/i18n/config";

const staticRoutes = [
	"",
	"/about",
	"/contact",
	"/whatWeDo",
	"/news",
	"/ibs",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const base = getBaseUrl();
	const entries: MetadataRoute.Sitemap = [];

	// Static routes for each locale
	for (const locale of locales) {
		for (const route of staticRoutes) {
			entries.push({
				url: `${base}/${locale}${route}`,
				lastModified: new Date(),
				changeFrequency: route === "" ? "daily" : "weekly",
				priority: route === "" ? 1.0 : 0.8,
			});
		}
	}

	// Blog posts
	try {
		const blogs = await listBlogs();
		for (const blog of blogs) {
			for (const locale of locales) {
				entries.push({
					url: `${base}/${locale}/news/${blog.slug}`,
					lastModified: new Date(),
					changeFrequency: "monthly",
					priority: 0.7,
				});
			}
		}
	} catch {
		// ignore
	}

	// IBS editions
	try {
		const editions = await listEditions();
		for (const edition of editions) {
			for (const locale of locales) {
				entries.push({
					url: `${base}/${locale}/ibs/${edition.slug}`,
					lastModified: new Date(),
					changeFrequency: "monthly",
					priority: 0.7,
				});
			}
		}
	} catch {
		// ignore
	}

	return entries;
}
