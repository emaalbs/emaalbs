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

const BEYOND_ICONS: LucideIcon[] = [UsersRound, Handshake, Megaphone, Rocket];

export function BeyondASummit() {
	const { locale } = useI18n();
	const beyond = ibsOverview.beyond;
	return (
		<section className="bg-white py-24 lg:py-28">
			<Container>
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="font-display font-bold tracking-display text-[var(--color-ink)] text-[clamp(1.65rem,3vw,2.6rem)] leading-[1.15]">
						{beyond.title[locale]}
					</h2>
					<p className="mt-5 text-[15px] leading-[1.7] text-[var(--color-slate)]">
						{beyond.description[locale]}
					</p>
				</div>
				<ul className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
					{beyond.items.map((item, i) => {
						const Icon = BEYOND_ICONS[i] ?? Rocket;
						return (
							<li
								key={i}
								className="group flex items-start gap-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-warm)] p-5 transition-all hover:border-[var(--color-navy)] hover:shadow-[0_12px_32px_rgba(1,51,77,0.10)]"
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
			</Container>
		</section>
	);
}
