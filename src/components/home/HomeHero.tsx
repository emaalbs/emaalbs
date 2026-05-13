"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";

export function HomeHero() {
	const { t, locale } = useI18n();
	const isAr = locale === "ar";
	return (
		<section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[var(--color-navy-dark)] pt-24">
			{/* Background image */}
			<div className="absolute inset-0 -z-10">
				<Image
					src="/images/hero-summit.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center blur-[3px]"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-[rgba(1,30,47,0.82)] via-[rgba(1,51,77,0.7)] to-[rgba(1,30,47,0.95)]" />
				<div className="absolute inset-0 bg-gradient-to-r from-[rgba(1,30,47,0.75)] via-transparent to-transparent" />
				{/* Teal ambient glow — bottom-left */}
				<div className="absolute -left-20 bottom-0 h-[550px] w-[550px] rounded-full bg-[var(--color-teal)]/25 blur-[100px]" />
				{/* Teal ambient glow — top-right */}
				<div className="absolute -right-32 top-20 h-[350px] w-[350px] rounded-full bg-[var(--color-teal)]/15 blur-[100px]" />
			</div>

			<Container>
				<div className="max-w-3xl py-16">
					<div className="reveal flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
						<span className="inline-block h-px w-8 bg-[var(--color-teal)]" />
						{t.hero.overline}
					</div>

					<h1 className={`reveal mt-6 font-display font-bold tracking-display text-white text-[clamp(1.9rem,4.2vw,3.2rem)] ${isAr ? "leading-[1.35]" : "leading-[1.1]"}`}>
						{t.hero.title[0]}<br />
						<span className="text-[var(--color-gold)] leading-[1.5]">{t.hero.title[1]}</span>
					</h1>

					<p className={`reveal mt-6 max-w-xl border-${isAr ? "r" : "l"}-2 border-[var(--color-teal)]/50 ${isAr ? "pr-4" : "pl-4"} text-[15px] sm:text-[16px] leading-[1.65] text-[var(--color-silver)]`}>
						{t.hero.description}
					</p>

					{/* Teal accent line */}
					<div className={`reveal mt-8 h-[2px] w-32 bg-gradient-to-${isAr ? "l" : "r"} from-[var(--color-teal)] via-[var(--color-teal)]/50 to-transparent`} />

					<div className="reveal mt-6 flex flex-col gap-3 sm:flex-row">
						<Button href="#ibs" variant="gold" size="md" withArrow>
							{t.hero.ctaPrimary}
						</Button>
						<Button href="#group" variant="outline-teal" size="md">
							{t.hero.ctaSecondary}
						</Button>
					</div>
				</div>
			</Container>
		</section>
	);
}
