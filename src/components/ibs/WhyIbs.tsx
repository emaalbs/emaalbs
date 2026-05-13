"use client";

import { Landmark, MessagesSquare, Target, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import { IbsSectionHeading } from "./IbsSectionHeading";

const ICONS: LucideIcon[] = [Landmark, MessagesSquare, Target, Workflow];

export function WhyIbs() {
	const { locale } = useI18n();
	const why = ibsOverview.why;
	return (
		<section className="relative bg-[var(--color-warm)] py-24 lg:py-28">
			<div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-[var(--color-navy-dark)] to-transparent opacity-[0.04]" />
			<Container>
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
					<div className="lg:col-span-5">
						<IbsSectionHeading
							overline={why.overline[locale]}
							title={why.title[locale]}
							description={why.description[locale]}
						/>
						<div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--color-teal)]/20 bg-white px-4 py-2 text-[12px] font-semibold text-[var(--color-teal)]">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-teal)]" />
							{locale === "ar"
								? "صُممت للنتائج، لا للحضور."
								: "Designed for outcomes, not attendance."}
						</div>
					</div>
					<div className="lg:col-span-7">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{why.pillars.map((p, i) => {
								const Icon = ICONS[i] ?? Target;
								return (
									<div
										key={i}
										className="group relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-navy)] hover:shadow-[0_18px_44px_rgba(1,51,77,0.12)]"
									>
										<div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-[var(--color-gold)]/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
										<div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-dark)] text-[var(--color-gold)] shadow-[0_6px_18px_rgba(1,51,77,0.18)]">
											<Icon className="h-5 w-5" />
										</div>
										<div className="relative mt-5 font-numeric text-[11px] font-bold tracking-[0.18em] text-[var(--color-gold-deep)]">
											0{i + 1} / 04
										</div>
										<h3 className="relative mt-2 font-display text-xl font-semibold leading-tight text-[var(--color-ink)]">
											{p.title[locale]}
										</h3>
										<p className="relative mt-3 text-[14.5px] leading-[1.65] text-[var(--color-slate)]">
											{p.description[locale]}
										</p>
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
