"use client";

import { useState } from "react";
import {
	Briefcase,
	Network,
	Building2,
	Megaphone,
	Cpu,
	Handshake,
	ArrowUpRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Overline";
import { useI18n } from "@/i18n/provider";

const icons = [Briefcase, Network, Building2, Megaphone, Cpu, Handshake];

export function AboutWhatWeDo() {
	const { locale, t } = useI18n();
	const isAr = locale === "ar";
	const [active, setActive] = useState(0);

	return (
		<section className="relative overflow-hidden bg-[var(--color-warm)] py-24 lg:py-32">
			{/* decorative shapes */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.35]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 1px 1px, rgba(1,51,77,0.08) 1px, transparent 0)",
					backgroundSize: "28px 28px",
				}}
			/>
			<div className="pointer-events-none absolute -right-20 top-20 h-[320px] w-[320px] rounded-full bg-[var(--color-gold)]/10 blur-[120px]" />
			<div className="pointer-events-none absolute -left-20 bottom-10 h-[320px] w-[320px] rounded-full bg-[var(--color-teal)]/10 blur-[120px]" />

			<Container>
				<SectionHeading
					align={isAr ? "left" : "left"}
					overline={t.aboutp.whatWeDoLabel}
					title={
						<>
							{t.aboutp.whatWeDoTitle1}
							<br />
							<span className="text-[var(--color-gold-deep)]">
								{t.aboutp.whatWeDoTitle2}
							</span>
						</>
					}
					subtitle={t.aboutp.whatWeDoText}
				/>

				<div className="relative mt-12 divide-y divide-[var(--color-line)] overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white/60 backdrop-blur-sm">
					{t.aboutp.whatWeDoCards.map((item, i) => {
						const Icon = icons[i % icons.length];
						const isActive = active === i;
						const num = String(i + 1).padStart(2, "0");

						return (
							<button
								key={item}
								type="button"
								onClick={() => setActive(isActive ? -1 : i)}
								aria-expanded={isActive}
								className={`group relative flex w-full items-center gap-5 px-5 py-4 text-start transition-colors duration-300 sm:gap-6 sm:px-7 sm:py-5 ${
									isActive
										? "bg-[var(--color-gold-tint)]"
										: "bg-transparent hover:bg-[var(--color-gold-tint)]/40"
								}`}
							>
								{/* Title + (active) description — at the start (right in RTL, left in LTR) */}
								<div className={`min-w-0 flex-1 ${isAr ? "text-right" : "text-left"}`}>
									<h3
										className={`truncate font-display text-base font-bold leading-tight transition-colors duration-300 sm:text-lg ${
											isActive
												? "text-[var(--color-navy)]"
												: "text-[var(--color-navy)]/85 group-hover:text-[var(--color-navy)]"
										}`}
									>
										{item}
									</h3>

									<div
										className={`grid overflow-hidden transition-all duration-500 ease-out ${
											isActive
												? "mt-2 grid-rows-[1fr] opacity-100"
												: "grid-rows-[0fr] opacity-0"
										}`}
									>
										<p className="min-h-0 text-[13px] leading-[1.7] text-[var(--color-slate)]">
											{t.aboutp.whatWeDoDescription}
										</p>
									</div>
								</div>

								{/* Icon */}
								<span
									className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
										isActive
											? "bg-white text-[var(--color-gold-deep)] shadow-[0_4px_12px_-2px_rgba(171,130,11,0.35)]"
											: "bg-[var(--color-warm)] text-[var(--color-slate)] group-hover:bg-white group-hover:text-[var(--color-gold-deep)]"
									}`}
								>
									<Icon size={18} />
								</span>

								{/* Number */}
								<span
									className={`font-numeric shrink-0 text-xs font-bold tracking-widest tabular-nums transition-colors duration-300 ${
										isActive
											? "text-[var(--color-gold-deep)]"
											: "text-[var(--color-slate)]/60"
									}`}
								>
									{num}
								</span>

								{/* Arrow (at the end) */}
								<span
									className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
										isActive
											? "bg-[var(--color-gold-deep)] text-white"
											: "bg-transparent text-[var(--color-slate)] group-hover:bg-white group-hover:text-[var(--color-navy)]"
									}`}
								>
									<ArrowUpRight
										size={16}
										className={`transition-transform duration-300 ${
											isAr ? "-scale-x-100" : ""
										} ${
											isActive
												? "rotate-0"
												: "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
										}`}
									/>
								</span>
							</button>
						);
					})}
				</div>
			</Container>
		</section>
	);
}
