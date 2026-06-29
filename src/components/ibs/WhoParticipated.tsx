"use client";

import { useState } from "react";
import Image from "next/image";
import { Briefcase, Building2, Globe2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";

const ICONS: LucideIcon[] = [Building2, Briefcase, Globe2];
const IMAGES = [
	"/images/about-meeting.webp",
	"/images/panel-discussion.webp",
	"/images/venture-tech.webp",
];

export function WhoParticipated() {
	const { locale } = useI18n();
	const who = ibsOverview.who;
	const [active, setActive] = useState(0);
	const group = who.groups[active];

	return (
		<section className="relative bg-white py-24 lg:py-28">
			<Container>
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 lg:items-start">
					{/* Left: heading + selectable list */}
					<div className="lg:col-span-5 lg:sticky lg:top-28">
						<h2 className="font-display font-bold tracking-display text-[var(--color-ink)] text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
							{who.title[locale]}
						</h2>
						<p className="mt-5 max-w-md text-[15px] leading-[1.7] text-[var(--color-slate)]">
							{who.description[locale]}
						</p>

						<div className="mt-9 space-y-2">
							{who.groups.map((g, i) => {
								const Icon = ICONS[i] ?? Briefcase;
								const isActive = i === active;
								return (
									<button
										key={i}
										type="button"
										onMouseEnter={() => setActive(i)}
										onFocus={() => setActive(i)}
										onClick={() => setActive(i)}
										className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-start transition-all ${
											isActive
												? "border-[var(--color-navy)] bg-[var(--color-warm)] shadow-[0_10px_28px_rgba(1,51,77,0.08)]"
												: "border-[var(--color-line)] bg-white hover:border-[var(--color-navy)]/40"
										}`}
									>
										<span
											className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg transition-colors ${
												isActive
													? "bg-[var(--color-navy)] text-[var(--color-gold)]"
													: "bg-[var(--color-warm)] text-[var(--color-navy)]"
											}`}
										>
											<Icon className="h-5 w-5" strokeWidth={2.25} />
										</span>
										<span className="flex-1">
											<span className="mt-0.5 block font-display text-[15.5px] font-semibold text-[var(--color-ink)]">
												{g.title[locale]}
											</span>
										</span>
										<span
											className={`h-6 w-1 rounded-full transition-all ${
												isActive
													? "bg-[var(--color-gold)]"
													: "bg-transparent group-hover:bg-[var(--color-line)]"
											}`}
										/>
									</button>
								);
							})}
						</div>
					</div>

					{/* Right: details panel with image */}
					<div className="lg:col-span-7">
						<div className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-warm)] shadow-[0_24px_60px_rgba(1,51,77,0.08)]">
							{/* Hero image */}
							<div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-navy)]">
								<Image
									src={IMAGES[active]}
									alt=""
									fill
									sizes="(min-width: 1024px) 58vw, 100vw"
									className="object-cover transition-all duration-700"
									key={active}
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.85)] via-[rgba(1,30,47,0.25)] to-transparent" />
									<div className="absolute inset-x-0 bottom-0 p-6" aria-hidden="true" />
							</div>

							{/* List */}
							<div className="p-7 sm:p-9">
								<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
									{group.items.map((item, j) => (
										<li
											key={j}
											className="rounded-lg border border-[var(--color-line)] bg-white p-4 text-[14px] leading-[1.55] text-[var(--color-ink)]"
										>
											{item[locale]}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}