"use client";

import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";
import { IbsSectionHeading } from "./IbsSectionHeading";

export function EditionInitiatives({ edition }: { edition: IbsEdition }) {
	const { locale } = useI18n();
	const labels = ibsOverview.editionLabels;
	if (!edition.initiatives.length) return null;
	return (
		<section className="relative bg-[var(--color-navy)] py-20 lg:py-24 text-white">
			<Container>
				<IbsSectionHeading
					tone="dark"
					overline={labels.initiatives[locale]}
					title={
						locale === "ar"
							? "نتائج تتجاوز الكلمات."
							: "Outcomes that move beyond the stage."
					}
				/>
				<div className="mt-12 grid grid-cols-1 gap-6">
					{edition.initiatives.map((init, i) => (
						<div
							key={i}
							className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm lg:grid-cols-12 lg:gap-10 lg:p-9"
						>
							<div className="lg:col-span-7">
								<h3 className="font-display text-xl font-semibold leading-tight text-white sm:text-2xl">
									{init.title[locale]}
								</h3>
								<p className="mt-4 text-[14.5px] leading-[1.7] text-[var(--color-silver)]">
									{init.description[locale]}
								</p>
								{init.partners?.length ? (
									<div className="mt-5 flex flex-wrap gap-2">
										{init.partners.map((p) => (
											<span
												key={p}
												className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[12px] text-white/85"
											>
												{p}
											</span>
										))}
									</div>
								) : null}
							</div>
							{init.highlight ? (
								<div className="lg:col-span-5">
									<div className="h-full rounded-xl border border-[var(--color-gold)]/30 bg-gradient-to-br from-[var(--color-gold)]/15 to-transparent p-6">
										<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
											{locale === "ar" ? "النتيجة" : "Result"}
										</div>
										<div className="mt-3 font-display text-[22px] font-bold leading-tight text-white sm:text-[26px]">
											{init.highlight[locale]}
										</div>
									</div>
								</div>
							) : null}
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
