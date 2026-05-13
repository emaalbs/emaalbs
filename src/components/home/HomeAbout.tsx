"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";

export function HomeAbout() {
	const { t, locale } = useI18n();
	const isAr = locale === "ar";
	return (
		<section id="about" className="relative bg-warm py-24 lg:py-32">
			<Container>
				{/* Eyebrow + giant statement */}
				<div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-12">
					<div className="lg:col-span-3">
						<div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-deep)]">
							<span className="inline-block h-px w-8 bg-[var(--color-gold-deep)]" />
							{t.about.overline}
						</div>
						<div className="mt-4 hidden font-numeric text-[12px] uppercase tracking-[0.2em] text-[var(--color-slate)]/70 lg:block">
							{t.about.sectionLabel}
						</div>
					</div>
					<h2 className={`font-display font-bold tracking-display text-[var(--color-navy)] text-[clamp(1.85rem,4vw,3.25rem)] lg:col-span-9 ${isAr ? "leading-[1.35]" : "leading-[1.08]"}`}>
						{t.about.title[0]}{" "}
						<span className="italic font-medium text-[var(--color-slate)]">{t.about.title[1]}</span>
						{t.about.title[2]}
						<br />
						{t.about.title[3]} <span className="text-[var(--color-teal)]">{t.about.title[4]}</span> {t.about.title[5]}
					</h2>
				</div>

				{/* Wide horizontal image banner */}
				<div className="relative mt-14 overflow-hidden rounded-2xl">
					<div className="relative aspect-[16/10] w-full sm:aspect-[18/9] lg:aspect-[21/9]">
						<Image
							src="/images/ibs.png"
							alt="Iraq · UAE skyline"
							fill
							sizes="(max-width: 1280px) 100vw, 1280px"
							className="object-cover object-[center_65%]"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,102,102,0.75)] via-[rgba(1,30,47,0.55)] to-transparent" />
						<div className="absolute inset-0 flex items-end p-5 sm:p-8 lg:p-12">
							<div className="max-w-xl">
								<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
									{t.about.bannerOverline}
								</div>
								<div className="mt-2 font-display text-xl font-semibold text-white sm:mt-3 sm:text-2xl lg:text-3xl">
									{t.about.bannerTitle}
								</div>
								<div className="mt-1.5 text-[13px] text-white/75 sm:mt-2 sm:text-[14px]">
									{t.about.bannerDescription}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Inline data ribbon under banner */}
				<div className="mt-8 grid grid-cols-2 gap-y-6 border-t border-[var(--color-line)] pt-8 sm:grid-cols-4">
					{t.about.ribbon.map((s) => (
						<div key={s.k} className="px-2">
							<div className="font-numeric text-[clamp(2rem,3.2vw,2.75rem)] font-bold leading-none text-[var(--color-teal)]">
								{s.v}
							</div>
							<div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-slate)]/80">
								{s.k}
							</div>
						</div>
					))}
				</div>

				{/* Working process — clean connected timeline (no giant numerals) */}
				<div className="mt-24 lg:mt-28">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-teal)]">
								{t.about.processOverline}
							</div>
							<h3 className="mt-3 font-display text-2xl font-semibold text-[var(--color-navy)] sm:text-[28px]">
								{t.about.processTitle}
							</h3>
						</div>
						<div className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-slate)]/70">
							{t.about.processLabel}
						</div>
					</div>

					{/* Connected timeline */}
					<div className="relative mt-12">
						{/* horizontal connector line (desktop) */}
						<div className={`absolute ${isAr ? "right-0 left-0" : "left-0 right-0"} top-3 hidden h-px bg-gradient-to-r from-[var(--color-teal)]/40 via-[var(--color-teal)]/20 to-[var(--color-teal)]/40 lg:block`} />
						<div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10">
							{t.about.steps.map((s) => (
								<div key={s.n} className="relative">
									{/* dot on the timeline */}
									<div className="flex items-center gap-3">
										<div className="relative grid h-6 w-6 place-items-center rounded-full bg-white ring-2 ring-[var(--color-teal)]">
											<div className="h-2 w-2 rounded-full bg-[var(--color-teal)]" />
										</div>
										<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-slate)]/70">
											{t.about.stepLabel} {s.n}
										</div>
									</div>
									<div className="mt-5 font-display text-lg font-semibold text-[var(--color-navy)]">
										{s.t}
									</div>
									<p className="mt-1.5 max-w-xs text-[13.5px] leading-[1.55] text-[var(--color-slate)]">
										{s.d}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
