import { ImageResponse } from "next/og";
import { siteConfig, getBaseUrl } from "@/lib/seo/site-config";

export const runtime = "edge";
export const alt = "EMAAL Business Space";
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const isAr = locale === "ar";

	const title = isAr
		? `${siteConfig.name.ar} — ${siteConfig.tagline.ar}`
		: `${siteConfig.name.en} — ${siteConfig.tagline.en}`;

	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					width: "100%",
					height: "100%",
					backgroundColor: "#011E2F",
					padding: 60,
				}}
			>
				<div
					style={{
						color: "#eec13b",
						fontSize: 24,
						fontWeight: 700,
						marginBottom: 24,
						letterSpacing: "0.15em",
						textTransform: "uppercase",
					}}
				>
					EMAAL BUSINESS SPACE
				</div>
				<div
					style={{
						color: "#ffffff",
						fontSize: 56,
						fontWeight: 800,
						textAlign: "center",
						lineHeight: 1.2,
						maxWidth: 900,
					}}
				>
					{title}
				</div>
				<div
					style={{
						position: "absolute",
						bottom: 48,
						color: "rgba(255,255,255,0.5)",
						fontSize: 20,
					}}
				>
					emaalbs.com
				</div>
			</div>
		),
		{ ...size }
	);
}
