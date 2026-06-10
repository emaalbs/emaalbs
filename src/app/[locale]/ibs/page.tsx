import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { OverviewHero } from "@/components/ibs/OverviewHero";
import { OverviewStatsTeaser } from "@/components/ibs/OverviewStatsTeaser";
import { WhyIbs } from "@/components/ibs/WhyIbs";
import { WhoParticipated } from "@/components/ibs/WhoParticipated";
import { KeySectors } from "@/components/ibs/KeySectors";
import { NotableLeaders } from "@/components/ibs/NotableLeaders";
import { IbsGeneralSponsors } from "@/components/ibs/IbsGeneralSponsors";
import { SponsorshipTiers } from "@/components/ibs/SponsorshipTiers";
import { HousePlatform } from "@/components/ibs/HousePlatform";
import { BeyondASummit } from "@/components/ibs/BeyondASummit";
import { EditionsRail } from "@/components/ibs/EditionsRail";
import { IbsCtaBand } from "@/components/ibs/IbsCtaBand";
import { getEditions } from "@/data/ibs";

export const metadata = {
	title: "Iraq Business Summit (IBS) — by EMAAL",
	description:
		"A high-level platform bringing together government decision-makers, investors, and private sector leaders to enable partnerships, investment, and real business outcomes in Iraq.",
};

export const dynamic = "force-dynamic";

export default async function IbsOverviewPage() {
	const editions = await getEditions();
	return (
		<>
			<Header />
			<main>
				<OverviewHero editions={editions} />
				<OverviewStatsTeaser editions={editions} />
				<WhyIbs />
				<WhoParticipated />
				<KeySectors />
				<NotableLeaders />
				<IbsGeneralSponsors />
				<EditionsRail editions={editions} />
				<SponsorshipTiers />
				<HousePlatform />
				<BeyondASummit />
				<IbsCtaBand />
			</main>
			<Footer />
		</>
	);
}
