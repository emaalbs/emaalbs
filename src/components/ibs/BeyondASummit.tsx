"use client";

import {
	CheckCircle2,
	Handshake,
	Megaphone,
	Rocket,
	UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import { IbsSectionHeading } from "./IbsSectionHeading";

const BEYOND_ICONS: LucideIcon[] = [UsersRound, Handshake, Megaphone, Rocket];

export function BeyondASummit() {
	const { locale } = useI18n();
	const beyond = ibsOverview.beyond;
	const enables = ibsOverview.enables;
	return (
		<section className="bg-[var(--color-warm)] py-24 lg:py-28">
			<Container>
				<div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
					<div>
						<IbsSectionHeading
							overline={beyond.overline[locale]}
							title={beyond.title[locale]}
							description={beyond.description[locale]}
						/>
						<ul className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
							{beyond.items.map((item, i) => {
								const Icon = BEYOND_ICONS[i] ?? Rocket;
								return (
									<li
										key={i}
										className="group flex items-start gap-4 rounded-xl border border-[var(--color-line)] bg-white p-5 transition-all hover:border-[var(--color-navy)] hover:shadow-[0_12px_32px_rgba(1,51,77,0.10)]"
									>
										<div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-teal)] to-[#005252] text-white">
											<Icon className="h-4.5 w-4.5" strokeWidth={2.25} />
										</div>
										<span className="flex-1 text-[14px] font-medium leading-[1.5] text-[var(--color-ink)]">
											{item[locale]}
										</span>
									</li>
								);
							})}
						</ul>
					</div>
					<div>
						<IbsSectionHeading
							overline={enables.overline[locale]}
							title={enables.title[locale]}
						/>
						<ul className="mt-9 space-y-3">
							{enables.items.map((item, i) => (
								<li
									key={i}
									className="flex items-start gap-3 rounded-xl border border-[var(--color-line)] bg-white p-5 text-[14.5px] leading-[1.55] text-[var(--color-ink)]"
								>
									<CheckCircle2
										className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-gold-deep)]"
										strokeWidth={2}
									/>
									<span>{item[locale]}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</Container>
		</section>
	);
}
