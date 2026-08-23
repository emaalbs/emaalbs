"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";
import type { HeroSlide } from "@/data/hero-slides";

const AUTOPLAY_DELAY = 6500;

const HERO_IMAGES = [
	{ src: "/images/hero-summit.webp", position: "center" },
	{ src: "/images/keynote-speech.webp", position: "center 42%" },
	{ src: "/images/panel-discussion.webp", position: "center 45%" },
] as const;

export function HomeHero({ slides: databaseSlides = [] }: { slides?: HeroSlide[] }) {
	const { t, locale } = useI18n();
	const isAr = locale === "ar";
	const slides = databaseSlides.length > 0
		? databaseSlides.map((slide) => ({
			key: `database-${slide.id}`,
			overline: slide.overline[locale],
			title: [slide.titleLine1[locale], slide.titleLine2[locale]],
			description: slide.description[locale],
			imageUrl: slide.imageUrl,
			imagePosition: slide.imagePosition,
		}))
		: t.hero.slides.map((slide, index) => ({
			key: `fallback-${index}`,
			...slide,
			imageUrl: HERO_IMAGES[index]?.src ?? HERO_IMAGES[0].src,
			imagePosition: HERO_IMAGES[index]?.position ?? HERO_IMAGES[0].position,
		}));
	const [activeSlide, setActiveSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		if (isPaused || slides.length < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const timer = window.setTimeout(() => {
			setActiveSlide((current) => (current + 1) % slides.length);
		}, AUTOPLAY_DELAY);

		return () => window.clearTimeout(timer);
	}, [activeSlide, isPaused, slides.length]);

	const goToSlide = (index: number) => {
		setActiveSlide((index + slides.length) % slides.length);
	};

	const activeContent = slides[activeSlide];
	const PreviousIcon = isAr ? ChevronRight : ChevronLeft;
	const NextIcon = isAr ? ChevronLeft : ChevronRight;

	return (
		<section
			className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[var(--color-navy-dark)] pt-24"
			aria-roledescription="carousel"
			aria-label={t.hero.carouselLabel}
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
			onFocusCapture={() => setIsPaused(true)}
			onBlurCapture={() => setIsPaused(false)}
		>
			{/* Cross-fading background images */}
			<div className="absolute inset-0 -z-10">
				{slides.map((slide, index) => {
					return (
						<div
							key={slide.key}
							className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${
								activeSlide === index ? "opacity-100" : "opacity-0"
							}`}
							aria-hidden={activeSlide !== index}
						>
							<Image
								src={slide.imageUrl}
								alt=""
								fill
								priority={index === 0}
								sizes="100vw"
								className="object-cover blur-[1px]"
								style={{ objectPosition: slide.imagePosition }}
							/>
						</div>
					);
				})}
				{/* Lighter overlays keep the text readable while revealing more photography. */}
				<div className="absolute inset-0 bg-gradient-to-b from-[rgba(1,30,47,0.58)] via-[rgba(1,51,77,0.42)] to-[rgba(1,30,47,0.72)]" />
				<div
					className={`absolute inset-0 ${
						isAr
							? "bg-gradient-to-l from-[rgba(1,30,47,0.58)] via-[rgba(1,30,47,0.16)] to-transparent"
							: "bg-gradient-to-r from-[rgba(1,30,47,0.58)] via-[rgba(1,30,47,0.16)] to-transparent"
					}`}
				/>
				{/* Teal ambient glow — bottom-left */}
				<div className="absolute -left-20 bottom-0 h-[550px] w-[550px] rounded-full bg-[var(--color-teal)]/15 blur-[100px]" />
				{/* Teal ambient glow — top-right */}
				<div className="absolute -right-32 top-20 h-[350px] w-[350px] rounded-full bg-[var(--color-teal)]/10 blur-[100px]" />
			</div>

			<Container>
				<div
					key={`${locale}-${activeSlide}`}
					className="max-w-3xl py-16"
					aria-label={`${t.hero.slideLabel} ${activeSlide + 1} / ${slides.length}`}
				>
					<div
						className="reveal flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]"
						style={{ animationDelay: "40ms" }}
					>
						<span className="inline-block h-px w-8 bg-[var(--color-teal)]" />
						{activeContent.overline}
					</div>

					<h1
						className={`reveal mt-6 font-display font-bold text-white text-[clamp(1.9rem,4.2vw,3.2rem)] ${
							isAr ? "leading-[1.35] tracking-normal" : "leading-[1.1] tracking-display"
						}`}
						style={{ animationDelay: "120ms" }}
					>
						{activeContent.title[0]}
						<br />
						<span className="text-[var(--color-gold)] leading-[1.5]">{activeContent.title[1]}</span>
					</h1>

					<p
						className="reveal mt-6 max-w-xl border-s-2 border-[var(--color-teal)]/60 ps-4 text-[15px] leading-[1.75] text-white/80 sm:text-[16px]"
						style={{ animationDelay: "200ms" }}
					>
						{activeContent.description}
					</p>

					{/* Teal accent line */}
					<div
						className={`reveal mt-8 h-[2px] w-32 from-[var(--color-teal)] via-[var(--color-teal)]/50 to-transparent ${
							isAr ? "bg-gradient-to-l" : "bg-gradient-to-r"
						}`}
						style={{ animationDelay: "260ms" }}
					/>

					<div
						className="reveal mt-6 flex flex-col gap-3 sm:flex-row"
						style={{ animationDelay: "300ms" }}
					>
						<Button href={`/${locale}/ibs`} variant="gold" size="md" withArrow>
							{t.hero.ctaPrimary}
						</Button>
						<Button href={`/${locale}/contact`} variant="outline-teal" size="md" withArrow>
							{t.hero.ctaSecondary}
						</Button>
					</div>

					{/* Manual navigation restarts the autoplay timer from the chosen slide. */}
					<div
						className="reveal mt-8 flex items-center gap-3"
						style={{ animationDelay: "360ms" }}
					>
						<button
							type="button"
							onClick={() => goToSlide(activeSlide - 1)}
							aria-label={t.hero.previousSlide}
							className="grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-[var(--color-navy-dark)]/35 text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] motion-reduce:transition-none"
						>
							<PreviousIcon className="h-5 w-5" aria-hidden="true" />
						</button>

						<div className="flex items-center gap-2" role="group" aria-label={t.hero.carouselLabel}>
							{slides.map((_, index) => (
								<button
									key={index}
									type="button"
									onClick={() => goToSlide(index)}
									aria-label={`${t.hero.goToSlide} ${index + 1}`}
									aria-current={activeSlide === index ? "true" : undefined}
									className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-navy-dark)] motion-reduce:transition-none ${
										activeSlide === index
											? "w-8 bg-[var(--color-gold)]"
											: "w-2 bg-white/45 hover:bg-white/80"
									}`}
								/>
							))}
						</div>

						<span
							dir="ltr"
							className="min-w-12 font-numeric text-[11px] font-semibold tracking-[0.16em] text-white/65"
							aria-hidden="true"
						>
							{String(activeSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
						</span>

						<button
							type="button"
							onClick={() => goToSlide(activeSlide + 1)}
							aria-label={t.hero.nextSlide}
							className="grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-[var(--color-navy-dark)]/35 text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] motion-reduce:transition-none"
						>
							<NextIcon className="h-5 w-5" aria-hidden="true" />
						</button>
					</div>
				</div>
			</Container>
		</section>
	);
}
