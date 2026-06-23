"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import { IbsSectionHeading } from "./IbsSectionHeading";

const TIER_GRID: Record<string, string> = {
	strategic: "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
	platinum: "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
	gold: "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7",
	government: "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7",
};

export function TieredSponsors() {
	const { locale } = useI18n();
	const data = ibsOverview.tieredSponsors;

	const visibleTiers = data.tiers.filter((t) => t.logos.length > 0);
	if (visibleTiers.length === 0) return null;

	return (
		<section className="bg-[var(--color-warm)] py-20 lg:py-24">
			<Container>
				<h2 className="text-center font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-display text-[var(--color-ink)]">
					{locale === "ar" ? "الرعاة" : "Sponsors"}
				</h2>
				<div className="mt-14 flex flex-col gap-10">
					{visibleTiers.map((tier) => {
						const grid = TIER_GRID[tier.id] ?? TIER_GRID.gold;
						return (
							<div key={tier.id}>
								<h3 className="mb-4 text-center text-lg font-bold tracking-wide text-[var(--color-teal)]">
									{tier.name[locale]}
								</h3>
								<div className="rounded-2xl border border-[var(--color-line)] bg-white p-5 sm:p-6">
									<div className={`grid gap-4 ${grid}`}>
										{tier.logos.map((logo, i) => {
											const img = (
												<Image
													key={i}
													src={logo.src}
													alt={logo.alt[locale]}
													width={140}
													height={56}
													className="max-h-11 w-auto object-contain"
													unoptimized
												/>
											);
											return logo.href ? (
												<a
													key={i}
													href={logo.href}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-center"
												>
													{img}
												</a>
											) : (
												<div
													key={i}
													className="flex items-center justify-center"
												>
													{img}
												</div>
											);
										})}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</Container>
		</section>
	);
}
