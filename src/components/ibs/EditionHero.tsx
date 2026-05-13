"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";

export function EditionHero({ edition }: { edition: IbsEdition }) {
	const { locale, dir } = useI18n();
	const labels = ibsOverview.editions;
	const editionLabels = ibsOverview.editionLabels;
	const isAr = dir === "rtl";

	const statusLabel =
		edition.status === "upcoming"
			? labels.statusUpcoming[locale]
			: edition.status === "live"
			? labels.statusLive[locale]
			: labels.statusPast[locale];
	const statusClass =
		edition.status === "upcoming"
			? "bg-[var(--color-gold)]/15 text-[var(--color-gold)] border-[var(--color-gold)]/40"
			: edition.status === "live"
			? "bg-[var(--color-teal)]/20 text-white border-[var(--color-teal)]"
			: "bg-white/10 text-white/80 border-white/20";

	return (
		<section className="relative isolate overflow-hidden bg-[var(--color-navy-dark)] pt-32 pb-20 lg:pt-40 lg:pb-28 text-white">
			<div className="absolute inset-0 -z-10">
				<Image
					src={edition.heroImage}
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover opacity-30"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-[rgba(1,30,47,0.7)] via-[rgba(1,30,47,0.85)] to-[var(--color-navy-dark)]" />
				<div className="absolute -right-40 top-20 h-[600px] w-[600px] rounded-full bg-[var(--color-teal)]/25 blur-3xl" />
				<div className="absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)]/15 blur-3xl" />
			</div>
			<Container>
				<Link
					href={`/${locale}/ibs`}
					className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-[var(--color-gold)]"
				>
					<ArrowLeft className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} />
					{locale === "ar" ? "كل النسخ" : "All editions"}
				</Link>
				<div className="mt-6 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
					<div className="lg:col-span-8">
						<div className="flex flex-wrap items-center gap-3">
							<span
								className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm ${statusClass}`}
							>
								{statusLabel}
							</span>
							<span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
								{edition.editionLabel[locale]}
							</span>
						</div>
						<h1 className="mt-4 font-display font-bold tracking-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.05]">
							{edition.title[locale]}
						</h1>
						<p className="mt-4 max-w-xl text-[18px] font-medium text-[var(--color-gold)]">
							{edition.tagline[locale]}
						</p>
						<p className="mt-5 max-w-2xl text-[15.5px] leading-[1.7] text-[var(--color-silver)]">
							{edition.summary[locale]}
						</p>
						<div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[13.5px] text-white/80">
							<span className="inline-flex items-center gap-2">
								<Calendar className="h-4 w-4 text-[var(--color-gold)]" />
								{edition.dates[locale]}
							</span>
							<span className="inline-flex items-center gap-2">
								<MapPin className="h-4 w-4 text-[var(--color-gold)]" />
								{edition.location[locale]}
							</span>
						</div>
						{(edition.status === "upcoming" || edition.recapVideo) && (
							<div className="mt-8 flex flex-col gap-3 sm:flex-row">
								{edition.status === "upcoming" ? (
									<Button
										href={edition.registrationUrl ?? "/contact"}
										variant="gold"
										size="lg"
										withArrow
									>
										{editionLabels.register[locale]}
									</Button>
								) : null}
								{edition.recapVideo ? (
									<Button
										href={edition.recapVideo}
										variant="outline-white"
										size="lg"
										external
									>
										{editionLabels.watchRecap[locale]}
									</Button>
								) : null}
							</div>
						)}
					</div>
					<div className="lg:col-span-4">
						<div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
							<Image
								src={edition.heroImage}
								alt={edition.title[locale]}
								fill
								sizes="(min-width: 1024px) 33vw, 100vw"
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
