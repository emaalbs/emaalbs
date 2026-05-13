"use client";

import Image from "next/image";
import { Mic } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";
import { IbsSectionHeading } from "./IbsSectionHeading";

export function EditionSpeakers({ edition }: { edition: IbsEdition }) {
	const { locale } = useI18n();
	const labels = ibsOverview.editionLabels;
	if (!edition.keynoteSpeakers.length) return null;
	return (
		<section className="bg-white py-20 lg:py-24">
			<Container>
				<IbsSectionHeading
					overline={labels.speakers[locale]}
					title={
						locale === "ar"
							? "أصوات على المنصة الرئيسية."
							: "Voices on the main stage."
					}
				/>
				<div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{edition.keynoteSpeakers.map((s) => (
						<div
							key={s.id}
							className="group relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white transition-all hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-[0_20px_44px_rgba(238,193,59,0.20)]"
						>
							<div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-dark)]">
								{s.photo ? (
									<Image
										src={s.photo}
										alt={s.name[locale]}
										fill
										unoptimized
										sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								) : (
									<div className="grid h-full w-full place-items-center">
										<span className="font-display text-6xl font-bold text-[var(--color-gold)] opacity-30">
											{s.name[locale].slice(0, 1)}
										</span>
									</div>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.85)] via-[rgba(1,30,47,0.15)] to-transparent" />
								<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
									<span className="rounded-full bg-[var(--color-gold)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-navy)]">
										{locale === "ar" ? "متحدث" : "Speaker"}
									</span>
									<span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
										<Mic className="h-3.5 w-3.5" />
									</span>
								</div>
							</div>
							<div className="p-5">
								<h3 className="font-display text-[16px] font-semibold leading-tight text-[var(--color-ink)]">
									{s.name[locale]}
								</h3>
								<p className="mt-2 text-[13px] leading-[1.5] text-[var(--color-slate)]">
									{s.title[locale]}
								</p>
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}
