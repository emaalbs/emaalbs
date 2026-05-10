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

export default function Home() {
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
				<HomeHighlights />
				<HomeStatsBar />
				<HomeCtaBand />
			</main>
			<Footer />
		</>
	);
}
