import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EditionHero } from "@/components/ibs/EditionHero";
import { EditionStats } from "@/components/ibs/EditionStats";
import { EditionThemes } from "@/components/ibs/EditionThemes";
import { EditionSpeakers } from "@/components/ibs/EditionSpeakers";
import { EditionInitiatives } from "@/components/ibs/EditionInitiatives";
import { EditionSectorShares } from "@/components/ibs/EditionSectorShares";
import { EditionSponsors } from "@/components/ibs/EditionSponsors";
import { EditionGallery } from "@/components/ibs/EditionGallery";
import { EditionCtaBand } from "@/components/ibs/EditionCtaBand";
import { getEditionBySlug, getEditions } from "@/data/ibs";
import { locales } from "@/i18n/config";

export async function generateStaticParams() {
	const editions = await getEditions();
	return locales.flatMap((locale) =>
		editions.map((e) => ({ locale, slug: e.slug })),
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	const { slug, locale } = await params;
	const edition = await getEditionBySlug(slug);
	if (!edition) return {};
	const isAr = locale === "ar";
	return {
		title: `${edition.title[isAr ? "ar" : "en"]} — IBS by EMAAL`,
		description: edition.summary[isAr ? "ar" : "en"],
	};
}

export default async function IbsEditionPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	const { slug } = await params;
	const edition = await getEditionBySlug(slug);
	if (!edition) notFound();

	return (
		<>
			<Header />
			<main>
				<EditionHero edition={edition} />
				<EditionStats edition={edition} />
				<EditionThemes edition={edition} />
				<EditionSpeakers edition={edition} />
				<EditionInitiatives edition={edition} />
				<EditionSectorShares edition={edition} />
				<EditionSponsors edition={edition} />
				<EditionGallery edition={edition} />
				<EditionCtaBand edition={edition} />
			</main>
			<Footer />
		</>
	);
}
