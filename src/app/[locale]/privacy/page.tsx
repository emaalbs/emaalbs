import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { PrivacyContent } from "./PrivacyContent";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({
		type: "privacy",
		locale: locale === "ar" ? "ar" : "en",
	});
}

export default async function PrivacyPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	return <PrivacyContent />;
}
