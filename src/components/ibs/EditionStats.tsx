"use client";

import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import type { IbsEdition } from "@/data/ibs/types";

export function EditionStats({ edition }: { edition: IbsEdition }) {
	const { locale } = useI18n();
	if (!edition.stats.length) return null;
	return (
		<section className="bg-white py-12 lg:py-16">
			<Container>
				<div className="grid grid-cols-2 divide-x divide-y divide-[var(--color-line)] overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-warm)] sm:divide-y-0 sm:grid-cols-4">
					{edition.stats.map((s, i) => (
						<div key={i} className="px-6 py-8 text-center">
							<div className="font-numeric text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-none text-[var(--color-gold-deep)]">
								{s.value}
							</div>
							<div className="mt-2 text-[11.5px] font-bold uppercase tracking-[0.18em] text-[var(--color-slate)]">
								{s.label[locale]}
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
