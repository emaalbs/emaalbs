"use client";

import Image from "next/image";
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
										className="group flex h-24 items-center justify-center rounded-xl border border-[var(--color-line)] bg-[var(--color-warm)] px-5 transition-all hover:-translate-y-0.5 hover:border-[var(--color-gold)] hover:shadow-[0_12px_32px_rgba(238,193,59,0.18)]"
									>
										{s.logo ? (
											<Image
												src={s.logo}
												alt={s.name}
												width={140}
												height={56}
												className="max-h-12 w-auto object-contain opacity-80 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
												unoptimized
											/>
										) : (
											<div className="flex flex-col items-center gap-1">
												<div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-navy)] text-[11px] font-bold text-white">
													{s.name.slice(0, 2).toUpperCase()}
												</div>
												<span className="text-[11px] font-semibold text-[var(--color-slate)]">
													{s.name}
												</span>
											</div>
										)}
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
