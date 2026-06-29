"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";

export function OverviewHero({ editions: _editions }: { editions: IbsEdition[] }) {
	const { locale } = useI18n();
	const hero = ibsOverview.hero;

	return (
		<section className="relative isolate overflow-hidden bg-[var(--color-navy-dark)] pt-32 pb-24 lg:pt-40 lg:pb-28 text-white">
			{/* Background image */}
			<div className="absolute inset-0 -z-20">
				<Image
					src="/images/hero-summit.webp"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover opacity-30"
				/>
			</div>
			{/* Gradient + glow overlays */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-[rgba(1,30,47,0.5)] via-[rgba(1,30,47,0.85)] to-[var(--color-navy-dark)]" />
			<div className="absolute -left-40 top-20 -z-10 h-[600px] w-[600px] rounded-full bg-[var(--color-teal)]/30 blur-[120px]" />
			<div className="absolute -right-40 -bottom-20 -z-10 h-[600px] w-[600px] rounded-full bg-[var(--color-gold)]/15 blur-[120px]" />

			{/* Decorative grid pattern */}
			<div
				className="absolute inset-0 -z-10 opacity-[0.07]"
				style={{
					backgroundImage:
						"linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
					backgroundSize: "64px 64px",
					maskImage:
						"radial-gradient(ellipse at center, black 30%, transparent 75%)",
				}}
			/>

			<Container>
				<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
					<div className="lg:col-span-7">
						<h1 className="mt-2 font-display font-bold tracking-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.05]">
							<span className="block">{hero.title[locale]}</span>
							<span className="mt-2 block bg-gradient-to-r from-[var(--color-gold)] via-[#f5d65e] to-[var(--color-gold)] bg-clip-text text-transparent">
								{hero.subtitle[locale]}
							</span>
						</h1>
						<p className="mt-7 max-w-xl text-[16.5px] leading-[1.7] text-[var(--color-silver)]">
							{hero.description[locale]}
						</p>
					</div>

					{/* Right: main image */}
					<div className="lg:col-span-5">
						<div className="relative mx-auto max-w-md">
							<div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
								<Image
									src="/images/leadership-delegation.webp"
									alt=""
									fill
									sizes="(min-width: 1024px) 35vw, 80vw"
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.5)] via-transparent to-transparent" />
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}