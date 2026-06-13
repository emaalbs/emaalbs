"use client";

import { useState } from "react";
import { Award, Check, Crown, Gem, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import { IbsSectionHeading } from "./IbsSectionHeading";

const TIER_ICONS: Record<string, LucideIcon> = {
	strategic: Crown,
	platinum: Gem,
	gold: Award,
	silver: Star,
};

export function SponsorshipTiers() {
	const { locale } = useI18n();
	const sponsorship = ibsOverview.sponsorship;
	const [active, setActive] = useState(0);
	const pkg = sponsorship.packages[active];
	const ActiveIcon = TIER_ICONS[pkg.id] ?? Star;

	return (
		<section className="relative bg-[var(--color-navy-dark)] py-24 lg:py-28 text-white">
			<div className="absolute inset-0 -z-10 opacity-50">
				<div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)]/15 blur-3xl" />
				<div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[var(--color-teal)]/20 blur-3xl" />
			</div>
			<Container>
				<IbsSectionHeading
					tone="dark"
					overline={sponsorship.overline[locale]}
					title={sponsorship.title[locale]}
					description={sponsorship.description[locale]}
				/>
				<div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
					{/* Tabs */}
					<div className="lg:col-span-4">
						<div className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
							{sponsorship.packages.map((p, i) => {
								const isActive = i === active;
								const Icon = TIER_ICONS[p.id] ?? Star;
								return (
									<button
										key={p.id}
										type="button"
										onClick={() => setActive(i)}
										className={`group flex shrink-0 items-center gap-4 rounded-2xl border px-5 py-4 text-start transition-all lg:shrink ${
											isActive
												? "border-[var(--color-gold)] bg-gradient-to-br from-[var(--color-gold)]/15 to-transparent shadow-[0_8px_28px_rgba(238,193,59,0.18)]"
												: "border-white/10 bg-white/[0.03] hover:border-white/30"
										}`}
									>
										<div
											className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${
												isActive
													? "bg-[var(--color-gold)] text-[var(--color-navy)]"
													: "bg-white/5 text-[var(--color-gold)]"
											}`}
										>
											<Icon className="h-5 w-5" strokeWidth={2.25} />
										</div>
										<div className="min-w-0 flex-1">
											<div
												className={`font-display text-[15px] font-semibold ${
													isActive ? "text-white" : "text-white/85"
												}`}
											>
												{p.name[locale]}
											</div>
											<div className="mt-1 truncate text-[12px] text-[var(--color-silver)]">
												{p.tagline[locale]}
											</div>
										</div>
										{p.featured ? (
											<span className="hidden shrink-0 rounded-full bg-[var(--color-gold)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-navy)] sm:inline">
												{locale === "ar" ? "مميّز" : "Top"}
											</span>
										) : null}
									</button>
								);
							})}
						</div>
					</div>

					{/* Active package details */}
					<div className="lg:col-span-8">
						<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-9">
							<div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[var(--color-gold)]/15 to-transparent blur-2xl" />
							<div className="relative flex flex-wrap items-start justify-between gap-4">
								<div className="flex items-center gap-4">
									<div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-deep)] text-[var(--color-navy)] shadow-[0_10px_30px_rgba(238,193,59,0.35)]">
										<ActiveIcon className="h-6 w-6" strokeWidth={2.25} />
									</div>
									<div>
										<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
											{locale === "ar" ? "حزمة" : "Package"}
										</div>
										<h3 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
											{pkg.name[locale]}
										</h3>
									</div>
								</div>
							</div>
							<p className="relative mt-4 text-[14.5px] text-[var(--color-silver)]">
								{pkg.tagline[locale]}
							</p>
							<ul className="relative mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
								{pkg.features.map((f, j) => (
									<li
										key={j}
										className="flex items-start gap-3 rounded-lg bg-white/[0.02] p-3 text-[14px] leading-[1.55] text-white/90"
									>
										<span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-gold)]/20 text-[var(--color-gold)]">
											<Check className="h-3 w-3" strokeWidth={3} />
										</span>
										<span>{f[locale]}</span>
									</li>
								))}
							</ul>
							<div className="relative mt-8">
								<Button
									href={`/${locale}/contact?subject=sponsor`}
									variant="gold"
									size="md"
									withArrow
								>
									{locale === "ar" ? "كن راعياً" : "Become a Sponsor"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
