import type { Metadata } from "next";

import {
	Plus_Jakarta_Sans,
	Inter,
	Noto_Sans_Arabic,
} from "next/font/google";

import "./globals.css";

import { I18nProvider } from "@/i18n/provider";

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: "--font-jakarta",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	display: "swap",
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
	variable: "--font-arabic",
	subsets: ["arabic"],
	weight: ["400", "500", "600", "700", "800"],
	display: "swap",
});

export const metadata: Metadata = {
	title:
		"EMAAL Business Space — Building Businesses. Scaling Growth.",
	description:
		"EMAAL Business Space is a business platform builder and investment-driven group operating across Iraq and the region. Home of the Iraq Business Summit (IBS).",
	icons: {
		icon: "/favicon.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			data-scroll-behavior="smooth"
		>
			<body
				suppressHydrationWarning
				className={`${plusJakartaSans.variable} ${inter.variable} ${notoSansArabic.variable} antialiased bg-warm text-ink`}
			>
				<I18nProvider>
					{children}
				</I18nProvider>
			</body>
		</html>
	);
}