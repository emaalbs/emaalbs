"use client";

import { useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PlayIcon, PauseIcon, VolumeIcon, VolumeOffIcon } from "@/components/ui/icons";
import { useI18n } from "@/i18n/provider";

export function HomeIbsBand() {
	const { t, locale } = useI18n();
	const isAr = locale === "ar";
	const videoRef = useRef<HTMLVideoElement>(null);
	const [playing, setPlaying] = useState(false);
	const [muted, setMuted] = useState(true);

	const togglePlay = () => {
		const v = videoRef.current;
		if (!v) return;
		if (v.paused) {
			v.play();
			setPlaying(true);
		} else {
			v.pause();
			setPlaying(false);
		}
	};

	const handleEnded = () => setPlaying(false);
	const handlePause = () => setPlaying(false);
	const handlePlay = () => setPlaying(true);

	const toggleMute = () => {
		setMuted((m) => !m);
	};

	return (
		<section
			id="ibs"
			className="relative isolate overflow-hidden bg-[var(--color-navy)] py-20 lg:py-28"
		>
			<div className="absolute inset-0 -z-10 opacity-60">
				<div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[var(--color-teal)]/25 blur-3xl" />
				<div className="absolute right-1/4 top-0 h-[350px] w-[350px] rounded-full bg-[var(--color-teal)]/12 blur-3xl" />
				<div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)]/10 blur-3xl" />
			</div>

			<Container>
				<div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
					<div className="lg:col-span-6">
						<div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
							<span className="inline-block h-px w-8 bg-[var(--color-gold)]" />
							{t.ibsBand.overline}
						</div>
						<h2 className={`mt-4 font-display font-bold tracking-display text-white text-[clamp(1.65rem,2.8vw,2.5rem)] ${isAr ? "leading-[1.4]" : "leading-[1.15]"}`}>
							{t.ibsBand.title[0]}
							<br />
							<span className="text-[var(--color-gold)]">{t.ibsBand.title[1]}</span>
						</h2>
						<p className="mt-5 max-w-lg text-[15px] leading-[1.65] text-[var(--color-silver)]">
							{t.ibsBand.description}
						</p>

						<div className="mt-8 grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-white/10 rounded-xl border border-white/10 border-t-[var(--color-teal)]/50 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
							{t.ibsBand.stats.map((s) => (
								<div key={s.label} className="px-5 py-4">
									<div className="font-numeric text-2xl font-bold text-[var(--color-gold)] leading-none">
										{s.value}
									</div>
									<div className="mt-1.5 text-[11px] uppercase tracking-wider text-white/60">
										{s.label}
									</div>
								</div>
							))}
						</div>

						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Button href={`/${locale}/contact?subject=partner`} variant="gold" withArrow>
								{t.ibsBand.ctaPrimary}
							</Button>
							<Button href={`/${locale}/contact?subject=interest`} variant="teal" withArrow>
								{t.ibsBand.ctaSecondary}
							</Button>
						</div>
					</div>

					<div className="lg:col-span-6">
						<div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-[var(--color-teal)]/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
							<video
								ref={videoRef}
								src={`/videos/${isAr ? "ibs-ar" : "ibs-en"}.mp4`}
								muted={muted}
								loop
								playsInline
								preload="metadata"
								className="absolute inset-0 h-full w-full object-cover"
								onEnded={handleEnded}
								onPause={handlePause}
								onPlay={handlePlay}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.85)] via-transparent to-transparent" />
							<button
								type="button"
								onClick={togglePlay}
								className={`absolute inset-0 grid place-items-center transition-opacity duration-300 ${playing ? "opacity-0 hover:opacity-100" : "opacity-100"}`}
								aria-label={t.ibsBand.playLabel}
							>
								<span className="relative grid h-16 w-16 place-items-center rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] shadow-[0_8px_30px_rgba(238,193,59,0.5)] transition-transform hover:scale-110">
									<span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-gold)] opacity-30" />
									{playing ? (
										<PauseIcon className="relative h-6 w-6" />
									) : (
										<PlayIcon className="relative h-6 w-6" />
									)}
								</span>
							</button>
							<button
								type="button"
								onClick={toggleMute}
								className="absolute bottom-3 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
								aria-label={muted ? "Unmute" : "Mute"}
							>
								{muted ? (
									<VolumeOffIcon className="h-4 w-4" />
								) : (
									<VolumeIcon className="h-4 w-4" />
								)}
							</button>
							<div className="absolute inset-x-0 bottom-0 p-5">
								<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
									{t.ibsBand.featureOverline}
								</div>
								<div className="mt-1 text-white text-base font-semibold">
									{t.ibsBand.featureTitle}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
