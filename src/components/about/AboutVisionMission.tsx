"use client";

import { Eye, Target, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";

export function AboutVisionMission() {
	const { locale, t } = useI18n();
	const isAr = locale === "ar";
	const align = isAr ? "text-right" : "text-left";

	return (
		<section className="relative overflow-hidden bg-[var(--color-navy-dark)] py-24 lg:py-32">
			{/* ambient glow */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-[var(--color-teal)]/25 blur-[120px]" />
				<div className="absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-[var(--color-gold)]/15 blur-[120px]" />
			</div>

			{/* grid pattern */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.06]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
					backgroundSize: "56px 56px",
				}}
			/>

			<Container>
				<div className="relative grid items-stretch gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
					{/* VISION */}
					<article
						className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-9 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-teal)]/40 lg:p-11 ${align}`}
					>
						<span className="pointer-events-none absolute -right-10 -top-10 font-display text-[180px] font-black leading-none text-white/[0.04] select-none">
							01
						</span>
						<div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-teal)] to-transparent opacity-70" />

						<div className="relative flex items-center gap-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-teal)]/40 bg-[var(--color-teal)]/15 text-[var(--color-teal-tint)] shadow-[0_0_30px_-5px_rgba(0,102,102,0.6)]">
								<Eye size={26} />
							</div>
							<div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]">
								{t.aboutp.visionLabel}
							</div>
						</div>

						<h3 className={`relative mt-7 font-display text-[clamp(1.75rem,2.4vw,2.5rem)] font-bold text-white ${isAr ? "leading-[1.4]" : "leading-[1.15]"}`}>
							{t.aboutp.visionTitle1}
							<br />
							<span className="bg-gradient-to-r from-white to-[var(--color-teal-tint)] bg-clip-text text-transparent">
								{t.aboutp.visionTitle2}
							</span>
						</h3>

						<div className="relative mt-5 h-px w-16 bg-gradient-to-r from-[var(--color-teal)] to-transparent" />

						<p className="relative mt-5 text-[15px] leading-[1.85] text-[var(--color-silver)]">
							{t.aboutp.visionText}
						</p>
					</article>

					{/* center emblem */}
					<div className="relative hidden items-center justify-center lg:flex">
						<div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
						<div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-navy)] shadow-[0_0_60px_-10px_rgba(238,193,59,0.5)]">
							<div className="absolute inset-0 animate-pulse rounded-full bg-[var(--color-gold)]/10" />
							<Sparkles
								size={26}
								className="relative text-[var(--color-gold)]"
							/>
						</div>
					</div>

					{/* MISSION */}
					<article
						className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-bl from-white/[0.06] to-white/[0.02] p-9 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-gold)]/40 lg:p-11 ${align}`}
					>
						<span className="pointer-events-none absolute -left-10 -top-10 font-display text-[180px] font-black leading-none text-white/[0.04] select-none">
							02
						</span>
						<div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-70" />

						<div className="relative flex items-center gap-4">
							<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/15 text-[var(--color-gold)] shadow-[0_0_30px_-5px_rgba(238,193,59,0.6)]">
								<Target size={26} />
							</div>
							<div className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold)]">
								{t.aboutp.missionLabel}
							</div>
						</div>

						<h3 className={`relative mt-7 font-display text-[clamp(1.75rem,2.4vw,2.5rem)] font-bold text-white ${isAr ? "leading-[1.4]" : "leading-[1.15]"}`}>
							{t.aboutp.missionTitle1}
							<br />
							<span className="bg-gradient-to-r from-white to-[var(--color-gold-tint)] bg-clip-text text-transparent">
								{t.aboutp.missionTitle2}
							</span>
						</h3>

						<div className="relative mt-5 h-px w-16 bg-gradient-to-r from-[var(--color-gold)] to-transparent" />

						<p className="relative mt-5 text-[15px] leading-[1.85] text-[var(--color-silver)]">
							{t.aboutp.missionText}
						</p>
					</article>
				</div>
			</Container>
		</section>
	);
}
