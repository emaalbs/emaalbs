"use client";

import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";

export function WhatEnables() {
	const { locale } = useI18n();
	const enables = ibsOverview.enables;
	return (
		<section className="bg-[var(--color-warm)] py-24 lg:py-28">
			<Container>
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="font-display font-bold tracking-display text-[var(--color-ink)] text-[clamp(1.65rem,3vw,2.6rem)] leading-[1.15]">
						{enables.title[locale]}
					</h2>
				</div>
				<ul className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
					{enables.items.map((item, i) => (
						<li
							key={i}
							className="flex items-start gap-3 rounded-xl border border-[var(--color-line)] bg-white p-5 text-[14.5px] leading-[1.55] text-[var(--color-ink)]"
						>
							<CheckCircle2
								className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-gold-deep)]"
								strokeWidth={2}
							/>
							<span>{item[locale]}</span>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
