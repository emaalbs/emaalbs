"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
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
					src="/images/cta-bg.webp"
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
					<div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-4 py-1.5 text-[13px] font-bold text-[var(--color-gold)] backdrop-blur-sm">
						<Sparkles className="h-3.5 w-3.5" />
						{cta.title[locale]}
					</div>
					<p className="mt-6 max-w-2xl text-[clamp(1.1rem,2vw,1.35rem)] leading-[1.6] text-[var(--color-silver)]">
						{cta.description[locale]}
					</p>
					<div className="mt-10 flex flex-col gap-3 sm:flex-row">
						<Button href={`/${locale}/contact?subject=partner`} variant="gold" size="lg" withArrow>
							{cta.primary[locale]}
						</Button>
						<Button
							href={`/${locale}/contact?subject=interest`}
							variant="outline-white"
							size="lg"
							withArrow
						>
							{cta.secondary[locale]}
						</Button>
					</div>
				</div>
			</Container>
		</section>
	);
}
