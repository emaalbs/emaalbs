import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
	variable: "--font-montserrat",
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

export const metadata: Metadata = {
	title: "EMAAL Business Space — Building Businesses. Scaling Growth.",
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
		<html lang="en">
			<body className={`${montserrat.variable} ${inter.variable} antialiased bg-warm text-ink`}>
				{children}
			</body>
		</html>
	);
}
