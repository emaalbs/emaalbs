import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
	// Serve build-time SSG pages from Cloudflare's read-only static-assets cache.
	// Cache interception avoids loading the full Next.js server for cached pages.
	incrementalCache: staticAssetsIncrementalCache,
	enableCacheInterception: true,
});
