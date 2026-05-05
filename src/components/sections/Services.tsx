"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";

type Service = {
	tag: string;
	title: string;
	desc: string;
	img: string;
};

const SERVICES: Service[] = [
	{
		tag: "Build",
		title: "Venture Building & Growth",
		desc: "Building and scaling businesses — from ground-up launches to growth playbooks for established companies.",
		img: "/images/group-tech.jpg",
	},
	{
		tag: "Invest",
		title: "Investment & Acceleration",
		desc: "Capital, growth strategy, and market positioning that compound returns over time.",
		img: "/images/highlight-1.jpg",
	},
	{
		tag: "Connect",
		title: "Government & Market Access",
		desc: "Direct connections to the institutions and regulators that move sectors — opening doors that matter.",
		img: "/images/ibs-feature.jpg",
	},
	{
		tag: "Convene",
		title: "International Engagement",
		desc: "Participation in global and regional conferences, plus Iraq's flagship business summits — by EMAAL.",
		img: "/images/hero-summit.jpg",
	},
	{
		tag: "Support",
		title: "Strategic Business Services",
		desc: "Branding, PR, training, research, and operations — full-stack support for sustained business growth.",
		img: "/images/highlight-2.jpg",
	},
];

export function Services() {
	const [active, setActive] = useState(0);
	return (
		<section
			id="services"
			className="relative isolate overflow-hidden bg-[var(--color-navy)] py-20 lg:py-28"
		>
			{/* Decorative glows */}
			<div className="absolute inset-0 -z-10 opacity-50">
				<div className="absolute -left-40 top-10 h-[550px] w-[550px] rounded-full bg-[var(--color-teal)]/25 blur-3xl" />
				<div className="absolute left-1/2 bottom-20 h-[400px] w-[400px] rounded-full bg-[var(--color-teal)]/10 blur-3xl" />
				<div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)]/10 blur-3xl" />
			</div>

			<Container>
				{/* Heading */}
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-xl">
						<div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
							<span className="inline-block h-px w-8 bg-[var(--color-gold)]" />
							What We Do
						</div>
						<h2 className="mt-4 font-display font-bold tracking-display text-white text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.05]">
							Five capabilities.
							<br />
							<span className="text-[var(--color-gold)]">One platform.</span>
						</h2>
					</div>
					<div className="text-[12px] uppercase tracking-[0.2em] text-white/50">
						Hover to explore
					</div>
				</div>

				{/* Two-column: list left, image preview right */}
				<div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
					{/* List */}
					<ol className="lg:col-span-7">
						{SERVICES.map((s, i) => {
							const isActive = active === i;
							return (
								<li
									key={s.title}
									onMouseEnter={() => setActive(i)}
									className={`group relative cursor-pointer border-t border-white/10 py-7 transition-all ${
										i === SERVICES.length - 1 ? "border-b" : ""
									}`}
								>
									{/* Hover/active gold strip */}
									<span
										className={`absolute left-0 top-0 h-px bg-[var(--color-teal)] transition-all duration-500 ${
											isActive ? "w-full" : "w-0"
										}`}
									/>
									<div className="flex items-start gap-6 sm:gap-10">
										<div className="font-numeric text-[13px] font-bold tracking-wider text-white/40 pt-2">
											0{i + 1}
										</div>
										<div className="min-w-0 flex-1">
											<div className="flex items-baseline gap-3">
												<div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-teal)]">
													{s.tag}
												</div>
											</div>
											<h3
												className={`mt-2 font-display font-semibold leading-tight transition-colors text-[clamp(1.35rem,2.4vw,2rem)] ${
													isActive ? "text-[var(--color-gold)]" : "text-white"
												}`}
											>
												{s.title}
											</h3>
											<p
												className={`mt-3 max-w-lg text-[14px] leading-[1.65] transition-colors ${
													isActive ? "text-white/85" : "text-white/55"
												}`}
											>
												{s.desc}
											</p>
										</div>
										<div
											className={`hidden shrink-0 self-center text-white transition-all sm:block ${
												isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-30"
											}`}
										>
											<ArrowRightIcon className="h-5 w-5" />
										</div>
									</div>
								</li>
							);
						})}
					</ol>

					{/* Image preview — vertically centered */}
					<div className="lg:col-span-5">
						<div>
							<div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
								{SERVICES.map((s, i) => (
									<Image
										key={s.title}
										src={s.img}
										alt=""
										fill
										sizes="(min-width: 1024px) 40vw, 100vw"
										className={`object-cover transition-opacity duration-500 ${
											active === i ? "opacity-100" : "opacity-0"
										}`}
									/>
								))}
								<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.9)] via-transparent to-transparent" />
								<div className="absolute inset-x-0 bottom-0 p-6">
									<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
										{SERVICES[active].tag}
									</div>
									<div className="mt-2 font-display text-xl font-semibold text-white">
										{SERVICES[active].title}
									</div>
								</div>
							</div>

							<a
								href="#contact"
								className="group mt-5 flex items-center justify-between gap-4 rounded-xl border border-[var(--color-teal)]/30 bg-[var(--color-teal)]/[0.06] p-5 transition-colors duration-300 hover:border-[var(--color-teal)]/60 hover:bg-[var(--color-teal)]/[0.12]"
							>
								<div>
									<div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-teal)]">
										Ready to start?
									</div>
									<div className="mt-1 font-display text-[17px] font-semibold text-white">
										Talk to our team
									</div>
								</div>
								<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-teal)] text-white transition-transform duration-300 group-hover:translate-x-1">
									<ArrowRightIcon className="h-4 w-4" />
								</span>
							</a>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
