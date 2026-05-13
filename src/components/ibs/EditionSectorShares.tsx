"use client";

import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";
import { IbsSectionHeading } from "./IbsSectionHeading";

export function EditionSectorShares({ edition }: { edition: IbsEdition }) {
	const { locale } = useI18n();
	const labels = ibsOverview.editionLabels;
	if (!edition.sectorShares.length) return null;
	return (
		<section className="bg-[var(--color-warm)] py-20 lg:py-24">
			<Container>
				<IbsSectionHeading
					overline={labels.sectorShares[locale]}
					title={
						locale === "ar"
							? "تأثير القطاعات بالأرقام."
							: "Sector influence at a glance."
					}
				/>
				<div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{edition.sectorShares.map((s, i) => (
						<div
							key={i}
							className="rounded-xl border border-[var(--color-line)] bg-white p-5"
						>
							<div className="flex items-baseline justify-between">
								<div className="font-display text-[15px] font-semibold text-[var(--color-ink)]">
									{s.sector[locale]}
								</div>
								<div className="font-numeric text-[18px] font-bold text-[var(--color-gold-deep)]">
									{s.percent}%
								</div>
							</div>
							<div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-line)]">
								<div
									className="h-full rounded-full bg-gradient-to-r from-[var(--color-teal)] to-[var(--color-gold)]"
									style={{ width: `${Math.min(100, s.percent)}%` }}
								/>
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
