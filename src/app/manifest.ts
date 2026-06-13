import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site-config";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteConfig.name.en,
		short_name: "EMAAL",
		description: siteConfig.description.en,
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#011E2F",
		icons: [
			{
				src: siteConfig.favicon,
				sizes: "any",
				type: "image/svg+xml",
			},
			{
				src: siteConfig.logo,
				sizes: "192x192",
				type: "image/png",
			},
		],
	};
}
