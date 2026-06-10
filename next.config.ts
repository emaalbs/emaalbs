import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: {
		resolveAlias: {
			tailwindcss: "./node_modules/tailwindcss/index.css",
		},
	},
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "randomuser.me" },
			{ protocol: "https", hostname: "i.pravatar.cc" },
			{ protocol: "https", hostname: "images.unsplash.com" },
		],
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
