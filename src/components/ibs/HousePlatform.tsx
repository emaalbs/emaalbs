"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";

export function HousePlatform() {
	const { locale } = useI18n();
	const house = ibsOverview.house;
	return (
		<section className="relative isolate overflow-hidden bg-[var(--color-navy)] py-20 lg:py-28 text-white">
			<div className="absolute inset-0 -z-10 opacity-50">
				<div className="absolute -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[var(--color-gold)]/15 blur-3xl" />
				<div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-[var(--color-teal)]/25 blur-3xl" />
			</div>
			<Container>
				<div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
					<div className="lg:col-span-6">
						<div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
							<Image
								src="/images/house-platform.webp"
								alt=""
								width={1200}
								height={900}
								className="aspect-[4/3] w-full object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.5)] via-transparent to-transparent" />
						</div>
					</div>
					<div className="lg:col-span-6">
						<h2 className="font-display font-bold tracking-display text-white text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.15]">
							{house.title[locale]}
						</h2>
						<p className="mt-5 max-w-xl text-[15.5px] leading-[1.7] text-[var(--color-silver)]">
							{house.description[locale]}
						</p>
						<ul className="mt-7 space-y-3">
							{house.items.map((item, i) => (
								<li
									key={i}
									className="flex items-start gap-3 text-[14.5px] leading-[1.6] text-white/90"
								>
									<span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold)]">
										<Check className="h-3 w-3" strokeWidth={3} />
									</span>
									<span>{item[locale]}</span>
								</li>
							))}
						</ul>
						<div className="mt-7 inline-flex items-center gap-3 rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 px-5 py-2.5 text-[13px] font-semibold text-[var(--color-gold)]">
							{house.footer[locale]}
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
