"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";

export function NotableLeaders() {
	const { locale } = useI18n();
	const leaders = ibsOverview.leaders;

	const initials = (name: string) => {
		const parts = name.replace(/\./g, "").split(/\s+/).filter(Boolean);
		const a = parts[0]?.[0] ?? "";
		const b = parts[parts.length - 1]?.[0] ?? "";
		return (a + b).toUpperCase();
	};

	return (
		<section className="relative isolate overflow-hidden bg-[var(--color-navy-dark)] py-24 lg:py-28 text-white">
			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-navy-dark)] via-[rgba(1,30,47,0.95)] to-[var(--color-navy-dark)]" />
			<div className="absolute -left-32 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[var(--color-teal)]/15 blur-3xl" />
			<div className="absolute -right-32 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-[var(--color-gold)]/15 blur-3xl" />

			<Container>
					<h2 className="font-display font-bold tracking-display text-white text-[clamp(1.65rem,3vw,2.6rem)] leading-[1.15]">
						{leaders.title[locale]}
					</h2>
				<div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
					{leaders.items.map((l, i) => (
						<div
							key={i}
							className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[var(--color-gold)]/50 hover:shadow-[0_20px_44px_rgba(238,193,59,0.20)]"
						>
							<div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-dark)]">
								{l.photo ? (
									<Image
										src={l.photo}
										alt={l.name[locale]}
										fill
										unoptimized
										sizes="(min-width: 1024px) 18vw, (min-width: 640px) 33vw, 50vw"
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								) : (
									<div className="grid h-full w-full place-items-center">
										<span className="font-display text-5xl font-bold text-[var(--color-gold)] opacity-30">
											{initials(l.name.en)}
										</span>
									</div>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.95)] via-[rgba(1,30,47,0.25)] to-transparent" />
								<Quote className="absolute right-3 top-3 h-5 w-5 text-[var(--color-gold)]/40" />
								<div className="absolute inset-x-0 bottom-0 p-4">
									<div className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
										{locale === "ar" ? "متحدث" : "Keynote"}
									</div>
									<div className="mt-1.5 font-display text-[14px] font-semibold leading-tight text-white">
										{l.name[locale]}
									</div>
									<div className="mt-1 line-clamp-2 text-[11.5px] leading-[1.4] text-[var(--color-silver)]">
										{l.role[locale]}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}