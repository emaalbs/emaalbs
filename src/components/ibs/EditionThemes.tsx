"use client";

import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";
import { IbsSectionHeading } from "./IbsSectionHeading";

export function EditionThemes({ edition }: { edition: IbsEdition }) {
	const { locale } = useI18n();
	const labels = ibsOverview.editionLabels;
	if (!edition.themes.length) return null;
	return (
		<section className="bg-[var(--color-warm)] py-20 lg:py-24">
			<Container>
				<IbsSectionHeading
					overline={labels.themes[locale]}
					title={
						locale === "ar"
							? "محاور النقاش الرئيسية"
							: "The conversations that defined the room."
					}
				/>
				<div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{edition.themes.map((th, i) => (
						<div
							key={i}
							className="group rounded-xl border border-[var(--color-line)] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--color-teal)] hover:shadow-[0_12px_32px_rgba(1,51,77,0.10)]"
						>
							<div className="font-numeric text-[12px] font-bold tracking-[0.18em] text-[var(--color-teal)]">
								/ 0{i + 1}
							</div>
							<h3 className="mt-3 font-display text-lg font-semibold leading-tight text-[var(--color-ink)]">
								{th.title[locale]}
							</h3>
							<p className="mt-3 text-[14px] leading-[1.6] text-[var(--color-slate)]">
								{th.description[locale]}
							</p>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
