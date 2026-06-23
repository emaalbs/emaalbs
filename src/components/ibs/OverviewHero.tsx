"use client";

import Image from "next/image";
import { ArrowDown, Calendar, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";

export function OverviewHero({ editions }: { editions: IbsEdition[] }) {
	const { locale, dir } = useI18n();
	const isAr = dir === "rtl";
	const hero = ibsOverview.hero;
	const upcoming = editions.find((e) => e.status === "upcoming");
	const past = editions.find((e) => e.status === "past");

	return (
		<section className="relative isolate overflow-hidden bg-[var(--color-navy-dark)] pt-32 pb-24 lg:pt-40 lg:pb-28 text-white">
			{/* Background image */}
			<div className="absolute inset-0 -z-20">
				<Image
					src="/images/hero-summit.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover opacity-30"
				/>
			</div>
			{/* Gradient + glow overlays */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-[rgba(1,30,47,0.5)] via-[rgba(1,30,47,0.85)] to-[var(--color-navy-dark)]" />
			<div className="absolute -left-40 top-20 -z-10 h-[600px] w-[600px] rounded-full bg-[var(--color-teal)]/30 blur-[120px]" />
			<div className="absolute -right-40 -bottom-20 -z-10 h-[600px] w-[600px] rounded-full bg-[var(--color-gold)]/15 blur-[120px]" />

			{/* Decorative grid pattern */}
			<div
				className="absolute inset-0 -z-10 opacity-[0.07]"
				style={{
					backgroundImage:
						"linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
					backgroundSize: "64px 64px",
					maskImage:
						"radial-gradient(ellipse at center, black 30%, transparent 75%)",
				}}
			/>

			<Container>
				<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
					<div className="lg:col-span-7">
						<h1 className="mt-2 font-display font-bold tracking-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.05]">
							<span className="block">{hero.title[locale]}</span>
							<span className="mt-2 block bg-gradient-to-r from-[var(--color-gold)] via-[#f5d65e] to-[var(--color-gold)] bg-clip-text text-transparent">
								{locale === "ar"
									? "منصة للأعمال."
									: "A Platform For Business."}									
							</span>
						</h1>
						<p className="mt-7 max-w-xl text-[16.5px] leading-[1.7] text-[var(--color-silver)]">
							{hero.description[locale]}
						</p>
						<div className="mt-9 flex flex-col gap-3 sm:flex-row">
							<Button href={`/${locale}/contact?subject=partner`} variant="gold" size="lg" withArrow>
								{hero.ctaPrimary[locale]}
							</Button>
							<Button
								href={`/${locale}/contact?subject=sponsor`}
								variant="outline-white"
								size="lg"
								withArrow
							>
								{hero.ctaSecondary[locale]}
							</Button>
						</div>

						{/* Eyebrow ribbon: editions */}
						<div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[12.5px]">
							{upcoming ? (
								<span className="inline-flex items-center gap-2 text-white/80">
									<span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-gold)]">
										<Calendar className="h-3 w-3 text-[var(--color-navy)]" />
									</span>
									<span className="text-[var(--color-gold)] font-semibold">
										{upcoming.title[locale]}
									</span>
									<span className="text-white/60">·</span>
									<span>{upcoming.dates[locale]}</span>
								</span>
							) : null}
							{past ? (
								<span className="inline-flex items-center gap-2 text-white/70">
									<MapPin className="h-3.5 w-3.5 text-[var(--color-teal)]" />
									{locale === "ar"
										? `آخر نسخة: ${past.dates[locale]} — ${past.location[locale]}`
										: `Last edition: ${past.dates[locale]} — ${past.location[locale]}`}
								</span>
							) : null}
						</div>
					</div>

					{/* Right: stacked visual cards */}
					<div className="lg:col-span-5">
						<div className="relative mx-auto max-w-md">
							{/* Main image */}
							<div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
								<Image
									src="/images/leaders.JPG"
									alt="IBS leadership and decision makers"
									fill
									sizes="(min-width: 1024px) 35vw, 80vw"
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.85)] via-transparent to-transparent" />
								<div className="absolute inset-x-0 bottom-0 p-5">
									<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
										{locale === "ar" ? "قاعة قرار" : "The room"}
									</div>
									<div className="mt-1 font-display text-base font-semibold leading-tight">
										{locale === "ar"
											? "وزراء، رؤساء، مستثمرون."
											: "Ministers. Chairmen. Investors."}
									</div>
								</div>
							</div>

							{/* Floating stat card */}
							{past?.stats?.length ? (
								<div
									className={`absolute ${
										isAr ? "-left-6" : "-right-6"
									} -top-6 hidden w-[160px] rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md sm:block`}
								>
									<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
										{past.year}
									</div>
									<div className="mt-1 font-numeric text-[36px] font-bold leading-none text-white">
										{past.stats[0].value}
									</div>
									<div className="mt-1 text-[12px] text-[var(--color-silver)]">
										{past.stats[0].label[locale]}
									</div>
								</div>
							) : null}

							{/* Floating sectors card */}
							<div
								className={`absolute ${
									isAr ? "-right-4" : "-left-4"
								} -bottom-6 hidden rounded-xl border border-white/10 bg-[var(--color-navy)]/80 p-4 backdrop-blur-md sm:block`}
							>
								<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-teal)]">
									{locale === "ar" ? "قطاعات" : "Sectors"}
								</div>
								<div className="mt-1 font-numeric text-[28px] font-bold leading-none text-white">
									6
								</div>
								<div className="mt-1 text-[11px] text-[var(--color-silver)]">
									{locale === "ar"
										? "قطاع رئيسي محوري"
										: "Driving Iraq's economy"}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Scroll indicator */}
				<div className="mt-16 flex justify-center">
					<div className="flex flex-col items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.22em] text-white/50">
						<ArrowDown className="h-4 w-4 animate-bounce" />
						{locale === "ar" ? "اكتشف القمة" : "Scroll to explore"}
					</div>
				</div>
			</Container>
		</section>
	);
}
