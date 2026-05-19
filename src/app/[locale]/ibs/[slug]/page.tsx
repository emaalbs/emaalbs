import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { EditionHero } from "@/components/ibs/EditionHero";
import { EditionStats } from "@/components/ibs/EditionStats";
import { EditionThemes } from "@/components/ibs/EditionThemes";
import { EditionSpeakers } from "@/components/ibs/EditionSpeakers";
import { EditionInitiatives } from "@/components/ibs/EditionInitiatives";
import { EditionSectorShares } from "@/components/ibs/EditionSectorShares";
import { EditionAgenda } from "@/components/ibs/EditionAgenda";
import { EditionSponsors } from "@/components/ibs/EditionSponsors";
import { EditionGallery } from "@/components/ibs/EditionGallery";
import { EditionCtaBand } from "@/components/ibs/EditionCtaBand";
import { EditionQuickNav } from "@/components/ibs/EditionQuickNav";
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
	const { slug, locale } = await params;
	const edition = await getEditionBySlug(slug);
	if (!edition) notFound();

	const currentLocale = locale === "ar" ? "ar" : "en";

	return (
		<>
			<Header />
			<main>
				<EditionHero edition={edition} />
				<EditionStats edition={edition} />
				<section id="themes">
					<EditionThemes edition={edition} />
				</section>
				<section id="agenda">
					<EditionAgenda edition={edition} />
				</section>
				<section id="speakers">
					<EditionSpeakers edition={edition} />
				</section>
				<section id="initiatives">
					<EditionInitiatives edition={edition} />
				</section>
				<EditionSectorShares edition={edition} />
				<section id="sponsors">
					<EditionSponsors edition={edition} />
				</section>
				<section id="gallery">
					<EditionGallery edition={edition} />
				</section>
				<EditionCtaBand edition={edition} />
			</main>
			<EditionQuickNav locale={currentLocale} />
			<Footer />
		</>
	);
}
