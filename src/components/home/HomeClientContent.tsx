"use client";

import { useEffect, useState } from "react";
import type { Blog } from "@/data/blogs";
import type { GalleryAlbum, GalleryLocale } from "@/data/gallery";
import type { HeroSlide } from "@/data/hero-slides";
import type { SocialPost } from "@/data/social-posts";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeCtaBand } from "@/components/home/HomeCtaBand";
import { HomeGalleryShowcase } from "@/components/home/HomeGalleryShowcase";
import { HomeGroup } from "@/components/home/HomeGroup";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { HomeIbsBand } from "@/components/home/HomeIbsBand";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeSocialPulse } from "@/components/home/HomeSocialPulse";
import { HomeStatsBar } from "@/components/home/HomeStatsBar";
import { HomeTrustStrip } from "@/components/home/HomeTrustStrip";
import { HomeWhyEmaal } from "@/components/home/HomeWhyEmaal";

type HomeBlogSummary = Pick<Blog, "id" | "slug" | "title" | "image" | "date">;

type HomePayload = {
	blogs: HomeBlogSummary[];
	heroSlides: HeroSlide[];
	autoplayDelayMs: number;
	socialPosts: SocialPost[];
	galleryAlbums: GalleryAlbum[];
};

const EMPTY_HOME: HomePayload = {
	blogs: [],
	heroSlides: [],
	autoplayDelayMs: 6500,
	socialPosts: [],
	galleryAlbums: [],
};

export function HomeClientContent({ locale }: { locale: GalleryLocale }) {
	const [data, setData] = useState<HomePayload>(EMPTY_HOME);

	useEffect(() => {
		const controller = new AbortController();
		fetch("/api/home", { signal: controller.signal })
			.then((response) => response.ok ? response.json() as Promise<HomePayload> : Promise.reject(new Error("Homepage data unavailable")))
			.then(setData)
			.catch((error: unknown) => {
				if (!(error instanceof DOMException && error.name === "AbortError")) console.error(error);
			});
		return () => controller.abort();
	}, []);

	return (
		<main>
			<HomeHero slides={data.heroSlides} autoplayDelayMs={data.autoplayDelayMs} />
			<HomeTrustStrip />
			<HomeIbsBand />
			<HomeAbout />
			<HomeServices />
			<HomeGroup />
			<HomeWhyEmaal />
			<HomeHighlights blogs={data.blogs} locale={locale} />
			<HomeGalleryShowcase albums={data.galleryAlbums} locale={locale} />
			<HomeSocialPulse posts={data.socialPosts} locale={locale} />
			<HomeStatsBar />
			<HomeCtaBand />
		</main>
	);
}
