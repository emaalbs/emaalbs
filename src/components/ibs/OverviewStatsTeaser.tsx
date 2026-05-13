"use client";

import Link from "next/link";
import { ArrowRight, Users, Mic, Building2, Layers } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { getEditionsSync } from "@/data/ibs";

const ICONS = [Users, Mic, Building2, Layers];

export function OverviewStatsTeaser() {
	const { locale, dir } = useI18n();
	const isAr = dir === "rtl";
	const past = getEditionsSync().find((e) => e.status === "past");
	if (!past || !past.stats.length) return null;

	return (
		<section className="relative isolate overflow-hidden bg-[var(--color-navy)] py-16 lg:py-20 text-white">
			<div className="absolute inset-0 -z-10 opacity-40">
				<div className="absolute -left-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[var(--color-gold)]/20 blur-3xl" />
				<div className="absolute -right-32 top-0 h-[400px] w-[400px] rounded-full bg-[var(--color-teal)]/30 blur-3xl" />
			</div>
			<Container>
				<div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
							{locale === "ar"
								? `لمحة عن نسخة ${past.year}`
								: `${past.year} edition · at a glance`}
						</div>
						<h2 className="mt-3 font-display text-[clamp(1.4rem,2.4vw,2rem)] font-bold leading-tight">
							{locale === "ar"
								? "أرقام تروي ما حدث في القاعة."
								: "Numbers from inside the room."}
						</h2>
						<Link
							href={`/${locale}/ibs/${past.slug}`}
							className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-gold)] transition-colors hover:text-white"
						>
							{locale === "ar" ? "قصة النسخة الكاملة" : "Read the full recap"}
							<ArrowRight className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} />
						</Link>
					</div>
					<div className="lg:col-span-8">
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
							{past.stats.map((s, i) => {
								const Icon = ICONS[i] ?? Users;
								return (
									<div
										key={i}
										className="rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
									>
										<Icon className="h-5 w-5 text-[var(--color-gold)]" />
										<div className="mt-3 font-numeric text-[clamp(1.8rem,3vw,2.4rem)] font-bold leading-none text-white">
											{s.value}
										</div>
										<div className="mt-2 text-[11.5px] font-bold uppercase tracking-wider text-[var(--color-silver)]">
											{s.label[locale]}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
