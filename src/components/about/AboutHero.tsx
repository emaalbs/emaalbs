"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";

export function AboutHero() {
	const { dir, locale, t } = useI18n();
	const isRtl = dir === "rtl";
	const isAr = locale === "ar";

	return (
		<section className="relative isolate flex min-h-[70svh] items-center overflow-hidden bg-[var(--color-navy-dark)] pt-28">
			<div className="absolute inset-0 -z-10">
				<Image
					src="/images/Screenshot 2026-05-06 223809.png"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
				<div className="absolute inset-0 bg-[rgba(1,30,47,0.78)]" />
				<div className="absolute -left-20 top-10 h-[400px] w-[400px] rounded-full bg-[var(--color-teal)]/20 blur-[100px]" />
				<div className="absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-[var(--color-gold)]/10 blur-[100px]" />
			</div>

			<Container>
				<div className="max-w-3xl py-20">
					<div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
						<span className="inline-block h-px w-8 bg-[var(--color-teal)]" />
						{t.aboutp.overline}
					</div>

					<h1
						className={`mt-6 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-bold tracking-display text-white ${
							isAr ? "leading-[1.35]" : "leading-[1.05]"
						}`}
					>
						{t.aboutp.title1}
						<br />
						<span className="text-[var(--color-gold)]">{t.aboutp.title2}</span>
					</h1>

					<p
						className={`mt-6 max-w-2xl border-${
							isRtl ? "r" : "l"
						}-2 border-[var(--color-teal)]/50 ${
							isRtl ? "pr-4 text-right" : "pl-4 text-left"
						} text-[15px] leading-[1.8] text-[var(--color-silver)]`}
					>
						{t.aboutp.description}
					</p>

					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Button href="#contact" variant="gold" withArrow>
							{t.aboutp.contact}
						</Button>
						<Button href="#ventures" variant="outline-teal">
							{t.aboutp.explore}
						</Button>
					</div>
				</div>
			</Container>
		</section>
	);
}
