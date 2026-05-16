"use client";

import { useI18n } from "@/i18n/provider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutWhoWeAre } from "@/components/about/AboutWhoWeAre";
import { AboutVisionMission } from "@/components/about/AboutVisionMission";
import { AboutWhatWeDo } from "@/components/about/AboutWhatWeDo";
import { AboutApproach } from "@/components/about/AboutApproach";
import { AboutVentures } from "@/components/about/AboutVentures";
import { AboutInternational } from "@/components/about/AboutInternational";
import { AboutImpact } from "@/components/about/AboutImpact";

export default function AboutPage() {
	const { dir, locale } = useI18n();
	const isRtl = dir === "rtl";
	const isAr = locale === "ar";

	return (
		<main
			dir={isRtl ? "rtl" : "ltr"}
			className={`bg-white overflow-hidden ${
				isAr ? "font-[var(--font-arabic)]" : ""
			}`}
		>
			<Header />
			<AboutHero />
			<AboutWhoWeAre />
			<AboutVisionMission />
			<AboutWhatWeDo />
			<AboutApproach />
			<AboutVentures />
			<AboutInternational />
			<AboutImpact />
			<Footer />
		</main>
	);
}
