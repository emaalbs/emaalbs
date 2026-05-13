"use client";

import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition, SponsorTier } from "@/data/ibs/types";
import { IbsSectionHeading } from "./IbsSectionHeading";

const tierOrder: SponsorTier[] = [
	"strategic",
	"platinum",
	"gold",
	"silver",
	"supporting",
];

export function EditionSponsors({ edition }: { edition: IbsEdition }) {
	const { locale } = useI18n();
	const labels = ibsOverview.editionLabels;
	if (!edition.sponsors.length) return null;

	const grouped = tierOrder
		.map((tier) => ({
			tier,
			sponsors: edition.sponsors.filter((s) => s.tier === tier),
		}))
		.filter((g) => g.sponsors.length > 0);

	const tierLabel = (tier: SponsorTier) => {
		const m = {
			strategic: labels.tierStrategic,
			platinum: labels.tierPlatinum,
			gold: labels.tierGold,
			silver: labels.tierSilver,
			supporting: labels.tierSupporting,
		} as const;
		return m[tier][locale];
	};

	return (
		<section className="bg-white py-20 lg:py-24">
			<Container>
				<IbsSectionHeading
					overline={labels.sponsors[locale]}
					title={
						locale === "ar"
							? "الشركاء الذين دعموا القمة."
							: "The partners that backed the platform."
					}
				/>
				<div className="mt-12 space-y-10">
					{grouped.map((g) => (
						<div key={g.tier}>
							<div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-deep)]">
								<span className="inline-block h-px w-8 bg-[var(--color-gold-deep)]" />
								{tierLabel(g.tier)}
							</div>
							<div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
								{g.sponsors.map((s) => (
									<div
										key={s.id}
										className="grid h-24 place-items-center rounded-xl border border-[var(--color-line)] bg-[var(--color-warm)] px-4 text-center"
									>
										<span className="font-display text-sm font-semibold leading-tight text-[var(--color-ink)]">
											{s.name}
										</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
