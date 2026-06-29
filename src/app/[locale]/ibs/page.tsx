import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { OverviewHero } from "@/components/ibs/OverviewHero";
import { WhyIbs } from "@/components/ibs/WhyIbs";
import { WhoParticipated } from "@/components/ibs/WhoParticipated";
import { KeySectors } from "@/components/ibs/KeySectors";
import { SponsorshipTiers } from "@/components/ibs/SponsorshipTiers";
import { WhatEnables } from "@/components/ibs/WhatEnables";
import { HousePlatform } from "@/components/ibs/HousePlatform";
import { BeyondASummit } from "@/components/ibs/BeyondASummit";
import { IbsCtaBand } from "@/components/ibs/IbsCtaBand";
import { getEditions } from "@/data/ibs";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({ type: "ibs", locale: locale === "ar" ? "ar" : "en" });
}

export const dynamic = "force-dynamic";

export default async function IbsOverviewPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const editions = await getEditions();
	return (
		<>
			<Header />
			<main>
				<OverviewHero editions={editions} />
				<WhyIbs />
				<WhoParticipated />
				<KeySectors />
				<SponsorshipTiers />
				<WhatEnables />
				<HousePlatform />
				<BeyondASummit />
				<IbsCtaBand />
			</main>
			<Footer />
		</>
	);
}
