"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";
import { IbsSectionHeading } from "./IbsSectionHeading";

export function EditionsRail({ editions }: { editions: IbsEdition[] }) {
	const { locale, dir } = useI18n();
	const t = ibsOverview.editions;
	const isAr = dir === "rtl";

	const statusLabel = (s: string) =>
		s === "upcoming"
			? t.statusUpcoming[locale]
			: s === "live"
			? t.statusLive[locale]
			: t.statusPast[locale];

	const statusClass = (s: string) =>
		s === "upcoming"
			? "bg-[var(--color-gold)]/15 text-[var(--color-gold-deep)] border-[var(--color-gold)]/30"
			: s === "live"
			? "bg-[var(--color-teal)]/15 text-[var(--color-teal)] border-[var(--color-teal)]/30"
			: "bg-[var(--color-line)] text-[var(--color-slate)] border-[var(--color-line)]";

	return (
		<section className="bg-white py-20 lg:py-28">
			<Container>
				<IbsSectionHeading
					overline={t.overline[locale]}
					title={t.title[locale]}
					description={t.description[locale]}
				/>
				<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{editions.map((e) => (
						<Link
							key={e.slug}
							href={`/${locale}/ibs/${e.slug}`}
							className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-warm)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-navy)] hover:shadow-[0_18px_44px_rgba(1,51,77,0.15)]"
						>
							<div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-navy-dark)]">
								<Image
									src={e.heroImage}
									alt={e.title[locale]}
									fill
									sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
									className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.7)] via-transparent to-transparent" />
								<div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
									<span
										className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm ${statusClass(
											e.status,
										)}`}
									>
										{statusLabel(e.status)}
									</span>
									<span className="font-numeric rounded-full bg-white/90 px-3 py-1 text-[12px] font-bold text-[var(--color-navy)]">
										{e.year}
									</span>
								</div>
							</div>
							<div className="flex flex-1 flex-col p-6">
								<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-deep)]">
									{e.editionLabel[locale]}
								</div>
								<h3 className="mt-2 font-display text-xl font-bold leading-tight text-[var(--color-ink)]">
									{e.title[locale]}
								</h3>
								<p className="mt-3 line-clamp-3 text-[14px] leading-[1.6] text-[var(--color-slate)]">
									{e.tagline[locale]}
								</p>
								<div className="mt-5 flex items-center justify-between border-t border-[var(--color-line)] pt-4 text-[12px] text-[var(--color-slate)]">
									<span>{e.dates[locale]}</span>
									<span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-navy)] transition-colors group-hover:text-[var(--color-gold-deep)]">
										{t.viewEdition[locale]}
										<ArrowRight
											className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 ${
												isAr ? "rotate-180 group-hover:-translate-x-0.5" : ""
											}`}
										/>
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			</Container>
		</section>
	);
}
