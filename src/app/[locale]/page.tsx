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

type Props = {
	params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
	const { locale } = await params;
	const blogs = await listBlogs();
	return (
		<>
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
