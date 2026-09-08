import { NextResponse } from "next/server";
import { listBlogs } from "@/lib/db/blogs";
import { listGalleryAlbums } from "@/lib/db/gallery";
import { getHeroCarouselSettings, listHeroSlides } from "@/lib/db/hero-slides";
import { listSocialPosts } from "@/lib/db/social-posts";

export const dynamic = "force-dynamic";

export async function GET() {
	const [blogs, heroSlides, heroSettings, socialPosts, galleryAlbums] = await Promise.all([
		listBlogs(),
		listHeroSlides(),
		getHeroCarouselSettings(),
		listSocialPosts(),
		listGalleryAlbums(),
	]);

	return NextResponse.json({
		blogs: blogs.slice(0, 3).map(({ id, slug, title, image, date }) => ({ id, slug, title, image, date })),
		heroSlides,
		autoplayDelayMs: heroSettings.autoplayDelayMs,
		socialPosts: socialPosts.slice(0, 3),
		galleryAlbums: galleryAlbums.slice(0, 3),
	}, {
		headers: {
			"Cache-Control": "public, max-age=15, s-maxage=60, stale-while-revalidate=300",
		},
	});
}
