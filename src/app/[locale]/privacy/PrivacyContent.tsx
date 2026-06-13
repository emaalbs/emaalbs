"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";

const fadeUp = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.7, ease: "easeOut" as const },
	viewport: { once: true, amount: 0.2 },
};

export function PrivacyContent() {
	const { dir, locale } = useI18n();
	const isRtl = dir === "rtl";
	const isAr = locale === "ar";
	const t = useI18n().t.privacy;

	return (
		<main
			dir={isRtl ? "rtl" : "ltr"}
			className={`overflow-hidden bg-white ${isAr ? "font-[var(--font-arabic)]" : ""}`}
		>
			<Header />

			{/* HERO */}
			<section className="relative isolate flex min-h-[50vh] items-center overflow-hidden bg-[var(--color-navy-dark)] pt-28">
				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-[rgba(1,30,47,0.92)]" />
				</div>
				<Container>
					<motion.div
						{...fadeUp}
						className="mx-auto flex max-w-3xl flex-col items-center py-12 text-center"
					>
						<div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
							<span className="inline-block h-px w-8 bg-[var(--color-gold)]/60" />
							{t.overline}
						</div>
						<h1
							className={`mt-5 font-display text-[clamp(2.2rem,4.5vw,4.2rem)] font-bold tracking-display text-white ${isAr ? "leading-[1.35]" : "leading-[1.1]"}`}
						>
							{t.title}
						</h1>
					</motion.div>
				</Container>
			</section>

			{/* CONTENT */}
			<section className="relative bg-white py-20">
				<Container className="flex justify-center">
					<motion.div
						{...fadeUp}
						className="w-full max-w-3xl"
					>
						<div className="space-y-6 text-[15px] leading-[1.8] text-slate-600">
							<p className="font-semibold text-[var(--color-navy-dark)]">
								{t.welcome}
							</p>
							<p>{t.paragraphs[0]}</p>
							<p>{t.paragraphs[1]}</p>
							<p>{t.paragraphs[2]}</p>
							<p>{t.paragraphs[3]}</p>
							<p>{t.paragraphs[4]}</p>
							<p>{t.paragraphs[5]}</p>
							<p className="pt-4 text-sm text-slate-500">
								{t.contactText}{" "}
								<a
									href="mailto:info@emaalbs.com"
									className="text-[var(--color-teal)] hover:underline"
								>
									info@emaalbs.com
								</a>
								.
							</p>
						</div>
					</motion.div>
				</Container>
			</section>

			<Footer />
		</main>
	);
}
