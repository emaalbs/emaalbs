"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";

const fadeUp = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.7, ease: "easeOut" },
	viewport: { once: true, amount: 0.2 },
};

export function BlogHero() {
	const { locale } = useI18n();

	const isAr = locale === "ar";

	return (
		<section className="relative isolate flex min-h-[65vh] items-center overflow-hidden bg-[var(--color-navy-dark)] pt-28">
			{/* Background */}
			<div className="absolute inset-0 -z-10">
				<Image
					src="/images/blog-hero.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center blur-[3px]"
				/>

				{/* overlays */}
				<div className="absolute inset-0 bg-gradient-to-b from-[rgba(1,30,47,0.82)] via-[rgba(1,51,77,0.72)] to-[rgba(1,30,47,0.96)]" />

				<div className="absolute inset-0 bg-gradient-to-r from-[rgba(1,30,47,0.78)] via-transparent to-transparent" />

				{/* teal glow */}
				<div className="absolute -left-20 bottom-0 h-[550px] w-[550px] rounded-full bg-[var(--color-teal)]/20 blur-[100px]" />

				<div className="absolute -right-32 top-20 h-[350px] w-[350px] rounded-full bg-[var(--color-teal)]/15 blur-[100px]" />
			</div>

			<Container>
				<motion.div
					{...fadeUp}
					className="mx-auto flex max-w-4xl flex-col items-center py-20 text-center"
				>
					<div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
						<span className="inline-block h-px w-8 bg-[var(--color-teal)]" />

						{isAr ? "المدونة" : "Blog & Insights"}
					</div>

					<h1 className="mt-6 font-display text-[clamp(2.7rem,5vw,5.4rem)] font-bold leading-[1.02] tracking-display text-white">
						{isAr ? "أحدث" : "Latest"}
						<br />

						<span className="text-[var(--color-gold)]">
							{isAr ? "الأخبار والمقالات" : "News & Articles"}
						</span>
					</h1>

					<p className="mt-6 max-w-2xl text-[15px] sm:text-[16px] leading-[1.9] text-[var(--color-silver)]">
						{isAr
							? "استكشف أحدث المقالات والرؤى والاستراتيجيات المتعلقة بالأعمال والاستثمار والتطوير عبر مختلف القطاعات."
							: "Explore the latest articles, insights, and strategies related to business, investment, and development across multiple sectors."}
					</p>

					{/* accent line */}
					<div className="mt-8 h-[2px] w-36 bg-gradient-to-r from-transparent via-[var(--color-teal)] to-transparent" />
				</motion.div>
			</Container>
		</section>
	);
}