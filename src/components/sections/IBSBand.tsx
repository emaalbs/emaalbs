import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PlayIcon } from "@/components/ui/icons";

const STATS = [
	{ value: "XX+", label: "Companies" },
	{ value: "XX+", label: "Gov Entities" },
	{ value: "XX+", label: "Partnerships" },
];

export function IBSBand() {
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
							Flagship Platform
						</div>
						<h2 className="mt-4 font-display font-bold tracking-display text-white text-[clamp(1.65rem,2.8vw,2.5rem)] leading-[1.15]">
							Iraq Business Summit —
							<br />
							<span className="text-[var(--color-gold)]">a platform for business.</span>
						</h2>
						<p className="mt-5 max-w-lg text-[15px] leading-[1.65] text-[var(--color-silver)]">
							IBS brings together government decision-makers, investors, and private sector leaders
							to unlock real opportunities across Iraq's key sectors.
						</p>

						<div className="mt-8 flex items-center divide-x divide-white/10 rounded-xl border border-white/10 border-t-[var(--color-teal)]/50 bg-white/[0.03] backdrop-blur-sm">
							{STATS.map((s) => (
								<div key={s.label} className="flex-1 px-5 py-4">
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
							<Button href="#contact" variant="gold" withArrow>
								Become a Partner
							</Button>
							<Button href="#contact" variant="teal" withArrow>
								Register Interest
							</Button>
						</div>
					</div>

					<div className="lg:col-span-6">
						<div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--color-teal)]/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
							<Image
								src="/images/ibs-feature.jpg"
								alt="Iraq Business Summit — keynote stage"
								fill
								sizes="(min-width: 1024px) 50vw, 100vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.85)] via-transparent to-transparent" />
							<button
								type="button"
								className="absolute inset-0 grid place-items-center"
								aria-label="Play summit highlights"
							>
								<span className="relative grid h-16 w-16 place-items-center rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] shadow-[0_8px_30px_rgba(238,193,59,0.5)] transition-transform hover:scale-110">
									<span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-gold)] opacity-30" />
									<PlayIcon className="relative h-6 w-6" />
								</span>
							</button>
							<div className="absolute inset-x-0 bottom-0 p-5">
								<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
									IBS 2025 · Baghdad
								</div>
								<div className="mt-1 text-white text-base font-semibold">
									The largest economic summit of its kind in Iraq
								</div>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
