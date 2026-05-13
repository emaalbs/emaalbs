"use client";

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";

export function IbsCtaBand() {
	const { locale } = useI18n();
	const cta = ibsOverview.cta;
	return (
		<section className="relative isolate overflow-hidden bg-[var(--color-navy-dark)] py-28 text-white">
			<div className="absolute inset-0 -z-20">
				<Image
					src="/images/cta.JPG"
					alt=""
					fill
					sizes="100vw"
					className="object-cover opacity-25"
				/>
			</div>
			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-[rgba(1,30,47,0.85)] via-[rgba(1,30,47,0.75)] to-[var(--color-navy-dark)]" />
			<div className="absolute -left-32 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-[var(--color-teal)]/25 blur-3xl" />
			<div className="absolute -right-32 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)]/15 blur-3xl" />

			<Container>
				<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)] backdrop-blur-sm">
						<Sparkles className="h-3.5 w-3.5" />
						{cta.overline[locale]}
					</div>
					<h2 className="mt-6 font-display font-bold tracking-display text-white text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.1]">
						{cta.title[locale]}
					</h2>
					<div className="mt-10 flex flex-col gap-3 sm:flex-row">
						<Button href="/contact" variant="gold" size="lg" withArrow>
							{cta.primary[locale]}
						</Button>
						<Button
							href="/contact"
							variant="outline-white"
							size="lg"
							withArrow
						>
							{cta.secondary[locale]}
						</Button>
					</div>
					<div className="mt-10 flex items-center gap-3 text-[12px] text-white/60">
						<span>info@ib_summite.com</span>
						<span className="inline-block h-1 w-1 rounded-full bg-white/40" />
						<a
							href="/contact"
							className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-gold)] transition-colors hover:text-white"
						>
							{locale === "ar" ? "الفريق" : "Talk to the team"}
							<ArrowRight className="h-3 w-3" />
						</a>
					</div>
				</div>
			</Container>
		</section>
	);
}
