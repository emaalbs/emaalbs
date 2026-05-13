"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";

function useCountUp(target: number, start: boolean, duration = 1600) {
	const [n, setN] = useState(0);
	useEffect(() => {
		if (!start) return;
		let raf = 0;
		const t0 = performance.now();
		const tick = (t: number) => {
			const p = Math.min(1, (t - t0) / duration);
			const eased = 1 - Math.pow(1 - p, 3);
			setN(Math.round(target * eased));
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [target, start, duration]);
	return n;
}

function StatItem({
	value,
	suffix,
	label,
	note,
	start,
	index,
}: {
	value: number;
	suffix: string;
	label: string;
	note: string;
	start: boolean;
	index: number;
}) {
	const n = useCountUp(value, start);
	return (
		<div className="group relative px-6 py-8 transition-colors hover:bg-white/[0.02] sm:px-8">
			{/* Index marker */}
			<div className="flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.22em] text-white/35">
				<span className="font-numeric">0{index + 1}</span>
				<span className="h-px w-6 bg-[var(--color-teal)]/60" />
			</div>

			{/* Big number */}
			<div
				className="mt-5 font-numeric text-[clamp(3rem,6vw,5rem)] font-bold leading-[0.95] tracking-tight bg-gradient-to-br from-[#FFE082] via-[var(--color-gold)] to-[var(--color-gold-deep)] bg-clip-text text-transparent"
				style={{ WebkitTextFillColor: "transparent" }}
			>
				{n}
				<span className="text-[var(--color-gold)]">{suffix}</span>
			</div>

			{/* Label + note */}
			<div className="mt-5 text-[13px] font-semibold text-white">{label}</div>
			<div className="mt-1 text-[12px] text-white/50">{note}</div>
		</div>
	);
}

export function HomeStatsBar() {
	const { t, locale } = useI18n();
	const isAr = locale === "ar";
	const ref = useRef<HTMLDivElement | null>(null);
	const [start, setStart] = useState(false);

	useEffect(() => {
		if (!ref.current) return;
		const obs = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						setStart(true);
						obs.disconnect();
					}
				});
			},
			{ threshold: 0.3 },
		);
		obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);

	return (
		<section
			ref={ref}
			className="relative isolate overflow-hidden bg-gradient-to-br from-[var(--color-navy-dark)] via-[var(--color-navy)] to-[var(--color-navy-dark)] py-20 lg:py-24"
		>
			{/* Decorative glows */}
			<div className="absolute inset-0 -z-10 opacity-50">
				<div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-gold)]/12 blur-3xl" />
				<div className="absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-[var(--color-teal)]/25 blur-3xl" />
				<div className="absolute left-0 bottom-0 h-[300px] w-[400px] rounded-full bg-[var(--color-teal)]/12 blur-3xl" />
			</div>

			{/* Subtle grid pattern */}
			<div
				className="absolute inset-0 -z-10 opacity-[0.04]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>

			<Container>
				{/* Heading */}
				<div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
					<div className="max-w-2xl">
						<div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
							<span className="inline-block h-px w-8 bg-[var(--color-gold)]" />
							{t.statsBar.overline}
						</div>
						<h2 className={`mt-4 font-display font-bold tracking-display text-white text-[clamp(1.65rem,3vw,2.5rem)] ${isAr ? "leading-[1.4]" : "leading-[1.1]"}`}>
							{t.statsBar.title[0]}{" "}
							<span className="italic font-medium text-white/60">{t.statsBar.title[1]}</span>{t.statsBar.title[2]}
						</h2>
					</div>
					<div className="text-[12px] uppercase tracking-[0.2em] text-white/40">
						{t.statsBar.asOf}
					</div>
				</div>

				{/* Stats — connected grid with hairline dividers */}
				<div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
					<div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 sm:[&>*:nth-child(-n+2)]:border-b sm:[&>*:nth-child(-n+2)]:border-white/10 sm:[&>*:nth-child(odd)]:border-r sm:[&>*:nth-child(odd)]:border-white/10 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:[&>*:nth-child(-n+2)]:border-b-0 lg:[&>*:nth-child(odd)]:border-r-0">
						{t.statsBar.stats.map((s, i) => (
							<StatItem key={s.label} {...s} start={start} index={i} />
						))}
					</div>
				</div>
			</Container>
		</section>
	);
}
