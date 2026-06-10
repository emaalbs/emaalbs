"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";

export function EditionCtaBand({ edition, allEditions }: { edition: IbsEdition; allEditions: IbsEdition[] }) {
	const { locale, dir } = useI18n();
	const labels = ibsOverview.editionLabels;
	const isAr = dir === "rtl";
	const next = edition.nextEditionSlug
		? allEditions.find((e) => e.slug === edition.nextEditionSlug)
		: undefined;

	return (
		<section className="relative isolate overflow-hidden bg-[var(--color-navy-dark)] py-20 lg:py-24 text-white">
			<div className="absolute inset-0 -z-10">
				<div className="absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-[var(--color-teal)]/25 blur-3xl" />
				<div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[var(--color-gold)]/15 blur-3xl" />
			</div>
			<Container>
				<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
					<div className="lg:col-span-7">
						<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
							{labels.joinNext[locale]}
						</div>
						<h2 className="mt-4 font-display font-bold tracking-display text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.15]">
							{next
								? next.title[locale]
								: locale === "ar"
								? "كن جزءاً من النسخة القادمة."
								: "Be part of the next edition."}
						</h2>
						<p className="mt-4 max-w-xl text-[15px] leading-[1.7] text-[var(--color-silver)]">
							{next
								? next.tagline[locale]
								: locale === "ar"
								? "تابعنا للتسجيل والمشاركة."
								: "Stay close — registration opens soon."}
						</p>
					</div>
					<div className="lg:col-span-5">
						<div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
							<Button href="/contact" variant="gold" size="lg" withArrow>
								{labels.register[locale]}
							</Button>
							{next ? (
								<Link
									href={`/${locale}/ibs/${next.slug}`}
									className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
								>
									{ibsOverview.editions.viewEdition[locale]}
									<ArrowRight
										className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`}
									/>
								</Link>
							) : null}
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
