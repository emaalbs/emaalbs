import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getBaseUrl } from "@/lib/seo/site-config";

export default async function robots(): Promise<MetadataRoute.Robots> {
	const requestHeaders = await headers();
	const hostname = requestHeaders.get("host")?.split(":")[0].toLowerCase() ?? "";
	const isPreview = hostname.startsWith("emmal-social-preview.");

	if (isPreview) {
		return {
			rules: {
				userAgent: "*",
				disallow: "/",
			},
		};
	}

	const base = getBaseUrl();
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin", "/api"],
			},
		],
		sitemap: `${base}/sitemap.xml`,
	};
}
