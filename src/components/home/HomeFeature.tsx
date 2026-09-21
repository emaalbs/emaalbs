"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HomeFeature as HomeFeatureData } from "@/data/home-feature";
import type { GalleryLocale } from "@/data/gallery";
import { Container } from "@/components/ui/Container";

type Props = {
	feature: HomeFeatureData;
	locale: GalleryLocale;
};

export function HomeFeature({ feature, locale }: Props) {
	if (!feature.enabled || !feature.title[locale] || !feature.imageUrl) return null;

	const href = feature.buttonHref[locale];
	const external = /^https?:\/\//i.test(href);
	const content = (
		<>
			<span>{feature.buttonLabel[locale]}</span>
			<ArrowUpRight className={`h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 ${locale === "ar" ? "-rotate-90" : ""}`} />
		</>
	);

	return (
		<section aria-labelledby="homepage-feature-title" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
			<div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/70 to-transparent" />
			<Container>
				<article className="group relative isolate overflow-hidden rounded-[1.5rem] bg-[var(--color-navy-dark)] shadow-[0_28px_80px_rgba(1,30,47,0.16)] lg:min-h-[520px]">
					<div aria-hidden="true" className="absolute -bottom-28 -start-20 -z-10 h-80 w-80 rounded-full bg-[var(--color-teal)]/25 blur-3xl" />
					<div className="grid lg:min-h-[520px] lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
						<div className="relative min-h-[290px] overflow-hidden sm:min-h-[390px] lg:min-h-full">
							<Image
								src={feature.imageUrl}
								alt={feature.title[locale]}
								fill
								sizes="(min-width: 1024px) 55vw, 100vw"
								className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025] motion-reduce:transition-none"
								style={{ objectPosition: feature.imagePosition }}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-dark)]/60 via-transparent to-transparent lg:bg-gradient-to-e lg:from-[var(--color-navy-dark)]/35 lg:via-transparent" />
							<div className="absolute bottom-5 start-5 rounded-full border border-white/20 bg-[var(--color-navy-dark)]/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md sm:bottom-7 sm:start-7">
								{locale === "ar" ? "مختارات الصفحة الرئيسية" : "Homepage feature"}
							</div>
						</div>

						<div className="relative flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
							<div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
								<span className="h-px w-8 bg-[var(--color-gold)]" />
								{feature.kicker[locale]}
							</div>
							<h2 id="homepage-feature-title" className={`mt-5 font-display text-[clamp(1.8rem,3vw,3rem)] font-bold text-white ${locale === "ar" ? "leading-[1.45]" : "leading-[1.1] tracking-[-0.025em]"}`}>
								{feature.title[locale]}
							</h2>
							<p className={`mt-5 max-w-xl text-[14px] text-white/72 sm:text-[15px] ${locale === "ar" ? "leading-8" : "leading-7"}`}>
								{feature.description[locale]}
							</p>
							<div className="mt-8">
								{external ? (
									<a href={href} target="_blank" rel="noopener noreferrer" className="group/cta inline-flex min-h-12 items-center gap-2.5 rounded-xl bg-[var(--color-gold)] px-5 text-sm font-bold text-[var(--color-navy-dark)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-navy-dark)] motion-reduce:transition-none">
										{content}
									</a>
								) : (
									<Link href={href} className="group/cta inline-flex min-h-12 items-center gap-2.5 rounded-xl bg-[var(--color-gold)] px-5 text-sm font-bold text-[var(--color-navy-dark)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-navy-dark)] motion-reduce:transition-none">
										{content}
									</Link>
								)}
							</div>
						</div>
					</div>
				</article>
			</Container>
		</section>
	);
}
