import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { WhatWeDoContent } from "./WhatWeDoContent";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({
		type: "whatWeDo",
		locale: locale === "ar" ? "ar" : "en",
	});
}

export default async function WhatWeDoPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	return <WhatWeDoContent />;
}
