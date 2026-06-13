import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeTrustStrip } from "@/components/home/HomeTrustStrip";
import { HomeIbsBand } from "@/components/home/HomeIbsBand";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeGroup } from "@/components/home/HomeGroup";
import { HomeWhyEmaal } from "@/components/home/HomeWhyEmaal";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { HomeStatsBar } from "@/components/home/HomeStatsBar";
import { HomeCtaBand } from "@/components/home/HomeCtaBand";
import { listBlogs } from "@/lib/db/blogs";
import { buildMetadata } from "@/lib/seo/metadata";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/structured-data";

type Props = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({ type: "home", locale: locale === "ar" ? "ar" : "en" });
}

export default async function Home({ params }: Props) {
	const { locale } = await params;
	const blogs = await listBlogs();
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify([
						organizationJsonLd(),
						websiteJsonLd(),
					]),
				}}
			/>
			<Header />
			<main>
				<HomeHero />
				<HomeTrustStrip />
				<HomeIbsBand />
				<HomeAbout />
				<HomeServices />
				<HomeGroup />
				<HomeWhyEmaal />
				<HomeHighlights blogs={blogs.slice(0, 3)} locale={locale} />
				<HomeStatsBar />
				<HomeCtaBand />
			</main>
			<Footer />
		</>
	);
}
