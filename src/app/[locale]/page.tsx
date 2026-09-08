import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HomeClientContent } from "@/components/home/HomeClientContent";
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
			<HomeClientContent locale={locale === "ar" ? "ar" : "en"} />
			<Footer />
		</>
	);
}
