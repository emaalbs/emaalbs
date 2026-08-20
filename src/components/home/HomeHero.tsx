"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";
import type { HomeHeroSettings } from "@/data/home-hero";

function localizedHref(href: string, locale: string): string {
	if (!href.startsWith("/") || href.startsWith("//")) return href;
	const parts = href.split("/");
	if (parts[1] === "en" || parts[1] === "ar") parts[1] = locale;
	else parts.splice(1, 0, locale);
	return parts.join("/");
}

export function HomeHero({ settings }: { settings: HomeHeroSettings }) {
	const { locale } = useI18n();
	const isAr = locale === "ar";
	const [activeSlide, setActiveSlide] = useState(0);
	const contentLocale = isAr ? "ar" : "en";
	const slide = settings.slides[activeSlide] ?? settings.slides[0];

	useEffect(() => {
		if (settings.slides.length < 2) return;
		const timer = window.setTimeout(
			() => setActiveSlide((i) => (i + 1) % settings.slides.length),
			settings.slideIntervalMs,
		);
		return () => window.clearTimeout(timer);
	}, [activeSlide, settings.slideIntervalMs, settings.slides.length]);

	function showPreviousSlide() {
		setActiveSlide((current) => (current - 1 + settings.slides.length) % settings.slides.length);
	}

	function showNextSlide() {
		setActiveSlide((current) => (current + 1) % settings.slides.length);
	}

	return (
		<section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[var(--color-navy-dark)] pt-24">
			{/* Background image slideshow */}
			<div className="absolute inset-0 -z-10">
				{settings.slides.map((slide, i) => (
					<Image
						key={slide.id}
						src={slide.imageUrl}
						alt={i === activeSlide ? slide.alt[contentLocale] : ""}
						aria-hidden={i !== activeSlide}
						fill
						priority={i === 0}
						sizes="100vw"
						className={`object-cover object-center blur-[1px] transition-opacity duration-[1500ms] ease-in-out ${i === activeSlide ? "opacity-100" : "opacity-0"}`}
					/>
				))}
				<div className="absolute inset-0 bg-gradient-to-b from-[rgba(1,30,47,0.82)] via-[rgba(1,51,77,0.7)] to-[rgba(1,30,47,0.95)]" />
				<div className="absolute inset-0 bg-gradient-to-r from-[rgba(1,30,47,0.75)] via-transparent to-transparent" />
				{/* Teal ambient glow — bottom-left */}
				<div className="absolute -left-20 bottom-0 h-[550px] w-[550px] rounded-full bg-[var(--color-teal)]/25 blur-[100px]" />
				{/* Teal ambient glow — top-right */}
				<div className="absolute -right-32 top-20 h-[350px] w-[350px] rounded-full bg-[var(--color-teal)]/15 blur-[100px]" />
			</div>

			<Container>
				<div key={slide.id} className="max-w-3xl py-16 animate-[reveal-up_0.6s_ease-out_both]">
					<div className="reveal flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
						<span className="inline-block h-px w-8 bg-[var(--color-teal)]" />
						{slide.overline[contentLocale]}
					</div>

					<h1 className={`reveal mt-6 font-display font-bold tracking-display text-white text-[clamp(1.9rem,4.2vw,3.2rem)] ${isAr ? "leading-[1.35]" : "leading-[1.1]"}`}>
						{slide.titleLine1[contentLocale]}<br />
						<span className="text-[var(--color-gold)] leading-[1.5]">{slide.titleLine2[contentLocale]}</span>
					</h1>

					<p className={`reveal mt-6 max-w-xl border-${isAr ? "r" : "l"}-2 border-[var(--color-teal)]/50 ${isAr ? "pr-4" : "pl-4"} text-[15px] sm:text-[16px] leading-[1.65] text-[var(--color-silver)]`}>
						{slide.description[contentLocale]}
					</p>

					{/* Teal accent line */}
					<div className={`reveal mt-8 h-[2px] w-32 bg-gradient-to-${isAr ? "l" : "r"} from-[var(--color-teal)] via-[var(--color-teal)]/50 to-transparent`} />

					<div className="reveal mt-6 flex flex-col gap-3 sm:flex-row">
						<Button href={localizedHref(slide.primaryCtaHref, locale)} variant="gold" size="md" withArrow>
							{slide.primaryCtaLabel[contentLocale]}
						</Button>
						<Button href={localizedHref(slide.secondaryCtaHref, locale)} variant="outline-teal" size="md" withArrow>
							{slide.secondaryCtaLabel[contentLocale]}
						</Button>
					</div>
				</div>
			</Container>

			{settings.slides.length > 1 && (
				<div className={`absolute bottom-8 z-20 flex items-center gap-2 ${isAr ? "left-6 sm:left-10" : "right-6 sm:right-10"}`}>
					<button
						type="button"
						onClick={showPreviousSlide}
						aria-label={isAr ? "الشريحة السابقة" : "Previous slide"}
						className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[var(--color-navy-dark)]/45 text-white backdrop-blur-sm transition hover:border-[var(--color-gold)] hover:bg-[var(--color-navy-dark)]/75 hover:text-[var(--color-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
					>
						<ChevronLeft className={`h-5 w-5 ${isAr ? "rotate-180" : ""}`} />
					</button>
					<span className="min-w-14 text-center text-xs font-semibold tabular-nums text-white/80" aria-live="polite">
						{activeSlide + 1} / {settings.slides.length}
					</span>
					<button
						type="button"
						onClick={showNextSlide}
						aria-label={isAr ? "الشريحة التالية" : "Next slide"}
						className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[var(--color-navy-dark)]/45 text-white backdrop-blur-sm transition hover:border-[var(--color-gold)] hover:bg-[var(--color-navy-dark)]/75 hover:text-[var(--color-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
					>
						<ChevronRight className={`h-5 w-5 ${isAr ? "rotate-180" : ""}`} />
					</button>
				</div>
			)}
		</section>
	);
}
