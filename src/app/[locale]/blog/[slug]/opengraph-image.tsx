import { ImageResponse } from "next/og";
import { getBlogBySlug } from "@/lib/db/blogs";
import { siteConfig } from "@/lib/seo/site-config";

export const runtime = "edge";
export const alt = "Blog post";
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
	const { locale, slug } = await params;
	const post = await getBlogBySlug(slug);
	if (!post) {
		return new ImageResponse(
			(
				<div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", backgroundColor: "#011E2F", color: "#ffffff", fontSize: 48 }}>
					{siteConfig.name.en}
				</div>
			),
			{ ...size }
		);
	}

	const isAr = locale === "ar";
	const title = post.title[isAr ? "ar" : "en"];
	const description = post.description[isAr ? "ar" : "en"];

	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
					backgroundColor: "#011E2F",
					padding: 60,
				}}
			>
				<div style={{ color: "#eec13b", fontSize: 18, fontWeight: 700, marginBottom: 20, letterSpacing: "0.15em", textTransform: "uppercase" }}>
					INSIGHTS & BLOG
				</div>
				<div style={{ color: "#ffffff", fontSize: 48, fontWeight: 800, lineHeight: 1.2, maxWidth: 900 }}>
					{title}
				</div>
				<div style={{ color: "rgba(255,255,255,0.7)", fontSize: 24, marginTop: 20, lineHeight: 1.4, maxWidth: 800 }}>
					{description}
				</div>
				<div style={{ position: "absolute", bottom: 48, left: 60, color: "rgba(255,255,255,0.5)", fontSize: 18 }}>
					emaalbs.com
				</div>
			</div>
		),
		{ ...size }
	);
}
