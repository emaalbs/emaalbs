export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
import { buildMetadata } from "@/lib/seo/metadata";
import { eventJsonLd } from "@/lib/seo/structured-data";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
	const { slug, locale } = await params;
	const edition = await getEditionBySlug(slug);
	if (!edition) return {};
	const isAr = locale === "ar";
	return buildMetadata({
		type: "ibsEdition",
		locale: isAr ? "ar" : "en",
		slug,
		title: edition.title[isAr ? "ar" : "en"],
		description: edition.summary[isAr ? "ar" : "en"],
		image: edition.heroImage,
	});
}

export default async function IbsEditionPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	const { slug, locale } = await params;
	const [edition, allEditions] = await Promise.all([
		getEditionBySlug(slug),
		getEditions(),
	]);
	if (!edition) notFound();

	const currentLocale = locale === "ar" ? "ar" : "en";

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						eventJsonLd({
							title: edition.title[currentLocale],
							description: edition.summary[currentLocale],
							image: edition.heroImage,
							startDate: edition.dates?.en,
							location: edition.location?.[currentLocale],
							slug,
							locale: currentLocale,
						})
					),
				}}
			/>
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
				<EditionCtaBand edition={edition} allEditions={allEditions} />
			</main>
			<EditionQuickNav locale={currentLocale} />
			<Footer />
		</>
	);
}
