"use client";

import {
	Banknote,
	Building2,
	Flame,
	Sparkles,
	TrendingUp,
	Truck,
	Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import { IbsSectionHeading } from "./IbsSectionHeading";

const ICONS: LucideIcon[] = [
	Flame, // Energy & Oil
	Banknote, // Banking
	Building2, // Infrastructure
	Wifi, // Telecom
	Truck, // Logistics
	TrendingUp, // Investment
];

export function KeySectors() {
	const { locale } = useI18n();
	const sectors = ibsOverview.sectors;
	return (
		<section className="relative bg-[var(--color-warm)] py-24 lg:py-28">
			<Container>
				<div className="mx-auto max-w-3xl text-center">
					<div className="inline-flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-teal)]">
						<span className="inline-block h-px w-8 bg-[var(--color-teal)]" />
						{sectors.overline[locale]}
						<span className="inline-block h-px w-8 bg-[var(--color-teal)]" />
					</div>
					<h2 className="mt-4 font-display font-bold tracking-display text-[var(--color-ink)] text-[clamp(1.65rem,3vw,2.6rem)] leading-[1.15]">
						{sectors.title[locale]}
					</h2>
				</div>
				<div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{sectors.items.map((s, i) => {
						const Icon = ICONS[i] ?? Sparkles;
						return (
							<div
								key={i}
								className="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white p-6 transition-all hover:-translate-y-1 hover:border-[var(--color-navy)] hover:shadow-[0_18px_44px_rgba(1,51,77,0.10)]"
							>
								<div className="absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-teal)] transition-transform duration-300 group-hover:scale-y-100" />
								<div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-dark)] text-[var(--color-gold)] shadow-[0_6px_18px_rgba(1,51,77,0.20)]">
									<Icon className="h-6 w-6" strokeWidth={2} />
									<span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-[var(--color-gold)]/0 transition-all duration-300 group-hover:ring-[var(--color-gold)]/40" />
								</div>
								<div className="flex-1">
									<div className="font-numeric text-[10.5px] font-bold tracking-[0.22em] text-[var(--color-gold-deep)]">
										0{i + 1}
									</div>
									<div className="mt-1 font-display text-[16px] font-semibold leading-tight text-[var(--color-ink)]">
										{s[locale]}
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
